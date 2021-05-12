/*
 * This file is responsible for performing the logic of replacing
 * all occurrences of each mapped word with its emoji counterpart.
 */

/*global sortedEmojiMap*/

// emojiMap.js defines the 'sortedEmojiMap' variable.
// Referenced here to reduce confusion.

console.log("running substitueToken.js");
console.log(sortedTokenMap);
const emojiMap = sortedTokenMap;

// html strings for messages to the user

var GloveboxSecureKeyOfferToken_tooltipmessage =     'Token contaning an offer of receiving a decryption key, in a secure manner. </br>' +
'The key will be provided in a later step. This token only provies you with the identity (the public key ) of the sender <br>' +
'mark the text and select from context menu, or <br>' +
'Double-click to select then Right click and select Glovebox -> accept offer of decryption offer securely' +
'';

var GloveboxSecureKeyTokenFromAcceptedOfferToken_tooltipmessage = 'This token contains the decryption key that was offered earlier and which you have accepted.</br>' +
        'Accepting this token means you will add the decryption key to you database of decryption keys.<br>' +
        'Aftger whichi you will be able to read (decrypt) messages/post and other data encrypted by the sender.<br>' +
        'mark the text and select from context menu, or <br>' +
        'Double-click to select then Right click and select Glovebox -> accept offer of decryption offer securely' +
        '';
var GloveboxAcceptedSecureKeyOfferToken_tooltipmessage = 'This token contains the acceptance an earlier key offer.</br>' +
    'mark the text and select from context menu, or <br>' +
    'Double-click to select then Right click and select Glovebox -> accept offer of decryption offer securely' +
    '';

var  Glovebox_tooltipmessage  = 'Encrypted text </br>' +
'mark the text and select from context menu, or <br>' +
'Double-click to select then Right click and select Glovebox -> decrypt text' +
'Browser: Mozilla – 1.9.99Operating system: Linux - i686 (x86_64)' +
'"decrypt textonly" will return only plain text from the decrypted content. This is the safe option.';


// code sample from
// http://www.texsoft.it/index.php?%20m=sw.js.htmltooltip&c=software&l=it

function xstooltip_findPosX(obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft
            obj = obj.offsetParent;
        }
    } else if (obj.x)
        curleft += obj.x;
    //  console.log("xstooltip_findPosx returning: " + curleft);
    return curleft;
}

function xstooltip_findPosY(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curtop += obj.offsetTop
            obj = obj.offsetParent;
        }
    } else if (obj.y)
        curtop += obj.y;
    // console.log("xstooltip_findPosY returning: " + curtop);
    return curtop;
}

// ID of object containing the
function xstooltip_show(tooltipId, parentId, posX, posY) {
    console.log("running: xstooltip_show");
    it = document.getElementById(tooltipId);

    console.log("html of tooltip: " + it.outerHTML);

    //  it = document.createElement("div");
    // it.setAttribute("id",'tooltip_123');
    //  it.setAttribute("class",'xstooltip');
    //  it.setAttribute("style",'visibility: hidden;position: absolute;z-index: 2;top: 0;left: 0;font: normal 8pt sans-serif;padding: 3px;border: solid 1px;');
    //  it.setAttribute("style",'visibility: hidden;position: absolute;z-index: 2;top: 0;left: 0;font: normal 8pt sans-serif;padding: 3px;border: solid 1px;');

    //  it.setAttribute("style",'width: 196px; height: 71…px; visibility: hidden;');

    // write content of the message box
    //it.textContent = 'Time spent: 00:00:08<br/>Page viewed: 4<br/>';

    console.log(it);
    console.log("3: ");
    console.log("5: " + it.offsetWidth);
    console.log("6: ");

    if ((it.style.top == '' || it.style.top == 0)
         && (it.style.left == '' || it.style.left == 0)) {
        // need to fixate default size (MSIE problem)
        it.style.width = it.offsetWidth + 'px';
        it.style.height = it.offsetHeight + 'px';

        // identify parent object
        img = document.getElementById(parentId);
        console.log("4: " + img.offsetWidth);
        //img = it.parentNode;
        console.log("parentNode: " + img);
        // if tooltip is too wide, shift left to be within parent
        if (posX + it.offsetWidth > img.offsetWidth)
            posX = img.offsetWidth - it.offsetWidth;
        if (posX < 0)
            posX = 0;

        x = xstooltip_findPosX(img) + posX;
        y = xstooltip_findPosY(img) + posY;

        it.style.top = y + 'px';
        it.style.left = x + 'px';
        console.log("y pos: " + y);
        console.log("x pos: " + x);

    } else {
        console.log("style.top null");
    }

    it.style.visibility = 'visible';
}

// html -  html to display in the tooltip
// tooltipId  - ID of object containing the tooltip
// parentId  -  ID of object to which the tooltip is anchored
function xstooltip_showhtml(inner_html, tooltipId, parentId, posX, posY) {
    console.log("#########################");
    console.log("running: xstooltip_showhtml");
    console.log("running: xstooltip_showhtml(" + inner_html + ", " + tooltipId + ", " + parentId + ", " + posX + ", " + posY + ")");
    var it;

    // (re?)create html of tooltip

    var it2 = document.createElement("div");
    //     it2.setAttribute("id",tooltipId+ '_temp');
    it2.setAttribute("id", tooltipId);
    it2.setAttribute("class", 'xstooltip');

    // set style for the tooltip box. (Replaces an external CSS-stylesheet )
    // visibility: hidden;
    // position: absolute;
    // top: 0;
    // left: 0;
    // z-index: 2;
    // font: normal 8pt sans-serif;
    // padding: 3px;
    // border: solid 8px;
    // background-repeat: repeat;
    // background-image: url(icons/azure.png);

    it2.setAttribute("style", 'position: absolute;z-index: 2;top: 0;left: 0;font: normal 12pt sans-serif;padding: 3px;border: solid 0px;background: rgba(0, 175, 256, 0.9);');

    it2.innerHTML = inner_html;

    // insert into  document
    var anchor = document.getElementById(parentId);

    var tooltip_parent = document.getElementById(parentId);
    // add the created tooltip html into the document
    tooltip_parent.appendChild(it2);

    it = it2;

    //  console.log("#### found html of tooltip (outerHTML): " + it.outerHTML);
    // console.log("#### found html of tooltip (innerHTML): " + it.innerHTML);
    //console.log("it.style.top: " + it.style.top);
    //console.log("it2.style.top: " + it2.style.top);
    //console.log("it.style.left: " + it.style.left);
    //console.log("it2.style.left: " + it2.style.left);

    if ((it.style.top == '' || it.style.top == 0 || it.style.top == "0px")
         && (it.style.left == '' || it.style.left == 0 || it.style.left == "0px")) {
        // need to fixate default size (MSIE problem)
        it.style.width = it.offsetWidth + 'px';
        it.style.height = it.offsetHeight + 'px';

        // identify parent object
        img = document.getElementById(parentId);
        //      console.log("4: " + img.offsetWidth);
        //img = it.parentNode;
        //  console.log("parentNode: " + img);
        // if tooltip is too wide, shift left to be within parent
        if (posX + it.offsetWidth > img.offsetWidth)
            posX = img.offsetWidth - it.offsetWidth;
        if (posX < 0)
            posX = 0;

        x = xstooltip_findPosX(img) + posX;
        y = xstooltip_findPosY(img) + posY;

        it.style.top = y + 'px';
        it.style.left = x + 'px';
        //     console.log("y pos: " + y);
        //    console.log("x pos: " + x);

    } else {
        //   console.log("style.top null");
    }

    it.style.visibility = 'visible';
}

function xstooltip_hide(id) {
    it = document.getElementById(id);
    it.style.visibility = 'hidden';
    it.remove();
}

/*
 * For efficiency, create a word --> search RegEx Map too.
 */
let regexs = new Map();
for (let word of emojiMap.keys()) {
    // We want a global, case-insensitive replacement.
    // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
    //   console.log("processing: " + word);
    regexs.set(word, new RegExp(word, 'gi'));
}

/**
 * Substitutes emojis into text nodes.
 * If the node contains more than just text (ex: it has child nodes),
 * call replaceText() on each of its children.
 *
 * @param  {Node} node    - The target DOM Node.
 * @return {void}         - Note: the emoji substitution is done inline.
 */
function replaceText(node) {
    // Setting textContent on a node removes all of its children and replaces
    // them with a single text node. Since we don't want to alter the DOM aside
    // from substituting text, we only substitute on single text nodes.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    // console.log("processing: " + node.nodeName);
    //  console.log("whole doc: " + node.getRootNode().innerHTML);
    //  console.log("whole doc: " + document.body.innerHTML);

    if (node.nodeType === Node.TEXT_NODE) {
        //console.log("# doing " + node.nodeName);
        // This node only contains text.
        // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType.

        // Skip textarea nodes due to the potential for accidental submission
        // of substituted emoji where none was intended.
        if (node.parentNode &&
            node.parentNode.nodeName === 'TEXTAREA') {
            return;
        }

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

        // Because DOM manipulation is slow, we don't want to keep setting
        // textContent after every replacement. Instead, manipulate a copy of
        // this string outside of the DOM and then perform the manipulation
        // once, at the end.
        let content = node.textContent;

        // Replace every occurrence of 'word' in 'content' with its emoji.
        // Use the emojiMap for replacements.
        for (let[word, emoji]of emojiMap) {
            // Grab the search regex for this word.
            //console.log("processing regex: " + word);
            const regex = regexs.get(word);

            // Actually do the replacement / substitution.
            // Note: if 'word' does not appear in 'content', nothing happens.

            // If the Glovebox nodes have already been inserted, the match will be a position 0
            // in that case, check if the element is the right one, and if so do nothing.

            // if the match is not at position zero, carry out the Glovebox element insertion.

            // attach javascript to create popup box with information/instruction

            // console.log("applying to: " + content);

            var k = 0;
            // loop through all found matches
            while ((match3 = regex.exec(content)) != null && k < 8) {
                var pattern_l = (regex.toString().length - 4);
                console.log("match on pattern " + regex + " , found at position: " + (match3.index));
                //  console.log (" , in content: \"" + content + "\"");
                console.log("pattern length " + pattern_l);
                console.log("match #" + k + " found of length " + match3[0].length + " containing: \"" + match3[0] + "\"");
                // do not act on matched at the beginning of a textnode (but check element name)
                if (match3.index > pattern_l) {
                    console.log("### act on this match");
                    try {
                        //   	console.log("node content before modification: " + content);
                        //    	console.log("node content before modification: " + node.textContent);
                        // copy out

                        // remove the matched string from the content
                        var modified_content = content.substr(0, match3.index) + "_MARK_" + content.substr(match3.index + match3[0].length);

                        console.log("content modified to: " + modified_content);
                        // modifiy the text content of the current node to reflect the removal of the matched pattern
                        node.textContent = modified_content;

                        console.log("node content after modification: " + node.textContent);

                        // split the text node on the positition where the match was made earlier and the where the matched (and removed) text began from.
                        var seondnewNode = node.splitText(match3.index);

                        //        console.log("after split 1: "+seondnewNode);
                        //         console.log("after split 1: "+seondnewNode.textContent);

                        //          console.log("after split 2: "+seondnewNode.previousSibling);
                        //           console.log("after split 2: "+seondnewNode.previousSibling.textContent);

                        var nextNode = seondnewNode.nextSibling;

                        console.log(seondnewNode);
                        console.log(seondnewNode.textContent);
                        //console.log(seondnewNode.textContent.substring(1, 4));

                        //console.log(nextNode);

                        console.log("regexp: " + word);

                        // assign a unique identifier to all glovebox nodes so facilitate later addressing
                        uuid = guid();

                        // Create html containing instructions to the user
                        // Differentiate the instructions based on the token in question
                        var inner_html = 'Time spent: 00:00:08<br><temp>some temporary text</temp>' +
                            'Page viewed: 4000<br>' +
                            'Location: Loopback <br>' +
                            'Browser: Mozilla – 1.9.99Operating system: Linux - i686 (x86_64)';
                        
                        if (word == ':Glovebox:[^:]*:[^:]*:') {

                            newGloveboxNode = document.createElement("Glovebox");
                            console.log("############################ 1")

                            inner_html = Glovebox_tooltipmessage;

                        } else if (word == ':GloveboxSecureKeyOfferToken:[^:]*:') {
                            newGloveboxNode = document.createElement("GloveboxSecureKeyOfferToken");
                            console.log("############################ 2")

                            inner_html = GloveboxSecureKeyOfferToken_tooltipmessage;
                            
                        } else if (word == ':GloveboxSecureKeyTokenFromAcceptedOfferToken:[^:]*:') {
                            newGloveboxNode = document.createElement("GloveboxSecureKeyTokenFromAcceptedOfferToken");
                            console.log("############################ 4")

                            inner_html = GloveboxSecureKeyTokenFromAcceptedOfferToken_tooltipmessage;
                            
                        } else if (word == ':GloveboxSecureKeyOfferToken:[^:]*:') {
                            newGloveboxNode = document.createElement("GloveboxSecureKeyOfferToken");

                        } else if (word == ':GloveboxAcceptedSecureKeyOfferToken:[^:]*:') {
                            newGloveboxNode = document.createElement("GloveboxAcceptedSecureKeyOfferToken");
                            console.log("############################ 3")

                            inner_html = GloveboxAcceptedSecureKeyOfferToken_tooltipmessage;
                        } else if (word == ':GloveboxOpenKeyToken:[^:]*:') {
                            newGloveboxNode = document.createElement("GloveboxOpenKeyToken");

                        }

                        // newGloveboxNode.textContent = match3[0] + '___GLOVEBOX bold text___';

                        newGloveboxNode.setAttribute("id", uuid); // attach a unique ID to the element to make it more easily adressable.

                        newTokenNode = document.createElement("glb:token");

                        newGloveboxNode.appendChild(newTokenNode);
                        newTokenNode.textContent = match3[0];
                        //let tokenNode = node.parentNode.insertBefore(newGloveboxNode, seondnewNode);

                        console.log("insert:" + newGloveboxNode);
                        console.log("insert:" + newGloveboxNode.textContent);
                        console.log("insert:" + newGloveboxNode.innerHTML);
                        console.log("before:" + seondnewNode);
                        console.log("before:" + seondnewNode.textContent);

                        let insertedNode = node.parentNode.insertBefore(newGloveboxNode, seondnewNode);

                        console.log("final result: " + node.outerHTML);
                        console.log("final result: " + node.innerHTML);

                        //console.log("final result: "+node.parentNode.outerHTML);
                        // console.log("final result: "+node.parentNode.innerHTML);


                        // add html required by the tolltip menu, on the fly
                        it = document.createElement("div");
                        it.setAttribute("id", 'tooltip_123');
                        it.setAttribute("class", 'xstooltip');
                        //  it.setAttribute("style",'visibility: hidden;position: absolute;z-index: 2;top: 0;left: 0;font: normal 8pt sans-serif;padding: 3px;border: solid 1px;');
                        //  it.setAttribute("style",'visibility: hidden;position: absolute;z-index: 2;top: 0;left: 0;font: normal 8pt sans-serif;padding: 3px;border: solid 1px;');

                        //  it.setAttribute("style",'width: 196px; height: 71…px; visibility: hidden;');
                        //           console.log("it 1: " + it);
                        //                    it.innerHTML += '<mark>App initialised.</mark>';

                        // insert into  document directly before the glovebox node
                        //   var anchor = document.getElementById(parentId);
                        //                      var parent = node.parentNode;
                        //                       console.log("whole doc 1: " + document.body.innerHTML);
                        //                        let insertedNode2 = parent.insertBefore(it, insertedNode);


                        // add eventhandler which makes cipher text visible/invisible with clicking
                        //  newGloveboxNode.addEventListener("click", function () {
                        //              console.log("click test..");
                        // });

                     

                        console.log("###### key word: " + word)
                        console.log("#############################")
                        // instruction for the user
                        if (word == ':Glovebox:[^:]*:[^:]*:') {
                        
                        } else if (word == ':GloveboxSecureKeyOfferToken:[^:]*') {
                          
                        } else if (word == ':GloveboxAcceptedSecureKeyOfferToken:[^:]*') {
                           
                        } else if (word == ':GloveboxSecureKeyTokenFromAcceptedOfferToken:[^:]*') {
                         
                        }

                        newGloveboxNode.addEventListener("mouseover", function () {
                            //              console.log("on mouse over action ...");
                            // tooltip_2
                            //	   xstooltip_show('tooltip_2', 'tooltip_2', uuid, 150, 20);
                            // xstooltip_showhtml('tooltip_2', 'tooltip_2', uuid, 150, 20);
                            xstooltip_showhtml(inner_html, uuid + '_tooltip', uuid, 150, 20);

                        });

                        newGloveboxNode.addEventListener("mouseout", function () {
                            //  console.log("on mouse out action ...");
                            // xstooltip_hide('tooltip_2');
                            // xstooltip_hide('tooltip_2' +'_temp');
                            xstooltip_hide(uuid + '_tooltip');
                        });

                        //console.log("final result: "+node.outerHTML);

                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    console.log("This match may be reduntant, check node name.");
                    console.log("parent element localname: " + node.parentElement.localName);
                    console.log("parent node name: " + node.parentNode.nodeName);
                    console.log("parent node localName: " + node.parentNode.localName);
                    console.log("parent namespace: " + node.parentNode.namespaceURI);
                    console.log("before: " + node.parentNode.innerHTML);
                    if (node.parentElement.localName == "glovebox" || node.parentElement.localName == "token" || node.parentElement.localName == "glb:token") {
                        console.log("#### DO NOTHING");
                        // do nothing

                    } else {
                        console.log("#############");
                        console.log("#### CARRY ON");
                        console.log("#############");
                        // ok, carry on. The match was at the beginning of the node. But it was not a glovebox node.
                        // var seondnewNode = node.splitText(match3.index);

                        //    console.log(seondnewNode);
                        //   console.log(seondnewNode.textContent);

                        try {
                            //   	console.log("node content before modification: " + content);
                            //    	console.log("node content before modification: " + node.textContent);
                            // copy out

                            // remove the matched string from the content
                            var modified_content = content.substr(0, match3.index) + "_MARK_" + content.substr(match3.index + match3[0].length);

                            console.log("content modified to: " + modified_content);
                            // modifiy the text content of the current node to reflect the removal of the matched pattern
                            node.textContent = modified_content;

                            console.log("node content after modification: " + node.textContent);

                            // split the text node on the positition where the match was made earlier and the where the matched (and removed) text began from.
                            var seondnewNode = node.splitText(match3.index);

                            //        console.log("after split 1: "+seondnewNode);
                            //         console.log("after split 1: "+seondnewNode.textContent);

                            //          console.log("after split 2: "+seondnewNode.previousSibling);
                            //           console.log("after split 2: "+seondnewNode.previousSibling.textContent);

                            var nextNode = seondnewNode.nextSibling;

                            console.log(seondnewNode);
                            console.log(seondnewNode.textContent);
                            //console.log(seondnewNode.textContent.substring(1, 4));

                            //console.log(nextNode);

                            console.log("regexp: " + word);

                            // assign a unique identifier to all glovebox nodes so facilitate later addressing
                            uuid = guid();

                            // Create html containing instructions to the user
                            // Differentiate the instructions based on the token in question
                            var inner_html = 'Time spent: 00:00:08<br><temp>some temporary text</temp>' +
                                'Page viewed: 4000<br>' +
                                'Location: Loopback <br>' +
                                'Browser: Mozilla – 1.9.99Operating system: Linux - i686 (x86_64)';
                            
                            if (word == ':Glovebox:[^:]*:[^:]*:') {

                                newGloveboxNode = document.createElement("Glovebox");
                                console.log("############################ 1")

                                inner_html = Glovebox_tooltipmessage;

                            } else if (word == ':GloveboxSecureKeyOfferToken:[^:]*:') {
                                newGloveboxNode = document.createElement("GloveboxSecureKeyOfferToken");
                                console.log("############################ 2")

                                inner_html = GloveboxSecureKeyOfferToken_tooltipmessage;
                                
                            } else if (word == ':GloveboxSecureKeyTokenFromAcceptedOfferToken:[^:]*:') {
                                newGloveboxNode = document.createElement("GloveboxSecureKeyTokenFromAcceptedOfferToken");
                                console.log("############################ 4")

                                inner_html = GloveboxSecureKeyTokenFromAcceptedOfferToken_tooltipmessage;
                            } else if (word == ':GloveboxSecureKeyOfferToken:[^:]*:') {
                                newGloveboxNode = document.createElement("GloveboxSecureKeyOfferToken");

                            } else if (word == ':GloveboxAcceptedSecureKeyOfferToken:[^:]*:') {
                                newGloveboxNode = document.createElement("GloveboxAcceptedSecureKeyOfferToken");
                                console.log("############################ 3")

                                inner_html = GloveboxAcceptedSecureKeyOfferToken_tooltipmessage;
                            } else if (word == ':GloveboxOpenKeyToken:[^:]*:') {
                                newGloveboxNode = document.createElement("GloveboxOpenKeyToken");

                            }


                            // newGloveboxNode.textContent = match3[0] + '___GLOVEBOX bold text___';

                            newGloveboxNode.setAttribute("id", uuid); // attach a unique ID to the element to make it more easily adressable.

                            newTokenNode = document.createElement("glb:token");

                            newGloveboxNode.appendChild(newTokenNode);
                            newTokenNode.textContent = match3[0];
                            //let tokenNode = node.parentNode.insertBefore(newGloveboxNode, seondnewNode);

                            console.log("insert:" + newGloveboxNode);
                            console.log("insert:" + newGloveboxNode.textContent);
                            console.log("insert:" + newGloveboxNode.innerHTML);
                            console.log("before:" + seondnewNode);
                            console.log("before:" + seondnewNode.textContent);

                            let insertedNode = node.parentNode.insertBefore(newGloveboxNode, seondnewNode);

                            console.log("final result: " + node.outerHTML);
                            console.log("final result: " + node.innerHTML);

                            //console.log("final result: "+node.parentNode.outerHTML);
                            // console.log("final result: "+node.parentNode.innerHTML);


                            // add html required by the tolltip menu, on the fly
                            it = document.createElement("div");
                            it.setAttribute("id", 'tooltip_123');
                            it.setAttribute("class", 'xstooltip');
                        
                            newGloveboxNode.addEventListener("mouseover", function () {
                                //              console.log("on mouse over action ...");
                                // tooltip_2
                                //	   xstooltip_show('tooltip_2', 'tooltip_2', uuid, 150, 20);
                                // xstooltip_showhtml('tooltip_2', 'tooltip_2', uuid, 150, 20);
                                xstooltip_showhtml(inner_html, uuid + '_tooltip', uuid, 150, 20);

                            });

                            newGloveboxNode.addEventListener("mouseout", function () {
                                //  console.log("on mouse out action ...");
                                // xstooltip_hide('tooltip_2');
                                // xstooltip_hide('tooltip_2' +'_temp');
                                xstooltip_hide(uuid + '_tooltip');
                            });

                            //console.log("final result: "+node.outerHTML);

                        } catch (e) {
                            console.log(e);
                        }

                    }
                    console.log("after: " + node.parentNode.innerHTML);

                }
                //
                //         console.log("match 1 found of length " + match3[1].length);
                //          console.log("match found of length " + match3[k].length);
                k++;
            }

            //content = content.replace(regex, emoji);
        }

        // Now that all the replacements are done, perform the DOM manipulation.
        //node.textContent = content;
    } else {
        //console.log("# doing " + node.nodeName);
        //console.log("enter child nodes of " + node.nodeName);
        // This node contains more than just text, call replaceText() on each
        // of its children.
        for (let i = 0; i < node.childNodes.length; i++) {
            replaceText(node.childNodes[i]);
        }
    }
}

// first check if the document contains any possible matches on the pattern.
// The scanning an rewriting of the hole document is very resource intensive and should not even be attempted unless there is a need.


// Start the recursion from the body tag.
//console.log("preliminary check on: " + document.body.innerHTML);

var glovebox_token_pattern = new RegExp(":(Glovebox|GloveboxOpenKeyToken|GloveboxAcceptedSecureKeyOfferToken|GloveboxSecureKeyOfferToken|GloveboxSecureKeyTokenFromAcceptedOfferToken):");

try {
    console.log("preliminary check on: " + glovebox_token_pattern.test(document.body.innerHTML));

    if (glovebox_token_pattern.test(document.body.innerHTML)) {
        // ok, there was a match. proceed with replacements and node inserts.
        replaceText(document.body);
    } else {
        console.log("no match");
    }

} catch (e) {
    console.log("###################################");
    console.log(e);
}
//let ts = document.createNode("test");
//ts.textContent = "sample text";
//document.body.appendChild(ts);

//console.log("whole doc final: " + document.body.innerHTML);

console.log("call mutation observer");

//Select the node that will be observed for mutations
//const targetNode = document.getElementById('some-id');
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {

    console.log('#######  a callback');

	// Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('#######  A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
            console.log('#######  The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Later, you can stop observing
//observer.disconnect();
console.log("call mutation observer 2" );


// Now monitor the DOM for additions and substitute emoji into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // This DOM change was new nodes being added. Run our substitution
                // algorithm on each newly added node.
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const newNode = mutation.addedNodes[i];
                    replaceText(newNode);
                }
            }
        });
    });
observer.observe(document.body, {
    childList: true,
    subtree: true
});