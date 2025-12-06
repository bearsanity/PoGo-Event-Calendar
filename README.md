# <PoGo Event Calendar>

## Description

-This app is an interactive Pokémon GO Event + Weather Calendar that lets users view upcoming in-game events alongside a 5-day weather forecast for any city.
As this is a game that mostly takes place outdoors, having the weather and a full event schedule together can be extremely useful for players. 


-Building this project helped me strengthen my skills with real-world APIs and dynamic front-end development. I practiced making multiple asynchronous requests 
in sequence (geocoding → forecast), handling errors and edge cases gracefully, and transforming raw API data into a structure that FullCalendar can render. 
I also improved my understanding of DOM manipulation with jQuery, event-driven UI updates, and using localStorage to persist user data. Overall, this project 
helped me connect external data sources to a clean, interactive user experience.



## Usage

-Visit "https://bearsanity.github.io/PoGo-Event-Calendar/"

#Note for mobile users, I recommend turning your screen sideways when viewing the app. It will make for a much better experience.

<img width="848" height="637" alt="Screenshot 2025-12-06 at 4 10 40 AM" src="https://github.com/user-attachments/assets/437b35af-7197-4ef8-a11d-11c719b348e2" />

-Clicking on an event will open the relevant Leek Duck page for the event


-Enter a city name (e.g., “Toronto”) into the search box and click the "Update" button 
(or press Enter) if you would like the weather for the next 5 days displayed in the calendar, 
if not then ignore this. The search requires you to be quite specific to get the correct results. 
i.e search for "st. john's" if that is what you are looking for. st johns will give you an incorrect 
result. It is however not cap sensitive.


<img width="507" height="129" alt="Screenshot 2025-12-06 at 3 39 04 AM" src="https://github.com/user-attachments/assets/a809bdef-248d-4f6d-becb-eff7d31de4f3" />



-The weather card will then display in the calendar with the weather icon, temperature (°C), humidity(%), and wind speed(km/h).


<img width="434" height="119" alt="Screenshot 2025-12-06 at 3 43 21 AM" src="https://github.com/user-attachments/assets/a5e931f1-9e9f-4a98-b82f-b18ec55b8380" />



-You can use the toggle switches on the left to choose which events you want displayed in the calendar. Some of them are disabled by default.

<img width="286" height="675" alt="Screenshot 2025-12-06 at 3 47 43 AM" src="https://github.com/user-attachments/assets/bc35caac-5e01-44b3-a149-36ddc559052a" />



## To dos
-Clear button to remove weather entirely

-Option to move forecast outside of calendar

-Dark/Light-mode toggles




## Credits
Implemented by @bearsanity 

LinkedIn - https://www.linkedin.com/in/james-sweeney-304905206/



Special thanks to Leek Duck and @bigfoott (https://github.com/bigfoott/ScrapedDuck) for providing the Pokémon Go events.

Special thanks to OpenWeather for providing the weather data.

Special thanks to @pixelator on Lospec for the event colour palette.

## License

Copyright (c) [2025] [James Sweeney]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
