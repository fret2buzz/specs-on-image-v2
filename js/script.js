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
  var settingsTool = $("#settingsTool");
  var scale = $(".scale");
  var scaleButtons = scale.find(".button");
  
  var coordinatesBox = $(".coordinates-box");
  var coordinatesCursor = $(".coordinates-cursor");
  var elementsBox;
  var elementsSpot;
  var scaleFactor = 1;

  // set colors
  $("#colors label").each(function() {
    $(this).css("background-color", $(this).attr("data-color"));
  });

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

  var nnn = 0;
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
                self.addClass("has-info");
              } 
              if(self.attr("data-subject") == '' && self.attr("data-description") == ''){
                self.removeClass("has-info");
              }

              self.removeClass("active");
              infoSubject.val('');
              infoDescription.val('');
              nnn++;
              console.log(nnn);
              infoForm.hide();
            };
          });
        }
      });
    }
  });

  var settingsForm = $(".settings");
  var settingsUpdateButton = $("#settingsUpdateButton");
  var elementsSpot;
  settingsTool.click(function(){
    elementsSpot = $(".spot");
    if(elementsSpot.length != 0) {
      elementsSpot.click(function(){
        elementsSpot.removeClass("checked");
        $(this).addClass("checked");
        var self = $(this);
        if(settingsTool.is(":checked")){
          settingsForm.show();
          $("#colors label").each(function() {
            $(this).click(function() {
              if(self.hasClass("checked")){
                self.children("span").css("background-color", $(this).attr("data-color"));
              }
            });
          });
        }
      });
    }
  });
  settingsUpdateButton.click(function(){
    elementsSpot.removeClass("checked");
    elementsSpot.unbind("click");
    settingsForm.hide();
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
    var htmlHeader = '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title>'+filename+' - Generated HTML</title> <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"> <style type="text/css">.line .id,.spot-in:after{line-height:30px;text-align:center}.line .id,.spot-in:after,h1{text-align:center}*,:after,:before{margin:0;padding:0;box-sizing:border-box}button::-moz-focus-inner,input::-moz-focus-inner{padding:0;border:0}body,html{width:100%;height:100%}body{font-family:Helvetica,Arial,sans-serif;font-size:12px}.container{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-flow:row wrap;-ms-flex-flow:row wrap;flex-flow:row wrap;-webkit-align-content:stretch;-ms-flex-line-pack:stretch;align-content:stretch;height:100%;overflow:hidden}h1{font-size:24px;font-weight:400;padding:0 0 20px}.line .id,.list .subject,.spot-in:after{font-size:16px;font-weight:700}.main,.side{padding:20px;overflow:auto;height:100%}.main{width:70%;background:rgba(204,204,204,.2)}.side{width:30%;background:rgba(44,86,157,.2)}.line,.list{overflow:hidden}.photo{margin:0 auto;position:relative}.box,.photo-in{position:absolute}.photo .photo-image{width:0;height:0;display:block;vertical-align:top}.photo-in{width:100%;height:100%;left:0;top:0}.box{background:rgba(255,0,255,.1)}.box.h:after,.box.w:after{background:rgba(44,86,157,.8);padding:4px;display:block;position:absolute;color:#fff}.box.w{height:17px!important;border-left:1px solid #ff00ff;border-right:1px solid #ff00ff}.box.w:after{content:attr(data-width);bottom:100%;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.box.h{width:17px!important;border-top:1px solid #ff00ff;border-bottom:1px solid #ff00ff}.box.h:after{content:attr(data-height);top:50%;right:100%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.box:before{content:"";position:absolute;left:50%;top:50%;background:#ff00ff}.line .id,.spot-in{background:rgba(44,86,157,.8)}.box.w:before{width:100%;height:1px;left:0;top:8px}.box.h:before{width:1px;height:100%;left:8px;top:0}.spot-in,.spot-in:after{position:absolute;left:50%;top:50%;border-radius:999px}.spot{position:absolute;width:1px;height:1px}.spot-in{width:30px;height:30px;margin:-14px 0 0 -14px}.spot-in:after{content:attr(data-id);width:100%;height:100%;color:#fff;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.line{padding:20px 0 0}.line:first-child{padding-top:0}.line .id{float:left;margin-right:15px;width:30px;height:30px;border-radius:999px;color:#fff}.list .subject{padding:0 0 5px}.list .description{font-size:14px}</style></head> <body> <div class="container">';
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
          text = text + '<div class="line"><span style="background-color:' + $(this).find(".spot-in").css("backgroundColor") + '" class="id">' + htmlId + '</span><dl class="list"><dt class="subject">' + htmlSubject + '</dt><dd class="description">' + htmlDescription + '</dd></dl></div>';
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