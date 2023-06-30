import { SetMetadata } from '@nestjs/common';

//接口权限标记
export const AuthTag = (...tag: string[]) => SetMetadata('AuthTag', tag);