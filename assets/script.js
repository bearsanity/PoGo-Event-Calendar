 $(() => { //jquery reads this as the same way as document.addEventListener('DOMContentLoaded', () => {
  "use strict";

//Testing to see if scraped duck works
 
//  const url = "https://raw.githubusercontent.com/bigfoott/ScrapedDuck/data/events.min.json";

//   async function testScrapedDuck() {
//     const response = await fetch(url);
//     const events = await response.json();
//     console.log("All Events:", events);

//     const latestEvent = events.reduce((a, b) =>
//       new Date(b.end) > new Date(a.end) ? b : a
//     );

//     console.log("Latest Event:", latestEvent);
//   }

//   testScrapedDuck();

    const updateButton = $('#update-button');
    const cityInput = $('#city-input');

 //Calendar from FullCalendar

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth'
    });
    
    calendar.render();
      
});