export interface Currency {
    code: string;
    rate: number;
    locale: string;
    default?: boolean;
    symbol: string;
}
