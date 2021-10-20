"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sleep_1 = require("../utils/sleep");
class Benchmarker {
    constructor(run_id) {
        this.run_id = run_id;
        this.queue = [];
        this.running = false;
    }
    benchmark(name, funct) {
        return __awaiter(this, void 0, void 0, function* () {
            const start_time = Date.now();
            let error = false;
            let error_message = '';
            let result = null;
            try {
                result = yield funct();
            }
            catch (e) {
                error = true;
                error_message = e.message;
            }
            const end_time = Date.now();
            this.queue.push({
                run_id: this.run_id,
                name,
                start_time,
                end_time,
                error,
                error_message,
            });
            if (error) {
                throw new Error(`${error_message}`);
            }
            return result;
        });
    }
    start(flush_function, flush_frequency) {
        return __awaiter(this, void 0, void 0, function* () {
            const frequency = Math.max(flush_frequency || 5000, 1000);
            this.running = true;
            do {
                yield (0, sleep_1.sleep)(frequency);
                try {
                    const data = [];
                    while (this.queue.length > 0) {
                        data.push(this.queue.pop());
                    }
                    if (data.length > 0) {
                        flush_function(data);
                    }
                }
                catch (e) {
                    console.error(`Flush failed with error ${e}`);
                }
            } while (this.running);
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.running = false;
        });
    }
}
exports.default = Benchmarker;
