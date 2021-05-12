

function Get_GloveboxSecureKeyTokenFromOffer(request, sender, sendResponse) {

    var replacementStr = request.GloveboxSecureKeyTokenFromOffer_replacement;
    console.log("Get_GloveboxSecureKeyTokenFromOffer: JSON(request): " + JSON.stringify(request));

    console.log("Get_GloveboxSecureKeyTokenFromOffer: replacement text: " + replacementStr);

    if (replacementStr) {
        // check for correclt formated input

        var newFragment = document.createRange().createContextualFragment(replacementStr);

        var modified_selection_text;
        var glovbox_token_text = "token_text";

        console.log("p1.2");

        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                // var container = document.createElement("div");
                console.log("p2," + sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {

                    var full_text = "";

                    // the GloveboxToken is a plaintext node without markup.
                    // Get the preceeding text content.
                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: sel.getRangeAt(i).commonAncestorContainer: " + sel.getRangeAt(i).commonAncestorContainer);
                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: sel.getRangeAt(i).commonAncestorContainer.textContent: " + sel.getRangeAt(i).commonAncestorContainer.textContent);

// node inside which token begins
var start_token_node;
                    // regexp that matched a glovebox token for ....
                  
                    const glovebox_header_regex = new RegExp('(:GloveboxSecureKeyTokenFromOffer:[^:]*:)', 'm');

                    var previous_text = "";
                    var following_text = "";

                    console.log("p3,commonAncestorContainer " + sel.getRangeAt(i).commonAncestorContainer);
                    console.log("p3,commonAncestorContainer nodetype " + sel.getRangeAt(i).commonAncestorContainer.nodeType);

                    console.log("p3,commonAncestorContainer textContent 1 " + sel.getRangeAt(i).toString());
                    console.log("p3,commonAncestorContainer textContent 2 " + sel.getRangeAt(i).commonAncestorContainer.textContent);

                    // check if node space surrounding the selection is fragmented into multiple text nodes.


                    var n = 0;

                    // loop backwards to determiine how far the text-only nodes goes.

                    console.log("sel.getRangeAt(i).commonAncestorContainer: " + sel.getRangeAt(i).commonAncestorContainer);
                    //console.log("p4,," + sel.getRangeAt(i).commonAncestorContainer.nodeType);
                    //console.log("p4,-," + sel.getRangeAt(i).commonAncestorContainer.textContent);
                    //console.log("p4,," + sel.getRangeAt(i).commonAncestorContainer.previousSibling);
                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: sel.getRangeAt(i).commonAncestorContainer.textContent: " + sel.getRangeAt(i).commonAncestorContainer.textContent);

                    if (sel.getRangeAt(i).commonAncestorContainer) {
                        console.log("p4");
                        console.log("sel.getRangeAt(i).commonAncestorContainer.nodeType: " + sel.getRangeAt(i).commonAncestorContainer.nodeType);
                        if (sel.getRangeAt(i).commonAncestorContainer.nodeType != 1) {
                            console.log("p4");
                            // step forward from the selection to assemble all consecutive text nodes
                            var nextnode = sel.getRangeAt(i).commonAncestorContainer.nextSibling;
                            if (nextnode) {
                                console.log("p5," + nextnode.nodeType);
                                n = 0;
                                while (nextnode && nextnode.nodeType == 3 && n < 8) {
                                    // break at first occurence of non-text node (max 8)

                                    console.log("p3,commonAncestorContainer nextSibling (" + n + ")  nodeType: " + nextnode.nodeType);
                                    console.log("p3,commonAncestorContainer nextSibling (" + n + ") textContent: " + nextnode.textContent);
                                    console.log("p3,commonAncestorContainer nextSibling (" + n + ") length: " + nextnode.textContent.length);
                                    following_text = nextnode.textContent + following_text;
                                    console.log("following_text: " + following_text);
                                    nextnode = nextnode.nextSibling;
                                    n = n + 1;
                                }
                            }

                            console.log("Get_GloveboxSecureKeyTokenFromOffer.js: previous_text: " + previous_text);
                            console.log("Get_GloveboxSecureKeyTokenFromOffer.js: following_text: " + following_text);

                            if (sel.getRangeAt(i).commonAncestorContainer.nodeType == 1) {
                                full_text = sel.getRangeAt(i).commonAncestorContainer.textContent;
                                console.log("Get_GloveboxSecureKeyTokenFromOffer.js: YYYYY ");

                            } else {
                                console.log("Get_GloveboxSecureKeyTokenFromOffer.js: ZZZZZ ");

                                if (typeof previous_text != "undefined") {
                                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: Z 1");
                                    full_text = previous_text + sel.getRangeAt(i).commonAncestorContainer.textContent;
                                } else {
                                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: Z 2");
                                    full_text = sel.getRangeAt(i).commonAncestorContainer.textContent;
                                }
                                if (typeof following_text != "undefined") {
                                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: Z 3");
                                    full_text = full_text + following_text;

                                }

                            }

if ( glovebox_header_regex.exec(full_text)){
	// set  start_token_node here
                                    console.log("full_text: contains token");
						start_token_node = sel.getRangeAt(i).startContainer;
}else{
                                    console.log("full_text: does NOT contain token ");

}
                            // step backwards through previous sibling nodes to assemble the complete text surrponding the glovebox token.
                            // Stop at first markup or when a match on a complete tokwn has been found - whichever happens first.

                            var previousnode = sel.getRangeAt(i).commonAncestorContainer.previousSibling;
                            if (previousnode) {
                                console.log("p4,previousnode.nodeType: " + previousnode.nodeType);
                                //while ( previousnode.nodeType == 3 && n<3 ){
                                while (previousnode && previousnode.nodeType == 3 && n < 8) {
                                    // break at first occurence of non-text node (max 8)

                                    console.log("p3,commonAncestorContainer previousSibling (" + n + ")  nodeType: " + previousnode.nodeType);
                                    console.log("p3,commonAncestorContainer previousSibling (" + n + ") textContent: " + previousnode.textContent);
                                    console.log("p3,commonAncestorContainer previousSibling (" + n + ") length: " + previousnode.textContent.length);
                                    previous_text = previousnode.textContent + previous_text;
                                   
                                    console.log("previous_text: " + previous_text);
full_text = previous_text + full_text;
                                    console.log("full_text: " + full_text);
                                    // check if the full text contains a match on the pattern for a complete glovebox token

                                    //   while ((match3 = glovebox_header_regex.exec(full_text)) != null && k < 100) {
if ( glovebox_header_regex.exec(full_text)){
	// set  start_token_node here
                                    console.log("full_text: contains token");
						start_token_node = previousnode;

}else{
                                    console.log("full_text: does NOT contain token ");

}
 previousnode = previousnode.previousSibling;


                                    n = n + 1;
                                }
                            }

                        } else {
                            // there is no top level node above the selection. probably not a well-formed xml/html document. (plain text ?)
                            // take alternate action.
                            console.log("p4");
                        }
                    }

                    var selectStartOffset = sel.getRangeAt(i).startOffset;
                    console.log("Get_GloveboxSecureKeyTokenFromOffer:: Range.startOffset:" + selectStartOffset);

                    var selectEndOffset = sel.getRangeAt(i).endOffset;
                    console.log("Get_GloveboxSecureKeyTokenFromOffer:: Range.startOffset:" + selectEndOffset);
                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: sel.getRangeAt(i).commonAncestorContainer.textContent: " + sel.getRangeAt(i).commonAncestorContainer.textContent);

                    var selection_text = sel.getRangeAt(i).toString();
                    var rangesize = selection_text.length;
                    console.log("Get_GloveboxSecureKeyTokenFromOffer:: Range.size:" + rangesize);
                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: sel.getRangeAt(i).commonAncestorContainer.textContent: " + sel.getRangeAt(i).commonAncestorContainer.textContent);

                    var selection_end_pos = selectStartOffset + rangesize;

                    // get the whole of the surrounding text - bounded by first markup, or end of document, encountered on either end.

                    var fulltextofnode = sel.getRangeAt(i).startContainer.textContent;
                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: sel.getRangeAt(i).commonAncestorContainer.textContent: " + sel.getRangeAt(i).commonAncestorContainer.textContent);

                    console.log("Get_GloveboxSecureKeyTokenFromOffer:: Range.startContainer:" + fulltextofnode);

                    // grab the piece of the fulltext of the node preceeding the selected text and see if it contains the opening statement
                    var preceeding = fulltextofnode.substring(0, selectStartOffset);

                    console.log("Get_GloveboxSecureKeyTokenFromOffer:: preceeding: " + preceeding);
                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: sel.getRangeAt(i).commonAncestorContainer.textContent: " + sel.getRangeAt(i).commonAncestorContainer.textContent);

                    var following = fulltextofnode.substring(selectStartOffset + rangesize);

                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: following: " + following);

                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: sel.getRangeAt(i).commonAncestorContainer.textContent: " + sel.getRangeAt(i).commonAncestorContainer.textContent);

                    // check if selection contain the opening statement, and if not look in the preceeding


                    // ok, see if it is in the preceeding text with selection_text appended

                    // pick the glovobox text which intersects with the selection text.
                    // - if more than one, only the first one.

                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: previous_text: " + previous_text);
                    console.log("Get_GloveboxSecureKeyTokenFromOffer.js: following_text: " + following_text);

                    if (sel.getRangeAt(i).commonAncestorContainer.nodeType == 1) {
                        full_text = sel.getRangeAt(i).commonAncestorContainer.textContent;
                        console.log("Get_GloveboxSecureKeyTokenFromOffer.js: YYYYY ");

                    } else {
                        console.log("Get_GloveboxSecureKeyTokenFromOffer.js: ZZZZZ ");

                        if (typeof previous_text != "undefined") {
                            console.log("Get_GloveboxSecureKeyTokenFromOffer.js: Z 1");
                            full_text = previous_text + sel.getRangeAt(i).commonAncestorContainer.textContent;
                        } else {
                            console.log("Get_GloveboxSecureKeyTokenFromOffer.js: Z 2");
                            full_text = sel.getRangeAt(i).commonAncestorContainer.textContent;
                        }
                        if (typeof following_text != "undefined") {
                            console.log("Get_GloveboxSecureKeyTokenFromOffer.js: Z 3");
                            full_text = full_text + following_text;

                        }

                    }

                    console.log("Get_GloveboxSecureKeyTokenFromOffer: this text has to contain the Glovebox header:" + full_text);
                    // get a nodelist encompassing all of the full text.
                    // Do this by gettign chil nodes of the parent node of the first node in the selection range.
                    console.log("sel.getRangeAt(i).startContainer " + sel.getRangeAt(i).startContainer);
                    console.log("sel.getRangeAt(i).startContainer.parentNode " + sel.getRangeAt(i).startContainer.parentNode);
                    console.log("sel.getRangeAt(i).startContainer.parentNode.childNodes " + sel.getRangeAt(i).startContainer.parentNode.childNodes);
                    console.log("sel.getRangeAt(i).startContainer.parentNode.childNodes.length " + sel.getRangeAt(i).startContainer.parentNode.childNodes.length);

                    // step through the node list and flag the text nodes that contain the selection range (and token)
                  //  var range = sel.getRangeAt(i);
                   // var myNodeList = sel.getRangeAt(i).startContainer.parentNode.childNodes;
                  //  for (let i = 0; i < myNodeList.length; i++) {
                  //      let item = myNodeList[i];
                  //      console.log("item.nodeName " + item.nodeName);
                   //     console.log("item.nodeType " + item.nodeType);

                        //console.log("range.comparePoint(item) " + sel.getRangeAt(i).comparePoint(item,1) );

                        //console.log("range.intersectsNode(item) " + sel.getRangeAt(i).intersectsNode(item));

                 //   }

                    // text
                    // Glovebox_start
                    // start selection
                    // end selection
                    // Glovebox_end
                    // text
                    // Glovebox_start
                    // Glovebox_end
                    // text

                    // identity the exact extent of the Glovebox text - expand the selection to encompass the whole -  which is then replaced with a message

                    var k = 0;
                    while ((match3 = glovebox_header_regex.exec(full_text)) != null && k < 100) {
                        console.log("Get_GloveboxSecureKeyTokenFromOffer: contains##: selection begin: " + selectStartOffset + " end" + selection_end_pos);

                        console.log("match found at " + match3.index);
                        console.log("match 0 found of length " + match3[0].length);
                        console.log("match 1 found of length " + match3[1].length);
                        console.log("match found of length " + match3[k].length);
                        var token_end_pos = match3.index + match3[k].length;
                        var token_start_pos = match3.index;

                        console.log("match found of length token_start_pos=" + token_start_pos + "  token_end_pos=" + token_end_pos);
                        console.log("match found of length selectStartOffset=" + selectStartOffset + "  selection_end_pos=" + selection_end_pos);

                        // either selection begins inside token, and/or ends inside token. or not.

                        // expand the selection to include both beginning and the of token.

                        if (token_start_pos <= selectStartOffset && selectStartOffset <= token_end_pos) {
                            console.log("selection beigns inside token");
                            // break out of while loop
                            k = k + 10000;
                            // move the selection to match the Glovebox token.

                            glovbox_token_text = full_text.substring(token_start_pos, token_end_pos);
                            console.log("returning: " + glovbox_token_text);

// carry our replacement by rewriting the text content of the node inside which the token text starts

// attempt to match the token from the end of the node in start_token_node

// get position in the node text where the token text begins


var output = [sel.getRangeAt(i).startContainer.textContent.slice(0, token_start_pos), replacementStr, sel.getRangeAt(i).startContainer.textContent.slice(token_end_pos) ].join('');
                            console.log("output: " + output);
 sel.getRangeAt(i).startContainer.textContent = output;


                        } else if (token_start_pos <= selection_end_pos && selection_end_pos <= token_end_pos) {
                            // or selection ends inside Glovebox token

                            console.log("selection ends inside token");
                            // break out of while loop
                            k = k + 10000;

                            glovbox_token_text = full_text.substring(token_start_pos, token_end_pos);
                            console.log("returning: " + glovbox_token_text);

                        } else if (selectStartOffset < token_start_pos && token_end_pos < selection_end_pos) {
                            // or selection fully encloses Glovebox token
                            console.log("selection encloses token");
                            // break out of while loop
                            k = k + 10000;

                            glovbox_token_text = full_text.substring(token_start_pos, token_end_pos);
                            console.log("returning: " + glovbox_token_text);

                        }



                        // carry out replacement
       //                 console.log("replacing " + fulltextofnode.substring(token_end_pos, token_start_pos) + " with " + newFragment.toString());

                        //console.log("range " + sel.getRangeAt(i).toString());

                        // expand range
     //                   console.log("range startcontainer " + sel.getRangeAt(i).startContainer);

   //                     console.log("range startcontainer textContent " + sel.getRangeAt(i).startContainer.textContent);

  //                      console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);

                     //   console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);
                    //    console.log("range .startContainer.childNodes.length " + sel.getRangeAt(i).startContainer.childNodes.length);

                  //      console.log("range...from " + token_start_pos);

                        // expand reange to include the whole of the token text

                        //  sel.getRangeAt(i).setStart(sel.getRangeAt(i).startContainer, token_start_pos);
                        //  sel.getRangeAt(i).setEnd(sel.getRangeAt(i).startContainer, token_end_pos);

                        // delete Glovebox cipher text
                        // var e = sel.getRangeAt(i).extractContents()

                        // insert the new content before
                        //            sel.getRangeAt(i).insertNode(newFragment);

                        k++;
                    }

                }
            }
        }

        console.log("returning " + glovbox_token_text);
        return Promise.resolve({
            response: {
                "token": glovbox_token_text
            }
        });
    }
}
browser.runtime.onMessage.addListener(Get_GloveboxSecureKeyTokenFromOffer);
