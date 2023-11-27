import { Controller, Get, Query } from '@nestjs/common';
import { HttpServiceWithProxy } from '../services/http.service';

@Controller('http')
export class HttpController {
  constructor(private readonly httpServiceWithProxy: HttpServiceWithProxy) {}

  @Get('proxy-request')
  async proxyRequest(@Query('url') url: string) {
    try {
      const responseData = await this.httpServiceWithProxy.makeGetRequest(url);
      return { data: responseData };
    } catch (error) {
      return { error: error.message };
    }
  }
}
