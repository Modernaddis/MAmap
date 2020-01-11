// Update Radius By Typing Km Values
$('#search').change(search);

// Search Around Hospital By Selecting Dropdown
$('#selectHospital').change(hospitalSearch);

// Search Around Geocoded Entry
$('#geocode-entry').change(findPlace);


// Add CSV 0 Legacy
// csvLayer0 = omnivore.csv('Data/ABS.csv')
//     .on('ready', function () {

//         //Zoom to CSV Extent
//         map.fitBounds(csvLayer0.getBounds());

//         // Change Marker Symbol
//         this.eachLayer(function (marker0) {
//             marker0.setIcon(L.mapbox.marker.icon({
//                 'marker-symbol': 'disability',
//                 'marker-color': '#fa0',

//             }));

//             // if (marker0.toGeoJSON().properties.SERVICE_NAME === 'Medina Manor Aged Care') {

//             //     //Zoom to Selected
//             //     map.setView(marker0.getLatLng(), 15);

//             //     // Using simplestyle-spec: see MapBox spec for Details
//             //     marker0.setIcon(L.mapbox.marker.icon({
//             //         'marker-color': '#ff8888',
//             //         'marker-size': 'large'
//             //     }));
//             // } else {
//             //     marker0.setIcon(L.mapbox.marker.icon({}));
//             // }

//             // Bind a popup to each icon based on the same properties
//             var ageCareData = '<strong>Center: </strong>' + marker0.toGeoJSON().properties.SERVICE_NAME + '</br><strong>Vacancies: </strong>' + marker0.toGeoJSON().properties.Vacancy;
//             marker0.bindPopup(ageCareData);

//             map.setView([-29.497297, 123.777692], 4);

//         });

//         //Create Clusters
//         var markers0 = L.markerClusterGroup({
//             singleMarkerMode: false,
//             spiderfyOnMaxZoom: false,
//             showCoverageOnHover: false,
//             zoomToBoundsOnClick: true,

//             iconCreateFunction: function (cluster) {
//                 var childCount = cluster.getChildCount();
//                 var c = ' marker-cluster-';
//                 if (childCount < 10) {
//                     c += 'small';
//                 }
//                 else if (childCount < 100) {
//                     c += 'medium';
//                 }
//                 else {
//                     c += 'large';
//                 }

//                 return new L.DivIcon({
//                     html: '<div><span>' + childCount + '</span></div>',
//                     className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)
//                 });
//             }
//         });

//         map.addLayer(markers0);

//         markers0.addLayer(csvLayer0);
//     })

// Add CSV 0 Firebase
csvLayer0 = omnivore.csv('Data/ABS.csv')
    .on('ready', function () {

        //Zoom to CSV Extent
        map.fitBounds(csvLayer0.getBounds());

        // Change Marker Symbol
        this.eachLayer(function (marker0) {
            marker0.setIcon(L.mapbox.marker.icon({
                'marker-symbol': 'disability',
                'marker-color': '#fa0',

            }));

            

            // Bind a popup to each icon based on the same properties
            var ageCareData = '<strong>Center: </strong>' + marker0.toGeoJSON().properties.SERVICE_NAME + '</br><strong>Vacancies: </strong>' + marker0.toGeoJSON().properties.Vacancy;
            marker0.bindPopup(ageCareData);

            map.setView([-29.497297, 123.777692], 4);

        });

        //Create Clusters
        var markers0 = L.markerClusterGroup({
            singleMarkerMode: false,
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,

            iconCreateFunction: function (cluster) {
                var childCount = cluster.getChildCount();
                var c = ' marker-cluster-';
                if (childCount < 10) {
                    c += 'small';
                }
                else if (childCount < 100) {
                    c += 'medium';
                }
                else {
                    c += 'large';
                }

                return new L.DivIcon({
                    html: '<div><span>' + childCount + '</span></div>',
                    className: 'marker-cluster' + c, iconSize: new L.Point(40, 40)
                });
            }
        });

        map.addLayer(markers0);

        markers0.addLayer(csvLayer0);
    })
    

// Add CSV 1 FOR Drop Down
omnivore.csv('Data/Hospitals.csv')
    .on('ready', function () {

        // Change Marker Symbol
        this.eachLayer(function (marker1) {
            marker1.setIcon(L.mapbox.marker.icon({
                'marker-symbol': 'hospital',
                'marker-color': '#ff8888',

            }));

            if (marker1.toGeoJSON().properties.hospital_n.length > 0) {
                //Update Form DROPDOWN_MENU
                var selList = document.getElementById("selectHospital");
                var option = document.createElement('option');
                option.text = marker1.toGeoJSON().properties.hospital_n;
                selList.add(option);

            }
        });
    })



// =================== GEOLOCATION 
// Create Document Element
var geolocate = document.getElementById('geolocate');

// Create Empty Layer
var userGeoLoc = L.mapbox.featureLayer().addTo(map);

//GLOBALS
var userCoords = '';
var radiusKM = 0;
var searchRadius;
var resultsList = [];
var searchCenter;
//GLOBALS

//FUNCTION0
// Check Browser Geolocation Capability
if (!navigator.geolocation) {
    geolocate.innerHTML = 'Browser is NOT Geolocation Enabled';
} else {

    geolocate.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        map.locate();

    };
}

// Add User Location Marker and Center Map
map.on('locationfound', function (e) {


    userCoords = [e.latlng.lng, e.latlng.lat];
    radiusKM = prompt('Enter Search Radius in Kilometers');
    var numRadiusKm = parseInt(radiusKM) * 1000;

    // create radius around user Location
    searchRadius = L.circle(e.latlng, numRadiusKm).addTo(map);
    map.fitBounds(searchRadius.getBounds());

    var strUserCoords = userCoords.toString();
    var userLocTitle = 'Your Current Location...\n\n' + strUserCoords;

    userGeoLoc.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            'title': userLocTitle,
            'marker-color': '#0000ff',
            'marker-symbol': 'marker'
        }
    });

    // Access Age Care Centers in Search Radius
    searchCenter = e.latlng;
    // alert(csvLayer0);
    // alert(searchCenter);
    csvLayer0.eachLayer(function (marker) {

        var markerDist = searchCenter.distanceTo(marker.getLatLng());
        // alert(markerDist);
        if (markerDist < numRadiusKm) {
            marker.setIcon(L.mapbox.marker.icon({
                'marker-size': 'medium',
                'marker-symbol': 'disability',
                'marker-color': '#fa0'
            }));
            // Append Results

            resultsList.push(marker.toGeoJSON().properties.SERVICE_NAME);

            //Change Results Number
            document.getElementById("totResults").innerHTML = resultsList.length;

            // Write Results to Results Div
            $("#ResultsInner").html($("#ResultsInner").html() + '</br></br><strong>&nbsp;Center: </strong>' + marker.toGeoJSON().properties.SERVICE_NAME + '</br><strong>&nbsp;Vacancies: </strong>' + marker.toGeoJSON().properties.Vacancy) + '</br>';
        } else {
            marker.setIcon(L.mapbox.marker.icon({
                'marker-color': '#777',
                'marker-size': 'small',
                'marker-symbol': 'disability'
            }));
        }
    });

    // Optionally hide the geolocation button
    // geolocate.parentNode.removeChild(geolocate);
});

// If the user chooses not to allow their location
// to be shared, display an error message.
map.on('locationerror', function () {
    alert('Position could not be found...\nGeoLocation NOT Enabled\n\nEnable Geolocation\nor Try FireFox, MS Edge or Google Chrome');
});




// Click Listener
// map.on('click', function (e) {
//          alert(e.latlng);
//          // create radius around user Location
//          L.circle(e.latlng, 500000).addTo(map);
//      });

//FUNCTION1
// Click to Draw Search Buffer START
function bufferSearchOnClick() {
    // Change Cursor
    $('.leaflet-container').css('cursor', 'crosshair');

    map.on('click', function (e) {
        clickRadiusKM = prompt('Enter Search Radius in Kilometers');
        var clickNumRadiusKm = parseInt(clickRadiusKM) * 1000;
        // alert(e.latlng);
        // create radius around user Location
        searchRadius = L.circle(e.latlng, clickNumRadiusKm).addTo(map);
        map.fitBounds(searchRadius.getBounds());

        // Return Cursor to normal
        $('.leaflet-container').css('cursor', '');

        // Stop Click Events
        map.off('click');

        // Access Age Care Centers in Search Radius
        searchCenter = e.latlng;
        // alert(csvLayer0);
        // alert(searchCenter);
        csvLayer0.eachLayer(function (marker) {
            var markerDist = searchCenter.distanceTo(marker.getLatLng());
            // alert(markerDist);
            if (markerDist < clickNumRadiusKm) {
                marker.setIcon(L.mapbox.marker.icon({
                    'marker-size': 'medium',
                    'marker-symbol': 'disability',
                    'marker-color': '#fa0'
                }));
                // Append Results

                resultsList.push(marker.toGeoJSON().properties.SERVICE_NAME);

                //Change Results Number
                document.getElementById("totResults").innerHTML = resultsList.length;

                // Write Results to Results Div
                $("#ResultsInner").html($("#ResultsInner").html() + '</br></br><strong>&nbsp;Center: </strong>' + marker.toGeoJSON().properties.SERVICE_NAME + '</br><strong>&nbsp;Vacancies: </strong>' + marker.toGeoJSON().properties.Vacancy) + '</br>';
            } else {
                marker.setIcon(L.mapbox.marker.icon({
                    'marker-color': '#777',
                    'marker-size': 'small',
                    'marker-symbol': 'disability'
                }));
            }
        });


    });
}
// Click to Draw Search Buffer END

//FUNCTION5
// Search Function by Hospital START
function hospitalSearch() {
    // Add CSV 1
    var hospitalChoice = document.getElementById("selectHospital");
    localStorage.setItem("0", hospitalChoice.value);

    var str_HospitalChoice = localStorage.getItem("0");

    csvLayer1 = omnivore.csv('Data/Hospitals.csv')
        .on('ready', function () {

            // Change Marker Symbol
            this.eachLayer(function (marker1) {
                marker1.setIcon(L.mapbox.marker.icon({
                    'marker-symbol': 'hospital',
                    'marker-color': '#ff8888',

                }));

                if (marker1.toGeoJSON().properties.hospital_n === str_HospitalChoice) {

                    //Zoom to Selected
                    map.setView(marker1.getLatLng(), 15);

                    // Using simplestyle-spec: see MapBox spec for Details
                    marker1.setIcon(L.mapbox.marker.icon({
                        'marker-symbol': 'hospital',
                        'marker-color': '#0ff',
                        'marker-size': 'medium'
                    }));

                    radiusKM = prompt('Enter Search Radius in Kilometers');
                    var numRadiusKm = parseInt(radiusKM) * 1000;
                    // alert(e.latlng);
                    // create radius around user Location
                    searchRadius = L.circle(marker1.getLatLng(), numRadiusKm).addTo(map);
                    map.fitBounds(searchRadius.getBounds());

                    // Access Age Care Centers in Search Radius
                    searchCenter = marker1.getLatLng();
                    csvLayer0.eachLayer(function (marker) {
                        // alert(searchCenter.distanceTo(marker.getLatLng()));


                        var markerDist = searchCenter.distanceTo(marker.getLatLng());
                        // alert(markerDist);
                        if (markerDist < numRadiusKm) {
                            marker.setIcon(L.mapbox.marker.icon({
                                'marker-size': 'medium',
                                'marker-symbol': 'disability',
                                'marker-color': '#fa0'
                            }));
                            // Append Results

                            resultsList.push(marker.toGeoJSON().properties.SERVICE_NAME);

                            //Change Results Number
                            document.getElementById("totResults").innerHTML = resultsList.length;

                            // Write Results to Results Div
                            $("#ResultsInner").html($("#ResultsInner").html() + '</br></br><strong>&nbsp;Center: </strong>' + marker.toGeoJSON().properties.SERVICE_NAME + '</br><strong>&nbsp;Vacancies: </strong>' + marker.toGeoJSON().properties.Vacancy) + '</br>';
                        } else {
                            marker.setIcon(L.mapbox.marker.icon({
                                'marker-color': '#777',
                                'marker-size': 'small',
                                'marker-symbol': 'disability'
                            }));
                        }
                    });

                    // Access Age Care Centers in Search Radius END

                } else {
                    marker1.setIcon(L.mapbox.marker.icon({
                        'marker-symbol': 'hospital',
                        'marker-color': '#ff8888',
                        'marker-size': 'small'
                    }));
                }


                // Bind a popup to each icon based on the same properties
                marker1.bindPopup(marker1.toGeoJSON().properties.hospital_n);

            });

            //Create Clusters
            var markers1 = L.markerClusterGroup({
                showCoverageOnHover: false
            });

            map.addLayer(markers1);

            markers1.addLayer(csvLayer1);
        })

}
// Search Function by Hospital END

//FUNCTION3
function findPlace() {
    var place = document.getElementById("geocode-entry");
    localStorage.setItem("0", place.value);

    var str_Place = localStorage.getItem("0");

    // Create Geocoder Object
    var geocoder = L.mapbox.geocoder('mapbox.places');

    geocoder.query(str_Place, showMap);

    function showMap(err, data) {
        // The geocoder can return an area, like a city, or a
        // point, like an address. Here we handle both cases,
        // by fitting the map bounds to an area or zooming to a point.
        if (data.lbounds) {
            map.fitBounds(data.lbounds);
            alert('Enter a single place or address for a search Radius!!!');
        } else if (data.latlng) {
            geocodeRadiusKM = prompt('Enter Search Radius in Kilometers');
            var geocodeNumRadiusKm = parseInt(geocodeRadiusKM) * 1000;
            // alert(map.getCenter());
            // create radius around user Location
            searchRadius = L.circle(data.latlng, geocodeNumRadiusKm).addTo(map);
            map.fitBounds(searchRadius.getBounds());

            // Access Age Care Centers in Search Radius
            searchCenter = L.latLng(data.latlng);
            // alert(csvLayer0);
            // alert(searchCenter);
            csvLayer0.eachLayer(function (marker) {

                var markerDist = searchCenter.distanceTo(marker.getLatLng());
                // alert(markerDist);
                if (markerDist < geocodeNumRadiusKm) {
                    marker.setIcon(L.mapbox.marker.icon({
                        'marker-size': 'medium',
                        'marker-symbol': 'disability',
                        'marker-color': '#fa0'
                    }));
                    // Append Results

                    resultsList.push(marker.toGeoJSON().properties.SERVICE_NAME);

                    //Change Results Number
                    document.getElementById("totResults").innerHTML = resultsList.length;

                    // Write Results to Results Div
                    $("#ResultsInner").html($('#ResultsInner').html() + '</br></br><strong>&nbsp;Center: </strong>' + marker.toGeoJSON().properties.SERVICE_NAME + '</br><strong>&nbsp;Vacancies: </strong>' + marker.toGeoJSON().properties.Vacancy) + '</br>';
                } else {
                    marker.setIcon(L.mapbox.marker.icon({
                        'marker-color': '#777',
                        'marker-size': 'small',
                        'marker-symbol': 'disability'
                    }));
                }
            });
        }
    }
    // Create Geocoder Object END

}

//FUNCTION2
function search() {
    // get the value of the search input field
    var searchString = $('#search').val();

    //Adjust Radius
    searchRadius.setRadius(parseInt(searchString) * 1000);
    map.fitBounds(searchRadius.getBounds());

    // alert('CLEARING RESULTS');
    resultsList = [];
    $("#ResultsInner").empty();
    //Change Results Number
    document.getElementById("totResults").innerHTML = resultsList.length;

    // Access Age Care Centers in Search Radius
    // alert(searchCenter);
    csvLayer0.eachLayer(function (marker) {
        // alert(searchCenter.distanceTo(marker.getLatLng()));

        var numRadiusKm = parseInt(searchString) * 1000;

        var markerDist = searchCenter.distanceTo(marker.getLatLng());
        //alert(markerDist);
        if (markerDist < numRadiusKm) {
            // alert('LESS THAN');
            marker.setIcon(L.mapbox.marker.icon({
                'marker-size': 'medium',
                'marker-symbol': 'disability',
                'marker-color': '#fa0'
            }));

            resultsList.push(marker.toGeoJSON().properties.SERVICE_NAME);

            //Change Results Number
            document.getElementById("totResults").innerHTML = resultsList.length;

            // Write Results to Results Div
            $("#ResultsInner").html($('#ResultsInner').html() + '</br></br><strong>&nbsp;Center: </strong>' + marker.toGeoJSON().properties.SERVICE_NAME + '</br><strong>&nbsp;Vacancies: </strong>' + marker.toGeoJSON().properties.Vacancy) + '</br>';


        } else {
            // alert('GREATER THAN');
            marker.setIcon(L.mapbox.marker.icon({
                'marker-color': '#777',
                'marker-size': 'small',
                'marker-symbol': 'disability'
            }));
        }
    });




} //END Search()

//FUNCTION6
function clearSearchResults() {
    // alert('Clearing All Results');
    resultsList = [];
    $("#ResultsInner").empty();
    //Change Results Number
    document.getElementById("totResults").innerHTML = resultsList.length;

    location.reload();

}

//FUNCTION10
function vacancyUpdate() {
    //prompt for entry
    var access = "admin-scotchmer"
    var accessRequest = prompt('Enter Password...');

    if (accessRequest === access) {
        //  block of code to be executed if the condition is true
        window.open('dbUpdate/update.html', '_blank');
    } else {
        alert("Access DENIED!!!");
    }


}

//FUNCTION
function printSearchResults() {
    alert('Functionality Curently Under Contruction \n' + resultsList);

    //Get the HTML of div
    //var divElements = document.getElementById('ResultsInner').innerHTML;
    var divToPrint = document.getElementById('ResultsInner');
    var htmlToPrint = '' +
        '<style type="text/css">' +
        'table th, table td {' +
        'border:1px solid #000;' +
        'padding;0.5em;' +
        '}' +
        '</style>';
    htmlToPrint += divToPrint.outerHTML;
    newWin = window.open("");
    newWin.document.write("<h3 align='center'>Print Page</h3>");
    newWin.document.write(htmlToPrint);
    newWin.print();
    newWin.close();

}

// FUNCTION12 Collapsible Drop Down Radio
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

// FUNCTION13 Select All In Criteria Dropdown
var criteriaSel_All = false;
function selectAll() {
    if (criteriaSel_All === false) {
        var items = document.getElementsByName('criteria');
        for (var i = 0; i < items.length; i++) {
            if (items[i].type == 'checkbox')
                items[i].checked = true;
        }
        criteriaSel_All = true;
    } else {
        var items = document.getElementsByName('criteria');
        for (var i = 0; i < items.length; i++) {
            if (items[i].type == 'checkbox')
                items[i].checked = false;
        }
        criteriaSel_All = false;

    }
}



            // https://docs.mapbox.com/mapbox-gl-js/example/query-similar-features/
            // Filter Features