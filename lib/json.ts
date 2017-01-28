/**
 * Define the different types represented in JSON
 */
export type JSONValue = null | string | number | boolean | JSONObject | JSONArray;

export interface JSONObject {
    [x: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> { }

/**
 * Determines if the given parameter is a JSONObject
 */
export function isObject(param: any): param is JSONObject {
    return (param !== null && typeof param === "object" && !Array.isArray(param));
}
