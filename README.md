#A Light-Weight Promised Based Indexed-DB Wrapper

This package provide you with the ability to use the indexedDB web database with **Promise**. Which dramatically improve the code readablity as well as **callback hell** 

##How to use

### Using NPM

`npm i --save indexed-pdb`

Once installed you can import it in your working project using modern import method `import`

```JavaScript
import { openDB } from 'indexed-pdb'

const database = await openDB('test_database', 1, function (upgradeDB) {
        if (!upgradeDB.objectStoreNames.contains('test_table')) {
            // create new table
            // table do not already exit
            upgradeDB.createObjectStore('test_table', { keyPath: 'id', autoIncrement: true })
        }
  })
  
  // To do any operation with your database you must first open the Transaction ( standard IndexedDB requirement)
  // open the transaction 
  const tnx = database.transaction(['test_table'], 'readwrite' )
  
  // Access your object store ( SQL -Table) using the tnx method called as `objectStore('table name')`
  const test_object_store = tnx.objectStore('test_table')
  
```
