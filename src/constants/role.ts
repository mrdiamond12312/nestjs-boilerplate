import { type ValueOf } from '@/interfaces';
export enum ROLE {
  USER = 'user',
}

export type RoleType = ValueOf<typeof ROLE>;
