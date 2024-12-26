/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
let apiKey; // Will be fetched from the server

// Fetch the API key from the server when the app loads
const fetchApiKey = async () => {
    const response = await fetch('/get-api-key');
    const data = await response.json();
    apiKey = data.apiKey;
};
fetchApiKey();

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

const userInfo = document.getElementById('userInfo');

// Event listener to add function to existing HTML DOM element
const generateBtn = document.getElementById('generate');
generateBtn.addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e) {
    e.preventDefault();

    const zipCode = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;

    if (zipCode !== '') {
        generateBtn.classList.remove('invalid');
        getWeatherData(baseUrl, zipCode, apiKey)
            .then(function (data) {
                postData('/add', {
                    temp: convertKelvinToCelsius(data.main.temp),
                    date: newDate,
                    content: content,
                });
            })
            .then(function () {
                updateUI();
            })
            .catch(function (error) {
                console.log(error);
                alert('The zip code is invalid. Try again');
            });
        userInfo.reset();
    } else {
        generateBtn.classList.add('invalid');
    }
}

/* Function to GET Web API Data */
const getWeatherData = async (baseUrl, zipCode, apiKey) => {
    const res = await fetch(`${baseUrl}?q=${zipCode}&appid=${apiKey}`);
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};

const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        if (
            allData.date !== undefined &&
            allData.temp !== undefined &&
            allData.content !== undefined
        ) {
            document.getElementById('date').innerHTML = allData.date;
            document.getElementById('temp').innerHTML = allData.temp + ' degree C';
            document.getElementById('content').innerHTML = allData.content;
        }
    } catch (error) {
        console.log('error', error);
    }
};

/* Helper function to convert temperature from Kelvin to Celsius */
function convertKelvinToCelsius(kelvin) {
    return kelvin < 0 ? 'below absolute zero (0 K)' : (kelvin - 273.15).toFixed(2);
}
