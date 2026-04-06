/**
 * Replaces placeholders in the format {key} with values from the provided object.
 * Supports nested objects using dot notation (e.g., {user.id}).
 */
export declare function interpolate<T>(template: T, values?: Record<string, unknown>): T;
export declare function interpolateIfNeeded<T>(template: T, values?: Record<string, unknown>): T;
export declare function isInterpolated(template: unknown): boolean;
export declare function formatMarkdown<K>(text?: string, callback?: (index: number, url: string, text?: string) => K): (string | K)[] | string | null;
