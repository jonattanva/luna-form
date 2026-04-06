import type { Field, Nullable } from '../type';
export declare function buildOptions(field: Field, values?: Nullable<Record<string, unknown>>): Record<string, unknown>[] | undefined;
export declare function buildOrientation(field: Field): boolean;
export declare function buildReverse(field: Field): boolean;
export declare function buildDisabled(field: Field, disabled?: boolean): boolean;
export declare function buildSource(field: Field): import("..").DataSource | unknown[] | undefined;
