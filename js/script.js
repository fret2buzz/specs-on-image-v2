$(document).ready(function() {
  var el = $(".container");
  var containerIn = $(".container-in");
  var reset = $(".reset");
  var msg = '';
  var boxCount = 0;
  var spotCount = 0;
  var clickCount = 0;
  
  var scale = $(".scale");
  var scaleButtons = scale.find(".button");
  var boxInfo = $(".box-info");
  var cursorInfo = $(".cursor-info");
  
  var scaleFactor = 1;

  var getScale = function(num){
    el.css({"transform": "scale(" + num + ")"}).parent().scrollLeft(0).scrollTop(0);
  };

  scaleButtons.click(function(){
    scaleButtons.removeClass("active");
    $(this).addClass("active");
  });

  scale.find('button').click(function(){
    scaleFactor = $(this).data("scale");
    getScale(scaleFactor);
  });

  reset.click(function() {
    containerIn.add(boxInfo).html('');

    boxCount = 0;
    spotCount = 0;
    scaleFactor = 1;

    getScale(scaleFactor);
    scaleButtons.removeClass("active");
    scale.find(".default").addClass("active");
  });
  
  containerIn.mousemove(function(e) {
    cursorInfo.html('X: ' + Math.ceil(e.pageX/scaleFactor) + '<br /> Y: ' + Math.ceil(e.pageY/scaleFactor));
  });

  $(".tools").find("input").click(function(){
    if($(this).is(":checked")){
      el.attr("class", "");
      el.addClass("container " + $(this).attr("data-cursor"));
    };
  });
  

  el.click(function(e) {
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
    var elements = $(".box, .spot");
    elements.click(function(){
      if($("#removeTool").is(":checked")){
        $(this).remove();
      }
    });

  });


});