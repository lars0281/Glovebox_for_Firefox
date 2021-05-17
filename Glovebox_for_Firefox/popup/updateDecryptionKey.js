
import * as utils_functions from '/utils/functions.js';



document.querySelector("form.update-decryption-key").addEventListener("submit", submitUpdateDecryptionKey);

document.querySelector("#update-decryption-key-button").addEventListener('click', function () {
    update_decryption_key();
});


function submitUpdateDecryptionKey(e) {
    browser.storage.sync.set({
        key: document.querySelector("#key").value
    });
    e.preventDefault();
}


function update_decryption_key() {
    console.log("update-popup.js:update_decryption_key");

    var uuid = document.querySelector("#uuid").value;
    var key = document.querySelector("#key").value;
    var keyObjectType = document.querySelector("#keyObjectType").value;
    var username = document.querySelector("#username").value;
    var jwk = document.querySelector("#jwk").value;
    var username = document.querySelector("#username").value;

    console.log("update-popup.js:update_decryption_key setting: key=" + key);
    console.log("update-popup.js:update_decryption_key setting: username=" + username);
    console.log("update-popup.js:update_decryption_key setting: jwk=" + jwk);

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

    utils_functions.saveToIndexedDB('decryptionKeysDB', 'decryptionKeysStore', 'keyId', newItem).then(function (response) {
        console.log('data saved');
    }).catch(function (error) {
        console.log(error.message);
    });

    document.close();

}
