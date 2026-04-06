import type { DataSource, Nullable, SourceEvent } from '../type';
export declare function handleSourceEvent<T>(selected: Nullable<T> | undefined, events: SourceEvent[] | undefined, setSource: (name: string, source?: DataSource) => void): void;
