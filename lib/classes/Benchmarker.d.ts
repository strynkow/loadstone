export interface Benchmark {
    run_id: string;
    name: string;
    start_time: number;
    end_time: number;
}
declare class Benchmarker {
    run_id: string;
    queue: Benchmark[];
    running: boolean;
    constructor(run_id: string);
    benchmark(name: string, funct: Function): Promise<any>;
    start(flush_function: (data: Benchmark[]) => any, flush_frequency?: number): Promise<void>;
    stop(): Promise<void>;
}
export default Benchmarker;
