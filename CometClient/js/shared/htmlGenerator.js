
function HtmlGenerator(){

	function parseQuotedComment(text){
		return text.replace('[(+', '<div class="quoted-comment">')
		.replace('+)]', '</div>');
	}


	this.generateCommentByOtherUser = function(id,text,date,author,sparksCount=''){
		if(sparksCount == 0){
			sparksCount = '';
		}
		text = parseQuotedComment(text);
		const d = new Date(date);
		var authorHTML;

		if(author == "" || author == undefined){
    		authorHTML = "";
		}
		else{
			authorHTML = '<p class="text-left authorName">'+author.replace(/</g, "&lt;").replace(/>/g, "&gt;")+':  </p>';
		}

		return '<div class="comment-area row card">' +
          '<div class="card-block">' +
            '<blockquote class="blockquote">' +
              '<span class="clock">🕒</span>' +
                '<cite class="mb-0 text-secondary"> '+d+'</cite>' +
                '<hr></hr>' +
                '<span class="comment-content">' +
                	authorHTML +
              		'<div class="row">'+text +'</div>' +
              	'</span>' +
              '<div class="comment-options-nav navbar-nav row noselect">' +
					'<span class="sparks-count">'+sparksCount+'</span><span class="spark-button noselect">🔥 <span class="spark-label">Spark</span></span>· ' +
					'<span class="quote-button noselect">💬 Quote</span>· ' +
					// '<span class="star-button noselect">⭐ Star</span>' +
					'<span class="hidden id">'+id+'</span>' +
				'</div>'
            '</blockquote>' +
          '</div>' +
          '</div>';
	}

	this.generateCommentByLocalUser = function(id,text,date,author,sparksCount=''){
		if(sparksCount == 0){
			sparksCount = '';
		}
		text = parseQuotedComment(text);

		const d = new Date(date);
		var authorHTML;
		
		if(author == "" || author == undefined){
    		authorHTML = "";
		}
		else{
			authorHTML = '<p class="text-left authorName">'+author.replace(/</g, "&lt;").replace(/>/g, "&gt;")+':  </p>';
		}

		return '<div class="comment-area row card">' +
          '<div class="card-block">' +
            '<blockquote class="blockquote myComment">' +
              '<span class="clock">🕒</span>' +
                '<cite class="mb-0 text-secondary"> '+d+'</cite>' +
                '<hr></hr>' +
                '<span class="comment-content">' +
                	authorHTML +
              		'<div class="row">'+text +'</div>' +
              	'</span>' +
              '<div class="comment-options-nav navbar-nav row noselect">' +
					'<span class="sparks-count">'+sparksCount+'</span><span class="spark-button noselect">🔥 <span class="spark-label">Spark</span></span>· ' +
					'<span class="quote-button noselect">💬 Quote</span>· ' +
					// '<span class="star-button noselect">⭐ Star</span>' +
					'<span class="hidden id">'+id+'</span>' +
				'</div>'
            '</blockquote>' +
          '</div>' +
          '</div>';
	}

	this.generateNoCommentOnSiteMessage = function(){
		return'<div id="no-comments-yet-label" class="text-center">' +
			'<cite>' +
				'No comments on this site yet...' +
			'<cite/>' +
		'</div>';
	}

}