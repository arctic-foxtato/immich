import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {IsBoolean, IsHexColor, IsNotEmpty, IsString} from 'class-validator';
import { TagEntity } from 'src/entities/tag.entity';
import { Optional, ValidateUUID } from 'src/validation';

export class TagCreateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ValidateUUID({ optional: true, nullable: true })
  parentId?: string | null;

  @IsHexColor()
  @Optional({ nullable: true, emptyToNull: true })
  @Transform(({ value }) => (typeof value === 'string' && value[0] !== '#' ? `#${value}` : value))
  color?: string;

  @IsBoolean()
  isPrivate: boolean = false;
}

export class TagUpdateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Optional({ nullable: true, emptyToNull: true })
  @IsHexColor()
  @Transform(({ value }) => (typeof value === 'string' && value[0] !== '#' ? `#${value}` : value))
  color?: string | null;

  @IsBoolean()
  isPrivate: boolean = false;
}

export class TagUpsertDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags!: string[];
}

export class TagBulkAssetsDto {
  @ValidateUUID({ each: true })
  tagIds!: string[];

  @ValidateUUID({ each: true })
  assetIds!: string[];
}

export class TagBulkAssetsResponseDto {
  @ApiProperty({ type: 'integer' })
  count!: number;
}

export class TagResponseDto {
  id!: string;
  parentId?: string;
  name!: string;
  value!: string;
  createdAt!: Date;
  updatedAt!: Date;
  color?: string;
  isPrivate?: boolean;
}

export function mapTag(entity: TagEntity): TagResponseDto {
  return {
    id: entity.id,
    parentId: entity.parentId ?? undefined,
    name: entity.value.split('/').at(-1) as string,
    value: entity.value,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    color: entity.color ?? undefined,
    isPrivate: entity.isPrivate ?? false,
  };
}
