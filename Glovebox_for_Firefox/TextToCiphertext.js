

// create <glovebox> node 


function textToCiphertext(request, sender, sendResponse) {
    //  document.body.textContent = "";

    var word = request.regex;
    var replacementStr = "";
    replacementStr = request.text_replacement_text;
    console.log("TextToCiphertext:textToCiphertext: JSON(request): " + JSON.stringify(request));

    console.log("TextToCiphertext:textToCiphertext: text replacement: " + replacementStr);
    console.log("TextToCiphertext:textToCiphertext: request.regex: " + word);
  
    // pay attention to not interfere with the node structure. Do not introduce more nodes if at all possible.

    // The selection may span multiple nodes. All of whom will be removed. The Glovebox string will in added to the textnode that preceds


    if (replacementStr) {

        console.log("p1");
        var selection_html = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                console.log("p2," + sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {

                    // What is the node immediately preceeding the selection ?


                    console.log("sel.getRangeAt(i).commonAncestorContainer.nodeType: " + sel.getRangeAt(i).commonAncestorContainer.nodeType);

                    console.log("sel.getRangeAt(i).startContainer.nodeType: " + sel.getRangeAt(i).startContainer.nodeType);
                    console.log("sel.getRangeAt(i).startOffset: " + sel.getRangeAt(i).startOffset);
                    console.log("sel.getRangeAt(i).startContainer: " + sel.getRangeAt(i).startContainer);

                    console.log("sel.getRangeAt(i).startContainer.textContent: " + sel.getRangeAt(i).startContainer.textContent);

                    console.log("sel.getRangeAt(i).endContainer.nodeType: " + sel.getRangeAt(i).endContainer.nodeType);
                    console.log("sel.getRangeAt(i).endOffset: " + sel.getRangeAt(i).endOffset);
                    console.log("sel.getRangeAt(i).endContainer: " + sel.getRangeAt(i).endContainer);

                    console.log("sel.getRangeAt(i).  is same: " + sel.getRangeAt(i).endContainer.isSameNode(sel.getRangeAt(i).startContainer));

                    // If start node is a text node and the selection starts inside the node text:
                    // append the cipher text to text in this node. 
                    if (sel.getRangeAt(i).endContainer.isSameNode(sel.getRangeAt(i).startContainer)) {
                        if (sel.getRangeAt(i).startContainer.nodeType == 3) {

                            let begin = sel.getRangeAt(i).startContainer.textContent.substring(0, sel.getRangeAt(i).startOffset);

                            let end = sel.getRangeAt(i).endContainer.textContent.substring(sel.getRangeAt(i).endOffset);

                            sel.getRangeAt(i).startContainer.textContent = begin + replacementStr + end;
                            console.log("p4");
                        } else {
                            console.log("p5");
                        }
                    } else {
                        console.log("start and end node not the same");
                        if (sel.getRangeAt(i).startContainer.nodeType == 3) {
                            // append the cipher text to the start node
                            let begin = sel.getRangeAt(i).startContainer.textContent.substring(0, sel.getRangeAt(i).startOffset);

                            sel.getRangeAt(i).startContainer.textContent = begin + replacementStr ;
                            // cut back the end node
                            if (sel.getRangeAt(i).endContainer.nodeType == 3) {
console.log ("sel.getRangeAt(i).endOffset" + sel.getRangeAt(i).endOffset );

console.log ("sel.getRangeAt(i).endContainer.textContent.length" + sel.getRangeAt(i).endContainer.textContent.length );

console.log ("sel.getRangeAt(i).endContainer.textContent.substring( 2,5)" + sel.getRangeAt(i).endContainer.textContent.substring( 2,5) );

                                 let end = sel.getRangeAt(i).endContainer.textContent.substring( sel.getRangeAt(i).endOffset   );
console.log ("sel" + end);
  // wipe the selected html, the selection may have contained markup at it should be removed too
               //        var e = sel.getRangeAt(i).extractContents();

sel.getRangeAt(i).endContainer.textContent =  end;
                            }
                            console.log("p4");
                        } else {
                            console.log("p5");
                        }
                    }

                    //   console.log("p3");
                    //     container.appendChild(sel.getRangeAt(i).cloneContents());
                    // insert before

                    // Create the new node to insert
                    //     let newNode = document.createElement("bold");
                    //     newNode.innerHTML = "key name";

                    //  console.log("p4");

                    // Get a reference to the parent node
                    //let parentDiv = sel.getRangeAt(i).parentNode;

                    //parentDiv.insertBefore(newNode, sp2);
                    //		let insertedNode = 		sel.getRangeAt(i)
                    //  sel.getRangeAt(i).insertBefore(newNode);

                    //  console.log("pageWriterHTMLtoCiphertext:reWritePage: inserted: " + JSON.stringify(newNode));

                    // wipe the selected html
                    //   var e = sel.getRangeAt(i).extractContents();

                    // insert the new Glovebox text
                     //el.getRangeAt(i).insertNode(document.createTextNode(replacementStr));


                }
                //            selection_html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                selection_html = document.selection.createRange().htmlText;
            }
        }
        console.log("pageWriterHTMLtoCiphertext.js:##selected html: " + selection_html);

        // replace the selected HTML


        //document.body.style.backgroundColor = "yellow";

        // var header = document.createElement('h1');
        // header.textContent = request.replacement;
        // document.body.appendChild(header);

        // start rewrite
        // replaceText(document.body, word, replacementStr);

    } else {
        console.log("TextToCiphertext: no replacement string provided");

    }

  	try {
		console.log("remove listener");
	    browser.runtime.onMessage.removeListener(textToCiphertext);
	} catch (e) {
		console.log(e);
	}

    
    console.log("pageWriterHTMLtoCiphertext:eatPageReceiver: completed");

}

browser.runtime.onMessage.addListener(textToCiphertext);
