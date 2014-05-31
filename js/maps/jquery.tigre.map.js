
function convertAddressToLatLng(address, geocode_callback)
{
	var lat_lng;

	geocoder.geocode( { 'address': address}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {

			lat_lng = results[0].geometry.location;

			geocode_callback(lat_lng);

//	        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {    
//			setTimeout(2000);

		} else {
			console.log('Geocode was not successful for the following reason: ' + status);
		}

	});

}



$('document').ready(function()
{

	var location = new google.maps.LatLng(-15.7217621,-47.9382362);
	var latLng;	
	var infowindow = new google.maps.InfoWindow();

	var cityCircle;

	function initialize()
	{

		geocoder = new google.maps.Geocoder();

		// Create the map.
		var mapOptions = {
		  	zoom: 4,
		  	center: location,
		  	mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		var map = new google.maps.Map(document.getElementById('map'), mapOptions);		
		var markerCluster;
		var markers = [];
		var circles = [];
		var ano, natureza_juridica;
		var circle_color;
		var mark_icon;

		function clearMap(){
			//apaga os markers		
			jQuery.each(markers, function(i, marker){
			  	marker.setMap(null);
			});
			
			markers = [];

			//apaga os circulos
			jQuery.each(circles, function(i, circle){
			  	circle.setMap(null);
			});
			circles = [];
		}

		function carregaDados(ano, natureza_juridica)
		{
			ano = ano || 2014;
			natureza_juridica = natureza_juridica || '';			

			//faz uma requisicação ajax e exibe os dados de acordo com um template
			$.getJSON('http://projetotigre.com.br/api/v1/convenios', { 'ano': ano, 'natureza_juridica': natureza_juridica },function(data){
							
        		if(data.organizacoes.length)
        		{

        			var template = $('#convenios-table-tpl').html(); //pega o template
	        		var html = Mustache.to_html(template, {convenios:data.organizacoes}); //insere as variaveis no template
	        		$('#table-convenios').append(html); 

				$.each(data.organizacoes, function(index, ponto){

					var address = ponto.endereco + ', ' + ponto.cidade + ', ' + ponto.estado;

					switch (ano){
//						case "Entidade Privada Sem Fins Lucrativos":				
						case "2014":				
						circle_color="#3FA7D8"
						break;			
						case "2013":				
						circle_color="#F00000";
						break;											
						case "2012":				
						circle_color="#AFA000"
						break;											
						case "2011":				
						circle_color="#0AFA00"
						break;											
						case "2010":				
						circle_color="#00AFA0"
						break;			
						case "2009":				
						circle_color="#000AFA";
						break;											
						case "2008":				
						circle_color="#0000AF"
						break;											
						case "2007":				
						circle_color="#AAAAAA"
						break;											
					}

					convertAddressToLatLng(address, function( latLng ){

						convenioOptions = {
					  		strokeColor: circle_color,
					  		strokeOpacity: 0.8,
					  		strokeWeight: 2,
					  		fillColor: circle_color,
					  		fillOpacity: 0.35,
					  		map: map,
					  		center: latLng,
					  		radius: Math.sqrt(ponto.valor_repasse_uniao) * 80
						};

						// Add the circle for this city to the map.
						cityCircle = new google.maps.Circle(convenioOptions);

						//intanciando marcadores
//						var marker = new google.maps.Marker({
//							position: latLng,
//							title: ponto.nome,
//							map: map
//		            			});

					switch (natureza_juridica){
						case "Entidade Privada Sem Fins Lucrativos":				
						mark_icon="img/markers/flag_blue_48.png"
						break;			
						case "2013":				
						mark_icon="img/markers/flag_red_48.png";
						break;											
						case "2012":				
						mark_icon="img/markers/flag_green_48.png"
						break;											
						case "2011":				
						mark_icon="img/markers/flag_blue_48.png"
						break;											
						case "2010":				
						mark_icon="img/markers/flag_blue_48.png"
						break;			
						case "2009":				
						mark_icon="img/markers/flag_blue_48.png";
						break;											
						case "2008":				
						mark_icon="img/markers/flag_blue_48.png"
						break;											
						case "2007":				
						mark_icon="img/markers/flag_blue_48.png"
						break;											
					}
						
						var marker = new MarkerWithLabel({
							position: latLng,
							draggable: false,
							raiseOnDrag: false,
							map: map,
							icon: mark_icon,
//							icon: 'img/markers/flag_blue_48.png',
//							labelContent: 'R$' + ponto.valor_repasse_uniao,
							labelContent: natureza_juridica,
							labelAnchor: new google.maps.Point(22, 0),
							labelClass: "labels", // the CSS class for the label
							labelStyle: {opacity: 0.75}
						});

						google.maps.event.addListener(marker, 'click', function() {
							infowindow.setContent('R$' + ponto.valor_repasse_uniao.format(2, 3, '.', ',') +' - ' +ponto.nome);
							infowindow.open(map, marker);
						});

						markers.push(marker);
						circles.push(cityCircle);
						markerCluster = new MarkerClusterer(map, markers);

					});

		        	});//endforeach

			}//end if lenght

		}); 
			
	}

		carregaDados();

		google.maps.event.addDomListener($('#ano')[0], 'change', function() 
		{
			var ano = $('#ano option:selected').val()
				
			clearMap();
			carregaDados(ano,natureza_juridica);

		});

		$("#ano").chosen().change(function(){
		    google.maps.event.trigger($(this)[0], 'change');
		});

		$("#naturezas-juridicas").chosen().change(function() {
		    google.maps.event.trigger($(this)[0], 'change');
		});

		google.maps.event.addDomListener($('#naturezas-juridicas')[0], 'change', function() 
		{

			var ano = $('#ano option:selected').val()
			var natureza_juridica = $('#naturezas-juridicas option:selected').val()

			console.log(natureza_juridica);
							
			clearMap();
			carregaDados(ano,natureza_juridica);
		});


	}

	google.maps.event.addDomListener(window, 'load', initialize);

});
