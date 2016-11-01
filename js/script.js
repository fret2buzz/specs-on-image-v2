$(document).ready(function() {
  var el = $(".container");
  var containerIn = $(".container-in");

  var boxCount = 0;
  var spotCount = 0;
  var clickCount = 0;
  var reset = $(".reset");
  var removeTool = $("#removeTool");
  var scale = $(".scale");
  var scaleButtons = scale.find(".button");
  
  var boxInfo = $(".box-info");
  var cursorInfo = $(".cursor-info");
  var elements;
  var scaleFactor = 1;

  // set scale
  var setScale = function(num){
    el.css({"transform": "scale(" + num + ")"}).parent().scrollLeft(0).scrollTop(0);
  };

  // clicking on scale buttons
  scaleButtons.click(function(){
    scaleButtons.removeClass("active");
    $(this).addClass("active");
    scaleFactor = $(this).data("scale");
    setScale(scaleFactor);
  });

  // clicking on reset button
  reset.click(function() {
    containerIn.add(boxInfo).html('');

    boxCount = 0;
    spotCount = 0;
    scaleFactor = 1;

    setScale(scaleFactor);
    scaleButtons.removeClass("active");
    scale.find(".default").addClass("active");
  });
  
  // getting the X, Y of the cursor
  containerIn.mousemove(function(e) {
    cursorInfo.html('X: ' + Math.ceil(e.pageX/scaleFactor) + '<br /> Y: ' + Math.ceil(e.pageY/scaleFactor));
  });

  // setting the class to container according to tool
  $(".tools").find("input").click(function(){
    if($(this).is(":checked")){
      el.attr("class", "");
      el.addClass("container " + $(this).attr("data-cursor"));
    };
  });
  
  // click on the container
  el.click(function(e) {

    // measuring the size
    if($("#sizeTool").is(":checked")){
      clickCount++;
      if(clickCount == 1) {
        console.log('first');
        var parentOffset = $(this).offset();
        var relX = (e.pageX - parentOffset.left)/scaleFactor;
        var relY = (e.pageY - parentOffset.top)/scaleFactor;
        boxCount++;
        var curBox = $('<div class="box box-' + boxCount + '"></div>').css({
          "left": relX,
          "top": relY,
        }).appendTo(containerIn);
        
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
          boxInfo.html('W: ' + Math.ceil(newWidth) + '<br /> H: ' + Math.ceil(newHeight));
        });
      }
      
      if(clickCount == 2){
         console.log('second');
         $(this).off("mousemove");
         clickCount = 0;
         curBox = $(".box-" + boxCount);
         
         if(curBox.attr("data-width") == 0 ||  curBox.attr("data-height") == 0){
            curBox.remove();
            boxCount--;
         }
      }
    }//if($("#sizeTool").is(":checked"))

    // setting the spot
    if($("#spotTool").is(":checked")){
      var parentOffset = $(this).offset();
      var relX = (e.pageX - parentOffset.left)/scaleFactor;
      var relY = (e.pageY - parentOffset.top)/scaleFactor;
      spotCount++;
      var spotBox = $('<div class="spot spot-' + spotCount + '"><span class="spot-in"></span></div>').css({
        "left": relX,
        "top": relY,
      }).appendTo(containerIn);
    }
  });
  
  //getting the boxes and spots
  removeTool.click(function(){
    var elements = $(".box, .spot");

    //removing boxes and spots
    if(elements.length != 0){
      elements.click(function(){
        if(removeTool.is(":checked")){
          $(this).remove();
        }
      });
    }
  });
  




});