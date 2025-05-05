import BaseComponent from '/components/BaseComponent.js';

export default class TopBar extends BaseComponent {

    menuItem = [
        {
            label: 'Instal',
            title: 'Install',
            href: '#install',
            emojie: '📲',
        }, {
            label: 'Docs',
            href: '/doc.html',
            title: 'Documentation',
            emojie: 'ℹ️',
        },
        {
            label: 'Settings',
            href: '/settings.html',
            title: 'Settings',
            emojie: '⚙️',
        }
    ];

    constructor(container) {
        super(container);
        this.menu = this.container.querySelector('[data-top-bar-list]');
        this.menuContainer = this.container.querySelector('[data-top-bar-menu]');
        this.logo = this.container.querySelector('[data-logo]');
        this.toggleButton = this.container.querySelector('.menu-toggle');
        this.menuTemplate = this.container.querySelector('[data-top-bar-menu-template]');

        // if app is installed, hide the install button
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.menuItem = this.menuItem.filter(item => item.label !== 'Instal');
        }

        this.setMenuItems(...this.menuItem);
        this.registerInstallation()

        this.toggleButton.addEventListener('click', () => this.toggleMenu());
    }

    registerInstallation() {
        let deferredPrompt = null;
        const installBtn = this.container.querySelector('[data-top-bar-menu-item] [href="#install"]');
        window.addEventListener('beforeinstallprompt', (e) => {
            // e.preventDefault(); // Prevent auto-prompt
            deferredPrompt = e;

            installBtn.addEventListener('click', () => {
                installBtn.style.display = 'none';
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(choiceResult => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('PWA installation accepted');
                    } else {
                        console.log('PWA installation dismissed');
                    }
                    deferredPrompt = null;
                });
            });
        });
    }

    loaded() {
        const prefersDark = document.body.classList.contains('dark');
        this.container.querySelector('.logo-image').setAttribute('src', '/assets/icons/mda-white.svg');
    }

    toggleMenu() {
        const isOpen = this.menuContainer.classList.toggle('open');
        this.toggleButton.textContent = isOpen ? '✖' : '☰';
    }

    setMenuItems(...items) {
        items.forEach(item => {
            const menuContent = this.menuTemplate.content.cloneNode(true);
            const link = menuContent.querySelector('a');
            link.innerHTML = item.label;
            if (item.emojie) {
                link.innerHTML = `${item.emojie} ${item.label}`;
            }
            if (item.href) {
                link.setAttribute('href', item.href);
            }
            if (item.title) {
                link.setAttribute('title', item.title);
            }

            // open same tab
            link.setAttribute('target', '_self');



            this.menu.appendChild(menuContent);
        });
    }
}
