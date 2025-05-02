export default class Question {
    /**
     *
     * Sorts the question based on the success rate of the question
     * Questions with low success rate will be asked first
     * Questions with no success rate will be asked second, and so on
     */
    static sort(questions) {
        const questionSet = new Set();
        const questionList = [];

        const sortedByScore = questions.sort((a, b) => {
            a.lastScore = a.lastScore || 0;
            b.lastScore = b.lastScore || 0;

            return b.lastScore < a.lastScore ? 1 : -1;
        });

        for (let question of sortedByScore) {
            if (questionSet.has(question.question)) {
                continue;
            }
            questionSet.add(question.question);
            questionList.push(question)

            let filteredQs = questions.filter((qs) => !questionSet.has(qs.question));

            const sortedByAttempts = filteredQs.sort((a, b) => {
                a.attempts = a.attempts || 0;
                b.attempts = b.attempts || 0;

                return b.attempts < a.attempts ? 1 : -1;
            });

            if (sortedByAttempts.length === 0) {
                break;
            }
            questionSet.add(sortedByAttempts[0].question);
            questionList.push(sortedByAttempts[0]);
        }

        return questionList;
    }

    /**
     * Questions can be in sections or in root
     */
    static getAllQuestions(data) {
        // insure that data is an object, is not a string or null
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                return [];
            }
        }
        if (Array.isArray(data.questions)) {
            return data.questions;
        } else if (Array.isArray(data.sections)) {
            return data.sections.map(section => section.questions).flat();
        }
        return [];
    }

    static getTotalPlayed(data) {
        let questions = this.getAllQuestions(data);

        return questions.reduce((acc, question) => {
            question.attempts = question.attempts || 0;
            return acc + question.attempts;
        }, 0);
    }

    static getAvgScore(data) {
        let questions = this.getAllQuestions(data);

        const { totalScore, totalWeight } = questions.reduce((acc, question) => {
            acc.totalScore += (question.lastScore || 0);
            acc.totalWeight += (question.cofficient || 1);
            return acc;
        }, { totalScore: 0, totalWeight: 0 });

        const avg = totalWeight > 0 ? totalScore / totalWeight : 0;
        return avg;
    }

    static getTotalCofficient(questions) {
        return questions.reduce((acc, question) => (parseFloat(question.cofficient) || 1) + acc, 0);
    }


    static reset(quizName) {
        const quiz = window.localStorage.getItem(quizName);
        if (!quiz) {
            return;
        }

        const quizObj = JSON.parse(quiz);
        this.removeAttrs(quizObj);

    }

    static removeAttrs(obj, attrs = ['errors', 'misses', 'userAnswer', 'score', 'isCorrect', 'lastScore']) {
        if (Array.isArray(obj)) {
            obj.forEach(item => removeAttrs(item, attrs));
        } else if (obj && typeof obj === 'object') {
            attrs.forEach(attr => {
                delete obj[attr];
            });
            Object.values(obj).forEach(value => removeAttrs(value, attrs));
        }
    }

//     Attribute	Description
// title	The title of the course, section, or quiz.
// description	A detailed description of the course, section, or quiz.
// questions	An array of Questions included in the course or section.
// sections	An array of sections, each containing its own title, description, and questions.

// question	The main question text.
// shortQuestion	A brief version of the question.
// type	The type of question (e.g., multiple-choice, string).
// answers	An array of possible answers.
// correctAnswer	The index of the correct answer in the answers array (0-based).
// quizName	The name of the quiz.
// cofficient	(optional, default 1)A numerical value representing the weight of the question.
// note:	Additionalnote (optioinal) notes or hints for the question.
    static isValid(data) {
        if (typeof data !== 'object' || data === null) {
            return false;
        }

        const hasValidTitle = typeof data.title === 'string' && data.title.trim() !== '';
        const hasValidDescription = typeof data.description === 'string';

        const hasValidQuestions = Array.isArray(data.questions) && data.questions.every(question => {
            return typeof question.question === 'string' && question.question.trim() !== '' &&
                   Array.isArray(question.answers) && question.answers.length > 0 &&
                   typeof question.correctAnswer === 'number' && question.correctAnswer >= 0 && question.correctAnswer < question.answers.length;
        });

        const hasValidSections = Array.isArray(data.sections) && data.sections.every(section => {
            return typeof section.title === 'string' && section.title.trim() !== '' &&
                   typeof section.description === 'string' &&
                   Array.isArray(section.questions) && section.questions.every(question => {
                       return typeof question.question === 'string' && question.question.trim() !== '' &&
                              Array.isArray(question.answers) && question.answers.length > 0 &&
                              typeof question.correctAnswer === 'number' && question.correctAnswer >= 0 && question.correctAnswer < question.answers.length;
                   });
        });

        return hasValidTitle && hasValidDescription && (hasValidQuestions || hasValidSections);
    }
}

