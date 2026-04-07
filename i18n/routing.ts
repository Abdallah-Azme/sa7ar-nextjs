import { createNavigation } from 'next-intl/navigation';
import { routing } from './config';

/**
 * i18n/routing.ts - Navigation Center
 * This file initializes navigation hooks and components.
 * To avoid side-effects in RSC/Metadata, always import the 'routing' object from './config' instead of this file.
 */
export { routing };
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
