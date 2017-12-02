/*		
function take_snapshot() {
	Webcam.snap( function(data_uri) {
		document.getElementById('my_result').innerHTML = '<img src="'+data_uri+'"/>';
	} );
}
*/

// convert base64 to raw binary data held in a string
function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }
    
  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}


function initMap() 
{
       var uluru = {lat: -25.363, lng: 131.044};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 20,
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

		    for(var i=0; i<cords_data.length; i++)
		    {

			    var marker = new google.maps.Marker({
		          position: {lat: cords_data[i].fields.lat, lng: cords_data[i].fields.lon},
		          map: map
		        });

		        var contentType = 'image/jpeg';
		        var blob = b64toBlob(cords_data[i].fields.garbage_pic, contentType);
				var blob_garbage_url = URL.createObjectURL(blob);
		        console.log(blob_garbage_url);
		        marker.addListener('click', function(){
					infowindow.open(map, marker);
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
		    map: map
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

		var infowindow = new google.maps.InfoWindow({
		  content:"<h4>yha kachra h!</h4><\n><img src='' id='garbage-image' style='height:30px; width:40px;'></img>"
		});

		var infowindow_new = new google.maps.InfoWindow({
		  content:"<input type='file' accept='image/*' id='file-input' capture>"
		});



}
  