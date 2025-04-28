import { AsyncLocalStorage } from 'node:async_hooks';
import type { ContextProvider } from './context.provider';

/**
 * ContextStorage
 */
export const ContextStorage = new AsyncLocalStorage<ContextProvider>();
