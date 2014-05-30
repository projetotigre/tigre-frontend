/**
 * Number.prototype.format(n, x, s, c)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

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
	
	$(".chosen").chosen({width:'100%'});

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
	$.getJSON('http://projetotigre.com.br/api/v1/naturezas_juridicas', function(data){

		var template = $('#naturezas-juridicas-tpl').html(); //pega o template		
		var html = Mustache.to_html(template, { naturezas_juridicas:data}); //insere as variaveis no template
		
		$('#naturezas-juridicas').append(html); //exibe na div com #areas-atuacao
		$('#naturezas-juridicas').trigger("chosen:updated");
	});

	var template = $('#select-ano-tpl').html(); //pega o template		
	var html = Mustache.to_html(template, { anos: years(2007)}); //insere as variaveis no template
	$('#ano').html(html);
	$('#ano').trigger("chosen:updated");

});