
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

	var location = new google.maps.LatLng(37.09024, -95.712891);
	var latLng	

	var citymap = {};
	citymap['chicago'] = {
		center: new google.maps.LatLng(41.878113, -87.629798),
		population: 2714856
	};
	citymap['newyork'] = {
		center: new google.maps.LatLng(40.714352, -74.005973),
		population: 8405837
	};
	citymap['losangeles'] = {
		center: new google.maps.LatLng(34.052234, -118.243684),
		population: 3857799
	};
	citymap['vancouver'] = {
		center: new google.maps.LatLng(49.25, -123.1),
		population: 603502
	};

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

		 function carregaDados()
		 {
			//faz uma requisicação ajax e exibe os dados de acordo com um template
			$.getJSON('http://107.170.175.95/api/v1/convenios', function(data){
							
				var markers = [];

				$.each(data.organizacoes, function(index, ponto) {

					var address = ponto.endereco + ', ' + ponto.cidade + ', ' + ponto.estado;
					console.log(address);

					convertAddressToLatLng(address, function(result){
						
						console.log(result);
						
						//intanciando marcadores
			            var marker = new google.maps.Marker({
			                position: result,
			                title: "Meu ponto personalizado! :-D",
			                map: map
			            });

						 markers.push(marker)

						//add no mapa? help?									 
					});			

		        });

				markerCluster = new MarkerClusterer(map, markers);		
			});
		}

		carregaDados();
		
	  /*// Construct the circle for each value in citymap.
	  // Note: We scale the area of the circle based on the population.
	  for (var city in citymap) 
	  {
	  	var populationOptions = {
	  		strokeColor: '#FF0000',
	  		strokeOpacity: 0.8,
	  		strokeWeight: 2,
	  		fillColor: '#FF0000',
	  		fillOpacity: 0.35,
	  		map: map,
	  		center: citymap[city].center,
	  		radius: Math.sqrt(citymap[city].population) * 100
	  	};

	    // Add the circle for this city to the map.
	    cityCircle = new google.maps.Circle(populationOptions);
	}	*/

	/*google.maps.event.addDomListener(document.getElementById('dados-geral'), 'click', function() {
	
		latLng = convertAddressToLatLng('Brasil', function(result){
			map.setCenter(result);
		});

	});*/
}

google.maps.event.addDomListener(window, 'load', initialize);

});