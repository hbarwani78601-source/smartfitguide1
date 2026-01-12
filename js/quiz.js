const quizData = [
    {
        id: 1,
        question: "What is your current fitness level?",
        options: [
            { text: "Beginner", value: "beginner" },
            { text: "Intermediate", value: "intermediate" },
            { text: "Advanced", value: "advanced" }
        ]
    },
    {
        id: 2,
        question: "What is your primary goal?",
        options: [
            { text: "Weight Loss", value: "weight_loss" },
            { text: "Muscle Gain", value: "muscle_gain" },
            { text: "General Fitness", value: "general_fitness" }
        ]
    },
    {
        id: 3,
        question: "Where do you plan to workout?",
        options: [
            { text: "Home (Small Space)", value: "home_small" },
            { text: "Home (Enough Space)", value: "home_large" },
            { text: "Gym", value: "gym" }
        ]
    },
    {
        id: 4,
        question: "What is your preference?",
        options: [
            { text: "Equipment-based training", value: "equipment" },
            { text: "Nutrition & recovery", value: "nutrition" },
            { text: "Not sure", value: "not_sure" }
        ]
    }
];

let currentQuestion = 0;
let answers = {};

document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const introSection = document.getElementById('quiz-intro');
    const questionSection = document.getElementById('quiz-question');
    const resultSection = document.getElementById('quiz-result');

    // Elements
    const startBtn = document.getElementById('start-btn');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressIndicator = document.getElementById('step-indicator'); // We will add this to HTML

    // Start Quiz
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            introSection.classList.add('hidden');
            questionSection.classList.remove('hidden');
            loadQuestion();
        });
    }

    function loadQuestion() {
        const data = quizData[currentQuestion];

        // Update Indicator
        if (progressIndicator) {
            progressIndicator.textContent = `Step ${currentQuestion + 1} of ${quizData.length}`;
        }

        questionText.textContent = data.question;
        optionsContainer.innerHTML = '';

        data.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-outline quiz-option';
            // Styling for option buttons
            btn.style.width = '100%';
            btn.style.marginBottom = '1rem';
            btn.style.textAlign = 'left';
            btn.style.border = '2px solid var(--border)';
            btn.style.background = 'white';
            btn.style.padding = '1.25rem';
            btn.style.fontSize = '1.1rem';
            btn.style.borderRadius = 'var(--radius-md)';
            btn.style.transition = 'all 0.2s ease';

            // Hover effect logic handled by CSS usually, but adding mouseover for JS-only constraint safety if CSS missing
            btn.onmouseover = () => {
                btn.style.borderColor = 'var(--primary)';
                btn.style.background = 'var(--secondary)';
            };
            btn.onmouseout = () => {
                btn.style.borderColor = 'var(--border)';
                btn.style.background = 'white';
            };

            btn.textContent = option.text;
            btn.onclick = () => selectOption(option.value);
            optionsContainer.appendChild(btn);
        });
    }

    function selectOption(value) {
        answers[`q${currentQuestion + 1}`] = value;
        currentQuestion++;

        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        questionSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

        const resultTitle = document.getElementById('result-title');
        const resultDesc = document.getElementById('result-desc');
        const resultLink = document.getElementById('result-link');

        // Logic Engine
        let recommendation = calculateRecommendation();

        resultTitle.textContent = recommendation.title;
        // Construct dynamic text
        resultDesc.innerHTML = recommendation.desc;

        resultLink.href = recommendation.link;
        resultLink.textContent = "View My Guide";
    }

    function calculateRecommendation() {
        const fitnessLevel = answers['q1'];
        const goal = answers['q2'];
        const location = answers['q3'];
        const preference = answers['q4'];

        // Rule 1: Nutrition & Recovery
        if (preference === 'nutrition') {
            return {
                title: "Supplements Guide",
                desc: `Since your focus is on <strong>nutrition and recovery</strong> to support your <strong>${goal.replace('_', ' ')}</strong> goal, checking our safe supplement guide is the best start.`,
                link: "/supplements.html"
            };
        }

        // Rule 2: Equipment (Adjustable Dumbbells)
        // If Equip OR NotSure AND (Beginner OR Home)
        if (preference === 'equipment' || preference === 'not_sure') {
            if (fitnessLevel === 'beginner' || location.includes('home')) {
                return {
                    title: "Adjustable Dumbbells",
                    desc: `Based on your goal of <strong>${goal.replace('_', ' ')}</strong> and your <strong>home workout setup</strong>, adjustable dumbbells are the most flexible and cost-effective choice for you.`,
                    link: "/dumbbells/"
                };
            }
        }

        // Rule 3: Equipment (Fixed/Heavy)
        // If (Intermediate OR Advanced) AND Gym
        if ((fitnessLevel === 'intermediate' || fitnessLevel === 'advanced') && location === 'gym') {
            return {
                title: "Advanced Dumbbell Training",
                desc: `As an <strong>${fitnessLevel}</strong> lifter training at a <strong>gym</strong>, you should focus on heavy compound movements using fixed dumbbells.`,
                link: "/dumbbells/"
            };
        }

        // Fallback (Safe Default)
        return {
            title: "Dumbbells Guide",
            desc: "Dumbbells are the most versatile tool to help you reach your goals regardless of your experience level.",
            link: "/dumbbells/"
        };
    }
});
