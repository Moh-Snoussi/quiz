// adds a "dark" class to the body element if the user has settings-color-scheme
const savedScheme = localStorage.getItem('settings-color-scheme') || 'light';
document.body.classList.toggle('dark', savedScheme === 'dark');
