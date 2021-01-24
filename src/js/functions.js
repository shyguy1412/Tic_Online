function showError(msg, id){
	$('#'+id).css("background", "#FFBFBF");
	$('#'+id).attr('data-content',msg);
	$('#'+id).popover("show");
}

function clearError(id){
	$('#'+id).popover('hide');
	$('#'+id).css("background", "#FFF");
	$('#'+id).attr('data-content',"");
}

function checkUsername(){
	
	var userName = $.trim($('#nickname_field').val());
	
	if(userName.length == 0){
		showError("Please enter a nickname!", "nickname_field");
		return false;
	} else {
		
		var nameRegex = new RegExp(/^[0-9a-z_]+$/i);
		var nameValid = false;
		nameValid = nameRegex.test(userName);
	
		if (nameValid == false){
			showError("Your name is not valid. Only letters, numbers, and '_' are  allowed", "nickname_field");
			return false;
		} else {
			clearError("nickname_field");
			return true;
		}
	}
}


function checkRoomcode(){
	
	var roomCode = $.trim($('#room_code_field').val());
	
	if(roomCode.length == 0){
		$('#room_form').collapse("show");
		showError("Please enter a room code!", "room_code_field");
		return false;
	} else {
		
		var codeRegex = new RegExp(/^[0-9a-z]+$/i);
		var codeValid = false;
		codeValid = codeRegex.test(roomCode);
	
		if (codeValid == false){
			$('#room_form').collapse("show");
			showError("Invalid room code", "room_code_field");
			return false;
		} else {
			clearError("room_code_field");
			return true;
		}
	}
}