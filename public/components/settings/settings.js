import BaseComponent from '/components/BaseComponent.js';
import Question from './../Question.js';

export default class Settings extends BaseComponent {
    constructor(container) {
        super(container);
        this.questionService = Question;
    }

    loaded() {
        document.getElementById('color-scheme').addEventListener('change', (event) => {
            const selectedScheme = event.target.value;
            localStorage.setItem('settings-color-scheme', selectedScheme);
            applyColorScheme(selectedScheme);
        });

        function applyColorScheme(scheme) {
            if (scheme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.body.classList.toggle('dark', prefersDark);
                document.body.classList.toggle('light', !prefersDark);
            } else {
                document.body.classList.toggle('dark', scheme === 'dark');
                document.body.classList.toggle('light', scheme === 'light');
            }
        }

        // Apply the saved color scheme on page load
        const savedScheme = localStorage.getItem('settings-color-scheme') || 'system';
        applyColorScheme(savedScheme);
        document.getElementById('color-scheme').value = savedScheme;

        this.registerLoadCourse();
    }


    registerLoadCourse() {
        this.container.querySelector('#load-course').addEventListener('click', () => {
            const url = this.container.querySelector('#course-url').value;
            // the last part of the url is the course name without extension
            const courseName = url.split('/').pop().split('.').shift();
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // Assuming you have a function to handle the loaded course data
                    const errors = this.questionService.getErrors(data);
                    if (errors.length > 0) {
                        document.getElementById('load-course-message').innerText = 'Errors found in course data: ' + errors.join(', ');
                        return;
                    }
                    this.questionService.saveCourse(courseName, data);
                    document.getElementById('load-course-message').innerText = 'Course loaded successfully!';
                })
                .catch(error => {
                    console.error('Error loading course:', error);
                    document.getElementById('load-course-message').innerText = 'Error loading course.';
                });
        });
    }

}
