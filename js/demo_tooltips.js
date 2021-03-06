$tooltipbox = $(".tooltipbox");
$tooltipbox_stop = $(".tooltipbox_stop");
/*
  $(' .tooltips').hover(function() {
    $tooltipbox.addClass('active');
    console.log('hover');
    $tooltipbox.html($(this).attr('id'));
  }, function() {
    $tooltipbox.removeClass('active');
  });
*/

/*
var arcs = document.getElementsByClassName('tooltips');

// this handler will be executed every time the cursor is moved over a different list item
arcs.addEventListener("mouseover", function( event ) {   
  // highlight the mouseover target
  event.target.style.color = "orange";
  $tooltipbox.addClass('active');
  console.log('hover');
  $tooltipbox.html(arcs.id);
  }, 
  function() {
  $tooltipbox.removeClass('active');
  });
*/


$('svg').on('mouseover', '.tooltips-seg', function(){
    $tooltipbox.addClass('active');
    console.log('stop hover '+$(this).attr('id'));
    $tooltipbox.html($(this).attr('id'));
  //}, function() {
  //  $tooltipbox.removeClass('active');
  });
$('svg').on('mouseleave', '.tooltips-seg', function(){
    $tooltipbox.removeClass('active');
  });


$('svg').on('mouseover', '.tooltips-stop', function(){
    $tooltipbox_stop.addClass('active');
    console.log('stop hover '+$(this).attr('id'));
    $tooltipbox_stop.html($(this).attr('id'));
  //}, function() {
  //  $tooltipbox.removeClass('active');
  });
$('svg').on('mouseleave', '.tooltips-stop', function(){
    $tooltipbox_stop.removeClass('active');
  });



$(document).on('mousemove', function(e){  
  $tooltipbox.css({
    left:  e.pageX,
    top:   e.pageY - 70
  });

  $tooltipbox_stop.css({
    left:  e.pageX,
    top:   e.pageY - 70
  });


  
});