import TextHandler from '../handlers/TextHandler.mjs';
import assert from 'assert';


export default () => {
    const handler = new TextHandler();
    const formDom = document.createElement('form');

    // Test supports method
    const question = { type: 'text' };
    assert.strictEqual(handler.supports(question), true, 'supports method failed for text');

    const questionData = {
        question: 'What is your name?',
        shortQuestion: 'name?',
        type: 'text',
        answers: ['John', 'Jane', 'Doe'],
        correctAnswer: 'John',
        quizName: 'Name Quiz',
        cofficient: 3,
        note: 'Please enter your name.'
    };

    handler.show(questionData, formDom);

    assert.ok(formDom.innerHTML.includes('What is your name?'), 'show method failed to render question');
    assert.ok(formDom.querySelector('input[type="text"]'), 'show method failed to render input field');

    formDom.querySelector('input[type="text"]').value = 'John';

    let score = handler.onSubmit(questionData, formDom);
    assert.strictEqual(questionData.cofficient, score, 'onSubmit method failed to set score correctly');

    formDom.querySelector('input[type="text"]').value = 'Thomas';
    score = handler.onSubmit(questionData, formDom);
    assert.strictEqual(0, score, 'onSubmit method failed to set score correctly for wrong answer');
}
