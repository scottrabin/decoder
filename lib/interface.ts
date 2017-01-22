export interface Decoder<T> {
    decode(json: any): T;
}
