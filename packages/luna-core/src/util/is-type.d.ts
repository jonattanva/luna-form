import type { DataSource, Value } from '../type';
export declare function isObject<T>(value: unknown): value is Record<string, T>;
export declare function isEmpty(value: unknown): boolean;
export declare function isValue(value: unknown): value is Value;
export declare function isString(value: unknown): value is string;
export declare function isDataSource(value: unknown): value is DataSource;
export declare function isBoolean(value: unknown): value is boolean;
