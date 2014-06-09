
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

	var brasil = new google.maps.LatLng(-15.7217621,-47.9382362);
	var latLng;	
	var infowindow = new google.maps.InfoWindow();

	var cityCircle;

	function initialize()
	{

		geocoder = new google.maps.Geocoder();

		// Create the map.
		var mapOptions = {
		  	zoom: 4,
		  	center: brasil,
		  	mapTypeId: google.maps.MapTypeId.TERRAIN
		};

		var map = new google.maps.Map(document.getElementById('map'), mapOptions);
		var markerCluster;
		var markers = [];
		var circles = [];
		var ano, natureza_juridica, area_atuacao;
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

		function carregaDados(ano, natureza_juridica, area_atuacao)
		{
			ano = ano || 2014;
			natureza_juridica = natureza_juridica || '';
			area_atuacao = area_atuacao || '';

			//faz uma requisicação ajax e exibe os dados de acordo com um template
			$.getJSON(BASE_URL + '/api/v1/convenios', { 'ano': ano, 'natureza_juridica': natureza_juridica, 'area_atuacao': area_atuacao },function(data){

				if(data.organizacoes.length)
				{
					var template = $('#convenios-table-tpl').html(); //pega o template
					var html = Mustache.to_html(template, {convenios:data.organizacoes}); //insere as variaveis no template
					$('#table-convenios').append(html); 

					$.each(data.organizacoes, function(index, ponto){

						var address = ponto.endereco + ', ' + ponto.cidade + ', ' + ponto.estado;

						var latLng = new google.maps.LatLng(ponto.latitude,ponto.longitude);

						var circle_colors = [
							'#330000', '#660000','#990000', '#CC0000', '#FF0000', '#FF3300', '#FF6600',
							'#FF9900', '#FFCC00', '#FFFF00', '#CCFF00', '#99FF00', '#33FF00', '#00FF00',
							'#00FF33', '#00FF66', '#00FF99', '#00FFCC', '#00FFFF', '#00CCFF', '#0099FF',
							'#0066FF', '#0033FF'
						];
						console.log(ponto.natureza_juridica_id);

						console.log(circle_colors[ponto.natureza_juridica_id]);

						
						convenioOptions = {
							strokeColor: circle_colors[ponto.natureza_juridica_id],
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

						mark_icon="img/markers/flag_blue_48.png";

						switch (natureza_juridica){

							case "1":
							mark_icon="img/markers/flag_blue_48.png";
							break;
							case "2":
							mark_icon="img/markers/flag_red_48.png";
							break;
							case "3":
							mark_icon="img/markers/flag_green_48.png";
							break;
							case "4":
							mark_icon="img/markers/flag_yellow_48.png";
							break;
							case "5":
							mark_icon="img/markers/flag_cyan_48.png";
							break;
							case "6":
							mark_icon="img/markers/flag_blue_48.png";
							break;
							case "7":
							mark_icon="img/markers/flag_blue_48.png";
							break;

						}
						
						var marker = new MarkerWithLabel({
							position: latLng,
							draggable: false,
							raiseOnDrag: false,
							map: map,
							icon: mark_icon,
//								icon: 'img/markers/flag_blue_48.png',
//								labelContent: 'R$' + ponto.valor_repasse_uniao,
							labelContent: natureza_juridica,
							labelAnchor: new google.maps.Point(22, 0),
							labelClass: "labels", // the CSS class for the label
							labelStyle: {opacity: 0.75}
						});

						var boxText = document.createElement("div");
    						boxText.innerHTML = 'Valor do Repasse = R$' + ponto.valor_repasse_uniao.format(2, 3, '.', ',') +' <BR> ' +ponto.nome;

						var InfoBoxOptions = {
	 						content: boxText,
							disableAutoPan: false,
							maxWidth: 0,
							pixelOffset: new google.maps.Size(-140, 0),
							zIndex: null,
							boxStyle: { 
								//background: "url('tipbox.gif') no-repeat",
								background: "#FFFFFF",
								opacity: 0.8,
								width: "280px"
							},
							closeBoxMargin: "2px 2px 2px 2px",
							closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
							infoBoxClearance: new google.maps.Size(1, 1),
							isHidden: false,
							pane: "floatPane",
							enableEventPropagation: false

						};


						google.maps.event.addListener(marker, 'click', function() {
							var ib = new InfoBox(InfoBoxOptions);
							ib.open(map, marker);		
						});

						markers.push(marker);
						circles.push(cityCircle);
						markerCluster = new MarkerClusterer(map, markers);					

					});//endforeach

				}//end if lenght

		}); 
			
	}

		carregaDados();

		google.maps.event.addDomListener($('#ano')[0], 'change', function() 
		{
			var ano = $('#ano option:selected').val()
			var natureza_juridica = $('#naturezas-juridicas option:selected').val()
			var area_atuacao = $('#areas-atuacao option:selected').val()

			console.log(area_atuacao);

			clearMap();
			carregaDados(ano, natureza_juridica, area_atuacao);

		});

		$("#ano").chosen().change(function(){
		    google.maps.event.trigger($(this)[0], 'change');
		});


		google.maps.event.addDomListener($('#naturezas-juridicas')[0], 'change', function() 
		{

			var ano = $('#ano option:selected').val()
			var natureza_juridica = $('#naturezas-juridicas option:selected').val()
			var area_atuacao = $('#areas-atuacao option:selected').val()

			console.log(area_atuacao);

			clearMap();
			carregaDados(ano, natureza_juridica, area_atuacao);
		});

		$("#naturezas-juridicas").chosen().change(function() {
		    google.maps.event.trigger($(this)[0], 'change');
		});

		google.maps.event.addDomListener($('#areas-atuacao')[0], 'change', function() 
		{

			var ano = $('#ano option:selected').val()
			var natureza_juridica = $('#naturezas-juridicas option:selected').val()
			var area_atuacao = $('#areas-atuacao option:selected').val()

			console.log(area_atuacao);

			clearMap();
			carregaDados(ano, natureza_juridica, area_atuacao);
		});

		$("#areas-atuacao").chosen().change(function() {
		    google.maps.event.trigger($(this)[0], 'change');
		});

	}

	google.maps.event.addDomListener(window, 'load', initialize);

});
