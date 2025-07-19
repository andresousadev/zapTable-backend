import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BusinessService } from '../business/services/business.service';
import { Request } from 'express';

@Injectable()
export class BusinessContextGuard implements CanActivate {
  constructor(private readonly businessService: BusinessService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const businessSlug = request.params.businessSlug;

    if (!businessSlug) {
      throw new NotFoundException(
        'Business slug is missing from the URL parameters.',
      );
    }

    const business =
      await this.businessService.getBusinessEntityBySlug(businessSlug);

    request['businessId'] = business.id;
    request['business'] = business;

    return true;
  }
}
