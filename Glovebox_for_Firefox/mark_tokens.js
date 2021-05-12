
// PLACEHOLDER insert html required for context menu


console.log("2");

var matchText = function (node, regex, callback, excludeElements) {
   // console.log("3");

    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'canvas']);
    var child = node.firstChild;
    while (child) {
        switch (child.nodeType) {
        case 1:
            if (excludeElements.indexOf(child.tagName.toLowerCase()) > -1)
                break;
            //		child.addEventListener("click", submitScanTabs);
            matchText(child, regex, callback, excludeElements);
            break;
        case 3:
            var bk = 0;
            // check if there is any textdata in the node
            if (child.data && child.data != "") {
              //  console.log("processing textnode content: \"" + child.data + "\"");

                child.data.replace(regex, function (all) {
                    var args = [].slice.call(arguments),
                    offset = args[args.length - 2],
                    newTextNode = child.splitText(offset + bk),
                    tag;
                    bk -= child.data.length + all.length;

                    newTextNode.data = "AA_AA_AA" + newTextNode.data.substr(all.length);
                    tag = callback.apply(window, [child].concat(args));
                    child.parentNode.insertBefore(tag, newTextNode);
                    child = newTextNode;
                });
            } else {
             //   console.log("no text data");
            }
            regex.lastIndex = 0;
            break;
        }
        //child.addEventListener("click", function(a){console.log("test")});
        child = child.nextSibling;
    }

    return node;
};

// step through each possible Glovebox token name that should be highlighted

matchText(document.getElementsByTagName("html")[0], new RegExp(":GloveboxSecureKeyOfferToken:", "g"), function (node, match, offset) {
    console.log("matchText:GloveboxSecureKeyOfferToken");
    var span = document.createElement("mark");
    //   span.setAttribute("class", "GloveboxSecureKeyOfferToken");
    span.className = "GloveboxSecureKeyOfferToken";
      const random_id = Math.random();
      span.setAttribute("id", random_id);

    //    span.setAttribute("class", "task");
    // consider substituting textmatch to prevent "re-entry".


// create some javascript to embed in pageX

var js = '';
// The ID of the extension we want to talk to.
//js = js + 'var editorExtensionId = "abcdefghijklmnoabcdefhijklmnoabc";\n';
js = js + 'function myFunction() {\\n';
js = js + 'console.log("test54");\\n';
js = js + '}\\n';
js = js + '// Make a simple request:';
js = js + 'chrome.runtime.sendMessage(editorExtensionId, {openUrlInEditor: url},\n';
js = js + '  function(response) {\n';
js = js + '    if (!response.success)\n';
js = js + '      handleError(url);\n';
js = js + '  });\n';
js = js + '  \n';

js =  ' function incFont() {\n';
js = js + '   document.getElementById("fontSizing").style.fontSize = "larger";\n';
js = js + '}\n';


// create a script which in turn makes the call to backgroupnd.js
       var script = document.createElement("SCRIPT");
script.setAttribute("language", "JavaScript");
      script.textContent = js;

var li = document.createElement("li");
	  li.setAttribute("contextmenu", "changeFont");
	  li.setAttribute("id", "fontSizing");
 li.setAttribute("oncontextmenu", "myChangeFont()");
	 


   //    var ahref = document.createElement("a");
      // ahref.setAttribute("href", "javascript:present_token_options("'+random_id+'");");
	//  ahref.setAttribute("href", "#");
  //       ahref.setAttribute("title", "do something");

//      ahref.setAttribute("onClick", 'myFunction();return false;');
//      ahref.setAttribute("onClick", 'console.log("test324");return false;');
    //  ahref.textContent = match;
//    span.textContent = match;
    li.textContent = match;
    //   span.appendChild(script);
      // span.appendChild(ahref);

var menu = document.createElement("menu");
	  menu.setAttribute("type", "context");
	  menu.setAttribute("id", "changeFont");



var menu2 = document.createElement("menu");
	  menu2.setAttribute("label", "Glove Token");
	 
var menuitem21 = document.createElement("menuitem");
	  menuitem21.setAttribute("label", "Decrease Font");
	  menuitem21.setAttribute("onclick", "decFont()");

var menuitem1 = document.createElement("menuitem");
	  menuitem1.setAttribute("label", "Increase Font");
//	  menuitem1.setAttribute("onclick", "alert("test");");
  menuitem1.setAttribute("onclick", "incFont()");


  menu2.appendChild(menuitem21);
  menu2.appendChild(menuitem1);


//  menu.appendChild(menuitem1);
  menu.appendChild(menu2); 


  
  span.appendChild(li);
  span.appendChild(menu);
	   
   // console.log("####### 2");
    return span;
});

matchText(document.getElementsByTagName("html")[0], new RegExp(":GloveboxAcceptedSecureKeyOfferToken:", "g"), function (node, match, offset) {
    console.log("matchText:GloveboxAcceptedSecureKeyOfferToken");
    var span = document.createElement("mark");
    //    span.setAttribute("class", "GloveboxAcceptedSecureKeyOfferToken");

    const random_id = Math.random();
    span.setAttribute("id", random_id);
    span.className = "GloveboxAcceptedSecureKeyOfferToken";

    // consider substituting textmatch to prevent "re-entry".
    span.textContent = match;
    return span;
});

matchText(document.getElementsByTagName("html")[0], new RegExp(":GloveboxSecureKeyTokenFromAcceptedOfferToken:", "g"), function (node, match, offset) {
    console.log("matchText:GloveboxSecureKeyTokenFromAcceptedOfferToken");
    var span = document.createElement("mark");
    //    span.setAttribute("class", "GloveboxSecureKeyTokenFromAcceptedOfferToken");
    span.className = "GloveboxSecureKeyTokenFromAcceptedOfferToken";

    // consider substituting textmatch to prevent "re-entry".
    span.textContent = match;
    return span;
});

matchText(document.getElementsByTagName("html")[0], new RegExp(":GloveboxOpenKeyToken:", "g"), function (node, match, offset) {
    console.log("matchText:GloveboxOpenKeyToken");
    var span = document.createElement("mark");
    span.setAttribute("class", "GloveboxOpenKeyToken");
    // consider substituting textmatch to prevent "re-entry".
    span.textContent = match;
    return span;
});

// add click event
//var ar_coins = document.getElementsByClassName('task');
//for (var xx = 0; xx < ar_coins.length; xx++) {
//    ar_coins.item(xx).addEventListener('click', noneOnceHandler, true);
//}


console.log("24");

function noneOnceHandler(e) {
    console.log("consume token" + e);

    alert('outer, none-once, default');
}

function present_token_options(id) {
    console.log("present_token_options id: " + id);

}
