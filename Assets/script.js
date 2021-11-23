let submitBtn = document.getElementById('submitBtn');
// let cityName = 
let weatherUrl = 'api.openweathermap.org/data/2.5/forecast?q=dallas&appid=06bbfcf01249f664cd5e67e8615a3f5f'


// submitBtn.on('click', function() {
        
    
   
        

// })


submitBtn.addEventListener('submit', function(){
    event.preventDefault()
    fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (weatherData) {
        console.log(weatherData);
    })
});
    // event.preventDefault();
