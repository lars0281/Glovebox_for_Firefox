

function posY(elm) {
    var test = elm, top = 0;


    while(!!test && test.tagName.toLowerCase() !== "body") {
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

    if(!!window.innerWidth){
//console.log("return"+window.innerHeight); 
    return window.innerHeight; 
    }
    else if( de && !isNaN(de.clientHeight) )
    { 
    //	console.log("return"+de.clientHeight); 
    	
    	return de.clientHeight; 
    	}
    
    return 0;
}

function scrollY() {
    if( window.pageYOffset ) { 
    //    console.log("return " + window.pageYOffset);
     //   console.log("return " + document.documentElement.scrollTop, document.body.scrollTop);
    	return window.pageYOffset; 
    	}
    
    //console.log("return " + document.documentElement.scrollTop, document.body.scrollTop);
    return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
}

function isVisible( elm ) {
	  var  st = scrollY(); // Scroll Top
	  
      var y = posY(elm);
	    var vpH = viewPortHeight(); // Viewport Height

	    
	    //console.log(st + " " + y + " " + vpH);

	 // want to find out when the decrypted content has scrolled off screen. 
	    // identify the y-position of the node immediately following the decrypted data, and determiny when it has reached the top of the page
	    var nxt = elm.nextSibling;
	
	    
	    
	    return (st < y);
}

// create this structure
// <glovebox><ciphertext hidden="true">cipher text</ciphertext>plain text</glovebox>
// Leaving the cipher text in place but not visible allows for quick "re-encryption". 
// Use case: screen "rollover" removes plain text.

function ciphertextToGloveboxMarkup(request, sender, sendResponse) {

    console.log("ciphertextToGloveboxMarkup:JSON(request): " + JSON.stringify(request));

  //  var replacementStr = request.ciphertext_replacement_text;
    console.log("JSON(request): " + JSON.stringify(request));

    var replacement_text = "";
    replacement_text = request.ciphertext_replacement_text_temp;

    console.log("new html: " + replacement_text);

    if (replacement_text) {

        var newFragment = document.createRange().createContextualFragment(replacement_text);

        var modified_selection_text;

        console.log("p1.2");

        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            console.log(sel);
            if (sel.rangeCount) {
                // var container = document.createElement("div");
                console.log("p2," + sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {

                    var glovebox_header_regex = /(:Glovebox:[^:]*:[^:]*:)/g;
                    
                	 // var glovebox_header_regex = /:Gl/g;
                    //console.log(expand_selection_to_encompass_the_whole_gloveboxtoken(new RegExp('(:Glovebox:[^:]*:[^:]*:)', 'm'), sel));

                	
                    // The Glovebox ciphertext is a plaintext node without markup.
                    // Expand the selection so as to make sure the whole glovebox ciher text token has been selected.

                    var selectStartOffset = sel.getRangeAt(i).startOffset;
                    console.log("reWritePageGetHTMLselected: Range.startOffset:" + selectStartOffset);

                    var selectEndOffset = sel.getRangeAt(i).endOffset;
                    console.log("reWritePageGetHTMLselected: Range.startOffset:" + selectEndOffset);

                    var selection_text = sel.getRangeAt(i).toString();
                    var rangesize = selection_text.length;
                    console.log("reWritePageGetHTMLselected: Range.size:" + rangesize);

                    var selection_end_pos = selectStartOffset + rangesize;

                    // get the whole of the surrounding text

                    var fulltextofnode = sel.getRangeAt(i).startContainer.textContent;

                    console.log("reWritePageGetHTMLselected: Range.startContainer:" + fulltextofnode);

                    // grab the piece of the fulltext of the node preceeding the selected text and see if it contains the opening statement
                    var preceeding = fulltextofnode.substring(0, selectStartOffset);

                    console.log("reWritePageGetHTMLselected: preceeding:" + preceeding);

                    var following = fulltextofnode.substring(selectStartOffset + rangesize);

                    console.log("reWritePageGetHTMLselected: following:" + following);

                    // check if selection contain the opening statement, and if not look in the preceeding

                    // var glovebox_header_regex = /:Gl/g;


                    // ok, see if it is in the preceeding text with selection_text appended

                    // pick the glovobox text which intersects with the selection text.
                    // - if more than one, only the first one.


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

                        var complete_glovebox_ciphertextnode_string=fulltextofnode.substring(token_end_pos, token_start_pos);
                        
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
                        console.log("deleting " + extracted_ciphertext.toString() );
                        
                      //Outputting the fragment content using a throwaway intermediary DOM element (div):
                        var div = document.createElement('div');
                        div.appendChild( extracted_ciphertext.cloneNode(true) );
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
                        newGloveboxNode.setAttribute("id",uuid); // attach a unique ID to the element to make it more easily adressable. 

                        // newGloveboxNode.textContent = 'some bold text';

                        // this node will retain a copy of the encrypted text and is made it not visible. 
                        newCipherNode = document.createElement("ciphertext");
                        newCipherNode.setAttribute("hidden","true"); // attach the attribute to the element to make it invisible, yet still present in the DOM-tree
                        // insert a copy of the original cipher text/node structure
                        newCipherNode.appendChild( extracted_ciphertext.cloneNode(true) );
                        
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
                        newDummyNode.setAttribute("id",uuid+"TEST"); // attach a unique ID to the element to make it more easily adressable. 
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
                        newGloveboxNode.addEventListener("click", function(){
                        	console.log("click test");
                        	// add action to flipp visibility if decrypted text is being clicked
                        	console.log("clicked node: " + document.getElementById(uuid));
                        	console.log("clicked is hidden: " + document.getElementById(uuid).hidden);
                        	
                        	if (document.getElementById(uuid).hidden){
                            	console.log("clicked is hidden: " );
                            	document.getElementById(uuid).hidden = false;
                        	} else{
                            	console.log("clicked is visible, make hidden" );
                            	document.getElementById(uuid).hidden = true;
                        	}
                        	
//                        	document.getElementById("welcome").hidden = true;
 
                        });

                        window.addEventListener('pagehide', function(){ 
                        	console.log("pagehide test");

                        });
                        window.addEventListener('pageshow', function(){ 
                        	console.log("pageshow test");

                        });

                        
                        // Add scroll listener to window
                        // call handler which will assess if any glovebox nodes needs work
                        // Specifically: 
                        // whether any deciphered nodes, should have their plaintext deleted and cipher text restored to visible state. 
                        
                        window.addEventListener("scroll", function(){ 
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
                        	var visible = isVisible( document.getElementById(uuid+"TEST") );
                        	console.log("isVisible: "+visible);
                        	if (!visible){
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
                            		console.log( i + "moving..");
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
                        window.addEventListener("blur", function(){
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


//The use may click anywhere inside the encrypted text.
//Expand the selection at either end to ensure the entire token text containing the encrypted text is selected.
//input
//regexp    Use a regexp to identify the whole token inside a larger plaintext.
//selection  The starting point from which to expand the selection. Output of window.getSelection()
//

//return the text in the expanded selection

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

// setup a listener on the page that can receive a message

browser.runtime.onMessage.addListener(ciphertextToGloveboxMarkup);
