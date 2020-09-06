# A Light-Weight Promised Based Indexed-DB Wrapper

This package provide you with the ability to use the indexedDB web database with **Promise**. Which dramatically improve the code readablity as well as **callback hell** 

## How to use

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
  
  // add new  row to the table
  const data_to_insert = { name: 'Prasenjeet Symon' age: 14, gender: 'Male', }
  const primary_key_created = await test_object_store.add(data_to_insert)
  
  // update the row in the table
  
  const data_to_update_with = { name: 'Prasenjeet Symon' age: 14, gender: 'Other' ,}
  const updated_row_primary_key = await test_object_store.put(data_to_update_with, primary_key_created)
  
  
  // access the data from table
  // access the single row from the table given the primary key
  const row_data = await test_object_store.get(primary_key_created) // row_data = { name: 'Prasenjeet Symon' age: 14, gender: 'Other' ,}
  
  // to get all the rows from the table
  const all_rows = await test_object_store.getAll()
  
  // delete the row in the table
  const delete_status = await test_object_store.delete(primary_key_created) // delete_status = 'OK'
  
  // abort the connection 
  // optional
  tnx.abort()
  
```

## Typescript Config
Make sure your typescript config contain this field
`"importHelpers": true`
`"moduleResolution": "node"`

### To know more about the methods and property that you access Visit : - [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Basic_Concepts_Behind_IndexedDB)
