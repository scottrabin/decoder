# @scottrabin/decoder

Decode unknown JSON values into known types via composable decoders.

The intended use case is external type parsing, which have no guarantees on
structural types. This library aims to provide type safety to e.g. responses
to API calls, `localStorage` and its ilk, and other boundaries where type
information is lost or unavailable. It is *not* intended for use in
transforming the interpreted data - it only affirms the data returned by
the decoders meets the structural requirements.

## Getting Started

```sh
$ yarn add @scottrabin/decoder
```

```typescript
// in yourFile.ts
import * as decoders from "@scottrabin/decoder";

const myDecoder = decoders.struct(/* ... */);
```

## API

See [the documentation](docs/README.md)

## Philosophy

`decoder` is intended to be modular; decoders are simple objects with a
`decode` method, which accepts a value of type `unknown` and returns a
`Result` type indicating success or failure in asserting the type of the
given value matches the desired type.

## License
[MIT](LICENSE)
