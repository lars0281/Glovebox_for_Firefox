/* global saveCollectedKeyBlobs, saveCollectedBlobs, uuidv4, preventWindowDragAndDrop */

"use strict";

class Keys {
    constructor(containerEl) {
        this.containerEl = containerEl;
        //console.log("21" + containerEl);
        // console.log("22" + this.containerEl);
        this.state = {
            collectedBlobs: [],
            collectedKeyBlobs: [],
            lastMessage: undefined,
        };

        this.onClick = this.onClick.bind(this);

   //     this.containerEl.querySelector("button.add-decryptionkeys").onclick = this.onTest;
   
    this.containerEl.querySelector("button.reload-images").onclick = this.onTest;
  // document.getElementById("22").onclick = this.onTest;
   
   
  // document.getElementById('key2').value = "this.onTest";
   //  document.querySelector('.key').value = "this.onTest";
   //  document.querySelector('.add-decryptionkeys').onclick = this.onTest;

        const app = document.getElementById('app');
        const pr = document.createElement("h4");
        pr.innerHTML = "test<table ><tr><td>2</td></tr> </table>";
        app.appendChild(pr);
        console.log("24");

        //  this.containerEl.querySelector("button.save-collection").onclick = this.onClick;

        // show all keys in database

        const keytable = document.getElementById("keys");
        const tb = document.createElement("table");
        tb.setAttribute("border", "1");
        //tb.innerHTML = "test2";
        keytable.appendChild(tb);

        const tr = document.createElement("tr");
        // setup column headers for table
        tb.appendChild(tr);
        const td = document.createElement("td");
        td.innerHTML = "key name";
        tr.appendChild(td);
        const td2 = document.createElement("td");
        td2.innerHTML = "key";
        tr.appendChild(td2);
        const td3 = document.createElement("td");
        td3.innerHTML = "jwk";
        tr.appendChild(td3);

        console.log("25");

        var dbRequest = indexedDB.open("gloveboxKeys");

        dbRequest.onerror = function (event) {
            reject(Error("Error text"));
        };

        dbRequest.onupgradeneeded = function (event) {
            // Objectstore does not exist. Nothing to load
            event.target.transaction.abort();
            reject(Error('Not found'));
        };

        dbRequest.onsuccess = function (event) {
            var database = event.target.result;
            var transaction = database.transaction('decryptionKeys', 'readonly');
            var objectStore = transaction.objectStore('decryptionKeys');

            if ('getAll' in objectStore) {
                // IDBObjectStore.getAll() will return the full set of items in our store.
                objectStore.getAll().onsuccess = function (event) {
                    const res = event.target.result;
                    console.log(res);

                    for (const url of res) {
                        // create table row
                        const tr = document.createElement("tr");

                        console.log("key:" + JSON.stringify(url));
                        const td1 = document.createElement("td");
                        td1.innerHTML = url.username;
                        tr.appendChild(td1);

                        const td2 = document.createElement("td");
                        td2.innerHTML = url.jwk.k;
                        tr.appendChild(td2);

                        const td3 = document.createElement("td");
                        td3.innerHTML = JSON.stringify(url.jwk);
                        tr.appendChild(td3);

                        // create add row to table
                        tb.appendChild(tr);

                    }

                };
            } else {
                // Fallback to the traditional cursor approach if getAll isn't supported.
                var timestamps = [];
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        console.log(cursor.value);
                        //        timestamps.push(cursor.value);
                        cursor.continue();
                    } else {
                        //        logTimestamps(timestamps);
                    }
                };
            }
        };

       const enckeysUl = this.containerEl.querySelector("table.encryptionkeys");
     //   const enckeysUl = document.querySelector('#foo\\:bar');
        console.log("23" + enckeysUl);
        //  while (enckeysUl.firstChild) {
        //            enckeysUl.removeChild(enckeysUl.firstChild);
        //        }


        const li = document.createElement("li");
        const img = document.createElement("img");
        li.setAttribute("id", "uuid");
        //li.innerHTML("uuid");

        img.setAttribute("src", "blobUrl");
        li.appendChild(img);

        enckeysUl.appendChild(li);

        console.log("keys.js: table");

    }

    get collectionNameValue() {
        console.log("popup.js: get collectionNameValue");

        return this.containerEl.querySelector("input.collection-name").value;
    }

    get publicKeyValue() {
        console.log("keys.js: get publicKeyValue");
        // new Blob(['hello world']);
        return this.containerEl.querySelector("textarea.public-key").value;
        //return new Blob([this.containerEl.querySelector("textarea.public-key").value]);

        // https://developer.mozilla.org/en-US/docs/Web/API/Blob

    }

    setState(state) {
        console.log("keys.js: setState");
        // Merge the new state on top of the previous one and re-render everything.
        this.state = Object.assign(this.state, state);
        this.render();
    }

onTest() {
        console.log("keys.js: onTest");
} 
    onClick() {
        console.log("keys.js: onClick");
        if (!this.collectionNameValue) {
            this.setState({
                lastMessage: {
                    text: "The collection name is mandatory.",
                    type: "error"
                },
            });

            setTimeout(() => {
                this.setState({
                    lastMessage: undefined
                });
            }, 2000);

            return;
        } else {
            console.log("keys.js: 2");

        }
        console.log("keys.js: 3");
        console.log("keys.js: 3 cn " + this.collectionNameValue);
        console.log("keys.js: 3 pk " + this.publicKeyValue);

        // Let us open our database
        var request = window.indexedDB.open("toDoList", 4);

        console.log("keys.js: 3 request " + request);

        // This handler is called when a new version of the database
        // is created, either when one has not been created before
        // or when a new version number is submitted by calling
        // window.indexedDB.open().
        // This handler is only supported in recent browsers.
        request.onupgradeneeded = function (event) {
            var db = event.target.result;

            db.onerror = function (event) {
                //note.innerHTML += "<li>Error loading database.</li>";
                console.log("keys.js: 2 request error ");
            };

            // Create an objectStore for this database

            var objectStore = db.createObjectStore("toDoList", {
                    keyId: "taskTitle"
                });

            // define what data items the objectStore will contain

            objectStore.createIndex("hours", "hours", {
                unique: false
            });
            objectStore.createIndex("minutes", "minutes", {
                unique: false
            });
            objectStore.createIndex("day", "day", {
                unique: false
            });
            objectStore.createIndex("month", "month", {
                unique: false
            });
            objectStore.createIndex("year", "year", {
                unique: false
            });

            objectStore.createIndex("notified", "notified", {
                unique: false
            });

            //note.innerHTML += "<li>Object store created.</li>";
        };

        request.onerror = function (event) {
            console.log("keys.js: 3 request error ");

        };

        request.onsuccess = function (event) {
            console.log("keys.js: 3 request onsuccess  ");

        };

        //(function() {
        //  'use strict';

        //check for support
        if (!('indexedDB' in window)) {
            console.log('keys.js:This browser doesn\'t support IndexedDB');
            return;
        }

        var dbPromise = idb.open('test-db2', 1, function (upgradeDb) {
                console.log('keys.js:making a new object store');
                if (!upgradeDb.objectStoreNames.contains('firstOS')) {
                    upgradeDb.createObjectStore('firstOS');
                }
            });

        var dbPromise = idb.open('test-db4', 1, function (upgradeDb) {
                console.log("popup.js: 3 open ");
                if (!upgradeDb.objectStoreNames.contains('people')) {
                    var peopleOS = upgradeDb.createObjectStore('people', {
                            keyId: 'email'
                        });
                    peopleOS.createIndex('gender', 'gender', {
                        unique: false
                    });
                    peopleOS.createIndex('ssn', 'ssn', {
                        unique: true
                    });
                }
                if (!upgradeDb.objectStoreNames.contains('notes')) {
                    var notesOS = upgradeDb.createObjectStore('notes', {
                            autoIncrement: true
                        });
                    notesOS.createIndex('title', 'title', {
                        unique: false
                    });
                }
                if (!upgradeDb.objectStoreNames.contains('logs')) {
                    var logsOS = upgradeDb.createObjectStore('logs', {
                            keyId: 'id',
                            autoIncrement: true
                        });
                }
            });
        console.log('keys.js:making a new object dbPromise' + dbPromise);

        //})();


        //        saveCollectedBlobs(this.collectionNameValue, this.state.collectedBlobs)
        saveCollectedKeyBlobs(this.collectionNameValue, this.publicKeyValue)
        .then(() => {
            console.log("keys.js: saveCollectedKeyBlobs");

            this.setState({
                lastMessage: {
                    text: "All the collected images have been saved",
                    type: "success"
                },
                collectedImageBlobs: [],
            });

            setTimeout(() => {
                this.setState({
                    lastMessage: undefined
                });
            }, 2000);
        })
        .catch((err) => {
            this.setState({
                lastMessage: {
                    text: `Failed to save collected images: ${err}`,
                    type: "error"
                },
            });

            setTimeout(() => {
                this.setState({
                    lastMessage: undefined
                });
            }, 2000);
        });
        console.log("keys.js: 4");
    }

    render() {
        console.log("keys.js: render");
        const {
            collectedBlobs,
            lastMessage
        } = this.state;

        const lastMessageEl = this.containerEl.querySelector("p#error-message");
        if (lastMessage) {
            lastMessageEl.setAttribute("class", lastMessage.type);
            lastMessageEl.textContent = lastMessage.text;
        } else {
            lastMessageEl.setAttribute("class", "");
            lastMessageEl.textContent = "";
        }

        const thumbnailsUl = this.containerEl.querySelector("ul.thumbnails");
        while (thumbnailsUl.firstChild) {
            thumbnailsUl.removeChild(thumbnailsUl.firstChild);
        }
        console.log("keys.js: 5");

        collectedBlobs.forEach(({
                uuid,
                blobUrl
            }) => {
            const li = document.createElement("li");
            const img = document.createElement("img");
            li.setAttribute("id", uuid);
            img.setAttribute("src", blobUrl);
            li.appendChild(img);

            thumbnailsUl.appendChild(li);
        });
    }
}

const keys = new Keys(document.getElementById('app'));

async function fetchBlobFromUrl(fetchUrl) {
    const res = await fetch(fetchUrl);
    const blob = await res.blob();

    return {
        blob,
        blobUrl: URL.createObjectURL(blob),
        fetchUrl,
        uuid: uuidv4(),
    };
}

preventWindowDragAndDrop();

browser.runtime.onMessage.addListener(async(msg) => {
    if (msg.type === "new-collected-images") {
        let collectedBlobs = popup.state.collectedBlobs || [];
        const fetchRes = await fetchBlobFromUrl(msg.url);
        collectedBlobs.push(fetchRes);
        popup.setState({
            collectedBlobs
        });
        return true;
    }
});

browser.runtime.sendMessage({
    type: "get-pending-collected-urls"
}).then(async res => {
    let collectedBlobs = popup.state.collectedBlobs || [];

    for (const url of res) {
        const fetchRes = await fetchBlobFromUrl(url);
        collectedBlobs.push(fetchRes);
        popup.setState({
            collectedBlobs
        });
    }
});
