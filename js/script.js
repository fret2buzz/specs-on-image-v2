$(document).ready(function() {
  var photo = $(".photo");
  var photoIn = $(".photo-in");

  var boxCount = 0;
  var spotCount = 0;

  var reset = $(".reset");
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
          $('#imageFile').attr('src', img.src).parent().css({
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
        curBox.attr("data-width", newWidth).attr("data-height", newHeight);
        coordinatesBox.html('W: ' + Math.ceil(newWidth) + '<br /> H: ' + Math.ceil(newHeight));
      });

    }


  }).mouseup(function() {
    if($("#sizeTool").is(":checked")){
       // console.log('second');
       $(this).off("mousemove");
       curBox = $(".box-" + boxCount);
       
       if(curBox.attr("data-width") == 0 ||  curBox.attr("data-height") == 0){
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
        }
      });
    }
    //removing spots
    if(elementsSpot.length != 0){
      elementsSpot.click(function(){
        if(removeTool.is(":checked")){
          $(this).remove();
          var i = 0;
          $(".spot").each(function(){
            spotCount = i;
            i++;
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

});