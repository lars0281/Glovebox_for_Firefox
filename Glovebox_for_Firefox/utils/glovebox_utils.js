export {arrayBufferToBase64, arrayBufferToString,stringToArrayBuffer,convertArrayBufferViewtoString,convertStringToArrayBufferView,download_file , SHA1, base64ToArrayBuffer, createTable, createTableRow , writeTableHeaderRow, writeTableRow, sortColumn, SortTable, CompareRowOfText, CompareRowOfNumbers, GetDateSortingKey, writeTableNode, writeTableCell, TableLastSortedColumn, reflow  , READ_DB};





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


/* v 1.0.0
 * Standard "toolkit" across all Glovebox's add-ons
 */

var TableLastSortedColumn = -1;


// pass in a JSON with a descrition columns
// return

function createTable(data, table_conf, row_conf, column_conf) {
  // console.debug("# createTable" );
	// console.debug("data: " + JSON.stringify(data));
 // console.debug("table_conf: " + JSON.stringify(table_conf));
 // console.debug("row_conf: " + JSON.stringify(row_conf));
 // console.debug("column_conf: " + JSON.stringify(column_conf));
	
    var table_obj = null;

    try {
        table_obj = document.createElement("table");
        
        if (table_conf.hasOwnProperty('class')) {
        	 table_obj.setAttribute("class", table_conf.class);
        }
       // table_obj.setAttribute("width", "100%");

        // loop though data to create one row for each
        var i = 0;
        while(i < data.length  && i < 5){

            var tr_i = createTableRow(data[i], row_conf, column_conf);

            table_obj.appendChild(tr_i);
        	i++;
        }

    } catch (e) {
        console.debug(e)
    }

    return table_obj;
}


function createTableRow(data, row_conf, column_conf) {
// console.debug("# createTableRow start" );
	// console.debug("data: " + JSON.stringify(data));
  // console.debug("row_conf: " + JSON.stringify(row_conf));
 // console.debug("column_conf: " + JSON.stringify(column_conf));
	
     
    var row_obj = null;

    try {
    	row_obj = document.createElement("tr");

        
        if (row_conf.hasOwnProperty('class')) {
        	 row_obj.setAttribute("class", row_conf.class);
        }
        
   
     // table_obj.setAttribute("id", table_id);

        // loop though column conf to create one column for each
        var i = 0;
        var column_count = column_conf.length;
       // console.debug("column_count: " + column_count);
        while(i < column_count  && i < 5){

            var tr_i = writeTableCell(data, column_conf[i]);

            row_obj.appendChild(tr_i);
        	i++;
        }
        
    } catch (e) {
        console.debug(e)
    }

    return row_obj;

}




// ensure fixed header row in scrollable table
// http://www.imaputz.com/cssStuff/bigFourVersion.html

// return table row (header) object
function writeTableHeaderRow(row_conf, table_id) {
    // console.debug("## writeTableHeaderRow");
    // console.debug(row_conf);

    // <thead><tr> </tr></thead>

    var tr = null;

    try {

        // t_head.setAttribute("style", "position: absolute; color: #000");

        tr = document.createElement("tr");
        // tr.setAttribute("style", "display: block; position: relative; color:
        // #000");
        tr.setAttribute("class", "normalRow");

        for (var i = 0; i < row_conf.length; i++) {
            var obj = row_conf[i];
            // create a column for each

            // console.debug(JSON.stringify(obj));
            // console.debug("create column header ");

            var i_col = document.createElement("th");

            i_col.setAttribute("col_num", i);
            // i_col.setAttribute("style", "background: #C96; text-align: left;
            // border-top: 1px; padding: 4px" );

            // create clickable link
            var a_ref = document.createElement("a");
            // set data type here
            // T for text
            // D for dates
            // N for numbers
            // a_ref.setAttribute("href", "javascript:SortTable("+i+",'T'," +
            // table_id +");");
            // i_col.innerHTML = obj.text;
            i_col.appendChild(document.createTextNode(obj.text));


            // create event listener to trigger sorting on the column
            i_col.addEventListener('click', function (event) {
                // SortTable(i, 'T', table_id);
                sortColumn(event);
            })
            i_col.appendChild(a_ref);
            tr.appendChild(i_col);

        }
    } catch (e) {
        console.debug(e)
    }

    return tr;

}

function sortColumn(event) {

    console.debug(event);

    console.debug(event.target);
    console.debug(event.target.th);
    var node = event.target;
    // get the number of the column

    var col_num = event.target.getAttribute('col_num');
    console.debug("col_num: " + col_num);
    // get the type of sort (text etc.)
    var sort_type = "T";
    console.debug("sort_type: " + sort_type);

    // get the direction of sort

    // id of table
    var table_id = event.target.parentNode.parentNode.parentNode.getAttribute('id');

    console.debug(event.target.parentNode);
    console.debug(event.target.parentNode.parentNode);
    console.debug(event.target.parentNode.parentNode.parentNode);
    console.debug(event.target.parentNode.parentNode.parentNode.getAttribute('id'));

    console.debug("table_id: " + table_id);

    SortTable(col_num, sort_type, table_id);
    // trigger redraw/reflow
    // document.getElementsByTagName('body')[0].focus();

    console.debug("table_id: " + table_id);
    console.debug(document.getElementById(table_id));
    reflow(document.getElementById(table_id));

}


function SortTable() {
    var sortColumn = parseInt(arguments[0]);
    var type = arguments.length > 1 ? arguments[1] : 'T';
    var TableIDvalue = arguments.length > 2 ? arguments[2] : '';
    var dateformat = arguments.length > 3 ? arguments[3] : '';

    var table = document.getElementById(TableIDvalue);

    // console.debug(sortColumn);
    // console.debug(type);
    // console.debug(TableIDvalue);
    // console.debug(table);

    var tbody = table.getElementsByTagName("tbody")[0];
    // get the principal rows in the table
    // var rows = tbody.getElementsByTagName("tr");
    
    var rows = tbody.querySelectorAll('tr.normalRow');
    var arrayOfRows = new Array();
    type = type.toUpperCase();
    dateformat = dateformat.toLowerCase();
    for (var i = 0, len = rows.length; i < len; i++) {
        arrayOfRows[i] = new Object;
        arrayOfRows[i].oldIndex = i;
        // console.debug(rows);
        // console.debug(rows[i]);
        // console.debug(rows[i].getElementsByTagName("td"));
        // console.debug(sortColumn);
        // console.debug(rows[i].getElementsByTagName("td")[sortColumn]);
        var celltext = rows[i].getElementsByTagName("td")[sortColumn].innerHTML.replace(/<[^>]*>/g, "");
        if (type == 'D') {
            arrayOfRows[i].value = GetDateSortingKey(dateformat, celltext);
        } else {
            var re = type == "N" ? /[^\.\-\+\d]/g : /[^a-zA-Z0-9]/g;
            console.debug(celltext.replace(re, "").substr(0, 25).toLowerCase());
            arrayOfRows[i].value = celltext.replace(re, "").substr(0, 25).toLowerCase();
        }
    }
    if (sortColumn == TableLastSortedColumn) {
        arrayOfRows.reverse();
    } else {
        TableLastSortedColumn = sortColumn;
        switch (type) {
        case "N":
            arrayOfRows.sort(CompareRowOfNumbers);
            break;
        case "D":
            arrayOfRows.sort(CompareRowOfNumbers);
            break;
        default:
            arrayOfRows.sort(CompareRowOfText);
        }
    }
    var newTableBody = document.createElement("tbody");
    newTableBody.setAttribute("class", "scrollContent");
    for (var i = 0, len = arrayOfRows.length; i < len; i++) {
        newTableBody.appendChild(rows[arrayOfRows[i].oldIndex].cloneNode(true));
    }

    var one = tbody.parentNode.replaceChild(newTableBody, tbody);

    reflow(one);

} // function SortTable()

function CompareRowOfText(a, b) {
    var aval = a.value;
    var bval = b.value;
    return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfText()

 function CompareRowOfNumbers(a, b) {
    var aval = /\d/.test(a.value) ? parseFloat(a.value) : 0;
    var bval = /\d/.test(b.value) ? parseFloat(b.value) : 0;
    return (aval == bval ? 0 : (aval > bval ? 1 : -1));
} // function CompareRowOfNumbers()

 function GetDateSortingKey(format, text) {
    if (format.length < 1) {
        return "";
    }
    format = format.toLowerCase();
    text = text.toLowerCase();
    text = text.replace(/^[^a-z0-9]*/, "");
    text = text.replace(/[^a-z0-9]*$/, "");
    if (text.length < 1) {
        return "";
    }
    text = text.replace(/[^a-z0-9]+/g, ",");
    var date = text.split(",");
    if (date.length < 3) {
        return "";
    }
    var d = 0,
    m = 0,
    y = 0;
    for (var i = 0; i < 3; i++) {
        var ts = format.substr(i, 1);
        if (ts == "d") {
            d = date[i];
        } else if (ts == "m") {
            m = date[i];
        } else if (ts == "y") {
            y = date[i];
        }
    }
    d = d.replace(/^0/, "");
    if (d < 10) {
        d = "0" + d;
    }
    if (/[a-z]/.test(m)) {
        m = m.substr(0, 3);
        switch (m) {
        case "jan":
            m = String(1);
            break;
        case "feb":
            m = String(2);
            break;
        case "mar":
            m = String(3);
            break;
        case "apr":
            m = String(4);
            break;
        case "may":
            m = String(5);
            break;
        case "jun":
            m = String(6);
            break;
        case "jul":
            m = String(7);
            break;
        case "aug":
            m = String(8);
            break;
        case "sep":
            m = String(9);
            break;
        case "oct":
            m = String(10);
            break;
        case "nov":
            m = String(11);
            break;
        case "dec":
            m = String(12);
            break;
        default:
            m = String(0);
        }
    }
    m = m.replace(/^0/, "");
    if (m < 10) {
        m = "0" + m;
    }
    y = parseInt(y);
    if (y < 100) {
        y = parseInt(y) + 2000;
    }
    return "" + String(y) + "" + String(m) + "" + String(d) + "";
} // function GetDateSortingKey()


// return td object
function writeTableCell(data, cell_conf) {
    // console.debug("### writeTableCell ");
    // console.debug("data: " + JSON.stringify(data));
    // console.debug("cell_conf: " + JSON.stringify(cell_conf));

     var cell = null;
     try {
    	 
    	 cell = document.createElement("td");
    	 if (cell_conf.hasOwnProperty('class')) {
             cell.setAttribute("class", cell_conf['class']);
         }
    	 
    	 var json_path = "";
    	 if (cell_conf.hasOwnProperty('json_path')) {
    		 json_path = cell_conf['json_path'];
    		 
    		 cell.appendChild(document.createTextNode(data[json_path]));
         }
    // console.debug("json_path: " +json_path );
    // console.debug("data: " +data[json_path] );
    	 
    	 
     } catch (e) {
         console.debug(e)
     }
     return cell;
}


function writeTableNode(rule, node_conf, type, key) {
    // console.debug("### writeTableNode ");
    // console.debug("rule " + JSON.stringify(rule));
    // console.debug(rule);

    var node = null;
    var n = node_conf;
    try {
        // console.debug("node definition " + JSON.stringify(node_conf));

        node = document.createElement(node_conf.name);

        // node configuration has sub nodes ?
        if (node_conf.hasOwnProperty('subnodes')) {

            // console.debug("###### has sub nodes ");

            // console.debug("###### has sub nodes " +
            // JSON.stringify(n.subnodes));
            // console.debug("###### has sub nodes " + n.subnodes.length);

            for (var i = 0; i < node_conf.subnodes.length; i++) {
                // var obj = node_conf.subnodes[i];
                // console.debug("###### has sub nodes " + JSON.stringify(obj));
                node.appendChild(writeTableNode(rule, node_conf.subnodes[i], type, key));
            }
        }

        if (node_conf.hasOwnProperty('class')) {
            node.setAttribute("class", node_conf['class']);
        }
        if (node_conf.hasOwnProperty('text')) {
            // node.appendChild(document.createTextNode(node_conf.text.substring(1)));
            node.appendChild(document.createTextNode(node_conf.text));

            // node.appendChild(document.createTextNode("HHHH"));
        }
        if (node_conf.hasOwnProperty('EventListener')) {

            var func = node_conf.EventListener.func;

            // console.debug("node hadeleteObjects event listener function:" +
            // func);

            // depending on the parameter set for which function to call

            switch (func) {
            case "deleteObject":
                // console.debug("####node has event listener
                // deleteDecryptionKey:" +
                // func);
                node.addEventListener('click', function () {
                    deleteObject(rule.keyId, type, key)
                })
                break;
            case "updateObject":
                // console.debug("####node has event listener
                // updateEncryptionKey:" +
                // func);
                node.addEventListener('click', function (event) {
                    console.debug(event);
                    updateObject(rule.keyId, type, key, rule)
                })
                break;
            case "exportPrivateKey":
                // console.debug("####node has event listener exportPrivateKey:" +
                // func);
                node.addEventListener('click', function () {
                    exportPrivateKey(rule.keyId)
                })
                break;
            }
        }
    } catch (e) {
        console.debug(e)
    }
    return node;

}



// return tr object
function writeTableRow(rule, column_conf, type, key) {
    // console.debug("## writeTableRow");
    // console.debug("rule " + JSON.stringify(rule));
    // console.debug("column_conf " + JSON.stringify(column_conf));
    // console.debug("key " + JSON.stringify(key));
    // console.debug("type " + JSON.stringify(type));

     const tr = document.createElement("tr");
     try {
        // look through the column definions to what goes into the fields in a
        // table
        // row
        for (var i = 0; i < column_conf.length; i++) {
            var obj = column_conf[i];

            var i_col = document.createElement("td");

            // present according to the specification in the "format"-field in
            // the column configuration
            var presentation_format = "text";
            if (obj.hasOwnProperty('presentation_format')) {
                presentation_format = obj.presentation_format;
            }

            if (obj.hasOwnProperty('json_path')) {
            	// use value json_path to lookup the data structure
            	
            	var cell_data = rule[obj.json_path];
            	
                // use json_path as path to look for value in JSON datastructure
            // console.debug("json_path: " + obj.json_path);

                // console.debug(url[obj.attribute]);
              // console.debug(obj.attribute);
                if (presentation_format == "JSON") {
// i_col.innerHTML = JSON.stringify(cell_data);
                    i_col.appendChild(document.createTextNode(JSON.stringify(cell_data)));
                } else if (presentation_format == "table") {
                    // render a table inside the cell based on the detailed
                    // specifications contained in the "cell_table_column_conf"
                    // is not was specified, forget it.
                    if (obj.hasOwnProperty('cell_table_conf')) {
                        var cell_table_conf = obj.cell_table_conf;
    // console.debug("### cell_table_conf");
  // console.debug("table config" + JSON.stringify(cell_table_conf));

                     // console.debug("table data" +
						// JSON.stringify(rule[obj.json_path]));
                        var cell_table = document.createElement("table");
                        cell_table.setAttribute('class', cell_table_conf.table_conf.class);


                        
                      // console.debug("cell_table1: ");
                      // console.debug(cell_table);

                     // console.debug("##############################");
                    // console.debug("row data: " +
					// JSON.stringify(rule[obj.json_path]));
                    // console.debug(JSON.stringify(rule[obj.json_path].length));

                        // loop through all data objects that need a separate
                        // row in the cell-level
                        // table
                        var cell_table_row_count = cell_data.length;
                        
                   // console.debug("cell_table_row_count: " +
					// cell_table_row_count);
                        // set a maximum of row permitted in a table embedded
						// inside a cell
                        var max_cell_table_rows = 8;
                        var k = 0;
                        while (k < cell_table_row_count && k < max_cell_table_rows) {
                        	var cell_data_row = cell_data[k];
                        // console.debug("cell_data_row: " +
						// JSON.stringify(cell_data_row));
                            var cell_table_row = document.createElement("tr");
                            cell_table_row.setAttribute('class', cell_table_conf.row_conf.class);
              
                            // loop through all cells configure for this row

                            var cell_table_row_cell_count = cell_table_conf.column_conf.length;


                            // iterate over the number of configured columns
							// (max 5)
                            var max_cell_table_cells = 5;
                            var m = 0;
                            while (m < cell_table_row_cell_count && m < max_cell_table_cells) {
                            	var cell_table_column_conf = cell_table_conf.column_conf[m];
                                var cell_table_cell = document.createElement("td");
                                // console.debug(cell_table_conf.column_conf[i].class);
                                cell_table_cell.setAttribute('class', cell_table_column_conf.class);
                                try {
                                var cell_data_path = cell_table_column_conf.json_path;
                         // console.debug("path to cell data: " +
							// cell_data_path);
                        // console.debug("path to cell config data: " +
						// JSON.stringify(cell_table_conf.column_conf[m]));

                              var presentation_format = cell_table_column_conf.presentation_format;
								// cell_table_conf.column_conf[m].presentation_format;
                           // console.debug("presentation_format: " +
							// presentation_format);

                              // depending on the presentaiont format take
								// configurable action here
                              if (presentation_format == "table"){
                            	  // create a small table to contain the list

                            	  var list_table = createTable( cell_data_row[cell_data_path], cell_table_column_conf.cell_table_conf.table_conf, cell_table_column_conf.cell_table_conf.row_conf, cell_table_column_conf.cell_table_conf.column_conf);
	// console.debug(list_table);
                            	  cell_table_cell.appendChild(list_table);
    
                              }else{
                            	  // present the data as text
                               
                     // console.debug("cell data: " +
						// JSON.stringify(rule[obj.json_path][k][cell_data_path]));
                                    var newContent = document.createTextNode(cell_data_row[cell_data_path]);
                                    cell_table_cell.appendChild(newContent);
                              }
                                } catch (e) {
                                	console.error(e);
                                }
                                cell_table_row.appendChild(cell_table_cell);
                                m++
                            }

                            // add row to table
                            cell_table.appendChild(cell_table_row);
                            k++;
                        }

                         i_col.appendChild(cell_table);

                    } else {
                        console.error("cell_table_column_conf attribute missing");
                    }
                } else if (presentation_format == "dropdown") {
                    // render a dropdown list

                } else {
                	  i_col.appendChild(document.createTextNode(rule[obj.json_path]));
                    // i_col.innerHTML = rule[obj.json_path];
                }
            } else if (obj.hasOwnProperty('node')) {

                // var n = obj.node;
                // console.debug("node definition " + JSON.stringify(obj.node));

                var node = writeTableNode(rule, obj.node, type, key);

                // any eventlisteners defined ?

                i_col.appendChild(node);

            }
            tr.setAttribute("class", "normalRow");
            tr.appendChild(i_col);
        }
    } catch (e) {
        console.error(e)
    }

    return tr;
}

function reflow(elt) {
    void elt.offsetWidth;
    console.debug(elt.offsetHeight);
}




function READ_DB(db, dbName3, storeName3) {

    return new Promise((resolve, reject) => {

        try {
            var one;

            console.debug("reading db:" + db + " dbname:" + dbName3 + " storeName:" + storeName3);
            var dbRequest = indexedDB.open(db);

            dbRequest.onerror = function () {
                console.debug("Error", dbRequest.error);
                console.error("Error", dbRequest.error);
            };
            dbRequest.onupgradeneeded = function () {
                console.debug("onupgradeneeded ");
                console.error("onupgradeneeded ");
            };

            dbRequest.onsuccess = function (event3) {
                console.debug("one " + one);
                console.debug("db:" + db + " dbname:" + dbName3 + " storeName:" + storeName3);
                var database3 = event3.target.result;
                console.debug("2");
                // open database on read-only mode
                var transaction3 = database3.transaction([storeName3], 'readonly');
                var objectStore3 = transaction3.objectStore(storeName3);
                console.debug("3");
                var allRecords3 = objectStore3.getAll();
                console.debug("4");
                allRecords3.onsuccess = function () {
                    const res3 = allRecords3.result;
                    // get private(and their public component) signing keys
                    database3.close();
                    one = JSON.stringify(res3);
                    console.debug("returning from database: " + one);
                    resolve(one);
                };
                database3.close();
            }

        } catch (e) {
            console.debug(e);
            reject();
        }

    });

    // return one;
}






function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    const buffer = new ArrayBuffer(8);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}


function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}



/**
 * Secure Hash Algorithm (SHA1)
 * http://www.webtoolkit.info/
 **/
function SHA1(msg) {
    console.debug("navigate-collection:SHA1");
    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };
    function lsb_hex(val) {
        var str = '';
        var i;
        var vh;
        var vl;
        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };
    function cvt_hex(val) {
        var str = '';
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var blockstart;
    var i,
    j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A,
    B,
    C,
    D,
    E;
    var temp;
    msg = Utf8Encode(msg);
    var msg_len = msg.length;
    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }
    switch (msg_len % 4) {
    case 0:
        i = 0x080000000;
        break;
    case 1:
        i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
        break;
    case 2:
        i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
        break;
    case 3:
        i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
        break;
    }
    word_array.push(i);
    while ((word_array.length % 16) != 14)
        word_array.push(0);
    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);
    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++)
            W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++)
            W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();
}



function download_file(name, contents, mime_type) {

    console.debug("download_file BEGIN");

    mime_type = mime_type || "text/plain";

    var blob = new Blob([contents], {
            type: mime_type
        });

    var dlink = document.createElement('a');
    dlink.download = name;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function (e) {
        // revokeObjectURL needs a delay to work properly
        var that = this;
        setTimeout(function () {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };

    dlink.click();
    dlink.remove();
    console.debug("download_file END");
}




function convertStringToArrayBufferView(str) {
    var bytes = new Uint8Array(str.length);
    for (var iii = 0; iii < str.length; iii++) {
        bytes[iii] = str.charCodeAt(iii);
    }

    return bytes;
}

function convertArrayBufferViewtoString(buffer) {
    var str = "";
    for (var iii = 0; iii < buffer.byteLength; iii++) {
        str += String.fromCharCode(buffer[iii]);
    }

    return str;
}

