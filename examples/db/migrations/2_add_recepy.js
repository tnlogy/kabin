{
  up: function (db) {
    console.log("migration 2 up");
    var r = db.data.recipes;
    r["Kanterellpaj"] = "fin fint recept";
    db.data.recipes = r;
  },
  
  down: function (db) {
    console.log("migration 2 down");
    var r = db.data.recipes;
    delete r["Kanterellpaj"];
    db.data.recipes = r;
  }
}