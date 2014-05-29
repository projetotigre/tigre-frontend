
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
		var template = $('#convenios-table-tpl').html(); //pega o template

		function carregaDados()
		{
			//faz uma requisicação ajax e exibe os dados de acordo com um template
			$.getJSON('http://107.170.175.95/api/v1/convenios', function(data){

				var markers = [];

        		var html = Mustache.to_html(template, { convenios:data.organizacoes}); //insere as variaveis no template

        		$('#table-convenios').append(html); //exibe na div com #areas-atuacao

				$.each(data.organizacoes, function(index, ponto){

					var address = ponto.endereco + ', ' + ponto.cidade + ', ' + ponto.estado;

					convertAddressToLatLng(address, function( latLng ){

						convenioOptions = {
					  		strokeColor: '#00ff00',
					  		strokeOpacity: 0.8,
					  		strokeWeight: 2,
					  		fillColor: '#00ff00',
					  		fillOpacity: 0.35,
					  		map: map,
					  		center: latLng,
					  		radius: Math.sqrt(ponto.valor_repasse_uniao) * 100
					  	};

					    // Add the circle for this city to the map.
					    cityCircle = new google.maps.Circle(convenioOptions);

						/*//intanciando marcadores
			            var marker = new google.maps.Marker({
			              position: result,
			              title: "Meu ponto personalizado! :-D",
			              map: map
			            });

						markers.push(marker);*/
					});

        		});

				markerCluster = new MarkerClusterer(map, markers);
			});
		}

		carregaDados();
	}

	google.maps.event.addDomListener(window, 'load', initialize);

});
