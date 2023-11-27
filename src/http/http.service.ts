import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import proxyConfig from '../config/proxy.config';

@Injectable()
export class HttpServiceWithProxy {
  async makeGetRequest(url: string): Promise<any> {
    const config: AxiosRequestConfig = {
      proxy: proxyConfig,
    };

    try {
      const response = await axios.get(url, config);
      return response.data;
    } catch (error) {
      console.error('Error in HTTP request:', error);
      throw error;
    }
  }
}
