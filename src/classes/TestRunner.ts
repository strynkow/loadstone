import Benchmarker, { Benchmark } from './Benchmarker';

import Client from './Client';
import { generate_random_id } from '../utils/string';
import { sleep } from '../utils/sleep';

const PromisePool = require('es6-promise-pool')

class TestRunner {
  run_id: string;
  benchmarker: Benchmarker;
  concurrency: number;
  time: number;
  generator: ((client: Client) => Promise<any>);
  flush_function: (data: Benchmark[]) => any;
  flush_interval: number;
  client: Client;

  constructor(
    concurrency: number = 10,
    time: number = 60000,
    generator: ((client: Client) => Promise<any>),
    flush_function: (data: Benchmark[]) => any,
    flush_interval: number = 5000,
  ) {
    this.run_id = generate_random_id();
    this.concurrency = concurrency;
    this.time = time;
    this.generator = generator;
    this.flush_function = flush_function;
    this.flush_interval = flush_interval;
    this.benchmarker = new Benchmarker(this.run_id);
    this.client = new Client(this.benchmarker);
  }

  async start() {
    const promises: Promise<any>[] = [];
    promises.push(this.benchmarker.start(this.flush_function, this.flush_interval));


    const start_time = Date.now();
    const producer = () => {
      if (Date.now() - this.time < start_time) {
        const generated = this.generator(this.client);
        return generated;
      }
      return null;
    };
    const pool = new PromisePool(producer as unknown as () => void | PromiseLike<unknown>, this.concurrency);

    console.log(`start: ${Date.now()}`);
    await pool.start();
    console.log(`end: ${Date.now()}`);

    await this.benchmarker.stop();

    await sleep(Math.max(this.flush_interval || 5000, 1000));

    await Promise.all(promises);
  }
}

export default TestRunner;
