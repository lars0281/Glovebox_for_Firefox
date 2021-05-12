

document.body.style.backgroundColor = "white";
console.log("We made it yellow");

function eatPageReceiver(request, sender, sendResponse) {
    //  document.body.textContent = "";

    var word = request.regex;
    var replacementStr = request.replacement;

    console.log("pageWriter:eatPageReceiver: request.replacement: " + replacementStr);
    console.log("pageWriter:eatPageReceiver: request.regex: " + word);
    console.log("pageWriter:eatPageReceiver: sender: " + sender);
    console.log("pageWriter:eatPageReceiver: sendResponse: " + sendResponse);

    document.body.style.backgroundColor = "yellow";

    // var header = document.createElement('h1');
    // header.textContent = request.replacement;
    // document.body.appendChild(header);

    // start rewrite
    replaceText(document.body, word, replacementStr);

    console.log("pageWriter:eatPageReceiver: completed");

}
//browser.runtime.onMessage.addListener(eatPageReceiver);

function reWritePage(request, sender, sendResponse) {
    //  document.body.textContent = "";

    var word = request.regex;
    var replacementStr = request.replacement;


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



console.log("pageWriter:reWritePage: JSON(request): " + JSON.stringify(request ));

    console.log("pageWriter:reWritePage: request.replacement: " + replacementStr);
    console.log("pageWriter:reWritePage: request.regex: " + word);
    console.log("pageWriter:reWritePage: sender: " + sender);
    console.log("pageWriter:reWritePage: sendResponse: " + sendResponse);

    document.body.style.backgroundColor = "yellow";

    // var header = document.createElement('h1');
    // header.textContent = request.replacement;
    // document.body.appendChild(header);

    // start rewrite
    replaceText(document.body, word, replacementStr);

    console.log("pageWriter:eatPageReceiver: completed");

}
browser.runtime.onMessage.addListener(reWritePage);


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

 //console.log("pageWrite:replaceText,3: word:"  + word);
 //console.log("pageWrite:replaceText,3: regex:"  + regex);
 //console.log("pageWrite:replaceText,3: replacementStr:"  + replacementStr);


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
