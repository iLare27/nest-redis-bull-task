import { Module } from '@nestjs/common';
import { HttpServiceWithProxy } from "../services/http.service";
import { HttpController } from "../controllers/http.controller";

@Module({
  imports: [],
  controllers: [HttpController],
  providers: [HttpServiceWithProxy],
  exports: [HttpServiceWithProxy]
})
export class HttpModule {}
