
let submitBtn = document.querySelector("#submitBtn")
let cardContainer = document.querySelector('#cardContainer')
let cityButtons = document.getElementById('cityButtons')
let date = moment();
$('#currentDate').text(date.format('dddd, MMMM Do YYYY'));

// this needs to come from your input!
// Should this be inside or outside the function?
// let cityName = $("input")
let fiveDayWeatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?appid=06bbfcf01249f664cd5e67e8615a3f5f&q='
let weatherUrl ='https://api.openweathermap.org/data/2.5/weather?appid=06bbfcf01249f664cd5e67e8615a3f5f&q='

submitBtn.addEventListener('click', getCity);

function getCity(event) {
    event.preventDefault();
    let cityName = document.getElementById("cityName").value;
    getWeather(cityName)
    getFiveDayWeather(cityName)
    saveHistory(cityName)
}

function saveHistory(city) {
    var storage = JSON.parse(localStorage.getItem('weatherHistory'))
    if(storage === null) {
        storage=[]
    }
    storage.push(city)
    localStorage.setItem('weatherHistory', JSON.stringify(storage))
    getHistory()
}

getHistory()

function getHistory() {
    var storage = JSON.parse(localStorage.getItem('weatherHistory'))
    if (storage === null) {
        let nullHistory = document.createElement('h5')
        nullHistory.textContent = 'No History'
        cityButtons.append(nullHistory)
    } else {
        cityButtons.textContent = ''
        for (let i = 0; i < storage.length; i++) {
            var historyBtn = document.createElement('button')
            historyBtn.setAttribute('class', 'list-group-item list-group-item-action')
            historyBtn.textContent = storage[i]
            historyBtn.setAttribute('id', storage[i])
            cityButtons.append(historyBtn)

            // add event listener to the history button and call the getweather function and the get5day fucntion passing in the the event.target.id
        }
    }
}

function getWeather(city) {
    fetch(weatherUrl + city + '&units=imperial')
        .then(function (res) {
            return res.json();
        })
        .then(function (weatherData) {
            console.log('current', weatherData);
            let currentCity = document.querySelector('.city');
            currentCity.textContent = weatherData.name;
            let currentTemp = document.querySelector('.temp');
            currentTemp.textContent = 'Temp: ' + weatherData.main.temp + 'F';
            let currentWind = document.querySelector('.wind');
            currentWind.textContent = 'Wind: ' + weatherData.wind.speed + 'MPH';
            let currentHumidity = document.querySelector('.humidity');
            currentHumidity.textContent = 'Humidity: ' + weatherData.main.humidity + '%';
            // add other variables here
        })
}

function getFiveDayWeather(city) {
    fetch(fiveDayWeatherUrl + city + '&units=imperial')
    .then(function(res) {
        return res.json()
    })
    .then(function(fiveDayData) {
        console.log('5day', fiveDayData);
        for (let i = 1; i < 6; i++) {
            console.log(fiveDayData.list[i]);

            let card = document.createElement('div')
            card.setAttribute('class', 'card border-primary mb-3')
            cardContainer.append(card)

            let cardHeader = document.createElement('div')
            cardHeader.setAttribute('class', 'card-header')
            cardHeader.textContent = 'Day' + i
            card.append(cardHeader)

            let cardBody = document.createElement('div')
            card.setAttribute('class', 'card-body')
            card.append(cardBody)

            let title = document.createElement('h5')
            title.textContent = 'Day ' + i
            cardBody.prepend(title)

            let fiveDayTemp = document.createElement('p')
            fiveDayTemp.textContent = "Temp: " + fiveDayData.list[i].main.temp + "F"
            cardBody.append(fiveDayTemp)

            let fiveDayWind = document.createElement('p')
            fiveDayWind.textContent = "Wind: " + fiveDayData.list[i].wind.speed + "MPH"
            cardBody.append(fiveDayWind)

            let fiveDayHumidity = document.createElement('p')
            fiveDayHumidity.textContent = "Humidity: " + fiveDayData.list[i].main.humidity + "%"
            cardBody.append(fiveDayHumidity)

            // finish wind, humidity, etc here - follow above example
        }
    })
}

// function getUVI {
//     fetch()
// }