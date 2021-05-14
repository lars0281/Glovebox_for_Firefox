export { db_setup};


function db_setup(indexedDB){
	
	
	  let db;
	      var request = indexedDB.open("decryptionKeysDB", 1);
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.debug("create objectstore decryptionKeysStore in decryptionKeysDB");
            var objectStore2 = db.createObjectStore("decryptionKeysStore", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request.onerror = function (event) {
            console.debug("dp open request error 201");
        };
        request.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.debug("db open request error 2");
            };
            db.onsuccess = function (event) {
                console.debug("db open request success 2");
            };
        };

        var request2 = indexedDB.open("encryptionKeysDB", 1);
        request2.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.debug("create objectstore encryptionKeysStore in encryptionKeysDB");
            var objectStore2 = db.createObjectStore("encryptionKeysStore", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request2.onerror = function (event) {
            console.debug("dp open request error 201");
        };
        request2.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.debug("db open request error 2");
            };
            db.onsuccess = function (event) {
                console.debug("db open request success 2");
            };
        };

        // ########
        // ########
        var request3 = indexedDB.open("createdKeyOffersDB", 1);
        request3.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep offers to passout decryption keys in a secure way.
            console.debug("create objectstore createdKeyOffersStore in createdKeyOffersDB for secure key offers in ");
            var objectStore2 = db.createObjectStore("createdKeyOffersStore", {
                    keyPath: "refId"
                });

            objectStore2.createIndex("refId", "refId", {
                unique: true
            });
        };
        request3.onerror = function (event) {
            console.debug("dp open request error 201");
        };
        request3.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.debug("db open request error 2");
            };
            db.onsuccess = function (event) {
                console.debug("db open request success 2");
            };
        };

        // ########
        // ########
        var request7 = indexedDB.open("acceptedKeyOffersDB", 1);
        request7.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep offers to passout decryption keys in a secure way.
            console.debug("create objectstore acceptedKeyOffersStore in acceptedKeyOffersDB for secure key offers");
            var objectStore = db.createObjectStore("acceptedKeyOffersStore", {
                    keyPath: "refId"
                });

            objectStore.createIndex("refId", "refId", {
                unique: true
            });
        };
        request7.onerror = function (event) {
            console.debug("dp open request error 201");
        };
        request7.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.debug("db open request error 2");
                var objectStore = db.createObjectStore("acceptedKeyOffersStore", {
                        keyPath: "refId"
                    });

                objectStore.createIndex("refId", "refId", {
                    unique: true
                });
            };
            db.onsuccess = function (event) {
                console.debug("db open request success 2");
                var objectStore = db.createObjectStore("acceptedKeyOffersStore", {
                        keyPath: "refId"
                    });

                objectStore.createIndex("refId", "refId", {
                    unique: true
                });
            };
        };

        // ##########
        var request4 = indexedDB.open("keyPairsDB", 1);
        request4.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore
            console.debug("create objectstore keyPairsStore in keyPairsDB - for public+private key pairs");
            var objectStore2 = db.createObjectStore("keyPairsStore", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request4.onerror = function (event) {
            console.debug("dp open request error 201");
        };
        request4.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.debug("db open request error 2");
            };
            db.onsuccess = function (event) {
                console.debug("db open request success 2");
            };
        };
        console.debug("DB setup complete");
        // end DB setup
	
	
	
}