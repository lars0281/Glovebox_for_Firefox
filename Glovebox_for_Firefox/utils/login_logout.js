
export { login_and_keep_all_keys, logout_and_backout_all_keys};

import {
	loadFromIndexedDB_async,
    saveToIndexedDB_async,
    deleteFromIndexedDB_async,
    READ_DB_async,
    dump_db
}
from "./glovebox_db_ops.js"

import {
    createTableRow,
    writeTableHeaderRow,
    writeTableRow,
    sortColumn,
    SortTable,
    CompareRowOfText,
    CompareRowOfNumbers,
    GetDateSortingKey,
    writeTableCell,
    TableLastSortedColumn,
    reflow,
    
    
    download_file,convertArrayBufferViewtoString,
    convertStringToArrayBufferView,arrayBufferToString,arrayBufferToBase64,stringToArrayBuffer

}
from "./glovebox_utils.js"


function login_and_keep_all_keys() {
    console.debug("### login_and_keep_all_keys() BEGIN");

    // prompt user to select a file


    console.debug("### login_and_keep_all_keys() END");
}

function logout_and_backout_all_keys() {
    console.debug("### logout_and_backup_all_keys() begin");

    // read the password to be used to encrypt the key data

    var logoutFilePwd = document.getElementById('logoutFilePwd').value;
    console.debug("logoutFilePwd: " + logoutFilePwd);

    //  return new Promise((resolve, reject) => {

    var listOfKeys = "{";

    // create list of databases and datastores to be backed up in the form of an array of arrays with each field naming the database, datastore in the database


    var parentArray = [
        ["encryptionKeysDB", "encryptionKeysStore", "encryptionKeysStore"], ["acceptedKeyOffersDB", "acceptedKeyOffersStore", "acceptedKeyOffersStore"], ["createdKeyOffersDB", "createdKeyOffersStore", "createdKeyOffersStore"], ["decryptionKeysDB", "decryptionKeysStore", "decryptionKeysStore"], ["keyPairsDB", "keyPairsStore", "keyPairsStore"]
        //    ,["encryptionKeysDB", "encryptionKeysStore", "encryptionKeysStore"]
    ];

    try {
        for (var i = 0; i < parentArray.length; i++) {

            try {
                //await wait_promise(20); //wait for 2 seconds
                //var one = await wait_promisedump_db(parentArray[i][0],parentArray[i][1],parentArray[i][2]);
                //var one = dump_db(parentArray[i][0],parentArray[i][1],parentArray[i][2]);
                //var one;

                var db = parentArray[i][0];
                var dbName3 = parentArray[i][1];
                var storeName3 = parentArray[i][2];
                console.debug("### accessing db:" + db + " dbname:" + dbName3 + " storeName:" + storeName3);

                READ_DB_async(db, dbName3, storeName3).then(function(one){console.debug(one); });
                
                //	console.debug("# appending: " +parentArray[i][0] + "   " + one);
                //    console.debug("#-#-#-#-# " + i + " " + listOfKeys);

                listOfKeys = listOfKeys + '"' + parentArray[i][0] + '":' + one + ',';
                console.debug("#-#-#-#-# (accumulating) " + i + " " + listOfKeys);

            } catch (e) {
                console.debug("ERROR");

                console.debug(e);
            }

        }
    } catch (e) {
        console.debug(e)
    }

    listOfKeys = listOfKeys.substring(0, listOfKeys.length - 1) + '}';
    console.debug("#-#-#-#-# listOfKeys (complete) " + listOfKeys);

    // encrypt the data structure

    // create key object
    let enc = new TextEncoder();
    let encoded = enc.encode("message");

    let iv = new Uint8Array(16);
    let key = new Uint8Array(16);
    let data = new Uint8Array(12345);
    //crypto functions are wrapped in promises so we have to use await and make sure the function that
    //contains this code is an async function
    //encrypt function wants a cryptokey object
   
    
    crypto.subtle.importKey("raw", key.buffer, 'AES-CTR', false, ["encrypt", "decrypt"]).then(function(key_encoded){
    	
    	return window.crypto.subtle.encrypt({
            name: "AES-CTR",
            counter: iv,
            length: 128
        },
            key_encoded,
            encoded);
    }).then(function(encrypted_content){
    	//Uint8Array
        console.debug(encrypted_content);
        
        return download_file("glovebox_keys_backup.json", listOfKeys);
    }).then(function(res){
    	console.debug(res);

        console.debug("### logout_and_backup_all_keys() end");
        // resolve( "true");
        console.debug("backup completed, proceed to flush all keys.");
        // empty out all databases
         flush_all_dbs().then(function(res){console.debug(res)});


        // search all open tabs for decrypted content
        // Ordinarily when content is decrypted, the encrypted data is hidden and the decrypted content is show in its place.
        // This "doubling up" is put in place to facilitate a rapid logout: where there is no need to re-enrypt, but simply delete all decrypted data and return to showing the original, encrypted data

    });
  
    
    
    

    



    //   });

}