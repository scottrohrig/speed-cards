/* SPEEDUCATION APP */

// ----- ideas ----- 

// TODO: build question card 
//      [ ] => add data attributes to cards
//      [ ] => add data attributes to answers
//      [ ] => randomize answer order
//      [*] => remove 'chosen-answer' from other answers on select
//              - consider using data attrs.
//      [ ] => make a "start session" card, with the start button centered


// ----- CONSTANTS ----- 
const questionCard = document.querySelector('#question-card');
const answersWrapper = document.querySelector('.answers');
const startButton = document.querySelector('#start-btn');
const cardHeader = document.querySelector('#card-header');
const cardBody = document.querySelector('#card-body');
const cardFooter = document.querySelector('#card-footer');


// ----- HELPER FUNCTIONS -----
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


// ----- FUNCTIONALITY ----- 

/** Entry point for questionCard events.
 * Delegates events  
 */
const onSelectAnswer = function(e) {
    
} 

const cardTaskHandler = function(e) {
    e.preventDefault();

    if (e.target.closest('button')){
        var card = e.currentTarget
        let footer = card.querySelector('.card-footer')
        card.className = (card.className === 'card') ? 'card selected' : 'card'
        footer.style.opacity = (footer.style.opacity === '100') ? '0' : '100';
        }
    
    var selectedAnswer = false;

    // issue: click event triggers on the sub-elements (eg, text)
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

var currentQuestionIdx = 0;

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



const createQuestionCard = function(cardDataObj) {
    
    // behind the scenes
    const makeCardSections = () => {
        // questionCard already defined
        // const cardDiv = document.createElement('div');

        // create main card layout
        let sectionTitles = ['card-header','card-body','card-footer'];
        let sections = [];
        for (let title of sectionTitles) {
            // create div elements
            let section = createEl(tag='div', className=title);          
            sections.push(section);
        }
        return sections
    };
    const addSectionContent = (section, cardDataObj) => {

    const makeQuestion = (section, number,question) => {
        let h2 = createEl(tag='h2', className='question')
        let span = createEl(tag='span', className='card-number')
        span.innerText = number+'. ';
        h2.appendChild(span);
        h2.innerText += question;
        section.appendChild(h2)
    }
    const makeAnswers = (cardBody, answers) => {
        let letters = ['A.', 'B.', 'C.', 'D.'];
        // shuffle(letters)
        let answersWrapper = document.createElement('div');
        answersWrapper.className = 'answers';
        for (const answer of answers) {
            let answerDiv = document.createElement('div');
            let letter = letters.shift()
            answerDiv.className = 'answer';
            answerDiv.innerHTML = `<p class='answer-text><span class='answer-letter'>${letter} </span>${answer}</p>`;
            answersWrapper.appendChild(answerDiv);
        }
        const submitBtn = createEl(tag='button', className='btn');
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
    const sections = makeCardSections();

    for (let section of sections){
        addSectionContent(section, cardDataObj);
        questionCard.appendChild(section);
    }
};

const clearElement = (parent) => {

    while (parent.firstChild) {
       parent.removeChild(parent.firstChild);
    }

};

const startQuiz = () => {
    if (currentQuestionIdx < quizData.length) {
        clearElement(questionCard);
        loadQuiz();
        currentQuestionIdx++;
    } else {
        // showStatsScreen();
    }
};


// loads the quiz data and creates the elements for the first card.
// TODO: add me after 'START' button pressed
// loadQuiz();


// ----- EVENT LISTENERS ----- 
questionCard.addEventListener('click', cardTaskHandler);
startButton.addEventListener('click', startQuiz);

// BUG: cannot bind submit event. Nothing happens ¯\_(ツ)_/¯
// questionCard.addEventListener('submit', questionCardStyleToggle);
