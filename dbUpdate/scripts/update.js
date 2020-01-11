
     // Firebase Database Retrieve Data
     function loadData () {
        //  alert('Connecting to Database...');

         var entries = fbRef.child('data');
 
         entries.on('value', function(snapshot) 
         {
             var dbLength = snapshot.numChildren(); 
            //  alert(dbLength);


             snapshot.forEach(function(childSnapshot) {
               var childData = childSnapshot.val();
            //    facilityList.push(childData.Facility);
               var id = childSnapshot.key;
               $('#fireTable tr:last').after('<tr><td>' + id + '</td><td>' + childData.Position + '</td><td>' + childData.Rating + '</td></tr>');
               
 
             });
             
 
            //  // Place Markers on the Map from Database
           
            //  var infowindow = new google.maps.InfoWindow({
            //      pixelOffset: new google.maps.Size(-234, 0)
            //  });
 
            //  // Zoom To Bounds of Markers
            //  var bounds = new google.maps.LatLngBounds();
            //  for (var i = 0; i < dbMarkers.length; i++) {
            //      bounds.extend(dbMarkers[i].getPosition());
            //  }
 
            //  map.fitBounds(bounds);
            //  // Zoom To Bounds of Markers
             
         })
           
     }

     // Show Table in New Window
     function showTable(){
         //  block of code to be executed if the condition is true
        window.open('table.html', '_blank');
     }

     // Show Table in New Window
     function showMap(){
        //  block of code to be executed if the condition is true
       window.open('../index.html', '_self');
    }

     // Firebase Database Retrieve Data
    function updateData() {

        //  alert('CLICK ENTRY!!!');
        //  Declare Global Variables
        var Name =  'No Data';
        var Category  = 'No Data';
        var Rating = 'No Data';
        var Image_URL = 'No Data';
        var User = 'No Data';
        var Latitude = 'No Data';
        var Longitude = 'No Data';


        // GET Form Data

        Name = document.getElementById("Name");
        localStorage.setItem("0", Name.value);

        Rating = document.getElementById("Rating");
        localStorage.setItem("1", Rating.value);

        Category = document.getElementById("Category");
        localStorage.setItem("2", Category.value);

        Image_URL = document.getElementById("img");
        localStorage.setItem("3", Image_URL.value);

        User = document.getElementById("user");
        localStorage.setItem("4", User.value);

        Latitude = document.getElementById("lat");
        localStorage.setItem("5", Latitude.value);

        Longitude = document.getElementById("lng");
        localStorage.setItem("6", Longitude.value);


        var entry0 = localStorage.getItem("0");
        var entry1 = localStorage.getItem("1");
        var entry2 = localStorage.getItem("2");
        var entry3 = localStorage.getItem("3");
        var entry4 = localStorage.getItem("4");
        var entry5 = localStorage.getItem("5");
        var entry6 = localStorage.getItem("6");



        // GET Form Data END

      
            //fbRef = Firebase Reference
            fbRef.child('data').push()
                .set({
                    Position: entry0, Rating: entry1,
                    Category: entry2, Image: entry3,
                    Posted: entry4, Latitude: entry5,
                    Longitude: entry6

                });

            window.alert('Database Entry Successfull.......');
            location.reload();

    }

