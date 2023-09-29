// VARIABLES TO KEEP TRACK OF TIME
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;


// DOM ELEMENTS
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');


// SOUND EFFECTS
var sfxRight = new Audio('assets/sfx/correct.wav');
var sfxWrong = new Audio('assets/sfx/incorrect.wav');


// FUNCTIONS
function startQuiz() {
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.setAttribute('class', 'hide');
  questionsEl.removeAttribute('class');
  timerId = setInterval(clockTick, 1000);
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // FIRST QUESTION
  var currentQuestion = questions[currentQuestionIndex];
  // CHANGING QUESTION
  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title;
  choicesEl.innerHTML = '';

  // FOR LOOP FOR ANSWER CHOICES
  for (var i = 0; i < currentQuestion.choices.length; i++) {
    // BUTTON FOR EACH QUESTION
    var choice = currentQuestion.choices[i];
    var choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);

    choiceNode.textContent = i + 1 + '. ' + choice;
    choicesEl.appendChild(choiceNode);
  }
}

function questionClick(event) {
  var buttonEl = event.target;
  if (!buttonEl.matches('.choice')) {
    return;
  }

  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 15;

    if (time < 0) {
      time = 0;
    }

    timerEl.textContent = time;

    // PLAY 'WRONG' SOUND
    sfxWrong.play();

    feedbackEl.textContent = 'Wrong!';
  } else {
    // PLAY 'RIGHT' SOUND
    sfxRight.play();

    feedbackEl.textContent = 'Correct!';
  }

  feedbackEl.setAttribute('class', 'feedback');
  setTimeout(function () {
    feedbackEl.setAttribute('class', 'feedback hide');
  }, 1000);

  // NEXT QUESTION
  currentQuestionIndex++;


  if (time <= 0 || currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // STOP TIMER
  clearInterval(timerId);

  // END SCREEN
  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.removeAttribute('class');

  // FINAL SCORE
  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;

  questionsEl.setAttribute('class', 'hide');
}

function clockTick() {
  time--;
  timerEl.textContent = time;

  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // VALUE OF TEXT BOX/INITALS
  var initials = initialsEl.value.trim();

  if (initials !== '') {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(window.localStorage.getItem('highscores')) || [];

    // NEW SCORE DISPLAY FOR THE CURRENT PLAYING USER
    var newScore = {
      score: time,
      initials: initials,
    };

    // SAVE TO THE GAME'S STORAGE
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));
    window.location.href = 'highscores.html';
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// SAVING SCORE
submitBtn.onclick = saveHighscore;

// STARTING QUIZ
startBtn.onclick = startQuiz;

// ANSWER 
choicesEl.onclick = questionClick;

// CLICK ENTER TO SUBMIT SCORE
initialsEl.onkeyup = checkForEnter;
