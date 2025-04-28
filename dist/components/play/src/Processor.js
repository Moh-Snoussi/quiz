import MultiChoiceHandler from './handlers/MultiChoiceHandler.js';
import TextHandler from './handlers/TextHandler.mjs';
import ClientDBHandler from './score-handlers/ClientDBHandler.js';
import RenderHandler from './score-handlers/RenderHandler.js';

export default class Processor {
    constructor() {
        this.handlers = [new TextHandler(), new MultiChoiceHandler()];
        this.scoreHanlers = [new ClientDBHandler(), new RenderHandler()];
    }

    getHandler(question) {
        return this.handlers.find(handler => handler.supports(question));
    }

    async process(question, domEl) {
        const handler = this.getHandler(question);
        if (!handler) throw new Error('No handler found for question type: ' + question.type);

        const questionEl = domEl.querySelector('#quiz-question');
        if (!questionEl) throw new Error('Question element not found in DOM');
        questionEl.innerHTML = '';

        const nextButton = domEl.querySelector('#submit');
        if (!nextButton) throw new Error('Next button not found in form DOM');


        this.cofficient = question.cofficient || 1;
        handler.show(question, questionEl);

        return new Promise((resolve) => {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                const score = handler.onSubmit(question, domEl);
                resolve(score);
            }, { once: true });
        });
    }

    async handleScore(quizName, question, score, container) {

        this.updateScore(question, score);
        for (let handler of this.scoreHanlers) {
            if (handler.supports(question)) {
                await handler.handle(quizName, question, container);
            }
        }
    }

    updateScore(question, score) {
        question.attempts = question.attempts || 0
        question.attempts += 1;
        question.lastScore = score;
        question.avg = score / question.attempts;
    }
}
