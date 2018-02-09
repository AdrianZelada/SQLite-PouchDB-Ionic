
Ver post [Integración SQLite 3 con PouchDB y Ionic 3](https://medium.com/mycodebad/integraci%C3%B3n-sqlite-3-con-pouchdb-y-ionic-3-f1d5768d0c0b)

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

