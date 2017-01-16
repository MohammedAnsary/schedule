$(document).ready(function(){
    var clicked = 0;
    $("#test"). click(function(){
        if(clicked == 0){
  $.ajax({
          type: 'Get',
          url: '/routes/index/plquery',
          dataType:'JSON'
      }).done(function(response){
          console.log("test");
      });            
        }
    })
});