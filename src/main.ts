type ArrayBufferLike = ArrayBufferTypes[keyof ArrayBufferTypes];
interface ArrayBufferView {
    /**
     * The ArrayBuffer instance referenced by the array.
     */
    buffer: ArrayBufferLike;

    /**
     * The length in bytes of the array.
     */
    byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    byteOffset: number;
}

/** A key range can be a single value or a range with upper and lower bounds or endpoints. If the key range has both upper and lower bounds, then it is bounded; if it has no bounds, it is unbounded. A bounded key range can either be open (the endpoints are excluded) or closed (the endpoints are included). To retrieve all keys within a certain range, you can use the following code constructs: */
interface IDBKeyRange {
    /**
     * Returns lower bound, or undefined if none.
     */
    readonly lower: any;
    /**
     * Returns true if the lower open flag is set, and false otherwise.
     */
    readonly lowerOpen: boolean;
    /**
     * Returns upper bound, or undefined if none.
     */
    readonly upper: any;
    /**
     * Returns true if the upper open flag is set, and false otherwise.
     */
    readonly upperOpen: boolean;
    /**
     * Returns true if key is included in the range, and false otherwise.
     */
    includes(key: any): boolean;
}


/** A type returned by some APIs which contains a list of DOMString (strings). */
interface DOMStringList {
    /**
     * Returns the number of strings in strings.
     */
    readonly length: number;
    /**
     * Returns true if strings contains string, and false otherwise.
     */
    contains(string: string): boolean;
    /**
     * Returns the string with index index from strings.
     */
    item(index: number): string | null;
    [index: number]: string;
}



function isIndexDbSupported() {
    if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        return false
    } else {
        console.log('supported IndexedDb')
        return true
    }
}

function is_number_float(data: number) {
    const found_period = data.toString().includes('.')
    if (found_period) {
        // posibility of the floating number
        return true

    } else {
        // check if the given number is number
        return isNaN(Number(data))
    }
}


class IDBTransactionWrapper {
    /** Returns the transaction's connection. */
    public readonly db: IDBDatabaseWrapper

    /** f the transaction was aborted, returns the error (a DOMException) providing the reason. */
    public readonly error: DOMException

    /** Returns the mode the transaction was created with ("readonly" or "readwrite"), or "versionchange" for an upgrade transaction. */
    public readonly mode: IDBTransactionMode

    /** Returns a list of the names of object stores in the transaction's scope. For an upgrade transaction this is all object stores in the database. */
    public readonly objectStoreNames: DOMStringList

    public readonly event_abort: Promise<boolean>
    public readonly event_error: Promise<boolean>
    public readonly event_complete: Promise<boolean>

    constructor(private IDBTransaction: IDBTransaction) {
        this.db = new IDBDatabaseWrapper(IDBTransaction.db)
        this.error = IDBTransaction.error
        this.mode = IDBTransaction.mode
        this.objectStoreNames = IDBTransaction.objectStoreNames
        this.event_abort = new Promise<boolean>((resolve, reject) => {
            this.IDBTransaction.onabort = () => {
                resolve(true)
            }
        })

        this.event_error = new Promise<boolean>((resolve, reject) => {
            this.IDBTransaction.onerror = () => {
                resolve(true)
            }
        })

        this.event_complete = new Promise<boolean>((resolve, reject) => {
            this.IDBTransaction.oncomplete = () => {
                resolve(true)
            }
        })
    }

    /** Aborts the transaction. All pending requests will fail with a "AbortError" DOMException and all changes made to the database will be reverted. */
    public abort() {
        return this.IDBTransaction.abort()
    }

    /** Returns an IDBObjectStore in the transaction's scope. */
    public objectStore(name: string) {
        return new IDBObjectStoreWrapper(this.IDBTransaction.objectStore(name))
    }

}

class IDBIndexWrapper {
    /**  Returns the name of the index. */
    public name: string

    /** The name of the object store referenced by this index. */
    public readonly objectStore: IDBObjectStoreWrapper

    /** The key path of this index. If null, this index is not auto-populated. */
    public readonly keyPath: string | string[]

    /** Affects how the index behaves when the result of evaluating the index's key path yields an array. If true, there is one record in the index for each item in an array of keys. If false, then there is one record for each key that is an array.*/
    public readonly multiEntry: boolean

    /** If true, this index does not allow duplicate values for a key. */
    public readonly unique: boolean

    constructor(private IDBIndex: IDBIndex) {
        this.name = IDBIndex.name
        this.objectStore = new IDBObjectStoreWrapper(IDBIndex.objectStore)
        this.keyPath = IDBIndex.keyPath
        this.multiEntry = IDBIndex.multiEntry
        this.unique = IDBIndex.unique
    }

    /** Returns an IDBRequest object, and in a separate thread, returns the number of records within a key range.
     * 
     * If successful, request's result will be the count.
     */
    public count(key?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | undefined) {
        const request = this.IDBIndex.count(key)
        return new Promise<number>((resolve, reject) => {
            request.onsuccess = (event: any) => {
                resolve(event.target.result)
            }
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while counting number of record in indexed object store called - ${this.name}`)
            }
        })
    }

    /**
     * Retrieves the value of the first record matching the given key or key range in query.

     * If successful, request's result will be the value, or undefined if there was no matching record.

     * Returns an IDBRequest object, and, in a separate thread, finds either the value in the referenced object store that corresponds to the given key or the first corresponding value, if key is an IDBKeyRange.
    */
    public get(key: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange) {
        const request = this.IDBIndex.get(key)
        return new Promise<any>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while retriving  records in indexed object store called - ${this.name}`)
            }
            request.onsuccess = (event: any) => {
                resolve(event.target.result as any)
            }
        })
    }

    /** 
     * Retrieves the key of the first record matching the given key or key range in query.
     * If successful, request's result will be the key, or undefined if there was no matching record.
    */
    public getKey(key: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange) {
        const request = this.IDBIndex.getKey(key)
        return new Promise<string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | undefined>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while getting key in indexed object store called - ${this.name}`)
            }
            request.onsuccess = (event: any) => {
                resolve(event.target.result as string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | undefined)
            }
        })
    }

    /** 
     * Retrieves the values of the records matching the given key or key range in query (up to count if given).
     * 
     * If successful, request's result will be an Array of the values. 
     * */
    public getAll(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, count?: number | undefined) {
        const request = this.IDBIndex.getAll(query, count)
        return new Promise<any[]>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while retriving all records in indexed object store called - ${this.name}`)
            }
            request.onsuccess = (event: any) => {
                resolve(event.target.result as any[])
            }
        })
    }

    /** 
     * Retrieves the keys of records matching the given key or key range in query (up to count if given).
     * 
     * If successful, request's result will be an Array of the keys. */
    public getAllKeys(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, count?: number | undefined) {
        const request = this.IDBIndex.getAllKeys(query, count)
        return new Promise<IDBValidKey[]>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while retriving all keys in indexed object store called - ${this.name}`)
            }
            request.onsuccess = (event: any) => {
                resolve(event.target.result as IDBValidKey[])
            }
        })
    }

    /**
     * Opens a cursor over the records matching query, ordered by direction. If query is null, all records in index are matched.
     * 
     * If successful, request's result will be an IDBCursorWithValue, or null if there were no matching records.
     */
    public openCursor(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, direction?: "next" | "prev" | "nextunique" | "prevunique" | undefined) {
        const request = this.IDBIndex.openCursor(query, direction)
        return new Promise<IDBCursorWithValue | null>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while opening cursor on indexed object store called - ${this.name}`)
            }
            request.onsuccess = (event: any) => {
                // todo make the IDBCursorWithValue wrapper
                resolve(event.target.result as IDBCursorWithValue | null)
            }
        })
    }

    /** Opens a cursor with key only flag set over the records matching query, ordered by direction. If query is null, all records in index are matched.
     * 
     * If successful, request's result will be an IDBCursor, or null if there were no matching records. */
    public openKeyCursor(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, direction?: "next" | "prev" | "nextunique" | "prevunique" | undefined) {
        const request = this.IDBIndex.openKeyCursor(query, direction)
        return new Promise<IDBCursor | null>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while opening key cursor on indexed object store called - ${this.name}`)
            }
            request.onsuccess = (event: any) => {
                resolve(event.target.result as IDBCursor | null)
            }
        })
    }

}

class IDBObjectStoreWrapper {
    /** Returns a list of the names of indexes in the store.*/
    public readonly indexNames: DOMStringList

    /** Returns the key path of the store, or null if none. */
    public readonly keyPath: string | string[]

    /** Returns the name of the store.*/
    public name: string

    /** Returns the associated transaction. */
    public readonly transaction: IDBTransactionWrapper

    /** Returns true if the store has a key generator, and false otherwise. */
    public readonly autoIncrement: boolean

    constructor(private IDBObjectStore: IDBObjectStore) {
        this.indexNames = IDBObjectStore.indexNames
        this.keyPath = IDBObjectStore.keyPath
        this.name = IDBObjectStore.name
        this.transaction = new IDBTransactionWrapper(IDBObjectStore.transaction)
        this.autoIncrement = IDBObjectStore.autoIncrement
    }

    /** 
     Adds or updates a record in store with the given value and key.

    If the store uses in-line keys and key is specified a "DataError" DOMException will be thrown.

    If put() is used, any existing record with the key will be replaced. If add() is used, and if a record with the key already exists the request will fail, with request's error set to a "ConstraintError" DOMException.

    If successful, request's result will be the record's key.
    */
    public add(value: any, key?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | undefined, transactionCallback?: (transaction: IDBTransactionWrapper | null) => void) {
        const request = this.IDBObjectStore.add(value, key)
        if (transactionCallback) {
            transactionCallback(new IDBTransactionWrapper(request.transaction as IDBTransaction))
        }

        return new Promise<IDBValidKey>((resolve, reject) => {
            request.onsuccess = (result: any) => {
                resolve(result.target.result as IDBValidKey)
            }

            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while adding new data to object store called - ${this.name}`)
            }
        })
    }

    /**
    Creates and immediately returns an IDBRequest object, and clears this object store in a separate thread. This is for deleting all current records out of an object store.

    If successful, request's result will be undefined.
    */
    public clear() {
        const request = this.IDBObjectStore.clear()
        return new Promise<'DONE'>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while clearing all the data from the object store called - ${this.name}`)
            }
            request.onsuccess = (result: any | undefined) => {
                if (!result.target.result) {
                    resolve('DONE')
                } else {
                    reject('ERR')
                }
            }
        })
    }

    /**
    Returns an IDBRequest object, and, in a separate thread, returns the total number of records that match the provided key or IDBKeyRange.
    
    If no arguments are provided, it returns the total number of records in the store.
    */
    public count(key?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | undefined) {
        const request = this.IDBObjectStore.count(key)
        return new Promise<number>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while counting all record from the object store called - ${this.name}`)
            }
            request.onsuccess = (event: any) => {
                resolve(event.target.result as number)
            }
        })
    }

    /**
     * Creates a new index in store with the given name, keyPath and options and returns a new IDBIndex. If the keyPath and options define constraints that cannot be satisfied with the data already in store the upgrade transaction will abort with a "ConstraintError" DOMException.
     * 
     * Throws an "InvalidStateError" DOMException if not called within an upgrade transaction.
    */
    public createIndex(name: string, keyPath: string | string[], options?: IDBIndexParameters | undefined): IDBIndexWrapper {
        return new IDBIndexWrapper(this.IDBObjectStore.createIndex(name, keyPath, options))
    }

    /** Deletes records in store with the given key or in the given key range in query.
     * 
     * If successful, request's result will be undefined. */
    public delete(key: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange) {
        const request = this.IDBObjectStore.delete(key)
        return new Promise<'OK'>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while deleting the row from the object store called - ${this.name}`)
            }
            request.onsuccess = (event: any) => {
                if (!event.target.result) {
                    resolve('OK')
                }
            }
        })
    }

    /** Deletes the index in store with the given name.
     * 
     * Throws an "InvalidStateError" DOMException if not called within an upgrade transaction. */
    public deleteIndex(name: string): void {
        return this.IDBObjectStore.deleteIndex(name)
    }

    /** Retrieves the value of the first record matching the given key or key range in query.
     * 
     * If successful, request's result will be the value, or undefined if there was no matching record. */
    public get(query: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange) {
        const request = this.IDBObjectStore.get(query)
        return new Promise<any>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while geting the row from the object store called - ${this.name}`)
            }
            request.onsuccess = (event: any) => {
                resolve(event.target.result as any)
            }
        })
    }

    /** Retrieves the key of the first record matching the given key or key range in query.
     * 
     * If successful, request's result will be the key, or undefined if there was no matching record. */
    public getKey(query: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange) {
        const request = this.IDBObjectStore.getKey(query)
        return new Promise<string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | undefined>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while geting key from the object store called - ${this.name}`)
            }
            request.onsuccess = (event: any) => {
                resolve(event.target.result)
            }
        })
    }

    /** Retrieves the values of the records matching the given key or key range in query (up to count if given).
     * 
     * If successful, request's result will be an Array of the values. */
    public getAll(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, count?: number | undefined) {
        const request = this.IDBObjectStore.getAll(query, count)
        return new Promise<any[]>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while geting all keys from the object store called - ${this.name}`)
            }
            request.onsuccess = (event: any) => {
                resolve(event.target.result)
            }
        })
    }


    /**  Retrieves the keys of records matching the given key or key range in query (up to count if given).
     * 
     * If successful, request's result will be an Array of the keys.*/
    public getAllKeys(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, count?: number | undefined) {
        const request = this.IDBObjectStore.getAllKeys(query, count)
        return new Promise<IDBValidKey[]>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while getting all keys from the object store - ${this.name}`)
            }

            request.onsuccess = (event: any) => {
                resolve(event.target.result)
            }
        })
    }

    /** Opens an index from this object store after which it can, for example, be used to return a sequence of records sorted by that index using a cursor. */
    public index(name: string) {
        const request = new IDBIndexWrapper(this.IDBObjectStore.index(name))
        return request
    }

    /** Opens a cursor over the records matching query, ordered by direction. If query is null, all records in store are matched.
     * 
     * If successful, request's result will be an IDBCursorWithValue pointing at the first matching record, or null if there were no matching records. */
    public openCursor(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, direction?: "next" | "nextunique" | "prev" | "prevunique" | undefined) {
        const request = this.IDBObjectStore.openCursor(query, direction)
        return new Promise<IDBCursorWithValue | null>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while opeing the cursor from the object store - ${this.name}`)
            }

            request.onsuccess = (event: any) => {
                resolve(event.target.result)
            }
        })
    }



    /** Opens a cursor with key only flag set over the records matching query, ordered by direction. If query is null, all records in store are matched.
     * 
     * If successful, request's result will be an IDBCursor pointing at the first matching record, or null if there were no matching records. */
    public openKeyCursor(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, direction?: "next" | "nextunique" | "prev" | "prevunique" | undefined) {
        const request = this.IDBObjectStore.openKeyCursor(query, direction)
        return new Promise<IDBCursor | null>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while opeing the key cursor from the object store - ${this.name}`)
            }

            request.onsuccess = (event: any) => {
                resolve(event.target.result)
            }
        })
    }


    /** Adds or updates a record in store with the given value and key.
     * 
     * If the store uses in-line keys and key is specified a "DataError" DOMException will be thrown
     * 
     * If put() is used, any existing record with the key will be replaced. If add() is used, and if a record with the key already exists the request will fail, with request's error set to a "ConstraintError" DOMException.
     * If successful, request's result will be the record's key.
     *  */
    public put(value: any, key?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | undefined) {
        const request = this.IDBObjectStore.put(value, key)
        return new Promise<IDBValidKey>((resolve, reject) => {
            request.onerror = (err) => {
                err.preventDefault()
                err.stopPropagation()
                reject(`${err} - Error while putting value to the object store - ${this.name}`)
            }

            request.onsuccess = (event: any) => {
                resolve(event.target.result)
            }
        })
    }

}

class IDBDatabaseWrapper {
    public readonly name: string;
    public readonly version: number;
    public readonly objectStoreNames: DOMStringList

    constructor(private IDBDatabase: IDBDatabase) {
        this.name = IDBDatabase.name
        this.version = IDBDatabase.version
        this.objectStoreNames = IDBDatabase.objectStoreNames
    }

    /**
    The close() method of the IDBDatabase interface returns immediately and closes the connection in a separate thread.

    The connection is not actually closed until all transactions created using this connection are complete.
    No new transactions can be created for this connection once this method is called.
    Methods that create transactions throw an exception if a closing operation is pending.
    */
    public close(): void {
        return this.IDBDatabase.close()
    }

    /**
    Creates a new object store with the given name and options and returns a new IDBObjectStore.

    Throws a "InvalidStateError" DOMException if not called within an upgrade transaction.
    */
    public createObjectStore(name: string, optionalParameters?: IDBObjectStoreParameters | undefined) {
        return new IDBObjectStoreWrapper(this.IDBDatabase.createObjectStore(name, optionalParameters))
    }

    /** Deletes the object store with the given name.
     * 
     * Throws a "InvalidStateError" DOMException if not called within an upgrade transaction. */
    public deleteObjectStore(name: string) {
        return this.IDBDatabase.deleteObjectStore(name)
    }

    /** Immediately returns a transaction object (IDBTransaction) containing the IDBTransaction.objectStore method, which you can use to access your object store. Runs in a separate thread. */
    public transaction(storeNames: string | string[], mode?: "readonly" | "readwrite" | "versionchange" | undefined) {
        return new IDBTransactionWrapper(this.IDBDatabase.transaction(storeNames, mode))
    }
}


/** Open the database connection to IndexDB */
export function openDB(database_name: string, version: number, upgradeCallback?: (upgradeDb: IDBDatabaseWrapper) => void) {
    return new Promise<IDBDatabaseWrapper>((resolve, reject) => {
        if (isIndexDbSupported()) {
            if (is_number_float(version)) {
                reject('Invalid Version Number | Only Integer is supported')
            } else {
                // version number is ok
                // open the database connection
                const request = indexedDB.open(database_name, version)
                // after onupgradeneeded this event will fire
                request.onsuccess = (result: any) => {
                    resolve(new IDBDatabaseWrapper(result.target.result))
                }

                request.onerror = (err) => {
                    reject(`${err} - Error while connecting to database`)
                }

                // after completion of this event and callback onSuccess will be called
                request.onupgradeneeded = (result: any) => {
                    if (upgradeCallback) {
                        upgradeCallback(new IDBDatabaseWrapper(result.target.result))
                    }
                }
            }
        } else {
            reject('Not supported browser')
        }
    })
}



