async function fetchIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ipWidget = document.getElementById('ip-widget');
        ipWidget.innerHTML = `<h2>IP Address Widget</h2><p>Your IP Address: ${data.ip}</p>`;
    } catch (error) {
        const ipWidget = document.getElementById('ip-widget');
        ipWidget.innerHTML = `<h2>IP Address Widget</h2><p>Failed to fetch IP address.</p>`;
    }
}

async function fetchCurrency() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        const data = await response.json();
        const currencyWidget = document.getElementById('currency-widget');
        const usdRate = data.rates.USD;
        currencyWidget.innerHTML = `<h2>Currency Exchange Rate Widget</h2><p>1 Euro = ${usdRate.toFixed(2)} US Dollar (USD)</p>`;
    } catch (error) {
        const currencyWidget = document.getElementById('currency-widget');
        currencyWidget.innerHTML = `<h2>Currency Exchange Rate Widget</h2><p>Failed to fetch currency exchange rate.</p>`;
    }
}

fetchCurrency();

async function fetchQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        const quoteWidget = document.getElementById('quote-widget');
        quoteWidget.innerHTML = `<h2>Random Quote Widget</h2><p>"${data.content}" - ${data.author}</p>`;
    } catch (error) {
        const quoteWidget = document.getElementById('quote-widget');
        quoteWidget.innerHTML = `<h2>Random Quote Widget</h2><p>Failed to fetch random quote.</p>`;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    fetchIP();
    fetchCurrency();
    fetchQuote();
});

async function getWeather(latitude, longitude) {
    try {
        const apiKey = localStorage.getItem('weatherApiKey');
        if (!apiKey) {
            console.error('Weather API key is missing.');
            return;
        }
        
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.sys) {
            console.error('Weather data error.');
            return;
        }

        const locationElement = document.getElementById('location');
        locationElement.textContent = `Location: ${data.name}, ${data.sys.country}`;

        const cityElement = document.getElementById('city');
        cityElement.textContent = `City: ${data.name}`;

        const weatherElement = document.getElementById('weather');
        weatherElement.textContent = `Current Weather: ${data.weather[0].description}, Temperature: ${data.main.temp}°C`;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeather(latitude, longitude);
        }, error => {
            console.error('Geolocation error:', error);
        });
    } else {
        console.error('Geolocation is not supported by your browser.');
    }
}

if (!localStorage.getItem('weatherApiKey')) {
    updateApiKey(); // Call the function to update the weather API key if it's missing
}

getLocationAndWeather();

function saveAPIKey() {
    const openaiApiKey = document.getElementById('openai-api-key').value.trim();
    if (openaiApiKey === '') {
        setStatusMessage('API key is missing!', 'error');
        return;
    }
    localStorage.setItem('openAI_API_key', openaiApiKey);
    setStatusMessage('API key saved successfully!', 'success');

}

function saveWeatherKey() {
    const weatherApiKey = document.getElementById('weather-api-key').value.trim();
    if (weatherApiKey === '') {
        setStatusMessage('Weather API key is missing!', 'error');
        return;
    }
    localStorage.setItem('weatherApiKey', weatherApiKey);
    setStatusMessage('Weather API key saved successfully!', 'success');
}


function setStatusMessage(message, type) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = type;
}

document.getElementById('settings-icon').addEventListener('click', function() {
    const settingsMenu = document.getElementById('settings-menu');
    if (settingsMenu.style.display === 'block') {
        settingsMenu.style.display = 'none';
    } else {
        settingsMenu.style.display = 'block';
    }
});
