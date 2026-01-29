// State management
const state = {
  noCount: 0,
  yesPressed: false,
  dateSelected: false,
  activitySelected: false,
  locationSelected: false,
  selectedDate: '',
  selectedActivities: [],
  selectedLocation: '',
  currentGif: './src/assets/question.gif'
};

// Configuration
const phrases = [
  'No :(',
  'Why notttt???',
  'Please please please',
  'Are you sure about this?',
  'Please reconsider this!',
  'Yaw mo q Valentines? :(((',
  'Last chance na to…',
  'Sure ka na talaga?',
  'Grabe ka na baby',
  'Araw ko po :3',
  'Final answer na ba yan?',
  'Sayang naman flowers q',
  'Iiyak ako rito :(',
  'Heart = shattered :(',
];

const dateOptions = [
  'February 14',
  'February 15',
  'Other - lmk pu',
];

const locationOptions = [
  'UPTC',
  'Gateway Mall',
  'Megamall',
  'SM North',
  'Trinoma',
  'Other - lmk pu',
];

const activities = [
  { name: 'Arcade', gif: './src/assets/arcade.gif' },
  { name: 'Movie', gif: './src/assets/watch.gif' },
  { name: 'Picnic', gif: './src/assets/picnic.gif' },
  { name: 'Cafe Hopping', gif: './src/assets/coffee.gif' },
  { name: 'All', gif: './src/assets/all.gif' },
];

// DOM Elements
const mainGif = document.getElementById('mainGif');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionScreen = document.getElementById('questionScreen');
const dateScreen = document.getElementById('dateScreen');
const activityScreen = document.getElementById('activityScreen');
const locationScreen = document.getElementById('locationScreen');
const finalScreen = document.getElementById('finalScreen');
const dateContainer = document.getElementById('dateContainer');
const activityContainer = document.getElementById('activityContainer');
const locationContainer = document.getElementById('locationContainer');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const selectedActivityDisplay = document.getElementById('selectedActivityDisplay');

// Initialize
function init() {
  renderDateButtons();
  renderActivityCards();
  renderLocationButtons();
  setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
  yesBtn.addEventListener('click', handleYesClick);
  noBtn.addEventListener('click', handleNoClick);
}

function handleYesClick() {
  state.yesPressed = true;
  mainGif.src = './src/assets/yess.gif';
  showScreen('dateScreen');
}

function handleNoClick() {
  state.noCount++;
  mainGif.src = './src/assets/sad.gif';
  
  // Update yes button size
  const yesBtnSize = state.noCount * 20 + 16;
  yesBtn.style.setProperty('--yes-size', `${yesBtnSize}px`);
  yesBtn.style.fontSize = `${yesBtnSize}px`;
  yesBtn.style.padding = `${yesBtnSize * 0.625}px ${yesBtnSize * 1.25}px`;
  
  // Update no button text
  noBtn.textContent = getNoBtnPhrase();
  
  // Shrink no button after n clicks 
  if (state.noCount >= 3) {
    const shrinkFactor = Math.max(0.3, 1 - (state.noCount - 2) * 0.1); // Minimum 30% of original size
    noBtn.style.transform = `scale(${shrinkFactor})`;
  }
  
  // Move button on every click
  moveNoButton();
}

function moveNoButton() {
  const button = noBtn;
  const rect = button.getBoundingClientRect();
  
  const maxX = window.innerWidth - rect.width - 20;
  const maxY = window.innerHeight - rect.height - 20;
  
  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;
  
  button.style.position = 'fixed';
  button.style.left = randomX + 'px';
  button.style.top = randomY + 'px';
}

function getNoBtnPhrase() {
  return phrases[state.noCount % phrases.length];
}

function renderDateButtons() {
  dateContainer.innerHTML = dateOptions.map(date => 
    `<button class="date-btn" onclick="handleDateSelect('${date}')">${date}</button>`
  ).join('');
}

function handleDateSelect(date) {
  state.selectedDate = date;
  state.dateSelected = true;
  mainGif.src = './src/assets/question.gif';
  showScreen('activityScreen');
}

function renderActivityCards() {
  activityContainer.innerHTML = activities.map(activity => `
    <div class="activity-card">
      <img src="${activity.gif}" alt="${activity.name}" class="activity-gif">
      <button class="activity-btn" data-activity="${activity.name}" onclick="toggleActivity('${activity.name}')">
        ${activity.name}
      </button>
    </div>
  `).join('') + '<button id="continueBtn" class="continue-btn" onclick="proceedToFinal()" style="display: none;">Continue</button>';
}

function toggleActivity(activityName) {
  if (activityName === 'All') {
    // Select all activities except 'All' itself
    const allActivityNames = activities.filter(a => a.name !== 'All').map(a => a.name);
    
    // If all are already selected, deselect all; otherwise select all
    const allSelected = allActivityNames.every(name => state.selectedActivities.includes(name));
    
    if (allSelected) {
      state.selectedActivities = [];
    } else {
      state.selectedActivities = [...allActivityNames];
    }
  } else {
    // Toggle individual activity
    const index = state.selectedActivities.indexOf(activityName);
    if (index > -1) {
      state.selectedActivities.splice(index, 1);
    } else {
      state.selectedActivities.push(activityName);
    }
  }
  
  // Update button states
  updateActivityButtons();
  
  // Show/hide continue button
  const continueBtn = document.getElementById('continueBtn');
  if (state.selectedActivities.length > 0) {
    continueBtn.style.display = 'block';
  } else {
    continueBtn.style.display = 'none';
  }
}

function updateActivityButtons() {
  const buttons = document.querySelectorAll('.activity-btn');
  buttons.forEach(btn => {
    const activityName = btn.getAttribute('data-activity');
    
    if (activityName === 'All') {
      // Check if all other activities are selected
      const allActivityNames = activities.filter(a => a.name !== 'All').map(a => a.name);
      const allSelected = allActivityNames.every(name => state.selectedActivities.includes(name));
      
      if (allSelected && allActivityNames.length > 0) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    } else {
      if (state.selectedActivities.includes(activityName)) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    }
  });
}

function proceedToFinal() {
  state.activitySelected = true;
  mainGif.src = './src/assets/question.gif';
  showScreen('locationScreen');
}

function renderLocationButtons() {
  locationContainer.innerHTML = locationOptions.map(location => 
    `<button class="location-btn" onclick="handleLocationSelect('${location}')">${location}</button>`
  ).join('');
}

function handleLocationSelect(location) {
  state.selectedLocation = location;
  state.locationSelected = true;
  mainGif.src = './src/assets/ok.gif';
  proceedToFinalScreen();
}

function proceedToFinalScreen() {
  
  // Build the final message with special cases
  const finalH1 = document.querySelector('#finalScreen h1');
  let finalMessage = '';
  
  if (state.selectedDate === 'Other - lmk pu' || state.selectedLocation === 'Other - lmk pu') {
    finalMessage = "Okieee! We'll plan it further pa 💕";
  } else {
    let activityText = '';
    if (state.selectedActivities.length === 1) {
      activityText = state.selectedActivities[0];
    } else if (state.selectedActivities.length === 2) {
      activityText = state.selectedActivities.join(' and ');
    } else {
      const lastActivity = state.selectedActivities[state.selectedActivities.length - 1];
      const otherActivities = state.selectedActivities.slice(0, -1);
      activityText = otherActivities.join(', ') + ', and ' + lastActivity;
    }
    
    finalMessage = `Okieee! See you on ${state.selectedDate} at ${state.selectedLocation} for ${activityText}! I can't wait! 💕`;
  }
  
  finalH1.innerHTML = finalMessage;
  
  // Send data to formspree
  sendToFormspree(state.selectedActivities.join(', '));
  
  // Show final screen after a short delay
  setTimeout(() => {
    showScreen('finalScreen');
  }, 500);
}

function sendToFormspree(activityName) {
  const formData = new FormData();
  formData.append('date', state.selectedDate);
  formData.append('activity', activityName);
  formData.append('location', state.selectedLocation);
  formData.append('noButtonPresses', state.noCount);

  fetch('https://formspree.io/f/xrekzzqq', {
    method: 'POST',
    body: formData,
  })
  .then(response => console.log('Form submitted successfully'))
  .catch(err => console.log('Form submitted:', err));
}

function showScreen(screenName) {
  questionScreen.style.display = 'none';
  dateScreen.style.display = 'none';
  activityScreen.style.display = 'none';
  locationScreen.style.display = 'none';
  finalScreen.style.display = 'none';
  
  document.getElementById(screenName).style.display = 'block';
}

// Start the app
init();
