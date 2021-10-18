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
const Benchmarker_1 = require("./Benchmarker");
const Client_1 = require("./Client");
const es6_promise_pool_1 = require("es6-promise-pool");
const string_1 = require("../utils/string");
const sleep_1 = require("../utils/sleep");
class TestRunner {
    constructor(concurrency = 10, time = 60000, generator, flush_function, flush_interval = 5000) {
        this.run_id = (0, string_1.generate_random_id)();
        this.concurrency = concurrency;
        this.time = time;
        this.generator = generator;
        this.flush_function = flush_function;
        this.flush_interval = flush_interval;
        this.benchmarker = new Benchmarker_1.default(this.run_id);
        this.client = new Client_1.default(this.benchmarker);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            promises.push(this.benchmarker.start(this.flush_function, this.flush_interval));
            const start_time = Date.now();
            const producer = () => {
                if (Date.now() - this.time < start_time) {
                    return this.generator(this.client);
                }
                return null;
            };
            const pool = new es6_promise_pool_1.default(producer, this.concurrency);
            promises.push(pool.start());
            yield (0, sleep_1.sleep)(this.time + Math.max(this.flush_interval || 5000, 1000));
            yield this.benchmarker.stop();
            yield Promise.all(promises);
        });
    }
}
exports.default = TestRunner;
