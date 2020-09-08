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

module.exports = {
    connect_to_database,
    create_new_table
}