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
        currencyWidget.innerHTML = `<h2>Dagens Euro i USD</h2><p>1 Euro = ${usdRate.toFixed(2)} US Dollar (USD)</p>`;
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

// Vädret

async function getWeather(latitude, longitude) {
    try {
        const apiKey = localStorage.getItem('weatherApiKey');
        if (!apiKey) {
            console.error('Weather API nyckeln fattas.');
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
        weatherElement.textContent = `Tillfälliga vädret: ${data.weather[0].description}, Temperatur: ${data.main.temp}°C`;

        const iconCode = data.weather[0].icon;
       
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const iconElement = document.createElement('img');
        iconElement.src = iconUrl;
     
        weatherElement.appendChild(iconElement);
    } catch (error) {
        console.error('Error fetching väder data:', error);
    }
}






function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            getWeather(latitude, longitude);
        }, error => {
            console.error('Error med geolocation:', error);
        });
    } else {
        console.error('Geolocation är inte supporterad av din browser.');
    }
}


if (!localStorage.getItem('weatherApiKey')) {
    updateApiKey();
}


getLocationAndWeather();

//AI koden


function saveAPIKey() {
    const openaiApiKey = document.getElementById('openai-api-key').value.trim();
    if (openaiApiKey === '') {
        setStatusMessage('API key is missing!', 'error');
        return;
    }
    localStorage.setItem('openAI_API_key', openaiApiKey);
    setStatusMessage('API key saved successfully!', 'success');
}


async function queryOpenAIAPI(question) {
    try {
       
        const apiKey = localStorage.getItem('openAI_API_key');
        if (!apiKey) {
            console.error('API-nyckel saknas. Vänligen hämta din API-nyckel och spara den i localStorage.');
            return;
        }

        const url = `https://openai-ama-api-fw-teaching.rahtiapp.fi/?api_key=${apiKey}`;

     
        const requestBody = JSON.stringify(question);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });

        if (response.ok) {
            const responseData = await response.json();
            return responseData.answer;
        } else {
            console.error('Något gick fel vid kommunikationen med API:et.');
            return null;
        }
    } catch (error) {
        console.error('Ett fel uppstod:', error);
        return null;
    }
}

//koden för att ställa frågan

async function askQuestion() {
    const questionInput = document.getElementById('question');
    const question = questionInput.value.trim();

    if (question === '') {
        alert('Vänligen ange en fråga.');
        return;
    }

    const answerDiv = document.getElementById('answer');
    answerDiv.textContent = 'Vänta...';

    const answer = await queryOpenAIAPI(question);

    if (answer !== null) {
        answerDiv.textContent = answer;
    } else {
        answerDiv.textContent = 'Kunde inte hämta svar från API:et.';
    }
}





// Settings nedanför


document.getElementById('settings-icon').addEventListener('click', function() {
    const settingsMenu = document.getElementById('settings-menu');
    if (settingsMenu.style.display === 'block') {
        settingsMenu.style.display = 'none';
    } else {
        settingsMenu.style.display = 'block';
    }
});


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


