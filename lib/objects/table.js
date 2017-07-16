var _       = require('../utils'),
    Column  = require('./column'),
    TableIndex  = require('./table-index');

module.exports = Table;

function Table(rawTable, schema, isView){
  this.schema = schema;
  this.table  = rawTable;

  this.name   = rawTable.name;
  this.isView = (isView === true || isView === false) ? isView : false;

  var _columns = [];
  this.columns = _columns;
  this.column  = function(name){
    return _columns.find(function(item){
      return (item.name.toLowerCase() === name.toLowerCase());
    });
  };

  var _indicies = [];
  this.indicies = _indicies;
  this.indexes  = _indicies;
  this.index  = function(name){
    return _indicies.find(function(item){
      return (item.name.toLowerCase() === name.toLowerCase());
    });
  };

  var parent = this;

  [].concat(rawTable.column).filter(function(item){
    return (typeof item !== 'undefined');
  }).forEach(function(rawColumn){
    var column = new Column(rawColumn, parent);
    if (column) { _columns.push(column); }
  });

  [].concat(rawTable.index).filter(function(item){
    return (typeof item !== 'undefined');
  }).forEach(function(rawIndex){
    var index = new TableIndex(rawIndex, parent);
    if (index) { _indicies.push(index); }
  });

  [].concat(rawTable.fk).filter(function(item){
    return (typeof item !== 'undefined');
  }).forEach(function(fk){
    var col = _columns.find(function(item){
      return (item.name === fk['fk_column'].name);
    });
    col.primary = {
      key: {
        name: fk.name
      },
      schema: {
        name: fk['to_schema']
      },
      table: {
        name: fk['to_table']
      },
      column: {
        name: fk['fk_column'].pk
      }
    };
  });

  // Print
  this.print = function (length, spacing) {
    var prefix = _.strings.spaces(length);
    console.log(prefix + 'Table: ' + this.name);
    length = length + spacing;
    this.columns.forEach(function(column){
      column.print(length, spacing, true);
    });
    this.indicies.forEach(function(index){
      index.print(length, spacing);
    });
  }
}