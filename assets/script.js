 $(() => { //jquery reads this as the same way as document.addEventListener('DOMContentLoaded', () => {
  "use strict";
   
    //---------------
    //API Urls & Keys 
    //---------------
    const apiKey = 'e26922b5bf8ae6d46c0de5695047bfd2';
    //const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    //const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    //const duckUrl = 'https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.min.json';


    //-------------------
    //Hooks into the page
    //-------------------

    const updateButton = $('#update-button');
    const cityInput = $('#city-input');
    var calendarEl = document.getElementById('calendar');

    //----------------
    //Helper functions
    //----------------
    
    //Scrapped duck API link
    const duckUrl = "https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.min.json";

    //Calls the scraped duck api to get all the event data in raw form
    async function getRawEvents() {
        const response = await fetch(duckUrl);
        const rawEvents = await response.json();
        console.log('All events:', rawEvents);
        return rawEvents;
    };
    
    //Calls scrapped duck API to get raw event data then transforms it into an array that the Calendar can read
    async function getScrappedDuckEvents() {
        const rawEvents = await getRawEvents();

        //This maps the raw data to an array the Calender can read
        const calenderEvents = rawEvents.map(event =>({
            title: event.name,
            start: event.start,
            end: event.end,
            url: event.link,
        }));

        return calenderEvents;
    };

    //Gets an array of all the unique event types to be used with the calendar event display toggles
    async function getUniqueEventTypes() {
        const rawEvents = await getRawEvents();
        const eventTypes = rawEvents.map(event => event.eventType);
        const uniqueEventTypes = new Set(eventTypes);
        const uniqueEventTypesArray = [...uniqueEventTypes];

        return uniqueEventTypesArray; 
    };
   
   
    //Creates the card for current weather
    function renderCurrentWeather(weatherInfo) {
        const container = $('#current-weather');
        container.empty(); //To clear out old content if not already empty
        
        const current = weatherInfo.list[0]; //cleaner than using weatherInfo.list[0] over and over
        
        const city = weatherInfo.city.name;
        const temp = (current.main.temp).toFixed(1);
        const humidity = (current.main.humidity).toFixed(0);
        const wind = (current.wind.speed * 3.6).toFixed(2);//to change it to km/h
        const icon = current.weather[0].icon; //gives the icon code
    };

    
    //--------------
    //Main Functions
    //--------------
    
    //Saving the search to localstorage
    function saveCityToHistory(city) {
        let history = JSON.parse(localStorage.getItem('history')) || []; // [] is incase nothing exists yet

        //To prevent duplicates | .some() checks if any element in the array matches the given condition
        const normalizedCity = city.toLowerCase();
            if (!history.some(c => c.toLowerCase() === normalizedCity)) {
            history.push(city);
            localStorage.setItem('history', JSON.stringify(history));
        }
    };


    //--------------------------
    //Calendar from FullCalendar
    //--------------------------

    async function renderCalendar(){
        const events = await getScrappedDuckEvents();
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: events,
            themeSystem: 'bootstrap5'
        });
        
        calendar.render();
        };

    renderCalendar();

    //---------------
    //Event listeners
    //---------------

    //updateButton.on('click', )
});