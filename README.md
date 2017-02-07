loner
===
A transform stream for node and browserify that ensures that certain data sequences appear in their own, separate chunks

When progressively parsing streaming binary data, you often need to find magic sequences of bytes that act as separators or "keywords". This can be surprisingly hard to implement efficiently (i.e. without a lot of buffering and copying data around) because the magic sequences might be spread across an arbitrary amount of chunks and you must take care to implement all those edge cases correctly.

`loner` does that for you. It ensures that each magic sequence you specify will be in its own data chunk, while otherwise leaving the sequence of chunks as it is. Thus all you need to do downstream is to compare each incoming chunk against the sequence you are looking for, for example by using [buffer-equal](https://www.npmjs.com/package/buffer-equal).

All the heavy lifting is actually done by [binary-stream-replace](https://www.npmjs.com/package/binary-stream-replace).

## Example

```
const loner = require('loner');

let PNGSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

let l = loner(PNGSignature);
l.on('data', (data) => console.log(data) );

l.write(Buffer.from('Hello\x89\x50'));
l.write(Buffer.from([0x4e, 0x47, 0x0d, 0x0a]));
l.write(Buffer.from("\x1a\x0a\nWorld"));
l.end();

// output =>
// <Buffer 48 65 6c 6c 6f c2>
// <Buffer 89 50 4e 47 0d 0a 1a 0a>
// <Buffer 0a 57 6f 72 6c 64>
```

## API

```
loner(seq1, seq2, ..., seqN)
```

*seq1* .. *seqN* Buffer objects containing sequences that you want isolated (on separate chunks). You can also pass Strings instead of Buffers, they will be converted internally.

**NOTE** If a sequence is fully contained within another seqeunce, as in `loner('Hello','lo')`, interesting things happen! The outcome then depends on the ordering of arguments. In this example, you'd get all the `lo`s separated, which obviously breaks each `hello` into `hel` and `lo`.


