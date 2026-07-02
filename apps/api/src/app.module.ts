import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RequestLoggerMiddleware } from "./common/middleware/request-logger.middleware";
import configuration from "./config/configuration";
import { validationSchema } from "./config/validation";
import { HealthModule } from "./modules/health/health.module";
import { PlacesModule } from "./modules/places/places.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    HealthModule,
    PlacesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes({
      path: "*splat",
      method: RequestMethod.ALL,
    });
  }
}
