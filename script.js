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
    fetchTodos();
    getLocationAndWeather();
});

const apiUrl = 'http://vm2208.kaj.pouta.csc.fi:8344/todos';
const authUrl = 'http://vm2208.kaj.pouta.csc.fi:8344';


async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${authUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('api_key', result.api_key);
            document.getElementById('auth-widget').style.display = 'none';
            document.getElementById('todo-widget').style.display = 'block';
            fetchTodos();
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error registering:', error);
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${authUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('api_key', result.api_key);
            document.getElementById('auth-widget').style.display = 'none';
            document.getElementById('todo-widget').style.display = 'block';
            fetchTodos();
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

async function fetchTodos() {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
        alert('API key is missing!');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const todos = await response.json();
        renderTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

function renderTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
            ${todo.task} (Category: ${todo.categoryname})
            <button class="complete" onclick="toggleTodoComplete(${todo.todoid}, ${!todo.completed})">Complete</button>
            <button class="delete" onclick="deleteTodo(${todo.todoid})">Delete</button>
        `;
        todoList.appendChild(li);
    });
}

async function createTodo() {
    const task = document.getElementById('new-todo-task').value;
    const categoryId = document.getElementById('new-todo-category').value;
    const apiKey = localStorage.getItem('api_key');

    if (!apiKey || !task || !categoryId) {
        alert('API key, task, and category ID are required!');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                task: task,
                category_id: categoryId
            })
        });
        if (response.ok) {
            fetchTodos();
            document.getElementById('new-todo-task').value = '';
            document.getElementById('new-todo-category').value = '';
        } else {
            alert('Error creating todo');
        }
    } catch (error) {
        console.error('Error creating todo:', error);
    }
}

async function toggleTodoComplete(todoId, completed) {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
        alert('API key is missing!');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                completed: completed
            })
        });
        if (response.ok) {
            fetchTodos();
        } else {
            alert('Error updating todo');
        }
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTodo(todoId) {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
        alert('API key is missing!');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${todoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        if (response.ok) {
            fetchTodos();
        } else {
            alert('Error deleting todo');
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

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

function saveTodoAPIKey() {
    const todoApiKey = document.getElementById('todo-api-key').value.trim();
    if (todoApiKey === '') {
        setStatusMessage('ToDo API key is missing!', 'error');
        return;
    }
    localStorage.setItem('todo_api_key', todoApiKey);
    setStatusMessage('ToDo API key saved successfully!', 'success');
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
