
import * as utils_functions from '/utils/functions.js';

function submitUpdateEncryptionKey(e) {
    browser.storage.sync.set({
        key: document.querySelector("#key").value
    });
    e.preventDefault();
}

console.log("update-popup.js: 3 request ");

//document.querySelector("form.update-encryption-key").addEventListener('click', function () {
//            generate_encryption_key();
//        });

document.querySelector("form.update-encryption-key").addEventListener("submit", submitUpdateEncryptionKey);

document.querySelector("#update-encryption-key-button").addEventListener('click', function () {
    update_encryption_key();
});

function update_encryption_key() {
    console.log("update-popup.js:update_encryption_key");

    var uuid = document.querySelector("#uuid").value;
    var key = document.querySelector("#key").value;
    var keyObjectType = document.querySelector("#keyObjectType").value;
    var username = document.querySelector("#username").value;
    var jwk = document.querySelector("#jwk").value;
    var username = document.querySelector("#username").value;

    console.log("update-popup.js:update_encryption_key setting: key=" + key);
    console.log("update-popup.js:update_encryption_key setting: username=" + username);
    console.log("update-popup.js:update_encryption_key setting: jwk=" + jwk);

    // now close this popuup window
    var newItem = {
        keyId: uuid,
        "username": username,
        "keyObjectType": keyObjectType,

"key": key,
        "jwk": jwk,
        "ext": true
    };

    console.log('data to be saved' + newItem);

    utils_functions.saveToIndexedDB('encryptionKeysDB', 'encryptionKeysStore', 'keyId', newItem).then(function (response) {
        console.log('data saved');
    }).catch(function (error) {
        console.log(error.message);
    });

    document.close();

}
