import type { ChangeEvent, SourceEvent, StateEvent, ValueEvent } from '../type';
export declare function handleProxyEvent(events: ChangeEvent | undefined, callback: (props: {
    sources: SourceEvent[];
    states: StateEvent[];
    values: ValueEvent[];
}) => void): void;
