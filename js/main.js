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

	//faz uma requisicação ajax e exibe os dados de acordo com um template
	$.getJSON('http://localhost/tigre/frontend/data/areas_atuacao', function(data){

		var data =  { areas_atuacao:data}; //seta os dados na key areas_atuacao
		var template = $('#areas-atuacao-tpl').html(); //pega o template		
		var html = Mustache.to_html(template, data); //insere as variaveis no template
		
		$('#areas-atuacao').html(html); //exibe na div com #areas-atuacao
		
	});
});