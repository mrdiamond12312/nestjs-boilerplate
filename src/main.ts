import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { middleware as expressCtx } from 'express-ctx';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from '@/app.module';
import { SerializerInterceptor } from '@/interceptors/serializer-interceptor';
import { setupSwagger } from '@/setup-swagger';
import { ApiConfigService } from '@/shared/services/api-config.service';
import { SharedModule } from '@/shared/shared.module';

declare const module: any;

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new SerializerInterceptor(),
  );

  const serviceConfig = app.select(SharedModule).get(ApiConfigService);

  app.setGlobalPrefix(serviceConfig.apiPrefix);

  if (serviceConfig.documentationEnabled) {
    setupSwagger(app);
  }

  app.use(expressCtx);

  await app.listen(serviceConfig.appConfig.port, '0.0.0.0');

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
