import Benchmarker, { Benchmark } from './Benchmarker';

import Client from './Client';
import { generate_random_id } from '../utils/string';
import { sleep } from '../utils/sleep';

const PromisePool = require('es6-promise-pool')

interface Params {
  concurrency?: number,
  time?: number,
  generator: ((client: Client) => Promise<any>),
  benchmarks: {
    request: {
      flush_function: (data: Benchmark[]) => any;
      flush_interval: number;
    },
    user: {
      flush_function: (data: Benchmark[]) => any;
      flush_interval: number;
    }
  },
}

class TestRunner {
  run_id: string;
  concurrency: number;
  time: number;
  generator: ((client: Client) => Promise<any>);
  request_benchmarker: Benchmarker;
  request_benchmark_flush_function?: (data: Benchmark[]) => any;
  request_benchmark_flush_interval?: number;
  user_benchmarker: Benchmarker;
  user_benchmark_flush_function?: (data: Benchmark[]) => any;
  user_benchmark_flush_interval?: number;
  client: Client;

  constructor({
    concurrency,
    time,
    generator,
    benchmarks,
  }: Params) {
    if (!concurrency || concurrency < 0 || typeof concurrency !== 'number') {
      throw new Error('Concurrency must be a number > 0.');
    }
    if (!time || time < 0 || typeof time !== 'number') {
      throw new Error('Time must be a number > 0.');
    }
    if (typeof generator !== 'function') {
      throw new Error('Generator must be a number > 0.');
    }
    this.run_id = generate_random_id();
    this.concurrency = concurrency;
    this.time = time;
    this.generator = generator;

    if (typeof benchmarks?.request?.flush_function === 'function') {
      this.request_benchmark_flush_function = benchmarks.request.flush_function;
      this.request_benchmark_flush_interval = Math.max(benchmarks.request.flush_interval || 0, 1000);
    }

    if (typeof benchmarks?.user?.flush_function === 'function') {
      this.user_benchmark_flush_function = benchmarks.user.flush_function;
      this.user_benchmark_flush_interval = Math.max(benchmarks.user.flush_interval || 0, 1000);
    }

    this.user_benchmarker = new Benchmarker(this.run_id);
    this.request_benchmarker = new Benchmarker(this.run_id);
    this.client = new Client(this.request_benchmarker);
  }

  async start() {
    const promises: Promise<any>[] = [];
    if (typeof this.request_benchmark_flush_function === "function") {
      promises.push(this.request_benchmarker.start(this.request_benchmark_flush_function, this.request_benchmark_flush_interval));
    }
    if (typeof this.user_benchmark_flush_function === "function") {
      promises.push(this.user_benchmarker.start(this.user_benchmark_flush_function, this.user_benchmark_flush_interval));
    }

    const start_time = Date.now();
    const producer = () => {
      const date = Date.now();
      if (date - this.time < start_time) {
        const generated = this.user_benchmarker.benchmark(`${date}-${generate_random_id()}`, async () => this.generator(this.client));
        return generated;
      }
      return null;
    };
    const pool = new PromisePool(producer as unknown as () => void | PromiseLike<unknown>, this.concurrency);

    await pool.start();


    if (typeof this.request_benchmark_flush_function === "function") {
      await this.request_benchmarker.stop();
    }
    if (typeof this.user_benchmark_flush_function === "function") {
      await this.user_benchmarker.stop();
    }

    await Promise.all(promises);
  }
}

export default TestRunner;
