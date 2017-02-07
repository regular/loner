const loner = require('.');

let PNGSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

let l = loner(PNGSignature);
l.on('data', (data)=> console.log(data) );

l.write(Buffer.from('Hello\x89\x50'));
l.write(Buffer.from([0x4e, 0x47, 0x0d, 0x0a]));
l.write(Buffer.from("\x1a\x0a\nWorld"));
l.end();

// =>
//<Buffer 48 65 6c 6c 6f c2 89 50>
//<Buffer 4e 47 0d 0a>
//<Buffer 1a 0d 0a 57 6f 72 6c 64>
