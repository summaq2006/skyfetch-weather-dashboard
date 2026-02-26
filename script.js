function WeatherApp(apiKey) {
    this.apiKey = apiKey;

    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");

    this.cityElement = document.getElementById("city");
    this.tempElement = document.getElementById("temperature");
    this.descElement = document.getElementById("description");
    this.iconElement = document.getElementById("icon");

    this.errorElement = document.getElementById("error");
    this.loadingElement = document.getElementById("loading");
    this.forecastContainer = document.getElementById("forecast-container");

    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
}
WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.errorElement.innerText = "Please enter a city name.";
        return;
    }

    this.fetchWeatherData(city);
};

WeatherApp.prototype.fetchWeatherData = function (city) {
    this.loadingElement.style.display = "block";
    this.errorElement.innerText = "";
    this.forecastContainer.innerHTML = "";

    const currentWeatherURL =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`;

    const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`;

    Promise.all([
        axios.get(currentWeatherURL),
        axios.get(forecastURL)
    ])
    .then((responses) => {
        const currentData = responses[0].data;
        const forecastData = responses[1].data;

        this.displayCurrentWeather(currentData);
        this.displayForecast(forecastData);
    })
    .catch(() => {
        this.errorElement.innerText = "City not found. Please try again.";
    })
    .finally(() => {
        this.loadingElement.style.display = "none";
    });
};

WeatherApp.prototype.displayCurrentWeather = function (data) {
    this.cityElement.innerText = data.name;
    this.tempElement.innerText = data.main.temp + "°C";
    this.descElement.innerText =
        data.weather[0].description.charAt(0).toUpperCase() +
        data.weather[0].description.slice(1);

    this.iconElement.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
};

WeatherApp.prototype.displayForecast = function (data) {
    const dailyData = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyData.slice(0, 5).forEach(day => {
        const date = new Date(day.dt_txt);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
            <h4>${dayName}</h4>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
            <p>${day.main.temp}°C</p>
            <p>${day.weather[0].description}</p>
        `;

        this.forecastContainer.appendChild(card);
    });
};

const app = new WeatherApp("f05d8429dd24ad17444fb58b8877908c");