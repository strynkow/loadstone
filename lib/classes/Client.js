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
const axios_1 = require("axios");
class Client {
    constructor(benchmarker) {
        this.benchmarker = benchmarker;
    }
    get(name, url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.benchmarker.benchmark(name, () => __awaiter(this, void 0, void 0, function* () { return axios_1.default.get(url, config); }));
        });
    }
    delete(name, url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.benchmarker.benchmark(name, () => __awaiter(this, void 0, void 0, function* () { return axios_1.default.delete(url, config); }));
        });
    }
    head(name, url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.benchmarker.benchmark(name, () => __awaiter(this, void 0, void 0, function* () { return axios_1.default.head(url, config); }));
        });
    }
    options(name, url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.benchmarker.benchmark(name, () => __awaiter(this, void 0, void 0, function* () { return axios_1.default.options(url, config); }));
        });
    }
    post(name, url, data, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.benchmarker.benchmark(name, () => __awaiter(this, void 0, void 0, function* () { return axios_1.default.post(url, data, config); }));
        });
    }
    put(name, url, data, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.benchmarker.benchmark(name, () => __awaiter(this, void 0, void 0, function* () { return axios_1.default.put(url, data, config); }));
        });
    }
    patch(name, url, data, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.benchmarker.benchmark(name, () => __awaiter(this, void 0, void 0, function* () { return axios_1.default.patch(url, data, config); }));
        });
    }
}
exports.default = Client;
