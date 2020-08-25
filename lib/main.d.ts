declare type ArrayBufferLike = ArrayBufferTypes[keyof ArrayBufferTypes];
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
declare class IDBTransactionWrapper {
    private IDBTransaction;
    /** Returns the transaction's connection. */
    readonly db: IDBDatabaseWrapper;
    /** f the transaction was aborted, returns the error (a DOMException) providing the reason. */
    readonly error: DOMException;
    /** Returns the mode the transaction was created with ("readonly" or "readwrite"), or "versionchange" for an upgrade transaction. */
    readonly mode: IDBTransactionMode;
    /** Returns a list of the names of object stores in the transaction's scope. For an upgrade transaction this is all object stores in the database. */
    readonly objectStoreNames: DOMStringList;
    readonly event_abort: Promise<boolean>;
    readonly event_error: Promise<boolean>;
    readonly event_complete: Promise<boolean>;
    constructor(IDBTransaction: IDBTransaction);
    /** Aborts the transaction. All pending requests will fail with a "AbortError" DOMException and all changes made to the database will be reverted. */
    abort(): void;
    /** Returns an IDBObjectStore in the transaction's scope. */
    objectStore(name: string): IDBObjectStoreWrapper;
}
declare class IDBIndexWrapper {
    private IDBIndex;
    /**  Returns the name of the index. */
    name: string;
    /** The name of the object store referenced by this index. */
    readonly objectStore: IDBObjectStoreWrapper;
    /** The key path of this index. If null, this index is not auto-populated. */
    readonly keyPath: string | string[];
    /** Affects how the index behaves when the result of evaluating the index's key path yields an array. If true, there is one record in the index for each item in an array of keys. If false, then there is one record for each key that is an array.*/
    readonly multiEntry: boolean;
    /** If true, this index does not allow duplicate values for a key. */
    readonly unique: boolean;
    constructor(IDBIndex: IDBIndex);
    /** Returns an IDBRequest object, and in a separate thread, returns the number of records within a key range.
     *
     * If successful, request's result will be the count.
     */
    count(key?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | undefined): Promise<number>;
    /**
     * Retrieves the value of the first record matching the given key or key range in query.

     * If successful, request's result will be the value, or undefined if there was no matching record.

     * Returns an IDBRequest object, and, in a separate thread, finds either the value in the referenced object store that corresponds to the given key or the first corresponding value, if key is an IDBKeyRange.
    */
    get(key: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange): Promise<any>;
    /**
     * Retrieves the key of the first record matching the given key or key range in query.
     * If successful, request's result will be the key, or undefined if there was no matching record.
    */
    getKey(key: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange): Promise<string | number | Date | ArrayBuffer | IDBArrayKey | ArrayBufferView>;
    /**
     * Retrieves the values of the records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the values.
     * */
    getAll(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, count?: number | undefined): Promise<any[]>;
    /**
     * Retrieves the keys of records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the keys. */
    getAllKeys(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, count?: number | undefined): Promise<IDBValidKey[]>;
    /**
     * Opens a cursor over the records matching query, ordered by direction. If query is null, all records in index are matched.
     *
     * If successful, request's result will be an IDBCursorWithValue, or null if there were no matching records.
     */
    openCursor(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, direction?: "next" | "prev" | "nextunique" | "prevunique" | undefined): Promise<IDBCursorWithValue>;
    /** Opens a cursor with key only flag set over the records matching query, ordered by direction. If query is null, all records in index are matched.
     *
     * If successful, request's result will be an IDBCursor, or null if there were no matching records. */
    openKeyCursor(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, direction?: "next" | "prev" | "nextunique" | "prevunique" | undefined): Promise<IDBCursor>;
}
declare class IDBObjectStoreWrapper {
    private IDBObjectStore;
    /** Returns a list of the names of indexes in the store.*/
    readonly indexNames: DOMStringList;
    /** Returns the key path of the store, or null if none. */
    readonly keyPath: string | string[];
    /** Returns the name of the store.*/
    name: string;
    /** Returns the associated transaction. */
    readonly transaction: IDBTransactionWrapper;
    /** Returns true if the store has a key generator, and false otherwise. */
    readonly autoIncrement: boolean;
    constructor(IDBObjectStore: IDBObjectStore);
    /**
     Adds or updates a record in store with the given value and key.

    If the store uses in-line keys and key is specified a "DataError" DOMException will be thrown.

    If put() is used, any existing record with the key will be replaced. If add() is used, and if a record with the key already exists the request will fail, with request's error set to a "ConstraintError" DOMException.

    If successful, request's result will be the record's key.
    */
    add(value: any, key?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | undefined, transactionCallback?: (transaction: IDBTransactionWrapper | null) => void): Promise<IDBValidKey>;
    /**
    Creates and immediately returns an IDBRequest object, and clears this object store in a separate thread. This is for deleting all current records out of an object store.

    If successful, request's result will be undefined.
    */
    clear(): Promise<"DONE">;
    /**
    Returns an IDBRequest object, and, in a separate thread, returns the total number of records that match the provided key or IDBKeyRange.
    
    If no arguments are provided, it returns the total number of records in the store.
    */
    count(key?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | undefined): Promise<number>;
    /**
     * Creates a new index in store with the given name, keyPath and options and returns a new IDBIndex. If the keyPath and options define constraints that cannot be satisfied with the data already in store the upgrade transaction will abort with a "ConstraintError" DOMException.
     *
     * Throws an "InvalidStateError" DOMException if not called within an upgrade transaction.
    */
    createIndex(name: string, keyPath: string | string[], options?: IDBIndexParameters | undefined): IDBIndexWrapper;
    /** Deletes records in store with the given key or in the given key range in query.
     *
     * If successful, request's result will be undefined. */
    delete(key: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange): Promise<"OK">;
    /** Deletes the index in store with the given name.
     *
     * Throws an "InvalidStateError" DOMException if not called within an upgrade transaction. */
    deleteIndex(name: string): void;
    /** Retrieves the value of the first record matching the given key or key range in query.
     *
     * If successful, request's result will be the value, or undefined if there was no matching record. */
    get(query: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange): Promise<any>;
    /** Retrieves the key of the first record matching the given key or key range in query.
     *
     * If successful, request's result will be the key, or undefined if there was no matching record. */
    getKey(query: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange): Promise<string | number | Date | ArrayBuffer | IDBArrayKey | ArrayBufferView>;
    /** Retrieves the values of the records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the values. */
    getAll(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, count?: number | undefined): Promise<any[]>;
    /**  Retrieves the keys of records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the keys.*/
    getAllKeys(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, count?: number | undefined): Promise<IDBValidKey[]>;
    /** Opens an index from this object store after which it can, for example, be used to return a sequence of records sorted by that index using a cursor. */
    index(name: string): IDBIndexWrapper;
    /** Opens a cursor over the records matching query, ordered by direction. If query is null, all records in store are matched.
     *
     * If successful, request's result will be an IDBCursorWithValue pointing at the first matching record, or null if there were no matching records. */
    openCursor(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, direction?: "next" | "nextunique" | "prev" | "prevunique" | undefined): Promise<IDBCursorWithValue>;
    /** Opens a cursor with key only flag set over the records matching query, ordered by direction. If query is null, all records in store are matched.
     *
     * If successful, request's result will be an IDBCursor pointing at the first matching record, or null if there were no matching records. */
    openKeyCursor(query?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange | null | undefined, direction?: "next" | "nextunique" | "prev" | "prevunique" | undefined): Promise<IDBCursor>;
    /** Adds or updates a record in store with the given value and key.
     *
     * If the store uses in-line keys and key is specified a "DataError" DOMException will be thrown
     *
     * If put() is used, any existing record with the key will be replaced. If add() is used, and if a record with the key already exists the request will fail, with request's error set to a "ConstraintError" DOMException.
     * If successful, request's result will be the record's key.
     *  */
    put(value: any, key?: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | undefined): Promise<IDBValidKey>;
}
declare class IDBDatabaseWrapper {
    private IDBDatabase;
    readonly name: string;
    readonly version: number;
    readonly objectStoreNames: DOMStringList;
    constructor(IDBDatabase: IDBDatabase);
    /**
    The close() method of the IDBDatabase interface returns immediately and closes the connection in a separate thread.

    The connection is not actually closed until all transactions created using this connection are complete.
    No new transactions can be created for this connection once this method is called.
    Methods that create transactions throw an exception if a closing operation is pending.
    */
    close(): void;
    /**
    Creates a new object store with the given name and options and returns a new IDBObjectStore.

    Throws a "InvalidStateError" DOMException if not called within an upgrade transaction.
    */
    createObjectStore(name: string, optionalParameters?: IDBObjectStoreParameters | undefined): IDBObjectStoreWrapper;
    /** Deletes the object store with the given name.
     *
     * Throws a "InvalidStateError" DOMException if not called within an upgrade transaction. */
    deleteObjectStore(name: string): void;
    /** Immediately returns a transaction object (IDBTransaction) containing the IDBTransaction.objectStore method, which you can use to access your object store. Runs in a separate thread. */
    transaction(storeNames: string | string[], mode?: "readonly" | "readwrite" | "versionchange" | undefined): IDBTransactionWrapper;
}
/** Open the database connection to IndexDB */
export declare function openDB(database_name: string, version: number, upgradeCallback?: (upgradeDb: IDBDatabaseWrapper) => void): Promise<IDBDatabaseWrapper>;
export {};
//# sourceMappingURL=main.d.ts.map