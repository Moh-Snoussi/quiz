import BaseComponent from '/components/BaseComponent.js';

export default class ColorScheme extends BaseComponent {
    constructor(container) {
        super(container);
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
}
