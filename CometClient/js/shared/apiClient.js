
var getCommentsByUrlRoute = '/comments/getCommentsByUrl/';
var postNewCommentRoute = '/comments/postNewComment';
var sparkCommentRoute = '/comments/sparkcomment';

function ApiClient(apiUrl){

	this.apiUrl = apiUrl;
	this.authentication = new Authentication(apiUrl);

	this.signUp = this.authentication.signUp;
	this.signIn = this.authentication.signIn;
	this.signOut = this.authentication.signOut;

	var auth = this.authentication;

	this.getCommentsByUrl = function(url,callback,errorCallback){
		$.ajax({
		  type: "GET",
		  beforeSend: function(request) {
		    request.setRequestHeader("Authorization", TOKEN);
		  },
		  url: apiUrl + getCommentsByUrlRoute + encodeURIComponent(url),
		  async: true,
		  success: function(response) {
		    callback(response);
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) { 
        	errorCallback(); 
    	  }   
		});
	}

	this.postNewComment = function(author, content, url,  callback){

		var comment = { author, content, url};
	    $.ajax({
	        type: 'POST',
	       	beforeSend: function(request) {
		      request.setRequestHeader("Authorization", TOKEN);
		  	},
			url: apiUrl + postNewCommentRoute,
	        data: JSON.stringify(comment),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: true,
	        success: function(response) {
	         callback(response);
	        }
	    });
	}

	this.sparkComment = function(_id,  callback){

		var spark = { _id };
	    $.ajax({
	        type: 'POST',
	       	beforeSend: function(request) {
		      request.setRequestHeader("Authorization", TOKEN);
		  	},
			url: apiUrl + sparkCommentRoute,
	        data: JSON.stringify(spark),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: true,
	        success: function(response) {
	         callback(response);
	        }
	    });
	}

	this.unsparkComment = function(_id,  callback){

		var spark = { _id };
	    $.ajax({
	        type: 'DELETE',
	       	beforeSend: function(request) {
		      request.setRequestHeader("Authorization", TOKEN);
		  	},
			url: apiUrl + sparkCommentRoute,
	        data: JSON.stringify(spark),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: true,
	        success: function(response) {
	         callback(response);
	        }
    	});
	}

}

