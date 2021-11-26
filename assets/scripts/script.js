// GLOBAL VARIABLES
// --------------------------------
const card = document.querySelector('#question-card');
const cardHeader = document.querySelector('#card-header');
const cardBody = document.querySelector('#card-body');
const cardFooter = document.querySelector('#card-footer');
const timerEl = document.querySelector('#time-remaining');

const timerDelay = 1000;
const startingTime = 59;

var currentQuestionId = 0;
var complete = false;
var timeLeft = startingTime;
var highscore = 0;
var highscores = [];
var score = 0;

const quizData = [  // Array of question objects
    {
        question: "What is the window property called that allows us to access a Storage object and store data across browser sessions?",
        answers: ["sessionStorage", "localStorage", "browserStorage", "storage"],
        responses: {
                true:"localStorage is the name of the window property that allows us to access and store data across browser sessions.",
                false:"localStorage.. it's localStorage!"},
        correct: 1
    },
    {
        question: "What method returns a new element of a given tagName to the current document?",
        answers: ["appendElement()", "setAttribute()", "appendChild()", "createElement()"],
        responses: {
            true: "createElement() - allows us to add a new element to the DOM, not append it to the ",
            false: "NOPE! - It's 'createElement()'"
        },
        correct: 3
    },
    {
        question: "Function Declaration Which of the below is the correct syntax for definining a function declaration in JavaScript?",
        answers: [
            "function foo(param) { ... }", 
            "func foo(param) { ... }", 
            "def foo(param): ...", 
            "var foo = function(param) { ... };"
        ],
        responses: {
            true: "function funcName() { ... } is the correct way to define a function declaration",
            false: "var foo = function() { ... } is how to define a function expression"
        },
        correct: 0
    },
    {
        question: "Which expression below correctly clamps a positive number between a current value and zero?",
        answers: [
            "Math.max( 0, currentValue - amount )", 
            "Math.max( currentValue - amount )", 
            "Math.floor( Math.random() * (max-min) ) + max", 
            "Math.min( 0, currentValue - amount )"
        ],
        responses: {
            true: "Math.max( 0, currentValue - amount ) makes sure the value is 0 if currentValue - amount is less than 0",
            false: "We should provide 2 values to the Math.max() method and it will return the higher value of the 2."
        },
        correct: 0
    },
    {
        question: "Choose the correct way to insert javascript into a web page.",
        answers: [
            "<script src='./path/to/script-name'.js></script>", 
            "<script text='script.js />'", 
            "<script src='path/to/script-name'.js />", 
            "<link src='path/to/script-name'.js></link>" 
        ],
        responses: {
            true: "The <script> tag with the src attribute containing the correct path to the JavaScript file with a closing </script> tag.",
            false: "The <script> tag must contain an approprite src path and closing tag."
        },
        correct: 0
    },
    {
        question: "Where should a JavaScript script tag be located in the HTML?",
        answers: ["End of the header", "End of the body", "Beginning of the body", "Beginning of the footer"],
        responses: {
            true: "In the HEAD or the END of the BODY",
            false: "The end of the body allows the html to load before processing the script.",
        },
        correct: 1
    },
    {
        question: "What is an example of a conditional statement?",
        answers: [
            "if (x <= 0) { x = 0 }", 
            "const maxHealth = () => Math.min(health + 20, 100)", 
            "if x <= 0; x >= 0", 
            "var condition = Math.floor(Math.random() * 100)", 
        ],
        responses: {
            true: "The 'if condition' syntax is if ( condition ) { expression }",
            false: "if (x <= 0) { x = 0 } is an example of a conditional statement."
        },
        correct: 0
    },
    // {
    //     question: "How many ...",
    //     answers: ["3", "7", "9", "2"],
    //     responses: {
    //         true: "",
    //         false: ""
    //     },
    //     correct: 3
    // },
    // {
    //     question: "How many ...",
    //     answers: ["3", "7", "9", "2"],
    //     responses: {
    //         true: "",
    //         false: ""
    //     },
    //     correct: 3
    // },
    // {
    //     question: "How many ...",
    //     answers: ["3", "7", "9", "2"],
    //     responses: {
    //         true: "",
    //         false: ""
    //     },
    //     correct: 3
    // }
]

// FUNCTIONALITY
// --------------------------------

// event handling
const handleCardEvents = (event) => {
    
    let isAnswer = event.target.matches('.answer');

    if (isAnswer && currentQuestionId < quizData.length-1) {
        console.log('todo: showResponse();')
        showResponse(event.target);
        currentQuestionId++;
        const fadeTimer = setTimeout(() => {
            showNextQuestion();
            cardFooter.style.opacity = 0;
        }, timerDelay);
    } else if (isAnswer && currentQuestionId === quizData.length-1) {
        console.log("todo: showEndScreen();", 'score')
        showResponse(event.target);
        complete=true;
        // showEndScreen();
        const fadeTimer = setTimeout(() => {
            cardFooter.style.opacity = 0;
            showEndScreen();
        }, timerDelay);

    }
    
    // Start Quiz
    let isButton = event.target.matches('button');
    if (isButton && event.target.textContent === 'START QUIZ') {
        startQuiz();
    } else if (isButton && event.target.textContent === 'RESTART QUIZ') {
        
        if (score > highscore) {
            let scoreInputEl = document.querySelector('input');
            console.log(score, scoreInputEl.value);
            
            highscores.push({score: score, initials: scoreInputEl.value})
            
            // store values to localStorage
            saveScores();
        }

        showStartScreen();
    }
    
};

// start quiz
const startQuiz = () => {
    currentQuestionId = 0;
    timeLeft = startingTime;
    score = 0;
    complete = false;

    // move to next card
    showNextQuestion();
    makeFooterResponse();
    
    // document.querySelector('button').textContent = 'SUBMIT';
    
    // start timer
    const timer = setInterval(() => {

        if (timeLeft > 0) {

            timerEl.textContent = timeLeft;
            timeLeft--;
            if (timeLeft < 5) {
                timerEl.style.color = "orange";
            }
            if (complete) {
                console.log('quiz finished!');

                clearInterval(timer);
            }
        } else if (timeLeft === 0) {
            timerEl.textContent = timeLeft;
            timerEl.style.color = 'var(--s-dark)';
            clearInterval(timer);
            showEndScreen();
        } 
    }, 1000)
    
};

const makeFooterResponse = () => {
    
    let responseWrapper = document.createElement('div');
    let responseTitle = document.createElement('h2');
    let responseInfo = document.createElement('p');
    
    responseWrapper.className='response';
    responseInfo.className='response-info';

    responseWrapper.appendChild(responseTitle)

    cardFooter.appendChild(responseWrapper);
    cardFooter.appendChild(responseInfo)

}

const shuffle = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const showNextQuestion = () => {
    
    var cardDataObj = quizData[currentQuestionId]
    let answersWrapper = document.querySelector('.answers');

    cardHeader.querySelector('.question').textContent = `Question ${currentQuestionId + 1}. ${cardDataObj.question}`;

    clearBodyElements();
    
    var answers = [];

    // make answers
    for (let [id, answerText] of cardDataObj.answers.entries()) {
        // create answer ele
        var answerEl = document.createElement('li');
        // assign class name
        answerEl.className = 'answer';
        // set dataset properties
        answerEl.dataset.id = id;
        // add answer text
        answerEl.textContent = answerText;
        // append to answersWrapper
        answers.push(answerEl);
    }
    shuffle(answers);
    for (let answerEl of answers) {
        answersWrapper.appendChild(answerEl);
    }
};

// handle response notifier
const showResponse = (answerEl) => {
    
    cardFooter.style.opacity = 100;
    const fadeTimer = setTimeout(() => {
        cardFooter.style.opacity = 0;
    },1000)

    var isCorrect = parseInt(
        answerEl.dataset.id
        ) === quizData[currentQuestionId].correct;
    
    if (!isCorrect) { timeLeft = Math.max(0, timeLeft - 7)
    } else { 
        score += 5;
    }
    document.getElementById('score').textContent = score;


    var title = cardFooter.querySelector('h2');
    var text = cardFooter.querySelector('.response-info');
    // console.log(title, text);
    title.textContent = isCorrect ? 'Correct' : 'Incorrect';
    text.textContent = quizData[currentQuestionId].responses[isCorrect];

};


const makeButton = (text) => {
    var button = document.createElement('button');
    button.className = 'btn';
    button.textContent = text;

    return button
}

const showStartScreen = () => {
    timerEl.style.color = "var(--text-on-p)";
    clearBodyElements();
    
    cardHeader.querySelector('h2').textContent = '';
    timerEl.textContent = startingTime + 1;
    
    var answersWrapper = document.querySelector('.answers');
    var startBtn = makeButton('START QUIZ');
    
    answersWrapper.appendChild(startBtn);
    loadScores();
    
}

const showEndScreen = () => {
    
    // header message
    
    cardHeader.querySelector('h2').textContent = "That's all folks!";
    
    clearBodyElements();
    
    
    // show score
    compileScore();

    let answersWrapper = document.querySelector('.answers');

    if (score > highscore) {
        // score input
        // add input & label
        var scoreInputEl = document.createElement('input');
        scoreInputEl.className = 'initials';
        scoreInputEl.name = 'initials-input';
        scoreInputEl.type = 'text';
        scoreInputEl.maxLength = 3;
        scoreInputEl.pattern = '^[a-zA-Z]{3}'
        scoreInputEl.placeholder = 'Initials';
        var scoreLabelEl = document.createElement('label');
        scoreLabelEl.textContent = 'Add Your Initials:';
        scoreLabelEl.htmlFor = 'initials-input';
        scoreLabelEl.style = "background: var(--primary); color: var(--text-on-p);"
    
        // make redo button
        
        // add submit button
        var restartBtn = makeButton('RESTART QUIZ');
    
        answersWrapper.appendChild(scoreLabelEl);
        answersWrapper.appendChild(scoreInputEl);
    }

    answersWrapper.appendChild(restartBtn);


};

const clearBodyElements = () => {
    let answersWrapper = document.querySelector('.answers');

    // clear list
    if (answersWrapper.children) {
        while (answersWrapper.firstChild) {
            answersWrapper.removeChild(answersWrapper.firstChild);
        }
    }
}


const loadScores = () => {
    var highscoreArray = JSON.parse(localStorage.getItem('speedu-scores')) || [];
    var highscoreObj = { score: 0, initials: ''}
    for (let scoreObj of highscoreArray) {
        if (scoreObj.score > highscoreObj.score) {
            highscoreObj.score = scoreObj.score;
            highscoreObj = scoreObj
        }
    }
    showHighscore(highscoreObj);
};

const saveScores = () => {
    localStorage.setItem('speedu-scores', JSON.stringify(highscores));
}

const compileScore = () => {
    var scoreLabel = document.getElementById('score');
    score += Math.floor(score * (timeLeft / 60));
    scoreLabel.textContent = score;
}

const showHighscore = (scoreObj) => {
    var highScoreEl = document.querySelector('.stats-left');
    if (scoreObj){
        highScoreEl.textContent = `Score to beat: ${scoreObj.initials.toUpperCase()} ${scoreObj.score}`;
    }
}


// EVENTS
// --------------------------------
loadScores();
card.addEventListener('click', handleCardEvents);