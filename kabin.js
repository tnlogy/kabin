var def = require('./def');
var fs = require('fs');
var kabin = exports;

kabin.Raw = def({
  init: function (params) {
    this.path = params.path;
    this._root = params.root || this;
    this._attributes = [];
    var that = this;
    fs.readdirSync(this.path).forEach(function (name) {
      var stat = fs.statSync(that._pathFor(name));
      var info = that._getFileInfo(name);
      that._attributes.push(info.name);
      if(stat.isFile()) {
        that._defineAttributes(name, info);
      } else if(stat.isDirectory()) {
        that[info.name] = new that.constructor({path: that._pathFor(name), root: that._root});
      }
    });
  },
  
  _getFileInfo: function (name) {
    var re = /^(.+)\.(.+)/.exec(name);
    return re ? {name: re[1], ext: re[2]} : {name: name};
  },
  _pathFor: function (name) {
    return this.path+"/"+name;
  },
  
  _defineAttributes: function (id, info) {
    this.__defineGetter__(info.name, function () {
      return this._onGet(fs.readFileSync(this._pathFor(id), "utf8"), info);
    });
    this.__defineSetter__(info.name, function (value) {
      fs.writeFileSync(this._pathFor(id), this._onSet(value, info));
    });
  },
  
  insert: function (name, value) {
    var info = {name: name, ext: "json"};
    this._defineAttributes(name+".json", info);
    this[name] = value;
  },
  
  remove: function (name) {
    fs.unlinkSync(this._pathFor(name+".json"));
    delete this[name];
  },
  
  createDir: function (name) {
    fs.mkdirSync(this.pathFor(name));
    this[name] = new this.constructor({path: this.pathFor(name)});
  },
  
  _onSet: function(value, info) { return value; },
  _onGet: function(value, info) { return value; },
  
  find: function (params) {
    var that = this;
    return this._attributes.map(function (name) {
      return {id: name, data: that[name]};
    });
  },
  
  migrate: function (params) {
    var migrations = this.migrations.find().sort(function (a, b) {
      return parseInt(a.id) > parseInt(b.id);
    });
    var that = this;
    var rollback = false;
    var targetVersion = params && params.version;
    if(targetVersion === undefined) {
      targetVersion = parseInt(migrations[migrations.length-1].id);
    }
    if(targetVersion < this.version) {
      rollback = true;
      migrations = migrations.reverse();
    }
    
    migrations.forEach(function (m) {
      var version = parseInt(m.id);
      if(rollback && version > targetVersion && version <= that.version) {
        var code = eval("(" + m.data + ")");
        code.down(that);
        that.version = version-1;        
      } else if(version > that.version && version <= targetVersion) {
        var code = eval("(" + m.data + ")");
        code.up(that);
        that.version = version;
      }
    });
  },
  
  getModel: function (name) {
    var code = this._root.models[name];
    if(!code) { return false; }
    code = eval("("+code+")");
    code.extend = kabin.Base;
    return def(code);
  }
});

kabin.JSON = def({
  extend: kabin.Raw,
  init: function (params) {
    this.super(params);
  },

  _onSet: function (value, info) {
    var setFunc = info.ext && this["_onSet_" + info.ext];
    return setFunc ? setFunc.call(this, value, info) : value;
  },
  _onGet: function (value, info) {
    var getFunc = info.ext && this["_onGet_" + info.ext];
    return getFunc ? getFunc.call(this, value, info) : value;
  },
  
  _onSet_json: function (value) {
    if(typeof(value.onSave) === "function") {
      return JSON.stringify(value.onSave());
    } else {
      return JSON.stringify(value);
    }
  },
  _onGet_json: function (value, info) {
    var json = JSON.parse(value);
    var model = json.type && this.getModel(json.type);
    if(model) {
      var m = new model(json);
      m.save = this.__lookupSetter__(info.name).bind(this, json);
      return m;
    } else {
      return json;
    }
  }
});

kabin.Base = def({
  init: function (data) {
    this.data = data;
  },

  onSave: function () {
    return this.data;
  }
});
