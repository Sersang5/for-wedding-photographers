import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request =
      context.switchToHttp().getRequest<{
        headers: Record<string, string | string[] | undefined>;
      }>();

    const tenantHeader = request.headers['x-organization-id'];
    const tenantId = Array.isArray(tenantHeader)
      ? tenantHeader[0]
      : tenantHeader;

    if (!tenantId) {
      throw new BadRequestException('Missing x-organization-id header');
    }

    if (!/^\d+$/.test(tenantId) || BigInt(tenantId) < 1n) {
      throw new BadRequestException(
        'x-organization-id must be a positive integer',
      );
    }

    return true;
  }
}
