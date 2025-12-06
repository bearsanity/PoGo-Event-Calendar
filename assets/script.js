 $(() => { //jquery reads this as the same way as document.addEventListener('DOMContentLoaded', () => {
  "use strict";
   
    //==========================================================================================
    //--------   API Urls + Keys    ---------
    //==========================================================================================
    
    const apiKey = 'e26922b5bf8ae6d46c0de5695047bfd2';
    //const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    //const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    //const duckUrl = 'https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.min.json';


    
    
    
    //==========================================================================================
    //--------   Hooks into page   ---------
    //==========================================================================================
    
    const updateButton = $('#update-button');
    const cityInput = $('#city-input');
    var calendarEl = document.getElementById('calendar');
    let calendar; //Defined as null, to be updated with renderCalendar. Defined here so it can be accessed by other functions
    const currentCityEl = $('#current-city');
    
    
    
    
    //==========================================================================================
    //--------   PoGo Event Functions    ---------
    //==========================================================================================
    
    //List of the event types I don't want to display by default
    const eventsOffByDefault = ['research', 'go-pass', 'go-battle-league', 'season', 'pokemon-go-tour', 'city-safari'];
    
    //Setting colours for the events. With extra colors incase new events are added in the future
    const eventColors = {
        'city-safari': '#f0c297',
        'community-day': '#11d6b2',
        'event': '#78d7ff',
        'go-battle-league': '#1e64d5',
        'go-pass': '#928fb8',
        'max-battles': '#8c80c0',
        'max-mondays': '#c6d831',
        'pokemon-go-tour': '#77b02a',
        'pokemon-spotlight-hour': '#429058',
        'raid-battles': '#f5a15d',
        'raid-day': '#d46453',
        'raid-hour': '#d66078',
        'research': '#ff7a7d',
        'research-day': '#ff417d',
        'season': '#d61a88',
        // '#cf968c'
        // '#8f5765'
        // '#488bd4'
        // '#c7d4e1'
        // '#032769'
    };
    console.log(eventColors);

    //Scrapped duck API link
    const duckUrl = "https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.min.json";

    //Calls the scraped duck api to get all the event data in raw form
    async function getRawEvents() {
        try {
            const response = await fetch(duckUrl);
            if (!response.ok) {
                throw new Error('Invalid response from server');
            }
        const rawEvents = await response.json();
        console.log('All events:', rawEvents);
        return rawEvents;
        
        } catch(err) {            
            alert('There was an getting the events.');
            console.error(err);
        };
    };
    
    //This maps the raw data to an array the Calender can read
    function mapRawEvents(rawEvents) {
        const calenderEvents = rawEvents.map(event =>({
            title: event.name,
            start: event.start,
            end: event.end,
            url: event.link,
            order: 999,
            eventType: event.eventType,
            //turns the display off for the events I want off by default - ternary operator
            display: eventsOffByDefault.includes(event.eventType) ? 'none' : 'block', 
            backgroundColor: eventColors[event.eventType],
            borderColor: eventColors[event.eventType],
        }));
        console.log(calenderEvents);

        return calenderEvents;
    };

    //Gets an array of all the unique event types to be used with the calendar event display toggles
    function getUniqueEventTypes(rawEvents) {
        const eventTypes = rawEvents.map(event => event.eventType);
        const uniqueEventTypes = new Set(eventTypes);
        const uniqueEventTypesUnsorted = [...uniqueEventTypes];
        const uniqueEventTypesArray = uniqueEventTypesUnsorted.sort();
        return uniqueEventTypesArray; 
    };



    
    
    //==========================================================================================
    //--------   Weather Functions    ---------
    //==========================================================================================
    
    //Saving the search to localstorage
    function saveCityToHistory(city) {
        localStorage.setItem('lastCity', city);
    };
    
    //gets location coordinates for getWeather
    async function getCoordinates(city){
        try { 
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
            const response = await fetch(geoUrl);
            
            if (!response.ok) {
                throw new Error("Bad response from server");
            }
            
            const data = await response.json();
            console.log('Data:', data); //console.log to see that it's working

            //If the api returns bad data or no data it will end the process and throw an alert
            if (!Array.isArray(data) || data.length === 0) {
                alert('City not found. Please try searching again.');
                return;
            }
        
        //limit = 1 in the api means only 1 result is returned, but it always returns an array so data[0] is necessary
            const latitude = data[0].lat;
            const longitude = data[0].lon;

            console.log('Lat:', latitude);
            console.log('Lon:', longitude);


            return {
                lat: latitude, 
                lon: longitude,
                name: data[0].name,
                state: data[0].state,
                country: data[0].country
            };

        } catch (err) {
            alert('There was an error finding the city coordinates. Please try again.');
            console.error(err);
        }
    };
    
    //To be called after getCoordinates has retrieved the coordinates of the city
    async function getWeather(latitude, longitude) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

        try { //Let's you attempt code that might fail without crashing the entire script. 
            const response = await fetch(weatherUrl);
            if (!response.ok) {
                throw new Error('Invalid response from server');
            }
            const data = await response.json();
            console.log('Weather data:', data);
            return data;
        
        } catch(err) {
            alert('There was an error finding the weather.');
            console.error(err);
        };
    };
    
    //Gets 5 day forecast in event object form so the calendar can read it
    function getWeatherEvents(weatherInfo) {
        //These indices give current and then the next 5 days around the same time of day
        const indices = [7, 15, 23, 31, 39];
        const weatherEvents = indices.map(i => {
            const dayData = weatherInfo.list[i];
            if (!dayData) {
                return null; 
            }
            
            return {
                eventType: 'weather',
                //Calendar needs date in ISO form
                start: new Date(dayData.dt * 1000).toISOString(),
                temp: dayData.main.temp.toFixed(1),
                humidity: dayData.main.humidity.toFixed(0),
                wind: (dayData.wind.speed * 3.6).toFixed(2),
                icon: dayData.weather[0].icon,
                //Stops the weather from going into the next day
                allDay: true,
                backgroundColor: '#419dbbff',
                //Makes the weather always render last inside the day box
                order: 0,
            };
        });
        return weatherEvents;
    };

    //Add weather objects to calendar
    function addWeatherToCalendar(weatherEvents) {
        //This clears out old weather events if someone is trying to change location
        var events = calendar.getEvents();
        for (let i = 0; i < events.length; i++) {
            if (events[i].extendedProps.eventType === 'weather') { 
               events[i].remove();
            }
        };
        weatherEvents.forEach((event) => {
        calendar.addEvent(event)
        });
    };

    //Toggles which PoGo events are displayed by the calendar
    function toggleEventDisplay(eventToRemove) {
        var events = calendar.getEvents();
        for (let i = 0; i < events.length; i++) {
            if (events[i].extendedProps.eventType === eventToRemove) { //Because eventTypes is a custom property, the calendar saves it under extendedProps
               if (events[i].display === 'none') {
                    events[i].setProp('display', 'block'); //Set prop is the calendar method to change a property
                }   else {events[i].setProp('display', 'none');
                    }
            }
        }
    };

   
   
    //==========================================================================================
    //--------   Render Functions    ---------
    //==========================================================================================
    
    //Calendar from FullCalendar
    function renderCalendar(events){
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: events,
            themeSystem: 'bootstrap5',
            eventTextColor: 'black',
            //Makes the page scroll instead of the calendar
            height: 'auto',
            //Tells the calendar to use the order property I set, in this order of importance
            eventOrder: 'order,start,-duration,allDay,title',
            eventContent: function(arg) {
                if (arg.event.extendedProps.eventType === 'weather') {
                    const weather = arg.event.extendedProps;
                    return { html: `
                        <div class="weather-card">
                        <img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="weather icon">
                        <p>${weather.temp}°C</p>
                        <p>${weather.humidity}%</p>
                        <p>${weather.wind}km/h</p>
                        </div>
                    `};
                }
            // For regular PoGo events, render the time and title
            return { html: `<span class="fc-event-time">${arg.timeText}</span> <span class="fc-event-title">${arg.event.title}</span>` };
            },
            eventClick: function(info) {
            info.jsEvent.preventDefault(); // Url opens a new tab
            if (info.event.url) {
                window.open(info.event.url);
        }}});
        
        calendar.render();
    };

    //Render the toggle box with checkboxes and the corresponding label
    function renderToggleBox(uniqueEvents){
        const container = $('#toggle-box');
        container.empty();
        const span = $('<span>')
            .text('Choose which events to display')
            .attr('id', 'toggle-box-title');
        container.append(span);
        uniqueEvents.forEach(event =>{
            const toggle = $('<input>')
                .attr('type', 'checkbox')
                .addClass('event-toggle')
                .attr('id',`${event}`)
                .on('click', () => {
                    toggleEventDisplay(event);
                })
                //sets the toggles to be checked or unchecked by default
                .prop('checked', eventsOffByDefault.includes(event) ? false : true);
            const label = $('<label>')
                .text(event.replaceAll('-', ' '))
                .attr('for',`${event}`);
            //appending them to a div inside the container so the pairs can be styled together
            const labelBoxPairDiv = $('<div>');
            labelBoxPairDiv.addClass('toggle-box-div');
            labelBoxPairDiv.append(label);
            labelBoxPairDiv.append(toggle);
            container.append(labelBoxPairDiv);
        })
    };

    //Feeds the api info into the render functions then calls them
    async function initializeApp() {    
        const rawEvents = await getRawEvents();        
        const events = mapRawEvents(rawEvents);
        const uniqueEvents = getUniqueEventTypes(rawEvents);

        renderCalendar(events);
        renderToggleBox(uniqueEvents);
        console.log(uniqueEvents);

        const lastCity = localStorage.getItem('lastCity');

        if (lastCity) {
        const coordinates = await getCoordinates(lastCity);
        const weather = await getWeather(coordinates.lat, coordinates.lon);
        const weatherEvents = getWeatherEvents(weather);
        addWeatherToCalendar(weatherEvents);
        
        //Ternary operator to make the display work even if there is no state given
        const locationText = coordinates.state 
        ? `${coordinates.name}, ${coordinates.state}, ${coordinates.country}`
        : `${coordinates.name}, ${coordinates.country}`;
        currentCityEl.text(locationText);
        }
    };

    initializeApp();

    //==========================================================================================
    //--------   Event Listeners    ---------
    //==========================================================================================

    updateButton.on('click', async () => {
        const city = cityInput.val().trim();
        console.log(city);
        cityInput.val('');
        if (city === '') {
            return; //Prevents searching if search is empty
        }

        const coordinates = await getCoordinates(city);
        const weather = await getWeather(coordinates.lat, coordinates.lon);
        const weatherEvents = getWeatherEvents(weather);
        addWeatherToCalendar(weatherEvents);
        saveCityToHistory(coordinates.name);
        
        //Ternary operatory to make the display work even if there is no state given
        const locationText = coordinates.state 
        ? `${coordinates.name}, ${coordinates.state}, ${coordinates.country}`
        : `${coordinates.name}, ${coordinates.country}`;
        currentCityEl.text(locationText);
    });

    cityInput.on('keypress', async (event) => {
        if (event.key !== "Enter") {
            return; //Prevents activation from other keys
        }
        event.preventDefault(); //Prevents page reload
        const city = cityInput.val().trim();
        console.log(city);
        cityInput.val('');
        if (city === '') {
            return; //Prevents searching if search is empty
        }

        const coordinates = await getCoordinates(city);
        const weather = await getWeather(coordinates.lat, coordinates.lon);
        const weatherEvents = getWeatherEvents(weather);
        addWeatherToCalendar(weatherEvents);
        saveCityToHistory(coordinates.name);
        
        //Ternary operatory to make the display work even if there is no state given
        const locationText = coordinates.state 
         ? `${coordinates.name}, ${coordinates.state}, ${coordinates.country}`
         : `${coordinates.name}, ${coordinates.country}`;
        currentCityEl.text(locationText);
    });

    // Navbar burger toggle for mobile
    $('.navbar-burger').on('click', function() {
        $('.navbar-burger').toggleClass('is-active');
        $('.navbar-menu').toggleClass('is-active');
    });
});