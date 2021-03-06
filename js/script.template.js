$(document).ready(function() {
  var main = $(".main");
  var mainIn = $(".main-in");
  var photo = $(".photo");
  var photoIn = $(".photo-in");
  var tools = $(".tools");
  var boxCount = 0;
  var spotCount = 0;
  var edited = true;
  var reset = $(".reset");
  var generate = $(".generate");
  var generateButton = $("#generateHTML");
  var downloadLink = $("#downloadLink");
  var htmlFile = null;

  var removeTool = $("#removeTool");
  var infoTool = $("#infoTool");

  var scale = $(".scale");
  var scaleButtons = scale.find(".button");
  
  var sizeForm = $(".size");
  var boxWidth = $("#boxWidth");
  var boxHeight = $("#boxHeight");
  var cursorX = $("#cursorX");
  var cursorY = $("#cursorY");
  var boxCursorX = $("#boxCursorX");
  var boxCursorY = $("#boxCursorY");
  var documentWidth = $("#documentWidth");
  var documentHeight = $("#documentHeight");
  
  var doneButton = $("#doneButton");
  var applyButton = $("#applyButton");

  var elementsBox;
  var elementsSpot;
  var scaleFactor = 1;
  var imageFile = $("#imageFile");
  var imageWidth;
  var imageHeight;

  var infoForm = $(".info");
  var infoSubject = $("#infoSubject");
  var infoDescription = $("#infoDescription");
  var infoColors = $("#colors");
  
  var colors = infoColors.find("input");

  var infoAddButton = $("#infoAddButton");
  var curBox;
  
  var resetForm = function(){
    $("#infoSubject").val('');
    $("#infoDescription").val('');
    $("#colors").find("input").prop("checked", false);
    spotEdited = true;
  };


  // set scale
  var setScale = function(num){
    mainIn.css({"transform": "scale(" + num + ")"}).parent().scrollLeft(0).scrollTop(0);
  };

  // clicking on scale buttons
  scaleButtons.click(function(){
    scaleButtons.removeClass("active");
    $(this).addClass("active");
    scaleFactor = $(this).attr("data-scale");
    setScale(scaleFactor);
  });

  var resetFunction = function(){
    photoIn.html('');
    boxWidth.val('');
    boxHeight.val('');
    boxCursorX.val('');
    boxCursorY.val('');
    cursorX.html('');
    cursorY.html('');
    documentWidth.html('');
    documentHeight.html('');
    boxCount = 0;
    spotCount = 0;
    scaleFactor = 1;
    setScale(scaleFactor);
    scaleButtons.removeClass("active");
    scale.find(".default").addClass("active");
    generate.hide();
    downloadLink.hide();
    tools.find("input").prop("checked", false);
    photo.attr("class", "photo");
    resetForm();
    edited = true;
    spotEdited = true;
  }

  // clicking on reset button
  reset.click(function() {
    resetFunction();
  });

  // setting the class to container according to tool
  tools.find("input").click(function(){
    $(".spot").removeClass("active");
    resetForm();

    if($(this).is(":checked")){
      photo.attr("class", "");
      photo.addClass("photo " + $(this).attr("data-cursor"));
    };
    if($(this).is("#infoTool") || $(this).is("#spotTool")){
      infoForm.show();
    } else {
      infoForm.hide();
    }
    if($(this).is("#sizeTool") || $(this).is("#editSize")){
      sizeForm.show();
      if($(".box").length != 0) {
        $("#editSize").prop("disabled", false);
      }
    } else {
      sizeForm.hide();
      done();
      $("#editSize").prop("checked", false).prop("disabled", true);
    }
  });

  // choose image
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
         imageFile.attr('src', e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
  $("#imageInput").click(function(){
    $(this).val("");
    resetFunction();
  });
  $("#imageInput").change(function(){
    readURL(this);
    setTimeout(function() {
      var image = $("#imageFile");
      imageWidth = image[0].naturalWidth;
      imageHeight = image[0].naturalHeight;
      image.add(photo).css({
        "width": imageWidth + "px",
        "height": imageHeight + "px"
      });
      documentWidth.html(imageWidth);
      documentHeight.html(imageHeight);
      image.show();
    }, 500);
  });

  // getting the X, Y of the cursor
  photoIn.mousemove(function(e) {
    var photoInOffset = photo.offset();
    // console.log(photoInOffset.left, photoInOffset.top);
    var mmX = Math.ceil((e.pageX - photoInOffset.left)/scaleFactor);
    var mmY = Math.ceil((e.pageY - photoInOffset.top)/scaleFactor);
    // console.log(mmX, mmY);
    cursorX.html(mmX);
    cursorY.html(mmY);
  });

  //setting the sizes
  var change = function(){
    doneButton.show();
    applyButton.show();
    edited = false;
    downloadLink.hide();
    editSize.prop("disabled", true);
    if(edited == false) {
      var curBox = $(".box.active");
      //moving the box
      curBox.mousedown(function(e){
        //getting the left top corner of curBox
        var mvOffset = $(this).offset();
        var photoOffset = photo.offset();
        //cursor pos on the curBox - left and top corner
        var mvElX = Math.ceil((e.pageX - mvOffset.left)/scaleFactor);
        var mvElY = Math.ceil((e.pageY - mvOffset.top)/scaleFactor);
        // console.log(nX, nY);
        photo.mousemove(function(e){
          //cursor pos on the photo - nX and nY
          var mvX = Math.ceil((e.pageX - photoOffset.left)/scaleFactor) - mvElX;
          var mvY = Math.ceil((e.pageY - photoOffset.top)/scaleFactor) - mvElY;
          // console.log(curBoxX, curBoxY);
          curBox.css({
            "left": mvX + "px",
            "top": mvY + "px"
          });
          boxCursorX.val(mvX);
          boxCursorY.val(mvY);
        }).mouseup(function(){
          photo.off("mousemove");
        });
      });

      
      //moving to top
      curBox.find($(".p-t")).mousedown(function(e){
        e.stopPropagation();

        var ptPos = boxCursorY.val();
        var ptH = boxHeight.val();
        var ptHelperY = Math.ceil((e.pageY - $(this).offset().top)/scaleFactor) - 4;
        var photoOffset = photo.offset();

        photo.mousemove(function(e){
          var ptA = (+ptPos) + +ptH;
          var ptB = Math.ceil((e.pageY - photoOffset.top)/scaleFactor) - ptHelperY;
          curBox.css({
            "top":  ptB + "px",
            "height": ptA - ptB + "px"
          });
          
          boxCursorY.val(ptB);
          boxHeight.val(ptA - ptB);
          curBox.attr("data-height", boxHeight.val());
         
        }).mouseup(function(){
          photo.off("mousemove");
        });
        
      });

      //moving to bottom
      curBox.find($(".p-b")).mousedown(function(e){
        e.stopPropagation();

        var pbPos = boxCursorY.val();
        var pbHelperY = Math.ceil((e.pageY - $(this).offset().top)/scaleFactor) - 4;
        var photoOffset = photo.offset();

        photo.mousemove(function(e){
          var pbB = Math.ceil((e.pageY - photoOffset.top)/scaleFactor) - pbHelperY;
          curBox.css({
            "height": pbB - +pbPos + "px"
          });
   
          boxHeight.val(pbB - +pbPos);
          curBox.attr("data-height", boxHeight.val());
         
        }).mouseup(function(){
          photo.off("mousemove");
        });
        
      });

      //moving to right
      curBox.find($(".p-r")).mousedown(function(e){
        e.stopPropagation();

        var prPos = boxCursorX.val();
        var prHelperX = Math.ceil((e.pageX - $(this).offset().left)/scaleFactor) - 4;
        var photoOffset = photo.offset();

        photo.mousemove(function(e){
          var prB = Math.ceil((e.pageX - photoOffset.left)/scaleFactor) - prHelperX;
          curBox.css({
            "width": prB - +prPos + "px"
          });
   
          boxWidth.val(prB - +prPos);
          curBox.attr("data-width", boxWidth.val());
         
        }).mouseup(function(){
          photo.off("mousemove");
        });
        
      });

      //moving to left
      curBox.find($(".p-l")).mousedown(function(e){
        e.stopPropagation();

        var plPos = boxCursorX.val();
        var plW = boxWidth.val();
        var plHelperX = Math.ceil((e.pageX - $(this).offset().left)/scaleFactor) - 4;
        var photoOffset = photo.offset();

        photo.mousemove(function(e){
          var plA = (+plPos) + +plW;
          var plB = Math.ceil((e.pageX - photoOffset.left)/scaleFactor) - plHelperX;
          curBox.css({
            "left":  plB + "px",
            "width": plA - plB + "px"
          });
          
          boxCursorX.val(plB);
          boxWidth.val(plA - plB);
          curBox.attr("data-width", boxWidth.val());
         
        }).mouseup(function(){
          photo.off("mousemove");
        });
        
      });

      applyButton.click(function(){
        var boxWidthVal = boxWidth.val();
        var boxHeightVal = boxHeight.val();
        $(".box.active").css({
          "left": boxCursorX.val() + "px",
          "top": boxCursorY.val() + "px",
          "width": boxWidthVal + "px",
          "height": boxHeightVal + "px"
        }).attr("data-width", boxWidthVal).attr("data-height", boxHeightVal);
      });
    }
  };

  var done = function(){
    edited = true;
    photo.off("mousemove");
    var curBox = $(".box.active");
    
    var pt = curBox.find($(".p-t"));
    var pr = curBox.find($(".p-r"));
    var pb = curBox.find($(".p-b"));
    var pl = curBox.find($(".p-l"));
    curBox.add(pt).add(pr).add(pb).add(pl).off("mousedown");
    
    doneButton.hide();
    applyButton.hide();
    boxCursorX.add(boxCursorY).add(boxWidth).add(boxHeight).val('');
    curBox.removeClass("active");
    editSize.prop("disabled", false);
  };

  $(document).keydown(function (e) {
    if (e.keyCode == 16) {
      boxCursorX.add(boxCursorY).add(boxWidth).add(boxHeight).attr("step", 10);
    }
  }).keyup(function (e) {
    if (e.keyCode == 16) {
      boxCursorX.add(boxCursorY).add(boxWidth).add(boxHeight).attr("step", "");
    }
  });

  // Done button
  doneButton.click(function(){
    done();
  });
  
  var editSize = $("#editSize");
  var elementsBox;
  photo.click(function(e){
    if($("#sizeTool").is(":checked")){
      if(edited && editSize.is(":checked") != true) {
        var parentOffset = $(this).offset();
        var relX = Math.ceil((e.pageX - parentOffset.left)/scaleFactor);
        var relY = Math.ceil((e.pageY - parentOffset.top)/scaleFactor);
        var boxWidthVal = 100;
        var boxHeightVal = 20;
        boxCount++;
        var box = $('<div class="box box-' + boxCount + '"></div>').css({
          "left": relX,
          "top": relY,
          "width": boxWidthVal + "px",
          "height": boxHeightVal + "px"
        })
        .appendTo(photoIn)
        .addClass("active")
        .attr("data-width", boxWidthVal)
        .attr("data-height", boxHeightVal);

        $('<div class="point p-t"></div>').appendTo(box);
        $('<div class="point p-r"></div>').appendTo(box);
        $('<div class="point p-l"></div>').appendTo(box);
        $('<div class="point p-b"></div>').appendTo(box);

      
        boxCursorX.val(relX);
        boxCursorY.val(relY);
        boxWidth.val(boxWidthVal);
        boxHeight.val(boxHeightVal);
        change();
        elementsBox = $(".box");
        editSizeFunc();
      }
    }
  });

  var editSizeFunc = function(){
      elementsBox.click(function(e){
        
        if($("#sizeTool").is(":checked") && edited && editSize.is(":checked")){
          var offset = $(this).offset();
          var offsetParent = $(this).parent().offset();
          var relX = Math.ceil((offset.left - offsetParent.left)/scaleFactor);
          var relY = Math.ceil((offset.top - offsetParent.top)/scaleFactor);
          // console.log(relX, relY);
          $(this).addClass("active");
          boxCursorX.val(relX);
          boxCursorY.val(relY);
          boxWidth.val($(this).width()/scaleFactor);
          boxHeight.val($(this).height()/scaleFactor);

          change();
        }
      });
  };

  var editSpot = function(el){
    if(el.hasClass("active")){
      if(infoSubject.val() != ''){
        el.attr("data-subject", infoSubject.val());
      } else {
        el.attr("data-subject", '');
      }
      
      if(infoDescription.val() != ''){
        el.attr("data-description", infoDescription.val());
      } else {
        el.attr("data-description", '');
      }
      
      el.attr("data-color", $("#colors").find("input:checked").val());
      el.find(".spot-in").css("backgroundColor",  $("#colors").find("input:checked").val());
      
      if(el.attr("data-subject") != '' || el.attr("data-description") != ''){
        el.addClass("has-info");
      } 
      if(el.attr("data-subject") == '' && el.attr("data-description") == ''){
        el.removeClass("has-info");
      }
      el.removeClass("active");
      resetForm();
    }
  };

  // setting the spot
  var spotEdited = true;
  photo.click(function(e){
    if($("#spotTool").is(":checked") && spotEdited){
      var parentOffset = $(this).offset();
      var relX = (e.pageX - parentOffset.left)/scaleFactor;
      var relY = (e.pageY - parentOffset.top)/scaleFactor;
      spotCount++;
      var spotBox = $('<div class="spot active"><span class="spot-in" id="spot'+spotCount+'" data-id="'+spotCount+'"></span></div>').css({
        "left": relX,
        "top": relY,
      }).appendTo(photoIn);
      downloadLink.hide();
      spotEdited = false;
      if(spotEdited == false && spotBox.length != 0) {
        infoAddButton.click(function(){
          var spotBox = $(".spot.active");
          editSpot(spotBox);
          downloadLink.hide();
        });
      }
    }
  });

  //showing the generate HTML section
  photo.click(function(){
    if($(".box").length > 0 || $(".spot").length > 0) {
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
            $(this)[0].className = $(this)[0].className.replace(/box\-\d/g, '');
            $(this).addClass("box-" + i);
          });
        }
      });
    }
    //removing spots
    if(elementsSpot.length != 0){
      elementsSpot.click(function(){
        if(removeTool.is(":checked")){
          $(this).remove();
          downloadLink.hide();
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
          resetForm();
          if(self.hasClass("has-info")){
            infoSubject.val(self.attr("data-subject"));
            infoDescription.val(self.attr("data-description"));
            $("#colors").find(':radio[value="'+ self.attr("data-color") +'"]').prop("checked", true);
          }

          infoAddButton.click(function(){
            editSpot(self);
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
    done();
    //setting the orientation
    var boxes = photo.find(".box");
    // console.log(boxes);
    boxes.each(function(){
      var x = $(this).attr("data-width");
      var y = $(this).attr("data-height");
      // console.log(x , y);
      if(+x > +y){
        $(this).addClass("w");
        $(this).removeClass("h");
      } else {
        $(this).addClass("h");
        $(this).removeClass("w");
      }
    });

    var filename = $('#imageInput').val().split('\\').pop();
    var htmlHeader = '{$header}';
    var htmlFooter = "{$footer}";
    var htmlMain = '{$main}';
    var htmlInformation = function(){
      var elementsSpot = $(".spot");
      var text = '';
      elementsSpot.each(function(){
        if($(this).hasClass("has-info")){
          var htmlId = $(this).find(".spot-in").attr("data-id");
          var htmlSubject = $(this).attr("data-subject");
          var htmlDescription = $(this).attr("data-description");
          text = text + '{$line}';
        }
      });
      return text;
    };
    var htmlSide = '{$side}';
    var html = htmlHeader + htmlMain + htmlSide + htmlFooter;
    var link = $('#downloadLink');
    link.attr("href", makeHTMLFile(html)).css("display", "block");
  });


});