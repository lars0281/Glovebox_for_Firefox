

//does the range contain the regexp
function range_contains(selected_range, start_token_rex) {

    // did the selection contain the starting marker (boolean) ?
    var selection_range_includes_starting_marker;
    var one;
    one = selected_range.toString().match(start_token_rex);
    //console.log(one);
    if (one) {
        selection_range_includes_starting_marker = true;
    } else {
        selection_range_includes_starting_marker = false;
    }
    //console.log(selection_range_includes_starting_marker);
    return selection_range_includes_starting_marker;
}

// fit the selection to the whole glovebox cipher text exactly.
function fit_Selection_glovebox_ciphertext(selected_range) {

	console.log("fit_Selection_glovebox_ciphertext (" + selected_range + ")");
    // expand/contract from the selected text to make sure that all of the ciphertext, and only the ciphertext, is included in the replacement operation.

    // delete the whole ciphertext section and replace it with the decrypted plaintext. Remove all markup from the decrypted text before instering it.
    // This is a security precaution and should be default behaviour. Leave the DOM structure otherwise unchanged.


    // Make sure the selection fits the cipher text exactly

    // reg ex to match the beginning of a glovebox cipher text
    var start_token_rex = /:Glovebox:[^:]*/gi;
    // this reg ex describes a complete glovebox cipher text (including the ending)
    var complete_token_rex = /:Glovebox:[^:]*:[^:]*:/gi;

    //var selected_range = sel.getRangeAt(i);

    // Check if selection contains the token start-maker ...
    console.log(range_contains(selected_range, start_token_rex));
    if (range_contains(selected_range, start_token_rex)) {
        // If it does)
        // contract selection range to begin at token start
        console.log("contract selection range to begin at token start");

    } else {
        // If it does not) expand selection range include the token start
        // loop forward through the DOM nodes until a match is found on the Glovebox token start marker
        console.log("expand selection range include the token start");

        // is the token start inside the rest of the start node
        // prepend the rest startnode text to the selection text to accomodate the situation where the selection text begins inside the pattern
        console.log("Range: " + selected_range.toString());
        var selectStartOffset = selected_range.startOffset;
        console.log("Range.startOffset:" + selectStartOffset);
        var fulltextofnode = selected_range.startContainer.textContent;
        console.log("Range.startContainer:" + selected_range.startContainer.textContent);
        console.log("Range.startContainer:" + selected_range.startContainer.textContent.substring(0, selected_range.startOffset));
        console.log("Range.startContainer:" + selected_range.startContainer.textContent.substring(0, selected_range.startOffset) + selected_range.toString());
        console.log(range_contains(selected_range.startContainer.textContent.substring(0, selected_range.startOffset) + selected_range.toString(), start_token_rex));

        if (range_contains(selected_range.startContainer.textContent.substring(0, selected_range.startOffset) + selected_range.toString(), start_token_rex)) {
            // yes

            var k = 0;
            var token_start_pos = 0;
            // there may be multiple matches on the regexp inside the node text.
            // Want the one that is closest to original starting position of the selection, but also smaller.
            while ((match3 = start_token_rex.exec(selected_range.startContainer.textContent.substring(0, selected_range.startOffset) + selected_range.toString())) != null && k < 1000) {
                console.log("contains##: selection begin: " + selectStartOffset);

                console.log("match found at " + match3.index);
                console.log("less than ? " + selected_range.startOffset);
                //  console.log("match 0 found of length " + match3[0].length);
                //   console.log("match 1 found of length " + match3[1].length);
                //    console.log("match found of length " + match3[k].length);
                if (match3.index < selected_range.startOffset) {
                    token_start_pos = match3.index;
                    console.log("setting " + match3.index);
                    k = 1000;
                }
            }
            // move the selection forward into the node inside which the selection originally began
            // set a the selection starting point
            console.log("Range: " + selected_range.toString());
            selected_range.setStart(selected_range.startContainer, token_start_pos);
            console.log("Range: " + selected_range.toString());

        } else {
            // no - so, look farther for-/top-wards in the DOM


            // get the previous sibling node
            console.log(selected_range.commonAncestorContainer.previousSibling);
            var previousnode = selected_range.commonAncestorContainer.previousSibling;
            console.log(previousnode);
            var n = 0;
            // maximum 8 iterations allowed (revise later)
            while (previousnode && n < 8) {
                console.log("n: " + n);

                if (previousnode.nodeType == 3) {
                    console.log("previousSibling (" + n + ")  nodeType: " + previousnode.nodeType);
                    console.log("previousSibling (" + n + ") textContent: " + previousnode.textContent);
                    console.log("previousSibling (" + n + ") length: " + previousnode.textContent.length);
                    // check if textnode has a match on the reg exp. pattern.
                    // in cases of multiple matches, we'll want the last one.
                    var res = previousnode.textContent.match(start_token_rex);
                    console.log(res);
                    try {
                        if (res.length > 0) {
                            var lastItem1 = res[res.length - 1];
                            console.log(lastItem1);
                            console.log("a match");
                            // add the part of the text content of this text node that is after the match (and include the matched section itself)
                            console.log("cut from position: ");

                            // break out of the loop
                            n = 1000;
                        } else {
                            console.log("no match");
                            // no match on the pattern, yet still text so assumt it is all part of the cipher text so add it to the beginning (remeber: going backwards in the DOM) returned text.
                            //res_text = previousnode.textContent + res_text;
                        }

                    } catch (e) {
                        console.log(e);
                    }

                } else {
                    console.log("not a text node");
                    // but maybe it contains text inside deeper markup.
                    console.log("previousSibling (" + n + ") textContent: " + previousnode.textContent);

                }
                //console.log("res_text: " + res_text);
                //previous_text = previousnode.textContent + previous_text;
                previousnode = previousnode.previousSibling;
                n = n + 1;
            }
        }

    }

    // check if selection contains the token end-marker

    // If selection range does not include the token end-marker...
    // since the start of the token is now included, we can use a reg ex that matches a complete token.
    console.log("Range: " + selected_range.toString());
    console.log(range_contains(selected_range.toString(), complete_token_rex))

    if (range_contains(selected_range.toString(), complete_token_rex)) {
        // does) contract selection to end at exactly at token end


    } else {
        // does not) ok, so now expand selection include the token end
        console.log("expand selection range include the token end");
        // is the token start inside the rest of the start node
        // append the rest endnode text to the selection text to accomodate the situation where the selection text ends inside the glovebox token pattern itself
        var selectEndOffset = selected_range.endOffset;
        console.log("Range.selectEndOffset:" + selectEndOffset);
        var fulltextofnode = selected_range.endContainer.textContent;
        console.log("Range.endContainer:" + selected_range.endContainer.textContent);
        console.log("Range.endContainer:" + selected_range.endContainer.textContent.substring(selected_range.endOffset));
        console.log("Range.endContainer:" + selected_range.toString() + selected_range.endContainer.textContent.substring(selected_range.endOffset));
        console.log(range_contains(selected_range.toString() + selected_range.endContainer.textContent.substring(selected_range.endOffset), complete_token_rex));

        console.log("Selection range: " + selected_range.toString());
        console.log("Selection range.length: " + selected_range.toString().length);

        if (range_contains(selected_range.toString() + selected_range.endContainer.textContent.substring(selected_range.endOffset), complete_token_rex)) {
            // yes
            console.log("range endnode includes the rest of the glovebox token");

            var k = 0;
            var token_end_pos = 0;
            // there may be multiple matches on the regexp inside the node text.
            // Want the one that is closest to original ending position of the selection, but also larger.
            console.log(selected_range.toString() + selected_range.endContainer.textContent.substring(selected_range.endOffset));
            while ((match3 = complete_token_rex.exec(selected_range.toString() + selected_range.endContainer.textContent.substring(selected_range.endOffset))) != null && k < 100) {

                //console.log("contains##: selection begin: " + selectStartOffset);
                // looking for a match that reaches outside the selection range
                // The pattern is constructed to start at the beginning of the range (set above) and not
                // only the first match is used
                console.log("match found at position " + match3[0].index);
                console.log("match found of length " + match3[0].length);
                //                console.log("less than ? " + selected_range.endOffset);
                //  console.log("match 0 found of length " + match3[0].length);
                //   console.log("match 1 found of length " + match3[1].length);
                //    console.log("match found of length " + match3[k].length);
                var token_length = match3[0].length;
                console.log("token_length: " + token_length);

                var combined_length_of_selection_range_and_unused_part_of_endnode = (selected_range.toString() + selected_range.endContainer.textContent.substring(selected_range.endOffset)).length;
                var length_of_selection_range = selected_range.toString().length;
                console.log("combined_length_of_selection_range_and_unused_part_of_endnode: " + combined_length_of_selection_range_and_unused_part_of_endnode);
                console.log("length_of_selection_range: " + length_of_selection_range);
                var selection_range_endpoint_inside_endnode = selected_range.endOffset;
                console.log("selection_range_endpoint_inside_endnode: " + selection_range_endpoint_inside_endnode);
                var selection_endnode_length = selected_range.endContainer.textContent.length;
                console.log("selection_endnode_length: " + selection_endnode_length);
                var unselected_part_of_endnode = selected_range.endContainer.textContent.length - selected_range.endOffset;
                console.log("unselected_part_of_endnode: " + unselected_part_of_endnode);
                try {
                    var length_of_selection_range_before_endnode = length_of_selection_range - selection_range_endpoint_inside_endnode;
                    console.log("length_of_selection_range_before_endnode: " + length_of_selection_range_before_endnode);
                    var length_of_extension_to_selection_range = token_length - length_of_selection_range;
                    console.log("length_of_extension_to_selection_range: " + length_of_extension_to_selection_range);

                } catch (e) {
                    console.log(e)
                }

                // check if match is longer than range, if so range must be expanded
                if (length_of_extension_to_selection_range > 0) {

                    console.log(selected_range.toString());
                    // expand the range
                    selected_range.setEnd(selected_range.endContainer, selected_range.endOffset + length_of_extension_to_selection_range);

                    console.log(selected_range.toString());
                    // break out of loop
                    k = 1000;
                }
            }

        } else {
            // no - so, look farther on-/down-wards in the DOM
            console.log("range endnode does not include the rest of the glovebox token");

            // get the next sibling node
            console.log(selected_range.commonAncestorContainer.nextSibling);
            var nextnode = selected_range.commonAncestorContainer.nextSibling;
            console.log(nextnode);
            var n = 0;
            // maximum 8 iterations allowed (revise later)
            while (nextnode && n < 8) {
                console.log("n: " + n);

                if (nextnode.nodeType == 3) {
                    console.log("nextSibling (" + n + ") nodeType: " + nextnode.nodeType);
                    console.log("nextSibling (" + n + ") textContent: " + nextnode.textContent);
                    console.log("nextSibling (" + n + ") length: " + nextnode.textContent.length);
                    // check if textnode has a match on the reg exp. pattern.
                    // in cases of multiple matches, we'll want the last one.
                    var res = nextnode.textContent.match(complete_token_rex);
                    console.log(res);
                    try {
                        if (res.length > 0) {
                            var lastItem1 = res[res.length - 1];
                            console.log(lastItem1);
                            console.log("a match");
                            // add the part of the text content of this text node that is after the match (and include the matched section itself)
                            console.log("cut from position: ");

                            // break out of the loop
                            n = 1000;
                        } else {
                            console.log("no match");
                            // no match on the pattern, yet still text so assumt it is all part of the cipher text so add it to the beginning (remeber: going backwards in the DOM) returned text.
                            //res_text = previousnode.textContent + res_text;
                        }

                    } catch (e) {
                        console.log(e);
                    }

                } else {
                    console.log("not a text node");
                    // but maybe it contains text inside deeper markup.
                    console.log("nextSibling (" + n + ") textContent: " + nextnode.textContent);

                }
                //console.log("res_text: " + res_text);
                //previous_text = previousnode.textContent + previous_text;
                nextnode = nextnode.nextSibling;
                n = n + 1;
            }
        }
    }
    // at this point the selection range exactly covers the glovebox token text


}



function getGloveboxCiphertext(request, sender, sendResponse) {

	
	
	
	
    console.log("GetGloveboxCiphertext.js:GetCiphertextSurroundingSelection JSON(request): " + JSON.stringify(request));

    //console.log("pageWriterGetHTML:reWritePageGetHTMLselected: request.replacement: " + replacementStr);
    // console.log("pageWriterGetHTML:reWritePageGetHTMLselected: request.regex: " + word);
    // console.log("pageWriterGetHTML:reWritePageGetHTMLselected: sender: " + sender);
    // console.log("pageWriterGetHTML:reWritePageGetHTMLselected: sendResponse: " + sendResponse);

    // cipher text is retained inside the DOM but hidden inside a <small hidden="true">:Glovebox:3ccbc288mxxxxx</small> structure and wit ha event listener attached
    // The event listener is there to effect some actions:
    // - If the page rolls over and the decrypted plaintext is thereby made invisible, the plaintext is removed and cipher text is returned to it's former position. 

    var GetGloveboxCiphertext = "";

    //GetGloveboxCiphertext = request.GetGloveboxCiphertext;

    var modified_selection_text = "";

    // only execute this code if it has been propperly called. The value of Get_GloveboxCiphertext is not being used for anything other than to screen out calls to this code.
    if (request.Get_GloveboxCiphertext == "Glbx_marker7") {

        console.log("p1");
        var selection_html = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                // var container = document.createElement("div");
                console.log("p2," + sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {


                    //var glovebox_header_regex = /(:Glovebox:[^:]*:[^:]*:)/g;
                    const glovebox_header_regex = new RegExp('(:Glovebox:[^:]*:[^:]*:)', 'm');

                    // var glovebox_header_regex = /:Gl/g;
                    //console.log(expand_selection_to_encompass_the_whole_gloveboxtoken(new RegExp('(:Glovebox:[^:]*:[^:]*:)', 'm'), sel));

                	// fit the selection to the complete cipher text
                    
                    var selected_range = sel.getRangeAt(i);
                    
                    // var glovebox_header_regex = /:Gl/g;
                    //console.log(expand_selection_to_encompass_the_whole_gloveboxtoken(new RegExp('(:Glovebox:[^:]*:[^:]*:)', 'm'), sel));


                    // The Glovebox ciphertext is a plaintext node without markup.
                    // Expand the selection so as to make sure the whole glovebox ciher text token has been selected.
                    fit_Selection_glovebox_ciphertext(selected_range);
                    
                    // at this point the selection encompases the encrypted content , and metadata, exactly.
                    
                    modified_selection_text = selected_range.toString();
                    
                    console.log("modified_selection_text (fitted): " + modified_selection_text);
                 
                    return Promise.resolve({
                        response: {
                            "doc": modified_selection_text
                        }
                    });
                    
                    
                    // the selection html (DocumentFragmet) may begin and end inside plain text nodes.
                    // The Glovebox cipher text may be broken across multiple text nodes in succession.
                    // check if preceeding node is a text node

                    var previous_text = "";

                    console.log("p3,commonAncestorContainer " + sel.getRangeAt(i).commonAncestorContainer);
                    console.log("p3,commonAncestorContainer nodetype " + sel.getRangeAt(i).commonAncestorContainer.nodeType);

                    console.log("p3,commonAncestorContainer textContent " + sel.getRangeAt(i).commonAncestorContainer.textContent);

                    var n = 0;

                    // loop backwards to determine how far the text-only nodes go.

                    var previousnode = sel.getRangeAt(i).commonAncestorContainer.previousSibling;
                    console.log("p4");
                    //while ( previousnode.nodeType == 3 && n<3 ){
                    while (previousnode && previousnode.nodeType == 3 && n < 8) {

                        console.log("p3,commonAncestorContainer previousSibling (" + n + ")  nodeType: " + previousnode.nodeType);
                        console.log("p3,commonAncestorContainer previousSibling (" + n + ") textContent: " + previousnode.textContent);
                        console.log("p3,commonAncestorContainer previousSibling (" + n + ") length: " + previousnode.textContent.length);
                        previous_text = previousnode.textContent + previous_text;
                        previousnode = previousnode.previousSibling;
                        n = n + 1;
                    }

                    console.log("p5");

                    // loop forwards to determine how far the text-only nodes go.
                    var following_text = "";

                    var nextnode = sel.getRangeAt(i).commonAncestorContainer.nextSibling;
                    n = 0;
                    while (nextnode && nextnode.nodeType == 3 && n < 8) {

                        console.log("p3,commonAncestorContainer nextSibling (" + n + ")  nodeType: " + nextnode.nodeType);
                        console.log("p3,commonAncestorContainer nextSibling (" + n + ") textContent: " + nextnode.textContent);
                        console.log("p3,commonAncestorContainer nextSibling (" + n + ") length: " + nextnode.textContent.length);
                        following_text = nextnode.textContent + following_text;
                        nextnode = nextnode.nextSibling;
                        n = n + 1;
                    }

                    // the Glovebox ciphertext is a plaintext node without markup.
                    // Get the preceeding text content.
                    console.log("reWritePageGetHTMLselected: Range.startOffset(computed):" + previous_text.length);

                    var selectStartOffset = sel.getRangeAt(i).startOffset;
                    console.log("reWritePageGetHTMLselected: Range.startOffset:" + selectStartOffset);

                    console.log("reWritePageGetHTMLselected: Range.endOffset(computed):" + following_text.length);

                    var selectEndOffset = sel.getRangeAt(i).endOffset;
                    console.log("reWritePageGetHTMLselected: Range.endOffset:" + selectEndOffset);

                    //var selection_text = sel.getRangeAt(i).toString();
                    var selection_text = sel.getRangeAt(i).commonAncestorContainer.toString();

                    var b = sel.getRangeAt(i).commonAncestorContainer.textContent;
                    var a = sel.getRangeAt(i).toString();

                    console.log("reWritePageGetHTMLselected: Range:" + a);
                    console.log("reWritePageGetHTMLselected: Range:" + b);

                    if (b.indexOf(a) != -1) {
                        selection_text = b;
                    } else {
                        selection_text = a;

                    }

                    var rangesize = selection_text.length;
                    console.log("reWritePageGetHTMLselected: selection_text:" + selection_text);
                    console.log("reWritePageGetHTMLselected: selection_text.size:" + rangesize);

                    var selection_end_pos = selectStartOffset + rangesize;

                    // get the whole of the surrounding Glovebox cipher text

                    //      var fulltextofnode = sel.getRangeAt(i).startContainer.textContent;

                    //    console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: Range.startContainer:" + fulltextofnode);

                    // grab the piece of the fulltext of the node preceeding the selected text and see if it contains the opening statement
                    //      var preceeding = fulltextofnode.substring(0, selectStartOffset);

                    //       console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: preceeding:" + preceeding);
                    //        console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: preceeding (computed):" + previous_text);

                    //        var following = fulltextofnode.substring(selectStartOffset + rangesize);

                    //         console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: following:" + following);
                    //          console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: following(computed):" + following_text);

                    // check if selection contain the opening statement, and if not look in the preceeding

                    // ok, see if it is in the preceeding text with selection_text appended

                    // pick the glovebox text which intersects with the selection text.
                    // - if more than one, only the first one.

                    var t = previous_text + sel.getRangeAt(i).commonAncestorContainer.textContent + following_text;

                    console.log("reWritePageGetHTMLselected: has to contain the Glovebox header:" + t);

                    // text
                    // Glovebox_start
                    // start selection
                    // end selection
                    // Glovebox_end
                    // text
                    // Glovebox_start
                    // Glovebox_end
                    // text


                    var k = 0;
                    // step through the full body of the text node and look for occurences of Glovebox tokens
                    while ((match3 = glovebox_header_regex.exec(t)) != null && k < 1000) {
                        console.log(" contains##: selection begin: " + selectStartOffset + " end" + selection_end_pos);
                        //ctor Chris :Glovebox:47b83c2c-5d3b-3823-2fc2-d8256aeb7f73:R/+62UyjNV1OcmBrYH7i19KTFP65kiRsVHEcmrE3+ClTTC9W5IlVjTN5u8Bqu4xfXVkBMPSa:
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

                        k++;
                    }

                }
                //            selection_html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            console.log("returning: error");
		}

    }
    // remove this event listener
  	try {
		console.log("remove listener");
	    browser.runtime.onMessage.removeListener(getGloveboxCiphertext);
	} catch (e) {
		console.log(e);
	}

    //browser.runtime.onMessage.addListener();

    console.log("return promise doc: " + modified_selection_text);

    return Promise.resolve({
        response: {
            "doc": modified_selection_text
        }
    });
    //return Promise.resolve({response: doc });


}

// The use may click anywhere inside the encrypted text.
// Expand the selection at either end to ensure the entire token text containing the encrypted text is selected.
// input
// regexp    Use a regexp to identify the whole token inside a larger plaintext.
// selection  The starting point from which to expand the selection. Output of window.getSelection()
// 

// return the text in the expanded selection

function expand_selection_to_encompass_the_whole_gloveboxtoken(reg, sel){
	
	console.log("expand_selection_to_encompass_the_whole_gloveboxtoken");
	
	console.log("regexp: " + reg);
	console.log("selection: " + sel);
	
    // the selection html (DocumentFragmet) may begin and end inside plain text nodes.
    // The Glovebox cipher text may be broken across multiple text nodes in succession.
    // check if preceeding node is a text node

    var previous_text = "";

    console.log("commonAncestorContainer " + sel.getRangeAt(i).commonAncestorContainer);
    console.log("commonAncestorContainer nodetype " + sel.getRangeAt(i).commonAncestorContainer.nodeType);

    console.log("commonAncestorContainer textContent " + sel.getRangeAt(i).commonAncestorContainer.textContent);

    var n = 0;

	
	
}

browser.runtime.onMessage.addListener(getGloveboxCiphertext);
