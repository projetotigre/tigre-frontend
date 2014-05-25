/*function initializeMarkers(options)
{
    $(options.seletor).gMap({
        address: options.center,
        zoom: options.zoom,
        markers: options.markers
    });
}*/

/*var macDoList = [
{lat:49.00408,lng:2.56228,data:{drive:false,zip:93290,city:"TREMBLAY-EN-FRANCE"}},
{lat:49.00308,lng:2.56219,data:{drive:false,zip:93290,city:"TREMBLAY-EN-FRANCE"}},
{lat:48.93675,lng:2.35237,data:{drive:false,zip:93200,city:"SAINT-DENIS"}}];*/

	// This example creates circles on the map, representing
	// populations in North America.

	// First, create an object containing LatLng and population for each city.
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

	function initialize() {
	  // Create the map.
	  var mapOptions = {
	    zoom: 4,
	    center: new google.maps.LatLng(37.09024, -95.712891),
	    mapTypeId: google.maps.MapTypeId.TERRAIN
	  };

	  var map = new google.maps.Map(document.getElementById('map'),
	      mapOptions);

	  // Construct the circle for each value in citymap.
	  // Note: We scale the area of the circle based on the population.
	  for (var city in citymap) {
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
	  }
	}

	google.maps.event.addDomListener(window, 'load', initialize);

	/*$("#map").gmap3({	
		circle:{
			options:{
				center: [37.772323, -122.214897],
				radius : 250,
				fillColor : "#008BB2",
				strokeColor : "#005BB7"
			},
			callback: function(){
				$(this).gmap3('get').setZoom(15);
			}
		},}
	});*/

    /*$("#map").gmap3({
         map:{
              zoom: 5,
              options: {
              center:[46.578498,2.457275],
              mapTypeId: google.maps.MapTypeId.TERRAIN
            }
        },        
        marker: {
            values: macDoList,

            cluster:{
                  radius:100,
              // This style will be used for clusters with more than 0 markers
              0: {
                    content: "<div class='cluster cluster-1'>CLUSTER_COUNT</div>",
                    width: 53,
                    height: 52
              },
              // This style will be used for clusters with more than 20 markers
              20: {
                    content: "<div class='cluster cluster-2'>CLUSTER_COUNT</div>",
                    width: 56,
                    height: 55
              },
              // This style will be used for clusters with more than 50 markers
              50: {
                    content: "<div class='cluster cluster-3'>CLUSTER_COUNT</div>",
                    width: 66,
                    height: 65
              }
        },
        options: {
              icon: new google.maps.MarkerImage("http://maps.gstatic.com/mapfiles/icon_green.png")
        },
        events:{
              mouseover: function(marker, event, context){
            $(this).gmap3(
                  {clear:"overlay"},
                  {
                      overlay:{
                            latLng: marker.getPosition(),
                            options:{
                                  content:  "<div class='infobulle"+(context.data.drive ? " drive" : "")+"'>" +
                                              "<div class='bg'></div>" +
                                              "<div class='text'>" + context.data.city + " (" + context.data.zip + ")</div>" +
                                            "</div>" +
                                            "<div class='arrow'></div>",
                                  offset: {
                                        x:-46,
                                        y:-73
                                  }
                            }
                      }
                });
      },
      mouseout: function(){
            $(this).gmap3({clear:"overlay"});
      }
    }
  }
});*/
