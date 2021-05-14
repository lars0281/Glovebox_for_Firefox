export { loadFromIndexedDB_async,
    saveToIndexedDB_async,
    deleteFromIndexedDB_async, dump_db,flush_all_keys};


//remove all data from local databases
async function flush_all_keys(dbName, storeName) {
  console.debug("### flush_all_keys(dnName,storeName) begin");

  // connect to database
  var dbRequest = indexedDB.open(dbName);

  dbRequest.onsuccess = function (event) {
      console.debug("clearing objectstore: " + storeName)
      var database = event.target.result;
      var transaction = database.transaction([storeName], 'readwrite');
      var objectStore = transaction.objectStore(storeName);
      var objectRequest = objectStore.clear(); // clear all records
      objectRequest.onerror = function (event) {
          console.debug("failed cleared IndexedDB: " + dbName)
      };

      objectRequest.onsuccess = function (event) {
          console.debug("succesfully cleared IndexedDB: " + dbName)
      };
  };

  console.debug("### flush_all_keys(dnName,storeName) end");

}



function dump_db(db, dbName3, storeName3) {

    // access database
    console.debug("dump_db access database: " + db);
    var dbRequest = indexedDB.open(db);

    //     try {
    dbRequest.onsuccess = function (event3) {
        var database3 = event3.target.result;

        //console.debug("access datastore: " + storeName3);

        var transaction3 = database3.transaction([storeName3]);
        var objectStore3 = transaction3.objectStore(storeName3);

        var allRecords3 = objectStore3.getAll();
        allRecords3.onsuccess = function () {

            const res3 = allRecords3.result;
            //console.debug(res3);
            //console.debug("## results" + JSON.stringify(res3));
            //listOfKeys = listOfKeys + ',"privateKeys":' + JSON.stringify(res3) + '';

            // get private(and their public component) signing keys
            database3.close();
            return (JSON.stringify(res3));

        };
        database3.close();

    }
    //            dbRequest.close();
    //      } catch (e) {
    //         console.debug(e);
    //         resolve("error");
    //    }

}


function loadFromIndexedDB_async(dbName, storeName, id) {
    console.log("loadFromIndexedDB:0");
    console.log("loadFromIndexedDB:1 " + dbName);
    console.log("loadFromIndexedDB:2 " + storeName);
    console.log("loadFromIndexedDB:3 " + id);

    return new Promise(
        function (resolve, reject) {
        var dbRequest = indexedDB.open(dbName);

        dbRequest.onerror = function (event) {
            reject(Error("Error text"));
        };

        dbRequest.onupgradeneeded = function (event) {
            // Objectstore does not exist. Nothing to load
            event.target.transaction.abort();
            reject(Error('Not found'));
        };

        dbRequest.onsuccess = function (event) {
            //  console.log("loadFromIndexedDB:onsuccess ");

            var database = event.target.result;
            var transaction = database.transaction([storeName]);
            //  console.log("loadFromIndexedDB:transaction: " + JSON.stringify(transaction));
            var objectStore = transaction.objectStore(storeName);
            //  console.log("loadFromIndexedDB:objectStore: " + JSON.stringify(objectStore));
            var objectRequest = objectStore.get(id);

            // console.log("loadFromIndexedDB:objectRequest: " + JSON.stringify(objectRequest));


            try {

                objectRequest.onerror = function (event) {
                    // reject(Error('Error text'));
                    console.log("45");
                    reject('Error text');
                };

                objectRequest.onsuccess = function (event) {
                    if (objectRequest.result) {
                        console.log("loadFromIndexedDB:result " + JSON.stringify(objectRequest.result));

                        resolve(objectRequest.result);
                    } else {
                        //reject(Error('object not found'));
                        //console.log("43");
                        resolve('object not found');
                        //reject('object not found');


                    }
                };

            } catch (error) {
                console.log(error);
                reject(error);

            }

        };
    });
}


function deleteFromIndexedDB_async(dbName, storeName, keyId) {
    console.debug("deleteFromIndexedDB:1 " + dbName);
    console.debug("deleteFromIndexedDB:2 " + storeName);
    console.debug("deleteFromIndexedDB:3 " + keyId);

    // indexedDB = window.indexedDB || window.webkitIndexedDB ||
    // window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        var dbRequest = indexedDB.open(dbName);

        // console.debug("deleteFromIndexedDB: 1 dbRequest=" + dbRequest)

        dbRequest.onerror = function (event) {
            console.debug("deleteFromIndexedDB:error.open:db " + dbName);
            reject(Error("IndexedDB database error"));
        };

        // console.debug("deleteFromIndexedDB: 2")

        dbRequest.onupgradeneeded = function (event) {
            console.debug("deleteFromIndexedDB: 21")
            var database = event.target.result;
            console.debug("deleteFromIndexedDB:db create obj store " + storeName);
            var objectStore = database.createObjectStore(storeName, {
                    keyId: keyId
                });
        };

        // console.debug("deleteFromIndexedDB: 3")

        dbRequest.onsuccess = function (event) {
            // console.debug("deleteFromIndexedDB: 31")
            var database = event.target.result;
            var transaction = database.transaction([storeName], 'readwrite');
            var objectStore = transaction.objectStore(storeName);
            var objectRequest = objectStore.delete(keyId); // Overwrite if
            // exists

            objectRequest.onerror = function (event) {
                console.debug("deleteFromIndexedDB:error: " + storeName + "/" + keyId);

                reject(Error('Error text'));
            };

            objectRequest.onsuccess = function (event) {
                console.debug("deleteFromIndexedDB:success: " + storeName + "/" + keyId);
                resolve('Data saved OK');
            };
        };
    });
}


function saveToIndexedDB_async(dbName, storeName, keyId, object) {

    console.debug("saveToIndexedDB_async:dbname " + dbName);
    console.debug("saveToIndexedDB_async:objectstorename " + storeName);
    console.debug("saveToIndexedDB_async:keyId " + keyId);
    console.debug("saveToIndexedDB_async:object " + JSON.stringify(object));

    // indexedDB = window.indexedDB || window.webkitIndexedDB ||
    // window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        // console.debug("saveToIndexedDB: 0 resolve=" + resolve )
        // console.debug("saveToIndexedDB: 0 reject=" + reject )

        // if (object.taskTitle === undefined)
        // reject(Error('object has no taskTitle.'));

        var dbRequest;

        try {

            dbRequest = indexedDB.open(dbName);
        } catch (error) {
            console.debug(error);

        }
        console.debug("saveToIndexedDB_async: 1 dbRequest=" + dbRequest);

        dbRequest.onerror = function (event) {
            console.debug("saveToIndexedDB:error.open:db " + dbName);
            reject(Error("IndexedDB database error"));
        };

        console.debug("saveToIndexedDB: 2" + JSON.stringify(dbRequest));

        dbRequest.onupgradeneeded = function (event) {
            console.debug("saveToIndexedDB: 21");
            var database = event.target.result;
            console.debug("saveToIndexedDB:db create obj store " + storeName);
            var objectStore = database.createObjectStore(storeName, {
                    keyId: keyId
                });
        };

        console.debug("saveToIndexedDB: 3" + JSON.stringify(dbRequest));
        try {

            dbRequest.onsuccess = function (event) {
                console.debug("saveToIndexedDB: 31");
                var database = event.target.result;
                console.debug("saveToIndexedDB: 32");
                var transaction = database.transaction([storeName], 'readwrite');
                console.debug("saveToIndexedDB: 33");
                var objectStore = transaction.objectStore(storeName);
                console.debug("saveToIndexedDB:objectStore put: " + JSON.stringify(object));

                var objectRequest = objectStore.put(object); // Overwrite if
                // already
                // exists

                console.debug("saveToIndexedDB:objectRequest: " + JSON.stringify(objectRequest));

                objectRequest.onerror = function (event) {
                    console.debug("saveToIndexedDB:error: " + storeName);

                    reject(Error('Error text'));
                };

                objectRequest.onsuccess = function (event) {
                    console.debug("saveToIndexedDB:success: " + storeName);
                    resolve('Data saved OK');
                };
            };

        } catch (error) {
            console.debug(error);

        }

    });
}

