import Benchmarker, { Benchmark } from './Benchmarker';
import Client from './Client';
declare class TestRunner {
    run_id: string;
    benchmarker: Benchmarker;
    concurrency: number;
    time: number;
    generator: ((client: Client) => (() => Promise<any>));
    flush_function: (data: Benchmark[]) => any;
    flush_interval: number;
    client: Client;
    constructor(concurrency: number | undefined, time: number | undefined, generator: ((client: Client) => (() => Promise<any>)), flush_function: (data: Benchmark[]) => any, flush_interval?: number);
    start(): Promise<void>;
}
export default TestRunner;
