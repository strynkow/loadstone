import { sleep } from "../utils/sleep";

export interface Benchmark {
  run_id: string;
  name: string;
  start_time: number;
  end_time: number;
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

  async benchmark(name: string, funct: Function) {
    const start_time = Date.now();
    const result = await funct();
    const end_time = Date.now();

    this.queue.push({
      run_id: this.run_id,
      name,
      start_time,
      end_time,
    });

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
