/*
 * This JS is called then user has selected some html for action (encryption....) and it needs to be collected and sent to the plugin.
 * The call is made from background.js from a "browser.tabs.executeScript" statement coupled with a "browser.tabs.sendMessage".
 * executeScript sends the JS on the tab in question and makes the js a listener on the tab,
 * and sendMessage sends a message to this JS listener and the return data is the selected html.
 *
 * The selected data (text, html with or without embeded or linked data) is compressed and base64 encoded before being returned to background.js
 *
 */

/* shorty.js - by enki - https://enkimute.github.io */
!function (t, i, e) {
    "undefined" != typeof module && module.exports ? module.exports = e() : "function" == typeof define && define.amd ? define(t, e) : i[t] = e()
}
("Shorty", this, function () {
    function t(t) {
        this.tokensize = t || 10,
        this.reset(!0)
    }
    return t.prototype.reset = function (t) {
        t === !0 && (this.nodes = [{
                    up: 0,
                    weight: 0
                }
            ], this.nyt = 0, this.nodecount = 0),
        this.data = "",
        this.curpos = 0,
        this.bitCount = 7,
        this.bitChar = 0
    },
    t.prototype.findNode = function (t) {
        for (var i = this.nodes.length - 1; i > 0; i--)
            if ("undefined" != typeof this.nodes[i].symbol && this.nodes[i].symbol == t)
                return i;
        return 0
    },
    t.prototype.addNode = function (t) {
        return this.nodecount >= 2046 ? 0 : (this.nodes[++this.nodecount] = {
                up: this.nyt,
                symbol: t,
                weight: 1
            }, this.nodes[++this.nodecount] = {
                up: this.nyt,
                weight: 0
				}, this.nodes[this.nyt].weight += 1, this.nyt = this.nodecount, this.nodes[this.nodecount - 2].up != this.nodecount - 2 && this.balanceNode(this.nodes[this.nodecount - 2].up), this.nodecount - 2)
    },
    t.prototype.swapNode = function (t, i) {
        var e = this.nodes[t].symbol,
        s = this.nodes[i].symbol,
        o = this.nodes[t].weight;
        this.nodes[t].symbol = s,
        this.nodes[i].symbol = e,
        this.nodes[t].weight = this.nodes[i].weight,
        this.nodes[i].weight = o;
        for (var h = this.nodes.length - 1; h > 0; h--)
            this.nodes[h].up == t ? this.nodes[h].up = i : this.nodes[h].up == i && (this.nodes[h].up = t)
    },
    t.prototype.balanceNode = function (t) {
        for (; ; ) {
            for (var i = t, e = this.nodes[t].weight; i > 1 && this.nodes[i - 1].weight == e; )
                i--;
            if (i != t && i != this.nodes[t].up && (this.swapNode(i, t), t = i), this.nodes[t].weight++, this.nodes[t].up == t)
                return;
            t = this.nodes[t].up
        }
    },
    t.prototype.emitNode = function (t) {
        for (var i = []; 0 != t; )
            i.unshift(t % 2), t = this.nodes[t].up;
        for (var e = 0; e < i.length; e++)
            this.emitBit(i[e])
    },
    t.prototype.emitNyt = function (t) {
        this.emitNode(this.nyt);
        var i = t.length - 1;
        this.tokensize > 8 && this.emitBit(8 & i),
        this.tokensize > 4 && this.emitBit(4 & i),
        this.tokensize > 2 && this.emitBit(2 & i),
        this.tokensize > 1 && this.emitBit(1 & i);
        for (var e = 0; e < t.length; e++)
            this.emitByte(t.charCodeAt(e));
        return this.nyt
    },
    t.prototype.readNode = function () {
        if (0 == this.nyt) {
            for (var t = (this.tokensize > 8 ? 8 * this.readBit() : 0) + (this.tokensize > 4 ? 4 * this.readBit() : 0) + (this.tokensize > 2 ? 2 * this.readBit() : 0) + (this.tokensize > 1 ? this.readBit() : 0) + 1, i = ""; t--; )
                i += this.readByte();
            return i
        }
        for (var e = 0; ; ) {
            var s = this.readBit();
            if (void 0 == this.nodes[e].symbol)
                for (var o = 0; ; o++)
                    if (this.nodes[o].up == e && o != e && o % 2 == s) {
                        e = o;
                        break
                    }
            if (void 0 != this.nodes[e].symbol || 0 == this.nodes[e].weight) {
                if (this.nodes[e].weight)
                    return this.nodes[e].symbol;
                for (var t = (this.tokensize > 8 ? 8 * this.readBit() : 0) + (this.tokensize > 4 ? 4 * this.readBit() : 0) + (this.tokensize > 2 ? 2 * this.readBit() : 0) + (this.tokensize > 1 ? this.readBit() : 0) + 1, i = ""; t--; )
                    i += this.readByte();
                return i
            }
        }
    },
    t.prototype.emitBit = function (t) {
        t && (this.bitChar += 1 << this.bitCount),
        --this.bitCount < 0 && (this.data += String.fromCharCode(this.bitChar), this.bitCount = 7, this.bitChar = 0)
    },
    t.prototype.emitByte = function (t) {
        for (var i = 7; i >= 0; i--)
            this.emitBit(t >> i & 1)
    },
    t.prototype.readBit = function () {
        if (this.curpos == 8 * this.data.length)
            throw "done";
        var t = this.data.charCodeAt(this.curpos >> 3) >> (7 - this.curpos & 7) & 1;
        return this.curpos++,
        t
    },
    t.prototype.readByte = function () {
        res = 0;
        for (var t = 0; 8 > t; t++)
            res += (128 >> t) * this.readBit();
        return String.fromCharCode(res)
    },
    t.prototype.deflate = function (t) {
        var i,
        e,
        s,
        o = t.length;
        for (this.reset(), e = 0; o > e; e++) {
            if (i = t[e], this.tokensize > 1)
                if (/[a-zA-Z]/.test(i))
                    for (; o > e + 1 && i.length < this.tokensize && /[a-zA-Z]/.test(t[e + 1]); )
                        i += t[++e];
                else if (/[=\[\],\.:\"'\{\}]/.test(i))
                    for (; o > e + 1 && i.length < this.tokensize && /[=\[\],\.:\"'\{\}]/.test(t[e + 1]); )
                        e++, i += t[e];
            s = this.findNode(i),
            s ? (this.emitNode(s), this.balanceNode(s)) : (this.emitNyt(i), s = this.addNode(i))
        }
        if (7 != this.bitCount) {
            var h = this.data.length;
            this.emitNode(this.nyt),
            h == this.data.length && this.emitByte(0)
        }
        return this.data
    },
    t.prototype.inflate = function (t) {
        this.reset(),
        this.data = t;
        var i = "";
        try {
            for (var e = 0; e >= 0; e++) {
                var s = this.readNode();
                i += s;
                var o = this.findNode(s);
                o ? this.balanceNode(o) : this.addNode(s)
            }
        } catch (h) {}
        return i
    },
    t
});

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getURLRoot() {
    // get the root of the URL for the page, suitable to have a relative URI appended

    // the URL must end in a "/" (slash)

    var stub = "";
    // remove all lagging characters that are not a slash
    stub = window.location.href.replace(/[^\/]*$/g, "");
    return stub;

}

function haveChildnodes(node) {
    if (node.childNodes.length > 0) {
        return true;
    } else {
        return false;
    }
}

function getAllDescendants(node) {
    console.log("getAllDescendants");

    var all = [];
    var content_string = "";
    getDescendants(node);

    function getDescendants(node) {
        console.log("-------------------getDescendants");
        console.log(haveChildnodes(node));
        console.log(node.hasChildNodes());

        if (node) {
            if (node.hasChildNodes()) {
                console.log("NOT appending: " + node.toString());
                console.log("NOT appending: " + node.nodeName);
            } else {
                console.log("appending: " + node.textContent);
            }
        }
        for (var i = 0; i < node.childNodes.length; i++) {
            console.log("++++++++++++++examining");
            console.log(node.childNodes[i]);
            var child = node.childNodes[i];
            console.log(child);
            console.log(child.nodeName);
            console.log(haveChildnodes(child));
            console.log(child.hasChildNodes());
            if (haveChildnodes(node)) {

                console.log("NOT appending: " + child.toString());
            } else {
                console.log("appending: " + child.toString());
            }
            getDescendants(child);
            all.push(child);

        }
    }
    console.log(content_string);
    console.log(all);
    return all;
}

function allDescendants(node) {
    for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        allDescendants(child);
        console.log(child);
    }
}

function getURLrelative(uri) {
    // a relative URL should not shat with either the protocol (http etc.), a drive letter, or a slash ( / )

    var rel = "";
    // remove all lagging characters that are not a slash
    rel = uri.replace(/^[\/]*/, "");
    return rel;

}

function isRelativeURI(uri) {
    // determine if the URL is absolute or relative

    var re_file = new RegExp("^(http|https|file):/i");
    if (re_file.test(uri)) {
        return false;

    } else {
        return true;
    }

}
function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    const buffer = new ArrayBuffer(8);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function base64EncodeUnicode(str) {
    // Firstly, escape the string using encodeURIComponent to get the UTF-8 encoding of the characters,
    // Secondly, we convert the percent encodings into raw bytes, and add it to btoa() function.
    utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
            return String.fromCharCode('0x' + p1);
        });

    return btoa(utf8Bytes);
}

function stringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function arrayBufferToString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function packUpContent(raw_data) {
    // compress and base64 the selected data to reduce the space requirements
    // base64 encode the information to make it safe.


    return raw_data;

    // if content is shorter than 500 bytes, use shortify
    // if longer, use...

    try {

        console.log("compact: " + raw_data);
        //	   console.log('background.js:0: source text length: ' + selection_html.length);
        var shorty_out = new Shorty();
        var compressed_plaintext = shorty_out.deflate(raw_data);

        console.log("compact: " + base64EncodeUnicode(raw_data));

        console.log("compacted: " + compressed_plaintext);
        console.log("compacted: " + base64EncodeUnicode(compressed_plaintext));

        console.log("compacted: " + arrayBufferToString(compressed_plaintext));

        console.log("compacted: " + _arrayBufferToBase64(compressed_plaintext));

        console.log("compacted: " + stringToArrayBuffer(compressed_plaintext));

        console.log("compacted: " + _arrayBufferToBase64(stringToArrayBuffer(compressed_plaintext)));

        var shorty_verify = new Shorty();
        console.log(shorty_verify.inflate(raw_data));

        // shorty is suitable for compacting strings that are not very long


        return compressed_plaintext;

        // return a base64 encoded string
    } catch (e) {
        console.log(e);
    }

}

//Load blob (promise)
// get content of URL and place it inside the src attribute
function BACKUPinsertBlob(url, j, node) {
    console.log("##### loadBlob.start: " + url + "  #" + j + " node: ");
    console.log(node);
    var p = new Promise((resolve, reject) => {
            console.log(resolve);
            console.log(reject);
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = () => resolve(xhr.response);
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send();
            console.log("sent");

        });
    return p;

}

function getBlob(url, j, node) {
    console.log("##### loadBlob.start: " + url + "  #" + j + " node: ");
    console.log(node);
    var p = new Promise((resolve, reject) => {
            console.log(resolve);
            console.log(reject);
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function () {
                //resolve(xhr.response);
                var reader = new FileReader();
                reader.readAsDataURL(xhr.response);
                reader.onload = function (e) {
                    //      console.log('DataURL:', e.target.result);
                    resolve(e.target.result);
                    //file_base64_ed = e.target.result.replace(/^([^,]*),/, '');
                };
            };

            xhr.onerror = () => reject(xhr.statusText);
            xhr.send();
            console.log("sent");

        });
    return p;

}

function insertBlob(url, j, node) {
    console.log("##### loadBlob.start: " + url + "  #" + j + " node: ");
    console.log(node);
    var p = new Promise((resolve, reject) => {
            console.log(resolve);
            console.log(reject);
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            //   xhr.onload = () => resolve(xhr.response);

            xhr.onload = function () {
                //resolve(xhr.response);
                var reader = new FileReader();
                reader.readAsDataURL(xhr.response);
                reader.onload = function (e) {
                    //        console.log('DataURL:', e.target.result);
                    resolve(e.target.result);
                    //file_base64_ed = e.target.result.replace(/^([^,]*),/, '');
                };
            };

            xhr.onerror = () => reject(xhr.statusText);
            xhr.send();
            console.log("sent");

        });
    return p.then(function (res) {
        console.log("############### 2.2.3");
        console.log(res);
        console.log(node);
        node.setAttribute('test5', 'value51');
        // data was retrieved. Now insert it into the right place in the DOM
        node.setAttribute('src5', res);
        console.log(node);
        //    	elem.setAttribute('test5', 'value51');
        var s = new Promise((resolve, reject) => {
                console.log(resolve);
            });
        return s;

    });
}

function loadBlob(j, node) {
    console.log("##### insertdBlob.start: " + "  #" + j + " node: ");
    console.log(node);
    return new Promise(function (resolve, reject) {
        console.log(resolve);
        console.log(reject);
        console.log("set");
        const n = node;
        console.log(n);
        n.setAttribute('test2', 'value2');

    });
}

//Create image from blob (createObjectURL)
function imageFromBlob(blob) {
    const img = new Image();
    img.onload = () => URL.revokeObjectURL(img.src);
    img.src = URL.createObjectURL(blob);
    return img;
}

function getContent(url) {
    var file_base64_ed = "";
    var request = new XMLHttpRequest();
    //request.open('GET', "file:///C:/glovebox-dev/test_pages/1.html", true);
    request.open('GET', url, true);
    request.responseType = 'blob';
    request.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function (e) {
            console.log('DataURL:', e.target.result);
            file_base64_ed = e.target.result.replace(/^([^,]*),/, '');
        };
    };
    request.send();
    return file_base64_ed;
}

function getSelHtm(request, sender, sendResponse) {
    console.log("request selected JSON(request): " + JSON.stringify(request));
    console.log("request selected JSON(sender): " + JSON.stringify(sender));
    console.log("request selected JSON(sendResponse): " + JSON.stringify(sendResponse));

    //To add: perform validation of sender

    console.log(`content script sent a message: ${request.content}`);
    setTimeout(() => {
        sendResponse({
            doc: "async response from background script"
        });
    }, 3000);
    return true;

    const sleep = function (ms) {
        console.log("ms:" + ms);
        return new Promise(function (resolve, reject) {
            console.log("ms:" + ms);
            return setTimeout(resolve, ms);
        });

    }
    // Using Sleep,
    console.log('Now');

    // sleep(3000).then(function(){
    // return Promise.resolve({
    // 	response: {"doc":"response from background script"};
    // });


    sleep(3000).then(v => {
        console.log('After three seconds');
        return Promise.resolve({
            response: {
                "doc": "modified_selection_text"
            }
        });
    });
    return true;

}

function getSelectedHTML(request, sender, sendResponse) {

    // contenttype
    // permitted values: text, html, embeded, linked

    console.log("request selected JSON(request): " + JSON.stringify(request));
    console.log("request selected JSON(sender): " + JSON.stringify(sender));
    console.log("request selected JSON(sendResponse): " + JSON.stringify(sendResponse));

//    const sleep = function (ms) {
//        console.log("ms:" + ms);
//        return new Promise(function (resolve, reject) {
//            console.log("ms:" + ms);
//            return setTimeout(resolve, ms);
//        });
//    }
    // Using Sleep,
    //   console.log('Now');
    //   sleep(3000).then(v => {
    //       console.log('After three seconds')
    //   });

    // Use the represence of the dummy value "Glbx_marker" in the request as a insecure "shared secret" to try to ensure only request from the background.js are accepted.
    // This must be improved.
    try {

        if (request.GetSelectedHTML == "Glbx_marker6") {
        	// a valid marker was included, proceed
        	

            console.log("request selected JSON(request): " + JSON.stringify(request));
            var selection_html = "";

            var contenttype = "text"; // set text-only as the default
            try {
                if (request.contenttype == "html") {
                    contenttype = "html";
                }
                if (request.contenttype == "embeded") {
                    contenttype = "embeded";
                }
                if (request.contenttype == "linked") {
                    contenttype = "linked";
                }
            } catch (e) {
                console.log(e);
            }

            console.log(request.contenttype);
            console.log(contenttype);

        	
            console.log(window.getSelection);
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection();
                console.log(sel);
                if (sel.rangeCount) {
                    var container = document.createElement("div");
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());

                        console.log("#######################");
                        var selected_range = sel.getRangeAt(i);
                        // in this range, return all nodes
                        var docFrag = selected_range.cloneContents();

                        // loop through children

                        //var a = getAllDescendants(docFrag);
                        //console.log(a);
                    }

                    if (contenttype == "text") {
                        // get the text presented by the html
                    	// this is different from using the selction presented in the info object
                    
                        // there is a problem with the innerHTML functionality. When a text node is cut into, the tag it starts with, is included in the innerhtml extract. This can lead to unanticipated effects at decryption time.

                    	var selection_text = "";
                    	selection_text = container.textContent;
                        //console.log(selection_html);

                        setTimeout(() => {
                            sendResponse({
                                response: {
                                    "doc": selection_text
                                }
                            });
                        }, 30);
                        
                    } else if (contenttype == "html") {
                        // get the html
                        // additional functionality to be added:
                        // retrieval and encoding of inline content such as files and images
                        console.log(container.innerHTML);
                        console.log(container.toString());
                        console.log(container.textContent);

                        // there is a problem with the innerHTML functionality. When a text node is cut into, the tag it starts with, is included in the innerhtml extract. This can lead to unanticipated effects at decryption time.


                        selection_html = container.innerHTML;
                        //console.log(selection_html);

                        setTimeout(() => {
                            sendResponse({
                                response: {
                                    "doc": selection_html
                                }
                            });
                        }, 3000);
                        
                    } else if (contenttype == "embeded") {
                        console.log("gather up all embeded data");
                        // gather up all data
                        // If data is placed inline , if should be included the "html" encryption above
                        // This section is for following URLs and taking in the content at the end of those URLs
                        // Rewrite the html to hold the files referenced by src attributes

                        // loop through all nodes inside the selection

                        //            let nodes = container.querySelectorAll('*');

                        //             for (let n of nodes) {
                        ////                    console.log("##");
                        //                     console.log(n);
                        //                       console.log(n.toString());
                        //       }

                        // <img alt="a picture" src="mypicture.png"/>
                        // becomes
                        // <img src="data:image/png;base64,BASE64DATA"/>

                        // search through the abstracted content of the selection
                        var j = 0;
                        let elements = container.querySelectorAll('img[src]');
                        var url_promises = [];
                        var url_nodes = [];

                        for (let elem of elements) {
                            console.log("##### - found");
                            console.log(elem);
                            console.log(elem.toString());
                            console.log(elem.getAttribute('src'));

                            elem.setAttribute('test', 'value');
                            console.log(elem);

                            var uri = "";
                            uri = elem.getAttribute('src');
                            console.log("get: " + uri);
                            // is the src URL is already embeded data

                            var re_data = new RegExp("^data:");
                            var re_file = new RegExp("^file:");
                            var re_https = new RegExp("^https:");
                            var re_http = new RegExp("^http:");
                            var file_base64_ed = "";
                            var request = new XMLHttpRequest();

                            // get the content at the end of the URI
                            // which protocol ?
                            try {

                                if (re_data.test(uri)) {
                                    // do nothing , since this is already embeded data
                                    console.log("do nothing , since this is already embeded data");
                                } else if (re_http.test(uri)) {
                                    console.log("fully qualified http url");

                                    request.open('GET', "file:///C:/glovebox-dev/test_pages/1.html", true);
                                    //request.open('GET', uri, true);
                                    request.responseType = 'blob';
                                    request.onload = function () {
                                        var reader = new FileReader();
                                        reader.readAsDataURL(request.response);
                                        reader.onload = function (e) {
                                            console.log('DataURL:', e.target.result);
                                            file_base64_ed = e.target.result.replace(/^([^,]*),/, '');
                                        };
                                    };
                                    request.send();

                                } else if (re_https.test(uri)) {
                                    console.log("fully qualified https url");
                                    console.log("use this url: " + uri);
                                    //request.open('GET', "file:///C:/glovebox-dev/test_pages/1.html", true);
                                    // request.open('GET', uri, true);
                                    // request.responseType = 'blob';

                                    // request.onload = function () {
                                    //     var reader = new FileReader();
                                    //     reader.readAsDataURL(request.response);
                                    //     reader.onload = function (e) {
                                    //        console.log('DataURL:', e.target.result);
                                    //        file_base64_ed = e.target.result.replace(/^([^,]*),/, '');
                                    //    };
                                    //};
                                    //request.send();

                                } else if (re_file.test(uri)) {
                                    console.log("Valid file url");

                                    // as default, use the one for the current page
                                    console.log(window.location.href);

                                    request.open('GET', "file:///C:/glovebox-dev/test_pages/1.html", true);
                                    //request.open('GET', uri, true);
                                    request.responseType = 'blob';

                                } else {
                                    console.log("missing protocol - read from page");
                                    var use_url = "";
                                    var protocol = "";
                                    protocol = window.location.href.replace(/^([^:]*:).*/, "$1//");
                                    console.log(getURLrelative(uri));
                                    console.log(getURLRoot());

                                    // is the uri relative ?
                                    // in which case the appropriate root must be determined from the page url
                                    console.log(isRelativeURI("image/1.png"));

                                    if (isRelativeURI(uri)) {
                                        use_url = getURLRoot() + getURLrelative(uri);
                                    } else {
                                        use_url = uri;
                                    }

                                    console.log("use this url: " + use_url);

                                    //console.log(getContent(use_url));
                                    //request.open('GET', "file:///C:/glovebox-dev/test_pages/1.html", true);
                                    request.open('GET', use_url, true);
                                    // request.overrideMimeType('text\/plain; charset=x-user-defined');
                                    request.responseType = 'blob';

                                    request.onload = function () {
                                        var reader = new FileReader();
                                        reader.readAsDataURL(request.response);
                                        reader.onload = function (e) {
                                            console.log('DataURL:', e.target.result);
                                            file_base64_ed = e.target.result.replace(/^([^,]*),/, '');
                                        };
                                    };
                                    request.send();
                                    console.log("received data: " + file_base64_ed);

                                    var request = new XMLHttpRequest();
                                    //request.open('GET', "file:///C:/glovebox-dev/test_pages/1.html", true);
                                    request.open('GET', use_url, true);
                                    // request.overrideMimeType('text\/plain; charset=x-user-defined');
                                    request.responseType = 'blob';

                                    var file_base64_ed2 = "";
                                    var request2 = new XMLHttpRequest();
                                    request2.open('GET', use_url, true);
                                    request2.responseType = 'blob';
                                    request2.onload = function () {
                                        var reader2 = new FileReader();
                                        reader2.readAsDataURL(request2.response);
                                        reader2.onload = function (e) {
                                            console.log('DataURL:', e.target.result);
                                            file_base64_ed2 = e.target.result.replace(/^([^,]*),/, '');
                                        };
                                    };
                                    request2.send();
                                    console.log("received data: " + file_base64_ed2);

                                    var oReq = new XMLHttpRequest();
                                    var byteArray;
                                    oReq.open('GET', use_url, true);
                                    oReq.responseType = 'arraybuffer';
                                    oReq.onload = function (oEvent) {
                                        var arrayBuffer = oReq.response; // Note: not oReq.responseText
                                        console.log("received data: " + arrayBuffer);
                                        if (arrayBuffer) {
                                            byteArray = new Uint8Array(arrayBuffer);
                                            console.log("received data: " + byteArray);
                                            for (var i = 0; i < byteArray.byteLength; i++) {
                                                // do something with each byte in the array
                                            }
                                        }
                                    };

                                    oReq.send(null);

                                    console.log("received data: " + byteArray);

                                }
                                // by this point, relevant parameters of the request object have been set, depending on the protocol.


                                console.log("1.2.3");

                                //   request22({
                                //       url: uri
                                //   })
                                //   .then(function (resp) {
                                //        console.log(resp);
                                //    });


                                const sleep = ms => {
                                    return new Promise(resolve => setTimeout(resolve, ms))
                                }
                                // Using Sleep
                                console.log('Now')
                                sleep(3000)
                                .then(v => {
                                    console.log('After three seconds')
                                })

                                const getOne = _ => {
                                    return sleep(1000).then(v => 1)
                                }

                                const getTwo = _ => {
                                    return sleep(1000).then(v => 2)
                                }

                                const getSix = _ => {
                                    return sleep(6000).then(v => 6)
                                }

                                const getThree = _ => {
                                    return sleep(1000).then(function () {
                                        console.log("get six");
                                        return getSix();
                                    }).then(v => 5)
                                }

                                const getImg = _ => {
                                    return getBlob(uri, j, elem).then(function (v) {
                                        //  console.log(v);
                                        console.log(elem);
                                        // insert
                                        elem.setAttribute('test4', 'value4');
                                        elem.setAttribute('src4', v);

                                        console.log(elem);
                                        return 7
                                    })
                                }

                                const test = async _ => {
                                    const one = await getOne()
                                        console.log(one)

                                        const two = await getTwo()
                                        console.log(two)
                                        const four = await getImg();

                                    const three = await getThree()
                                        console.log(three)
                                        console.log(two)
                                        console.log(two)
                                        console.log(four)

                                        console.log('Done')
                                }

                                //test()


                                j++;

                            } catch (e) {
                                console.log(e);
                            }

                            // prepare statement that retrieves
                            const getSrc = _ => {
                                return getBlob(uri, j, elem).then(function (v) {
                                    //  console.log(v);
                                    console.log(elem);
                                    // insert
                                    elem.setAttribute('test4', 'value4');
                                    elem.setAttribute('src4', v);

                                    console.log(elem);
                                    return 7
                                })
                            }
                            console.log("##### 1.1.1 ");

                            console.log(url_promises);
                            // add the URL to a queue
                            url_promises.push(getSrc);
                            console.log(url_promises);

                            // make call for each URL found
                            // iterate through all object in the array,
                            //and for each call a function with two inputs: the current array element(p) and the remainder of the array (subarray)
                            // the array entry is a promise (returned from the loadBlod function) and it is executed by calling ".then" on it.


                        }

                        //   console.log("############## 2.1.1 ");
                        //   const test2 = async _ => {
                        //   	console.log("2.1.2 ");
                        //   const fou = await url_promises[0]();
                        //   }
                        //test2();
                        console.log("############## 2.1.2 ");
                        console.log(elements);
                        console.log(container.innerHTML);
                        // this for-loop executes the promises that have been added to the array url_promises.


                        const forLoop = async _ => {
                            console.log('Start')

                            for (let index = 0; index < url_promises.length; index++) {
                                const fruit = url_promises[index]

                                    //const numFruit = await getNumFruit(fruit)
                                    console.log("############## 2.1.4 ");
                                const numFruit = await fruit();

                                console.log("############## 2.1.5 ");
                                console.log(container.innerHTML);
                                console.log(numFruit)
                            }

                            console.log('End')

                        }
                        console.log("############## 2.1.3 ");
                        forLoop().then(function () {
                            console.log("promises forloop completed");

                            // return at this point.

                            selection_html = container.innerHTML;
                            var compacted_data = packUpContent(selection_html);
                            //  console.log("return: " + compacted_data);
                            console.log("return size selected: " + selection_html.length);
                            console.log("return size compacted: " + compacted_data.length);

                            // return calls in a final "then"
                            setTimeout(() => {
                                sendResponse({
                                    response: {
                                        "doc": compacted_data
                                    }
                                });
                            }, 3000);

                            //    resolve({
                            //        sendResponse: {
                            //           "doc": selection_html
                            //       }
                            //   });


                        });

                        console.log("############## 2.1.6 ");

                        console.log(elements);
                        console.log(container.innerHTML);
                        // At the decrypt time, the content can't be returned to those URLs(obviously) but will rather be placed inline.

                        selection_html = container.innerHTML;
                        console.log("selection_html(modified): " + selection_html);

                    } else if (contenttype == "linked") {
                    	// Do everything same as in embedded but also 
                        // gather up all linked content
                        // // follow href-liks and place the content in


                        // This section is for following URLs and taking in the content at the end of those URLs


                        // At the decrypt time, the content can't be returned to those URLs(obviously) but will rather be placed inline.

                    } else {
                        // just get the displayed text
                        //selection_html = window.getSelection();

                        selection_html = container.textContent;
                    }

                    console.log("1.2.2");
                }
            } else if (typeof document.selection != "undefined") {
                if (document.selection.type == "Text") {
                    selection_html = document.selection.createRange().htmlText;
                }
            }

            // remove the listener created initially
            try {
                console.log("remove listener");
                browser.runtime.onMessage.removeListener(getSelectedHTML);
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log("invalid request");
            //reject("invalid request");
            return false;
        }

    } catch (e) {
        console.log(e);
    }
    return true;

}

browser.runtime.onMessage.addListener(getSelectedHTML);
//browser.runtime.onMessage.addListener(getSelHtm);
