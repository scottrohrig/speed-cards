/* SPEEDUCATION APP */

// ----- ideas ----- //

// TODO: build question card 
//      [ ] => add data attributes to cards
//      [ ] => add data attributes to answers
//      [ ] => randomize answer order
//      [*] => remove 'chosen-answer' from other answers on select
//              - consider using data attrs.
//      [ ] => make a "start session" card, with the start button centered


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

/** Entry point for questionCard events.
 * Delegates events  
 */
const onSelectAnswer = function(e) {
    
} 

const cardTaskHandler = function(e) {
    e.preventDefault();

    if (e.target.matches('.submit')){
        checkAnswer(e);
        showResponse(e);
        }
    
    var selectedAnswer = false;

    if (e.target.matches('.answer') || e.target.matches('.submit')) {
        var t_bg = e.target.style.backgroundColor;
        e.target.style.backgroundColor = 'var(--t-light)';
        setTimeout(() => {e.target.style.backgroundColor = t_bg}, 250);
    }
    
    var answer = e.target.closest('.answer');
    if (answer) {
        selectedAnswer = true;
        answer.className = (answer.className === 'answer chosen-answer') ? 'answer' : 'answer chosen-answer'
            
        // unselect other answers on newly selected answer.
        const answersArr = document.querySelectorAll('.answer');
        for (let possibleAnswer of answersArr) {
            if (possibleAnswer !== answer) {
                possibleAnswer.className = 'answer';
            }
        }
    }
    
};

const checkAnswer = (e) => {
    // validates whether response is correct or not 
    // need access to the dataObj responses 'explanation'
}

const showResponse = (e) => {
    var card = e.currentTarget
    let footer = card.querySelector('.card-footer')
    card.className = (card.className === 'card') ? 'card selected' : 'card'
    footer.style.opacity = (footer.style.opacity === '100') ? '0' : '100';
}

const questionCardStyleToggle = function(e) {
    // nada... ¯\_(ツ)_/¯
    console.log('submit pressed');
    
    if (e.target.closest('button')){
        var card = e.currentTarget
        card.className = (card.className === 'card') ? 'card selecte' : 'card'
        }
}


const quizData = [
    {
        question: "What is the window property called that allows us to access a Storage object and store data across browswer sessions?",
        answers: ["sessionStorage", "localStorage", "browserStorage", "storage"],
        responses: {
                true:"localStorage is the name of the window property that allows us to access and store data across browser sessions.",
                false:"Try again.."
                    },
        correct: 1
    },
    {
        question: "What method returns a new element of a given tagName to the current document?",
        answers: ["append()", "setAttribute()", "createAttribute()", "createElement()"],
        correct: 3
    }
]

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
    const makeAnswers = (cardBody, answers) => {
        let letters = ['A', 'B', 'C', 'D'];
        // shuffle(answers);
        let answersWrapper = document.createElement('ul');
        answersWrapper.className = 'answers';
        for (const answer of answers) {
            let answerListItem = document.createElement('li');
            let letter = letters.shift()
            answerListItem.dataset.questionId = currentQuestionIdx;
            answerListItem.dataset.letter = letter;
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

    const makeFooterResponse = (cardFooter) => {
        let responseWrapper = createEl(tag='div', className='response');
        let responseTitle = document.createElement('h2');
        responseTitle.textContent = 'Correct!';
        responseWrapper.appendChild(responseTitle)
        let responseInfo = createEl(tag='p', className='response-info')
        responseInfo.textContent = '"localStorage" is the name of the window property that allows us to access and store data across browser sessions.'

        cardFooter.appendChild(responseWrapper);
        cardFooter.appendChild(responseInfo)

    }

        switch (section.className) { 
            case 'card-header': 
                makeQuestion(section, currentQuestionIdx+1 ,cardDataObj.question)
                break;
            case 'card-body':
                makeAnswers(section, cardDataObj.answers);
                // add Submit button
                
                break;
            case 'card-footer': 
                // makeFooterResponse(section, cardDataObj.responses)
                makeFooterResponse(section)
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
    e.preventDefault();
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


// ----- GLOBALS ----- //
var currentQuestionIdx = 0;


// ----- EVENT LISTENERS ----- //
questionCard.addEventListener('click', cardTaskHandler);
startButton.addEventListener('click', startQuiz);


