$(document).ready(function() {
  var el = $("#image");
  var reset = $(".reset");
  var msg = '';
  var boxCount = 0;
  var clickCount = 0;
  var scaleInput = $("#scale");

  var scaleFactor = 1;
  var getScale = function(){
    scaleFactor = scaleInput.val();
    el.css({
      "transform": "scale(" + scaleFactor + ")"
    });
    el.parent().scrollLeft( 0 ).scrollTop( 0 );
  };
  scaleInput.on("change", function(){
    getScale();
  });
  reset.click(function() {
    el.html('');
    boxCount = 0;
    scaleInput.val(1);
    getScale();
    console.log(scaleInput.val());
  });
  el.click(function(e) {
    clickCount++;
    if(clickCount == 1) {
      console.log('first');
      var parentOffset = $(this).offset();
      var relX = (e.pageX - parentOffset.left)/scaleFactor;
      var relY = (e.pageY - parentOffset.top)/scaleFactor;
      boxCount++;
      var curBox = $('<div class="box box-' + boxCount + '">').css({
        "left": relX,
        "top": relY,
      }).appendTo($(this));
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
        }).html(Math.ceil(newWidth) + 'x' + Math.ceil(newHeight));

        //console.log(e.pageX, e.pageY);
      });
    }
    
    if(clickCount == 2){
       console.log('second');
       $(this).off("mousemove");
       clickCount = 0;
    }

  });
});