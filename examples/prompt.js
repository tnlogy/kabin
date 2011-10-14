var kabin = require('../kabin');
var db = new kabin.JSON({path: "db"});

console.log("\n-- Welcome to Kabin! (alpha warning!)--\n");
console.log("  This is a simple JSON file database for nodejs.");
console.log("  The console (examples/prompt.js) has already connected to the sample database.\n");
console.log("  Connect to a directory at path var db = new kabin.JSON({path: 'data'});");
console.log("  Create a new record with db.insert('e', {x: 10, y: 20})");
console.log("  Read data from a record with db.e.x => 10");
console.log("  Write data to a record with d.e = {x: 1, y: 2}\n");
console.log("  db.migrate() -> migrate to latest version. db.version is the current version.");
console.log("  db.migrate({version: x}) -> migrate to version x. up or down depending on current version.");
console.log("\n  Put a model in db/models. See Recipe.js for an example:");
console.log("    " + db.models.Recipe.split("\n").join("\n    "));
console.log("  A model must have the onSave function which defines what json-data it saves.");
console.log("  A JSON file with the field type, will check if such a model exists, and then create it.");
console.log("  See db.data.b for an example of a Recipe class instance.");
console.log("  Will probably make the saving more logical.\n  Currently to save changes to db.data.b you need to write db.data.b = db.data.b.\n");

var prompt = require("repl").start("kabin> ");
prompt.context.db = db;
prompt.context.kabin = kabin;


