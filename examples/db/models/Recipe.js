{
  init: function (data) {
    this.data = data;
    if(!this.data.saved) { this.data.saved = 0; }
  },
  
  getIngredients: function () {
    return this.data.ingredients;
  },
  
  onSave: function () {
    this.data.saved += 1;
    return this.data;
  }
}