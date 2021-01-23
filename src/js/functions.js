function showError(msg, id){
  document.getElementById(id).innerHTML = msg;
}

function checkRoomcode(){
  var room_code = document.getElementById('room_code_field').value
  var nameRegex = /^[a-zA-Z0-9]+$/;
  var nameValid = room_code.match(nameRegex);

  if(!room_code.replace(/\s/g, '').length){
    showError("Roomcode cannot be empty!", "roomcode_error_field");
  }else if(nameValid == null){
    showError("Invalid Roomcode", "roomcode_error_field");
    return false;
  } else {
    return true;
  }
}

function checkUsername(){
  var username = document.getElementById('username_field').value
  var nameRegex = /^[a-zA-Z0-9_]+$/;
  var nameValid = username.match(nameRegex);

  if(!username.replace(/\s/g, '').length){
    showError("Username cannot be empty!", "username_error_field");
  }else if(nameValid == null){
    showError("Your name is not valid. Only letter, numbers and '_' are  acceptable.", "username_error_field");
    return false;
  } else {
    return true;
  }
}
