// load when DOM is ready 
$(document).ready(function () {
	//UL parent  
	var theList = document.getElementById('theList');
	// Flag to see if new item has not be created
	var newList = true;
	//Obj of new item 
	var newListItem;
	loadToDo();
	updateTitle();
	//On click todo 
	$('#addToDo').on('click', function (e) {
		// Avoid the form to be submited. 
		e.preventDefault();
		loadToDo();
		// check flag 
		if (newList == true) {
			var theValue = $("#toDoItem").val();
			newListItem = '<li><span class="handle"> :: </span> <input class="listItem" value="' + theValue + '"><a class="removeListItem" style="display: none;" href="#"> X </a> </li>';
			newList = false;
		} else {
			var theValue = $("#toDoItem").val();
			// duplicates the list item replaces it with the entered value. 
			newListItem = $('#theList li:last').clone();
			newListItem.find('input').attr('value', theValue);
		}

		// clear all button is hidden, unlseess there is an item in the list
		var theCount = $("#theList li").length + 1;
		if (theCount > 1) {
			$('#doClearAll').css('display', 'block');
		}
		//add child item to the parent UL
		$('#theList').append(newListItem);

		//clean up
		$('#toDoItem').val('');
		$('#toDoItem').focus();
		//sortable reset to start again. 
		$('.sortable').sortable('destroy');
		//set span handle as the sortable handle
		$('.sortable').sortable({
			handle: '.handle'
		});
		localStorage.setItem('todoListPlus', theList.innerHTML);
		
		//listen for return key 
		$('input[type="text"]').on('keydown', function (e) {
			//  multiple ternary operator; 
			var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
			//  if ? value1 : else if ? value2 : else if ? value3 : (else) value4;
			if (key == 13) {
				e.preventDefault();
				// move focus to next element
				//closest() : select first ancestor of element type
				//within its children find() 

				var inputs = $(this).closest('form').find(':input:visible');
				// The eq() method returns an element with a specific index number of the selected elements.
				inputs.eq(inputs.index(this) + 1).focus();


			}
		});

		//handle change events to list items 
		$('#theList').on('change', '.listItem', function (e) {
			//update value
			currentValue = $(this).val();
			$(this).attr('value', currentValue)
			localStorage.setItem('todoListPlus', theList.innerHTML);
		});
		//
		$('.sortable').sortable().bind('sortupdate', function () {
			localStorage.setItem('todoListPlus', theList.innerHTML);
		});

		//hover show red X
		$('#theList').on('mouseover', 'li', function () {
			var $thisA = $(this).find('a');
			$thisA.css('display', 'block');
		});
		//leave hide red X
		$('#theList').on('mouseout', 'li', function () {
			var $thisA = $(this).find('a');
			$thisA.css('display', 'none');
		});

		//Remove parent on click
		$('#theList').on('click', '.removeListItem', function (e) {
			e.preventDefault();
			$(this).parent().remove();
			localStorage.setItem('todoListPlus', theList.innerHTML);
		});

		$('#doClearAll').on('click', '#clearAll', function (e) {
			e.preventDefault();
			$('#theList').children().remove();
			newList = true;
			$('#toDoItem').val('');
			$('#doClearAll').css('display', 'none');
			$('#toDoItem').focus();
			localStorage.clear();
			// location.reload(); 
		});

	});
	// localStorage



	document.addEventListener('click', function (e) {
		if (localStorage.todoListPlus == "\n      ") {
			$('#doClearAll').css('display', 'none');
		} else if (e.target.className != "edit") {
			let value = document.querySelector('.edit').innerHTML;
			setCookie('title', value)
		}
	});

	function updateTitle() {
		let title = document.querySelector('.edit');
		let value = getCookie('title');
		title.innerHTML = (value != null) ? value : "Todo";
	}


	function getCookie(name) {
		let str = document.cookie;
		let i = str.indexOf(name);
		if (i >= 0) {
			str = str.slice(i);
			i = str.indexOf("=");
			str = str.slice(i + 1);
			i = str.indexOf(";");
			if (i >= 0)
				return str.slice(0, i);
			else
				return str.slice(0);
		}
		return null;
	}

	function setCookie(name, value) {
		document.cookie = name + "=" + value + ";" + expires(2019, 02, 15);
	}

	function expires(exp_y, exp_m, exp_d) {
		var expires = new Date(exp_y, exp_m, exp_d);
		return "expires=" + expires.toGMTString() + ";";
	}

	function deleteAllCookies() {
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i];
			var eqPos = cookie.indexOf("=");
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
	}

	function loadToDo() {
		if (localStorage.getItem('todoListPlus')) {
			theList.innerHTML = localStorage.getItem('todoListPlus');
			$('.sortable').sortable('destroy');
			$('.sortable').sortable({
				handle: '.handle'
			});

			var theCount = $("#theList li").length + 1;
			if (theCount > 1) {
				$('#doClearAll').css('display', 'block');
			}
		}
	}
});