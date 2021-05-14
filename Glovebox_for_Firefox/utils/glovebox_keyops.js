export {
    get_default_signing_key_async,
    generate_privatepublickey_for_signing_async,
    updateDecryptionKey,
    updateEncryptionKey,
    import_all_keys,
    backout_all_keys,
    generateRSAKeyPair,
    generate_new_RSA_sign_and_encr_keypairs,
    makeDefaultPrivateKey,
    makeDefaultEncryptionKey
};

import {
    loadFromIndexedDB_async,
    saveToIndexedDB_async,
    deleteFromIndexedDB_async
}
from "./glovebox_db_ops.js"

async function import_all_keys(json_all_records) {
    console.debug("navigate-collection.js: import_all_keys" + json_all_records);

    var obj_all_records = JSON.parse(json_all_records);

    console.debug("navigate-collection.js: import_all_keys(obj)" + obj_all_records);
    console.debug("navigate-collection.js: import_all_keys(obj)" + JSON.stringify(obj_all_records));

    // loop though master list of objects (by db name) (expect those object with expiration dates)
    var parentArray = [
        ["encryptionKeysDB", "encryptionKeysStore", "encryptionKeysStore"], ["acceptedKeyOffersDB", "acceptedKeyOffersStore", "acceptedKeyOffersStore"], ["createdKeyOffersDB", "createdKeyOffersStore", "createdKeyOffersStore"], ["decryptionKeysDB", "decryptionKeysStore", "decryptionKeysStore"], ["keyPairsDB", "keyPairsStore", "keyPairsStore"]
        //    ,["encryptionKeysDB", "encryptionKeysStore", "encryptionKeysStore"]
    ];

    for (var i = 0; i < parentArray.length; i++) {

        // for each db name, look in imported data for data belonging in that database.
        var db = parentArray[i][0];
        var dbName3 = parentArray[i][1];
        var storeName3 = parentArray[i][2];

        console.debug("importing :" + obj_all_records.encryptionKeysDB);
        console.debug("importing :" + JSON.stringify(obj_all_records.encryptionKeysDB));

        var inerting_obj = obj_all_records[db];

        console.debug("importing :" + JSON.stringify(inerting_obj));
        console.debug("importing count:" + inerting_obj.length);

        console.debug("### accessing db:" + db + " dbname:" + dbName3 + " storeName:" + storeName3);

        console.debug("inserting into: " + db);

        var k = 0;
        for (var j = 0; j < inerting_obj.length && k < 2; j++) {
            var obj = inerting_obj[j];

            console.debug(obj.uuid);
            // create importable object

            k++;
            // write to database
            var rc = await saveToIndexedDB_async(db, storeName3, obj.uuid, obj);

        }

    }

    // loop though master list of objects (by db name) for object with expiration dates
    // check the expiration date of each key and do not import any expired ones.
    parentArray = [
        ["decryptionKeysDB", "decryptionKeysStore", "decryptionKeysStore"], ["keyPairsDB", "keyPairsStore", "keyPairsStore"]
        //    ,["encryptionKeysDB", "encryptionKeysStore", "encryptionKeysStore"]
    ];

}

async function backout_all_keys(backupFilePwd) {
    console.debug("### backup_all_keys(backupFilePwd) begin");

    //  return new Promise((resolve, reject) => {

    var listOfKeys = "{";

    // create list of databases and datastores to be backed up in the form of an array of arrays with each field naming the database, datastore in the database

    //  //

    //  ["acceptedKeyOffers", "acceptedKeyOffers", "acceptedKeyOffers"]
    //   ["gloveboxKeys", "decryptionKeys", "decryptionKeys"],
    // ["gloveboxKeys", "encryptionKeys", "encryptionKeys"]
    //   ["privateKeys", "keyPairs", "keyPairs"]
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

                const one = await READ_DB(db, dbName3, storeName3);
                console.debug("READ " + one);

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

    // proceed with encryption
    // using passphrase specified in the form


    console.debug("#-#-#-#-# listOfKeys (complete) " + listOfKeys);
    // encrypt the data using the passphrase contained in the variable backupFilePwd

    var encryptedString = AES.encrypt(listOfKeys, backupFilePwd);

    console.debug("#-#-#-#-# encrypted (encryoted) " + encryptedString);

    console.debug("#-#-#-#-# encrypted (base64) " + Base64.stringify(encryptedString));

    await download_file("glovebox_keys_backup.json", Base64.stringify(encryptedString));

    //download_file("glovebox_keys_backup.txt", listOfKeys, "text/plain");
    console.debug("### backup_all_keys() end");
    // resolve( "true");
    console.debug("backup completed, proceed to flush all keys.");
    //    await flush_all_dbs();

    //   });

}

function generateRSAKeyPair() {
    // for signing
    // name: "RSASSA-PKCS1-v1_5"
    // for encryption
    // name: "RSA-OAEP"

    return new Promise(
        function (resolve, reject) {
        console.debug("generateRSAKeyPair");
        var key,
        key2;
        var RSASSAPKCS1v1_5_privateKey,
        RSASSAPKCS1v1_5_publicKey,
        RSAOAEP_privateKey,
        RSAOAEP_publicKey;

        var one;
        window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ["sign", "verify"]).then(function (res) {
            key = res;
            return window.crypto.subtle.generateKey({
                name: "RSA-OAEP",
                modulusLength: 1024,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: "SHA-1"
                },
            },
                true,
                ["encrypt", "decrypt"]);

        }).then(function (res2) {
            key2 = res2;
            return window.crypto.subtle.exportKey("jwk", key.privateKey);
        }).then(function (res2) {
            one.RSASSAPKCS1v1_5_privateKey = res2;
            console.debug(JSON.stringify(one));
            return window.crypto.subtle.exportKey(
                "jwk",
                key.publicKey);
        }).then(function (res2) {
            one.RSASSAPKCS1v1_5_publicKey = res2;
            console.debug(JSON.stringify(one));
            return window.crypto.subtle.exportKey(
                "jwk", key2.privateKey);
        }).then(function (res2) {
            one.RSAOAEP_privateKey = res2;
            console.debug(JSON.stringify(one));
            return window.crypto.subtle.exportKey("jwk", key2.publicKey);
        }).then(function (res2) {
            one.RSAOAEP_publicKey = res2;

            console.debug(JSON.stringify(one));

            resolve(one);
        });

    });

    //  return {
    //      RSASSAPKCS1v1_5_privateKey: await window.crypto.subtle.exportKey(
    //          "jwk",
    //          key.privateKey, ),
    //      RSASSAPKCS1v1_5_publicKey: await window.crypto.subtle.exportKey(
    //          "jwk",
    //          key.publicKey, ),
    //     RSAOAEP_privateKey: await window.crypto.subtle.exportKey(
    //          "jwk",
    //          key2.privateKey, ),
    //      RSAOAEP_publicKey: await window.crypto.subtle.exportKey(
    //          "jwk",
    //          key2.publicKey, ),
    //   };
}

function generate_new_RSA_sign_and_encr_keypairs() {

    var uuid;
    var testkeypairobj;
    var testprivkey;
    var testpubkey;
    var newItem;
    // create key pair
    console.debug("1");
    var key;
    var publicKeyJwk;
    var testkeypairobj;

    var enc_privkey;
    var enc_pubkey;
    var sign_privkey;
    var sign_pubkey;

    var newItem;
    var algoKeyGen = {
        name: 'AES-GCM',
        //          length: 256
        length: 128
    };

    return new Promise(
        function (resolve, reject) {

        var defKey = null;
        var sign_key_obj;
        var crypt_key_obj;

        // check if there already is a default key, and if there is none, create it.
        // This ensures a default private key for signing is allways present.

        get_default_signing_key_async().then(function (defKey) {
            console.debug("default key:" + JSON.stringify(defKey));

            console.debug('algoKeyGen: ' + JSON.stringify(algoKeyGen));

            var keyUsages = [
                'encrypt',
                'decrypt'
            ];
            var sign_key_obj;
            console.debug("2.0");
            //sign_key_obj = await
            return window.crypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 1024,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: "SHA-1"
                },
            },
                true,
                ["sign", "verify"]);
        }).then(function (res) {
            sign_key_obj = res;
            console.debug(sign_key_obj);

            console.debug("2.1");
            console.debug("2.2");

            //sign_pubkey = await
            return window.crypto.subtle.exportKey("jwk", sign_key_obj.publicKey);
        }).then(function (res) {
            sign_pubkey = res;
            console.debug(sign_pubkey);
            console.debug("2.3");
            console.debug(sign_key_obj);
            console.debug("2.3.1");
            //sign_privkey = await
            return window.crypto.subtle.exportKey("jwk", sign_key_obj.privateKey);
        }).then(function (r) {
            sign_privkey = r;
            console.debug(sign_privkey);
            console.debug("2.4");

            //generates random id;
            let guid = () => {
                let s4 = () => {
                    return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
                }
                //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            }

            uuid = guid();

            //      newItem = {
            //          keyId: uuid,
            //          uuid: uuid,
            //          "key": expkey.k,
            //          "jwk": expkey,
            //          "ext": true
            //       };
            newItem = {
                "keyId": uuid,
                "uuid": uuid,
                "encryption_publicKey": enc_pubkey,
                "encryption_privateKey": enc_privkey,
                "signature_publicKeyJWK": sign_pubkey,
                "signature_privateKeyJWK": sign_privkey,

            };

            console.debug('newItem: ' + JSON.stringify(newItem));

            // bypass the remainder
            //  return newItem;


            //crypt_key_obj = await
            return window.crypto.subtle.generateKey({
                name: "RSA-OAEP",
                modulusLength: 1024,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: {
                    name: "SHA-256"
                }
            },
                true,
                ["encrypt", "decrypt"]);
        }).then(function (crypt_key_obj) {

            console.debug(crypt_key_obj);
            console.debug("3.2");

            enc_pubkey = window.crypto.subtle.exportKey("jwk", crypt_key_obj.publicKey);
            console.debug(enc_pubkey);
            console.debug("3.3");
            enc_privkey = window.crypto.subtle.exportKey("jwk", crypt_key_obj.privateKey);
            console.debug(enc_privkey);
            console.debug("3.4");

            newItem = {
                "keyId": uuid,
                "uuid": uuid,
                "encryption_publicKey": enc_pubkey,
                "encryption_privateKey": enc_privkey,
                "signature_publicKeyJWK": sign_pubkey,
                "signature_privateKeyJWK": sign_privkey,

            };

            console.debug('newItem: ' + JSON.stringify(newItem));

            resolve(newItem);
        });
    });

}

//designate an encryption key as default
function makeDefaultEncryptionKey(uuid) {
    console.debug("navigate-collection.js: makeDefaultEncryptionKey" + uuid);

    // the default key should already exists as a publicate under the
    // get the existing default key and give it a new keyId


    //    loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", 'defaultSecretKey').then(function (currentdefaultkey) {
    //        console.debug("navigate-collection.js: makeDefaultEncryptionKey read default from db:" + currentdefaultkey);
    //        console.debug("navigate-collection.js: makeDefaultEncryptionKey read default from db:" + JSON.stringify(currentdefaultkey));
    //        // make the UUID of the object the new keyId
    //        currentdefaultkey.keyId = currentdefaultkey.uuid;
    //        saveToIndexedDB('encryptionKeys', 'encryptionKeys', currentdefaultkey.keyId, currentdefaultkey).then(function (response) {
    //            console.debug("navigate-collection.js: makeDefaultEncryptionKey save to db:" + response);
    //        });
    //    });

    // read out the key from the database
    var obj;

    loadFromIndexedDB_async("encryptionKeysDB", "encryptionKeysStore", uuid).then(function (o) {
        obj = o;
        return deleteFromIndexedDB('encryptionKeysDB', 'encryptionKeysStore', 'defaultSecretKey');
    }).then(function (res) {
        console.debug("navigate-collection.js: makeDefaultEncryptionKey read from res:" + res);
        console.debug("navigate-collection.js: makeDefaultEncryptionKey read from db:" + obj);
        console.debug("navigate-collection.js: makeDefaultEncryptionKey read from db:" + JSON.stringify(obj));
        // re-insert with a new reference -
        obj.uuid = obj.keyId;

        // make defaultSecretKey the new keyid
        obj.keyId = "defaultSecretKey";

        console.debug("navigate-collection.js: makeDefaultEncryptionKey write:" + JSON.stringify(obj));

        // and save it back in on the defaultkey id
        return saveToIndexedDB('encryptionKeysDB', 'encryptionKeysStore', 'defaultSecretKey', obj);
    }).then(function (response) {
        console.debug("navigate-collection.js: makeDefaultEncryptionKey save to db:" + response);
    });
}

//designate an encryption key as default
function makeDefaultPrivateKey(uuid) {
    console.debug("navigate-collection.js: makeDefaultPrivateKey uuid:" + uuid);

    // the default key should already exists as a publicate under the
    // get the existing default key and give it a new keyId


    //    loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", 'defaultSecretKey').then(function (currentdefaultkey) {
    //        console.debug("navigate-collection.js: makeDefaultPrivateKey read default from db:" + currentdefaultkey);
    //        console.debug("navigate-collection.js: makeDefaultPrivateKey read default from db:" + JSON.stringify(currentdefaultkey));
    //        // make the UUID of the object the new keyId
    //        currentdefaultkey.keyId = currentdefaultkey.uuid;
    //        saveToIndexedDB('encryptionKeys', 'encryptionKeys', currentdefaultkey.keyId, currentdefaultkey).then(function (response) {
    //            console.debug("navigate-collection.js: makeDefaultPrivateKey save to db:" + response);
    //        });
    //    });

    // read out the key from the database
    var obj;

    loadFromIndexedDB_async("keyPairsDB", "keyPairsStore", uuid).then(function (o) {
        obj = o;
        return deleteFromIndexedDB('keyPairsDB', 'keyPairsStore', 'defaultPrivateKey');

    }).then(function (res) {
        console.debug("navigate-collection.js: makeDefaultPrivateKey read from res:" + res);
        console.debug("navigate-collection.js: makeDefaultPrivateKey read from db:" + obj);
        console.debug("navigate-collection.js: makeDefaultPrivateKey read from db:" + JSON.stringify(obj));
        // re-insert with a new reference -
        obj.uuid = obj.keyId;

        // make defaultPrivateKey the new keyid
        obj.keyId = "defaultPrivateKey";

        console.debug("navigate-collection.js: makeDefaultPrivateKey write:" + JSON.stringify(obj));

        // and save it back in on the defaultkey id
        return saveToIndexedDB('keyPairsDB', 'keyPairsStore', 'defaultPrivateKey', obj);
    }).catch(function (err) {
        console.debug("makeDefaultPrivateKey:err=\"" + err + "\"");
        // if the error is that the defaul is no set. proceed with setting it.
        if (err == "TypeError: obj is undefined") {
            console.debug("na1");
            // read out the key and write it to the default key.
            return saveToIndexedDB('keyPairsDB', 'keyPairsStore', 'defaultPrivateKey', obj);

        } else {
            console.debug("na2");

        }

    }).then(function (response) {
        console.debug("navigate-collection.js: makeDefaultPrivateKey save to db:" + response);
    });
}

//updateEncryptionKey
function updateDecryptionKey(uuid) {
    console.debug("navigate-collection.js: updateDecryptionKey \"" + uuid + "\"");

    // objectStore:"encryptionKeys"
    // get data from database

    loadFromIndexedDB_async("decryptionKeysDB", "decryptionKeysStore", uuid).then(function (obj) {

        console.debug("navigate-collection.js: updateDecryptionKey read from db:" + obj);
        //    console.debug("navigate-collection.js: updateDecryptionKey read from db:"+ JSON.stringify(obj));

        // present a popup window

        var frog = window.open("", "wildebeast", "width=500,height=300,scrollbars=1,resizable=1")

            //0b1a4cce-2945-7f21-aed2-bf8520ac0096:"{"keyId":"0b1a4cce-2945-7f21-aed2-bf8520ac0096","key":"m9vji9G1qthmCNdTbn9C5g","jwk":{"alg":"A128GCM","ext":true,"k":"m9vji9G1qthmCNdTbn9C5g","key_ops":["encrypt","decrypt"],"kty":"oct"},"ext":true}"

            var html = "<html><head><title>update key</title></head><body>Hello, <b> text </b>.";
        html += 'make any changes required<form class="update-decryption-key">\n';

        html += '<br/>username<input name="username"id="username"type="text"value="' + obj.username + '"></input>\n';
        html += '<br/>uuid<input name="uuid"id="uuid"type="text"value="' + obj.keyId + '"></input>\n';

        html += '<br/>key type<input name="keyObjectType"id="keyObjectType"type="text"value="' + obj.keyObjectType + '"></input>\n';
        html += '<br/>key<input name="key"type="text"id="key"value="' + obj.key + '"></input>\n';

        html += '<br/>jwk<textarea  name="jwk"type="textarea"id="jwk" rows="4"cols="50">' + JSON.stringify(obj.jwk) + '</textarea >\n';

        html += '<br/><input name="update-decryption-key"type="submit"id="update-decryption-key-button"class="update-decryption-key"value="submit updates"></input>';

        html += '</form>';

        //var text = document.form.input.value
        html += '<script type="module"src="/update-decryption-key-popup.js"></script>';

        html += "</body></html>";

        //variable name of window must be included for all three of the following methods so that
        //javascript knows not to write the string to this window, but instead to the new window

        frog.document.open();
        frog.document.write(html);
        frog.document.close();
    });
    //deleteFromIndexedDB('encryptionKeys', 'encryptionKeys', u);

}

//updateEncryptionKey
function updateEncryptionKey(uuid) {
    console.debug("navigate-collection.js: updateEncryptionKey \"" + uuid + "\"");

    // objectStore:"encryptionKeys"
    // get data from database

    loadFromIndexedDB_async("encryptionKeysDB", "encryptionKeysStore", uuid).then(function (obj) {

        console.debug("navigate-collection.js: updateEncryptionKey read from db:" + obj);
        console.debug("navigate-collection.js: updateEncryptionKey read from db:" + JSON.stringify(obj));

        // present a popup window

        var frog = window.open("", "wildebeast", "width=500,height=300,scrollbars=1,resizable=1")

            //0b1a4cce-2945-7f21-aed2-bf8520ac0096:"{"keyId":"0b1a4cce-2945-7f21-aed2-bf8520ac0096","key":"m9vji9G1qthmCNdTbn9C5g","jwk":{"alg":"A128GCM","ext":true,"k":"m9vji9G1qthmCNdTbn9C5g","key_ops":["encrypt","decrypt"],"kty":"oct"},"ext":true}"

            var html = "<html><head><title>update key</title></head><body>Hello, <b> text </b>.";
        html += 'make any changes required<form class="update-encryption-key">';

        html += '<br/>username<input name="username"id="username"type="text"value="' + obj.username + '"></input>';
        html += '<br/>uuid<input name="uuid"id="uuid"type="text"value="' + obj.keyId + '"></input>';

        html += '<br/>key type<input name="keyObjectType"id="keyObjectType"type="text"value="' + obj.keyObjectType + '"></input>';
        html += '<br/>key<input name="key"type="text"id="key"value="' + obj.key + '"></input>';

        html += '<br/>jwk<textarea  name="jwk"type="textarea"id="jwk" rows="4"cols="50">' + JSON.stringify(obj.jwk) + '</textarea >';

        html += '<br/><input name="update-encryption-key"type="submit"id="update-encryption-key-button"class="update-encryption-key"value="submit updates">test7</input>';

        html += '</form>';

        //var text = document.form.input.value
        html += '<script type="module"src="/update-encryption-key-popup.js"></script>';

        html += "</body></html>";

        //variable name of window must be included for all three of the following methods so that
        //javascript knows not to write the string to this window, but instead to the new window

        frog.document.open();
        frog.document.write(html);
        frog.document.close();
    });
    //deleteFromIndexedDB('encryptionKeys', 'encryptionKeys', u);

}

function generate_privatepublickey_for_signing_async() {
    console.debug("###########");
    console.debug("### running generate_privatepublickey_for_signing_async()");

    var uuid;
    var testkeypairobj;
    var testprivkey;
    var testpubkey;
    var newItem;
    // create key pair
    console.debug("1");
    var key;
    var publicKeyJwk;
    var testkeypairobj;

    var enc_privkey;
    var enc_pubkey;
    var sign_privkey;
    var sign_pubkey;

    var newItem;
    var algoKeyGen = {
        name: 'AES-GCM',
        //          length: 256
        length: 128
    };

    return new Promise(
        function (resolve, reject) {

        var defKey = null;
        var sign_key_obj;
        var crypt_key_obj;

        // check if there already is a default key, and if there is none, create it.
        // This ensures a default private key for signing is allways present.

        get_default_signing_key_async().then(function (defKey) {
            console.debug("default key:" + JSON.stringify(defKey));

            console.debug('algoKeyGen: ' + JSON.stringify(algoKeyGen));

            var keyUsages = [
                'encrypt',
                'decrypt'
            ];
            var sign_key_obj;
            console.debug("2.0");
            //sign_key_obj = await
            return window.crypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 1024,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: "SHA-1"
                },
            },
                true,
                ["sign", "verify"]);
        }).then(function (res) {
            sign_key_obj = res;
            console.debug(sign_key_obj);

            console.debug("2.1");
            console.debug("2.2");

            //sign_pubkey = await
            return window.crypto.subtle.exportKey("jwk", sign_key_obj.publicKey);
        }).then(function (res) {
            sign_pubkey = res;
            console.debug(sign_pubkey);
            console.debug("2.3");
            console.debug(sign_key_obj);
            console.debug("2.3.1");
            //sign_privkey = await
            return window.crypto.subtle.exportKey("jwk", sign_key_obj.privateKey);
        }).then(function (r) {
            sign_privkey = r;
            console.debug(sign_privkey);
            console.debug("2.4");

            //generates random id;
            let guid = () => {
                let s4 = () => {
                    return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
                }
                //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            }

            uuid = guid();

            //      newItem = {
            //          keyId: uuid,
            //          uuid: uuid,
            //          "key": expkey.k,
            //          "jwk": expkey,
            //          "ext": true
            //       };
            newItem = {
                "keyId": uuid,
                "uuid": uuid,
                "encryption_publicKey": enc_pubkey,
                "encryption_privateKey": enc_privkey,
                "signature_publicKeyJWK": sign_pubkey,
                "signature_privateKeyJWK": sign_privkey,

            };

            console.debug('newItem: ' + JSON.stringify(newItem));

            // bypass the remainder
            //  return newItem;


            //crypt_key_obj = await
            return window.crypto.subtle.generateKey({
                name: "RSA-OAEP",
                modulusLength: 1024,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: {
                    name: "SHA-256"
                }
            },
                true,
                ["encrypt", "decrypt"]);
        }).then(function (crypt_key_obj) {

            console.debug(crypt_key_obj);
            console.debug("3.2");

            enc_pubkey = window.crypto.subtle.exportKey("jwk", crypt_key_obj.publicKey);
            console.debug(enc_pubkey);
            console.debug("3.3");
            enc_privkey = window.crypto.subtle.exportKey("jwk", crypt_key_obj.privateKey);
            console.debug(enc_privkey);
            console.debug("3.4");

            newItem = {
                "keyId": uuid,
                "uuid": uuid,
                "encryption_publicKey": enc_pubkey,
                "encryption_privateKey": enc_privkey,
                "signature_publicKeyJWK": sign_pubkey,
                "signature_privateKeyJWK": sign_privkey,

            };

            console.debug('newItem: ' + JSON.stringify(newItem));

            // bypass the remainder
            resolve(newItem);
        });
    });
}

function get_default_signing_key_async() {
    console.debug("get_default_signing_key_async:start");

    // This function returns a JSON structure containing a public and private key suitable for digital signing and signature validation.
    // ( and also a keypai suitable for RSA encryption/decryption)
    // If not such default key has been set, one is created and insterted into the database.
    // If a new key is created, it is inserted both under it's own unique identifier, as well as under the default identifier.

    /*
     * {
     * publicKey: jwk_exported_publickey,
     * privateKey: jwk_exported_privatekey
     * }
     */

    // The function returns a Promise, which resolves to the key.

    var defaultSigningKey;
    var defaultSigningKey2;
    // look for default signing RSA key
    var newItem;
    var newItem2;
    var enc_privkey;
    var enc_pubkey;
    var sign_privkey;
    var sign_pubkey;
    var testkeypairobj;
    var uuid;
    var d;
    return new Promise(
        function (resolve, reject) {

        try {

            loadFromIndexedDB_async("keyPairsDB", "keyPairsStore", 'defaultPrivateKey').then(function (res) {
                d = res;
                console.debug(d);
                console.debug(typeof d);

                //check if a proper keyobject was returned
                if (typeof d == "undefined") {
                    console.debug("no default signing priv key was found");
                    // make call to create one
                    var a;
                    var b;
                    var c;
                    var newObj;
                    console.debug("generating new signing priv key was found");
                    window.crypto.subtle.generateKey({
                        name: "RSASSA-PKCS1-v1_5",
                        modulusLength: 1024,
                        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                        hash: {
                            name: "SHA-1"
                        },
                    }, true,
                        ["sign", "verify"]).then(function (res) {
                        a = res;
                        console.debug("#### 2");
                        console.debug(a);
                        console.debug(typeof a);
                        return window.crypto.subtle.exportKey("jwk", a.publicKey);
                    }).then(function (res) {
                        b = res;
                        console.debug(b);
                        console.debug(typeof b);
                        return window.crypto.subtle.exportKey("jwk", a.publicKey);
                    }).then(function (res) {
                        c = res;
                        console.debug(c);
                        console.debug(typeof c);
                        console.debug("#### 4");

                        newObj = {
                            "privateKey": b,
                            "publicKey": c
                        };
                        console.debug(JSON.stringify(newObj));
                        // stick it into the database the new default privatekey

                        // return the keypair
                        resolve(newObj);
                    });
                } else {
                    console.debug("#### 5");
                    resolve(d);
                }
            });

        } catch (e) {
            console.error(e);
        }
    });
}
