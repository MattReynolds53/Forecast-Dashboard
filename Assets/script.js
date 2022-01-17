let submitBtn = document.querySelector("#submitBtn");
let cardContainer = document.querySelector("#cardContainer");
let cityButtons = document.getElementById("cityButtons");
let date = moment();
$("#currentDate").text(date.format("dddd, MMMM Do YYYY"));

let fiveDayWeatherUrl =
  "https://api.openweathermap.org/data/2.5/forecast?appid=06bbfcf01249f664cd5e67e8615a3f5f&q=";
let weatherUrl =
  "https://api.openweathermap.org/data/2.5/weather?appid=06bbfcf01249f664cd5e67e8615a3f5f&q=";

submitBtn.addEventListener("click", getCity);

function getCity(event) {
  event.preventDefault();
  let cityName = document.getElementById("cityName").value;
  getWeather(cityName);
  saveHistory(cityName);
}

function saveHistory(city) {
  var storage = JSON.parse(localStorage.getItem("weatherHistory"));
  if (storage === null) {
    storage = [];
  }
  storage.push(city);
  localStorage.setItem("weatherHistory", JSON.stringify(storage));
  getHistory();
}

getHistory();

function getHistory() {
  var storage = JSON.parse(localStorage.getItem("weatherHistory"));

  if (storage === null) {
    let nullHistory = document.createElement("h5");
    nullHistory.textContent = "No History";
    cityButtons.append(nullHistory);
  } else {
    cityButtons.textContent = "";
    for (let i = 0; i < storage.length; i++) {
      var historyBtn = document.createElement("button");
      historyBtn.setAttribute(
        "class",
        "list-group-item list-group-item-action"
      );
      historyBtn.textContent = storage[i];
      historyBtn.setAttribute("id", storage[i]);
      cityButtons.append(historyBtn);

      historyBtn.addEventListener("click", function (e) {
        getWeather(e.target.textContent);
        
      });
    }
  }
}

function getWeather(city) {
  fetch(weatherUrl + city + "&units=imperial")
    .then(function (res) {
      return res.json();
    })
    .then(function (weatherData) {
      console.log("current", weatherData);
      let currentCity = document.querySelector(".city");
      currentCity.textContent = weatherData.name;
      let currentTemp = document.querySelector(".temp");
      currentTemp.textContent = "Temp: " + weatherData.main.temp + "F";
      let currentWind = document.querySelector(".wind");
      currentWind.textContent = "Wind: " + weatherData.wind.speed + "MPH";
      let currentHumidity = document.querySelector(".humidity");
      currentHumidity.textContent =
        "Humidity: " + weatherData.main.humidity + "%";

      let lat = weatherData.coord.lat;
      let lon = weatherData.coord.lon;

      let requestUVUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=06bbfcf01249f664cd5e67e8615a3f5f`;

      getFiveDayWeather(lat, lon)

      fetch(requestUVUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (uvData) {
          console.log("uv", uvData);
          let currentUVI = document.querySelector(".uvi");
          currentUVI.textContent = "UV Index: " + uvData.current.uvi;
          currentUVI.setAttribute("id", uvData.current.uvi);

          console.log(currentUVI.id);
          if (currentUVI.id < 3) {
            currentUVI.style.backgroundColor = "green";
          } else if (currentUVI.id > 3 && currentUVI.id < 7) {
            currentUVI.style.backgroundColor = "yellow";
          } else {
            currentUVI.style.backgroundColor = "red";
          }
        });
    });
}

function getFiveDayWeather(lat, lon) {
  // fetch(fiveDayWeatherUrl + city + "&units=imperial")
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=06bbfcf01249f664cd5e67e8615a3f5f&units=imperial`)
    .then(function (res) {
      return res.json();
    })
    .then(function (fiveDayData) {
      console.log("5day", fiveDayData);
      cardContainer.textContent = "";
      for (let i = 1; i < 6; i++) {
        console.log(fiveDayData.daily[i]);

        let card = document.createElement("div");
        card.setAttribute("class", "card border-primary mb-3");
        cardContainer.append(card);

        let cardHeader = document.createElement("div");
        cardHeader.setAttribute("class", "card-header");
        cardHeader.textContent = "Day" + i;
        card.append(cardHeader);

        let cardBody = document.createElement("div");
        card.setAttribute("class", "card-body");
        card.append(cardBody);

        let title = document.createElement("h5");
        title.textContent = "Day " + i;
        cardBody.prepend(title);

        let fiveDayTemp = document.createElement("p");
        fiveDayTemp.textContent =
          "Temp: " + fiveDayData.daily[i].temp.day + " F";
        cardBody.append(fiveDayTemp);

        let fiveDayWind = document.createElement("p");
        fiveDayWind.textContent =
          "Wind: " + fiveDayData.daily[i].wind_speed + "MPH";
        cardBody.append(fiveDayWind);

        let fiveDayHumidity = document.createElement("p");
        fiveDayHumidity.textContent =
          "Humidity: " + fiveDayData.daily[i].humidity + "%";
        cardBody.append(fiveDayHumidity);
      }
    });
}
