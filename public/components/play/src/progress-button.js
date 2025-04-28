export default class ProgressButton {
    constructor(container) {
        this.container = container;
        this.animationPaused = false;
        this.touchTimeout = null;
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
        this.container.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.container.classList.add('paused');
        this.container.style.animationPlayState = 'paused';
        this.animation = this.container.style.animation;
    }

    async start(millis) {
        this.resetAnimation();
        this.container.style.animation = this.animation;
        this.container.style.animationDuration = `${millis}ms`;
        this.container.style.animationPlayState = 'running';
        this.container.classList.add('progress-animation');


        return new Promise((resolve) => {
            this.container.addEventListener('animationend', () => {
                this.container.classList.remove('progress-animation');
                // stop the animation
                this.container.style.animationPlayState = 'paused';
                this.container.classList.add('paused');
                resolve();
            }, { once: true });

            // also on click
            this.container.addEventListener('click', () => {
                this.container.classList.remove('progress-animation');
                // stop the animation
                this.container.style.animationPlayState = 'paused';
                this.container.classList.add('paused');
                resolve();
            }, { once: true });
        });
    }

    handleTouchStart() {
        this.touchTimeout = setTimeout(() => {
            this.pauseAnimation();
        }, 500); // 1 second delay
    }

    handleTouchEnd() {
        clearTimeout(this.touchTimeout);
        if (this.animationPaused) {
            this.resumeAnimation();
        }
    }

    handleClick() {
        if (this.animationPaused) {
            this.resumeAnimation();
        } else {
            this.pauseAnimation();
        }
    }

    handleKeyDown(event) {
        if (event.code === 'Space') {
            if (this.animationPaused) {
                this.resumeAnimation();
            } else {
                this.pauseAnimation();
            }
        }
    }

    pauseAnimation() {
        this.animationPaused = true;
        this.container.style.animationPlayState = 'paused';
    }

    resumeAnimation() {
        this.animationPaused = false;
        this.container.style.animationPlayState = 'running';
    }

    resetAnimation() {
        this.container.classList.remove('paused');
        this.container.style.animation = 'none';
        // Trigger reflow to restart the animation
        void this.container.offsetWidth;
        this.container.style.animation = '';
    }
}

// .progress {

//     height: 50px;
//     min-width: 300px;
//     margin: 1rem;
//     padding: 0.5rem;
//     text-align: center;
//     border: 1px solid rgba(53, 53, 53, 0.2);
//     border-radius: 3px;
//     cursor: pointer;

//     background: linear-gradient(to right,
//             var(--progress-bar-color) 20%,
//             rgba(var(--progress-bar-color-rgb), var(--progress-bar-opacity)) 62%,
//             rgba(var(--progress-bar-color-rgb), 0) 75%);

//     background-size: 200% 100%;
//     background-position: left center;
//     animation: move-background var(--progress-bar-animation-time) linear forwards;

// }

// @keyframes move-background {
//     from {
//         background-position: right center;
//     }

//     to {
//         background-position: left center;
//     }
// }
