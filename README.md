# dbschema-parser

Parses `.dbs` files from the [DbSchema Diagram Designer and Query Tool](http://www.dbschema.com/) from Wise Coders Solutions.

## Installation

`npm install dbschema-parser`

## Usage

### Initializing the Parser

```
var dbSchema  = require('dbschema-parser');
var parser = new dbSchema.Parser(filePath);
```
### Rendered Objects

***
#### Parser
Single instance.  Top-most object.
##### Properties
 - `databases`: `array[Database]` : Array of Database objects.
 - `path`: `string` : Path to supplied `.dbs` file.
 - `xml`: `string` : Contents of `.dbs` file in raw XML format.
 - `object`: `object` : Parsed `.dbs` file in JSON object format.
 - `json`: `string` : Parsed `.dbs` file in pretty-printed JSON format (non-object).

***
#### Database
Extrapolation of the DbSchema `Project` object.  Assumes all schemas are contained within a single database.
##### Properties
 - `parser`: `Parser` : Reference to parent Parser object.
 - `project`: `object` : Reference to raw DbSchema object in JSON object format.
 - `name`: `string` : Name of database.
 - `id`: `string` : ID of Project, as supplied by DbSchema.
 - `template`: `string` : Template of Project, as supplied by DbSchema.
 - `type`: `string` : Database type (ie, MySql, MariaDb, MongoDb, etc.).
 - `schemas`: `array[Schema]` : Array of Schema objects contained within Database

***
#### Schema
##### Properties
 - `database`: `Database`: Reference to parent Database object.
 - `schema`: `object`: Reference to raw DbSchema object in JSON object format.
 - `name`: `string`: Name of schema.
 - `tables`: `array[Table]`: Array of Table objects contained within Database.
 - `views`: `array[Table]`: Array of Table objects contained within Database.

***
#### Table
**Note**: Due to the near-identical structure of both, the Table object is used for both tables **and views**.
##### Properties
 - `schema`: `Schema`: Reference to parent Schema object.
 - `table`: `object`: Reference to raw DbSchema object in JSON object format.
 - `name`: `string`: Name of table or view.
 - `keyColumns`: `array[Column]`: Array of Column objects within this primary key Table Index.
 - `isView`: `boolean`: Indicates whether the table is actually a view.
 - `columns`: `array[Column]`: Array of Column objects contained within the Table.
 - `indices`: `array[TableIndex]`: Array of Table Index objects contained within the Table.

***
#### Column
##### Properties
 - `table`: `Table`: Reference to parent Table object.
 - `column`: `object`: Reference to raw DbSchema object in JSON object format.
 - `name`: `string`: Name of column.
 - `type`: `string`: Type of column.
 - `length`: `number`: If supplied, the length of the column.
 - `jt`: `number`: (See DbSchema documentation.)
 - `isPrimary`: `boolean`: Column a member of the primary key index.
 - `mandatory`: `boolean`: Column is required or `NOT NULL`
 - `relationships`: `array[Column]`: **(not required)** Any columns referencing this column in a foreign key.
 - `parent`: `object`: **(not required)** The target PK column if a foreign key exists:

 ```
 parent: {
     schema: {
         name: '',
         item:
     },
     table: {
         name: '',
         item:
     },
     column: {
         name: '',
         item:
     }
 }
 ```

***
#### Table Index
##### Properties
 - `table`: `Table`: Reference to parent Table object.
 - `index`: `object`: Reference to raw DbSchema object in JSON object format.
 - `name`: `string`: Name of index (usually generated by database or DbSchema).
 - `columns`: `array[Column]`: Array of Column objects within this index.
 - `type`: `string`: Type name, as supplied by DbSchema (ie, `NORMAL`, `PRIMARY_KEY`, `UNIQUE`, etc.).
 - `isUnique`: `boolean`: Indicates if the column combination must be unique (also true for the primary key).
 - `isPrimary`: `boolean`: Table Index is the primary key.


## Operations
Generally speaking, the Parser is meant to be used for navigating, or "walking", the DbSchema-generated hierarchy.  However, for convenience, one operation is available:

### print(spacing)  
Prints the hierarchy in a human-readable YML-like indented structure:
```
Database: resources
    Schema: geography
        Table: city
            Column: id
                Relationships:
                    resources.geography.postal_code.city_id
            Column: state_id
                Primary:
                    Schema: geography
                    Table:  state
                    Column: id
            Column: name
            Index: idx_city (UNIQUE)
                Column: state_id
                    Primary:
                        Schema: geography
                        Table:  state
                        Column: id
                Column: name
            Index: idx_city_0 (NORMAL)
                Column: state_id
                    Primary:
                        Schema: geography
                        Table:  state
                        Column: id
            Index: pk_city (PRIMARY_KEY)
                Column: id
        Table: country
            Column: id
                Relationships:
                    resources.geography.postal_code.country_id
                    resources.geography.state.country_id
            Column: name
            Index: idx_country (UNIQUE)
                Column: name
            Index: pk_country (UNIQUE)
                Column: id
        Table: postal_code
            Column: id
            Column: country_id
                Primary:
                    Schema: geography
                    Table:  country
                    Column: id
            Column: state_id
                Primary:
                    Schema: geography
                    Table:  state
                    Column: id
            Column: city_id
                Primary:
                    Schema: geography
                    Table:  city
                    Column: id
            Column: value
            Index: pk_postal_code (PRIMARY_KEY)
                Column: id
            Index: idx_postal_code (UNIQUE)
                Column: country_id
                    Primary:
                        Schema: geography
                        Table:  country
                        Column: id
                Column: state_id
                    Primary:
                        Schema: geography
                        Table:  state
                        Column: id
                Column: city_id
                    Primary:
                        Schema: geography
                        Table:  city
                        Column: id
                Column: value
            Index: idx_postal_code_0 (NORMAL)
                Column: country_id
                    Primary:
                        Schema: geography
                        Table:  country
                        Column: id
            Index: idx_postal_code_1 (NORMAL)
                Column: state_id
                    Primary:
                        Schema: geography
                        Table:  state
                        Column: id
            Index: idx_postal_code_2 (NORMAL)
                Column: city_id
                    Primary:
                        Schema: geography
                        Table:  city
                        Column: id
        Table: state
            Column: id
                Relationships:
                    resources.geography.city.state_id
                    resources.geography.postal_code.state_id
            Column: country_id
                Primary:
                    Schema: geography
                    Table:  country
                    Column: id
            Column: name
            Index: idx_state (UNIQUE)
                Column: country_id
                    Primary:
                        Schema: geography
                        Table:  country
                        Column: id
                Column: name
            Index: idx_state_0 (NORMAL)
                Column: country_id
                    Primary:
                        Schema: geography
                        Table:  country
                        Column: id
            Index: pk_state_0 (PRIMARY_KEY)
                Column: id
```

## About MEAN Factory

MEAN Factory is an initiative to help teach software development focusing on the MEAN Stack (Mongo, ExpressJS, AngularJS, NodeJS).  For more information, visit our web site or email us:  

[http://meanfactory.com](http://www.meanfactory.com)  
[info@meanfactory.com](mailto:info@meanfactory.com)  
