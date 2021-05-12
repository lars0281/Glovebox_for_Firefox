/* global saveCollectedKeyBlobs, saveCollectedBlobs, uuidv4, preventWindowDragAndDrop */

"use strict";

class Popup {
    constructor(containerEl) {
        this.containerEl = containerEl;

        this.state = {
            collectedBlobs: [],
            collectedKeyBlobs: [],
            lastMessage: undefined,
        };

        this.onClick = this.onClick.bind(this);

        this.containerEl.querySelector("button.save-collection").onclick = this.onClick;
		
    }

    get collectionNameValue() {
	    console.log("popup.js: get collectionNameValue");
    
        return this.containerEl.querySelector("input.collection-name").value;
    }

    get publicKeyValue() {
	    console.log("popup.js: get publicKeyValue");
		  // new Blob(['hello world']);
        return this.containerEl.querySelector("textarea.public-key").value;
		//return new Blob([this.containerEl.querySelector("textarea.public-key").value]);
		
		// https://developer.mozilla.org/en-US/docs/Web/API/Blob
		
    }



    setState(state) {
		    console.log("popup.js: setState");
        // Merge the new state on top of the previous one and re-render everything.
        this.state = Object.assign(this.state, state);
        this.render();
    }

    onClick() {
        console.log("popup.js: onClick");
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
            console.log("popup.js: 2");

        }
        console.log("popup.js: 3");
        console.log("popup.js: 3 cn " + this.collectionNameValue);
        console.log("popup.js: 3 pk " + this.publicKeyValue );



// Let us open our database
var request = window.indexedDB.open("toDoList", 4);


console.log("popup.js: 3 request " + request );

// This handler is called when a new version of the database
// is created, either when one has not been created before
// or when a new version number is submitted by calling
// window.indexedDB.open().
// This handler is only supported in recent browsers.
request.onupgradeneeded = function(event) {
  var db = event.target.result;

  db.onerror = function(event) {
    //note.innerHTML += "<li>Error loading database.</li>";
console.log("popup.js: 2 request error " );
  };

  // Create an objectStore for this database

  var objectStore = db.createObjectStore("toDoList", { keyId: "taskTitle" });

  // define what data items the objectStore will contain

  objectStore.createIndex("hours", "hours", { unique: false });
  objectStore.createIndex("minutes", "minutes", { unique: false });
  objectStore.createIndex("day", "day", { unique: false });
  objectStore.createIndex("month", "month", { unique: false });
  objectStore.createIndex("year", "year", { unique: false });

  objectStore.createIndex("notified", "notified", { unique: false });

  //note.innerHTML += "<li>Object store created.</li>";
};

request.onerror = function(event) {
console.log("popup.js: 3 request error " );

};

request.onsuccess  = function(event) {
console.log("popup.js: 3 request onsuccess  " );

};

//(function() {
//  'use strict';

  //check for support
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }

  var dbPromise = idb.open('test-db2', 1, function(upgradeDb) {
    console.log('making a new object store');
    if (!upgradeDb.objectStoreNames.contains('firstOS')) {
      upgradeDb.createObjectStore('firstOS');
    }
  });

  var dbPromise = idb.open('test-db4', 1, function(upgradeDb) {
        console.log("popup.js: 3 open ");
    if (!upgradeDb.objectStoreNames.contains('people')) {
      var peopleOS = upgradeDb.createObjectStore('people', {keyId: 'email'});
      peopleOS.createIndex('gender', 'gender', {unique: false});
      peopleOS.createIndex('ssn', 'ssn', {unique: true});
    }
    if (!upgradeDb.objectStoreNames.contains('notes')) {
      var notesOS = upgradeDb.createObjectStore('notes', {autoIncrement: true});
      notesOS.createIndex('title', 'title', {unique: false});
    }
    if (!upgradeDb.objectStoreNames.contains('logs')) {
      var logsOS = upgradeDb.createObjectStore('logs', {keyId: 'id',
        autoIncrement: true});
    }
  });
    console.log('making a new object dbPromise' + dbPromise);

//})();



//        saveCollectedBlobs(this.collectionNameValue, this.state.collectedBlobs)
        saveCollectedKeyBlobs(this.collectionNameValue, this.publicKeyValue)
        .then(() => {
        console.log("popup.js: saveCollectedKeyBlobs");
		
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
        console.log("popup.js: 4");
    }

    render() {
		    console.log("popup.js: render");
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
        console.log("popup.js: 5");

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

const popup = new Popup(document.getElementById('app'));

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
