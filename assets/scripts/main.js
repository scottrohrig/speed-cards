/* SPEEDUCATION APP */

// ----- ideas ----- 

// TODO: build question card 
//      [ ] => add data attributes to cards
//      [ ] => add data attributes to answers
//      [ ] => randomize answer order
//      [ ] => remove 'chosen-answer' from other answers on select
//              - consider using data attrs.
//      [ ] => make a "start session" card, with the start button centered


// ----- CONSTANTS ----- 
const questionCard = document.querySelector('#question-card');
const answersWrapper = document.querySelector('.answers');


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
        switch (answer.className) {
            case 'answer':
                answer.className = 'answer chosen-answer'
                break;
            default:
                answer.className = 'answer';
                selectedAnswer = false;
                break;
            }
            
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

const createQuestionCard = function() {
    
    const makeCard = () => {
        // questionCard already defined
        // const cardDiv = document.createElement('div');
        const cardHeader = document.createElement('div');
        const cardBody = document.createElement('div');
        const cardFooter = document.createElement('div');

        cardHeader.className = 'card-header';
        cardBody.className = 'card-body';
        cardFooter.className = 'card-footer';
    }
};

const test = (e) => console.log(e, e.target, 'this:' , e.currentTarget);

// ----- EVENT LISTENERS ----- 
questionCard.addEventListener('click', cardTaskHandler);

// BUG: cannot bind submit event. Nothing happens ¯\_(ツ)_/¯
// questionCard.addEventListener('submit', questionCardStyleToggle);
