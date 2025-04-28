export default class RenderHandler {

    supports(question) {
        // Logic to determine if this handler supports the question
        return true;
    }

    async handle(name, question, container) {

        await new Promise((resolve) => {
            this.addItem(container, question);
            this.updateTopBarStatus(question);
            resolve();
        });
    }

    addItem(container, question) {
        let correctAnswer = question.correctAnswer;
        if (Array.isArray(correctAnswer)) {
            correctAnswer = question.correctAnswer.map((index) => question.answers[parseInt(index)]);
        } else if (question.type !== 'text' && !isNaN(question.correctAnswer)) {
            correctAnswer = question.answers[question.correctAnswer];
        } else {
            correctAnswer = question.correctAnswer;
        }

        const detailsEl = document.createElement('details');
        detailsEl.classList.add(question.isCorrect ? 'history-success' : 'history-danger');
        const summaryEl = this.getSummary(question);
        detailsEl.innerHTML = `
        ${summaryEl.outerHTML}
        <span class="correct-answer">-> ${correctAnswer}</span>
        <span class="answer-notes"> | ${question.note || ""}</span>
        `;

        container.appendChild(detailsEl);

        if (question.lastScore < (question.cofficient || 1)) {
            detailsEl.setAttribute('open', 'open');
        }
    }

    getSummary(question) {
        const summaryEl = document.createElement('summary');
        let content = ''
        if (question.errors) {
            content += `<span class="error"><del>${this.eplipse(question.errors.join(', '))}</del>&nbsp;</span>`;
        }
        if (question.misses) {
            content += `Misses: <span class="misses">${this.eplipse(question.misses.join(', '))}</span>`;
        }

        summaryEl.innerHTML = `
            <span class="short-question">${question.shortQuestion}</span>
            <span class="${question.isCorrect ? 'correct' : 'incorrect'}">${question.lastScore}/${question.cofficient || 1}</span>

            <span>${content}</span>
        `;

        return summaryEl;
    }

    eplipse(text, length = 20) {
        if (text.length > length) {
            return text.substring(0, length) + '...';
        }
        return text;
    }

    updateTopBarStatus(question) {
        let statusEl = document.querySelector('.render-handeler-status');
        if (!statusEl) {
            statusEl = this.createTopBarStatus();
        }


        let oldScore = parseFloat(statusEl.getAttribute('data-score') || 0);
        let answered = parseInt(statusEl.getAttribute('data-answered') || 0);
        answered++;
        statusEl.setAttribute('data-answered', answered);

        let newScore = parseFloat(question.lastScore || 0) + parseFloat(oldScore);
        statusEl.setAttribute('data-score', newScore);


        const scoreTarget = document.querySelector('[data-score-target]');
        const questionLength = document.querySelector('[data-question-length]');

        if (scoreTarget && questionLength) {
            const target = parseInt(scoreTarget.getAttribute('data-score-target'));
            const length = parseInt(questionLength.getAttribute('data-question-length'));
            statusEl.innerHTML = `
            <span class="score">${newScore}/${target}  ${length - answered}</span>
            `;

        }
    }

    createTopBarStatus() {
        const topBar = document.querySelector('[data-component="top-bar"]');
        const statusEl = document.createElement('div');
        statusEl.classList.add('render-handeler-status');
        statusEl.style.position = 'absolute';
        statusEl.style.top = '10px';
        statusEl.style.zIndex = '-3';
        statusEl.style.left = '50px';
        statusEl.style.maxWidth = '300px';
        statusEl.style.height = '50px';

        topBar.appendChild(statusEl);

        return statusEl;
    }
}
