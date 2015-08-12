/* affix the navbar after scroll below header */
$('#nav').affix({
      offset: {
        top: $('header').height()-$('#nav').height()
      }
});	

/* highlight the top nav as scrolling occurs */
$('body').scrollspy({ target: '#nav' })

/* smooth scrolling for scroll to top */
$('.scroll-top').click(function(){
  $('body,html').animate({scrollTop:0},1000);
})

/* smooth scrolling for nav sections */
$('#nav .navbar-nav li>a').click(function(){
  var link = $(this).attr('href');
  var posi = $(link).offset().top;
  $('body,html').animate({scrollTop:posi},700);
})

/* google maps */

// enable the visual refresh
google.maps.visualRefresh = true;

var map;
function initialize() {
  var mapOptions = {
    zoom: 13,
    scrollwheel: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var options = {
    map: map,
    position: new google.maps.LatLng(40.6774680,-73.9554940),
    //content: 'The Crabby Shack'
  };

  var marker = new google.maps.Marker({
    position: options.position,
    map: map,
    title:"The Crabby Shack"});
  marker.setMap(map); 

  var infoOptions = {
      content: 'The Crabby Shack<br>address here'
  };
  var infowindow = new google.maps.InfoWindow(infoOptions); 

  map.setCenter(options.position);

  deliveryArea =[
    new google.maps.LatLng(40.686408,-73.968534),
    new google.maps.LatLng(40.681575,-73.967461),
    new google.maps.LatLng(40.681697,-73.967493),
    new google.maps.LatLng(40.675481,-73.969725),
    new google.maps.LatLng(40.672910,-73.968738),
    new google.maps.LatLng(40.671616,-73.962590),
    new google.maps.LatLng(40.670460,-73.961646),
    new google.maps.LatLng(40.669223,-73.955573),
    new google.maps.LatLng(40.668621,-73.945038),
    new google.maps.LatLng(40.680094,-73.943965),
    new google.maps.LatLng(40.680224,-73.946239),
    new google.maps.LatLng(40.688783,-73.947870)
  ];
  var polygon = new google.maps.Polygon({
    paths: deliveryArea,
    strokeColor:"#003148",
    strokeOpacity: 0.5,
    strokeWeight: 2,
    fillColor: "#086CA2",
    fillOpacity: 0.5

  });
  polygon.setMap(map);

}

google.maps.event.addDomListener(window, 'load', initialize);

/* phplist subscription form */
function frmValidate()
{
   //declarations
   var x; var y; var strErrors; var strURL;

   //the HTML DIV where the errors will show up.
   document.getElementById('subscribebox_errors').innerHTML="";

   //function call....returns how many checkboxes have actually been checked.  
   //var x = numberChecked();
   var x = 1;
   //function call....uses regular expressions to validate if the value in the email form box is
   //indeed a valid email.  Please note, I had to add an actual ID tag to the form, not just use
   //the HTML name tag.

   var y = validateEmail(document.getElementById('ml_email').value);
   
   //if neither a checkbox is checked, or it's not a valid email.
   if( (!(x>=1)) || (!y) )

   {
      //build the error text/html string
      strErrors='<ul class="error_text">Errors found:';
      
      if(!(x>=1))
      {
         strErrors = strErrors + '<li>Please select at least one newsletter.</li>';
      }
         
      if(!y)
      {
         strErrors = strErrors + '<li>Please input a valid e-mail address.</li>';
      }
   
      strErrors = strErrors + '</ul>';

      //write the error HTML to the appropriate error area.
      document.getElementById("subscribebox_errors").innerHTML=" " + strErrors;
   }
   
   else if( (x>=1) && (y=1) )
   {
      //its all good!  Begin the AJAX post procedure.
      ajaxSendSubscribeInfo();
   }
   else
   {
      //if you get here, something went really wrong.
      alert('Error!');
   }

}

function ajaxSendSubscribeInfo()
{
   //declarations
   var urlStr; 
   var urlParams=''; 
   var returnResponse;
   var sForm;
   var xmlhttp;


   //standard AJAX object creation
   if (window.XMLHttpRequest)
   {// code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp=new XMLHttpRequest();
   }
   else
   {// code for IE6, IE5
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }

   //place your PHPList URL here.  IMPORTANT! Be sure to add ?p=subscribe and the &id= if you are using these functions.
   
   urlStr = 'http://thecrabbyshack.com/newsletter/?p=subscribe&id=1';
   
   //declare your AJAX form
   sForm = document.forms["subscribeform"];
   
   //prepping POST post string.  
   //urlParams = urlParams + '&email=' + escape(sForm.elements["email"].value);

   //iterate through all the checkboxes.  IMPORTANT side note regarding PHPLIST.  The list names in your form must be in this format.
   // list[1]=signup list[2]=signup etc.  Be sure to use the word "signup" (all lower case, no spaces) as the value for each list, or
   // phplist won't recognize it.

   for(var i=0;i<sForm.elements.length-1;i++)
   {
      if( (sForm.elements[i].type) /*&& (sForm.elements[i].checked)*/ )
         {   
               urlParams=urlParams + '&' + escape(sForm.elements[i].name) + '=' + escape(sForm.elements[i].value);      
         }
   }
   
   //must add the subscribe variable to the POST parameters.  
   urlParams = urlParams + '&subscribe="Subscribe to the selected newsletters"';

   
   //Start POSTING via AJAX.
   xmlhttp.open("POST",urlStr,true);

   //Send the proper header information along with the request
   xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   xmlhttp.setRequestHeader("Content-length", urlParams.length);
   xmlhttp.setRequestHeader("Connection", "close");
   
   xmlhttp.onreadystatechange = function() 
   {
      if (xmlhttp.readyState == 4) 
      { 

          console.log('xmlhttp: '+ xmlhttp.status);

         if (xmlhttp.status == 200) 
         { // only if "OK"
          
            var returnResponse = String(xmlhttp.responseText);
            document.getElementById('message').innerHTML="<div class=\"confMsg\"><b>Thank you for subscribing!</b><br>Please check your email for information about confirming your subscription.</div>";
         }
      
         else
         {
            document.getElementById('message').innerHTML="<div class=\"errorMsg\">An Error has occured while submitting your request.<br>Please try again later.</div>";
         }
      }
   }

   xmlhttp.send(urlParams);
}

function validateEmail(elementValue)
{
   var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   return emailPattern.test(elementValue);
}


function numberChecked()
{
   var numChecked = 0;
   
   var sForm = document.forms["subscribeform"];

   for(var i=0;i<sForm.elements.length;i++)
   {   
      if( (sForm.elements[i].type=="checkbox") && (sForm.elements[i].checked) )
      {   
            numChecked++;      
      }
   }
   
   return numChecked;
}



  //FUNCTION TO GET AND AUTO PLAY YOUTUBE VIDEO FROM DATATAG
  function autoPlayYouTubeModal() {
      var trigger = $("body").find('[data-toggle="modal"]');
      trigger.click(function () {
          var theModal = $(this).data("target"),
              videoSRC = $(this).attr("data-theVideo"),
              videoSRCauto = videoSRC + "?autoplay=1";
          $(theModal + ' iframe').attr('src', videoSRCauto);
          $(theModal + ' button.close').click(function () {
              $(theModal + ' iframe').attr('src', videoSRC);
          });
      });
  }