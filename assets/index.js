const apiKey = '309b7352947e9c4707f371796564f348';
const button = document.querySelector('.button');
const input = document.querySelector('.input');
const cardContainer = document.querySelector('.cardContainer');
const search = document.querySelector('.search');

const savedCities = JSON.parse(localStorage.getItem('cities')) || [];
savedCities.forEach((city) => {
  createButton(city);
});

button.addEventListener('click', handleClick);

 async function handleClick() {
    const city = input.value
    const api = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    try {
        const response = await fetch(api);
        const data = await response.json();
        const results = data.list;
    const weather = [];

    let startIndex = 0;
    for (let i = 0; i < 6; i++) {
      const forecast = results[startIndex];
      const forecastData = {
        dt_txt: forecast.dt_txt,
        icon: forecast.weather[0].icon,
        temp: forecast.main.temp,
        wind: forecast.wind.speed,
        humidity: forecast.main.humidity,
        city: city, 
      };
      weather.push(forecastData);

      startIndex += 7;
    }

    const savedWeather = JSON.parse(localStorage.getItem('weather')) || [];
    savedWeather.push(...weather);
    localStorage.setItem('weather', JSON.stringify(savedWeather));

    const savedCities = JSON.parse(localStorage.getItem('cities')) || [];
    if (!savedCities.includes(city)) {
      savedCities.push(city);
      localStorage.setItem('cities', JSON.stringify(savedCities));
      createButton(city);
    }

             renderCards(weather);
            } catch (error) {
              console.error('Error:', error);
            }
      
      } 

      function createButton(city) {
        const loadButton = document.createElement('button');
        loadButton.textContent = city;
        loadButton.setAttribute('data-city', city);
        loadButton.classList.add('save');
        loadButton.addEventListener('click', loadSavedWeather);
        search.appendChild(loadButton);
      }

      
      function createCard(data, isMainCard = false) {
        const card = document.createElement('div');
        card.classList.add('card');
      
        if (isMainCard) {
          card.classList.add('mainCard');
          const city = data.city;
          const title = document.createElement('h2');
          title.textContent = city;
          card.appendChild(title);
        }
      
        const keys = Object.keys(data);
        for (const key of keys) {
          const value = data[key];
          if (key === 'dt_txt') {
            const date = value.split(' ')[0];
            const paragraph = document.createElement('p');
            paragraph.textContent = date;
            card.appendChild(paragraph);
            continue;
          }
      
          if (key === 'icon') {
            const iconImg = document.createElement('img');
            iconImg.src = `https://openweathermap.org/img/wn/${value}.png`;
            card.appendChild(iconImg);
          } else if (key === 'temp') {
            const celsius = value - 273.15;
            const fahrenheit = (celsius * 9) / 5 + 32;
            const paragraph = document.createElement('p');
            paragraph.textContent = `Temperature: ${fahrenheit.toFixed(2)}°F`;
            card.appendChild(paragraph);
          } else if (key === 'wind') {
            const paragraph = document.createElement('p');
            paragraph.textContent = `Wind: ${value} mph`;
            card.appendChild(paragraph);
          } else if (key === 'humidity') {
            const paragraph = document.createElement('p');
            paragraph.textContent = `Humidity: ${value}%`;
            card.appendChild(paragraph);
          }
        }
      
        return card;
      }
  
  function renderCards(weather) {
    cardContainer.innerHTML = '';
  
    if (weather && weather.length > 0) {
      const mainCard = createCard(weather[0], true);
      cardContainer.appendChild(mainCard);
  
      for (let i = 1; i < weather.length; i++) {
        const card = createCard(weather[i]);
        cardContainer.appendChild(card);
      }
    } else {
      const message = document.createElement('p');
      message.textContent = 'No weather data available.';
      cardContainer.appendChild(message);
    }
  }


  function loadSavedWeather(e) {
    const city = e.target.getAttribute('data-city');
    const savedWeather = JSON.parse(localStorage.getItem('weather')) || [];
    const weather = savedWeather.filter((data) => data.city === city);
    renderCards(weather);
  }