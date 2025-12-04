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
    let calendar; //Defined as null, to be updated with renderCalendar. Defined here so it can be accessed by other functions

    //----------------
    //Helper functions
    //----------------
    
    //List of the event types I don't want to display by default
    const eventsOffByDefault = ['research', 'go-pass', 'go-battle-league', 'season'];
    
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
    
    // This maps the raw data to an array the Calender can read
    function getScrapedDuckEvents(rawEvents) {
        const calenderEvents = rawEvents.map(event =>({
            title: event.name,
            start: event.start,
            end: event.end,
            url: event.link,
            eventType: event.eventType,
            display: eventsOffByDefault.includes(event.eventType) ? 'none' : 'auto', //turns the display off for the events I want off by default - ternary operator
        }));
        console.log(calenderEvents);
        return calenderEvents;
    };

    //Gets an array of all the unique event types to be used with the calendar event display toggles
    function getUniqueEventTypes(rawEvents) {
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

    function toggleEventDisplay(eventToRemove) {
        var events = calendar.getEvents();
        for (let i = 0; i < events.length; i++) {
            if (events[i].extendedProps.eventType === eventToRemove) { //Because eventTypes is a custom property, the calendar saves it under extendedProps
               if (events[i].display === 'none') {
                    events[i].setProp('display', 'auto'); //Set prop is the calendar method to change a property
                }   else {events[i].setProp('display', 'none');
                    }
            }
        }
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


  
    //Calendar from FullCalendar
    function renderCalendar(events){
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: events,
            themeSystem: 'bootstrap5',
            eventClick: function(info) {
            info.jsEvent.preventDefault(); // Url opens a new tab
            if (info.event.url) {
                window.open(info.event.url);
        }}});
        
        calendar.render();
    };

    function renderToggleBox(uniqueEvents){
        const container = $('#toggle-box');
        container.empty();
        uniqueEvents.forEach(event =>{
            const toggle = $('<input>')
                .attr('type', 'checkbox')
                .addClass('event-toggle')
                .attr('id',`${event}`)
                .on('click', () => {
                    toggleEventDisplay(event);
                })
                .prop('checked', eventsOffByDefault.includes(event) ? false : true);//sets the toggles to be checked or unchecked by default
            const label = $('<label>')
                .text(event)
                .attr('for',`${event}`);
            container.append(toggle);
            container.append(label);
        })
    };

    //Feeds the api info into the render functions then calls them
    async function initializeApp() {    
        const rawEvents = await getRawEvents();        
        const events = getScrapedDuckEvents(rawEvents);
        const uniqueEvents = getUniqueEventTypes(rawEvents);

        renderCalendar(events);
        renderToggleBox(uniqueEvents);
        console.log(uniqueEvents);
    };

    initializeApp();

    //---------------
    //Event listeners
    //---------------

    //updateButton.on('click', )
});