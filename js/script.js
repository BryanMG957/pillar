$(document).ready(function(){
  getLatLong();
})

let fahrenheit, celsius, lat, long;
let forecastTempF = [];
let forecastTempC = [];
let forecastHumidity = []
let forecastPressure = [];
let chartLabels = [];
var apiUrl="https://api.openweathermap.org/data/2.5/";
var apiKey = "2cc582fb546b459ce1ea957f144f4418";

function getLatLong(){
  $.ajax({
    url: "https://geoip-db.com/json/",
    type: 'GET',
    dataType: 'json',
    success: function(data){
      const initLat = data.latitude;
      const initLong = data.longitude;
      getWeatherByCoordinates(initLat,initLong);
      getForecastByCoordinates(initLat,initLong);
    },
    error: function(err) {
      alert('Oops something went wrong, Please try again.');
      console.log(err);
    }
  });
}

function getWeatherByCoordinates(lat,long){
  apiUrl += "weather?lat="+lat+"&lon="+long+"&APPID="+apiKey+"&units=metric";
  callAjaxWeather(apiUrl);
}

function getWeatherByName(city){
  apiUrl += "weather?q="+city+",us&APPID="+apiKey+"&units=metric";
  callAjaxWeather(apiUrl);
}

function getWeatherByZipCode(code){
  apiUrl += "weather?zip="+code+",us&APPID="+apiKey+"&units=metric";
  callAjaxWeather(apiUrl);
}

function callAjaxWeather(url){
  $.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      setCurrentWeather(data);
    },
    error: function(err) {
      alert('Oops something went wrong, Please try again.');
      console.log(err);
    }
  });
  apiUrl="https://api.openweathermap.org/data/2.5/";
}
function setCurrentWeather(data){
  var temperature=data.main.temp;
  celsius=temperature.toFixed(0);
  fahrenheit=(celsius*1.8+32).toFixed(0);
  var icon=data.weather[0].icon;
  var weatherDetail=data.weather[0].main+", "+data.weather[0].description;
  var humidity = data.main.humidity;
  var pressure = data.main.pressure;
  $('.weatherDetail').html(weatherDetail);
  $('.iconpic>img').attr('src','http://openweathermap.org/img/w/'+icon+'.png');
  $('.temp').html(fahrenheit+"&#8457;");
  $('.humidity').html("Humidity: " + humidity);
  $('.pressure').html("Pressure: " + pressure);
  $('.city').html(data.name);
  $('.country').html(data.sys.country);
}

function getForecastByCoordinates(lat, long){
  apiUrl += "forecast?lat="+lat+"&lon="+long+"&APPID="+apiKey+"&units=metric";
  callAjaxForecast(apiUrl);
}

function getForecastByName(city){
  apiUrl += "forecast?q="+city+"&APPID="+apiKey+"&units=metric";
  callAjaxForecast(apiUrl);
}

function getForecastByZipCode(code){
  apiUrl += "forecast?zip="+code+"&APPID="+apiKey+"&units=metric";
  callAjaxForecast(apiUrl);
}

function callAjaxForecast(url){
  $.ajax({
    url: apiUrl,
    type: 'GET',
    dataType: 'json',
    success: function(data) {
      setCurrentForecast(data);
    },
    error: function(err) {
      alert('Oops something went wrong, Please try again.');
      console.log(err);
    }
  });
  apiUrl="https://api.openweathermap.org/data/2.5/";
}

function setCurrentForecast(data){
  for (var i = 0; i < data.list.length; i++) {
    forecastTempF.push((data.list[i]['main']['temp']*1.8+32).toFixed(0));
    forecastTempC.push(data.list[i]['main']['temp'].toFixed(0));
    forecastHumidity.push(data.list[i]['main']['humidity'].toFixed(0));
    forecastPressure.push(data.list[i]['main']['pressure'].toFixed(0));
    chartLabels.push(data.list[i]['dt_txt']);
  };

  createTemperatureChart(forecastTempF);
  createHumidityChart();
  createPressureChart();
}

function createTemperatureChart(degree){
  var ctx = document.getElementById('temperatureForecastChart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: chartLabels,
        fill: false,
        datasets: [{
            label: 'Temperature',
            //backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(119, 136, 153)',
            data: degree
        }]
    },
  });
}

function createHumidityChart(){
  var ctx = document.getElementById('humidityForecastChart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: chartLabels,
        datasets: [{
            label: 'Humidity',
            backgroundColor: 'rgb(135, 206, 250)',
            borderColor: 'rgb(255, 255, 255)',
            data: forecastHumidity
        }]
    },
  });
}

function createPressureChart(){
  var ctx = document.getElementById('pressureForecastChart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: chartLabels,
        datasets: [{
            label: 'Pressure',
            backgroundColor: 'rgb(250, 160, 122)',
            borderColor: 'rgb(255, 255, 255)',
            data: forecastPressure
        }]
    },
  });
}

function getWeather() {

  lat = document.forms["myForm"]["latitude"].value;
  long = document.forms["myForm"]["longitude"].value;
  city = document.forms["myForm"]["city"].value;
  zipCode = document.forms["myForm"]["zipCode"].value;
  forecastTemp = [];
  forecastHumidity = []
  forecastPressure = [];
  chartLabels = [];
  if(lat && long){
    getWeatherByCoordinates(lat,long);
    getForecastByCoordinates(lat,long);
  }
  else if(zipCode){
    getWeatherByZipCode(zipCode);
    getForecastByZipCode(zipCode);
  }
  else if(city){
    getWeatherByName(city);
    getForecastByName(city);
  }
  else {
    alert("Please provide one of the following:\n *City Name\n *Latitude AND Longitude\n *Zip Code");
  }
  $('#location').trigger("reset");
}

//bonus change F to C
$('.toggle .btn').click(function(){
  // set div from f to c
  if($('.toggle').attr('id')=='f'){
    $('.temp').html(celsius+"&#8451;");
    $('.toggle').attr('id','c');
    $('.toggle .btn').html("&#8457;");
    createTemperatureChart(forecastTempC);
  }
   //set div from c to f
 else if($('.toggle').attr('id')=='c'){
    $('.temp').html(fahrenheit+"&#8457;");
    $('.toggle').attr('id','f');
    $('.toggle .btn').html("&#8451;")
    createTemperatureChart(forecastTempF);
  }
});
