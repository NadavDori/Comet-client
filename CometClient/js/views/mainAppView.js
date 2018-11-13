function MainAppView(formValidation, htmlGenerator, apiClient){

	var commentsArray = [];
	var mainAppView = $("#main-app-view");
	var emailLabel = $("#email-label");
	var refreshButton = $("#refreshBtn");
	var urlBar = $("#url-bar");
	var messageBoard = $("#message-board");
	var nameInput = $("#name-input");
	var commentTextArea = $("#comment-text-area");
	var commentEditor = $(".emoji-wysiwyg-editor");
	var submitCommentButton = $("#submit-comment-button");
	var noCommentsLabel;
	var quotedComment = "";


	function appendCommentsToMessageBoard(array){

		if(array == undefined)
	      return;

	    commentsArray = array;

	      if(commentsArray.length == 0){
	        messageBoard.append(htmlGenerator.generateNoCommentOnSiteMessage());
	        noCommentsLabel = $("#no-comments-yet-label")
	      }
	      for(var i = 0 ; i < commentsArray.length ; i++){
	      	var newComment;
	        if(commentsArray[i].user_email == MYEMAIL){
	        	newComment = htmlGenerator.generateCommentByLocalUser(commentsArray[i]._id,commentsArray[i].content, commentsArray[i].create_date,commentsArray[i].author, commentsArray[i].sparks.length);
				
	        }else{
	        	newComment = htmlGenerator.generateCommentByOtherUser(commentsArray[i]._id,commentsArray[i].content, commentsArray[i].create_date,commentsArray[i].author, commentsArray[i].sparks.length);
	        }

			var commentElem = $($.parseHTML(newComment));

			if(commentsArray[i].sparks!=undefined && commentsArray[i].sparks.length > 0){
	        	if(commentsArray[i].sparks.includes(MYEMAIL)){
					commentElem.find('.spark-button').addClass('selected');
					commentElem.find('.spark-label').html('Sparked!');
					commentElem.find('blockquote').addClass('sparked-comment');
	        	}
	        }

	        messageBoard.append(commentElem);
	      }

		messageBoard.animate({ scrollTop: messageBoard.prop("scrollHeight")}, 1000);

	}

	function loadComments(errorCallback){
		apiClient.getCommentsByUrl(URL, function(data){
	  		appendCommentsToMessageBoard(data);
		}, errorCallback);
	}

	function getCurrentTabUrl(callback) {
	  var queryInfo = {
	    active: true,
	    currentWindow: true
	  };

	  chrome.tabs.query(queryInfo, (tabs) => {
	    var tab = tabs[0];
	    URL = tab.url;
		urlBar.text('@ '+URL.replace("\n",""));
	    
	    if(callback && typeof callback === "function") {
  			callback();
  		}
	  });
	}

	this.init = function(errorCallback){

        nameInput.change(function(){
          chrome.storage.sync.set({"name":nameInput.val()});
        });

        commentTextArea.change(function(){
          chrome.storage.sync.set({"comment":commentTextArea.val()});
        });

        chrome.storage.sync.get("name", (result) => {
          nameInput.val(result.name);
        });

        chrome.storage.sync.get("comment", (result) => {
          commentTextArea.val(result.comment);
        });

        chrome.storage.sync.get("user_email", (result) => {
          	MYEMAIL = result.user_email;
			emailLabel.html(MYEMAIL);
			messageBoard.empty();
			getCurrentTabUrl(function(){
				loadComments(errorCallback);
  			});
        });
	}

	function displayNewComment(comment){

		if(commentsArray.length == 0){
			noCommentsLabel.hide();
		}

    	var newComment = htmlGenerator.generateCommentByLocalUser(comment._id, comment.content, comment.create_date, comment.author);
    	messageBoard.append(newComment);

  	}

	refreshButton.click(function(){
	    messageBoard.empty();
	    getCurrentTabUrl(loadComments);
	});

	submitCommentButton.click(function(){
		const name = nameInput.val();
		var comment = commentTextArea.val();
		var comment = commentTextArea.val().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g,"</br>");
		if(!formValidation.validateCommentIsNotEmpty(comment))
			return;

		comment = quotedComment + comment;

		apiClient.postNewComment(name,comment,encodeURIComponent(URL),displayNewComment);

		$(".attached-quoted-comment").remove();
		quotedComment = "";
		commentTextArea.val('');
		commentEditor.html('');
		chrome.storage.sync.set({"comment":''});
		messageBoard.animate({ scrollTop: messageBoard.prop("scrollHeight")}, 1000);

  	});

  	this.display = function(callback){
  		mainAppView.removeClass('hidden');
		if(callback && typeof callback === "function") {
  			callback();
  		}
	}

	this.hide = function(callback){
  		mainAppView.addClass('hidden');
		if(callback && typeof callback === "function") {
  			callback();
  		}
	}

	this.clearMessageBoard = function(){
		messageBoard.empty();
	}

	/* SPARK */
	function spark(commentElem){
		const commentId = commentElem.find('.id').html();
		const sparkCount = commentElem.find('.sparks-count').html();

		console.log(sparkCount);

		apiClient.sparkComment(commentId, function(){
			if(!sparkCount.length){
				commentElem.find('.sparks-count').html('1');
			}
			else{
				commentElem.find('.sparks-count').html(parseInt(sparkCount)+1);
			}
			commentElem.find('.spark-button').addClass('selected');
			commentElem.find('.spark-label').html('Sparked!');
			commentElem.addClass('sparked-comment');
		});
	}

	function unspark(commentElem){
		const commentId = commentElem.find('.id').html();
		const sparkCount = commentElem.find('.sparks-count').html();

		apiClient.unsparkComment(commentId, function(){
			if(parseInt(sparkCount)-1 == 0){
				commentElem.find('.sparks-count').html('');
			}
			else{
				commentElem.find('.sparks-count').html(parseInt(sparkCount)-1);
			}
			commentElem.find('.spark-button').removeClass('selected');
			commentElem.find('.spark-label').html('Spark');
			commentElem.removeClass('sparked-comment');
		});
	}

	$body.on('click','.spark-button',function(){

		const btnClass = $(this).attr("class");
		const commentElem = $(this).closest('blockquote');

		if(btnClass.includes('selected')){
			unspark(commentElem);
		}
		else{
			spark(commentElem);
		}
	});

	/* QUOTE */

	function quote(commentElem){
		$(".attached-quoted-comment").remove();
		$body.append('<div class="attached-quoted-comment"><i class="fa fa-times" aria-hidden="true"></i>'+commentElem.find('.comment-content').html() + '</div>');
		quotedComment = "[(+" + commentElem.find('.comment-content').html() + "+)]";
	}

	function unquote(commentElem){
		quotedComment = "";
	}

	$body.on('click','.fa-times',function(){
		$(".attached-quoted-comment").remove();
	});

	$body.on('click','.quote-button',function(){

		const btnClass = $(this).attr("class");
		const commentElem = $(this).closest('blockquote');

		if(btnClass.includes('selected')){
			unquote(commentElem);
		}
		else{
			quote(commentElem);
		}
	});




}






