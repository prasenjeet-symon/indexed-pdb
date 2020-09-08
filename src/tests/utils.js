async function connect_to_database(database_name) {
    return ipdb.openDB(database_name, 1)
}

function create_new_table(database_name, table_name) {
    return new Promise((resolve, reject) => {
        ipdb.openDB(database_name, 2, function (upgradeDB) {
            if (upgradeDB) {
                if (!upgradeDB.objectStoreNames.contains(table_name)) {
                    // table do not exit 
                    // create new table
                    const object_store_wrapper = upgradeDB.createObjectStore(table_name, { keyPath: 'id', autoIncrement: true })
                    if (object_store_wrapper) {
                        resolve('created')
                    } else {
                        reject('some problem with table creation')
                    }
                } else {
                    reject('table already exit into database, try new table name')
                }
            } else {
                reject("can't create the table into database")
            }
        })
    })
}


async function add_new_single_row_to_table(data, database_name, table_name) {
    const database = await ipdb.openDB(database_name, 2)
    const tnx = database.transaction(table_name, 'readwrite')
    const test_object_store = tnx.objectStore(table_name)
    const primary_key_created = await test_object_store.add(data)
    if (primary_key_created) {
        return primary_key_created
    } else {
        return false
    }
}


async function read_single_row_from_table(primary_key, database_name, table_name) {
    const database = await ipdb.openDB(database_name, 2)
    const tnx = database.transaction(table_name, 'readwrite')
    const test_object_store = tnx.objectStore(table_name)
    const row_data = await test_object_store.get(+primary_key)
    if (row_data) {
        return row_data
    } else {
        return null
    }
}

async function update_single_row_to_table(data, database_name, table_name) {
    const database = await ipdb.openDB(database_name, 2)
    const tnx = database.transaction(table_name, 'readwrite')
    const test_object_store = tnx.objectStore(table_name)
    const updated_row_primary_key = await test_object_store.put(data)
    if (updated_row_primary_key > -1) {
        return updated_row_primary_key
    } else {
        return null
    }
}


async function get_all_rows_from_the_table(database_name, table_name) {
    const database = await ipdb.openDB(database_name, 2)
    const tnx = database.transaction(table_name, 'readwrite')
    const test_object_store = tnx.objectStore(table_name)
    const all_rows = await test_object_store.getAll()
    return all_rows
}


async function delete_single_row_from_table(database_name, table_name, primary_key) {
    const database = await ipdb.openDB(database_name, 2)
    const tnx = database.transaction(table_name, 'readwrite')
    const test_object_store = tnx.objectStore(table_name)
    const delete_status = await test_object_store.delete(primary_key)
    return delete_status
}

async function add_multiple_rows_at_time(database_name, table_name, data) {
    const database = await ipdb.openDB(database_name, 2)
    const tnx = database.transaction(table_name, 'readwrite')
    const test_object_store = tnx.objectStore(table_name)
    const primary_keys = await test_object_store.addAll(data)
    return primary_keys
}

async function fetch_all_rows_using_cursor(database_name, table_name) {
    const database = await ipdb.openDB(database_name, 2)
    const tnx = database.transaction(table_name, 'readwrite')
    const test_object_store = tnx.objectStore(table_name)
    const all_rows = []
    await test_object_store.openCursor().then(function get_item(cursor){
        if(!cursor){
            console.log('null cursor')
            return
        }
        all_rows.push(cursor.value)
        return cursor.continue().then(get_item)
    })

    return all_rows
}


module.exports = {
    connect_to_database,
    create_new_table,
    add_new_single_row_to_table,
    read_single_row_from_table,
    update_single_row_to_table,
    get_all_rows_from_the_table,
    delete_single_row_from_table,
    add_multiple_rows_at_time,
    fetch_all_rows_using_cursor
}