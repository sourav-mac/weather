'use strict';
import { fetchData,url } from "./api.js";
import * as module from "./module.js";
/**
 * 
 * @param {NodeList} elements Elemetns node array
 * @param {String} eventType Event Type e.g: "click","mouseover"
 * @param {Function} callback callback function
 */
const addEventOnElements=(elements, eventType, callback)=>{
    for(const element of elements)
        element.addEventListener(eventType,callback);
}
const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");
const toggleSearch=()=>{
    searchView.classList.toggle("active");
}
addEventOnElements(searchTogglers,"click",toggleSearch);

// search integration

const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeOut =null;
let searchTimeOutDuration = 500;

searchField.addEventListener("input",()=>{
    console.log("Search timeout before:", searchTimeOut);
    // Fix the incorrect nullish coalescing operator usage
    if (searchTimeOut) clearTimeout(searchTimeOut);
    console.log("Search timeout after:", searchTimeOut);
    
    if(!searchField.value){
        searchResult.classList.remove("active");
        searchResult.innerHTML="";
        searchField.classList.remove("searching");
    }
    else{
        searchField.classList.add("searching");
    }
    if(searchField.value){
        clearTimeout(searchTimeOut)
        searchTimeOut=setTimeout(()=>{
            fetchData(url.geo(searchField.value),(locations)=>{
                searchField.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML=`
                    <ul class="view-list" data-search-list></ul>
                `;
                const items=[];
                for (const{name, lat, lon, country, state} of locations){
                    const searchItem =document.createElement("li");
                    searchItem.classList.add("view-item");
                    searchItem.innerHTML=`
                        <span class="m-icon">location_on</span>
                        <div>
                            <p class="item-title">${name}</p>
                            <p class="label-2 item-subtitle">${state||""} ${country}</p>
                        </div>
                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>
                    `;
                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"))
                }
                addEventOnElements(items,"click",()=>{
                    toggleSearch();
                    searchResult.classList.remove("active")
                })
            });
        },searchTimeOutDuration);
    }
});

// Hide search suggestions when clicking outside
document.addEventListener("click", (e) => {
    const searchView = document.querySelector("[data-search-view]");
    const isClickInsideSearch = searchView.contains(e.target);
    
    if (!isClickInsideSearch && searchResult.classList.contains("active")) {
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
    }
});

const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]")

export const updateWeather = (lat,lon)=>{
    console.log("Update Weather params:", { lat, lon });
    loading.style.display="grid";
    //container.style.overflowY="hidden";
    container.classList.remove("fade-in");
    errorContent.style.display="none";

    const currentWeatherSection =document.querySelector("[data-current-weather]");
    const highlightSection =document.querySelector("[data-highlights]");
    const hourlySection =document.querySelector("[data-hourly-forecast]");
    const forecastSection =document.querySelector("[data-5-day-forecast]");

    currentWeatherSection.innerHTML=""
    highlightSection.innerHTML=""
    hourlySection.innerHTML=""
    forecastSection.innerHTML=""

    if(window.location.hash == "#/current-location")
        currentLocationBtn.setAttribute("disabled","");
    else
        currentLocationBtn.removeAttribute("disabled");
    
    //CURRENT WEATHER

    fetchData(url.currentWeather(lat,lon),(currentWeather)=>{
        const{
            weather,
            dt: dateUnix,
            sys:{sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
            main: {temp, feels_like, pressure, humidity},
            visibility,
            timezone
        } = currentWeather;
        const[{description,icon}] = weather;
        const card = document.createElement("div");
        card.classList.add("card","card-lg","current-weather-card");
        card.innerHTML=`
            <h2 class="title-2 card-title">Now</h2>
            <div class="wrapper">
                <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
                <img src="./static/images/${icon}.png" width="64" height="64" alt="${description}" class="weather-icon">
            </div>
            <p class="body-3">${description}</p>
            <ul class="meta-list">
                <li class="meta-item">
                    <span class="m-icon">calendar_today</span>
                    <p class="title-3 meta-text">${module.getDate(dateUnix,timezone)}</p>
                </li>
                <li class="meta-item">
                    <span class="m-icon">location_on</span>
                    <p class="title-3 meta-text" data-location></p>
                </li>
            </ul>
        `
        fetchData(url.reverseGeo(lat,lon),([{name,country}])=>{
            card.querySelector("[data-location]").innerHTML=`${name}, ${country}`;
        })
        currentWeatherSection.appendChild(card);

        //today's highlights

        fetchData(url.airPollution(lat,lon),(airPollution)=>{
            const[{
                main :{aqi},
                components: {no2, o3, so2, pm2_5}
            }]=airPollution.list;

            const card=document.createElement("div");
            card.classList.add("card","card-lg");
            card.innerHTML=`
            <h2 class="title-2" id="highlights-label">Today Highlights</h2>
            <div class="highlight-list">
                                <div class="card card-sm highlight-card one" style="position: relative;">
                    <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}" style="position: absolute; top: 16px; right: 16px;">
                        ${module.aqiText[aqi].level}
                    </span>
                    <h3 class="title-3">Air Quality Index</h3>
                    <div class="wrapper">
                        <span class="m-icon">air</span>
                        <ul class="card-list">
                            <li class="card-item">
                                <p class="title-1">${pm2_5.toPrecision(3)}</p>
                                <p class="label-1">PM<sub>2.5</sub></p>
                            </li>
                            <li class="card-item">
                                <p class="title-1">${so2.toPrecision(3)}</p>
                                <p class="label-1">SO<sub>2</sub></p>
                            </li>
                            <li class="card-item">
                                <p class="title-1">${no2.toPrecision(3)}</p>
                                <p class="label-1">No<sub>2</sub></p>
                            </li>
                            <li class="card-item">
                                <p class="title-1">${o3.toPrecision(3)}</p>
                                <p class="label-1">O<sub>3</sub></p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="card card-sm highlight-card two">
                    <h3 class="title-3">Sunrise & Sunset</h3>
                    <div class="wrapper">
                        <div class="card-list">
                            <div class="card-item">
                                <span class="m-icon">clear_day</span>
                                <div class="label-1">
                                    <p class="label-1">Sunrise</p>
                                    <p class="title-1">${module.getTime(sunriseUnixUTC,timezone)}</p>
                                </div>
                            </div>
                            <div class="card-item">
                                <span class="m-icon">clear_night</span>
                                <div class="label-1">
                                    <p class="label">Sunset</p>
                                    <p class="title-1">${module.getTime(sunsetUnixUTC,timezone)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card card-sm highlight-card">
                    <h3 class="title-3">Humidity</h3>
                    <div class="wrapper">
                        <span class="m-icon">humidity_percentage</span>
                        <p class="title-1">${humidity}<sub>%</sub></p>
                    </div>
                </div>
                <div class="card card-sm highlight-card">
                    <h3 class="title-3">Pressure</h3>
                    <div class="wrapper">
                        <span class="m-icon">airwave</span>
                        <p class="title-1">${pressure} <sub>hba</sub></p>
                    </div>
                </div>
                <div class="card card-sm highlight-card">
                    <h3 class="title-3">Visibility</h3>
                    <div class="wrapper">
                        <span class="m-icon">visibility</span>
                        <p class="title-1">${visibility/1000} <sub>KM</sub></p>
                    </div>
                </div>
                <div class="card card-sm highlight-card">
                    <h3 class="title-3">Feels Like</h3>
                    <div class="wrapper">
                        <span class="m-icon">thermostat</span>
                        <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
                    </div>
                </div>
            </div>
            `;
            highlightSection.appendChild(card)
        })

        //24H forecast

        fetchData(url.forecast(lat,lon),(forecast)=>{
            const{
                list: forecastList,
                city:{timezone}
            } = forecast;
            hourlySection.innerHTML=`
                <div class="card card-lg hourly-card">
                    <h2 class="title-2 hourly-header">Today at</h2>
                    <div class="slider-container">
                        <ul class="slider-list" data-temp></ul>
                        <ul class="slider-list" data-wind></ul>
                    </div>
                </div>
            `;
            for (const[index,data] of forecastList.entries()){
                if(index>7)
                    break
                const{
                    dt: dateTimeUnix,
                    main: {temp},
                    weather,
                    wind: {deg:windDirection, speed:windSpeed}
                }=data;
                const[{icon,description}]=weather;
                const tempLi=document.createElement("li");
                tempLi.classList.add("slider-item");
                tempLi.innerHTML=`
                    <div class="card card-sm slider-card">
                        <p class="body-3">${module.getTime(dateTimeUnix,timezone)}</p>
                        <img src="./static/images/${icon}.png" width="48" height="48" loading="lazy" alt="${description}" class="weather-icon" title="${description}">
                        <p class="body-3">${temp}&deg;</p>
                    </div>
                    `;
                hourlySection.querySelector("[data-temp]").appendChild(tempLi);
                const windLi = document.createElement("li");
                windLi.classList.add("slider-item");
                windLi.innerHTML=`
                    <div class="card card-sm slider-card">
                        <p class="body-3">${module.getTime(dateTimeUnix,timezone)}</p>
                        <img src="./static/images/direction.png" width="48" height="48" loading="lazy" alt="" class="weather-icon" style="transform :rotate(${windDirection - 180}deg)">
                        <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed)) }Km/h</p>
                    </div>
                `;
                hourlySection.querySelector("[data-wind]").appendChild(windLi);
            }

            //5 day forecast

            forecastSection.innerHTML=`
                <div class="card card-lg forecast-card">
                    <h2 class="title-2 forecast-header" id="forecast-label">5 Days Forecast</h2>
                    <ul data-forecast-list></ul>
                </div>
            `;
            for(let i=7,len=forecastList.length;i<len;i+=8){
                const{
                    main:{temp_max},
                    weather,
                    dt_txt
                }=forecastList[i];
                const [{icon,description}]=weather;
                const date =new Date(dt_txt);
                const li =document.createElement("li");
                li.classList.add("card-item");
                li.innerHTML=`
                    <div class="icon-wrapper">
                        <img src="./static/images/${icon}.png" width="36" height="36" alt="${description}" class="weather-icon">
                        <span class="span">
                        <p class="title-2">${parseInt(temp_max)}&deg;</p>
                        </span>
                    </div>
                    <p class="label-1">${date.getDate()} ${module.monthNames[date.getMonth()]}</p>
                    <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
                `;
                forecastSection.querySelector("[data-forecast-list]").appendChild(li)
                
            }
            loading.style.display="none";
            container.classList.add("fade-in");
        });
    });
}
export const error404=()=>{
    errorContent.style.display="flex"
};