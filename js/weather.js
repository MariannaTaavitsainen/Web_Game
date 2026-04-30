const weatherBox = document.getElementById("weatherContent");

async function loadWeather() {
    const city = "Oulu";

    try {
        const res = await fetch(`/weather?city=${city}`);
        const data = await res.json();

        console.log(data);

        if (!data.main) {
            weatherBox.innerText = "Weather data not available";
            return;
        }

        const temp = Math.round(data.main.temp);
        const desc = data.weather[0].description;

        weatherBox.innerHTML = `
            ${temp}°C<br>
            ${desc}
        `;

    } catch (err) {
        weatherBox.innerText = "Error fetching weather data";
    }
}

loadWeather();