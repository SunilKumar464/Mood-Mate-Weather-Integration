 const currentDate = new Date();
 let selectedMood = null;
 let weatherData = { temp: "--", condition: "sunny" };
 

 document.addEventListener('DOMContentLoaded', function() {
     updateDateDisplay();
     setupCalendar();
     loadEntries();
     getLocationAndWeather();
 });


 function updateDateDisplay() {
     const options = { year: 'numeric', month: 'long', day: 'numeric' };
     document.getElementById('current-date').innerText = currentDate.toLocaleDateString('en-US', options);
 }

 
 function setupCalendar() {
     const year = currentDate.getFullYear();
     const month = currentDate.getMonth();
     
     const firstDay = new Date(year, month, 1).getDay();
     const daysInMonth = new Date(year, month + 1, 0).getDate();
     
     let calendarHTML = '';
     let dayCount = 1;
     
   
     for (let i = 0; i < 6; i++) {
         calendarHTML += '<tr>';
         
         for (let j = 0; j < 7; j++) {
             if (i === 0 && j < firstDay) {
                 calendarHTML += '<td></td>';
             } else if (dayCount > daysInMonth) {
                 calendarHTML += '<td></td>';
             } else {
                 const isToday = dayCount === currentDate.getDate();
                 const hasMood = checkMoodForDate(year, month, dayCount);
                 
                 calendarHTML += `<td class="${isToday ? 'active' : ''} ${hasMood ? 'mood-day ' + hasMood : ''}">${dayCount}</td>`;

                 dayCount++;
             }
         }
         
         calendarHTML += '</tr>';
         if (dayCount > daysInMonth) break;
     }
     
     document.getElementById('calendar-dates').innerHTML = calendarHTML;
 }

 
 function checkMoodForDate(year, month, day) {
     const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
     const dateString = `${year}`-`${month+1}`-`${day}`;
     
     const entry = entries.find(e => e.date.split('T')[0] === dateString);
     return entry ? mood-`${entry.mood}` : null;
 }

 
 function toggleCalendar() {
     const calendarView = document.getElementById('calendar-view');
     calendarView.classList.toggle('expanded');
 }

 
 function selectMood(element) {
     // Reset all moods
     document.querySelectorAll('.mood-option').forEach(el => {
         el.classList.remove('selected');
     });
     
     
     element.classList.add('selected');
     selectedMood = element.getAttribute('data-mood');
 }


 function saveMoodEntry() {
     if (!selectedMood) {
         alert("Please select a mood first");
         return;
     }
     
     const note = document.getElementById('note-input').value;
     const timestamp = new Date().toISOString();
     
   
     const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
     
     
     entries.push({
         date: timestamp,
         mood: selectedMood,
         note: note,
         weather: weatherData
     });
     
     localStorage.setItem('moodEntries', JSON.stringify(entries));
     
    
     document.querySelectorAll('.mood-option').forEach(el => {
         el.classList.remove('selected');
     });
     document.getElementById('note-input').value = '';
     selectedMood = null;
     
     
     showNotification();
     
     loadEntries();
 }


 function showNotification() {
     const notification = document.getElementById('notification');
     notification.classList.add('show');
     
     setTimeout(() => {
         notification.classList.remove('show');
     }, 3000);
 }

 
 function loadEntries() {
     const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
     const entryList = document.getElementById('entry-list');
     
     
     entries.sort((a, b) => new Date(b.date) - new Date(a.date));
     
     let entriesHTML = '';
     
     if (entries.length === 0) {
         entriesHTML = '<p class="no-entries">No entries yet. Start tracking your mood!</p>';
     } else {
         entries.forEach(entry => {
             const date = new Date(entry.date);
             const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
             
             
             const moodEmojis = {
                 'happy': '😊',
                 'neutral': '😐',
                 'sad': '😔',
                 'angry': '😠',
                 'sick': '🤢'
             };
             
             
             const weatherIcon = entry.weather.condition === 'sunny' ? '☀' : 
                               entry.weather.condition === 'cloudy' ? '☁' : 
                               entry.weather.condition === 'rainy' ? '🌧' : '☀';
             
             entriesHTML += `
                 <div class="entry-card">
                     <div class="entry-header">
                         <div class="entry-mood">${moodEmojis[entry.mood]}</div>
                         <div class="entry-note">${entry.note}</div>
                     </div>
                     <div class="entry-date">${formattedDate}</div>
                     <div class="entry-weather">${weatherIcon} ${entry.weather.temp}°C</div>
                 </div>
             `;
         });
     }
     
     entryList.innerHTML = entriesHTML;
 }

 
 document.querySelectorAll('.tab-btn').forEach(button => {
     button.addEventListener('click', () => {
        
         document.querySelectorAll('.tab-btn').forEach(btn => {
             btn.classList.remove('active');
         });
         button.classList.add('active');
         
         
         const tabId = button.getAttribute('data-tab');
         document.getElementById('entry-tab').classList.toggle('hidden', tabId !== 'entry');
         document.getElementById('history-tab').classList.toggle('hidden', tabId !== 'history');
         
        
         if (tabId === 'history') {
             loadEntries();
         }
     });
 });


 function getLocationAndWeather() {
     if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(position => {
             const lat = position.coords.latitude;
             const lon = position.coords.longitude;
             fetchWeather(lat, lon);
         }, error => {
             console.error("Error getting location:", error);
             
             setDemoWeather();
         });
     } else {
         console.log("Geolocation not supported");
         setDemoWeather();
     }
 }



     
    
    

 
 function fetchWeather(lat, lon) {
     // Using OpenWeatherMap API (you would need to add your API key)
     const apiKey = '2e441831260f3f9a5383c1e40e6f675f'; 
     
     
     
     fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
         .then(response => response.json())
         .then(data => {
             weatherData = {
                 temp: Math.round(data.main.temp),
                 condition: data.weather[0].main.toLowerCase()
             };
             document.getElementById('current-temp').innerText = `${weatherData.temp}°C`;
         })
         .catch(error => {
             console.error("Error fetching weather:", error);
             setDemoWeather();
         });
     
     
     
     setDemoWeather();
 }
    


 
 function setDemoWeather() {
     // Randomly choose temperature between 15-30°C
     const temp = Math.floor(Math.random() * 15) + 15;
     const conditions = ['sunny', 'cloudy', 'rainy'];
     const condition = conditions[Math.floor(Math.random() * conditions.length)];
     
     weatherData = {
         temp: temp,
         condition: condition
     };
     
     document.getElementById('current-temp').innerText = `${temp}°C`;

 }