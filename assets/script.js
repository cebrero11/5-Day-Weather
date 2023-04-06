
var  API_key = '32fd1197a1d0f3491f7dc8959dd92a6e'; 
var historyContainerEl = document.querySelector("#history"); 
var todayContainerEl = document.querySelector("#today"); 
var futureContainerEl = document.querySelector('#future'); 
var currentTime = dayjs().format("YYYY-MM-DD"); 
var searchButton = document.querySelector("#search"); 

//var tomorrow = currentTime.add(1, 'day'); 



async function setUpWeatherInfo(city) {
  // Insert the API url to get a list of your repos

  var requestWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_key}`;
  var requestCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_key}`;
  //const response = await fetch(requestCityUrl); 
  const response = await fetch(requestWeatherUrl);
  const data = await response.json();
  for (let i = 3; i < data.list.length; i = i +8){
      addFutureDay(data.list[i]);
    }
 
}

  async function currentWeatherInfo(city) {
    // Insert the API url to get a list of your repos
    //var requestWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_key}`;
    var requestCityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_key}`;
    var requestWeatherUrl =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`; 
    //const response = await fetch(requestCityUrl); 
    const response = await fetch(requestWeatherUrl);
    const data = await response.json();

    addToday(city, data); 
  
  }

async function getCityWeather(lat, lon){
  var part = 'hourly'; 
  //var requestWeatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${API_key}`; 
  var requestWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`; 
  const response = await fetch(requestWeatherUrl);
  const data = await response.json(); 
  console.log(data); 
}



function addToday(city, cityInfo){
  var todayCardEl = document.createElement('h2'); 
  todayCardEl.classList = "card-title"; 
  todayCardEl.textContent = city +" ("+currentTime+")";
  todayContainerEl.appendChild(todayCardEl); 
  var tempEl = document.createElement('p');
  tempEl.classList = "card-text"; 
  tempEl.textContent = "Temp: " + Math.round(cityInfo.main.feels_like)+"°F"; 
  var windEl = document.createElement('p');
  windEl.classList = "card-text"; 
  windEl.textContent = "Wind: " +cityInfo.wind.speed+" MPH"; 
  var humidEl = document.createElement('p'); 
  humidEl.classList = "card-text"; 
  humidEl.textContent = "Humidity: " + cityInfo.main.humidity +"%"; 
  todayContainerEl.appendChild(tempEl); 
  todayContainerEl.appendChild(windEl); 
  todayContainerEl.appendChild(humidEl); 
}

function addFutureDay(cityInfo){
  var colEl = document.createElement('div'); 
  colEl.classList = "col-sm-1 offset-md-1"; 
  var cardEl = document.createElement("div");
  cardEl.classList = "card"; 
  cardEl.setAttribute("style", "width: 10rem")
  var bodyEl = document.createElement("div"); 
  bodyEl.classList = "card-body"; 
  var futureTitleEl = document.createElement('h5'); 
  futureTitleEl.classList = "card-title"; 
  futureTitleEl.textContent = cityInfo.dt_txt.split(" ")[0];
  bodyEl.appendChild(futureTitleEl); 
  var tempEl = document.createElement('p');
  tempEl.classList = "card-text"; 
  tempEl.textContent = "Temp: " + Math.round(cityInfo.main.feels_like)+"°F"; 
  var windEl = document.createElement('p');
  windEl.classList = "card-text"; 
  windEl.textContent = "Wind: " +cityInfo.wind.speed+" MPH"; 
  var humidEl = document.createElement('p'); 
  humidEl.classList = "card-text"; 
  humidEl.textContent = "Humidity: " + cityInfo.main.humidity +"%"; 
  bodyEl.appendChild(tempEl); 
  bodyEl.appendChild(windEl); 
  bodyEl.appendChild(humidEl); 
  cardEl.appendChild(bodyEl);
  colEl.appendChild(cardEl);
  futureContainerEl.appendChild(colEl); 
}

function addCity(city){
  var historyContainerEl = document.querySelector("#history");
  var cityCardEl = document.createElement('div'); 
  cityCardEl.classList = "card mb-2"; 
  cityCardEl.setAttribute("style", "width: 12.5rem")
  cityCardEl.id=city; 
  cityCardEl.addEventListener("click", runSearch); 
  var cityBodyEl = document.createElement("div"); 
  cityBodyEl.classList = "card-body"; 
  var cityTextEl = document.createElement("p"); 
  cityTextEl.classList = "card-text"; 
  cityTextEl.textContent = city; 
  cityBodyEl.appendChild(cityTextEl);
  cityCardEl.appendChild(cityBodyEl); 
  historyContainerEl.appendChild(cityCardEl);   
} 

function setUpHistoryContainer(){
  var colEl = document.createElement('div'); 
  colEl.classList = "col-sm-1"; 
  colEl.id = "history"; 
  futureContainerEl.appendChild(colEl); 
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) { 
    parent.removeChild(parent.firstChild);     
  }

}

function cleanup(){
  removeAllChildNodes(todayContainerEl);
  removeAllChildNodes(futureContainerEl); 
}

function setUpHistory(){
  //localStorage.clear(); 
  var searches =JSON.parse(localStorage.getItem("previous-searches")); 
  console.log(searches); 
  if (searches){
    for (let i = 0; i < searches.length; i++){
      addCity(searches[i]);  
    }
  }
}
 
function main(){
  var city = localStorage.getItem("last-search")
  if(!city){
    city ="Houston"
  } 
  setUpHistory(); 
  currentWeatherInfo(city); 
  setUpWeatherInfo(city); 
} 


function doSearch (city) {
  cleanup(); 
  setUpHistoryContainer(); 
  currentWeatherInfo(city); 
  setUpWeatherInfo(city); 
  setUpHistory(); 
  localStorage.setItem("last-search", city); 
  var history = JSON.parse(localStorage.getItem('previous-searches')); 
  if (history){
    var searches = [];
    for (let i = 0; i < history.length; i++ ){
    searches.push(history[i]); 
    }
    searches.push(city); 
    localStorage.setItem("previous-searches", JSON.stringify([...new Set(searches)]));  
  } else {
    localStorage.setItem("previous-searches", JSON.stringify([city])); 
  }
} 


var runSearch = function(){
  doSearch(this.id); 
}

var searchCity = function () {
  var search = document.getElementById("search-city").value.trim(); 
  if (search){
    doSearch(search); 
  }
};

main(); 
searchButton.addEventListener("click", searchCity); 
