import axios, { AxiosRequestConfig } from 'axios';

import Benchmarker from './Benchmarker';

class Client {
  benchmarker: Benchmarker;

  constructor(benchmarker: Benchmarker) {
    this.benchmarker = benchmarker;
  }

  async get(name: string, url: string, config?: AxiosRequestConfig) {
    return this.benchmarker.benchmark(
      name,
      async () => axios.get(url, config),
    )
  }

  async delete(name: string, url: string, config?: AxiosRequestConfig) {
    return this.benchmarker.benchmark(
      name,
      async () => axios.delete(url, config),
    )
  }

  async head(name: string, url: string, config?: AxiosRequestConfig) {
    return this.benchmarker.benchmark(
      name,
      async () => axios.head(url, config),
    )
  }

  async options(name: string, url: string, config?: AxiosRequestConfig) {
    return this.benchmarker.benchmark(
      name,
      async () => axios.options(url, config),
    )
  }

  async post(name: string, url: string, data: any, config?: AxiosRequestConfig) {
    return this.benchmarker.benchmark(
      name,
      async () => axios.post(url, data, config),
    )
  }

  async put(name: string, url: string, data: any, config?: AxiosRequestConfig) {
    return this.benchmarker.benchmark(
      name,
      async () => axios.put(url, data, config),
    )
  }

  async patch(name: string, url: string, data: any, config?: AxiosRequestConfig) {
    return this.benchmarker.benchmark(
      name,
      async () => axios.patch(url, data, config),
    )
  }
}

export default Client;
