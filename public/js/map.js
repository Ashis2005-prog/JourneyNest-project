  // console.log("92w5nQqqSmygHmA6sd6x");
  // maptilersdk.config.apiKey ="92w5nQqqSmygHmA6sd6x";
  // const map = new maptilersdk.Map({
  //   container: 'map', // container's id or the HTML element to render the map
  //   style: maptilersdk.MapStyle.STREETS,
  //   center: [12.550343, 55.665957], // starting position [lng, lat]
  //   zoom: 9, // starting zoom
  // });

  let map;
        let autocomplete;
 
        function initMap() {
            // Create the map centered on a default location
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat:20.296059 ,lng:85.824539 }, // Default to Sydney, Australia
                zoom: 13
            });
 
            const input = document.getElementById('pac-input');
 
            // Create the autocomplete object and bind it to the input field
            autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.bindTo('bounds', map);
 
            // Set up the event listener for when the user selects a place
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    console.log("No details available for the input: '" + place.name + "'");
                    return;
                }
 
                if (place.geometry.viewport) {
                    map.fitBounds(place.geometry.viewport);
                } else {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17); // Zoom to 17 if the place has no viewport
                }
 
                // Place a marker on the selected location
                new google.maps.Marker({
                    position: place.geometry.location,
                    map: map
                });
            });
        }