var kabin = require('../kabin');
var db = new kabin.JSON({path: "db"});

var prompt = require("repl").start("kabin> ");

prompt.context.db = db;
prompt.context.kabin = kabin;