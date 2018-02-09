
View post 
```
$ npm install
$ ionic cordova platform add android
$ ionic cordova platform add ios
```

Go to 

```
node_modules/pouchdb-adapter-cordova-sqlite/lib/index
```

Replace

```javascript
var WebSqlPouchCore = require('pouchdb-adapter-websql-core');
// for
var WebSqlPouchCore = require('pouchdb-adapter-websql-core').default;
```

Run App

```
$ ionic cordova run android
```

