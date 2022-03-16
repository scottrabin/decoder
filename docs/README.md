# @scottrabin/decoder

## Table of contents

### Classes

- [DecodeError](classes/DecodeError.md)

### Interfaces

- [Decoder](interfaces/Decoder.md)

### Type aliases

- [Result](README.md#result)

### Functions

- [array](README.md#array)
- [dict](README.md#dict)
- [equals](README.md#equals)
- [oneof](README.md#oneof)
- [option](README.md#option)
- [struct](README.md#struct)
- [tuple](README.md#tuple)

### Variables

- [boolean](README.md#boolean)
- [number](README.md#number)
- [string](README.md#string)

## Type aliases

### Result

Ƭ **Result**<`T`, `E`\>: { `ok`: ``true`` ; `value`: `T`  } \| { `error`: `E` ; `ok`: ``false``  }

A `Result` type indicating success, in which case the object has a `value` key of type `T`,
or failure, in which case the object has an `error` key of type `E`.

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | the type of `value` if the result indicates success |
| `E` | the type of `error` if the result indicates failure |

## Functions

### array

▸ **array**<`T`\>(`elementDecoder`): [`Decoder`](interfaces/Decoder.md)<`T`[]\>

Decodes an unknown value into an array of identical elements.

**`example`**
```typescript
const arrayOfStringsDecoder = decoder.array(decoder.string);

async function getTodoList() {
    const response = await fetch("https://api.example.com/my-todos");
    const decodeResult = arrayOfStringsDecoder.decode(await response.json());
    if (decodeResult.ok) {
        // decodeResult.value is now of type Array<string>
    } else {
        // decodeResult.error is now an Error with a message describing which
        // index failed to conform to the desired type
    }
}
```

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | the element type of the decoded array |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `elementDecoder` | [`Decoder`](interfaces/Decoder.md)<`T`\> | [`Decoder`](interfaces/Decoder.md) used for each element of the array |

#### Returns

[`Decoder`](interfaces/Decoder.md)<`T`[]\>

a [`Decoder`](interfaces/Decoder.md) for an array of consistent elements

___

### dict

▸ **dict**<`T`\>(`decoder`): [`Decoder`](interfaces/Decoder.md)<`Record`<`string`, `T`\>\>

Decodes a dictionary with arbitrary key mappings to consistent values.

**`example`**
```typescript
const userGeneratedContentDecoder = decoder.struct({
    content: decoder.string,
    atMentions: decoder.dict(decoder.struct({ displayName: decoder.string })),
});

async function getPostContents(postId: string) {
    const apiResponse = await fetch(`https://api.example.com/posts/${postId}`);
    const decodeResult = userGeneratedContentDecoder.decode(await apiResponse.json());
    if (decodeResult.ok) {
        // decodeResult.value.atMentions is now an object of type `Record<string, string>`
        return decodeResult.value.content.replace(/@(\w+)/g, (match) => decodeResult.value.atMentions[match.substring(1)]?.displayName ?? match);
    } else {
        // decodeResult.error is now an Error describing which key failed to conform to the desired type
    }
}
```

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | type of the values in the resulting dictionary/record |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `decoder` | [`Decoder`](interfaces/Decoder.md)<`T`\> | decoder for the value of each member of the dictionary |

#### Returns

[`Decoder`](interfaces/Decoder.md)<`Record`<`string`, `T`\>\>

a decoder for objects with consistent value types and arbitrary keys

___

### equals

▸ **equals**<`T`\>(`value`, `equalsFn?`): [`Decoder`](interfaces/Decoder.md)<`T`\>

Creates a decoder which compares decoded values for equivalence with the
configured value. If `equalsFn` is omitted, reference equality is used.

**`example`**
```typescript
const v1APIDecoder = decoder.struct({
    version: decoder.equals(1 as const),
    data: v1APIDataDecoder,
});
const v2APIDecoder = decoder.struct({
    version: decoder.equals(2 as const),
    data: v2APIDataDecoder,
});
const versionedAPIDecoder = oneof(v1APIDecoder, v2APIDecoder);

async function respondToVersionedRequests(req: Request, res: Response) {
    const decodeResult = versionedAPIDecoder.decode(req.body);
    // Typescript cannot narrow this type via `!decodeResult.ok`, so reference equality to `false` is required
    if (decodeResult.ok === false) {
        // `decodeResult.error` is now an Error indicating the given value is not equal to the desired value
        res.json({ error: decodeResult.error.message });
        return;
    }
    // decodeResult is now a value-type / non-error; unfortunately, Typescript cannot narrow nested objects
    const { value } = decodeResult;
    if (value.version === 1) {
        // value.data is now the v1 data type
    } else {
        // value.data is now the v2 data type
    }
}
```

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | the type or type literal for the resulting [`Decoder`](interfaces/Decoder.md) |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `value` | `T` | `undefined` | desired equivalence value |
| `equalsFn` | (`a`: `T`, `b`: `unknown`) => `boolean` | `referenceEqual` | an optional function to compare values to determine equivalence |

#### Returns

[`Decoder`](interfaces/Decoder.md)<`T`\>

a [`Result`](README.md#result) indicating whether the decoded value is equivalent to the desired value

___

### oneof

▸ **oneof**<`T`\>(...`decoders`): [`Decoder`](interfaces/Decoder.md)<`T`[`number`]\>

Creates a decoder which attempts each given decoder, in the order given, until one
of the decoders successfully decodes the given value.

**`example`**
```typescript
const numericDecoder: Decoder<number> = {
    decode: (json) => {
        const parsedNumber = parseFloat(json);
        return isNaN(parsedNumber)
            ? Err(new Error("not a number or numeric string"))
            : Ok(parsedNumber);
    }
};

const acceptableValues = decoder.oneof(
    numericDecoder,
    decoder.equals('auto' as const),
    decoder.equals('none' as const),
);

function parseUserInput(input: string) {
    const decodeResult = acceptableValues.decode(input);
    if (decodeResult.ok) {
        doSomethingWithAcceptableValue(decodeResult.value);
    } else {
        showErrorMessage("Acceptable values are a number, 'auto', or 'none'.");
    }
}
```

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `unknown`[] | the set of types this [`Decoder`](interfaces/Decoder.md) can decode into |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...decoders` | { [I in string \| number \| symbol]: Decoder<T[I]\> } | Set of [`Decoder`](interfaces/Decoder.md)s to try, in order, to match a given unknown value |

#### Returns

[`Decoder`](interfaces/Decoder.md)<`T`[`number`]\>

a [`Decoder`](interfaces/Decoder.md) for a union of the types decoded by the given decoders

___

### option

▸ **option**<`T`\>(`decoder`): [`Decoder`](interfaces/Decoder.md)<``null`` \| `T`\>

Creates a decoder for a type that may not be present, or may be `null`.

If a default value is provided, then this decoder will return that value if
the decoded value is `null` or `undefined`.

JSON cannot realistically represent `undefined` without simply omitting the
key, so if there is no default value and the given value is `null` or `undefined`,
then this decoder will return `null`.

**`example`**
```typescript
const userDecoder = decoder.struct({
    user: decoder.struct({
        username: decoder.string,
        admin: decoder.option(decoder.boolean, false),
    }),
});

async function fetchUser(userId) {
    const response = await fetch(`https://api.example.com/users/${userId});
    const result = userDecoder.decode(await response.json());
    if (result.ok) {
        // result.value.user is now an object of type { username: string; admin: boolean; }
    } else {
        // result.error is now an Error
    }
}
```

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | type to optionally decode, if the value is present. |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `decoder` | [`Decoder`](interfaces/Decoder.md)<`T`\> | [`Decoder`](interfaces/Decoder.md) for the type that may exist |

#### Returns

[`Decoder`](interfaces/Decoder.md)<``null`` \| `T`\>

a [`Decoder`](interfaces/Decoder.md) for the optional type

▸ **option**<`T`\>(`decoder`, `defaultValue`): [`Decoder`](interfaces/Decoder.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `decoder` | [`Decoder`](interfaces/Decoder.md)<`T`\> |
| `defaultValue` | `T` |

#### Returns

[`Decoder`](interfaces/Decoder.md)<`T`\>

___

### struct

▸ **struct**<`T`\>(`decoderMap`): [`Decoder`](interfaces/Decoder.md)<`T`\>

Decodes a structured object, using the decoder map to determine the value at
each key.

**`example`**
```typescript
const saveDataDecoder = decoder.struct({
    favorites: decoder.array(decoder.number),
    bookmarks: decoder.array(decoder.string),
});

function loadSaveData() {
    const decodeResult = saveDataDecoder.decode(localStorage.getItem('saveData'));
    if (decodeResult.ok) {
        // decodeResult.value is now an object of type { favorites: number[], bookmarks: string[] }
        return decodeResult.value;
    } else {
        // decodeResult.error is now an Error describing which key failed to conform to the desired type
        return { favorites: [], bookmarks: [] };
    }
}
```

#### Type parameters

| Name | Description |
| :------ | :------ |
| `T` | return type of the structured object |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `decoderMap` | { [K in string \| number \| symbol]: Decoder<T[K]\> } | a map of key to the decoder for the type expected at that key |

#### Returns

[`Decoder`](interfaces/Decoder.md)<`T`\>

a decoder for objects with a known structure

___

### tuple

▸ **tuple**<`T`\>(...`decoders`): [`Decoder`](interfaces/Decoder.md)<`T`\>

Decodes a given array into a Typescript tuple with a fixed number of elements,
possibly with different types.

**`example`**
```typescript
const latLngDecoder = decoder.tuple(decoder.number, decoder.number);
const geoDecoder = decoder.struct({
    markers: decoder.array(latLngDecoder),
});

async function fetchGeoData() {
    const response = await fetch("https://api.example.com/points-of-interest");
    const decodeResult = geoDecoder.decode(await response.json());
    if (decodeResult.ok) {
        // decodeResult.value.markers is an array of lat/long tuples
        addMarkersToMap(decodeResult.value.markers);
    } else {
        // decodeResult is now an Error, which may indicate an index that failed to decode
    }
}
```

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `unknown`[] | the tuple type to decode |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...decoders` | { [I in string \| number \| symbol]: Decoder<T[I]\> } | Set of [`Decoder`](interfaces/Decoder.md)s to apply to each element of the given array |

#### Returns

[`Decoder`](interfaces/Decoder.md)<`T`\>

a [`Result`](README.md#result) of the attempt to decode the given value as a tuple

## Variables

### boolean

• `Const` **boolean**: [`Decoder`](interfaces/Decoder.md)<`boolean`\>

Decodes an unknown value into a boolean.

___

### number

• `Const` **number**: [`Decoder`](interfaces/Decoder.md)<`number`\>

Decodes an unknown value into a number.

___

### string

• `Const` **string**: [`Decoder`](interfaces/Decoder.md)<`string`\>

Decodes an unknown value into a string.
