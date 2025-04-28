export default class TextHandler {
    static INPUT_ID = 'text-answer'
    supports(question) {
        return question.type === 'text';
    }

    show(question, domEl) {
        this.question = question;

        domEl.innerHTML = `
            <h3>${question.question}</h3>
            <div class="mb-3">
                <label class="form-label" for="answer">Your Answer</label>
                <input class="form-control" type="text" id="${TextHandler.INPUT_ID}" name="answer">
            </div>
        `;

    }

    onSubmit(question, domEl) {
        const input = domEl.querySelector('#' + TextHandler.INPUT_ID);
        const userAnswer = input ? input.value.trim() : '';
        const correctAnswer = question.correctAnswer || '';

        question.userAnswer = userAnswer;

        const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        question.lastScore = isCorrect ? (question.cofficient || 1 ): 0;
        return isCorrect ? this.question.cofficient || 1 : 0;
    }
}
