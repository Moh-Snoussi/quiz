export default class MultiChoiceHandler {
    supports(question) {
        return question.type === 'multiple-choice';
    }

    show(question, formDom) {

        this.question = question;
        let correctIndexes = question.correctAnswer;
        if (!Array.isArray(correctIndexes)) {
            correctIndexes = [correctIndexes];
        }

        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `<h3>${question.question}<sup>${question.cofficient || 1}/${correctIndexes.length}</sup></h3>`;

        this.correctAnswers = correctIndexes.map((index) => question.answers[index]);

        this.shuffeledAnswer = [...question.answers]
        this.shuffeledAnswer.sort(() => Math.random() - 0.5);

        this.shuffeledCorrectAnswer = correctIndexes.map((index) => question.answers[index]);

        questionDiv.innerHTML += this.shuffeledAnswer.map((answer, i) =>
            `<div class="form-check">
                <input class="form-check-input" type="checkbox" name="question" value="${answer}" id="q${i}">
                <label class="form-check-label" for="q${i}">
                    ${answer}
                </label>
            </div>`).join('');

        formDom.appendChild(questionDiv);
    }

    onSubmit(question, formDom) {
        let correctAnswers = question.correctAnswer;
        if (!Array.isArray(correctAnswers)) {
            correctAnswers = [correctAnswers];
        }

        // correctAnswers are indexes, let's get the values
        correctAnswers = correctAnswers.map((index) => question.answers[index]);

        let score = 0;
        const cofficient = question.cofficient || 1;
        const itemScore = cofficient / correctAnswers.length;

        const answerEls = Array.from(formDom.querySelectorAll('input[name="question"]'));
        const checkedEls = Array.from(formDom.querySelectorAll('input[name="question"]:checked'));
        question.userAnswer = checkedEls.map((input) => input.value);

        answerEls.forEach((answerEl) => {
            if (correctAnswers.includes(answerEl.value)) {
                answerEl.parentElement.classList.add(answerEl.checked ? 'success' : 'missing');
                score += answerEl.checked ? itemScore : 0;

                if (!answerEl.checked) {
                    question.misses= question.misses || [];
                    question.misses.push(answerEl.value);
                }
            } else if (answerEl.checked) {
                answerEl.parentElement.classList.add('error');
                question.errors = question.errors || [];
                question.errors.push(answerEl.value)
            }
        });

        return score;
    }
}
