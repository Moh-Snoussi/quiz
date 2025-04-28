import BaseComponent from './../BaseComponent.js';
import JSONTree from './JSONTree.js';

export default class QuizSetter extends BaseComponent {
    constructor(container) {
        super(container);
        this.saveButton = this.container.querySelector('button');
        this.titleInput = this.container.querySelector('input');
        this.jsonTextarea = this.container.querySelector('textarea');

        this.notifyEl = this.container.querySelector('.notify');
        this.addJsonSaver();
        this.listQuizzes();
    }

    listQuizzes() {
        const storage = window.localStorage;
        const quizzes = Object.keys(storage);
        const quizTable = this.container.querySelector('table.quiz-list');
        quizTable.innerHTML = '';
        const rowTemplate = this.getTemplate('row');

        // Clear the table
        quizTable.querySelectorAll('tr').forEach((row) => row.closest('template') ? row.remove() : null);

        quizzes.forEach((storageKey) => {
            const quizNeedle = 'mda-quiz-';
            if (!storageKey.startsWith(quizNeedle)) {
                return;
            }

            let quizName = storageKey.replace(quizNeedle, '');

            const data = storage.getItem(storageKey);
            let avg = data.avg;
            avg = isNaN(avg) ? 0 : avg;


            let rowInnerHTML = this.replace(rowTemplate.innerHTML, {
                '__TITLE__': quizName,
                '__TOTAL_PLAY__': this.questionService.getTotalPlayed(data),
                '__AVG__': this.questionService.getAvgScore(data),
            });

            const row = document.createElement('tr');
            row.innerHTML = rowInnerHTML;

            // Append the row to the table
            this.addRowEventListeners(row, quizName);
            quizTable.appendChild(row);
        });
    }


    addRowEventListeners(row, quizName) {
        const playButton = row.querySelector('.play-button');
        playButton.addEventListener('click', async () => {
            window.location.href = await this.getPublicPath('quiz.html', {
                name: 'mda-quiz-' + quizName,
            })
        });

        const resetButton = row.querySelector('.reset-button');
        resetButton.addEventListener('click', () => {
            this.resetQuiz('mda-quiz-' + quizName);
            this.listQuizzes();
        });

        const editButton = row.querySelector('.edit-button');
        editButton.addEventListener('click', () => {
            this.titleInput.value = quizName;
            this.jsonTextarea.value = window.localStorage.getItem('mda-quiz-' + quizName);
        });

        const deleteButton = row.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => {
            window.localStorage.removeItem('mda-quiz-' + quizName);
            this.listQuizzes();
        });
    }

    loaded() {
        console.log('Quiz-setter loaded');
    }

    addJsonSaver() {

        this.saveButton.addEventListener('click', () => {
            const title = this.titleInput.value;
            if (!title) {
                this.notifyEl.innerHTML = 'Title is required';
                this.notifyEl.classList.add('notify--error');
                return;
            }

            const json = this.jsonTextarea.value;
            try {
                // lets catch on invalid json
                JSON.parse(json);
                window.localStorage.setItem('mda-quiz-' + title, json);
                this.notifyEl.innerHTML = 'Saved';
                this.notifyEl.classList.remove('notify--error');
                this.notifyEl.classList.add('notify--success');
                // refresh the list
                this.listQuizzes();
            } catch (e) {
                this.notifyEl.innerHTML = 'Invalid JSON';
                this.notifyEl.classList.add('notify--error');
                return;
            }

        });
        this.listQuizzes();
    }

    resetQuiz(quizName) {
        this.questionService.reset(quizName);
    }
}
