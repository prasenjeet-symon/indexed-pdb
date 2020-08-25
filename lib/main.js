function isIndexDbSupported() {
    if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        return false;
    }
    else {
        console.log('supported IndexedDb');
        return true;
    }
}
function is_number_float(data) {
    const found_period = data.toString().includes('.');
    if (found_period) {
        // posibility of the floating number
        return true;
    }
    else {
        // check if the given number is number
        return isNaN(Number(data));
    }
}
class IDBTransactionWrapper {
    constructor(IDBTransaction) {
        this.IDBTransaction = IDBTransaction;
        this.db = new IDBDatabaseWrapper(IDBTransaction.db);
        this.error = IDBTransaction.error;
        this.mode = IDBTransaction.mode;
        this.objectStoreNames = IDBTransaction.objectStoreNames;
        this.event_abort = new Promise((resolve, reject) => {
            this.IDBTransaction.onabort = () => {
                resolve(true);
            };
        });
        this.event_error = new Promise((resolve, reject) => {
            this.IDBTransaction.onerror = () => {
                resolve(true);
            };
        });
        this.event_complete = new Promise((resolve, reject) => {
            this.IDBTransaction.oncomplete = () => {
                resolve(true);
            };
        });
    }
    /** Aborts the transaction. All pending requests will fail with a "AbortError" DOMException and all changes made to the database will be reverted. */
    abort() {
        return this.IDBTransaction.abort();
    }
    /** Returns an IDBObjectStore in the transaction's scope. */
    objectStore(name) {
        return new IDBObjectStoreWrapper(this.IDBTransaction.objectStore(name));
    }
}
class IDBIndexWrapper {
    constructor(IDBIndex) {
        this.IDBIndex = IDBIndex;
        this.name = IDBIndex.name;
        this.objectStore = new IDBObjectStoreWrapper(IDBIndex.objectStore);
        this.keyPath = IDBIndex.keyPath;
        this.multiEntry = IDBIndex.multiEntry;
        this.unique = IDBIndex.unique;
    }
    /** Returns an IDBRequest object, and in a separate thread, returns the number of records within a key range.
     *
     * If successful, request's result will be the count.
     */
    count(key) {
        const request = this.IDBIndex.count(key);
        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while counting number of record in indexed object store called - ${this.name}`);
            };
        });
    }
    /**
     * Retrieves the value of the first record matching the given key or key range in query.

     * If successful, request's result will be the value, or undefined if there was no matching record.

     * Returns an IDBRequest object, and, in a separate thread, finds either the value in the referenced object store that corresponds to the given key or the first corresponding value, if key is an IDBKeyRange.
    */
    get(key) {
        const request = this.IDBIndex.get(key);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while retriving  records in indexed object store called - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    /**
     * Retrieves the key of the first record matching the given key or key range in query.
     * If successful, request's result will be the key, or undefined if there was no matching record.
    */
    getKey(key) {
        const request = this.IDBIndex.getKey(key);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while getting key in indexed object store called - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    /**
     * Retrieves the values of the records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the values.
     * */
    getAll(query, count) {
        const request = this.IDBIndex.getAll(query, count);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while retriving all records in indexed object store called - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    /**
     * Retrieves the keys of records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the keys. */
    getAllKeys(query, count) {
        const request = this.IDBIndex.getAllKeys(query, count);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while retriving all keys in indexed object store called - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    /**
     * Opens a cursor over the records matching query, ordered by direction. If query is null, all records in index are matched.
     *
     * If successful, request's result will be an IDBCursorWithValue, or null if there were no matching records.
     */
    openCursor(query, direction) {
        const request = this.IDBIndex.openCursor(query, direction);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while opening cursor on indexed object store called - ${this.name}`);
            };
            request.onsuccess = (event) => {
                // todo make the IDBCursorWithValue wrapper
                resolve(event.target.result);
            };
        });
    }
    /** Opens a cursor with key only flag set over the records matching query, ordered by direction. If query is null, all records in index are matched.
     *
     * If successful, request's result will be an IDBCursor, or null if there were no matching records. */
    openKeyCursor(query, direction) {
        const request = this.IDBIndex.openKeyCursor(query, direction);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while opening key cursor on indexed object store called - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
}
class IDBObjectStoreWrapper {
    constructor(IDBObjectStore) {
        this.IDBObjectStore = IDBObjectStore;
        this.indexNames = IDBObjectStore.indexNames;
        this.keyPath = IDBObjectStore.keyPath;
        this.name = IDBObjectStore.name;
        this.transaction = new IDBTransactionWrapper(IDBObjectStore.transaction);
        this.autoIncrement = IDBObjectStore.autoIncrement;
    }
    /**
     Adds or updates a record in store with the given value and key.

    If the store uses in-line keys and key is specified a "DataError" DOMException will be thrown.

    If put() is used, any existing record with the key will be replaced. If add() is used, and if a record with the key already exists the request will fail, with request's error set to a "ConstraintError" DOMException.

    If successful, request's result will be the record's key.
    */
    add(value, key, transactionCallback) {
        const request = this.IDBObjectStore.add(value, key);
        if (transactionCallback) {
            transactionCallback(new IDBTransactionWrapper(request.transaction));
        }
        return new Promise((resolve, reject) => {
            request.onsuccess = (result) => {
                resolve(result.target.result);
            };
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while adding new data to object store called - ${this.name}`);
            };
        });
    }
    /**
    Creates and immediately returns an IDBRequest object, and clears this object store in a separate thread. This is for deleting all current records out of an object store.

    If successful, request's result will be undefined.
    */
    clear() {
        const request = this.IDBObjectStore.clear();
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while clearing all the data from the object store called - ${this.name}`);
            };
            request.onsuccess = (result) => {
                if (!result.target.result) {
                    resolve('DONE');
                }
                else {
                    reject('ERR');
                }
            };
        });
    }
    /**
    Returns an IDBRequest object, and, in a separate thread, returns the total number of records that match the provided key or IDBKeyRange.
    
    If no arguments are provided, it returns the total number of records in the store.
    */
    count(key) {
        const request = this.IDBObjectStore.count(key);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while counting all record from the object store called - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    /**
     * Creates a new index in store with the given name, keyPath and options and returns a new IDBIndex. If the keyPath and options define constraints that cannot be satisfied with the data already in store the upgrade transaction will abort with a "ConstraintError" DOMException.
     *
     * Throws an "InvalidStateError" DOMException if not called within an upgrade transaction.
    */
    createIndex(name, keyPath, options) {
        return new IDBIndexWrapper(this.IDBObjectStore.createIndex(name, keyPath, options));
    }
    /** Deletes records in store with the given key or in the given key range in query.
     *
     * If successful, request's result will be undefined. */
    delete(key) {
        const request = this.IDBObjectStore.delete(key);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while deleting the row from the object store called - ${this.name}`);
            };
            request.onsuccess = (event) => {
                if (!event.target.result) {
                    resolve('OK');
                }
            };
        });
    }
    /** Deletes the index in store with the given name.
     *
     * Throws an "InvalidStateError" DOMException if not called within an upgrade transaction. */
    deleteIndex(name) {
        return this.IDBObjectStore.deleteIndex(name);
    }
    /** Retrieves the value of the first record matching the given key or key range in query.
     *
     * If successful, request's result will be the value, or undefined if there was no matching record. */
    get(query) {
        const request = this.IDBObjectStore.get(query);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while geting the row from the object store called - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    /** Retrieves the key of the first record matching the given key or key range in query.
     *
     * If successful, request's result will be the key, or undefined if there was no matching record. */
    getKey(query) {
        const request = this.IDBObjectStore.getKey(query);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while geting key from the object store called - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    /** Retrieves the values of the records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the values. */
    getAll(query, count) {
        const request = this.IDBObjectStore.getAll(query, count);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while geting all keys from the object store called - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    /**  Retrieves the keys of records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the keys.*/
    getAllKeys(query, count) {
        const request = this.IDBObjectStore.getAllKeys(query, count);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while getting all keys from the object store - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    /** Opens an index from this object store after which it can, for example, be used to return a sequence of records sorted by that index using a cursor. */
    index(name) {
        const request = new IDBIndexWrapper(this.IDBObjectStore.index(name));
        return request;
    }
    /** Opens a cursor over the records matching query, ordered by direction. If query is null, all records in store are matched.
     *
     * If successful, request's result will be an IDBCursorWithValue pointing at the first matching record, or null if there were no matching records. */
    openCursor(query, direction) {
        const request = this.IDBObjectStore.openCursor(query, direction);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while opeing the cursor from the object store - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    /** Opens a cursor with key only flag set over the records matching query, ordered by direction. If query is null, all records in store are matched.
     *
     * If successful, request's result will be an IDBCursor pointing at the first matching record, or null if there were no matching records. */
    openKeyCursor(query, direction) {
        const request = this.IDBObjectStore.openKeyCursor(query, direction);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while opeing the key cursor from the object store - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
    /** Adds or updates a record in store with the given value and key.
     *
     * If the store uses in-line keys and key is specified a "DataError" DOMException will be thrown
     *
     * If put() is used, any existing record with the key will be replaced. If add() is used, and if a record with the key already exists the request will fail, with request's error set to a "ConstraintError" DOMException.
     * If successful, request's result will be the record's key.
     *  */
    put(value, key) {
        const request = this.IDBObjectStore.put(value, key);
        return new Promise((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault();
                err.stopPropagation();
                reject(`${err} - Error while putting value to the object store - ${this.name}`);
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }
}
class IDBDatabaseWrapper {
    constructor(IDBDatabase) {
        this.IDBDatabase = IDBDatabase;
        this.name = IDBDatabase.name;
        this.version = IDBDatabase.version;
        this.objectStoreNames = IDBDatabase.objectStoreNames;
    }
    /**
    The close() method of the IDBDatabase interface returns immediately and closes the connection in a separate thread.

    The connection is not actually closed until all transactions created using this connection are complete.
    No new transactions can be created for this connection once this method is called.
    Methods that create transactions throw an exception if a closing operation is pending.
    */
    close() {
        return this.IDBDatabase.close();
    }
    /**
    Creates a new object store with the given name and options and returns a new IDBObjectStore.

    Throws a "InvalidStateError" DOMException if not called within an upgrade transaction.
    */
    createObjectStore(name, optionalParameters) {
        return new IDBObjectStoreWrapper(this.IDBDatabase.createObjectStore(name, optionalParameters));
    }
    /** Deletes the object store with the given name.
     *
     * Throws a "InvalidStateError" DOMException if not called within an upgrade transaction. */
    deleteObjectStore(name) {
        return this.IDBDatabase.deleteObjectStore(name);
    }
    /** Immediately returns a transaction object (IDBTransaction) containing the IDBTransaction.objectStore method, which you can use to access your object store. Runs in a separate thread. */
    transaction(storeNames, mode) {
        return new IDBTransactionWrapper(this.IDBDatabase.transaction(storeNames, mode));
    }
}
/** Open the database connection to IndexDB */
export function openDB(database_name, version, upgradeCallback) {
    return new Promise((resolve, reject) => {
        if (isIndexDbSupported()) {
            if (is_number_float(version)) {
                reject('Invalid Version Number | Only Integer is supported');
            }
            else {
                // version number is ok
                // open the database connection
                const request = indexedDB.open(database_name, version);
                // after onupgradeneeded this event will fire
                request.onsuccess = (result) => {
                    resolve(new IDBDatabaseWrapper(result.target.result));
                };
                request.onerror = (err) => {
                    reject(`${err} - Error while connecting to database`);
                };
                // after completion of this event and callback onSuccess will be called
                request.onupgradeneeded = (result) => {
                    if (upgradeCallback) {
                        upgradeCallback(new IDBDatabaseWrapper(result.target.result));
                    }
                };
            }
        }
        else {
            reject('Not supported browser');
        }
    });
}
//# sourceMappingURL=main.js.map