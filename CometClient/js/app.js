var MYEMAIL;
var URL;
//18.216.221.95:5000
var apiUrl = "http://"+"localhost:5000"+"/api";
var apiClient;

var formValidation;
var htmlGenerator;
var signInView;
var signUpView;
var mainAppView;

$body = $("body");

function displayApp(){
  signUpView.hide();
  signInView.hide();
  mainAppView.display();
}

function displaySignUpLayout(){
  mainAppView.hide();
  signInView.hide();
  signUpView.display();
}

function displaySignInLayout(){
  mainAppView.hide();
  signUpView.hide();
  signInView.display();
}

function initEmojis(){

     window.emojiPicker = new EmojiPicker({
          emojiable_selector: '[data-emojiable=true]',
          assetsPath: '../lib/img/',
          popupButtonClasses: 'fa fa-smile-o'
        });
    window.emojiPicker.discover();

     // Google Analytics
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-49610253-3', 'auto');
      ga('send', 'pageview');
}

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
    ajaxStop: function() { $body.removeClass("loading"); }    
});

$( document ).ready(function() {

    initEmojis();
    $('[data-toggle="tooltip"]').tooltip();

    formValidation = new FormValidation();
    htmlGenerator = new HtmlGenerator();

    apiClient = new ApiClient(apiUrl);
    mainAppView = new MainAppView(formValidation, htmlGenerator, apiClient)

    signInView = new SignInView(formValidation, apiClient, function(){
      displayApp();
      mainAppView.init(displayApp,displaySignInLayout);
    });

    signUpView = new SignUpView(formValidation, apiClient, function(){
      displayApp();
      mainAppView.init(displaySignUpLayout);
    });

    mainAppView.init(displaySignInLayout);

  });

  $("#not-a-user-link").click(function(){
    displaySignUpLayout();
  });

   $("#already-a-user-link").click(function(){
    displaySignInLayout();
  });

  $("#sign-out-button").click(function(){
    mainAppView.clearMessageBoard();
    MYEMAIL = ""
    apiClient.signOut(displaySignInLayout);
    chrome.storage.sync.set({"name":""});
    chrome.storage.sync.set({"comment":""});
  });



