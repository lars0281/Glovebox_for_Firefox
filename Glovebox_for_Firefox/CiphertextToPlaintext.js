

function isFlexbox(node){
		//console.log("isFlexbox");
p=node;
	var y=0;
	// set a maximum limit on how far to loop
	while (y<90){
	//console.log(y);
	// is this even a node ?
	//console.log(p);
	if (p){
		//console.log(window.getComputedStyle(p).getPropertyValue('display'));
		// check if flex
		if (window.getComputedStyle(p).getPropertyValue('display') == 'flex'){
			// got flexbox so terminate loop and return true
			y=101;
			return true;
		}else{
			// ok, continue the looping
		}
	}else{
		return false;
	}
		p = p.parentNode;
		y++;
	}
	// if execution arrives at this is point, the looping has run out
	return false;
}




function posY(elm) {
    var test = elm,
    top = 0;
    while (!!test && test.tagName.toLowerCase() !== "body") {
        top += test.offsetTop;
        test = test.offsetParent;
    }
    // console.log("return top: "+top);
    return top;
}


function viewPortHeight() {
    var de = document.documentElement;

    //console.log("return"+de);
    //console.log("return"+de.clientHeight);

    if (!!window.innerWidth) {
        //console.log("return"+window.innerHeight);
        return window.innerHeight;
    } else if (de && !isNaN(de.clientHeight)) {
        //	console.log("return"+de.clientHeight);

        return de.clientHeight;
    }

    return 0;
}


function scrollY() {
    if (window.pageYOffset) {
        //    console.log("return " + window.pageYOffset);
        //   console.log("return " + document.documentElement.scrollTop, document.body.scrollTop);
        return window.pageYOffset;
    }

    //console.log("return " + document.documentElement.scrollTop, document.body.scrollTop);
    return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
}

function isVisible(elm) {
    var st = scrollY(); // Scroll Top

    var y = posY(elm);
    var vpH = viewPortHeight(); // Viewport Height


    //console.log(st + " " + y + " " + vpH);

    // want to find out when the decrypted content has scrolled off screen.
    // identify the y-position of the node immediately following the decrypted data, and determiny when it has reached the top of the page
    var nxt = elm.nextSibling;

    return (st < y);
}

function textNodesUnderToArray(node) {
    var all = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == 3)
            all.push(node);
        else
            all = all.concat(textNodesUnder(node));
    }
    return all;
}

function textNodesUnderToString(node) {
    console.log(node);
    var all = "";
    try {
        for (node = node.firstChild; node; node = node.nextSibling) {
            if (node.nodeType == 3)
                all = all + node.textContent;
            else
                all = all + textNodesUnderToString(node);
        }
    } catch (e) {
        console.log(e);
    }
    return all;
}

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

function create_glovebox_temporary_decryption_DOM_structure(document, selected_range, replacement_text, contenttype) {
    // create this structure
    // <glovebox><ciphertext hidden="true">cipher text</ciphertext>plain text</glovebox>
    // Leaving the cipher text in place but not visible allows for quick "re-encryption".
    // Use case: screen "rollover" removes plain text.

    // create the Glovebox node

    // <glovebox id=ID >
    // <ciphertext>here is the orignal ciphertext that was decrypted. It is marked as "hidden"</ciphertext>
    // <ciphertext>here is the decrypted content. </ciphertext>
    // </glovebox>
    // Event listeners are attached to the glovebox node.
    var newGloveboxNode;
    var newCipherNode;
    var newPlaintextNode;

    newGloveboxNode = document.createElement("glovebox");

    var uuid;
    //generates random id;
    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    uuid = guid();
    newGloveboxNode.setAttribute("id", uuid); // attach a unique ID to the element to make it more easily adressable.


    var extracted_ciphertext = selected_range.extractContents();
    // newGloveboxNode.textContent = 'some bold text';

    // this node will retain a copy of the encrypted text and is made it not visible.
    newCipherNode = document.createElement("ciphertext");
    newCipherNode.setAttribute("hidden", "true"); // attach the attribute to the element to make it invisible, yet still present in the DOM-tree
    // insert a copy of the original cipher text/node structure
    newCipherNode.appendChild(extracted_ciphertext.cloneNode(true));

    //newCipherNodeBold = document.createElement("b");

    //newCipherNodeBold.textContent = 'some bold text';
    //newCipherNode.appendChild(newCipherNodeBold);


    newPlaintextNode = document.createElement("plaintext");
    newPlaintextNode.textContent = 'some plain text' + replacement_text;

    newGloveboxNode.appendChild(newCipherNode);

    newGloveboxNode.appendChild(newPlaintextNode);

    // create a dummy node to follow the plaintext node.
    // This dummy node will act as an anchor to detect when the plaintext has fully scrolled up and out of the screen
    // When the dummy node has y-position equal to the windows height, the node above the dummy node, the decrypted plaintext, is entirely off screen.

    var newDummyNode;
    newDummyNode = document.createElement("div");
    newDummyNode.setAttribute("id", uuid + "TEST"); // attach a unique ID to the element to make it more easily adressable.
    newGloveboxNode.appendChild(newDummyNode);

    //newGloveboxNode.appendChild(newFragment);

    //newGloveboxNode.appendChild(document.createTextNode("New Node Inserted Here"));
    // insert <glovebox> node at the start of the Glovebox encrypted token
    console.log("insert glovebox node");
    var seondnewNode = selected_range.startContainer.splitText(7);

    // let insertedNode = sel.getRangeAt(i).startContainer.parentNode.insertBefore(newGloveboxNode, seondnewNode);


    // insert the new content before
    // sel.getRangeAt(i).insertNode(newFragment);
    selected_range.insertNode(newGloveboxNode);

    // attach the event that will trigger the required behavior


    // add evenhandler which makes cipher text visible/invisible with clicking
    newGloveboxNode.addEventListener("click", function () {
        console.log("click test");
        // add action to flipp visibility if decrypted text is being clicked
        console.log("clicked node: " + document.getElementById(uuid));
        console.log("clicked is hidden: " + document.getElementById(uuid).hidden);

        if (document.getElementById(uuid).hidden) {
            console.log("clicked is hidden: ");
            document.getElementById(uuid).hidden = false;
        } else {
            console.log("clicked is visible, make hidden");
            document.getElementById(uuid).hidden = true;
        }

        //    	document.getElementById("welcome").hidden = true;

    });

    window.addEventListener('pagehide', function () {
        console.log("pagehide test");

    });
    window.addEventListener('pageshow', function () {
        console.log("pageshow test");

    });

    // Add scroll listener to window
    // call handler which will assess if any glovebox nodes needs work
    // Specifically:
    // whether any deciphered nodes, should have their plaintext deleted and cipher text restored to visible state.

    window.addEventListener("scroll", function () {
        // leave as a place holder for now

        //	var visible = isVisible( document.getElementById(uuid+"TEST") );
        //	console.log("isVisible: "+visible);
        //	if (!visible){
        // 		console.log("decrypted content scrolled off-screen. remove it and place the cipher text back where it was.");
        // 		// check if the plaintext and ciphertext nodes are still there - so we don't attempt to do this repeatedly.
        //  	}

    });
    // kick off processing if focus is removed from the browser application
    window.addEventListener("blur", function () {
        // remove the decrypted text whenever the user navigates away from the page and reverse all changes to the DOM introduced by the decryption
        // Situation: The user has successfully decrypted some text this decrypted data should not be left laying around in clear, when the user shifts focus.
        // The original cipher text is retained in the DOM as a hidden node, right next to the decrypted data.
        // on loss of focus the decrypted data is deleted from the DOM and the previous cipher text is made visible in its place.

        console.log("user navigated away from the browser page - remove temporarily decrypted data");

        // locate cipher node and make it visible
        console.log("locate ID " + uuid);

        var gl_node = document.getElementById(uuid);

        var ciph = gl_node.childNodes[0];
        console.log(ciph);
        // locate plain text node(s) and delete it(them).

        var plain = gl_node.childNodes[1];
        console.log(plain);

        var dummy = gl_node.childNodes[2];
        console.log(dummy);

        //var list = document.getElementById("myList");   // Get the <ul> element with id="myList"
        //var list = gl_node.childNodes
        console.log(gl_node.childNodes);

        // delete dummy node
        console.log(gl_node.childNodes[2]);
        gl_node.removeChild(gl_node.childNodes[2]);
        // delete cipher node

        console.log(gl_node.childNodes[1]);
        gl_node.removeChild(gl_node.childNodes[1]);

        console.log(gl_node.childNodes);
        //move the content of ciphertext node to preceed the glovebox node (the first child node of the glovebox node)
        // use this counter to prevent out-of-control looping
        var i = 0;
        while (gl_node.childNodes[0].firstChild && i < 3) {
            console.log(i + "moving..");
            console.log(gl_node.childNodes[0].firstChild);
            i++;
            console.log(gl_node.childNodes);
            console.log(gl_node.parentNode.childNodes);
            let insertedNode = gl_node.parentNode.insertBefore(gl_node.childNodes[0].firstChild, gl_node);
            console.log(gl_node.childNodes);
            console.log(gl_node.parentNode.childNodes);

            //    		  element.removeChild(element.firstChild);
        }
        // After all child nodes of the ciphertext node have been moved up to be a preceeding sibling node of the glovebox node, remove the glovebox node itself.
        // There should be only one child node the of the ciphertext node ( a text node containing the cipher text) but write this as a loop to future-proof it.
        gl_node.parentNode.removeChild(gl_node);

    });

}

function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
}

function permanent_decrypt(document, selected_range, replacement_text, contenttype) {

    // Insert the decrypted text
    // Does the token begin deep (startpos > 0) inside another text node ?
    console.log(selected_range.startOffset);
    if (selected_range.startOffset > 0) {
        try {
            // 2) If the start of token text is contained inside a larger text node, then insert the decrypted text in that node, at the spot where the selection range begins.
            // remove markup from the replacement text
            //var new_startnode_text = selected_range.startContainer.textContent.substring(0, selected_range.startOffset) + "====" + replacement_text + "--------" + selected_range.startContainer.textContent.substring(selected_range.startOffset + "___________") ;

            // is startnode and endnode the same ?

            if (contenttype == "text") {
                // remove any markup from replacement text (incase it was HTML to begin with)
                console.log("replacement_text, before: " + replacement_text);
                replacement_text = removeTags(replacement_text);
                console.log("replacement_text, after: " + replacement_text);

              
                console.log("keep (before):" + selected_range.startContainer.textContent.substring(0, selected_range.startOffset));
                console.log("keep (end):" + selected_range.endContainer.textContent.substring(selected_range.endOffset));

                const isSameNode = selected_range.startContainer.isSameNode(selected_range.endContainer);
                console.log("isSameNode: " + isSameNode);
                try {
                    if (selected_range.startContainer.isSameNode(selected_range.endContainer)) {
                        // all to take place inside the same text node
                        console.log("replacement_text: " + replacement_text);
                        var start_fragment = "";
                        start_fragment = selected_range.startContainer.textContent.substring(0, selected_range.startOffset);
                        console.log("start_fragment: " + start_fragment);
                        var end_fragment = "";
                        end_fragment = selected_range.endContainer.textContent.substring(selected_range.endOffset);
                        console.log("end_fragment: " + end_fragment);
                        var new_nodetext = start_fragment + replacement_text + end_fragment;
                        var documentFragment = selected_range.extractContents();
                        selected_range.startContainer.textContent = new_nodetext;
                    } else {
                    	// spans across more than one node 
                        console.log("replacement_text: " + replacement_text);
                        var start_node;
                        start_node = selected_range.startContainer;
                        var start_fragment = "";
                        start_fragment = start_node.textContent.substring(0, selected_range.startOffset);
                        console.log("start_fragment: " + start_fragment);
                        var end_node;
                        end_node = selected_range.endContainer;
                        var end_fragment = "";
                        end_fragment = end_node.textContent.substring(selected_range.endOffset);
                        console.log("end_fragment: " + end_fragment);
                        // put the remaning fragment from the end node into the end of the start node
                        var new_nodetext = start_fragment + replacement_text + end_fragment;
                        var documentFragment = selected_range.extractContents();
                        selected_range.startContainer.textContent = new_nodetext;
                    	// remove the end node
                        end_node.remove();
                    	
                    	
                    }
                } catch (e) {
                    console.log(e);
                }
            } else if (contenttype == "html") {

                // firstly, was the cipher text embedded inside a single text node
                var isSameNode = "";

                if (!selected_range.startContainer.previousSibling) {
                    isSameNode = "isFirst";
                    console.log("isSameNode: set to first");
                } else if (!selected_range.endContainer.nextSibling) {
                    isSameNode = "isLast";
                    console.log("isSameNode: set to last");
                } else {

                    try {
                        isSameNode = selected_range.startContainer.previousSibling.isSameNode(selected_range.endContainer.nextSibling);
                        if (isSameNode) {
                            isSameNode = "isSame";
                        } else {
                            isSameNode = "isNotSame";
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    console.log("isSameNode: " + isSameNode);
                }

                console.log("isSameNode: " + isSameNode);

                var newFragment = document.createRange().createContextualFragment(replacement_text);

                //	 if (isSameNode == "isLast"){
                // there is no next sibling node following the end container.


                //	 }else{


                // if not, then
                // handle the following situations

                // 1. The node immediately preceding the selection is a text node AND the decrypted content starts with text node
                // preceding node is a text node if startOffset is greater than zero
                try {
                    console.log(selected_range.startOffset);
                    console.log(selected_range.startContainer);
                    console.log(selected_range.startContainer.parentNode);
                    console.log(selected_range.startContainer.previousSibling);
                    if (selected_range.startContainer.previousSibling) {
                        console.log(selected_range.startContainer.previousSibling.nodeType);
                    }
                } catch (e) {
                    console.log(e)
                }
                // of the first preceding sibling node is a text node

                console.log(newFragment.toString());
                console.log(newFragment.textContent);
                console.log(newFragment.startContainer);
                var textNodes = [newFragment.childNodes].filter(node => node.nodeType == Node.TEXT_NODE);
                console.log(newFragment.childNodes);
                console.log(newFragment.childNodes[0]);
                console.log(newFragment.childNodes[-1]);
                console.log(textNodes);
                console.log(textNodes[0]);
                // take the first piece of the new fragment/range and add to the end of the preceding textnode


                // 2. The node immediately following the selection is a text node AND the decrypted content also ends in a text node
                // if endoffset is less than length
                try {
                    console.log(selected_range.endOffset);
                    console.log(selected_range.endContainer);
                    console.log(selected_range.endContainer.parentNode);
                    console.log(selected_range.endContainer.nextSibling);
                    if (selected_range.endContainer.nextSibling) {
                        console.log(selected_range.endContainer.nextSibling.nodeType);
                    }

                } catch (e) {
                    console.log(e)
                }
                // }
                // The node following the selection is a text node

                // 3. Neither the preceding nor following node are text nodes


                // delete existing Glovebox cipher text
                var e = selected_range.extractContents();
                // insert the new content before
                selected_range.insertNode(newFragment);

            }

        } catch (e) {
            console.log(e);
        }

        //selected_range.startContainer.textContent = new_startnode_text;
        // console.log(selected_range.toString() );
        //selected_range.startOffset = new_startnode_range_startpos;
        //  console.log(selected_range.toString() );
    } else {
        // 1) If the Glovebox token text at the start of a DOM node, create a new text node to contain the decrypted text and insert this node immediatley before the selection range
    }

}

function ciphertextToPlaintext(request, sender, sendResponse) {

    console.log("JSON(request): " + JSON.stringify(request));

    try{
    // only execute this code if it has been propperly called. The value of Get_GloveboxCiphertext is not being used for anything other than to screen out calls to this code.
    if (request.CiphertextToPlaintext == "Glbx_marker3") {

    
    var replacement_text = "";
    replacement_text = request.ciphertext_replacement;

    var duration = "";
    duration = request.duration;

    var contenttype = "";
    contenttype = request.contenttype;

    console.log("new content: " + replacement_text);
    console.log("duration: " + duration);
    console.log("contenttype: " + contenttype);

    if (replacement_text) {

        var newFragment = document.createRange().createContextualFragment(replacement_text);

        var modified_selection_text;

        console.log("p1.2" + window.getSelection);

        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            console.log(sel);
            if (sel.rangeCount) {
                // var container = document.createElement("div");
                console.log("p2," + sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; i++) {
                    console.log("i=" + i);
                    try {
                        var glovebox_header_regex = /(:Glovebox:[^:]*:[^:]*:)/g;

                        var selected_range = sel.getRangeAt(i);

                        // var glovebox_header_regex = /:Gl/g;
                        //console.log(expand_selection_to_encompass_the_whole_gloveboxtoken(new RegExp('(:Glovebox:[^:]*:[^:]*:)', 'm'), sel));


                        // The Glovebox ciphertext is a plaintext node without markup.
                        // Expand the selection so as to make sure the whole glovebox ciher text token has been selected.
                        fit_Selection_glovebox_ciphertext(selected_range);

                        // at this point the selection fits the glovebox-cihper text exactly.

                        // Choose based on termparary or permanent decryption
                        // Temporary means the cipher text is retained in the DOM but made hidden.
                        // event listeners are put in which put the cipher text back and deletes the plaintext it certain situations occur.

                        if (duration == "perm") {
                            console.log("Permanent decryption");
                            permanent_decrypt(document, selected_range, replacement_text, contenttype);

                        } else {
                            console.log("Temporary decryption");

                            create_glovebox_temporary_decryption_DOM_structure(document, selected_range, replacement_text, contenttype);

                        }
                    } catch (e) {
                        console.log(e);
                    }

                    try {
                        console.log("remove listener");
                        browser.runtime.onMessage.removeListener(ciphertextToPlaintext);
                    } catch (e) {
                        console.log(e);
                    }

                    return (0);

                    console.log("reWritePageGetHTMLselected: has to contain the Glovebox header:" + preceeding + selection_text + following);
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

                        var complete_glovebox_ciphertextnode_string = fulltextofnode.substring(token_end_pos, token_start_pos);

                        // carry out replacement
                        console.log("replacing " + complete_glovebox_ciphertextnode_string + " with " + newFragment.toString());

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


                        //console.log("deleting " + complete_glovebox_ciphertextnode_string + " with " + newFragment.toString());

                        var extracted_ciphertext = sel.getRangeAt(i).extractContents();
                        console.log("deleting " + extracted_ciphertext);
                        console.log("deleting " + extracted_ciphertext.toString());

                        //Outputting the fragment content using a throwaway intermediary DOM element (div):
                        var div = document.createElement('div');
                        div.appendChild(extracted_ciphertext.cloneNode(true));
                        console.log("just deleted " + div.innerHTML); //output should be '<p>test</p>'


                        // create the Glovebox node

                        // <glovebox id=ID >
                        // <ciphertext>here is the orignal ciphertext that was decrypted. It is marked as "hidden"</ciphertext>
                        // <ciphertext>here is the decrypted content. </ciphertext>
                        // </glovebox>
                        // Event listeners are attached to the glovebox node.
                        var newGloveboxNode;
                        var newCipherNode;
                        var newPlaintextNode;

                        newGloveboxNode = document.createElement("glovebox");

                        var uuid;
                        //generates random id;
                        let guid = () => {
                            let s4 = () => {
                                return Math.floor((1 + Math.random()) * 0x10000)
                                .toString(16)
                                .substring(1);
                            }
                            //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
                            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
                        }

                        uuid = guid();
                        newGloveboxNode.setAttribute("id", uuid); // attach a unique ID to the element to make it more easily adressable.

                        // newGloveboxNode.textContent = 'some bold text';

                        // this node will retain a copy of the encrypted text and is made it not visible.
                        newCipherNode = document.createElement("ciphertext");
                        newCipherNode.setAttribute("hidden", "true"); // attach the attribute to the element to make it invisible, yet still present in the DOM-tree
                        // insert a copy of the original cipher text/node structure
                        newCipherNode.appendChild(extracted_ciphertext.cloneNode(true));

                        //newCipherNodeBold = document.createElement("b");

                        //newCipherNodeBold.textContent = 'some bold text';
                        //newCipherNode.appendChild(newCipherNodeBold);


                        newPlaintextNode = document.createElement("plaintext");
                        newPlaintextNode.textContent = 'some plain text' + replacement_text;

                        newGloveboxNode.appendChild(newCipherNode);

                        newGloveboxNode.appendChild(newPlaintextNode);

                        // create a dummy node to follow the plaintext node.
                        // This dummy node will act as an anchor to detect when the plaintext has fully scrolled up and out of the screen
                        // When the dummy node has y-position equal to the windows height, the node above the dummy node, the decrypted plaintext, is entirely off screen.

                        var newDummyNode;
                        newDummyNode = document.createElement("div");
                        newDummyNode.setAttribute("id", uuid + "TEST"); // attach a unique ID to the element to make it more easily adressable.
                        newGloveboxNode.appendChild(newDummyNode);

                        //newGloveboxNode.appendChild(newFragment);

                        //newGloveboxNode.appendChild(document.createTextNode("New Node Inserted Here"));
                        // insert <glovebox> node at the start of the Glovebox encrypted token
                        console.log("insert glovebox node");
                        var seondnewNode = sel.getRangeAt(i).startContainer.splitText(7);

                        // let insertedNode = sel.getRangeAt(i).startContainer.parentNode.insertBefore(newGloveboxNode, seondnewNode);


                        // insert the new content before
                        // sel.getRangeAt(i).insertNode(newFragment);
                        sel.getRangeAt(i).insertNode(newGloveboxNode);

                        // attach the event that will trigger the required behavior


                        // add evenhandler which makes cipher text visible/invisible with clicking
                        newGloveboxNode.addEventListener("click", function () {
                            console.log("click test");
                            // add action to flipp visibility if decrypted text is being clicked
                            console.log("clicked node: " + document.getElementById(uuid));
                            console.log("clicked is hidden: " + document.getElementById(uuid).hidden);

                            if (document.getElementById(uuid).hidden) {
                                console.log("clicked is hidden: ");
                                document.getElementById(uuid).hidden = false;
                            } else {
                                console.log("clicked is visible, make hidden");
                                document.getElementById(uuid).hidden = true;
                            }

                            //                        	document.getElementById("welcome").hidden = true;

                        });

                        window.addEventListener('pagehide', function () {
                            console.log("pagehide test");

                        });
                        window.addEventListener('pageshow', function () {
                            console.log("pageshow test");

                        });

                        // Add scroll listener to window
                        // call handler which will assess if any glovebox nodes needs work
                        // Specifically:
                        // whether any deciphered nodes, should have their plaintext deleted and cipher text restored to visible state.

                        window.addEventListener("scroll", function () {
                            //console.log("scroll test for node ="+uuid);
                            // check if node is visible.

                            //console.log("1: "+document.getElementById(uuid).style.display);
                            //console.log("2: "+document.getElementById(uuid).parentNode.style.display);
                            //console.log("3: "+document.getElementById(uuid).offsetWidth );
                            //console.log("4: "+document.getElementById(uuid).offsetHeight  );

                            //  insertedNode.addEventListener("pagehide", function (){ console.log("pagehide test"); });
                            //   insertedNode.addEventListener("pageshow", function (){ console.log("pageshow test"); });

                            //console.log("5: "+document.hidden );
                            //console.log("6: "+document.getElementById(uuid).offsetHeight  );
                            var visible = isVisible(document.getElementById(uuid + "TEST"));
                            console.log("isVisible: " + visible);
                            if (!visible) {
                                console.log("decrypted content scrolled off-screen. remove it and place the cipher text back where it was.");
                                // check if the plaintext and ciphertext nodes are still there - so we don't attempt to do this repeatedly.

                                // locate cipher node and make it visible
                                console.log("locate ID " + uuid);

                                var gl_node = document.getElementById(uuid);

                                var ciph = gl_node.childNodes[0];
                                console.log(ciph);
                                // locate plain text node(s) and delete it(them).

                                var plain = gl_node.childNodes[1];
                                console.log(plain);

                                var dummy = gl_node.childNodes[2];
                                console.log(dummy);

                                //var list = document.getElementById("myList");   // Get the <ul> element with id="myList"
                                //var list = gl_node.childNodes
                                console.log(gl_node.childNodes);

                                // delete dummy node
                                console.log(gl_node.childNodes[2]);
                                gl_node.removeChild(gl_node.childNodes[2]);
                                // delete cipher node

                                console.log(gl_node.childNodes[1]);
                                gl_node.removeChild(gl_node.childNodes[1]);

                                console.log(gl_node.childNodes);
                                // move the content of ciphertext node to preceed the glovebox node (the first child node of the glovebox node)
                                // use this counter to prevent out-of-control looping
                                var i = 0;
                                while (gl_node.childNodes[0].firstChild && i < 3) {
                                    console.log(i + "moving..");
                                    console.log(gl_node.childNodes[0].firstChild);
                                    i++;
                                    console.log(gl_node.childNodes);
                                    console.log(gl_node.parentNode.childNodes);
                                    let insertedNode = gl_node.parentNode.insertBefore(gl_node.childNodes[0].firstChild, gl_node);
                                    console.log(gl_node.childNodes);
                                    console.log(gl_node.parentNode.childNodes);

                                    //                            		  element.removeChild(element.firstChild);
                                }
                                // After all child nodes of the ciphertext node have been moved up to be a preceeding sibling node of the glovebox node, remove the glovebox node itself.
                                // There should be only one child node the of the ciphertext node ( a text node containing the cipher text) but write this as a loop to future-proof it.
                                gl_node.parentNode.removeChild(gl_node);

                            }

                        });
                        // kick off processing if focus is removed from the browser application
                        window.addEventListener("blur", function () {
                            // remove the decrypted text whenever the user navigates away from the page and reverse all changes to the DOM introduced by the decryption
                            // Situation: The user has successfully decrypted some text this decrypted data should not be left laying around in clear, when the user shifts focus.
                            // The original cipher text is retained in the DOM as a hidden node, right next to the decrypted data.
                            // on loss of focus the decrypted data is deleted from the DOM and the previous cipher text is made visible in its place.

                            console.log("user navigated away from the browser page - remove temporarily decrypted data");

                            // locate cipher node and make it visible
                            console.log("locate ID " + uuid);

                            var gl_node = document.getElementById(uuid);

                            var ciph = gl_node.childNodes[0];
                            console.log(ciph);
                            // locate plain text node(s) and delete it(them).

                            var plain = gl_node.childNodes[1];
                            console.log(plain);

                            // loop through contents of plaintext node and append all nodes found as sibling nodes to the glovebox node.
                            //	let insertedNode = gl_node.parentNode.insertBefore(plain, gl_node)
                            //	while (plain.firstChild) {
                            //		console.log(insertedNode);
                            //The list is LIVE so it will re-index each call
                            //                        	    box.removeChild(box.firstChild);
                            //	}


                        });

                        k++;
                    }

                }
            }
        }

    } else {
        console.log("no replacement html provided.");
    }
    }
    } catch (e) {
        console.log(e);
    }
}

//The use may click anywhere inside the encrypted text.
//Expand the selection at either end to ensure the entire token text containing the encrypted text is selected.
//input
//regexp    Use a regexp to identify the whole token inside a larger plaintext.
//selection  The starting point from which to expand the selection. Output of window.getSelection()
//

//return the text in the expanded selection

function expand_selection_to_encompass_the_whole_gloveboxtoken(reg, sel) {

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

// setup a listener on the page that can receive a message

browser.runtime.onMessage.addListener(ciphertextToPlaintext);
