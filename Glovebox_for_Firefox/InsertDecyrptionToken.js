

browser.runtime.onMessage.addListener(request => {

    var replacementStr = request.token;
    console.log("pageWriterpageWriterInsertDecyrptionToken.jsGetSelectedHTML:reWritePageGetHTMLselected JSON(request): " + JSON.stringify(request));

    var selection_html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                // insert the token text here, before this range

                sel.getRangeAt(i).insertNode(document.createTextNode(replacementStr));

                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            //         selection_html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            //       selection_html = document.selection.createRange().htmlText;

        }
    }

    return Promise.resolve({
        response: {
            "selection_html": "ok"
        }
    });

});
