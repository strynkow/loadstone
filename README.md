Shalom, friends, and welcome to loadstone, your latest OrangeSeven7 project.

Basically, I was looking for load testing software for work, and I couldn't help but notice that all of the js offerings were pretty attrocious. So, I figured I'd build my own, and a few short hours later (haven't added graphing as of writing this), here we are.

This library should be ludicrously simple to use. Classic example would be:

```
import LoadStone, { Benchmark, Client } from '../src';

async function run_test() {
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
}
```

At this point, running:

```
run_test();
```

would kick off a 60 second load test creating workers (with at most 10 simultaneous workers) that each spend 30 seconds hitting google, yahoo, and duckduckgo.

At the end of the load test, the request_benchmark_queue would consist of (60000 * 10 * 3 / 30000 =) 60 request benchmarks akin to the following:

```
[
  {
    "run_id": "UelDUdntlpQ0nFGVeuzd",
    "name": "duckduckgo",
    "start_time": 1634948778523,
    "end_time": 1634948778674,
    "error": false,
    "error_message": ""
  },
  ...
]
```

and the user_benchmark_queue would consist of an array of (60000 * 10 / 30000 =) 20 user benchmarks akin to the following:

```
[
  {
    "run_id": "UelDUdntlpQ0nFGVeuzd",
    "name": "1634948768486-Sz7bUm09UZOzgxnSazvq",
    "start_time": 1634948768486,
    "end_time": 1634948800266,
    "error": false,
    "error_message": ""
  },
  ...
]
```

Notes:

1) The time input refers to the interval over which you want users to begin the load test. Users will continue through the load test after this until they finish.
2) The name of requests is specified by the end user, so that you can track the times of each request type. It should likely be unique by endpoint/method, at the very least. The users are automatically assigned a name, where the first half is the timestamp at which they were created, and the second half is random to prevent conflicts. This is because I picture the user names to be untracked as individuals, and only in the aggregate of the run_id. If you have a use case that doesn't follow this, my email is cjs343@cornell.edu.