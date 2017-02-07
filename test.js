var test = require('tape');
var loner = require('.');
var bequal = require('buffer-equal');

test('Single sequence', function(t) {
    var d = [];
    
    var l = loner(Buffer([10]));
    l.on('data', function(data) {d.push(data);});
    l.on('end', function() {
        t.equal(d.length, 3, 'Should emit three chunks');
        t.ok(bequal(d[0], Buffer.from('Hello')), '1st chunk should be correct');
        t.ok(bequal(d[1], Buffer.from([10])), '2nd chunk should be correct');
        t.ok(bequal(d[2], Buffer.from('World')), '3nd chunk should be correct');
        t.end();
    });

    l.write(Buffer.from('Hello\nWorld'));
    l.end();
});

test('Two sequences (one buffer, one string)', function(t) {
    var d = [];
    
    var l = loner(Buffer([10]), "Hell");
    l.on('data', function(data) {
        console.log(data);
        d.push(data);
    });
    l.on('end', function() {
        t.equal(d.length, 4, 'Should emit 4 chunks');
        t.ok(bequal(d[0], Buffer.from('Hell')), '1st chunk should be correct');
        t.ok(bequal(d[1], Buffer.from('o')), '2st chunk should be correct');
        t.ok(bequal(d[2], Buffer.from([10])), '3nd chunk should be correct');
        t.ok(bequal(d[3], Buffer.from('World')), '4th chunk should be correct');
        t.end();
    });

    l.write(Buffer.from('Hello\nWorld'));
    l.end();
});

test('Three sequences', function(t) {
    var d = [];
    
    var l = loner(Buffer([10]), "Hell", "Wo");
    l.on('data', function(data) {
        console.log(data);
        d.push(data);
    });
    l.on('end', function() {
        t.equal(d.length, 5, 'Should emit 5 chunks');
        t.ok(bequal(d[0], Buffer.from('Hell')), '1st chunk should be correct');
        t.ok(bequal(d[1], Buffer.from('o')), '2st chunk should be correct');
        t.ok(bequal(d[2], Buffer.from([10])), '3nd chunk should be correct');
        t.ok(bequal(d[3], Buffer.from('Wo')), '4th chunk should be correct');
        t.ok(bequal(d[4], Buffer.from('rld')), '5th chunk should be correct');
        t.end();
    });

    l.write(Buffer.from('Hello\nWorld'));
    l.end();
});

test('Three sequences, multiple occurances', function(t) {
    var d = [];
    
    var l = loner(Buffer([10]), "Hell", "Wo");
    l.on('data', function(data) {
        console.log(data);
        d.push(data);
    });
    l.on('end', function() {
        t.equal(d.length, 8, 'Should emit 8 chunks');
        t.ok(bequal(d[0], Buffer.from('Hell')), '1st chunk should be correct');
        t.ok(bequal(d[1], Buffer.from('o')), '2st chunk should be correct');
        t.ok(bequal(d[2], Buffer.from([10])), '3nd chunk should be correct');
        t.ok(bequal(d[3], Buffer.from('Wo')), '4th chunk should be correct');
        t.ok(bequal(d[4], Buffer.from('rld,')), '5th chunk should be correct');
        t.ok(bequal(d[5], Buffer.from([10])), '6th chunk should be correct');
        t.ok(bequal(d[6], Buffer.from('Good-Bye, ')), '7th chunk should be correct');
        t.ok(bequal(d[7], Buffer.from('Hell')), '8th chunk should be correct');
        t.end();
    });

    l.write(Buffer.from('Hello\nWorld,\nGood-Bye, Hell'));
    l.end();
});

test('Three sequences, restricted to one occurance', function(t) {
    var d = [];
    
    var l = loner.only(1)(Buffer([10]), "Hell", "Wo");
    l.on('data', function(data) {
        console.log(data);
        d.push(data);
    });
    l.on('end', function() {
        t.equal(d.length, 5, 'Should emit 5 chunks');
        t.ok(bequal(d[0], Buffer.from('Hell')), '1st chunk should be correct');
        t.ok(bequal(d[1], Buffer.from('o')), '2st chunk should be correct');
        t.ok(bequal(d[2], Buffer.from([10])), '3nd chunk should be correct');
        t.ok(bequal(d[3], Buffer.from('Wo')), '4th chunk should be correct');
        t.ok(bequal(d[4], Buffer.from('rld,\nGood-Bye, Hell')), '5th chunk should be correct');
        t.end();
    });

    l.write(Buffer.from('Hello\nWorld,\nGood-Bye, Hell'));
    l.end();
});
