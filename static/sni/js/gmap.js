/*		
function take_snapshot() {
	Webcam.snap( function(data_uri) {
		document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
	} );
}
*/
// global variable to close the
var span;


function initMap() 
{
       var uluru = {lat: 24.571270, lng: 73.691544};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: uluru,
          disableDefaultUI: true
        });


        // load all points
        $.ajax({
			    url: "/showcords/",
			    type:"GET",
			  }).done(function(data){
		     //alert(data);

		    var cords_data = JSON.parse(data);

		    var markers = new Array(40);
		    var latarray = new Array(40);
		    var lonarray = new Array(40);


			var modal = document.getElementById('myModal');
			var mapmodal = document.getElementById('map');
			var modalImg = document.getElementById("img01");


			// store lan lon in arrays
		    for(var i=0; i<cords_data.length; i++)
		    {
		    	latarray[i] = cords_data[i].fields.lat;
		    	lonarray[i] = cords_data[i].fields.lon;
		    }

		    for(var i=0; i<cords_data.length; i++)
		    {

		    	
			    markers[i] = new google.maps.Marker({
		          position: {lat: latarray[i], lng: lonarray[i]},
		          map: map,
		          icon:'/site_media/media/trash-can.png'
		        });

		        markers[i].addListener('click', function(e){
					
					modal.style.display = "block";

					parentDOM = document.getElementById('myModal');
					span = parentDOM.getElementsByClassName('close')[0];
					console.log("span is " + span);

					// When the user clicks on <span> (x), close the modal
					span.onclick = function() {
						var modal = document.getElementById('myModal');
						modal.style.display = "none";
					}
					  

					console.log(markers[0].position.lat);

					var latlon = e.latLng;
					console.log(latlon.lat(), latlon.lng());

					
					for(var j=0; j<cords_data.length; j++)
					{
						if(latarray[j] == latlon.lat() && lonarray[j] == latlon.lng())
						{
							modalImg.src = cords_data[j].fields.garbage_pic;
						}
					}
    				

				});
		    }


		    console.log(cords_data[0].fields.lat);
		  });

        map.addListener('click', function(e) {

        	// open infowindow
		    placeMarkerAndPanTo(e.latLng, map);
		});

		function placeMarkerAndPanTo(latLng, map) {

			// open camera division, capture image, send the path in ajax to store
		  //Webcam.attach('#my_camera');

		  var marker = new google.maps.Marker({
		    position: latLng,
		    map: map,
		    icon:'/site_media/media/trash-can.png'
		  });
		  

          infowindow_new.open(map, marker);

          //map.panTo(latLng);
		  console.log(latLng.lat(), latLng.lng());

		  const fileInput = document.getElementById('file-input');

		  fileInput.addEventListener('change', (e) => {
		  	file = e.target.files[0];
		  	console.log(file);
		  	
		  	//console.log()
		  	//image_file=URL.createObjectURL(file);
		  	//console.log(image_file);

		  	var reader = new window.FileReader();	
		  	reader.readAsDataURL(file); 
		  	console.log(reader);	  	
			reader.onloadend = function() {
                base64data = reader.result;                
                console.log(base64data);

                $.ajax({
				    url: "/savecords/",
				    type:"POST",
				    data: {lan:latLng.lat(),lon:latLng.lng(), image:base64data}
				  }).done(function(data){
			     //alert(data);
			     console.log('cords stored');
			    });
  			} 
 			//console.log(reader.result)
 			infowindow_new.close();

			  
		  });
		  
		}
		

		var infowindow_new = new google.maps.InfoWindow({
		  content:"<input type='file' accept='image/*' id='file-input' capture>"
		});



}


