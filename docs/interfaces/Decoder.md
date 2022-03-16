# Interface: Decoder<T\>

A decoder which attempts to parse a given value as the defined type,
returning a Result indicating whether the decode operation was successful
as well as the resulting parsed value.

## Type parameters

| Name | Description |
| :------ | :------ |
| `T` | the type this decoder will decode into |

## Table of contents

### Methods

- [decode](Decoder.md#decode)

## Methods

### decode

▸ **decode**(`json`): [`Result`](../README.md#result)<`T`, [`DecodeError`](../classes/DecodeError.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `json` | `unknown` |

#### Returns

[`Result`](../README.md#result)<`T`, [`DecodeError`](../classes/DecodeError.md)\>
