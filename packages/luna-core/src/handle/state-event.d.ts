import type { FieldState, Nullable, StateEvent } from '../type';
export declare function handleStateEvent<T>(selected: Nullable<T> | undefined, events: StateEvent[] | undefined, setState: (name: string[], state?: FieldState) => void): void;
