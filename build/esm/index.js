/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function isIndexDbSupported() {
    if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB. some of the features will not be available.");
        return false;
    }
    else {
        console.log('supported IndexedDb');
        return true;
    }
}
function is_number_float(data) {
    var found_period = data.toString().includes('.');
    if (found_period) {
        // posibility of the floating number
        return true;
    }
    else {
        // check if the given number is number
        return isNaN(Number(data));
    }
}
var IDBTransactionWrapper = /** @class */ (function () {
    function IDBTransactionWrapper(IDBTransaction) {
        var _this = this;
        this.IDBTransaction = IDBTransaction;
        this.db = new IDBDatabaseWrapper(IDBTransaction.db);
        this.error = IDBTransaction.error;
        this.mode = IDBTransaction.mode;
        this.objectStoreNames = IDBTransaction.objectStoreNames;
        this.event_abort = new Promise(function (resolve, reject) {
            _this.IDBTransaction.onabort = function () {
                resolve(true);
            };
        });
        this.event_error = new Promise(function (resolve, reject) {
            _this.IDBTransaction.onerror = function () {
                resolve(true);
            };
        });
        this.event_complete = new Promise(function (resolve, reject) {
            _this.IDBTransaction.oncomplete = function () {
                resolve(true);
            };
        });
    }
    /** Aborts the transaction. All pending requests will fail with a "AbortError" DOMException and all changes made to the database will be reverted. */
    IDBTransactionWrapper.prototype.abort = function () {
        return this.IDBTransaction.abort();
    };
    /** Returns an IDBObjectStore in the transaction's scope. */
    IDBTransactionWrapper.prototype.objectStore = function (name) {
        return new IDBObjectStoreWrapper(this.IDBTransaction.objectStore(name));
    };
    return IDBTransactionWrapper;
}());
var IDBIndexWrapper = /** @class */ (function () {
    function IDBIndexWrapper(IDBIndex) {
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
    IDBIndexWrapper.prototype.count = function (key) {
        var _this = this;
        var request = this.IDBIndex.count(key);
        return new Promise(function (resolve, reject) {
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while counting number of record in indexed object store called - " + _this.name);
            };
        });
    };
    /**
     * Retrieves the value of the first record matching the given key or key range in query.

     * If successful, request's result will be the value, or undefined if there was no matching record.

     * Returns an IDBRequest object, and, in a separate thread, finds either the value in the referenced object store that corresponds to the given key or the first corresponding value, if key is an IDBKeyRange.
    */
    IDBIndexWrapper.prototype.get = function (key) {
        var _this = this;
        var request = this.IDBIndex.get(key);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while retriving  records in indexed object store called - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
        });
    };
    /**
     * Retrieves the key of the first record matching the given key or key range in query.
     * If successful, request's result will be the key, or undefined if there was no matching record.
    */
    IDBIndexWrapper.prototype.getKey = function (key) {
        var _this = this;
        var request = this.IDBIndex.getKey(key);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while getting key in indexed object store called - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
        });
    };
    /**
     * Retrieves the values of the records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the values.
     * */
    IDBIndexWrapper.prototype.getAll = function (query, count) {
        var _this = this;
        var request = this.IDBIndex.getAll(query, count);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while retriving all records in indexed object store called - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
        });
    };
    /**
     * Retrieves the keys of records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the keys. */
    IDBIndexWrapper.prototype.getAllKeys = function (query, count) {
        var _this = this;
        var request = this.IDBIndex.getAllKeys(query, count);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while retriving all keys in indexed object store called - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
        });
    };
    /**
     * Opens a cursor over the records matching query, ordered by direction. If query is null, all records in index are matched.
     *
     * If successful, request's result will be an IDBCursorWithValue, or null if there were no matching records.
     */
    IDBIndexWrapper.prototype.openCursor = function (query, direction) {
        var _this = this;
        var request = this.IDBIndex.openCursor(query, direction);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while opening cursor on indexed object store called - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(new IDBCursorWithValueWrapper(event.target.result));
            };
        });
    };
    /** Opens a cursor with key only flag set over the records matching query, ordered by direction. If query is null, all records in index are matched.
     *
     * If successful, request's result will be an IDBCursor, or null if there were no matching records. */
    IDBIndexWrapper.prototype.openKeyCursor = function (query, direction) {
        var _this = this;
        var request = this.IDBIndex.openKeyCursor(query, direction);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while opening key cursor on indexed object store called - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(new IDBCursorWrapper(event.target.result));
            };
        });
    };
    return IDBIndexWrapper;
}());
var IDBObjectStoreWrapper = /** @class */ (function () {
    function IDBObjectStoreWrapper(IDBObjectStore) {
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
    IDBObjectStoreWrapper.prototype.add = function (value, key, transactionCallback) {
        var _this = this;
        var request = this.IDBObjectStore.add(value, key);
        if (transactionCallback) {
            transactionCallback(new IDBTransactionWrapper(request.transaction));
        }
        return new Promise(function (resolve, reject) {
            request.onsuccess = function (result) {
                resolve(result.target.result);
            };
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while adding new data to object store called - " + _this.name);
            };
        });
    };
    /**
    Creates and immediately returns an IDBRequest object, and clears this object store in a separate thread. This is for deleting all current records out of an object store.

    If successful, request's result will be undefined.
    */
    IDBObjectStoreWrapper.prototype.clear = function () {
        var _this = this;
        var request = this.IDBObjectStore.clear();
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while clearing all the data from the object store called - " + _this.name);
            };
            request.onsuccess = function (result) {
                if (!result.target.result) {
                    resolve('DONE');
                }
                else {
                    reject('ERR');
                }
            };
        });
    };
    /**
    Returns an IDBRequest object, and, in a separate thread, returns the total number of records that match the provided key or IDBKeyRange.
    
    If no arguments are provided, it returns the total number of records in the store.
    */
    IDBObjectStoreWrapper.prototype.count = function (key) {
        var _this = this;
        var request = this.IDBObjectStore.count(key);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while counting all record from the object store called - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
        });
    };
    /**
     * Creates a new index in store with the given name, keyPath and options and returns a new IDBIndex. If the keyPath and options define constraints that cannot be satisfied with the data already in store the upgrade transaction will abort with a "ConstraintError" DOMException.
     *
     * Throws an "InvalidStateError" DOMException if not called within an upgrade transaction.
    */
    IDBObjectStoreWrapper.prototype.createIndex = function (name, keyPath, options) {
        return new IDBIndexWrapper(this.IDBObjectStore.createIndex(name, keyPath, options));
    };
    /** Deletes records in store with the given key or in the given key range in query.
     *
     * If successful, request's result will be undefined. */
    IDBObjectStoreWrapper.prototype.delete = function (key) {
        var _this = this;
        var request = this.IDBObjectStore.delete(key);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while deleting the row from the object store called - " + _this.name);
            };
            request.onsuccess = function (event) {
                if (!event.target.result) {
                    resolve('OK');
                }
            };
        });
    };
    /** Deletes the index in store with the given name.
     *
     * Throws an "InvalidStateError" DOMException if not called within an upgrade transaction. */
    IDBObjectStoreWrapper.prototype.deleteIndex = function (name) {
        return this.IDBObjectStore.deleteIndex(name);
    };
    /** Retrieves the value of the first record matching the given key or key range in query.
     *
     * If successful, request's result will be the value, or undefined if there was no matching record. */
    IDBObjectStoreWrapper.prototype.get = function (query) {
        var _this = this;
        var request = this.IDBObjectStore.get(query);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while geting the row from the object store called - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
        });
    };
    /** Retrieves the key of the first record matching the given key or key range in query.
     *
     * If successful, request's result will be the key, or undefined if there was no matching record. */
    IDBObjectStoreWrapper.prototype.getKey = function (query) {
        var _this = this;
        var request = this.IDBObjectStore.getKey(query);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while geting key from the object store called - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
        });
    };
    /** Retrieves the values of the records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the values. */
    IDBObjectStoreWrapper.prototype.getAll = function (query, count) {
        var _this = this;
        var request = this.IDBObjectStore.getAll(query, count);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while geting all keys from the object store called - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
        });
    };
    /**  Retrieves the keys of records matching the given key or key range in query (up to count if given).
     *
     * If successful, request's result will be an Array of the keys.*/
    IDBObjectStoreWrapper.prototype.getAllKeys = function (query, count) {
        var _this = this;
        var request = this.IDBObjectStore.getAllKeys(query, count);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while getting all keys from the object store - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
        });
    };
    /** Opens an index from this object store after which it can, for example, be used to return a sequence of records sorted by that index using a cursor. */
    IDBObjectStoreWrapper.prototype.index = function (name) {
        var request = new IDBIndexWrapper(this.IDBObjectStore.index(name));
        return request;
    };
    /** Opens a cursor over the records matching query, ordered by direction. If query is null, all records in store are matched.
     *
     * If successful, request's result will be an IDBCursorWithValue pointing at the first matching record, or null if there were no matching records. */
    IDBObjectStoreWrapper.prototype.openCursor = function (query, direction) {
        var _this = this;
        var request = this.IDBObjectStore.openCursor(query, direction);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while opeing the cursor from the object store - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(new IDBCursorWithValueWrapper(event.target.result));
            };
        });
    };
    /** Opens a cursor with key only flag set over the records matching query, ordered by direction. If query is null, all records in store are matched.
     *
     * If successful, request's result will be an IDBCursor pointing at the first matching record, or null if there were no matching records. */
    IDBObjectStoreWrapper.prototype.openKeyCursor = function (query, direction) {
        var _this = this;
        var request = this.IDBObjectStore.openKeyCursor(query, direction);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while opeing the key cursor from the object store - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(new IDBCursorWrapper(event.target.result));
            };
        });
    };
    /** Adds or updates a record in store with the given value and key.
     *
     * If the store uses in-line keys and key is specified a "DataError" DOMException will be thrown
     *
     * If put() is used, any existing record with the key will be replaced. If add() is used, and if a record with the key already exists the request will fail, with request's error set to a "ConstraintError" DOMException.
     * If successful, request's result will be the record's key.
     *  */
    IDBObjectStoreWrapper.prototype.put = function (value, key) {
        var _this = this;
        var request = this.IDBObjectStore.put(value, key);
        return new Promise(function (resolve, reject) {
            request.onerror = function (err) {
                err.preventDefault();
                err.stopPropagation();
                reject(err + " - Error while putting value to the object store - " + _this.name);
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
        });
    };
    return IDBObjectStoreWrapper;
}());
var IDBDatabaseWrapper = /** @class */ (function () {
    function IDBDatabaseWrapper(IDBDatabase) {
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
    IDBDatabaseWrapper.prototype.close = function () {
        return this.IDBDatabase.close();
    };
    /**
    Creates a new object store with the given name and options and returns a new IDBObjectStore.

    Throws a "InvalidStateError" DOMException if not called within an upgrade transaction.
    */
    IDBDatabaseWrapper.prototype.createObjectStore = function (name, optionalParameters) {
        return new IDBObjectStoreWrapper(this.IDBDatabase.createObjectStore(name, optionalParameters));
    };
    /** Deletes the object store with the given name.
     *
     * Throws a "InvalidStateError" DOMException if not called within an upgrade transaction. */
    IDBDatabaseWrapper.prototype.deleteObjectStore = function (name) {
        return this.IDBDatabase.deleteObjectStore(name);
    };
    /** Immediately returns a transaction object (IDBTransaction) containing the IDBTransaction.objectStore method, which you can use to access your object store. Runs in a separate thread. */
    IDBDatabaseWrapper.prototype.transaction = function (storeNames, mode) {
        return new IDBTransactionWrapper(this.IDBDatabase.transaction(storeNames, mode));
    };
    return IDBDatabaseWrapper;
}());
/** Open the database connection to IndexDB */
function openDB(database_name, version, upgradeCallback) {
    return new Promise(function (resolve, reject) {
        if (isIndexDbSupported()) {
            if (is_number_float(version)) {
                reject('Invalid Version Number | Only Integer is supported');
            }
            else {
                // version number is ok
                // open the database connection
                var request = window.indexedDB.open(database_name, version);
                // after onupgradeneeded this event will fire
                request.onsuccess = function (result) {
                    resolve(new IDBDatabaseWrapper(result.target.result));
                };
                request.onerror = function (err) {
                    reject(err + " - Error while connecting to database");
                };
                // after completion of this event and callback onSuccess will be called
                request.onupgradeneeded = function (result) {
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
var IDBCursorWrapper = /** @class */ (function () {
    function IDBCursorWrapper(IDBCursor) {
        this.IDBCursor = IDBCursor;
        this.direction = this.IDBCursor.direction;
        this.key = this.IDBCursor.key;
        this.primaryKey = this.IDBCursor.primaryKey;
        this.source = this.IDBCursor.source;
    }
    /**
     * Advances the cursor through the next count records in range.
     */
    IDBCursorWrapper.prototype.advance = function (count) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.IDBCursor.advance(count);
                    return [2 /*return*/, new IDBCursorWrapper(this.IDBCursor)];
                }
                catch (error) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Advances the cursor to the next record in range.
     */
    IDBCursorWrapper.prototype.continue = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.IDBCursor.continue(key);
                    return [2 /*return*/, new IDBCursorWrapper(this.IDBCursor)];
                }
                catch (error) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Advances the cursor to the next record in range matching or after key and primaryKey. Throws an "InvalidAccessError" DOMException if the source is not an index.
     */
    IDBCursorWrapper.prototype.continuePrimaryKey = function (key, primaryKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    this.IDBCursor.continuePrimaryKey(key, primaryKey);
                    return [2 /*return*/, new IDBCursorWrapper(this.IDBCursor)];
                }
                catch (error) {
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
    * Delete the record pointed at by the cursor with a new value.
    *
    * If successful, request's result will be undefined.
    */
    IDBCursorWrapper.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            var request;
            var _this = this;
            return __generator(this, function (_a) {
                request = this.IDBCursor.delete();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        request.onsuccess = function () {
                            resolve({ status: 'OK', IDBCursor: new IDBCursorWrapper(_this.IDBCursor) });
                        };
                        request.onerror = function (err) {
                            reject("Error while deleting the row using cursor - " + err);
                        };
                    })];
            });
        });
    };
    /**
     * Updated the record pointed at by the cursor with a new value.
     *
     * Throws a "DataError" DOMException if the effective object store uses in-line keys and the key would have changed.
     *
     * If successful, request's result will be the record's key.
     */
    IDBCursorWrapper.prototype.update = function (value) {
        var _this = this;
        var request = this.IDBCursor.update(value);
        return new Promise(function (resolve, reject) {
            request.onsuccess = function (result) {
                resolve({ IDBValidKey: result.target.result, IDBCursor: new IDBCursorWrapper(_this.IDBCursor) });
            };
            request.onerror = function (err) {
                reject("Error while update the row using cursor - " + err);
            };
        });
    };
    return IDBCursorWrapper;
}());
var IDBCursorWithValueWrapper = /** @class */ (function (_super) {
    __extends(IDBCursorWithValueWrapper, _super);
    function IDBCursorWithValueWrapper(IDBCursorWithValue) {
        var _this = _super.call(this, IDBCursorWithValue) || this;
        _this.IDBCursorWithValue = IDBCursorWithValue;
        _this.value = _this.IDBCursorWithValue.value;
        return _this;
    }
    return IDBCursorWithValueWrapper;
}(IDBCursorWrapper));

export { isIndexDbSupported, openDB };
