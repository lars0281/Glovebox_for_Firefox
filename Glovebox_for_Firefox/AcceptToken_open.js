
// test update from branch readme-edit-from-branch

console.log("pageWriterAcceptToken_open:");
try {
    browser.runtime.onMessage.removeListener();
} catch (e) {}

  console.log("pageWriterAcceptToken_open:");

browser.runtime.onMessage.addListener(request => {

var replacementStr = request.replacement;
    console.log("pageWriterAcceptToken_open:rJSON(request): " + JSON.stringify(request));

    console.log("pageWriterAcceptToken_open:new html: " + request.replacement);

    var newFragment = document.createRange().createContextualFragment(request.replacement);

    var modified_selection_text;
    var glovbox_token_text = "token_text";

    console.log("p1.2");

    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            // var container = document.createElement("div");
            console.log("p2," + sel.rangeCount);
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {

                // the GloveboxToken is a plaintext node without markup.
                // Get the preceeding text content.


                var previous_text = "";

                console.log("p3,commonAncestorContainer " + sel.getRangeAt(i).commonAncestorContainer);
                console.log("p3,commonAncestorContainer nodetype " + sel.getRangeAt(i).commonAncestorContainer.nodeType);

                console.log("p3,commonAncestorContainer textContent 1 " + sel.getRangeAt(i).toString());
                console.log("p3,commonAncestorContainer textContent 2 " + sel.getRangeAt(i).commonAncestorContainer.textContent);

                // check if node space is fragmented into multiple text nodes.

                var full_text = "";

                var n = 0;

                // loop backwards to determiine how far the text-only nodes
				// goes.

                // console.log("p4,," +
				// sel.getRangeAt(i).commonAncestorContainer);
                // console.log("p4,," +
				// sel.getRangeAt(i).commonAncestorContainer.nodeType);
                // console.log("p4,-," +
				// sel.getRangeAt(i).commonAncestorContainer.textContent);
                // console.log("p4,," +
				// sel.getRangeAt(i).commonAncestorContainer.previousSibling);

if (sel.getRangeAt(i).commonAncestorContainer){
                if (sel.getRangeAt(i).commonAncestorContainer.nodeType != 1) {

                    var previousnode = sel.getRangeAt(i).commonAncestorContainer.previousSibling;
					if (previousnode){
                    console.log("p4," + previousnode.nodeType);
                    // while ( previousnode.nodeType == 3 && n<3 ){
                    while (previousnode && previousnode.nodeType == 3 && n < 8) {

                        console.log("p3,commonAncestorContainer previousSibling (" + n + ")  nodeType: " + previousnode.nodeType);
                        console.log("p3,commonAncestorContainer previousSibling (" + n + ") textContent: " + previousnode.textContent);
                        console.log("p3,commonAncestorContainer previousSibling (" + n + ") length: " + previousnode.textContent.length);
                        previous_text = previousnode.textContent + previous_text;
                        previousnode = previousnode.previousSibling;
                        n = n + 1;
                    }
					}
                    var following_text = "";

                    var nextnode = sel.getRangeAt(i).commonAncestorContainer.nextSibling;
if (nextnode){
console.log("p5," + nextnode.nodeType);
                    n = 0;
                    while (nextnode && nextnode.nodeType == 3 && n < 8) {

                        console.log("p3,commonAncestorContainer nextSibling (" + n + ")  nodeType: " + nextnode.nodeType);
                        console.log("p3,commonAncestorContainer nextSibling (" + n + ") textContent: " + nextnode.textContent);
                        console.log("p3,commonAncestorContainer nextSibling (" + n + ") length: " + nextnode.textContent.length);
                        following_text = nextnode.textContent + following_text;
                        nextnode = nextnode.nextSibling;
                        n = n + 1;
                    }
}

                } else {}}

                var selectStartOffset = sel.getRangeAt(i).startOffset;
                console.log("pageWriterAcceptToken_open:reWritePageGetHTMLselected: Range.startOffset:" + selectStartOffset);

                var selectEndOffset = sel.getRangeAt(i).endOffset;
                console.log("pageWriterAcceptToken_open:reWritePageGetHTMLselected: Range.startOffset:" + selectEndOffset);

                var selection_text = sel.getRangeAt(i).toString();
                var rangesize = selection_text.length;
                console.log("pageWriterAcceptToken_open:reWritePageGetHTMLselected: Range.size:" + rangesize);

                var selection_end_pos = selectStartOffset + rangesize;

                // get the whole of the surrounding text

                var fulltextofnode = sel.getRangeAt(i).startContainer.textContent;

                console.log("pageWriterAcceptToken_open:reWritePageGetHTMLselected: Range.startContainer:" + fulltextofnode);

                // grab the piece of the fulltext of the node preceeding the
				// selected text and see if it contains the opening statement
                var preceeding = fulltextofnode.substring(0, selectStartOffset);

                console.log("pageWriterAcceptToken_open:reWritePageGetHTMLselected: preceeding:" + preceeding);

                var following = fulltextofnode.substring(selectStartOffset + rangesize);

                console.log("pageWriterAcceptToken_open:reWritePageGetHTMLselected: following:" + following);

                // check if selection contain the opening statement, and if not
				// look in the preceeding

                // var glovebox_header_regex =
				// /(:GloveboxToken:[^:]*:[^:]*:[^:]*:)/g;
                 // var glovebox_header_regex = /:GloveboxToken/g;

const glovebox_header_regex = new RegExp('(:GloveboxToken:[^:]*:[^:]*:[^:]*:)', 'm');


                // ok, see if it is in the preceeding text with selection_text
				// appended

                // pick the glovobox text which intersects with the selection
				// text.
                // - if more than one, only the first one.


                if (sel.getRangeAt(i).commonAncestorContainer.nodeType == 1) {
                    full_text = sel.getRangeAt(i).commonAncestorContainer.textContent;
                } else {
                    full_text = previous_text + sel.getRangeAt(i).commonAncestorContainer.textContent + following_text;
                }

                console.log("pageWriterAcceptToken_open:##reWritePageGetHTMLselected: has to contain the Glovebox header:" + full_text);

                // text
                // Glovebox_start
                // start selection
                // end selection
                // Glovebox_end
                // text
                // Glovebox_start
                // Glovebox_end
                // text

                // identity the exact extent of the Glovebox text - which is
				// then replaces with the decrytped html

                var k = 0;
                while ((match3 = glovebox_header_regex.exec(full_text)) != null && k < 1000) {
                    console.log("pageWriterAcceptToken_open:reWritePage: contains##: selection begin: " + selectStartOffset + " end" + selection_end_pos);

                     console.log("match found at " + match3.index);
                      console.log("match 0 found of length " + match3[0].length);
                       console.log("match 1 found of length " + match3[1].length);
                        console.log("match found of length " + match3[k].length);
                    var token_end_pos = match3.index + match3[k].length;
                    var token_start_pos = match3.index;

                    console.log("match found of length token_start_pos=" + token_start_pos + "  token_end_pos=" + token_end_pos);
                    console.log("match found of length selectStartOffset=" + selectStartOffset + "  selection_end_pos=" + selection_end_pos);

                    // either selection begins inside token


                    if (token_start_pos <= selectStartOffset && selectStartOffset <= token_end_pos) {
                        console.log("selection beigns inside token");
                        // break out of while loop
                        k = k + 10000;
                        // move the selection to match the Glovebox token.

                        glovbox_token_text = full_text.substring(token_start_pos, token_end_pos);
                        console.log("returning: " + glovbox_token_text);

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
                    console.log("replacing " + fulltextofnode.substring(token_end_pos, token_start_pos) + " with " + newFragment.toString());

                    // console.log("range " + sel.getRangeAt(i).toString());
                    
					// expand range
                    console.log("range startcontainer " + sel.getRangeAt(i).startContainer);

                    console.log("range startcontainer textContent " + sel.getRangeAt(i).startContainer.textContent);

                    console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);

                    console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);
                    console.log("range .startContainer.childNodes.length " + sel.getRangeAt(i).startContainer.childNodes.length);

                    console.log("range...from " + token_start_pos);

                  // sel.getRangeAt(i).setStart(sel.getRangeAt(i).startContainer,
					// token_start_pos);
                  // sel.getRangeAt(i).setEnd(sel.getRangeAt(i).startContainer,
					// token_end_pos);

                    // delete Glovebox cipher text
                    var e = sel.getRangeAt(i).extractContents()

                        // insert the new content before
            // sel.getRangeAt(i).insertNode(newFragment);

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

});
