export default class RadioHandler {
    supports(question) {
        return question.type === 'radio';
    }

    show(question, formDom) {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `<h3>${question.question}</h3>`;

        questionDiv.innerHTML += question.answers.map((answer, i) =>
            `<div class="form-check">
                <input class="form-check-input" type="radio" name="question" value="${i}" id="q${i}">
                <label class="form-check-label" for="q${i}">
                    ${answer}
                </label>
            </div>`).join('');

        formDom.appendChild(questionDiv);
    }

    onSubmit(question, formDom) {
        const selectedAnswer = formDom.querySelector('input[name="question"]:checked');
        const userAnswer = selectedAnswer ? parseInt(selectedAnswer.value) : null;
        const correctAnswer = question.correctAnswer;

        const isCorrect = userAnswer === correctAnswer;
        const score = isCorrect ? question.cofficient || 1 : 0;
        scoreSetter(score);

        return isCorrect;
    }
}
