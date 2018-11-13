function SignInView(formValidation,apiClient,callback){

	var signInView = $("#sign-in-view");

	var emailInput = $("#sign-in-email");
	var passwordInput = $("#sign-in-password");
	var submitButton = $("#sign-in-submit");
	var rememberMeCkBox = $("#sign-in-remember-me");

	var incorrectEmailOrPasswordLabel = $("#incorrect-email-or-password-label");

	chrome.storage.sync.get("user_email", (result) => {
        emailInput.val(result.user_email);
    });
	chrome.storage.sync.get("user_password", (result) => {
        passwordInput.val(result.user_password);
    });

	function hideErrorLabels(){
		incorrectEmailOrPasswordLabel.addClass('hidden');
	}

	submitButton.click(function(){
		
		hideErrorLabels();

      	var email = emailInput.val();
      	var password = passwordInput.val();

      	if(!formValidation.validateEmail(email) || !formValidation.validatePasswordLength(password)){
      		incorrectEmailOrPasswordLabel.removeClass('hidden');
      		return;
      	}

		MYEMAIL = email;
		chrome.storage.sync.set({"user_email":MYEMAIL});

      	apiClient.signIn(email, password,function(){
      		callback();
      		if(rememberMeCkBox.prop( "checked" )){
				chrome.storage.sync.set({"user_password":password});
	      	}
	      	else{
	      		passwordInput.val('');
	      		chrome.storage.sync.set({"user_password":""});
	      	}
      	},function(){
      		incorrectEmailOrPasswordLabel.removeClass('hidden');
      	});

	});

	this.display = function(callback){
  		signInView.removeClass('hidden');
  		
		if(callback && typeof callback === "function") {
  			callback();
  		}
	}

	this.hide = function(callback){
  		signInView.addClass('hidden');
  		
  		if(callback && typeof callback === "function") {
  			callback();
  		}
	}

}