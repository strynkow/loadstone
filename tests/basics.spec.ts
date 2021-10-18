import LoadStone, { Benchmark, Client } from '../src';

import { sleep } from '../src/utils/sleep';

describe('loadstone', () => {
  it('handles booleans', async () => {
    expect(true).toEqual(true);
  });

  it('basics', async () => {
    const queue: Benchmark[] = [];

    const generator = (client: Client) => {
      const funct = async () => {
        await sleep(10000);
        const rand = Math.floor(Math.random() * 3.0);
        if (rand === 0) {
          return client.get('duckduckgo', 'https://duckduckgo.com');
        }
        if (rand === 1) {
          return client.get('yahoo', 'https://yahoo.com');
        }
        return client.get('google', 'https://google.com');
      };

      return funct();
    }

    const flush_function = (data: Benchmark[]) => {
      queue.push(...data);
    }

    const load_stone = new LoadStone(
      10,
      60000,
      generator,
      flush_function,
      5000,
    );
    await load_stone.start();
    console.log(`queue: ${JSON.stringify(queue, null, 2)}`);
    expect(queue.length).toBeGreaterThanOrEqual(50);
    expect(queue.length).toBeLessThanOrEqual(70);
  }, 100000);
});
