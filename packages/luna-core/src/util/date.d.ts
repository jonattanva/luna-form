export declare function getMonth(): {
    value: string;
    label: string;
}[];
export declare function getYear(min: number, max: number): Array<{
    value: string;
    label: string;
}>;
export declare function getCurrentYear(): number;
export declare function getConvert(value: string | number, current?: number): number;
