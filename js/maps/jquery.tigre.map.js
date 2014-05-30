
function convertAddressToLatLng(address, geocode_callback)
{
	var lat_lng;

	geocoder.geocode( { 'address': address}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {

			lat_lng = results[0].geometry.location;

			geocode_callback(lat_lng);

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

		function carregaDados(ano, natureza_juridica)
		{
			ano = ano || 2014;
			natureza_juridica = natureza_juridica || '';			

			//faz uma requisicação ajax e exibe os dados de acordo com um template
			$.getJSON('http://107.170.175.95/api/v1/convenios', { 'ano': ano },function(data){
				
				var template = $('#convenios-table-tpl').html(); //pega o template
        		var html = Mustache.to_html(template, {convenios:data.organizacoes}); //insere as variaveis no template
        		$('#table-convenios').append(html); 

				$.each(data.organizacoes, function(index, ponto){

					var address = ponto.endereco + ', ' + ponto.cidade + ', ' + ponto.estado;

					convertAddressToLatLng(address, function( latLng ){

						convenioOptions = {
					  		strokeColor: '#0000ff',
					  		strokeOpacity: 0.8,
					  		strokeWeight: 2,
					  		fillColor: '#0000ff',
					  		fillOpacity: 0.35,
					  		map: map,
					  		center: latLng,
					  		radius: Math.sqrt(ponto.valor_repasse_uniao) * 80
					  	};

					    // Add the circle for this city to the map.
					    cityCircle = new google.maps.Circle(convenioOptions);

						//intanciando marcadores
			            var marker = new google.maps.Marker({
			              position: latLng,
			              title: ponto.nome,
			              map: map
			            });


						google.maps.event.addListener(marker, 'click', function() {
					          infowindow.setContent('R$' + ponto.valor_repasse_uniao.format(2, 3, '.', ',') +' - ' +ponto.nome);
					          infowindow.open(map, marker);
					    });

						markers.push(marker);
						circles.push(cityCircle);
					});

        		});

				markerCluster = new MarkerClusterer(map, markers);

			});
		}

		carregaDados();

		google.maps.event.addDomListener($('#ano')[0], 'change', function() 
		{
			var ano = $('#ano option:selected').val()
				
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
			carregaDados(ano,natureza_juridica);

		});


		$(".nj-checkbox").change(function() {
		    google.maps.event.trigger($(this)[0], 'change');
		});

		google.maps.event.addDomListener($('#naturezas-juridicas')[0], 'change', function() 
		{

			var ano = $('#ano option:selected').val()
				
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
			carregaDados(ano,natureza_juridica);

		});


	}

	google.maps.event.addDomListener(window, 'load', initialize);

});
