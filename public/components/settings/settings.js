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
    }


    loadCourse() {
            this.container.querySelector('#load-course').addEventListener('click', function() {
        const url = this.container.querySelector('#course-url').value;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Assuming you have a function to handle the loaded course data
                if (this.questionService.isValid(data)) {
                    this.questionService.loadCourse(data);
                }
                document.getElementById('load-course-message').innerText = 'Course loaded successfully!';
            })
            .catch(error => {
                console.error('Error loading course:', error);
                document.getElementById('load-course-message').innerText = 'Error loading course.';
            });
    });
    }

}
