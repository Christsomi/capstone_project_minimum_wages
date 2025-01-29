document.addEventListener('DOMContentLoaded', () => {
    const theoriesData = [
        {
            category: 'Fundamental Labor Market Theories',
            theories: [
                {
                    name: 'Competitive Labor Market Theory (Neoclassical Model)',
                    coreIdea: 'In perfectly competitive markets, minimum wages above equilibrium reduce employment',
                    keyMechanisms: [
                        'Firms hire workers until marginal cost equals marginal revenue product',
                        'Binding minimum wage creates excess labor supply',
                        'Causes unemployment, especially for low-skill workers'
                    ],
                    contributors: ['George Stigler', 'Milton Friedman']
                },
                {
                    name: 'Monopsony Model',
                    coreIdea: 'When employers have wage-setting power, moderate minimum wages can increase both wages and employment',
                    keyMechanisms: [
                        'Firms face upward-sloping labor supply curve',
                        'Can profitably pay below-competitive wages',
                        'Minimum wage can act as price ceiling on employer power'
                    ],
                    contributors: ['Joan Robinson', 'Alan Manning']
                },
                {
                    name: 'Efficiency Wage Theory',
                    coreIdea: 'Higher wages can increase productivity and reduce turnover',
                    keyMechanisms: [
                        'Higher wages motivate better performance',
                        'Reduce monitoring costs',
                        'Attract higher quality workers',
                        'Lower turnover costs'
                    ],
                    contributors: ['Janet Yellen', 'George Akerlof']
                },
                {
                    name: 'Search and Matching Theory',
                    coreIdea: 'Labor markets have frictions that affect how workers and firms find each other',
                    keyMechanisms: [
                        'Minimum wages affect both job creation and destruction',
                        'Impact search behavior and match quality',
                        'Dynamic adjustment processes matter'
                    ],
                    contributors: ['Diamond', 'Mortensen', 'Pissarides']
                },
                {
                    name: 'Institutional Labor Market Theory',
                    coreIdea: 'Labor markets are shaped by institutions, norms, and power relations',
                    keyMechanisms: [
                        'Minimum wages can reduce income inequality',
                        'May increase worker productivity through efficiency wages',
                        'Can create "shock effects" pushing firms to improve efficiency'
                    ],
                    contributors: ['Michael Reich', 'David Card']
                }
            ]
        },
        {
            category: 'Advanced Labor Market Theories',
            theories: [
                {
                    name: 'Human Capital Theory in Minimum Wage Context',
                    coreIdea: 'Minimum wages affect investment in skills and training',
                    keyMechanisms: [
                        'May reduce employer-provided training',
                        'Can affect education decisions',
                        'Impacts long-term career development'
                    ],
                    contributors: ['Gary Becker', 'Jacob Mincer']
                },
                {
                    name: 'Two-Sector Models',
                    coreIdea: 'Workers may shift between covered and uncovered sectors',
                    keyMechanisms: [
                        'Employment effects depend on sector mobility',
                        'Can create spillover effects',
                        'May cause informal sector growth'
                    ],
                    contributors: ['Harris-Todaro model developers']
                },
                {
                    name: 'Behavioral Labor Economics',
                    coreIdea: 'Psychological factors affect wage and employment relationships',
                    keyMechanisms: [
                        'Reference-dependent preferences',
                        'Fairness concerns',
                        'Social comparison effects'
                    ],
                    contributors: ['Ernst Fehr', 'Matthew Rabin']
                },
                {
                    name: 'Dynamic Monopsony Theory',
                    coreIdea: 'Modern labor markets have "dynamic" monopsony due to search frictions',
                    keyMechanisms: [
                        'Workers face mobility costs',
                        'Information imperfections',
                        'Job differentiation creates employer power'
                    ],
                    contributors: ['Alan Manning', 'Dube et al.']
                },
                {
                    name: 'Endogenous Growth Theory Applications',
                    coreIdea: 'Minimum wages can affect technological change and growth',
                    keyMechanisms: [
                        'May incentivize automation',
                        'Could affect innovation rates',
                        'Impacts productivity growth'
                    ],
                    contributors: ['Paul Romer\'s framework applied to minimum wage']
                }
            ]
        },
        {
            category: 'Youth Labor Market Theories',
            theories: [
                {
                    name: 'School-to-Work Transition Theory',
                    coreIdea: 'Minimum wages affect the critical transition from education to employment',
                    keyMechanisms: [
                        'Job search during school',
                        'First job acquisition',
                        'Early career development pathways',
                        'Part-time vs. full-time choices'
                    ],
                    contributors: ['Ryan', 'Wolbers', 'OECD Research']
                },
                {
                    name: 'Youth Job Competition Theory',
                    coreIdea: 'Young workers compete with more experienced workers',
                    keyMechanisms: [
                        'Substitution between youth and adult workers',
                        'Experience premium effects',
                        'Role of education credentials',
                        'Entry-level position availability'
                    ],
                    contributors: ['Blanchflower', 'Freeman']
                },
                {
                    name: 'Youth Human Capital Formation Theory',
                    coreIdea: 'Early labor market experiences shape long-term outcomes',
                    keyMechanisms: [
                        'On-the-job learning opportunities',
                        'Skill development trajectories',
                        'Career exploration and matching',
                        'Work-relevant soft skills development'
                    ],
                    contributors: ['Neumark', 'Wascher']
                },
                {
                    name: 'Dual Labor Market Theory for Youth',
                    coreIdea: 'Youth often start in secondary labor markets',
                    keyMechanisms: [
                        'Limited access to primary labor markets',
                        'Temporary/seasonal employment patterns',
                        'Industry segregation',
                        'Mobility barriers'
                    ],
                    contributors: ['Doeringer', 'Piore']
                },
                {
                    name: 'Life-Course Employment Theory',
                    coreIdea: 'Early employment experiences affect lifetime trajectories',
                    keyMechanisms: [
                        'Scarring effects from unemployment',
                        'Signal effects of first jobs',
                        'Network building',
                        'Career path determination'
                    ],
                    contributors: ['Elder', 'O\'Rand']
                }
            ]
        },
        {
            category: 'Youth Employment Perspectives',
            theories: [
                {
                    name: 'Education-Employment Trade-off Theory',
                    coreIdea: 'Minimum wages affect education decisions',
                    keyMechanisms: [
                        'School enrollment choices',
                        'Dropout decisions',
                        'Part-time work during school',
                        'Returns to education calculations'
                    ],
                    contributors: ['Card', 'Lemieux']
                },
                {
                    name: 'Youth Labor Market Attachment Theory',
                    coreIdea: 'Early experiences shape long-term labor force participation',
                    keyMechanisms: [
                        'Work habits formation',
                        'Labor market engagement patterns',
                        'Job search behaviors',
                        'Employment commitment development'
                    ],
                    contributors: ['O\'Higgins']
                },
                {
                    name: 'Social Network Theory in Youth Employment',
                    coreIdea: 'Social connections crucial for youth job access',
                    keyMechanisms: [
                        'Family employment networks',
                        'School-based connections',
                        'Peer effects',
                        'Information flows'
                    ],
                    contributors: ['Granovetter applied to youth']
                },
                {
                    name: 'Youth Skills Mismatch Theory',
                    coreIdea: 'Gap between youth skills and employer demands',
                    keyMechanisms: [
                        'Education-job alignment',
                        'Technical vs. soft skills',
                        'Entry-level skill requirements',
                        'Training investment decisions'
                    ],
                    contributors: ['ILO Research']
                },
                {
                    name: 'Generational Labor Market Theory',
                    coreIdea: 'Each generation faces unique labor market conditions',
                    keyMechanisms: [
                        'Cohort effects',
                        'Technological change impact',
                        'Changed employer expectations',
                        'Economic cycle timing'
                    ],
                    contributors: ['Various labor economists']
                }
            ]
        },
        {
            category: 'Modern Labor Market Debates',
            theories: [
                {
                    name: 'Heterogeneous Effects',
                    coreIdea: 'Minimum wage impacts vary across different contexts',
                    keyMechanisms: [
                        'Impacts differ by worker characteristics (age, skill)',
                        'Vary by market conditions',
                        'Depend on industry structure',
                        'Influenced by geographic location'
                    ],
                    contributors: ['Various labor market researchers']
                },
                {
                    name: 'Adjustment Channels',
                    coreIdea: 'Minimum wages impact more than just employment',
                    keyMechanisms: [
                        'Effects on hours worked',
                        'Changes in non-wage benefits',
                        'Alterations in work intensity',
                        'Price pass-through mechanisms',
                        'Firm productivity responses'
                    ],
                    contributors: ['Contemporary labor economists']
                },
                {
                    name: 'Long-term Effects',
                    coreIdea: 'Minimum wages have dynamic, extended impacts',
                    keyMechanisms: [
                        'Career progression implications',
                        'Human capital accumulation',
                        'Market structure transformations',
                        'Technological adoption patterns'
                    ],
                    contributors: ['Interdisciplinary research teams']
                },
                {
                    name: 'Distributional Impacts',
                    coreIdea: 'Minimum wages affect broader economic distribution',
                    keyMechanisms: [
                        'Impact on income inequality',
                        'Changes in poverty rates',
                        'Effects on family incomes',
                        'Wage compression dynamics'
                    ],
                    contributors: ['Policy and economic research institutions']
                }
            ]
        }
    ];

    const categoriesContainer = document.getElementById('categories-container');
    const detailsContainer = document.getElementById('details-container');

    theoriesData.forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.textContent = category.category;
        categoryButton.classList.add('category-button');
        categoryButton.addEventListener('click', () => displayTheories(category.theories));
        categoriesContainer.appendChild(categoryButton);
    });

    function displayTheories(theories) {
        detailsContainer.innerHTML = '';
        theories.forEach(theory => {
            const theoryCard = document.createElement('div');
            theoryCard.classList.add('theory-card');
            
            theoryCard.innerHTML = `
                <h3>${theory.name}</h3>
                <p><strong>Core Idea:</strong> ${theory.coreIdea}</p>
                <h4>Key Mechanisms:</h4>
                <ul>
                    ${theory.keyMechanisms.map(mechanism => `<li>${mechanism}</li>`).join('')}
                </ul>
                <p><strong>Main Contributors:</strong> ${theory.contributors.join(', ')}</p>
            `;
            
            detailsContainer.appendChild(theoryCard);
        });
    }

    if (theoriesData.length > 0) {
        displayTheories(theoriesData[0].theories);
    }

    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'Search theories...');
    searchInput.classList.add('search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allTheories = theoriesData.flatMap(category => category.theories);
        const filteredTheories = allTheories.filter(theory => 
            theory.name.toLowerCase().includes(searchTerm) ||
            theory.coreIdea.toLowerCase().includes(searchTerm) ||
            theory.keyMechanisms.some(mechanism => mechanism.toLowerCase().includes(searchTerm)) ||
            theory.contributors.some(contributor => contributor.toLowerCase().includes(searchTerm))
        );
        displayTheories(filteredTheories);
    });
    
    categoriesContainer.insertBefore(searchInput, categoriesContainer.firstChild);
});