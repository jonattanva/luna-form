import type { Field } from '../type';
export declare function getPrefixedAttributes(prefix: string, record?: Record<string, string | number | boolean>): Record<string, string | number | boolean>;
export declare function getAriaAttributes(record?: Record<string, string | number | boolean>): Record<string, string | number | boolean>;
export declare function getDataAttributes(record?: Record<string, string | number | boolean>): Record<string, string | number | boolean>;
export declare function buildAriaAttributes(field: Field, errors?: string[]): Record<string, string | number | boolean>;
export declare function buildDataAttributes(field: Field): Record<string, string | number | boolean>;
