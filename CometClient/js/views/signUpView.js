function SignUpView(formValidation,apiClient,callback){

	var signUpView = $("#sign-up-view");

	var emailInput = $("#sign-up-email");
	var passwordInput = $("#sign-up-password");
	var confirmPasswordInput = $("#sign-up-confirm-password");
	var submitButton = $("#sign-up-submit");

	var invalidEmailAddressLabel = $("#invalid-email-address-label");
	var passwordTooShortLabel = $("#password-too-short-label");
	var passwordsDontMatchLabel = $("#passwords-dont-match-label");
	var emailAlreadyExistsLabel = $("#email-already-exists-label");

	function hideErrorLabels(){
		passwordsDontMatchLabel.addClass('hidden');
		invalidEmailAddressLabel.addClass('hidden');
		passwordTooShortLabel.addClass('hidden');
		emailAlreadyExistsLabel.addClass('hidden');
	}

	submitButton.click(function(){

		hideErrorLabels();

		var email = emailInput.val();
      	var password = passwordInput.val();
      	var confirmPassword = confirmPasswordInput.val();

      	if(!formValidation.validateEmail(email)){
      		invalidEmailAddressLabel.removeClass('hidden');
      	}

	    if(!formValidation.validatePasswordLength(password)){
	        passwordTooShortLabel.removeClass('hidden');
	        return;
	      }

	      if(password == confirmPassword){
			MYEMAIL = email;
	        chrome.storage.sync.set({"user_email":MYEMAIL});
	        apiClient.signUp(email, password,callback,function(){
	        	emailAlreadyExistsLabel.removeClass('hidden');
	        });
	        
	      }else{
			passwordsDontMatchLabel.removeClass('hidden');
	      }
	});

	this.display = function(callback){
  		signUpView.removeClass('hidden');
		if(callback && typeof callback === "function") {
  			callback();
  		}
	}

	this.hide = function(callback){
  		signUpView.addClass('hidden');
		if(callback && typeof callback === "function") {
  			callback();
  		}
	}

}