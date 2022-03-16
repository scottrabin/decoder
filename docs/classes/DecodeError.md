# Class: DecodeError

A custom error type for decoding, which stores the path at which a decode operation
may have failed.

## Hierarchy

- `Error`

  ↳ **`DecodeError`**

## Table of contents

### Methods

- [captureStackTrace](DecodeError.md#capturestacktrace)
- [extend](DecodeError.md#extend)
- [forType](DecodeError.md#fortype)

### Constructors

- [constructor](DecodeError.md#constructor)

### Properties

- [message](DecodeError.md#message)
- [name](DecodeError.md#name)
- [path](DecodeError.md#path)
- [prepareStackTrace](DecodeError.md#preparestacktrace)
- [stack](DecodeError.md#stack)
- [stackTraceLimit](DecodeError.md#stacktracelimit)

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

___

### extend

▸ **extend**(`path`): [`DecodeError`](DecodeError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `path` | `string` \| `number` | the link in the path at which this decode operation failed |

#### Returns

[`DecodeError`](DecodeError.md)

a new [`DecodeError`](DecodeError.md) which

___

### forType

▸ `Static` **forType**(`expected`, `actual`): [`DecodeError`](DecodeError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `expected` | `string` | name of the expected type for the decoder |
| `actual` | `unknown` | value which failed to decode |

#### Returns

[`DecodeError`](DecodeError.md)

a [`DecodeError`](DecodeError.md) indicating a failure to decode due to mismatched types

## Constructors

### constructor

• **new DecodeError**(`baseMessage`, `path?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `baseMessage` | `string` |
| `path?` | `string`[] |

#### Overrides

Error.constructor

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

___

### name

• **name**: `string`

#### Inherited from

Error.name

___

### path

• `Optional` **path**: `string`[]

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit
