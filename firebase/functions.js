// Global Map Variable
var map;
//GLOBAL
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

//GLOBALS

// Update Radius By Typing Km Values
// $('#search').change(search);

// var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
// mapboxClient.geocoding
//     .forwardGeocode({
//         query: 'Wellington, New Zealand',
//         autocomplete: false,
//         limit: 1
//     })
//     .send()
//     .then(function (response) {
//         if (
//             response &&
//             response.body &&
//             response.body.features &&
//             response.body.features.length
//         ) {
//             var feature = response.body.features[0];

//             var map = new mapboxgl.Map({
//                 container: 'map',
//                 style: 'mapbox://styles/mapbox/streets-v11',
//                 center: feature.center,
//                 zoom: 10
//             });
//             new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
//         }
//     });

// Search Around Geocoded Entry
// $('#geocode-entry').change(findPlace);


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
                    'Posted': childData.Posted,
                    'Image': childData.Image
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

        


        




    

        ////////

        data.features.forEach(function (marker) {

            
            // create a HTML element for each feature
            var el = document.createElement('div');
            el.className = 'marker';
            el.id = 'unclustered-point';
            el.filter = ['!', ['has', 'point_count']];
            

            var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                "<img src=" + '"' +
                marker.properties.Image
                + '"' +
                "width = 185em alt=" + '"Listing-pic"' + "/><hr />"
                + marker.properties.Position +
                '</br><strong>Rating: </strong>'
                + marker.properties.Rating
            );

            // make a marker for each feature and add to the map
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .setPopup(popup)
                .addTo(map);
            
            
        });

        

        


          

        
    })

   
    // console.log(geojson.features)

} //populateGeoJson



// // Click Listener
// map.on('click', function (e) {
//          alert(e.lngLat);
//          // create radius around user Location
//         //  L.circle(e.latlng, 500000).addTo(map);

        
//      });

