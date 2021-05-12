

browser.runtime.onMessage.addListener(request => {
    console.log("pageCopier.js:Message received from the background script:");
    console.log("pageCopier.js: " + request.greeting);

    // look through the html text to find Glovebox tokens wherever they might be. ( And when found, delete them ? )


    // return Promise.resolve({response: "Hi from content script"});
    // return Promise.resolve({response: { "msg": "Hi from content script--", "docTextSize": "23456" }});
    let doctext = document.body.textContent;
    console.log("pageCopier.js: doctext.length=" + doctext.length);

    // regexp matching Glovebox token contaning decryption keys.
    var regex = /:Glovebox:[^:]*:[^:]*:[^:]*:/g;

    console.log("pageCopier.js: regex=" + regex);

    var match = doctext.match(regex);
    console.log("pageCopier.js: match length=" + match.length);
    console.log("pageCopier.js: match=" + match);

    var tokens = ""
        for (var i = 0; i < match.length; i++) {
            tokens = tokens + match[i];
            console.log("match length: " + match[i]);
            console.log("match length: " + match[i].length);
            //    document.write(match[i]);

        }

        console.log("return: " + tokens);

    return Promise.resolve({
        response: {
            "doc": match
        }
    });
    //return Promise.resolve({response: doc });


});

console.log("pageCopier.js: ...");
document.body.style.backgroundColor = "green";
console.log("pageCopier.js: We made it green");
console.log("pageCopier.js: document text size: " + document.body.textContent.length);
//console.log("pageCopier.js: document" + document.body.textContent);
console.log("pageCopier.js: document html size: " + document.body.innerHTML.length);
//console.log("pageCopier.js: document" + alert(document.body.outerHTML));


function injectImage(request, sender, sendResponse) {
    console.log("pageCopier.js: injectImage:-");
    //removeEverything();
    //insertImage(request.imageURL);


}


