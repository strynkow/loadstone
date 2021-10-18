Shalom, friends, and welcome to loadstone, your latest OrangeSeven7 project.

Basically, I was looking for load testing software for work, and I couldn't help but notice that all of the js offerings were pretty attrocious. So, I figured I'd build my own, and a few short hours later (haven't added graphing as of writing this), here we are.

This library should be ludicrously simple to use. Classic example would be:

import LoadStone, { Benchmark, Client } from '../src';

async function run_test() {
  // Specify what you actually want your user to do (in this case, it just visits google)
  const generator = (client: Client) => {
    const funct = async () => {
      return client.get('google', 'https://google.com');
    };

    return funct();
  }

  // Create and specify a queue in which to store benchmark results
  const queue: Benchmark[] = [];

  const flush_function = (data: Benchmark[]) => {
    queue.push(...data);
  }

  // Create a new loadstone instance
  const load_stone = new LoadStone(
    10, // concurrency (simultaneous users)
    60000, // Length for which to run the users, in ms
    generator, // The user function producer above
    flush_function, // How to flush results. inputs data: Benchmark[] and returns an empty promise
    5000, // flush interval in ms (minimum 1000).
  );

  // Actually start running
  await load_stone.start();

}

At this point, running:

run_test();

would kick off a 60 second load test with 10 simultaneous workers that repeatedly hit google.com for 60 seconds.