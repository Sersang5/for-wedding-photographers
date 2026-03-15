import { BadRequestException } from '@nestjs/common';

function normalizeIdInput(value: bigint | number | string): string {
  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (typeof value === 'number') {
    if (!Number.isInteger(value) || value < 1) {
      throw new BadRequestException('ID must be a positive integer');
    }

    return String(value);
  }

  return value.trim();
}

export function toBigIntId(
  value: bigint | number | string,
  fieldName = 'id',
): bigint {
  const normalized = normalizeIdInput(value);

  if (!/^\d+$/.test(normalized)) {
    throw new BadRequestException(`${fieldName} must be a positive integer`);
  }

  const parsedValue = BigInt(normalized);

  if (parsedValue < 1n) {
    throw new BadRequestException(`${fieldName} must be a positive integer`);
  }

  return parsedValue;
}

export function toOptionalBigIntId(
  value: bigint | number | string | null | undefined,
  fieldName = 'id',
): bigint | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value === 'string' && value.trim().length === 0) {
    return undefined;
  }

  return toBigIntId(value, fieldName);
}
