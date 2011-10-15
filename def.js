module.exports = function def(ds){
  var k = function () { this.init.apply(this, arguments); };
  var sc = false;
  if(ds.extend) {
    sc = function() {};
    sc.prototype = ds.extend.prototype;
    delete ds.extend;
    k.prototype = new sc();
  } else {
    k.prototype = function(){};
  }
  k.prototype.constructor = k;
  for(var p in ds){
    if(sc && sc.prototype[p] && /\bsuper\b/.test(ds[p])) {
      k.prototype[p] = (function(sfn, fn){
        return function() {
          this.super = sfn;
          var res = fn.apply(this, arguments);
          delete this.super;
          return res;
        };
      })(sc.prototype[p], ds[p]);
    } else {
      k.prototype[p] = ds[p];
    }
  };
  return k;
}
