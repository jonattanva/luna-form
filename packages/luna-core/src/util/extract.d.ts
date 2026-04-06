import type { Nullable, Option, Value } from '../type';
export declare function getEntity<T>(selected: string, collection?: Nullable<T[]>, entity?: string): NonNullable<T> | {
    value: string;
};
export declare function getCurrentValue<T>(value: T, entity?: string): Value | undefined;
export declare function getValue<T>(value: Record<string, T>, namespace?: string): T | undefined;
export declare function getArray<T>(value: Record<string, T> | T[], namespace?: string): Nullable<T[]>;
export declare function extract<T>(value: Record<string, T>, namespace?: string): T | null;
export declare function toOptions<T>(data: T[], options?: Option): (T | {
    description?: string | undefined;
    label: string;
    value: string;
})[];
export declare function getType(value?: string): string;
export declare function getFormData(formData: FormData): Record<string, unknown>;
export declare function unflatten(data: Record<string, unknown>): Record<string, unknown>;
