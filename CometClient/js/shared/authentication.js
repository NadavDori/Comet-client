signUpRoute = '/users/signUp';
signInRoute = '/users/signIn';

var TOKEN = ""

function Authentication(apiUrl){

	this.apiUrl = apiUrl;

	chrome.storage.sync.get("token", (result) => {
      TOKEN = result.token;
    });

	this.signUp = function(email, password, callback, errorCallback){
		var params = { email, password };
		$.ajax({
		    url: apiUrl + signUpRoute,
		    type: 'POST',
		    data: JSON.stringify(params),
		    contentType: 'application/json; charset=utf-8',
		    dataType: 'json',
		    async: true,
		    success: function(response) {
		      TOKEN = response.token;
		      chrome.storage.sync.set({"token":response.token});
			  if(callback && typeof callback === "function") {
		      	callback();
		      }
		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown) { 
		      if(errorCallback && typeof errorCallback === "function") {
        		errorCallback();
        	  } 
    	  	}      
		});
	}

	this.signIn = function(email, password, callback, errorCallback){
	    var params = { email, password };
	    $.ajax({
	        url: apiUrl + signInRoute,
	        type: 'POST',
	        data: JSON.stringify(params),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: true,
	        success: function(response) {
	          TOKEN = response.token;
	          chrome.storage.sync.set({"token":response.token});
			  if(callback && typeof callback === "function") {
		      	callback();
		      }
	        },
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
		      if(errorCallback && typeof errorCallback === "function") {
        		errorCallback();
        	  } 
    	  	}      
	    });
	}

	this.signOut = function(callback){
		TOKEN = "";
		chrome.storage.sync.set({"token":""});
		  if(callback && typeof callback === "function") {
	      	callback();
	      }
	}
}