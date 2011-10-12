var def = require('./def').def;
var fs = require('fs');
var kabin = exports;

kabin.Raw = def({
  init: function (params) {
    this.path = params.path
    var that = this;
    fs.readdirSync(this.path).forEach(function (name) {
      var stat = fs.statSync(that.path+"/"+name);
      if(stat.isFile()) {
        that._defineAttributes(name);
      } else if(stat.isDirectory()) {
        that[name] = new that.constructor({path: that.path+"/"+name});
      }
    });
  },
  
  _defineAttributes: function (id) {
    this.__defineGetter__(id, function () {
      return this._onGet(fs.readFileSync(this.path+"/"+id, "utf8"));
    });
    this.__defineSetter__(id, function (value) {
      fs.writeFileSync(this.path+"/"+id, this._onSet(value));
    });
  },
  
  insert: function (name, value) {
    this._defineAttributes(name);
    this[name] = value;
  },
  createDir: function (name) {
    fs.mkdirSync(this.path+"/"+name);
    this[name] = new this.constructor({path: this.path+"/"+name});
  },
  
  _onSet: function(value) { return value; },
  _onGet: function(value) { return value; },
});

kabin.JSON = def({
  extend: kabin.Raw,
  init: function (params) {
    this._super(params);
  },
  
  _onSet: function (value) {
    return JSON.stringify(value);
  },
  _onGet: function (value) {
    return JSON.parse(value);
  }
});
