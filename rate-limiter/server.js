//-----------------------------------------------------------------------------
//   -- R A T E   L I M I T E R   E X A M P L E   P R O G R A M --
//   
//		Company: 		SW-DEVELOPMENT OY
//   	
//		Programmer: 	Matti Harsu
// 
//		Functionality:
// 		This program sends HTTP -requests to defined URL and receives
//		response message. Sending rate is adjusted regarding service.
//		If the service can take care of defined speed, at least within two  
//		requests, the speed will be increased. If the request can't be served,
//		the the request speed will be decreased,
//
//-----------------------------------------------------------------------------
const axios = require('axios');  			// Axios HTTP 

var http           = require("http");		
var index          = 0;						// Loop variable for stabilization
var sleepValue     = 1000;					// Sleep between requests
var kplPerSecond   = 1;						// Requests per second
var num        	   = 0;						// Big loop




// This is own sleep function, because javascript doesn't contain sleep 

const sleep = (milliseconds) => {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');

const sendRequests = async () =>  {
	
	while(num < 1000 ) {

		// I select synchronous approach for Sleep functionality
		await sleep( sleepValue )
		
		
		// If TWO successful response, the the speed can be increased
		// If kplPerSecond >= 1 then amount of requests can be INCREASED directly
		// othervise sleepValue will be DECREASED sec by sec
		if (index == 2 ) {
			if ( kplPerSecond >= 1 ) {
		    	kplPerSecond++;
		    	sleepValue = 1000 / kplPerSecond;
		    } else {
		    	sleepValue = sleepValue - 1000;
		    	kplPerSecond = 1000 / sleepValue;
		    }
		    index = 0;
		}
		
		// Lets take the TimeStamp
		//
		var d = new Date();
		var showTime = d.toLocaleTimeString();

		// Axios Library helps a lot of in HTTP messaging
		// First Axios check OK response, if case is unsuccessfull then catch branch will take care of response
		// Axios checks automatically OK vs NOK cases.
		//
		axios.get('http://13.93.106.105:8080/api/hello')
		  .then(response => {
		  	console.clear();
		  	console.log('Status:   '+ 'Speed: ' +  '     Sleep(millisec): ');
		  	console.log('-------------------------------------------');
		  	if (kplPerSecond >= 1 ) {
		    	console.log(response.status +' OK    '+ kplPerSecond + ' pcs/sec   ' + Math.round(sleepValue) + '         '+ showTime);
		    } else {
		    	console.log(response.status +' OK    '+ (1/kplPerSecond) + ' sec/req   ' +  Math.round(sleepValue) + '         '+ showTime);
		    }
		    resp = response.data;
		    index++;
		  })
		  .catch(error => {
		  	console.clear();
		  	console.log('Status:   '+ 'Speed: ' +  '     Sleep(millisec): ');
		  	console.log('-------------------------------------------');
		  	if (kplPerSecond >= 1 ) {
		    	console.log(error.response.status +' NOK   '+ kplPerSecond  + ' pcs/sec   '+  Math.round(sleepValue) + '         '+ showTime);
		    } else {
		    	console.log(error.response.status +' NOK   '+ (1/kplPerSecond) + ' sec/req   ' +  Math.round(sleepValue)  + '         '+ showTime);
		    }
		    // If unsuccesfull response, the speed will be decreased
		    // If kplPerSecond > 1 then amount of requests can be decreased directly
		    // othervise sleepValue will be increased sec by sec
		    index=0;
		    if ( kplPerSecond > 1 ) {
		    	kplPerSecond--;
		    	sleepValue = 1000 / kplPerSecond;
		    } else {
		    	sleepValue = sleepValue + 1000;
		    	kplPerSecond = 1000 / sleepValue;
		    }

		  });
		  num++;
	}
}

sendRequests();

//console.log('End');
