{
  up: function (db) {
    console.log("creating data recipes");
    db.data.insert("recipes", {x: 10});
  },
  
  down: function (db) {
    console.log("removing data recipes");
    db.data.remove("recipes");
  }
}