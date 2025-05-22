import BaseComponent from './../BaseComponent.js';
import Processor from './src/Processor.js';
import ProgressButton from './src/progress-button.js';

export default class Play extends BaseComponent {
    quizName;
    quizObj;

    constructor(container) {
        super(container);
    }

    async loaded() {

        this.processor = new Processor();
        this.progressButton = new ProgressButton(this.container.querySelector('#submit'));

        const urlParams = new URLSearchParams(window.location.search);
        let quizName = urlParams.get('name');
        let quizUrl = urlParams.get('quizPath');
        if (quizUrl) {
            quizName = await this.saveQuizFile(quizUrl);
            // push the quiz name to the url
            history.pushState({}, '', this.addToQueryParams('name', quizName));
            // Now remove 'quizPath'
            const updatedUrl = new URL(window.location); // important to create a fresh URL object
            updatedUrl.searchParams.delete('quizPath');

            // Update URL without reloading
            history.replaceState({}, '', updatedUrl.toString());
        }

        this.quizObj = JSON.parse(localStorage.getItem(quizName));

        if (!this.quizObj) {
            window.location.href = '..';
            return;
        }

        let questions = this.quizObj.questions;
        const sectionQrParams = urlParams.get('section');

        window.addToQueryParams = this.addToQueryParams;
        // save last quiz name to local storage
        const lastState = {name: quizName};
        if (sectionQrParams) {
            lastState.section = sectionQrParams;
        }
        localStorage.setItem('lastQuiz', JSON.stringify(lastState));


        if (!sectionQrParams && Array.isArray(this.quizObj.sections)) {
            this.showOnSections(this.quizObj);
            return;
        } else if (Array.isArray(this.quizObj.sections)) {
            if (sectionQrParams === 'all') {
                questions = this.questionService.getAllQuestions(this.quizObj);
            } else {
                questions = this.quizObj.sections.filter(section => sectionQrParams === section.title).map(question => question.questions).flat();
            }
        }

        this.container.setAttribute('data-score-target', this.questionService.getTotalCofficient(questions));
        this.container.setAttribute('data-question-length', questions.length);

        let sortedQs = this.questionService.sort(questions);

        for (let question of sortedQs) {
            question.cofficient = question.cofficient || 1;
            if (!question || !question.type) continue;
            const score = await this.processor.process(question, this.container);
            question.isCorrect = score === question.cofficient;
            question.lastScore = score;
            await this.processor.handleScore(quizName, question, score, this.container);
            await this.progressButton.start(question.isCorrect ? 1000 : 7000);
        }

        this.showResult(sortedQs);
    }

    showResult(questions) {
        const score = questions.reduce((acc, question) => (parseFloat(question.lastScore) || 0) + acc, 0);
        const attempts = questions.reduce((acc, question) => (parseFloat(question.attempts) || 0) + acc, 0);
        const bar = questions.reduce((acc, question) => (parseFloat(question.cofficient) || 1) + acc, 0);

        const avg = score / bar * 10;
        const target = questions.reduce((acc, question) => (parseFloat(question.cofficient) || 1) + acc, 0);


        const results = this.getTemplate('result', {
            '__SCORE__': score,
            '__ATTEMPTS__': attempts,
            '__AVG__': Math.floor(score / bar * 10) + '/10',
            '__TARGET__': target,
        });

        this.container.appendChild(results);

        // scroll to the bottom of the page
        window.scrollTo({
            height: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }

    async saveQuizFile(quizUrl) {
        // fetch the quiz file and save it to local storage
        let quizName = quizUrl.split('/').pop();

        // name needle and remove the extension from the quiz name
        quizName = 'mda-quiz-' + quizName.split('.').slice(0, -1).join('.');

        const contents = await fetch(quizUrl);
        const json = await contents.json();

        if (json) {
            localStorage.setItem(quizName, JSON.stringify(json));
        }

        return quizName;
    }

    showOnSections(quizObj) {
        // hide next button
        this.container.querySelector('#submit').style.display = 'none';
        if (quizObj.sections) {
            this.setTitle(quizObj.title);
            const sectionContainer = this.container.querySelector('#sections');

            for (let item of quizObj.sections) {
                let paramsKey = 'section';
                let paramsValue = item.title;
                if (item.url) {
                    paramsKey = 'quizPath';
                    paramsValue = item.url;
                }

                const sectionDiv = this.getTemplate('section', {
                    '__SECTION__': paramsValue,
                    '__DESCRIPTION__': item.description || '',
                    '__KEY__': paramsKey,
                    '__ATTEMPTS__': this.questionService.getTotalPlayed(item),
                    '__SCORE__': item.questions.reduce((acc, question) => (parseFloat(question.score) || 1) + acc, 0),
                    '__TARGET__': item.questions.reduce((acc, question) => (parseFloat(question.cofficient) || 1) + acc, 0),
                });

                // <a href="#" class="section-item" onclick="addToQueryParams('${paramsKey}', '${paramsValue}', true)">${item.title}</a>
                // add on click event to the sectionDiv

                sectionContainer.appendChild(sectionDiv);
            }
            // a section for all:
            const allSectionDiv = this.getTemplate('section', {
                '__SECTION__': 'all',
                '__DESCRIPTION__': 'All questions',
                '__KEY__': 'section',
                '__ATTEMPTS__': parseFloat(this.questionService.getTotalPlayed(quizObj) / this.questionService.getAllQuestions(quizObj).length).toFixed(2),
                '__SCORE__': '',
                '__TARGET__':  ''
            });

            sectionContainer.appendChild(allSectionDiv);
        }
    }

    setTitle(title) {
        const titleElement = this.container.querySelector('#quizTitle');
        if (titleElement) {
            titleElement.innerHTML = title;
        }
    }
}
