# Light Weight `promised` based `IndexedDB` wrapper

As we already know that indexedDB is an event-driven system. Everything in indexedDB is an event that makes it very difficult to work with as well as very difficult to write production-ready code using native indexedDB because the event-driven system is very error-prone.

On the other side, indexed-PDB makes it very easy to use the indexedDB as it wraps the native code to promise. Which makes it very easy to use and understand and also ready to use in the larger codebase.

# Code comparision
Below is the indexedDB code of reading all rows from the `objectStore` using the cursor.
```js

var db;
var request = indexedDB.open("MyTestDatabase");

request.onerror = function (event) {
    console.log("Why didn't you allow my web app to use IndexedDB?!");
};

request.onsuccess = function (event) {
    db = event.target.result;
    // Handling Errors
    db.onerror = function (event) {
        // Generic error handler for all errors targeted at this database's
        // requests!
        console.error("Database error: " + event.target.errorCode);
    };

    // open the transaction
    var transaction = db.transaction(["customers"], "readwrite");
    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
        console.log("All done!");
    };

    transaction.onerror = function (event) {
        // Don't forget to handle errors!
    };

    var objectStore = transaction.objectStore("customers");

    var customers = [];

    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            customers.push(cursor.value);
            cursor.continue();
        }
        else {
            console.log("Got all customers: " + customers);
        }
    };
};

```

And below is the indexed-PDB code of reading all rows from the `objectStore` using the cursor.

```js

import { openDB } from 'indexed-pdb'

(async () => {
    try {
        const db = await openDB('MyTestDatabase')
        var objectStore = db.transaction(["customers"], "readwrite").objectStore("customers");
        var customers = [];

        await objectStore.openCursor().then(function push_item(cursor) {
            if (!cursor) {
                return
            }
            customers.push(cursor.value)
            return cursor.continue().then(push_item)
        })

        console.log("Got all customers: " + customers);
        
    } catch (error) {
        console.log(error, 'any error during the process');
    }

})()

```
As you can see indexed-PDB is easy to understand and also there are very few lines of code.

# Install

Clearly you can't use indexedDB in the node environment. But if you want to emulate the behavior in the NodeJs environment then you can use fake-indexeddb

We currently do not support the emulation in the NodeJs environment and I don't think you should use fake-indexeddb in nodeJs env.

## Setting up in WebApp

Using indexed-pdb in the web app ( Angular, React, or Vue.js ) is pretty straight forward.

`npm i indexed-pdb`

After installing it from the npm registry just import it into your working project

`import { openDB } from 'indexed-pdb'`

## Using Directly In a browser

### Using the modules method directly via unpkg:
```js

<script type="module">
  import { openDB} from 'https://unpkg.com/indexed-pdb?module';

  async function doDatabaseStuff() {
    const db = await openDB(…);
  }
</script>

```

### Using external script reference

```js

<script src="https://unpkg.com/indexed-pdb@1.0.10/build/iife/index-min.js"></script>
<script>
  async function doDatabaseStuff() {
    const db = await ipdb.openDB(…);
  }
</script>

```

# API

## `openDB`

This method opens a database, and returns a promise for an enhanced [`IDBDatabase`](https://w3c.github.io/IndexedDB/#database-interface).

```js

(
    async function () {
        const database = openDB(db_name, version, function upgradeCallback (upgradeDB) {
            // create new object store here...
        })
    }
)()

```

- `name` : Name of the database 
- `version` : Schema version, or `undefined` to open the current version.
- `upgradeCallback` (optional) : Called if this version of the database has never been opened before. Use it to specify the schema for the database. This is similar to the [`upgradeneeded` event](https://developer.mozilla.org/en-US/docs/Web/API/IDBOpenDBRequest/upgradeneeded_event) in plain IndexedDB.
- `database` : An enhanced `IDBDatabase`. ( IDBDatabaseWrapper)
- `upgradeDB` : An enhanced `IDBDatabase`. Use this to create new object store on the upgraded database.

## `IDBDatabaseWrapper`

A object returned from the openDB.

### Properties

`IDBDatabaseWrapper.name` - (**Read only**)


A DOMString that contains the name of the connected database.


`IDBDatabaseWrapper.version` - (**Read only**)


A 64-bit integer that contains the version of the connected database. When a database is first created, this attribute is an empty string.


`IDBDatabaseWrapper.objectStoreNames` - ( **Read only**)


A DOMStringList that contains a list of the names of the object stores currently in the connected database.

---

### Methods


`IDBDatabaseWrapper.close()`
@return - `void`

Returns immediately and closes the connection to a database in a separate thread.The connection is not actually closed until all transactions created using this connection are complete. No new transactions can be created for this connection once this method is called. Methods that create transactions throw an exception if a closing operation is pending.


`IDBDatabaseWrapper.createObjectStore()` @return `IDBObjectStoreWrapper`

Creates a new object store with the given name and options and returns a new `IDBObjectStoreWrapper`. Throws a `InvalidStateError` DOMException if not called within an upgrade transaction.


`IDBDatabaseWrapper.deleteObjectStore(name)` @return `void`

- `name` : Name of the object store to delete.

Deletes the object store with the given name. Throws a "InvalidStateError" DOMException if not called within an upgrade transaction.


`IDBDatabaseWrapper.transaction(storeNames, mode)` @return `IDBTransactionWrapper`

- `storeNames` : Array of store names to open the transaction on.
- `mode ( optional)` :  Provide one of the value from  "readonly" | "readwrite" | "versionchange". If you want to just read data from `objectStore` then use "readonly" , If you want to insert new data to `objectStore` then use  "readwrite" and if you want to add new index or change index on the `objectStore` then use  "versionchange".

Immediately returns a transaction object (IDBTransactionWrapper) containing the `IDBTransactionWrapper.objectStore` method, which you can use to access your object store. Runs in a separate thread.










