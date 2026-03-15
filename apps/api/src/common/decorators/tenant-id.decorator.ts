import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request =
      ctx.switchToHttp().getRequest<{
        headers: Record<string, string | string[] | undefined>;
      }>();

    const tenantHeader = request.headers['x-organization-id'];

    if (Array.isArray(tenantHeader)) {
      return (tenantHeader[0] ?? '').trim();
    }

    return (tenantHeader ?? '').trim();
  },
);
