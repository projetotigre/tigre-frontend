$('document').ready(function(){	
	
	$('.config-btn').click(function()
	{
		if (!$(this).hasClass("open")) 
		{		        
			$(this).css("right", "200px");
			$('.config-box').css("right", "0");
			$(this).addClass("open", {duration:1000});
		} else {
			$(this).css("right", "0");
			$('.config-box').css("right", "-200px");
			$(this).removeClass("open", {duration:1000})
		}
	});	

	$.getJSON('http://localhost/tigre/frontend/data/areas_atuacao', function(data){

		$.each(function(){
			$('#areas-atuacao .checkbox').each({
				
			});
		})
		
	});
});