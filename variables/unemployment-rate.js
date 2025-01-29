class UnemploymentRatePage {
    constructor() {
        this.init();
    }

    init() {
        this.setupCards();
        this.setupScrollEffects();
        this.setupMobileInteractions();
    }

    setupCards() {
        const analysisCards = document.querySelectorAll('.analysis-card');
        
        analysisCards.forEach(card => {
            if (window.innerWidth > 768) {
                card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
                card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
            }
            
            card.addEventListener('click', () => this.handleCardClick(card));
            
            card.style.animationDelay = `${Array.from(analysisCards).indexOf(card) * 0.1}s`;
        });
    }

    handleCardHover(card, isHovering) {
        if (window.innerWidth <= 768) return;

        const front = card.querySelector('.card-front');
        const back = card.querySelector('.card-back');

        if (isHovering) {
            front.style.transform = 'rotateY(180deg)';
            back.style.transform = 'rotateY(0)';
            card.style.zIndex = '2';
        } else {
            front.style.transform = 'rotateY(0)';
            back.style.transform = 'rotateY(180deg)';
            card.style.zIndex = '1';
        }
    }

    handleCardClick(card) {
        if (window.innerWidth > 768) return;

        const front = card.querySelector('.card-front');
        const back = card.querySelector('.card-back');

        if (back.style.display === 'block') {
            back.style.display = 'none';
            front.style.display = 'block';
        } else {
            back.style.display = 'block';
            front.style.display = 'none';
            
            back.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    setupScrollEffects() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        if (entry.target.classList.contains('info-card')) {
                             this.animateInfoCard(entry.target);
                        }
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px'
            }
        );

        document.querySelectorAll('.info-card, .analysis-card').forEach(el => {
            observer.observe(el);
        });
    }

    animateInfoCard(card) {
        const elements = card.querySelectorAll('.card-content > *');
        elements.forEach((el, index) => {
            el.style.animation = `slideUp 0.5s ease forwards ${index * 0.1}s`;
        });
    }

    setupMobileInteractions() {
        if ('ontouchstart' in window) {
            document.querySelectorAll('.analysis-card').forEach(card => {
                card.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.handleCardClick(card);
                });
            });
        }

        window.addEventListener('orientationchange', () => {
            this.resetCardStates();
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.resetCardStates(), 250);
        });
    }

    resetCardStates() {
        document.querySelectorAll('.analysis-card').forEach(card => {
            const front = card.querySelector('.card-front');
            const back = card.querySelector('.card-back');

            if (window.innerWidth > 768) {
                front.style.display = 'flex';
                back.style.display = 'block';
                front.style.transform = 'rotateY(0)';
                back.style.transform = 'rotateY(180deg)';
            } else {
                front.style.display = 'block';
                back.style.display = 'none';
                front.style.transform = 'none';
                back.style.transform = 'none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const unemploymentRatePage = new UnemploymentRatePage();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            unemploymentRatePage.resetCardStates();
        }
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .visible {
        animation: fadeIn 0.5s ease forwards;
    }
`;
document.head.appendChild(style);