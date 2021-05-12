

//document.body.style.backgroundColor = "white";
console.log("We made it green");

// this script is injected into all tabs in the browser and is in communicaiton with the background script. 
// When a piece of text (html?) is selected for encryption, this selection is sent to the background script for encryption. 
// And is returned  encrypted in the form of a Glovebox statement. 

// To do: 
// 1 Attach event handler to any Glovebox staments such that the user can right click on any part of the token to have it decrypted. 



var selection_html = "";
if (typeof window.getSelection != "undefined") {
	var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            selection_html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            selection_html = document.selection.createRange().htmlText;
        }
    }
 console.log("pageGetHtml.js:##selected html: " + selection_html);





// pull out the complete html of the selection



// call to background.js
console.log("selection_html: " + selection_html );
var sending = browser.runtime.sendMessage({
    greeting: "######## Greeting from the content script ###########"
	});
  sending.then(handleResponse, handleError);



// this function is attahed to an event listene and is called from background.js

function getHtml(request, sender, sendResponse) {
    //  document.body.textContent = "";

  console.log("pageGetHtml.js:getHtml; document.body.textContent.length=" + document.body.textContent.length);
  console.log("pageGetHtml.js:getHtml; document.innerText.length=" + document.body.innerText.length);
  console.log("pageGetHtml.js:eatPageReceiver; document.body.innerText.length=" + document.body.innerText.length);
  console.log("pageGetHtml.js:eatPageReceiver; document.innerHTML.length=" + document.body.innerHTML.length);
  console.log("pageGetHtml.js:eatPageReceiver; document.body.innerHTML.length=" + document.body.innerHTML.length);


    console.log("pageGetHtml:eatPageReceiver: request: " + request);
console.log("pageGetHtml:eatPageReceiver: request: " + JSON.stringify(request));

    console.log("pageGetHtml:eatPageReceiver: sender: " + sender);
console.log("pageGetHtml:eatPageReceiver: sender: " + JSON.stringify(sender));
    console.log("pageGetHtml:eatPageReceiver: sendResponse: " + sendResponse);
console.log("pageGetHtml:eatPageReceiver: sendResponse: " + JSON.stringify(sendResponse));


    var word = request.regex;
    var replacementStr = request.replacement;

    console.log("pageGetHtml:eatPageReceiver: request.replacement: " + replacementStr);
    console.log("pageGetHtml:eatPageReceiver: request.regex: " + word);


    // start rewrite
    replaceText(document.body, word, replacementStr);

    console.log("pageGetHtml:eatPageReceiver: completed");

}


function notifyBackgroundPage(e) {
	console.log("######### notifyBackgroundPage.js: Message from the content script: " );

	var sending = browser.runtime.sendMessage({
    greeting: "Greeting from the content script"
  });
  sending.then(handleResponse, handleError);  
}

//window.addEventListener("click", notifyBackgroundPage);

// add listener to page
browser.runtime.onMessage.addListener(getHtml);


// replace the html, not just the text.  
function replaceHTML(node, word, replacementStr) {

// identify the starting point of the Glovebox statement to be replaced


// identify the end point of the Glovebox statement to be replaced

// create a documentfragment object of the complete Glovebox node


// replace the glovebox node documentFragment with the decrypted html



}

function replaceText(node, word, replacementStr) {
    // Setting textContent on a node removes all of its children and replaces
    // them with a single text node. Since we don't want to alter the DOM aside
    // from substituting text, we only substitute on single text nodes.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent

    console.log("pageWrite:replaceText: replace:" + word + " with:" + replacementStr);

    if (node.nodeType === Node.TEXT_NODE) {
        // This node only contains text.
        // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType.

        // Skip textarea nodes due to the potential for accidental submission
        // of substituted emoji where none was intended.
        if (node.parentNode &&
            node.parentNode.nodeName === 'TEXTAREA') {
            return;
        }

        // Because DOM manipulation is slow, we don't want to keep setting
        // textContent after every replacement. Instead, manipulate a copy of
        // this string outside of the DOM and then perform the manipulation
        // once, at the end.
        let content = node.textContent;

        // Replace every occurrence of 'word' in 'content' with its emoji.
        // Use the emojiMap for replacements.
        //for (let [word, emoji] of emojiMap) {
        // Grab the search regex for this word.
        //const regex = regexs.get(word);

       // const regex = "/"+word+"/g";
        const regex = new RegExp(word);

        // Actually do the replacement / substitution.
        // Note: if 'word' does not appear in 'content', nothing happens.

// console.log("pageWrite:replaceText,3: word:"  + word);
// console.log("pageWrite:replaceText,3: regex:"  + regex);
// console.log("pageWrite:replaceText,3: replacementStr:"  + replacementStr);


        //      content = content.replace(regex, emoji);
        //content = content.replace(regex, "<span class='highlight'>" + "emoji" + "</span>" );
        content = content.replace(regex, replacementStr);
        //      content = content.replace(regex, '<m style="background-color:#ff0;font-size:100%">' + 'emoji' + '</m>' );
        //     content = content.replace(regex, "<code>" + "emoji" + "</code>" );

        //}

        // Now that all the replacements are done, perform the DOM manipulation.
        node.textContent = content;
    } else {
        // This node contains more than just text, call replaceText() on each
        // of its children.
        for (let i = 0; i < node.childNodes.length; i++) {
            replaceText(node.childNodes[i], word, replacementStr );
        }
    }
}
