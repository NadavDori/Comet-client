
function FormValidation(){

	this.validateEmail = function(email){

		var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	    if (filter.test(email)) {
	        return true;
	    }
	    else {
	        return false;
	    }

	}

	this.validatePasswordLength = function(password){
		
		if(password.length<6){
			return false;
		}
		else{
			return true;
		}

	}

	this.validateCommentIsNotEmpty = function(comment){

		return comment.replace(/\s/g, '').length > 0;
	}
}