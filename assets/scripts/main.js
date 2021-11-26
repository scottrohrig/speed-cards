/* SPEEDUCATION APP */

// ----- ideas ----- //

// TODO: 


// ----- CONSTANTS ----- //
const questionCard = document.querySelector('#question-card');
const answersWrapper = document.querySelector('.answers');
const startButton = document.querySelector('#start-btn');
const cardHeader = document.querySelector('#card-header');
const cardBody = document.querySelector('#card-body');
const cardFooter = document.querySelector('#card-footer');


// ----- HELPER FUNCTIONS ----- //
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

/** Helper to reduce element assignment code */
const createEl = (tag, className) => {
    // TODO: consider adding optional data-attributes
    let ele = document.createElement(tag);
    ele.className = className;
    // ele.dataset[attribute] = val
    return ele;
}


// ----- FUNCTIONALITY ----- //

const highlightElement = function (e) {
    // highlight animation
    if (e.target.matches('.answer') || e.target.matches('.submit')) {
        var t_bg = e.target.style.backgroundColor;
        e.target.style.backgroundColor = 'var(--t-light)';
        setTimeout(() => {e.target.style.backgroundColor = t_bg}, 250);
    }
};

const questionCardStyleToggle = function(e) {
    // nada... ¯\_(ツ)_/¯
    console.log('submit pressed');
    
    if (e.target.closest('button')){
        var card = e.currentTarget
        card.className = (card.className === 'card') ? 'card selecte' : 'card'
        }
}

/**
 * Creates a data object from the question data array and creates the first question card.
 */
const loadQuiz = () => {
    const currentQuestion = quizData[currentQuestionIdx];
    var cardDataObj = {
        question: currentQuestion.question,
        answers: currentQuestion.answers,
        responses: currentQuestion.responses, // true, false...consider using another form
        correct: currentQuestion.correct
    }
    createQuestionCard(cardDataObj);
};

/** Returns Array: cardHeader, cardBody, cardFooter elements */
const getCardSections = () => {
    return [cardHeader, cardBody, cardFooter]
};

const createQuestionCard = function(cardDataObj) {
    
    // ---- behind the scenes ---- //
    const addSectionContent = (section, cardDataObj) => {

    const makeQuestion = (section, number,question) => {
        let h2 = createEl(tag='h2', className='question')
        h2.innerText = number + '. ' + question;
        section.appendChild(h2)
    }
    const makeAnswers = (cardBody, cardDataObj) => {
        let letters = ['A', 'B', 'C', 'D'];
        var answers = cardDataObj.answers;        
        
        // shuffle(answers);
        let answersWrapper = document.createElement('ul');
        answersWrapper.className = 'answers';
        for (const [idx, answer] of answers.entries()) {
            let answerListItem = document.createElement('li');
            let letter = letters.shift();
            answerListItem.dataset.questionId = currentQuestionIdx;
            answerListItem.dataset.letter = idx;
            answerListItem.className = 'answer';
            answerListItem.textContent = `${letter}. ${answer}`
            answersWrapper.appendChild(answerListItem);
        }
        const submitBtn = createEl(tag='button', className='btn submit');
        // submitBtn.id = 'submit-btn';
        submitBtn.textContent = 'SUBMIT';
        answersWrapper.appendChild(submitBtn);
        cardBody.appendChild(answersWrapper);
    };

    const makeFooterResponse = (cardFooter, cardDataObj) => {
        let responseWrapper = createEl(tag='div', className='response');
        let responseTitle = document.createElement('h2');
        // responseTitle.textContent = cardDataObj[currentQuestionIdx].responses;
        responseWrapper.appendChild(responseTitle)
        let responseInfo = createEl(tag='p', className='response-info')

        cardFooter.appendChild(responseWrapper);
        cardFooter.appendChild(responseInfo)

    }

        switch (section.className) { 
            case 'card-header': 
                makeQuestion(section, currentQuestionIdx+1 ,cardDataObj.question)
                break;
            case 'card-body':
                makeAnswers(section, cardDataObj);
                // add Submit button
                
                break;
            case 'card-footer': 
                // makeFooterResponse(section, cardDataObj.responses)
                makeFooterResponse(section, cardDataObj);
                break;
            default:
                break;
        }
    };

    // business 
    const sections = getCardSections();

    for (let section of sections){
        addSectionContent(section, cardDataObj);
        questionCard.appendChild(section);
    }
    questionCard.dataset.questionId = currentQuestionIdx;
};

const clearElement = (parent) => {

    if (!parent.children) {return}
    while (parent.firstChild) {
       parent.removeChild(parent.firstChild);
    }

};


const startQuiz = (e) => {
    questionCard.className = 'card';
    if (currentQuestionIdx < quizData.length) {
        clearElement(cardHeader);
        clearElement(cardBody);
        clearElement(cardFooter);
        // clearElement(questionCard);
        loadQuiz();
        startCountdown();
    } else {
        // showStatsScreen();
    }
};

const showNextQuestion = () => {
    questionCard.className = 'card';
    if (currentQuestionIdx < quizData.length) {
        clearElement(cardHeader);
        clearElement(cardBody);
        clearElement(cardFooter);
        // clearElement(questionCard);
        loadQuiz();
        currentQuestionIdx++;
    } else {
        // showStatsScreen();
    }
};

/** sets the time-remaining to 60-1 and decreases it by intervals of 1 second */
const startCountdown = () => {
    timeRemaining = startTime;
    // var displayedSeconds = 9;
    var countdownEl = document.querySelector('#time-remaining')
    setInterval(() => {
        if (timeRemaining >= 0) {
            countdownEl.textContent = parseInt(timeRemaining);
            flashCountdown();
            timeRemaining--;
        } 
        
    }, 1000)
};

const flashCountdown = () => {
    var countdownEl = document.querySelector('#time-remaining');
    if (countdownEl.textContent == 5){
        countdownEl.className = 'timer fadeTimer'
    } else if (countdownEl.textContent <= 0) {
        countdownEl.style.color = 'var(--s-dark)';
        countdownEl.className = 'timer'
        
    }
};

const showResponse = (isCorrect) => {

    let footer = questionCard.querySelector('.card-footer')
    var title = footer.querySelector('h2');
    var text = footer.querySelector('p');
    
    footer.style.opacity = (footer.style.opacity === '100') ? '0' : '100';
    questionCard.className = (questionCard.className === 'card') ? 'card selected' : 'card'

    title.textContent = isCorrect ? 'Correct' : 'Incorrect'
    text.textContent = quizData[currentQuestionIdx].responses[isCorrect];

};

const isCorrectAnswer = () => (selectedAnswer === quizData[currentQuestionIdx].correct);

const onSubmitButtonPressed = (submitBtn) => {
    var isCorrect = isCorrectAnswer(submitBtn);
    if (states.selected) {
        showResponse(isCorrect);
    }
    
}

/** handles marking answer as selected and updating UI
 * 
 * @param {Node} answer 
 */
const onAnswerSelected = function(answer) {
    
    if (answer.className === 'answer') {
        answer.className = 'answer chosen-answer';
        answer.dataset.selected = true;
        states.selected = true;
        selectedAnswer = parseInt(answer.dataset.letter);
    } else {
        answer.className = 'answer';
        selectedAnswer = null;
        states.selected = false;
    }

    // unselect other answers on newly selected answer.
    const answersArr = document.querySelectorAll('.answer');
    for (let possibleAnswer of answersArr) {
        if (possibleAnswer !== answer) {
            possibleAnswer.className = 'answer';
            possibleAnswer.dataset.selected = false;
        }
    }
};

/** Entry point for Card events.
 * Delegates events  
 */
 const cardEventHandler = function(e) {
    // e.preventDefault();
    var isAnswer = e.target.matches('.answer');
    var isSubmit = e.target.matches('button');

    
    
    // select answer
    if (isAnswer) {
        var answer = e.target;
        onAnswerSelected(answer);
    }

    if (isSubmit && states.selected) {
        onSubmitButtonPressed(e);
    }
};

// ----- GLOBALS ----- //
var currentQuestionIdx = 0;
var selectedAnswer
var timeRemaining = 59;
var isAnswerSelected = false;


const startTime = 59;

const states = {
    selected: false,
    running: false
}

const quizData = [  // Array of question objects
    {
        question: "What is the window property called that allows us to access a Storage object and store data across browswer sessions?",
        answers: ["sessionStorage", "localStorage", "browserStorage", "storage"],
        responses: {
                true:"localStorage is the name of the window property that allows us to access and store data across browser sessions.",
                false:"Try again.."},
        correct: 1
    },
    {
        question: "What method returns a new element of a given tagName to the current document?",
        answers: ["append()", "setAttribute()", "createAttribute()", "createElement()"],
        responses: {},
        correct: 3
    },
    {
        question: "What method returns a new element of a given tagName to the current document?",
        answers: ["append()", "setAttribute()", "createAttribute()", "createElement()"],
        responses: {},
        correct: 3
    }
]

// ----- EVENT LISTENERS ----- //
questionCard.addEventListener('click', cardEventHandler);
startButton.addEventListener('click', startQuiz);


