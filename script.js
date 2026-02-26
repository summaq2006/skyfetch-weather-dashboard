const apiKey = "f05d8429dd24ad17444fb58b8877908c";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityElement = document.getElementById("city");
const tempElement = document.getElementById("temperature");
const descElement = document.getElementById("description");
const iconElement = document.getElementById("icon");
const errorElement = document.getElementById("error");
const loadingElement = document.getElementById("loading");

async function fetchWeather(city) {
    try {
        loadingElement.style.display = "block";
        errorElement.innerText = "";

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        const data = response.data;

        cityElement.innerText = data.name;
        document.title = data.name + " Weather | SkyFetch";

        tempElement.innerText = "Temperature: " + data.main.temp + "°C";

        const description =
            data.weather[0].description.charAt(0).toUpperCase() +
            data.weather[0].description.slice(1);

        descElement.innerText = description;

        iconElement.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    } catch (error) {
        errorElement.innerText = "City not found. Please enter a valid city name.";
        cityElement.innerText = "";
        tempElement.innerText = "";
        descElement.innerText = "";
        iconElement.src = "";
    } finally {
        loadingElement.style.display = "none";
    }
}

searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();

    if (city === "") {
        errorElement.innerText = "Please enter a city name.";
        return;
    }

    fetchWeather(city);
});