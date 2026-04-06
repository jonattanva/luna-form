import type { Nullable, ValueEvent } from '../type';
export declare function handleValueEvent<T>(selected: Nullable<T> | undefined, events: ValueEvent[] | undefined, setValue: (name: string, value: unknown) => void): void;
