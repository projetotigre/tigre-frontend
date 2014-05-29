function years(startYear) 
{
    var currentYear = new Date().getFullYear(), years = [];
    startYear = startYear || 1980;

    while ( startYear <= currentYear ) {
        years.push(currentYear--);
    } 

    return years;
}

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
	$.getJSON('http://107.170.175.95/api/v1/naturezas_juridicas', function(data){

		var template = $('#naturezas-juridicas-tpl').html(); //pega o template		
		var html = Mustache.to_html(template, { naturezas_juridicas:data}); //insere as variaveis no template
		
		$('#naturezas-juridicas').html(html); //exibe na div com #areas-atuacao		
	});

	var template = $('#select-ano-tpl').html(); //pega o template		
	var html = Mustache.to_html(template, { anos: years()}); //insere as variaveis no template
	$('#ano').html(html); //exibe na div com #areas-atuacao

});