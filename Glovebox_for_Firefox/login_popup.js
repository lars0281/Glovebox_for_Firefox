

"use strict";



let dropArea = document.getElementById('drop-area')

dropArea.addEventListener('dragenter', handlerFunction, false)
dropArea.addEventListener('dragleave', handlerFunction, false)
dropArea.addEventListener('dragover', handlerFunction, false)
dropArea.addEventListener('drop', handlerFunction, false)



function handleFiles(files) {
	console.log("### handleFiles(files) begin");

	  if (!files.length) {
	    loginFileList.innerHTML = "<p>No files selected!</p>";
	  } else {
	    var list = document.createElement("ul");
	    for (var i = 0; i < files.length; i++) {
	      var li = document.createElement("li");
	      list.appendChild(li);
	      
	      var img = document.createElement("img");
	      img.src = window.URL.createObjectURL(files[i]);
	      img.height = 60;
	      img.onload = function(e) {
	        window.URL.revokeObjectURL(this.src);
	      }
	      li.appendChild(img);
	      
	      var info = document.createElement("span");
	      info.innerHTML = files[i].name + ": " + files[i].size + " bytes";
	      li.appendChild(info);
	    }
	    loginFileList.appendChild(list);
	  }
	}




