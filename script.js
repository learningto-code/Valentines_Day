// State management
const state = {
  noCount: 0,
  yesPressed: false,
  dateSelected: false,
  activitySelected: false,
  selectedDate: '',
  selectedActivity: '',
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
  'Wala nang bawian ha',
  'Iiyak ako rito :(',
  'Heart = shattered :(',
];

const dateOptions = [
  'February 14',
  'February 15',
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
const finalScreen = document.getElementById('finalScreen');
const dateContainer = document.getElementById('dateContainer');
const activityContainer = document.getElementById('activityContainer');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const selectedActivityDisplay = document.getElementById('selectedActivityDisplay');

// Initialize
function init() {
  renderDateButtons();
  renderActivityCards();
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
  return phrases[Math.min(state.noCount, phrases.length - 1)];
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
      <button class="activity-btn" onclick="handleActivitySelect('${activity.name}', '${activity.gif}')">
        ${activity.name}
      </button>
    </div>
  `).join('');
}

function handleActivitySelect(activityName, activityGif) {
  state.selectedActivity = activityName;
  state.activitySelected = true;
  mainGif.src = './src/assets/ok.gif';
  selectedDateDisplay.textContent = state.selectedDate;
  selectedActivityDisplay.textContent = activityName;
  
  // Send data to formspree
  sendToFormspree(activityName);
  
  // Show final screen after a short delay
  setTimeout(() => {
    showScreen('finalScreen');
  }, 500);
}

function sendToFormspree(activityName) {
  const formData = new FormData();
  formData.append('date', state.selectedDate);
  formData.append('activity', activityName);

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
  finalScreen.style.display = 'none';
  
  document.getElementById(screenName).style.display = 'block';
}

// Start the app
init();
