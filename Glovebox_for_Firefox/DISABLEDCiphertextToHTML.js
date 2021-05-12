
function ciphertextToHTML(request, sender, sendResponse) {

    var replacementStr = request.ciphertext_replacement_html;
    console.log("pageWriterCiphertextToHTML:rJSON(request): " + JSON.stringify(request));

    var replacement_html = "";
    replacement_html = request.ciphertext_replacement_html;

    console.log("pageWriterCiphertextToHTML:new html: " + request.ciphertext_replacement_html);

    if (replacement_html) {

        var newFragment = document.createRange().createContextualFragment(replacement_html);

        var modified_selection_text;

        console.log("p1.2");

        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                // var container = document.createElement("div");
                console.log("p2," + sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {

                    // the Glovebox ciphertext is a plaintext node without markup.
                    // Get the preceeding text content.

                    var selectStartOffset = sel.getRangeAt(i).startOffset;
                    console.log("pageWriterCiphertextToHTML:reWritePageGetHTMLselected: Range.startOffset:" + selectStartOffset);

                    var selectEndOffset = sel.getRangeAt(i).endOffset;
                    console.log("pageWriterCiphertextToHTML:reWritePageGetHTMLselected: Range.startOffset:" + selectEndOffset);

                    var selection_text = sel.getRangeAt(i).toString();
                    var rangesize = selection_text.length;
                    console.log("pageWriterCiphertextToHTML:reWritePageGetHTMLselected: Range.size:" + rangesize);

                    var selection_end_pos = selectStartOffset + rangesize;

                    // get the whole of the surrounding text

                    var fulltextofnode = sel.getRangeAt(i).startContainer.textContent;

                    console.log("pageWriterCiphertextToHTML:reWritePageGetHTMLselected: Range.startContainer:" + fulltextofnode);

                    // grab the piece of the fulltext of the node preceeding the selected text and see if it contains the opening statement
                    var preceeding = fulltextofnode.substring(0, selectStartOffset);

                    console.log("pageWriterCiphertextToHTML:reWritePageGetHTMLselected: preceeding:" + preceeding);

                    var following = fulltextofnode.substring(selectStartOffset + rangesize);

                    console.log("pageWriterCiphertextToHTML:reWritePageGetHTMLselected: following:" + following);

                    // check if selection contain the opening statement, and if not look in the preceeding

                    var glovebox_header_regex = /(:Glovebox:[^:]*:[^:]*:)/g;
                    // var glovebox_header_regex = /:Gl/g;


                    // ok, see if it is in the preceeding text with selection_text appended

                    // pick the glovobox text which intersects with the selection text.
                    // - if more than one, only the first one.


                    console.log("pageWriterCiphertextToHTML:reWritePageGetHTMLselected: has to contain the Glovebox header:" + preceeding + selection_text + following);
                    var t = preceeding + selection_text + following;

                    // text
                    // Glovebox_start
                    // start selection
                    // end selection
                    // Glovebox_end
                    // text
                    // Glovebox_start
                    // Glovebox_end
                    // text

                    // identity the exact extent of the Glovebox text - which is then replaces with the decrytped html

                    var k = 0;
                    while ((match3 = glovebox_header_regex.exec(t)) != null && k < 1000) {
                        console.log("pageWriterHTMLtoCiphertext:reWritePage: contains##: selection begin: " + selectStartOffset + " end" + selection_end_pos);

                        // console.log("match found at " + match3.index);
                        //  console.log("match 0 found of length " + match3[0].length);
                        //   console.log("match 1 found of length " + match3[1].length);
                        //    console.log("match found of length " + match3[k].length);
                        var token_end_pos = match3.index + match3[k].length;
                        var token_start_pos = match3.index;

                        console.log("match found of length token_start_pos=" + token_start_pos + "  token_end_pos=" + token_end_pos);

                        // either selection begins inside token


                        if (token_start_pos <= selectStartOffset && selectStartOffset <= token_end_pos) {
                            console.log("selection beigns inside token");
                            // break out of while loop
                            k = k + 10000;
                            // move the selection to match the Glovebox token.

                            modified_selection_text = t.substring(token_start_pos, token_end_pos);
                            console.log("returning: " + modified_selection_text);

                        } else if (token_start_pos <= selection_end_pos && selection_end_pos <= token_end_pos) {
                            // or selection ends inside Glovebox token

                            console.log("selection ends inside token");
                            // break out of while loop
                            k = k + 10000;

                            modified_selection_text = t.substring(token_start_pos, token_end_pos);
                            console.log("returning: " + modified_selection_text);

                        } else if (selectStartOffset < token_start_pos && token_end_pos < selection_end_pos) {
                            // or selection fully encloses Glovebox token
                            console.log("selection encloses token");
                            // break out of while loop
                            k = k + 10000;

                            modified_selection_text = t.substring(token_start_pos, token_end_pos);
                            console.log("returning: " + modified_selection_text);

                        }

                        // carry out replacement
                        console.log("replacing " + fulltextofnode.substring(token_end_pos, token_start_pos) + " with " + newFragment.toString());

                        console.log("range " + sel.getRangeAt(i).toString());
                        // expand range
                        console.log("range startcontainer " + sel.getRangeAt(i).startContainer);

                        console.log("range startcontainer textContent " + sel.getRangeAt(i).startContainer.textContent);

                        console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);

                        console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);
                        console.log("range .startContainer.childNodes.length " + sel.getRangeAt(i).startContainer.childNodes.length);

                        console.log("range...from " + token_start_pos);

                        sel.getRangeAt(i).setStart(sel.getRangeAt(i).startContainer, token_start_pos);
                        sel.getRangeAt(i).setEnd(sel.getRangeAt(i).startContainer, token_end_pos);

                        // delete Glovebox cipher text
                        var e = sel.getRangeAt(i).extractContents();

                            // insert the new content before
                            sel.getRangeAt(i).insertNode(newFragment);

                        k++;
                    }

                }
            }
        }

    } else {
        console.log("no replacement html provided.");

    }

}

browser.runtime.onMessage.addListener(ciphertextToHTML);

