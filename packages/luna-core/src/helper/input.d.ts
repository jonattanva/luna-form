import type { CommonProps, DataSource, Field, Nullable, Value } from '../type';
export declare function buildOptionSelect(field: Field): {
    value: string;
    label: string;
}[] | undefined;
export declare function buildCommon(field: Field, disabled?: boolean): CommonProps;
export declare function resolveSource(field: Field, value?: Nullable<Record<string, unknown>>): DataSource | unknown[] | undefined;
export declare function getInputValue<K>(field: Field, value?: Nullable<K>): Value | undefined;
export declare function mergeOptionsProps(field: Field, commonProps: CommonProps, options?: Nullable<DataSource | unknown[]>): CommonProps | {
    options: unknown[];
    disabled?: boolean;
    id?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
};
export declare function getPreselectedValue(field: Field, commonProps: CommonProps, value?: Value): any;
export declare function getOptions<T>(field: Field, data?: Nullable<T[]>): (T | {
    description?: string | undefined;
    label: string;
    value: string;
})[] | null | undefined;
export declare function prepareInputProps<T, K>(field: Field, commonProps: CommonProps, data?: Nullable<DataSource | T[]>, value?: Nullable<K>): {
    commonPropsWithOptions: CommonProps | {
        options: unknown[];
        disabled?: boolean;
        id?: string;
        name?: string;
        placeholder?: string;
        required?: boolean;
    };
    defaultValue: any;
};
export declare function prepareInputValue<T>(field: Field, value?: Nullable<T>): {
    checked: boolean | Nullable<T> | undefined;
    value?: undefined;
} | {
    value: string | NonNullable<T>;
    checked?: undefined;
};
export declare function prepareDefaultValue<T>(field: Field, value?: Nullable<T>): {
    defaultChecked: boolean;
    defaultValue?: undefined;
} | {
    defaultValue: Nullable<T> | undefined;
    defaultChecked?: undefined;
};
