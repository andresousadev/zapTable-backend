import { BusinessModule } from '@app/domain/business/business.module';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [BusinessModule],
  providers: [],
  exports: [BusinessModule],
})
export class CommonModule {}
