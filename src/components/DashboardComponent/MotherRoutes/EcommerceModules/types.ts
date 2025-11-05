import { ElementType } from 'react';

export interface EcommerceModuleTitleOnly {
  title: string;
}

export type ChildItem = {
  title: string;
  url: string;
  count?: string;
  isNew?: boolean;
};

export type MenuConfig = Record<
  string,
  { icon: ElementType; items: ChildItem[]; url?: string }
>;

