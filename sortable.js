var form   = document.theForm,
	source = form.getElementsByClassName("source")[0],
	sink   = form.getElementsByClassName("sink")[0],
	remove = form.remove,
	add    = form.add,
	down   = form.down,
	up     = form.up;
	
	
function userMsg(msg) {
	alert(msg);
}


function empty(ele) {
	var element = ele;

	while (element.hasChildNodes()) {
		element.removeChild(element.lastChild);
	}
}


function reorderSink(array, selectedIndex, upOrDown) {

	if(upOrDown == "up") {
		// Save the above selected item before splicing it out
		//	and inserting it back at its right position. 
		var savedItemAboveSelected = array[selectedIndex-1];
		
		// Return if no item above the selected item.
		if(typeof(savedItemAboveSelected) === "undefined" ) return false;
		
		array.splice(selectedIndex-1, 1);
		array.splice(selectedIndex, 0, savedItemAboveSelected);
	} else {
	    // Return if no item after the selected item.
		if(typeof(array[selectedIndex+1]) === "undefined") return false;
		
		// Save the selected item before splicing it out
		//	and inserting it back at its right position.
		var savedItemSelected    = array[selectedIndex];
		array.splice(selectedIndex, 1);
		array.splice(selectedIndex+1, 0, savedItemSelected);
	}
	
	
	return array;
}


function saveOriginalOptionsIntoArray(options, max) {
	var array = [];
	
	if(options.length < 1) return array;
	
	for (var i = 0; i < max; i++) {
		array[i] = [{"value": options[i].value, "text": options[i].text}];
	}
	
	
	return array;
}


function rebuildOptions(elem, array, max, selectedValue) {

	for(var i = 0; i < max; i++) {

		var newOption   = document.createElement("OPTION");
		newOption.value = array[i][0].value;
		newOption.text  = array[i][0].text;
		
		if(array[i][0].value == selectedValue) {
			newOption.selected = true;
		}
		
		elem.appendChild(newOption);
	}
}



function addOrRemove(addOrRemove) {
    var srcElem  = (addOrRemove == "add")? source : sink;
	var sinkElem = (addOrRemove == "add")? sink   : source;
	
	// Get the selected source element.
	var srcOptions = srcElem.options;

	// Check if an option was selected.
	var selected = srcOptions[srcElem.selectedIndex];
	
	// Return, if no item was selected.
	if(typeof(selected) === "undefined") {
		userMsg("You need to choose an item."); 
		return;
	}

	
	// Save the value and the index of the selected option.
	var selectedIndex = selected.index;
	var selectedValue = selected.value;
	var selectedText  = selected.text;
	
	
	// Get all the current sink options.
	var sinkOptions = sinkElem.options;

	
	// Save the original sink and src options into an array.
	var sinkOptionsLength = sinkOptions.length;
	
	var sinkItemsArray    = saveOriginalOptionsIntoArray(sinkOptions, sinkOptionsLength);
	
	var srcOptionsLength  = srcOptions.length;
	
	var srcItemsArray     = saveOriginalOptionsIntoArray(srcOptions, srcOptionsLength);
	
	
	// Reorder arrays.
	sinkItemsArray.push([{"value": selectedValue,"text": selectedText}]);
	
	srcItemsArray.splice(selectedIndex, 1);
	
	
	// Clear the existing select list,
	//  then rebuild it.
	empty(sinkElem);
	empty(srcElem);

	
	// Rebuild select options.
	rebuildOptions(sinkElem, sinkItemsArray, sinkOptionsLength+1, null);
	rebuildOptions(srcElem, srcItemsArray, srcOptionsLength-1, null);	
}	
	

function upOrDown(upOrDown) {

	// Get all the current sink options.
	var sinkOptions = sink.options;	

	// Check if an option was selected.
	var selected = sinkOptions[sink.selectedIndex];

	// Return, if no item was selected.
	if(typeof(selected) === "undefined")
	{
		userMsg("You need to choose an item."); 
		return;
	}
	
	// Save the value and the index of the selected option.
	var selectedIndex = selected.index;
	var selectedValue = selected.value;
	
	// Save the original sink options into an array.
	var sinkOptionsLength = sinkOptions.length;
	
	var sinkItemsArray = saveOriginalOptionsIntoArray(sinkOptions, sinkOptionsLength);
	
	// Reorder the array.
	var sinkItemsArray = reorderSink(sinkItemsArray, selectedIndex, upOrDown);
	
	// Return if the array wasn't reordered.
	if(!sinkItemsArray) return;

	// Clear the existing select list,
	//  then rebuild it.
	empty(sink);

	// Rebuild select options.
	rebuildOptions(sink, sinkItemsArray, sinkOptionsLength, selectedValue);
}


// Remove button.	
remove.addEventListener("click",function(){addOrRemove("remove");});

// Add button.
add.addEventListener("click",function(){addOrRemove("add");});

// Down button.
down.addEventListener("click",function(){upOrDown("down");});

// Up button.
up.addEventListener("click",function(){upOrDown("up");});

// Form submit.
form.addEventListener("submit", function(e){e.preventDefault();});
