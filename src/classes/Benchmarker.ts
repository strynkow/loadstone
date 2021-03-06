import { sleep } from "../utils/sleep";

export interface Benchmark {
  run_id: string;
  name: string;
  start_time: number;
  end_time: number;
  error: boolean;
  error_message: string;
}

class Benchmarker {
  run_id: string;
  queue: Benchmark[];
  running: boolean;

  constructor(run_id: string) {
    this.run_id = run_id;
    this.queue = [];
    this.running = false;
  }

  async benchmark(name: string, funct: Function): Promise<any> {
    const start_time = Date.now();
    let error = false;
    let error_message = '';
    let result = null;
    try {
      result = await funct();
    } catch (e: any) {
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
  }
  
  async start(flush_function: (data: Benchmark[]) => any, flush_frequency?: number) {
    const frequency = Math.max(flush_frequency || 5000, 1000);
    this.running = true;
    do {
      await sleep(frequency);
      try {
        const data = [];
        while (this.queue.length > 0) {
          data.push(this.queue.pop());
        }
        if (data.length > 0) {
          flush_function(data as unknown as Benchmark[]);
        }
      } catch (e) {
        console.error(`Flush failed with error ${e}`);
      }
    } while (this.running);
  }

  async stop() {
    this.running = false;
  }
  
}

export default Benchmarker;
