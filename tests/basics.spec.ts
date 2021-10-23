import LoadStone, { Benchmark, Client } from '../src';

import { sleep } from '../src/utils/sleep';

describe('loadstone', () => {
  it('handles booleans', async () => {
    expect(true).toEqual(true);
  });

  it('basics', async () => {
    // Create and specify queues in which to store benchmark results
    const request_benchmark_queue: Benchmark[] = [];
    const user_benchmark_queue: Benchmark[] = [];
  
    // Create functions to flush request and user data to the queues
    const request_benchmark_flush_function = (data: Benchmark[]) => {
      request_benchmark_queue.push(...data);
    }
    const user_benchmark_flush_function = (data: Benchmark[]) => {
      user_benchmark_queue.push(...data);
    }
  
    // Specify what you actually want your user to do (in this case, it just visits google)
    const generator = (client: Client) => {
      const funct = async () => {
        await sleep(10000);
        await client.get('duckduckgo', 'https://duckduckgo.com');
        await sleep(10000);
        await client.get('yahoo', 'https://yahoo.com');
        await sleep(10000);
        return client.get('google', 'https://google.com');
      };
  
      return funct();
    }
  
    const load_stone = new LoadStone({
      concurrency: 10, // Concurrency (10 simultaneous users)
      time: 60000, // Length for which to run the users, in ms
      generator, // The user function producer above
      benchmarks: {
        request: {
          flush_function: request_benchmark_flush_function, // How to flush request results. inputs data: Benchmark[] and returns an empty promise
          flush_interval: 5000, // flush interval in ms (minimum 1000).
        },
        user: {
          flush_function: user_benchmark_flush_function, // How to flush user results. inputs data: Benchmark[] and returns an empty promise
          flush_interval: 5000, // flush interval in ms (minimum 1000).
        }
      },
    });
  
    // Actually start running
    await load_stone.start();

    console.log(`queue: ${JSON.stringify(request_benchmark_queue, null, 2)}`);
    expect(request_benchmark_queue.length).toEqual(60);
    console.log(`queue: ${JSON.stringify(user_benchmark_queue, null, 2)}`);
    expect(user_benchmark_queue.length).toEqual(20);
  }, 100000);
});
