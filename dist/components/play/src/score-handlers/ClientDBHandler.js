export default class ClientDBHandler {
    supports(question) {
        // Logic to determine if this handler supports the question
        return true;
    }

    handle(name, question, container) {
        let quizObj = JSON.parse(localStorage.getItem(name)) || {};

        // iterate over the sections
        if (quizObj.sections && quizObj.sections.length > 0) {
            for (let section of quizObj.sections) {
                // check if the question is in the section
                let questionIndex = section.questions.findIndex(q => q.question === question.question);
                if (questionIndex !== -1) {
                    // update the question
                    let saveQs = section.questions[questionIndex];
                    console.log('Old score', 'attempts', saveQs.attempts, 'lastScore', saveQs.lastScore, 'avg', saveQs.avg);
                    section.questions[questionIndex] = question;
                    localStorage.setItem(name, JSON.stringify(quizObj));
                    console.log('New score', 'attempts', section.questions[questionIndex].attempts, 'lastScore', section.questions[questionIndex].lastScore, 'avg', section.questions[questionIndex].avg);
                    break;
                }
            }
        }
    }
}
