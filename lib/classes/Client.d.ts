import { AxiosRequestConfig } from 'axios';
import Benchmarker from './Benchmarker';
declare class Client {
    benchmarker: Benchmarker;
    constructor(benchmarker: Benchmarker);
    get(name: string, url: string, config?: AxiosRequestConfig): Promise<any>;
    delete(name: string, url: string, config?: AxiosRequestConfig): Promise<any>;
    head(name: string, url: string, config?: AxiosRequestConfig): Promise<any>;
    options(name: string, url: string, config?: AxiosRequestConfig): Promise<any>;
    post(name: string, url: string, data: any, config?: AxiosRequestConfig): Promise<any>;
    put(name: string, url: string, data: any, config?: AxiosRequestConfig): Promise<any>;
    patch(name: string, url: string, data: any, config?: AxiosRequestConfig): Promise<any>;
}
export default Client;
