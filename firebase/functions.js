// Global Map Variable
var map;
//GLOBAL
var category_filter = 'none';
// Global for Firebase fill
var geojson = {
    'type': 'FeatureCollection',
    'features': []
};

var userCoords = '';
var radiusKM = 0;
var searchRadius;
var resultsList = [];
var searchCenter;
var lng;
var lat;
var showMap = 'false';
var showListing = 'true';
var showFilters = 'false';

//GLOBALS
$('#showFilters').click(function(){
    if (showFilters === 'false'){
        showFilters = 'true';
        document.getElementById("filterPanel").style.display = "block";
    }else{
        showFilters = 'false';
        document.getElementById("filterPanel").style.display = "none";
    }
})

$('#toggleMap').click(function(){
    // alert('toggle map')
    if (showMap === 'false'){
        
        showMap = 'true';
        showListing = 'false';

        // document.getElementById("map").style.zIndex = 1000;
        // document.getElementById("listingCards").style.zIndex = 999;
        $( "#map" ).show()
        $( "#listingCards").hide()

    }else{
        showMap = 'false';
        showListing = 'true';

        // document.getElementById("map").style.zIndex = 999;
        // document.getElementById("listingCards").style.zIndex = 1000;
       
        $( "#map" ).hide()
        $( "#listingCards").show()

    }
})

$('#toggleList').click(function(){
    if (showListing === 'false'){
        
        showListing = 'true';
        showMap = 'false';
        $( "#map" ).hide()
        $( "#listingCards").show()

        // document.getElementById("map").style.zIndex = 999;
        // document.getElementById("listingCards").style.zIndex = 1000;

    }else{
        showListing = 'false';
        showMap = 'true';
        
        // document.getElementById("map").style.zIndex = 1000;
        // document.getElementById("listingCards").style.zIndex = 999;
        $( "#map" ).show()
        $( "#listingCards").hide()

    }
})


// Click Map to add Listing
function addListing0(){

    alert('Click on Map to add new Listing...');
    
    //Change Cursor
    map.on('mousemove', (e) => {
        map.getCanvas().style.cursor = 'crosshair';
    })

    // Click Listener
    map.on('click', function (e) {
        //Change Cursor
        map.getCanvas().style.cursor = 'grab';

        // Get Coords
        lng = e.lngLat.lng;
        lat = e.lngLat.lat;

        //Show data form
        document.getElementById("clickForm").style.display = "block";
        
        // create radius around user Location
        //  L.circle(e.latlng, 500000).addTo(map);
    });  
}

function runClickForm(){
    // alert('Running...')
    //  Declare Global Variables
    var Name =  'No Data';
    var Category  = 'No Data';
    var Rating = 'No Data';
    var Image_URL = 'No Data';
    var Position = 'No Data';
    


    // GET Form Data

    Name = document.getElementById("posted_by");
    localStorage.setItem("0", Name.value);

    Rating = document.getElementById("rating");
    localStorage.setItem("1", Rating.value);

    Category = document.getElementById("category");
    localStorage.setItem("2", Category.value);

    Image_URL = document.getElementById("img_url");
    localStorage.setItem("3", Image_URL.value);

    Position = document.getElementById("position");
    localStorage.setItem("4", Position.value);

    var entry0 = localStorage.getItem("0");
    var entry1 = localStorage.getItem("1");
    var entry2 = localStorage.getItem("2");
    var entry3 = localStorage.getItem("3");
    var entry4 = localStorage.getItem("4");

    // GET Form Data END

        // fbRef = Firebase Reference
        fbRef.child('data').push()
            .set({
                Position: entry4, Rating: entry1,
                Category: entry2, Image: entry3,
                Posted: entry0, Latitude: lat,
                Longitude: lng

            });
        
        // alert('Pushed Success...')

        location.reload();
}

// Fill GeoJson from Firebase Database Retrieve Data
function populateMap() {
    // alert('Connecting to Database...');

    // Add CSV 0 Firebase
    var entries = fbRef.child('data');

    entries.on('value', function (snapshot) {
        
        

        //alert('Trying Snapshot Add FOR Each...');
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();

            var fc = {
                'type': 'Feature',
                'properties': {
                    'Position': childData.Position,
                    'Category': childData.Category,
                    'Rating': childData.Rating,
                    'Image': childData.Image,
                    'Listing_URL': childData.Listing_URL
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [childData.Longitude, childData.Latitude]
                }
            }

            geojson.features.push(fc);
            // alert('Pushed...')
        })

        // console.log(geojson.features)
        var data = geojson;

        
        // // add a clustered GeoJSON source for listing
        // map.addSource('listings', {
        //     'type': 'geojson',
        //     'data': data,
        //     'cluster': true,
        //     'clusterRadius': 80
        // });

        
        if (category_filter === 'none') {
            // alert('no filter');
            // Add Markers
            data.features.forEach(function (marker) {


                // create a HTML element for each feature
                var el = document.createElement('div');
                el.className = 'marker';
                el.id = 'unclustered-point';
                el.filter = ['!', ['has', 'point_count']];

                //Create Listing URL
                var listing_hardCode = 'https://modernaddis.com/listings/';
                var listing_Destination = marker.properties.Position.split(' ').join('-');
                var listingHref = listing_hardCode + listing_Destination + '/'
                

                //Check for Image
                if (typeof marker.properties.Image !== "undefined") {
                    var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                        "<img src=" + '"' +
                        marker.properties.Image
                        + '"' +
                        "width = 185em alt=" + '"Listing-pic"' + "/><hr />" +
                        '<a class="popup_Anchor" href=' + '"' + listingHref + '"'
                        + ' target="_parent"><strong>' + marker.properties.Position + '</strong></a>'
                        + '</br><strong>Rating: </strong>'
                        + marker.properties.Rating
                    );

                    // make a marker for each feature and add to the map
                    new mapboxgl.Marker(el)
                        .setLngLat(marker.geometry.coordinates)
                        .setPopup(popup)
                        .addTo(map);
                }else{
                    var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                        '<a class="popup_Anchor" href=' + '"' + listingHref + '"'
                        + ' target="_parent" ><strong>' + marker.properties.Position + '</strong></a>'
                        + '</br><strong>Rating: </strong>'
                        + marker.properties.Rating
                    );

                    // make a marker for each feature and add to the map
                    new mapboxgl.Marker(el)
                        .setLngLat(marker.geometry.coordinates)
                        .setPopup(popup)
                        .addTo(map);

                }

                

                


            }); //Add Markers END

            // Add Listing Ball Card
            data.features.forEach(function (listingCard) {
                let dugout = document.getElementById('listingCards');
                let cardDiv = document.createElement('div')
                let newLine = document.createElement('BR')
                let cardImg = document.createElement('img');
                let cardPar = document.createElement('p');
                let a = document.createElement('a');
                let h = document.createElement("H4");

                cardImg.classList.add('cardImg');
                cardImg.src = listingCard.properties.Image
                cardImg.alt = 'listing-Visual-Not-Available'
                
                let cardPosition = document.createTextNode(listingCard.properties.Position);
                let cardCategory = document.createTextNode(listingCard.properties.Category);

                cardDiv.classList.add('card');





                // Build Card
                dugout.appendChild(cardDiv);

                //Add Image If Image Available
                if (typeof listingCard.properties.Image !== "undefined"){
                    cardDiv.appendChild(cardImg);
                    // alert('Found Image!!!')
                }

                cardDiv.appendChild(cardPar);
                h.appendChild(cardPosition);
                h.appendChild(newLine);
                cardPar.appendChild(cardCategory);

                
                //Create Listing URL
                var listing_hardCode = 'https://modernaddis.com/listings/';
                var listing_Destination = listingCard.properties.Position.split(' ').join('-');
                var listingHref = listing_hardCode + listing_Destination + '/'

                //Create Link
                a.appendChild(h);
                a.href = listingHref;
                a.target = '_parent';
                


                cardDiv.appendChild(a);
                cardDiv.appendChild(cardPar);

            });

        } else {
            // Add Markers
            data.features.forEach(function (marker) {


                // create a HTML element for each feature
                var el = document.createElement('div');
                el.className = 'marker';
                el.id = 'unclustered-point';
                el.filter = ['!', ['has', 'point_count']];

                if (marker.properties.Category === category_filter) {
                    //Create Listing URL
                    var listing_hardCode = 'https://modernaddis.com/listings/';
                    var listing_Destination = marker.properties.Position.split(' ').join('-');
                    var listingHref = listing_hardCode + listing_Destination + '/'


                    //Check for Image
                    if (typeof marker.properties.Image !== "undefined") {
                        var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                            "<img src=" + '"' +
                            marker.properties.Image
                            + '"' +
                            "width = 185em alt=" + '"Listing-pic"' + "/><hr />" +
                            '<a class="popup_Anchor" href=' + '"' + listingHref + '"'
                            + ' target="_parent"><strong>' + marker.properties.Position + '</strong></a>'
                            + '</br><strong>Rating: </strong>'
                            + marker.properties.Rating
                        );

                        // make a marker for each feature and add to the map
                        new mapboxgl.Marker(el)
                            .setLngLat(marker.geometry.coordinates)
                            .setPopup(popup)
                            .addTo(map);
                    } else {
                        var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                            '<a class="popup_Anchor" href=' + '"' + listingHref + '"'
                            + ' target="_parent" ><strong>' + marker.properties.Position + '</strong></a>'
                            + '</br><strong>Rating: </strong>'
                            + marker.properties.Rating
                        );

                        // make a marker for each feature and add to the map
                        new mapboxgl.Marker(el)
                            .setLngLat(marker.geometry.coordinates)
                            .setPopup(popup)
                            .addTo(map);

                    }
                }
            }); //Add Markers END

            // Add Listing Ball Card
            data.features.forEach(function (listingCard) {
                let dugout = document.getElementById('listingCards');
                let cardDiv = document.createElement('div')
                let newLine = document.createElement('BR')
                let cardImg = document.createElement('img');
                let cardPar = document.createElement('p');
                let a = document.createElement('a');
                let h = document.createElement("H4");

                cardImg.classList.add('cardImg');

                if (listingCard.properties.Category === category_filter) {
                    cardImg.src = listingCard.properties.Image
                    cardImg.alt = 'listing-Visual-Not-Available'
                    let cardPosition = document.createTextNode(listingCard.properties.Position);
                    let cardCategory = document.createTextNode(listingCard.properties.Category);

                    cardDiv.classList.add('card');

                    // Build Card
                    dugout.appendChild(cardDiv);

                    //Add Image If Image Available
                    if (typeof listingCard.properties.Image !== "undefined") {
                        cardDiv.appendChild(cardImg);
                        // alert('Found Image!!!')
                    }

                    cardDiv.appendChild(cardPar);
                    h.appendChild(cardPosition);
                    h.appendChild(newLine);
                    cardPar.appendChild(cardCategory);


                    //Create Listing URL
                    var listing_hardCode = 'https://modernaddis.com/listings/';
                    var listing_Destination = listingCard.properties.Position.split(' ').join('-');
                    var listingHref = listing_hardCode + listing_Destination + '/'

                    //Create Link
                    a.appendChild(h);
                    a.href = listingHref;
                    a.target = '_parent';



                    cardDiv.appendChild(a);
                    cardDiv.appendChild(cardPar);
                }
            });

        }


    

        ////////
        

        

        


          

        
    })

   
    // console.log(geojson.features)

} //populateGeoJson

function filterMap(i){
    const filters = ['Food', 'Play', 'Bakery', 'Park', 'Hotels', 'Movie', 'Gallery'];
    category_filter = filters[i];

    $( ".marker" ).remove();
    $(".card").remove();
    geojson = {
        'type': 'FeatureCollection',
        'features': []
    };

    populateMap();
    // alert(filters[i])
}

// // Click Listener
// map.on('click', function (e) {
//          alert(e.lngLat);
//          // create radius around user Location
//         //  L.circle(e.latlng, 500000).addTo(map);

        
//      });

