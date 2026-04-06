import type { RemotePattern } from '../type';
/**
 * Validates a URL against a list of allowed remote patterns.
 * Internal URLs are allowed by default.
 * If patterns is undefined, all URLs are allowed.
 * If patterns is an empty array, all external URLs are blocked.
 */
export declare function matchRemotePattern(urlStr: string, patterns?: RemotePattern[]): boolean;
export declare function isExternalUrl(url: string): boolean;
export declare function mergeUrl(baseUrl: string, targetUrl: string): string;
