


function Paste_GloveboxAcceptedSecureKeyOfferToken(request, sender, sendResponse) {
	

    var replacementStr = request.Paste_GloveboxAcceptedSecureKeyOfferToken_text;
    console.log("Paste_GloveboxAcceptedSecureKeyOfferToken.js JSON(request): " + JSON.stringify(request));

if (replacementStr){

    var selection_html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                // insert the token text here, inside the text node at the begining of the range
// get node at the begining of the range
var startNode = sel.getRangeAt(i).startContainer;

    console.log("Paste_GloveboxAcceptedSecureKeyOfferToken.js startNode: " + startNode);
    console.log("Paste_GloveboxAcceptedSecureKeyOfferToken.js startNode.nodeType: " + startNode.nodeType);
	var nodetext = startNode.textContent;
    console.log("Paste_GloveboxAcceptedSecureKeyOfferToken.js startNode.textContent: " + nodetext);
	var position = sel.getRangeAt(i).startOffset;
    console.log("Paste_GloveboxAcceptedSecureKeyOfferToken.js sel.getRangeAt(i).startOffset : " + position );

//var output = [nodetext.slice(0, position), replacementStr, "-FFFF-" ,nodetext.slice(position)].join('');
var output = [nodetext.slice(0, position), replacementStr ].join('');
console.log(output);

sel.getRangeAt(i).startContainer.textContent = output;

// then remove the rest of the range

                //sel.getRangeAt(i).insertNode(document.createTextNode(replacementStr));

                //container.appendChild(sel.getRangeAt(i).cloneContents());
				
            }
            //         selection_html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            //       selection_html = document.selection.createRange().htmlText;

        }
    }

    return Promise.resolve({
        response: {
            "selection_html": "ok"
        }
    });
}
}

browser.runtime.onMessage.addListener(Paste_GloveboxAcceptedSecureKeyOfferToken);

