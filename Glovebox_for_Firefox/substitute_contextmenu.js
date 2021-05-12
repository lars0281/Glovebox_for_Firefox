/*
 * This file is responsible for performing the logic of
 * adding a Glovebox specific context menu to all occurences of Glovebox tokens.
 */

/*global sortedTokenMap*/

console.log("####--sub");



// tokenMap.js defines the 'sortedTokenMap' variable.
// Referenced here to reduce confusion.
const tokenMap = sortedTokenMap;

/*
 * For efficiency, create a word --> search RegEx Map too.
 */
let regexs = new Map();
for (let word of tokenMap.keys()) {
    // We want a global, case-insensitive replacement.
    // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
    regexs.set(word, new RegExp(word, 'gi'));
}

/**
 * Substitutes tokens into text nodes.
 * If the node contains more than just text (ex: it has child nodes),
 * call replaceText() on each of its children.
 *
 * @param  {Node} node    - The target DOM Node.
 * @return {void}         - Note: the token substitution is done inline.
 */
function replaceText(node) {
    // Setting textContent on a node removes all of its children and replaces
    // them with a single text node. Since we don't want to alter the DOM aside
    // from substituting text, we only substitute on single text nodes.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
    if (node.nodeType === Node.TEXT_NODE) {
        // This node only contains text.
        // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType.

        console.log("--sub");
        // Skip textarea nodes due to the potential for accidental submission
        // of substituted token where none was intended.
        if (node.parentNode &&
            node.parentNode.nodeName === 'TEXTAREA') {
            return;
        }

        // Because DOM manipulation is slow, we don't want to keep setting
        // textContent after every replacement. Instead, manipulate a copy of
        // this string outside of the DOM and then perform the manipulation
        // once, at the end.
        let content = node.textContent;

        // Replace every occurrence of 'word' in 'content' with its token.
        // Use the tokenMap for replacements.
        for (let[word, token]of tokenMap) {
            // Grab the search regex for this word.
            const regex = regexs.get(word);

            // Actually do the replacement / substitution.
            // Note: if 'word' does not appear in 'content', nothing happens.
            content = content.replace(regex, token);
            console.log("replace: " + regex);
        }
        // detect token in text (if any).
        console.log("1");
        const glovebox_header_regex = new RegExp('(:GloveboxS)', 'm');
        if (glovebox_header_regex.exec(content)) {
            // commence action on this
            console.log("#content: " +  content );
            console.log("#content: contains token");

            var k = 0;
            while ((match3 = glovebox_header_regex.exec(content)) != null && k < 4) {

                console.log("#### match found at " + match3.index);
                //    console.log("match 0 found of length " + match3[0].length);
                //     console.log("match 1 found of length " + match3[1].length);
                //     console.log("match found of length " + match3[k].length);
                // optionally (based on setting in "config page"
                // insert "mark" element here.

// create element node 
// let temp = document.createElement('template');
  //html = html.trim(); // Never return a space text node as a result
  //temp.innerHTML = "html2";

const newNode = node.splitText(match3.index);

console.log("new node text content: " + newNode.textContent );

const u = document.createElement('mark');
u.appendChild(document.createTextNode(' nEW CONtent '));
// Add <u> before 'newNode'
 console.log("#insert: " +  u.textContent );
node.insertAfter(u, newNode);

                // add "event listener" changing the context menu to reflect what can be done with this token.

                console.log("4");
                node.addEventListener('click', function () {
                    console.log("cl");
                })
                node.addEventListener('contextmenu', e => {
                    e.preventDefault();
                });

//browser.contextMenus.create({
//    id: "consume-GloveboxAcceptedSecureKeyOfferToken",
//    title: "3. send key securely to recipient based on previous offer",
//    contexts: ["selection"]
			//});


                noContext = document.getElementById('noContextMenu');

                noContext.addEventListener('contextmenu', e => {
        console.log(e)
					
        e.preventDefault();
				
                });

                k++;
            }

        } else {
            console.log("content: " + content);
            console.log("content: does NOT contain token " );

        }

        // Now that all the replacements are done, perform the DOM manipulation.
        node.textContent = content;
    } else {
        // This node contains more than just text, call replaceText() on each
        // of its children.
        for (let i = 0; i < node.childNodes.length; i++) {
            replaceText(node.childNodes[i]);

        }
    }
}

// Start the recursion from the body tag.
replaceText(document.body);

// Now monitor the DOM for additions and substitute token into new nodes.
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

function contextListener() {
  document.addEventListener( "contextmenu", function(e) {
    if ( clickInsideElement( e, taskItemClassName ) ) {
      e.preventDefault();
      toggleMenuOn();
      positionMenu(e);
    } else {
      toggleMenuOff();
    }
  });
}

function positionMenu(e) {
  menuPosition = getPosition(e);
  console.log(menuPosition);
}