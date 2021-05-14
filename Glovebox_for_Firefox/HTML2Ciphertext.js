function moveCursorToEnd(el) {
	console.debug("moveCursorToEnd");
	console.debug(el);
	if (typeof el.selectionStart == "number") {
		el.selectionStart = el.selectionEnd = el.value.length;
	} else if (typeof el.createTextRange != "undefined") {
		el.focus();
		var range = el.createTextRange();
		range.collapse(false);
		range.select();
	}
}

function isFlexbox(node) {
	// console.debug("isFlexbox");
	p = node;
	var y = 0;
	// set a maximum limit on how far to loop
	while (y < 90) {
		// console.debug(y);
		// is this even a node ?
		// console.debug(p);
		if (node) {
			// console.debug(window.getComputedStyle(p).getPropertyValue('display'));
			// check if flex
			if (window.getComputedStyle(node).getPropertyValue('display') == 'flex') {
				// got flexbox so terminate loop here, and return true
				y = 101;
				return true;
			} else {
				// ok, continue the looping
			}
		} else {
			return false;
		}
		p = node.parentNode;
		y++;
	}
	// if execution arrives at this is point, the looping has run out
	return false;
}

function html2Ciphertext(request, sender, sendResponse) {
	// document.body.textContent = "";

	// var word = request.regex;
	var replacementStr = request.html_to_ciphertext_replacement;
	console.debug("reWritePage: JSON(request): " + JSON.stringify(request));
	var contenttype = request.contenttype;
	console.debug("contenttype: " + contenttype);

	console.debug("replacement string : " + replacementStr);
	console.debug("sender: " + sender);

	// See what kind onf replacement should be done here.
	// contentype=text means a text string edit
	// All other means poking about with the nodes

	if (request.HTML2Ciphertext == "Glbx_marker2") {
	}

	var selection_html = "";

	if (replacementStr) {

		if (typeof window.getSelection != "undefined") {
			var sel = window.getSelection();
			if (sel.rangeCount) {
				var container = document.createElement("div");
				console.debug("p2," + sel.rangeCount);
				for (var i = 0, len = sel.rangeCount; i < len; ++i) {

					var range = sel.getRangeAt(i);

					if (contenttype == "text") {
						// locate where the selection begins and remove it.
						// if start node is a text node. and the cipher text to
						// this node. At the end of the text.

						// determine if the node has a style policy for display
						// (used for flexbox)

						if (range.endContainer.isSameNode(range.startContainer)) {
							console.debug("start and end node is the same node");

							if (range.startContainer.nodeType == 3) {

								// detect if this is inside a flexbox
								if (isFlexbox(range.startContainer.parentNode)) {
									// loop up the chain of parentnodes to see
									// if there is a 'display: flex' in there
									// somewhere
									// if so, use this
									console.debug("is flexbox");

									document.execCommand("insertText", false, replacementStr);
									// replace with navigator.clipboard when
									// this API is more widely supported.

								} else {

									console.debug("nodevalue.before: " + range.startContainer.nodeValue);

									let begin = range.startContainer.textContent.substring(0, range.startOffset);

									let end = range.endContainer.textContent.substring(range.endOffset);

									range.startContainer.nodeValue = begin + replacementStr + end;
									console.debug("nodevalue.after: " + range.startContainer.nodeValue);

								}

							} else {
								console.debug("p15");
							}
						} else {

							console.debug("start and end node is not the same");
						}

						// range.insertNode(document.createTextNode("####replacementStr##"+replacementStr+"#"));
						// console.debug("p3");
						// container.appendChild(sel.getRangeAt(i).cloneContents());
						// insert before

						// Create the new node to insert
						// let newNode = document.createElement("bold");
						// newNode.innerHTML = "key name";

						// console.debug("p4");

						// Get a reference to the parent node
						// let parentDiv = sel.getRangeAt(i).parentNode;
					} else {

						// if start node is a text node. and the cipher text to
						// this node. At the end of the text.
						if (range.endContainer.isSameNode(range.startContainer)) {
							console.debug("start and end node is the same node");

							if (range.startContainer.nodeType == 3) {

								console.debug("nodevalue.before: " + range.startContainer.nodeValue);

								let begin = range.startContainer.textContent.substring(0, range.startOffset);

								let end = range.endContainer.textContent.substring(range.endOffset);

								range.startContainer.nodeValue = begin + replacementStr + end;
								console.debug("nodevalue.after: " + range.startContainer.nodeValue);

							} else {
								console.debug("p5");
							}
						} else {

							console.debug("start and end node not the same");
							if (range.startContainer.nodeType == 3) {
								console.debug("The range start inside a text node. edit the text node to include the cipher text");

								// append the cipher text to the start node
								console.debug("range.startContainer.textContent: " + range.startContainer.textContent);
								console.debug("sel.getRangeAt(i).startOffset: " + range.startOffset);
								let begin = range.startContainer.textContent.substring(0, range.startOffset);

								console.debug("begin: " + begin);
								// the start node is a text node and it will be
								// modified to retein the non-selected part, and
								// have the cipher text appended.
								var begin_node = range.startContainer;
								var e = range.extractContents();
								begin_node.textContent = begin + replacementStr;
								// do not indert a new start node...
								// range.insertNode(document.createTextNode(begin
								// + "###" + replacementStr));
								// ..rewrite the existing one
								// begin_node =

								// cut back the end node
								if (range.endContainer.nodeType == 3) {
									console.debug("range.endOffset" + range.endOffset);

									console.debug("range.endContainer.textContent.length" + range.endContainer.textContent.length);

									console.debug("range.endContainer.textContent.substring( 2,5)" + range.endContainer.textContent.substring(2, 5));

									let end = range.endContainer.textContent.substring(range.endOffset);
									console.debug("sel" + end);
									// wipe the selected html, the selection may
									// have contained markup at it should be
									// removed too
									// var e =
									// sel.getRangeAt(i).extractContents();

									// range.endContainer.textContent = end;
								}

								// range.insertNode(document.createTextNode("replacementStr"));

								// var e = range.deleteContents();

								// range.insertNode(document.createTextNode(replacementStr));

								console.debug("p4");
							} else {
								console.debug("The range does not start inside a text node. insert a new node");
								// The range does not sort inside a text node.
								// append the node

							}
						}
					}
					// wipe the selected html
					// var e = sel.getRangeAt(i).extractContents();

					// insert the new Glovebox text
					// sel.getRangeAt(i).insertNode(document.createTextNode(replacementStr));

					try {
						// Copy the cipherdata just pasted into the document,
						// also into the clipboard
						// This command has security implications.
						document.execCommand('copy')
					} catch (e) {
						console.debug(e);
					}
				}
				// selection_html = container.innerHTML;
			}
		} else if (typeof document.selection != "undefined") {
			if (document.selection.type == "Text") {
				selection_html = document.selection.createRange().htmlText;
			}
		}
		console.debug("##selected html: " + selection_html);

		// replace the selected HTML

		// remove the listener created initially
		try {
			console.debug("remove listener");
			browser.runtime.onMessage.removeListener(html2Ciphertext);
		} catch (e) {
			console.debug(e);
		}

		return Promise.resolve({
			response : {
				"status" : "ok"
			}
		});

		// document.body.style.backgroundColor = "yellow";

		// var header = document.createElement('h1');
		// header.textContent = request.replacement;
		// document.body.appendChild(header);

		// start rewrite
		// replaceText(document.body, word, replacementStr);

		console.debug("eatPageReceiver: completed");
	}
}
browser.runtime.onMessage.addListener(html2Ciphertext);
