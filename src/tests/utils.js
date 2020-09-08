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


module.exports = {
    connect_to_database,
    create_new_table,
    add_new_single_row_to_table,
    read_single_row_from_table,
    update_single_row_to_table
}