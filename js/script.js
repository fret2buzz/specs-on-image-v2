$(document).ready(function() {
  var photo = $(".photo");
  var photoIn = $(".photo-in");

  var boxCount = 0;
  var spotCount = 0;

  var reset = $(".reset");
  var generate = $(".generate");
  var generateButton = $("#generateHTML");
  var downloadLink = $("#downloadLink");
  var htmlFile = null;

  var removeTool = $("#removeTool");
  var infoTool = $("#infoTool");
  var scale = $(".scale");
  var scaleButtons = scale.find(".button");
  
  var coordinatesBox = $(".coordinates-box");
  var coordinatesCursor = $(".coordinates-cursor");
  var elementsBox;
  var elementsSpot;
  var scaleFactor = 1;

  // set scale
  var setScale = function(num){
    photo.css({"transform": "scale(" + num + ")"}).parent().scrollLeft(0).scrollTop(0);
  };

  // clicking on scale buttons
  scaleButtons.click(function(){
    scaleButtons.removeClass("active");
    $(this).addClass("active");
    scaleFactor = $(this).attr("data-scale");
    setScale(scaleFactor);
  });

  var resetFunction = function(){
    photoIn.add(coordinatesBox).html('');

    boxCount = 0;
    spotCount = 0;
    scaleFactor = 1;
    setScale(scaleFactor);
    scaleButtons.removeClass("active");
    scale.find(".default").addClass("active");
    generate.hide();
    downloadLink.hide();
  }

  // clicking on reset button
  reset.click(function() {
    resetFunction();
  });
  
  // getting the X, Y of the cursor
  photoIn.mousemove(function(e) {
    coordinatesCursor.html('X: ' + Math.ceil(e.pageX/scaleFactor) + '<br /> Y: ' + Math.ceil(e.pageY/scaleFactor));
  });

  // setting the class to container according to tool
  $(".tools").find("input").click(function(){
    if($(this).is(":checked")){
      photo.attr("class", "");
      photo.addClass("photo " + $(this).attr("data-cursor"));
    };
  });

  // choose image
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var img = new Image();
        img.src = e.target.result;
        img.onload = function() {
          var image = $('#imageFile');
          var imageParent = image.parent();
          image.attr('src', img.src);
          image.add(imageParent).css({
            "width": img.width + "px",
            "height": img.height + "px"
          });
        }
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#imageInput").change(function(){
    readURL(this);
    resetFunction();
  });

  // click on the container
  photo.mousedown(function(e) {
    // measuring the size
    if($("#sizeTool").is(":checked")){
      // console.log('first');
      var parentOffset = $(this).offset();
      var relX = (e.pageX - parentOffset.left)/scaleFactor;
      var relY = (e.pageY - parentOffset.top)/scaleFactor;
      boxCount++;
      var curBox = $('<div class="box box-' + boxCount + '"></div>').css({
        "left": relX,
        "top": relY,
      }).appendTo(photoIn);
      
      $(this).mousemove(function(e) {
        var newWidth = (e.pageX - parentOffset.left)/scaleFactor - relX;
        var newHeight = (e.pageY - parentOffset.top)/scaleFactor - relY;
        var negativeCalc = function(size){
         if(size < 0){
          size = 0;
         };
         return size;
        };
        newWidth = negativeCalc(newWidth);
        newHeight = negativeCalc(newHeight);
        curBox.css({  
          "width": newWidth + "px",
          "height": newHeight + "px"
        });

        curBox.attr("data-width", Math.ceil(newWidth)).attr("data-height", Math.ceil(newHeight));
        coordinatesBox.html('W: ' + Math.ceil(newWidth) + '<br /> H: ' + Math.ceil(newHeight));
      });
    }
  }).mouseup(function() {
    if($("#sizeTool").is(":checked")){
       // console.log('second');
       $(this).off("mousemove");
       curBox = $(".box-" + boxCount);
       // check if horizontal or vertical
       var dataWidth = curBox.attr("data-width");
       var dataHeight = curBox.attr("data-height");
       if(+dataWidth > +dataHeight){
         curBox.addClass("w");
       } else {
         curBox.addClass("h");
       }
       // remove from DOM
       if(dataWidth == 0 || dataHeight == 0 || dataWidth == undefined || dataHeight == undefined){
          curBox.remove();
          boxCount--;
       }
    }
  }).click(function(e){
    // setting the spot
    if($("#spotTool").is(":checked")){
      var parentOffset = $(this).offset();
      var relX = (e.pageX - parentOffset.left)/scaleFactor;
      var relY = (e.pageY - parentOffset.top)/scaleFactor;
      spotCount++;
      var spotBox = $('<div class="spot"><span class="spot-in" data-id="'+spotCount+'"></span></div>').css({
        "left": relX,
        "top": relY,
      }).appendTo(photoIn);
    }
    if($(".box").length>0 || $(".spot").length > 0) {
      generate.show();
    } else {
      generate.hide();
      downloadLink.hide();
    }
  });
  
  //getting the boxes and spots
  removeTool.click(function(){
    elementsBox = $(".box");
    elementsSpot = $(".spot");

    //removing boxes
    if(elementsBox.length != 0){
      elementsBox.click(function(){
        if(removeTool.is(":checked")){
          $(this).remove();
          var i = 0;
          boxCount = 0;
          $(".box").each(function(){
            i++;
            boxCount = i;
            $(this).attr("class", "box box-" + i);
          });
        }
      });
    }
    //removing spots
    if(elementsSpot.length != 0){
      elementsSpot.click(function(){
        if(removeTool.is(":checked")){
          $(this).remove();
          var i = 0;
          spotCount = 0;
          $(".spot").each(function(){
            i++;
            spotCount = i;
            $(this).find(".spot-in").attr("data-id", i);
          });
        }
      });
    }
  });

  //setting the info for spot
  infoTool.click(function(){
    elementsSpot = $(".spot");

    if(elementsSpot.length != 0){
      elementsSpot.click(function(){
        if(infoTool.is(":checked")){
          elementsSpot.removeClass("active");
          $(this).addClass("active");
          var self = $(this);
          var infoForm = $(".info");
          var infoSubject = $("#infoSubject");
          var infoDescription = $("#infoDescription");
          var infoAddButton = $("#infoAddButton");
          infoForm.show();

          if(self.hasClass("has-info")){
            infoSubject.val(self.attr("data-subject"));
            infoDescription.val(self.attr("data-description"));
          }

          infoAddButton.click(function(){
            if(self.hasClass("active")){

              self.attr("data-subject", infoSubject.val());
              self.attr("data-description", infoDescription.val());
              
              if(self.attr("data-subject") != '' || self.attr("data-description") != ''){
                self.addClass("has-info")
              } 
              if(self.attr("data-subject") == '' && self.attr("data-description") == ''){
                self.removeClass("has-info")
              }

              self.removeClass("active");
              infoSubject.val('');
              infoDescription.val('');
              infoForm.hide();
            };
          });
        }
      });
    }
  });

  // generate HTML
  makeHTMLFile = function (html) {
    var data = new Blob([html], {type: 'text/html'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (htmlFile !== null) {
      window.URL.revokeObjectURL(htmlFile);
    }

    htmlFile = window.URL.createObjectURL(data);

    return htmlFile;
  };

  generateButton.click(function(){
    scaleFactor = 1;
    setScale(scaleFactor);
    var filename = $('#imageInput').val().split('\\').pop();
    var htmlHeader = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title>'+filename+' - Generated HTML</title> <link rel="stylesheet" href="css/view.css" /> </script> <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"> </head> <body> <div class="container">';
    var htmlFooter = '</div></body></html>';
    var htmlMain = '<div class="main">'+$(".main").html()+'</div>';
    var htmlInformation = function(){
      var elementsSpot = $(".spot");
      var text = '';
      elementsSpot.each(function(){
        var htmlId = $(this).find(".spot-in").attr("data-id");
        var htmlSubject = $(this).attr("data-subject");
        var htmlDescription = $(this).attr("data-description");
        if(htmlSubject != undefined || htmlDescription != undefined){
          text = text + '<div class="line"><span class="id">' + htmlId + '</span><dl class="list"><dt class="subject">' + htmlSubject + '</dt><dd class="description">' + htmlDescription + '</dd></dl></div>';
        }
      });
      return text;
    };
    var htmlSide = '<div class="side"><h1 class="filename">'+filename+'</h1><div class="lines">'+htmlInformation()+'</div></div>';
    var html = htmlHeader + htmlMain + htmlSide + htmlFooter;
    var link = $('#downloadLink');
    link.attr("href", makeHTMLFile(html)).css("display", "block");
  });

});