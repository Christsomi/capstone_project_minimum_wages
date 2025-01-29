class VariablesDescription {
    constructor() {
        this.activeCategory = 'labor-market';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCardLinks();
    }

    setupEventListeners() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => 
                    b.classList.remove('active'));
                e.target.classList.add('active');

                const category = e.target.dataset.category;
                this.switchCategory(category);
            });
        });
    }

    setupCardLinks() {
        document.querySelectorAll('.variable-card').forEach(card => {
            card.addEventListener('click', () => {
                const variableId = card.dataset.variable;
                if (variableId) {
                    window.location.href = `variables/${variableId}.html`;
                }
            });

            card.addEventListener('mouseenter', () => this.addHoverEffect(card));
            card.addEventListener('mouseleave', () => this.removeHoverEffect(card));
        });
    }

    switchCategory(category) {
        document.querySelectorAll('.category-section').forEach(section => {
            section.classList.remove('active');
            section.style.opacity = 0;
        });

        const selectedSection = document.getElementById(category);
        selectedSection.classList.add('active');
        
        void selectedSection.offsetWidth;
        selectedSection.style.opacity = 1;
        
        this.activeCategory = category;
    }

    addHoverEffect(card) {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }

    removeHoverEffect(card) {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VariablesDescription();
});