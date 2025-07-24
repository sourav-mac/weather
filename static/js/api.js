'use strict';

const apiKey= "511c0d53e786d6e701870951d85c605d";

// Helper function to add timeout to fetch
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeout)
        )
    ]);
};

export const fetchData = (URL,callback)=>{
    console.log("API Request:", URL);
    fetchWithTimeout(`${URL}&appid=${apiKey}`, {}, 10000)
    .then(res=>{
        console.log("API Response status:", res.status);
        if (!res.ok) {
            console.error("API error:", res.status, res.statusText);
            throw new Error(`API error: ${res.status}`);
        }
        return res.json();
    })
    .then(data=>{
        console.log("API Data received:", Object.keys(data));
        callback(data);
    })
    .catch(err => {
        console.error("API Error:", err);
        
        // Hide loading screen and show error message
        const loading = document.querySelector("[data-loading]");
        const errorContent = document.querySelector("[data-error-content]");
        
        if (loading) loading.style.display = "none";
        if (errorContent) {
            const errorMessage = document.createElement("p");
            errorMessage.classList.add("body-1");
            errorMessage.textContent = "Failed to fetch weather data. Please try again later.";
            
            // Check if error message already exists
            const existingMessage = errorContent.querySelector(".body-1:not(:first-child)");
            if (!existingMessage) {
                errorContent.appendChild(errorMessage);
            }
            
            errorContent.style.display = "flex";
        }
    });
}

export const url ={
    currentWeather(lat,lon){
        // Check if lat and lon already include parameter names
        const latParam = lat.includes('lat=') ? lat : `lat=${lat}`;
        const lonParam = lon.includes('lon=') ? lon : `lon=${lon}`;
        return `https://api.openweathermap.org/data/2.5/weather?${latParam}&${lonParam}&units=metric`
    },
    forecast(lat,lon){
        // Check if lat and lon already include parameter names
        const latParam = lat.includes('lat=') ? lat : `lat=${lat}`;
        const lonParam = lon.includes('lon=') ? lon : `lon=${lon}`;
        return `https://api.openweathermap.org/data/2.5/forecast?${latParam}&${lonParam}&units=metric`
    },
    airPollution(lat,lon){
        // Check if lat and lon already include parameter names
        const latParam = lat.includes('lat=') ? lat : `lat=${lat}`;
        const lonParam = lon.includes('lon=') ? lon : `lon=${lon}`;
        return `https://api.openweathermap.org/data/2.5/air_pollution?${latParam}&${lonParam}`
    },
    reverseGeo(lat,lon){
        // Check if lat and lon already include parameter names
        const latParam = lat.includes('lat=') ? lat : `lat=${lat}`;
        const lonParam = lon.includes('lon=') ? lon : `lon=${lon}`;
        return `https://api.openweathermap.org/geo/1.0/reverse?${latParam}&${lonParam}&limit=5`
    },
    /**
     * @param {string} query search query e.g. :"london" , "New Yourk"  
     */
    geo(query){
        return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
}