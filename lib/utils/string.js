"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_random_id = void 0;
const ALPHANUMERICS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generate_random_string(length) {
    const result = [];
    for (var i = 0; i < length; i++) {
        result.push(ALPHANUMERICS.charAt(Math.floor(Math.random() * ALPHANUMERICS.length)));
    }
    return result.join('');
}
function generate_random_id() {
    return generate_random_string(20);
}
exports.generate_random_id = generate_random_id;
