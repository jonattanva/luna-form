import type { Definition, Filterable, Nullable } from '../type';
export declare function prepare<T extends Filterable>(base?: readonly T[], definition?: Definition): any[];
export declare function resolveRefs(base: unknown, definition?: Definition, cache?: Map<object, unknown>, visited?: WeakSet<object>): unknown;
export declare function entries<T>(values?: Nullable<Record<string, T>>): [key: string, value: T][];
