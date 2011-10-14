var kabin = require('../kabin');
var db = new kabin.JSON({path: "data"});

var raw = new kabin.Raw({path: "data"});

db.b = {x: 1, y: 2};
console.log("b.x is " + db.b.x);
console.log("file b is " + raw.b);

db.c = {};
console.log("setting c to {x: 1, y: 2}");
db.c = {x: 1, y: 2};

console.log("c is now " + JSON.stringify(db.c));

console.log("creating new file e in data");
db.insert('e', {x: 10, y: 20});

console.log("e.y is now", db.e.y);

console.log("the information is persisted between sessions.")