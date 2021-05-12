// search backwards in the DOM "twig" to locate the start of the cipher text

// Parameters:
// selection object 											sel
// itterator													i
// selection Range      										selected_range
// regualr expression to match the start of the required text 	start_token_rex

// Return the ciphertext from where it starts and forward to where the selection (text highlight) begins.


function get_preceeding_text(sel, i, selected_range, start_token_rex) {

    try {

        console.log("sel: ");
        console.log(sel);
        console.log("i: " + i);
        console.log("selected_range: ");
        console.log(selected_range);
        console.log(selected_range.toString());
        console.log(selected_range.startContainer);
        console.log(selected_range.startContainer.textContent);
        console.log(selected_range.startOffset);

        console.log("start_token_rex: " + start_token_rex);
    } catch (e) {
        console.log(e)
    }

    // did the selection contain the starting marker (boolean) ?

    console.log(range_contains(selected_range, start_token_rex));
    // if so, exit with a blank.


    // if not, get the text of the node in which the selection range begins
    console.log("text of the starting node:");
    console.log(selected_range.startContainer.textContent);
    console.log("starting position in the starting node: " + selected_range.startOffset);

    // append the rest (the beginning) of the start node to the text of the selection range
    var st;
    var appended_string;
    appended_string = selected_range.startContainer.textContent.substring(1, selected_range.startOffset);
    st = appended_string + selected_range.toString()
        console.log(st);

    // look for marker again
    console.log(range_contains(st, start_token_rex));

    // if found, return the piece staring with the marker up until the start of the selection range
    if (range_contains(st, start_token_rex)) {
        console.log("exit");
        var ret;
        var one;
        one = selected_range.toString().match(start_token_rex);

        //	ret = appended_string.substring();
        var res = st.match(start_token_rex);
        console.log(res);
        try {

            var lastItem1 = res[res.length - 1];
            console.log(lastItem1);
            ret = lastItem1;
        } catch (e) {
            console.log(e);
        }

        console.log(ret);
        return ret;
    } else {
        console.log("continue");

    }

    // get all text content from the parent of the selected range
    var all_content_text = selected_range.commonAncestorContainer.textContent;

    // selected text start at this point in the text node where it starts
    var starting_point;
    try {
        starting_point = selected_range.startOffset
            console.log("starting_point: " + starting_point);
    } catch (e) {
        console.log(e);
    }
    var endpont_point;
    try {
        endpont_point = starting_point + selected_range.toString().length();
        console.log("endpont_point: " + endpont_point);
    } catch (e) {
        console.log(e);
    }

    // looking to return the text that start at the first glovebox token start marker that comes before selection.
    // if the selection contains a start marker, return null

    // get the match that is closest to, but lower than, start_point.
    var n = 0;

    var res;
    try {
        res = selected_range.commonAncestorContainer.textContent.match(start_token_rex);
    } catch (e) {
        console.log(e);
    }
    console.log(res);
    try {

        for (var i = 0; i < res.length; i++) {
            console.log(i);
            console.log(res[i]);
            // more statements
        }

    } catch (e) {
        console.log(e);
    }

    // go backwards far enough to get a match on start_token_rex
    // Use only the first match found when looking backwards, which means the last match found when looking forwards - which what a regexp matching does.
    var previous_text = "";

    console.log("commonAncestorContainer " + sel.getRangeAt(i).commonAncestorContainer);
    console.log("commonAncestorContainer nodetype " + sel.getRangeAt(i).commonAncestorContainer.nodeType);
    console.log("commonAncestorContainer nodetype " + selected_range.commonAncestorContainer.nodeType);

    console.log("commonAncestorContainer textContent " + sel.getRangeAt(i).commonAncestorContainer.textContent);
    console.log("commonAncestorContainer textContent " + selected_range.commonAncestorContainer.textContent);

    //       console.log("commonAncestorContainer match("+ ") " + start_token_rex.exec( selected_range.commonAncestorContainer.textContent));
    //     console.log("commonAncestorContainer match("+ ") " + start_token_rex.exec( sel.getRangeAt(i).commonAncestorContainer.textContent));

    // var res = sel.getRangeAt(i).commonAncestorContainer.textContent.match(start_token_rex);
    var res = selected_range.commonAncestorContainer.textContent.match(start_token_rex);
    console.log(res);
    try {

        var lastItem1 = res[res.length - 1];
        console.log(lastItem1);

    } catch (e) {
        console.log(e);
    }

    // assemble the text that will be returned in this variable
    var res_text;

    // loop backwards
    // get a list of all sibling textnodes
    // step through in reverse order


    // get the previous sibling node
    console.log(selected_range.commonAncestorContainer.previousSibling);
    console.log(sel.getRangeAt(i).commonAncestorContainer.previousSibling);
    var previousnode = selected_range.commonAncestorContainer.previousSibling;
    console.log(previousnode);
    //while ( previousnode.nodeType == 3 && n<3 ){
    // do, while there are any previous nodes left, and only for text nodes, and for a maximum of 8 times (to preventing out-of-control errors)
    // use the "n" to escape the loop when a match is found

    // just run through to show the text nodes in the log
    while (previousnode && n < 8) {
        console.log("test previousSibling (" + n + ")  nodeType: " + previousnode.nodeType);
        console.log("test previousSibling (" + n + ") textContent: " + previousnode.textContent);
        console.log("test previousSibling (" + n + ") length: " + previousnode.textContent.length);

        previous_text = previousnode.textContent + previous_text;
        previousnode = previousnode.previousSibling;
        n = n + 1;
    }

    n = 0;
    previousnode = selected_range.commonAncestorContainer.previousSibling;
    while (previousnode && n < 8) {
        if (previousnode.nodeType == 3) {
            console.log("commonAncestorContainer previousSibling (" + n + ")  nodeType: " + previousnode.nodeType);
            console.log("commonAncestorContainer previousSibling (" + n + ") textContent: " + previousnode.textContent);
            console.log("commonAncestorContainer previousSibling (" + n + ") length: " + previousnode.textContent.length);
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
                    res_text = previousnode.textContent + res_text;
                }

            } catch (e) {
                console.log(e);
            }

        } else {
            console.log("not a text node");
        }
        console.log("res_text: " + res_text);
        previous_text = previousnode.textContent + previous_text;
        previousnode = previousnode.previousSibling;
        n = n + 1;
    }

}

// does the reange contain the regexp
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

// create this structure
// <glovebox><ciphertext hidden="true">cipher text</ciphertext>plain text</glovebox>
// Leaving the cipher text in place but not visible allows for quick "reencryption".
// Use case: screen "rollover" removes plain text.

function ciphertextToText(request, sender, sendResponse) {

    console.log("CiphertextToText:JSON(request): " + JSON.stringify(request));

    var replacement_text = "";
    replacement_text = request.ciphertext_replacement_text_perm;

    console.log("CiphertextToText:new text: " + replacement_text);

    if (replacement_text) {

        var newFragment = document.createRange().createContextualFragment(replacement_text);

        // only text is to be used, so extract the text from this html

        console.log("CiphertextToText:new text(html): " + replacement_text);
        var replacementStr = "";
        replacementStr = newFragment.textContent;
        console.log("CiphertextToText:new text(textonly): " + replacementStr);

        var modified_selection_text = "";

        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            try {
                console.log(sel);
                console.log(sel.toString());
                console.log(sel.startContainer);
                console.log(sel.startContainer.textContent);
                console.log(sel.startOffset);
            } catch (e) {
                console.log(e)
            }

            if (sel.rangeCount) {
                // var container = document.createElement("div");
                console.log("p2," + sel.rangeCount);
                console.log(sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {

                    // expand/contract from the selected text to make sure that all of the ciphertext, and only the ciphertext, is included in the replacement operation.

                    // delete the whole ciphertext section and replace it with the decrypted plaintext. Remove all markup from the decrypted text before instering it.
                    // This is a security precaution and should be default behaviour. Leave the DOM structure otherwise unchanged.


                    // Make sure the selection fits the cipher text exactly

                	// reg ex to match the beginning of a glovebox cipher text
                    var start_token_rex = /:Glovebox:[^:]*/gi;
                    // this reg ex describes a complete glovebox cipher text (including the ending)
                    var complete_token_rex = /:Glovebox:[^:]*:[^:]*:/gi;

                    var selected_range = sel.getRangeAt(i);

                    // Check if selection contains the token start-maker ...
                    console.log(range_contains(sel.getRangeAt(i), start_token_rex));
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
                        console.log("Range.endContainer:"  + selected_range.toString() + selected_range.endContainer.textContent.substring(selected_range.endOffset));
                        console.log(range_contains( selected_range.toString() + selected_range.endContainer.textContent.substring(selected_range.endOffset) , complete_token_rex));

                        console.log("Selection range: "+ selected_range.toString());
                        console.log("Selection range.length: "+ selected_range.toString().length);

                        if (range_contains( selected_range.toString() + selected_range.endContainer.textContent.substring(selected_range.endOffset) , complete_token_rex)) {
                            // yes
                        	console.log("range endnode includes the rest of the glovebox token");
                        	
                            var k = 0;
                            var token_end_pos = 0;
                            // there may be multiple matches on the regexp inside the node text.
                            // Want the one that is closest to original ending position of the selection, but also larger.
                            console.log(selected_range.toString() + selected_range.endContainer.textContent.substring(selected_range.endOffset) );
                            while ((match3 = complete_token_rex.exec(selected_range.toString() + selected_range.endContainer.textContent.substring(selected_range.endOffset))) != null && k < 100) {

                            	
                            	
                            	//console.log("contains##: selection begin: " + selectStartOffset);
                            	// looking for a match that reaches outside the selection range 
                            	// The pattern is constructed to start at the beginning of the range (set above) and not 
                            	// only the first match is used
                                console.log("match found at position " + match3[0].index);
                                console.log("match found of length " + match3[0].length);
//                                console.log("less than ? " + selected_range.endOffset);
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
                                try{
                                var length_of_selection_range_before_endnode = length_of_selection_range - selection_range_endpoint_inside_endnode;
                                console.log("length_of_selection_range_before_endnode: " + length_of_selection_range_before_endnode);
                                var length_of_extension_to_selection_range = token_length - length_of_selection_range;
                                console.log("length_of_extension_to_selection_range: " + length_of_extension_to_selection_range);                                
                                
                                }catch(e){console.log(e)}

                            	
                                // check if match is longer than range, if so range must be expanded 
                                if (length_of_extension_to_selection_range > 0) {
                                	
                                    console.log(selected_range.toString() );
                                    // expand the range
                                    selected_range.setEnd(selected_range.endContainer, selected_range.endOffset + length_of_extension_to_selection_range);
                                    
                                    console.log(selected_range.toString() );
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
                    // Insert the decrypted text
                    // Does the token begin deep (startpos > 0) inside another text node ?
                    console.log(selected_range.startOffset);
                    if (selected_range.startOffset > 0){
                    	try{
                        // 2) If the start of token text is contained inside a larger text node, then insert the decrypted text in that node, at the spot where the selection range begins.
                    	// remove markup from the replacement text
                    	//var new_startnode_text = selected_range.startContainer.textContent.substring(0, selected_range.startOffset) + "====" + replacement_text + "--------" + selected_range.startContainer.textContent.substring(selected_range.startOffset + "___________") ;

                    		// is startnode and endnode the same ?
                    		
                    		

                    		console.log("keep:" + selected_range.startContainer.textContent.substring(0, selected_range.startOffset));
                    		console.log("keep:" + selected_range.endContainer.textContent.substring(selected_range.endOffset));
                    		
                    		var new_startnode_text = "";
                    		var new_endnode_text = "";
                    		const isSameNode = selected_range.startContainer.isSameNode(selected_range.endContainer);
                    		console.log("isSameNode: "+isSameNode );
                    		if (selected_range.startContainer.isSameNode(selected_range.endContainer)){
                        		new_startnode_text = selected_range.startContainer.textContent.substring(0, selected_range.startOffset) + replacement_text + selected_range.endContainer.textContent.substring(selected_range.endOffset);
                            	console.log(selected_range.toString() );                    	
                            	sel.getRangeAt(i).startContainer.textContent = new_startnode_text;
                            	var documentFragment = sel.getRangeAt(i).extractContents();
                        		
                    		}else{
                    			new_startnode_text = selected_range.startContainer.textContent.substring(0, selected_range.startOffset) + replacement_text;
                    			new_endnode_text = selected_range.endContainer.textContent.substring(selected_range.endOffset);
                    		}



                    	  
                    } catch (e) {
                        console.log(e);
                    }
                    	  
                    	//selected_range.startContainer.textContent = new_startnode_text;
                    	 // console.log(selected_range.toString() );
                    	//selected_range.startOffset = new_startnode_range_startpos;
                    	//  console.log(selected_range.toString() );
                    }else{
                        // 1) If the Glovebox token text at the start of a DOM node, create a new text node to contain the decrypted text and insert this node immediatley before the selection range
                    }

                    // task completed

return ("0");
                    // Check if the selection contains the start of the cipher node, and if not, search backwards in DOM until found

                    console.log(get_preceeding_text(sel, i, sel.getRangeAt(i), /:Glovebox:[^:]*/gi))
                    //console.log(get_preceeding_text(sel,i,sel.getRangeAt(i), /O/g))


                    // the Glovebox ciphertext is a plain text node without markup.
                    // Get the preceeding text content.

                    var selectStartOffset = sel.getRangeAt(i).startOffset;
                    console.log("Range.startOffset:" + selectStartOffset);

                    var selectEndOffset = sel.getRangeAt(i).endOffset;
                    console.log("Range.startOffset:" + selectEndOffset);

                    var selection_text = sel.getRangeAt(i).toString();
                    var rangesize = selection_text.length;
                    console.log("Range.size:" + rangesize);

                    var selection_end_pos = selectStartOffset + rangesize;

                    // selection is fully contained inside the cipher text

                    // get the whole of the surrounding text

                    var fulltextofnode = sel.getRangeAt(i).startContainer.textContent;

                    console.log("Range.startContainer:" + fulltextofnode);

                    // grab the piece of the complete text of the node preceeding the selected text and see if it contains the opening statement
                    var preceeding = fulltextofnode.substring(0, selectStartOffset);

                    console.log("preceeding text:" + preceeding);

                    var following = fulltextofnode.substring(selectStartOffset + rangesize);

                    console.log("following text:" + following);

                    // check if selection contain the opening statement, and if not look for it in the preceeding text

                    var glovebox_header_regex = /(:Glovebox:[^:]*:[^:]*:)/g;
                    // var glovebox_header_regex = /:Gl/g;


                    // ok, see if it is in the preceeding text with selection_text appended

                    // pick the glovobox text which intersects with the selection text.
                    // - if more than one, only the first one. (disallow multi-select)


                    console.log("has to completely contain the Glovebox token:" + preceeding + selection_text + following);
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

                    // identity the exact extent of the Glovebox text - which is then replaces with the decrypted text (or html stripped of markup)
                    // identity the node where the Glovebox ciphertext begins.

                    var k = 0;
                    while ((match3 = glovebox_header_regex.exec(t)) != null && k < 1000) {
                        console.log("contains##: selection begin: " + selectStartOffset + " end" + selection_end_pos);

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

                        // creating the glovebox plaintext node
                        newGloveboxNode = document.createElement("glovebox");
                        // newGloveboxNode.textContent = 'some bold text';
                        //newGloveboxNode.appendChild(document.createTextNode("New Node Inserted Here"));

                        var comlete_glovebox_token_text = fulltextofnode.substring(token_end_pos, token_start_pos);

                        // carry out replacement
                        console.log("replacing " + comlete_glovebox_token_text + " with " + newFragment.textContent);

                        console.log("range " + sel.getRangeAt(i).textContent);
                        // expand range
                        console.log("range startcontainer " + sel.getRangeAt(i).startContainer);

                        console.log("range startcontainer textContent " + sel.getRangeAt(i).startContainer.textContent);

                        console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);

                        console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);
                        console.log("range .startContainer.childNodes.length " + sel.getRangeAt(i).startContainer.childNodes.length);

                        console.log("range...from " + token_start_pos);

                        sel.getRangeAt(i).setStart(sel.getRangeAt(i).startContainer, token_start_pos);
                        sel.getRangeAt(i).setEnd(sel.getRangeAt(i).startContainer, token_end_pos);

                        // If there is text at the start of the Glovebox ciphertext add the replacement text to the end of this text (node). I.e do not add another node, just expand an existing one.

                        // What is the node immediately preceeding the selection ?


                        console.log("sel.getRangeAt(i).commonAncestorContainer.nodeType: " + sel.getRangeAt(i).commonAncestorContainer.nodeType);

                        console.log("sel.getRangeAt(i).startContainer.nodeType: " + sel.getRangeAt(i).startContainer.nodeType);
                        console.log("sel.getRangeAt(i).startOffset: " + sel.getRangeAt(i).startOffset);
                        console.log("sel.getRangeAt(i).startContainer: " + sel.getRangeAt(i).startContainer);

                        console.log("sel.getRangeAt(i).startContainer.textContent: " + sel.getRangeAt(i).startContainer.textContent);

                        console.log("sel.getRangeAt(i).endContainer.nodeType: " + sel.getRangeAt(i).endContainer.nodeType);
                        console.log("sel.getRangeAt(i).endOffset: " + sel.getRangeAt(i).endOffset);
                        console.log("sel.getRangeAt(i).endContainer: " + sel.getRangeAt(i).endContainer);

                        console.log("sel.getRangeAt(i). is same: " + sel.getRangeAt(i).endContainer.isSameNode(sel.getRangeAt(i).startContainer));

                        // if start node is a text node. and the cipher text to this node. At the end of the text.
                        if (sel.getRangeAt(i).endContainer.isSameNode(sel.getRangeAt(i).startContainer)) {
                            if (sel.getRangeAt(i).startContainer.nodeType == 3) {

                                let begin = sel.getRangeAt(i).startContainer.textContent.substring(0, sel.getRangeAt(i).startOffset);

                                let end = sel.getRangeAt(i).endContainer.textContent.substring(sel.getRangeAt(i).endOffset);

                                console.log("sel.getRangeAt(i).endContainer, begin: " + begin);

                                console.log("sel.getRangeAt(i).endContainer, end: " + end);

                                sel.getRangeAt(i).startContainer.textContent = begin + replacementStr + end;

                                // split the text content at the start of the inserted text
                                console.log("split text node " + sel.getRangeAt(i).startContainer.textContent + " on position 7");
                                var seondnewNode = sel.getRangeAt(i).startContainer.splitText(7);
                                // insert new node before
                                let insertedNode = sel.getRangeAt(i).startContainer.parentNode.insertBefore(newGloveboxNode, seondnewNode);
                                // insert the plain text into the new node
                                insertedNode.innerHTML = comlete_glovebox_token_text;

                                console.log("p4");
                            } else {
                                console.log("p5");
                            }
                        } else {
                            console.log("start and end node not the same");
                            if (sel.getRangeAt(i).startContainer.nodeType == 3) {
                                // append the cipher text to the start node
                                let begin = sel.getRangeAt(i).startContainer.textContent.substring(0, sel.getRangeAt(i).startOffset);

                                sel.getRangeAt(i).startContainer.textContent = begin + replacementStr;
                                // cut back the end node
                                if (sel.getRangeAt(i).endContainer.nodeType == 3) {
                                    console.log("sel.getRangeAt(i).endOffset" + sel.getRangeAt(i).endOffset);
                                    console.log("sel.getRangeAt(i).endContainer.textContent.length" + sel.getRangeAt(i).endContainer.textContent.length);
                                    console.log("sel.getRangeAt(i).endContainer.textContent.substring( 2,5)" + sel.getRangeAt(i).endContainer.textContent.substring(2, 5));

                                    let end = sel.getRangeAt(i).endContainer.textContent.substring(sel.getRangeAt(i).endOffset);
                                    console.log("sel" + end);
                                    // wipe the selected html, the selection may have contained markup at it should be removed too
                                    //        var e = sel.getRangeAt(i).extractContents();

                                    sel.getRangeAt(i).endContainer.textContent = end;
                                }
                                console.log("p4");
                            } else {
                                console.log("p5");
                            }
                        }

                        // delete Glovebox cipher text
                        //var e = sel.getRangeAt(i).extractContents()

                        // insert the new content before
                        //sel.getRangeAt(i).insertNode(newFragment);


                        k++;
                    }

                }
            } else {
                console.log("4");

            }
        } else {
            console.log("3");

        }

    } else {
        console.log("no replacement text provided.");

    }
}

browser.runtime.onMessage.addListener(ciphertextToText);
