import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { RequestLoggerMiddleware } from "../../common/middleware/request-logger.middleware";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes(HealthController);
  }
}
