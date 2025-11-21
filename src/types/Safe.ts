// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type SafeAny = any;
export declare type IDType = string | number;
export declare type SafeArray = SafeAny[];
export declare type SafeObject = { [key: string | number]: SafeAny };
export declare type SafeTimer = ReturnType<typeof setTimeout | typeof setInterval>;