
export {
    aes_encrypt,
    encryptData,
    sign_async
};

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
    download_file,
    convertArrayBufferViewtoString,
    convertStringToArrayBufferView,
    arrayBufferToString,
    arrayBufferToBase64,
    stringToArrayBuffer

}
from "./glovebox_utils.js"



import {
	loadFromIndexedDB_async,
    saveToIndexedDB_async,
    deleteFromIndexedDB_async,
    READ_DB_async
}
from "./glovebox_db_ops.js"


function encryptData(data, iv, key) {
    console.debug("### encryptData(data,iv,key) begin");
    console.debug(data);
    console.debug(iv);
    console.debug(key);

    if (typeof data == "string") {
        data = data.slice();
        encryptedString = AES.encrypt(data, key, {
                iv: iv,
                mode: CryptoES.mode.CBC,
                padding: CryptoES.pad.Pkcs7
            });
    } else {
        encryptedString = AES.encrypt(JSON.stringify(data), key, {
                iv: iv,
                mode: CryptoES.mode.CBC,
                padding: CryptoES.pad.Pkcs7
            });
    }
    return encryptedString.toString();
}

function aes_encrypt(passphrase, cleartext) {
    console.debug("aes_encrypt(passphrase,cleartext)");
    console.debug("aes_encrypt(" + passphrase + "," + cleartext + ")");

    console.debug('algoEncrypt: ' + JSON.stringify(algoEncrypt));

    // Use a hash of the passphrase as the key
    var key = passphrase;

    var iv = new Uint8Array(12);
    var algoEncrypt = {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128
    };

    try{
    
    return new Promise(
        function (resolve, reject) {
        console.debug("convertStringToArrayBufferView(passpharse): " + convertStringToArrayBufferView(passphrase));
        console.debug(convertStringToArrayBufferView(passphrase));

        
        var encrypted;
        var keyUsages = [
            'encrypt',
            'decrypt'
        ];
        var usekey = {
            "alg": "A128GCM",
            "ext": true,
            "k": key,
            "key_ops": ["encrypt", "decrypt"],
            "kty": "oct"
        };
        // first create a usable key from the passphrase
        crypto.subtle.digest({
            name: "SHA-256"
        }, convertStringToArrayBufferView(passphrase)).then(function (key) {
            console.debug("key: " + key);
            console.debug(key);
            // console.debug("key: " + JSON.stringify(key));

            // key = "gwkMEwco4ZJiZuW2K0_e-g";


            console.debug('usekey: ' + JSON.stringify(usekey));

            //return window.crypto.subtle.importKey('raw', usekey, {name: 'AES-GCM'}, true, keyUsages);
            //return window.crypto.subtle.importKey("raw", key, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]);

            // test just generating a random key
            return window.crypto.subtle.generateKey({
                name: "AES-GCM",
                length: 128
            },
                true,
                ["encrypt", "decrypt"] );

        }).then(function (key) {
            // secretKey = key;
            console.debug('key imported: ' + key);
            //console.debug('background.js:0: ' + usekey.k);

            //console.debug('Plain Text1: ' + json_payload);
            //console.debug('Plain Text1: ' + stringToArrayBuffer(json_payload));

            console.debug('key: ' + JSON.stringify(key));
            console.debug('key: ' + key);
            console.debug('algoEncrypt: ' + algoEncrypt);
            console.debug('algoEncrypt: ' + JSON.stringify(algoEncrypt));

            var sb = stringToArrayBuffer("json_payload");
            console.debug('stringToArrayBuffer("json_payload"): ' + sb);
            return window.crypto.subtle.encrypt(algoEncrypt, key, sb);

        }).then(function (cipherText) {
            encrypted = cipherText;
            console.debug('Cipher Text1: ' + encrypted);
            console.debug('Cipher Text1: ' + arrayBufferToBase64(encrypted));

            console.debug('use key: ' + usekey);
            console.debug(usekey);
            console.debug('key usage: ' + keyUsages);
            console.debug(keyUsages);

            // re-import the key and attempt a decrypt
            //encryptedText = cipherText;
            return window.crypto.subtle.importKey('jwk', usekey, {
                name: 'AES-GCM'
            }, true, keyUsages);
        }).then(function (key) {
            console.debug('key: ' + key);
            console.debug(key);
            console.debug('algoEncrypt: ' + algoEncrypt);
            console.debug(algoEncrypt);

            return window.crypto.subtle.encrypt(algoEncrypt, key, encrypted);

        }).then(function (clear) {
            console.debug('Clear Text1: ' + clear);
            console.debug('Clear Text1: ' + arrayBufferToString(clear));

            resolve(clear);

        });
    });
    }catch(e){
    	console.error(e);
    }
}


//hash: sha-512, sha-256 , sha-1 (free version)
/* modulus length: 4096, 2048 , 1024 (free version)*/

 function sign_async(privateKeyJwk, message) {
 // console.debug('sign');
 // console.debug(privateKeyJwk);
 // console.debug(message);
	 
	  return new Promise(
		        function (resolve, reject) {
	 const data = new TextEncoder().encode(message);
	 
	 
	 window.crypto.subtle.importKey('jwk', privateKeyJwk, {
         name: "RSASSA-PKCS1-v1_5",
         hash: {
             name: "SHA-1"
         },
     }, false, ['sign']).then(function(privateKey){
    	 
    	 return window.crypto.subtle.sign({
             name: "RSASSA-PKCS1-v1_5",
         },
             privateKey,
             data );
    	 
     }).then(function(privateKey){
    	 
    	 return window.crypto.subtle.sign({
             name: "RSASSA-PKCS1-v1_5",
         },
             privateKey,
             data );
    	 
     }).then(function(signature){

    	 resolve(new Uint8Array(signature).join(':'));
     });
		        });
}


