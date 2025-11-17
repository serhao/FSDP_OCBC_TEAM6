// =================================================================
// 1. QUIZ DATA POOL (defined using quiz-data.js)
// =================================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- STATE VARIABLES ---
    let randomizedQuestions = []; 
    let currentQuestionIndex = 0;
    const totalQuestions = 8;
    const quizOutputContainer = document.getElementById('quiz-output-container'); 
    
    // Variable to track the user's score
    let score = 0; 

    // --- HELPER FUNCTIONS ---
    /** Randomly selects 'count' questions from the pool. */
    function getRandomQuestions(pool, count) {
        // 1. Shuffle the array randomly
        const shuffled = pool.sort(() => 0.5 - Math.random());
        // 2. Select the first 'count' questions (e.g., 8)
        return shuffled.slice(0, count);
    }

    /** Generates the HTML string for a single question */
    function generateQuestionHTML(questionData, index) {
        let optionsHTML = '';
        const radioName = 'investing-q-' + questionData.id; 

        questionData.options.forEach((option, optionIndex) => {
            const answerLetter = String.fromCharCode(65 + optionIndex); 

            optionsHTML += `
                <label class="quiz-option" data-answer="${answerLetter}" data-correct="${option.isCorrect}">
                    <input type="radio" name="${radioName}" value="${answerLetter}">
                    <span class="option-text">${option.text}</span>
                </label>
            `;
        });

        const currentQNumber = index + 1;

        return `
            <section class="quiz-container quiz-page ${index !== currentQuestionIndex ? 'hidden' : ''}" data-q-index="${index}" data-question-id="${questionData.id}">
                <div class="quiz-header">
                    <h3>Question</h3>
                    <span class="quiz-number">${String(currentQNumber).padStart(2, '0')}/${String(totalQuestions).padStart(2, '0')}</span>
                </div>
                <div class="quiz-body">
                    <h4>${currentQNumber}. ${questionData.question}</h4>
                    <form class="quiz-form">
                        <div class="options">
                            ${optionsHTML}
                        </div>
                        <button type="submit" class="submit-button" id="submit-btn-${index}">Submit</button>
                    </form>

                    <div class="feedback-box hidden" id="feedback-result-${index}">
                        <div class="feedback-icon" id="icon-container-${index}"></div>
                        <div class="feedback-content">
                            <h4 class="feedback-title" id="feedback-title-${index}"></h4> 
                            <p class="feedback-explanation" id="feedback-explanation-${index}"></p> 
                        </div>
                        <button class="next-button hidden" id="next-btn-${index}">${currentQNumber < totalQuestions ? 'NEXT' : 'VIEW RESULTS'}</button>
                    </div>
                </div>
            </section>
        `;
    }

    /** Loads and displays the randomized quiz. */
    function loadRandomQuiz() {
        if (typeof quizQuestionPool === 'undefined' || quizQuestionPool.length === 0) {
            quizOutputContainer.innerHTML = '<p style="color: red;">Error: Quiz data (quizQuestionPool) is not loaded. Check your script order.</p>';
            console.error('quizQuestionPool array is undefined or empty.');
            return;
        }
        
        // 1. Get 8 random questions
        randomizedQuestions = getRandomQuestions(quizQuestionPool, totalQuestions);
        
        let quizHTML = '';
        randomizedQuestions.forEach((qData, index) => {
            quizHTML += generateQuestionHTML(qData, index);
        });
        
        quizOutputContainer.innerHTML = quizHTML;
        
        // 2. Attach all event handlers after rendering
        setupEventHandlers();
    }

    function setupEventHandlers() {
        document.querySelectorAll('.quiz-form').forEach(form => {
            form.addEventListener('submit', handleFormSubmission);
        });
        
        document.querySelectorAll('.next-button').forEach(btn => {
            btn.addEventListener('click', handleNextQuestion);
        });
    }

    /** Generates and displays the final results screen. */
    function displayFinalResults() {
        sessionStorage.setItem("pendingRewards", score >= 4 ? score : 0);

        const resultsHTML = `
            <section class="final-results-container quiz-container">
                <div class="quiz-header" style="justify-content: center;">
                    <h3>Quiz Results</h3>
                </div>
                <div class="quiz-body" style="text-align: center;">
                    <h2>Your Score:</h2>
                    <p class="score-display">${String(score).padStart(2, '0')}/${String(totalQuestions).padStart(2, '0')}</p>

                    <div>
                        <p>You have earn ${score >= 4 ? score : 0} of OCBC reward points!</p>
                        <p>Login to claim your reward points or sigun up if you are not an OCBC member yet!</p>
                    </div>

                    <button class="restart-button">
                        <span class="restart-icon">↻</span> Restart Quiz
                    </button>
                </div>
            </section>
        `;

        quizOutputContainer.innerHTML = resultsHTML;

        document.querySelector('.restart-button').addEventListener('click', handleRestartQuiz);
    }

    /** Resets state and loads a new randomized quiz. */
    function handleRestartQuiz() {
        // 1. Reset state variables
        score = 0;
        currentQuestionIndex = 0;
        randomizedQuestions = []; 
        
        // 2. Reload the quiz
        loadRandomQuiz();
    }

    // --- INTERACTION HANDLERS ---
    function handleFormSubmission(event) {
        event.preventDefault();

        const form = event.target;
        const questionSection = form.closest('.quiz-page');
        
        // Retrieve the current question index and data
        const qIndex = parseInt(questionSection.dataset.qIndex);
        const questionData = randomizedQuestions[qIndex]; 

        const selectedOption = form.querySelector('input[type="radio"]:checked');
        if (!selectedOption) {
            alert('Please select an option before submitting.');
            return;
        }

        const selectedLabel = selectedOption.closest('.quiz-option');
        const isCorrect = selectedLabel.dataset.correct === 'true';
        
        // Find the index of the selected option in the original questionData array
        const selectedOptionIndex = Array.from(form.querySelectorAll('input[type="radio"]'))
                                             .findIndex(input => input.checked);

        // Get the actual data object for the selected option
        const selectedOptionData = questionData.options[selectedOptionIndex];

        const feedbackBox = questionSection.querySelector('.feedback-box');
        const feedbackTitle = questionSection.querySelector(`#feedback-title-${qIndex}`); 
        const feedbackExplanation = questionSection.querySelector(`#feedback-explanation-${qIndex}`);
        const nextButton = questionSection.querySelector('.next-button');
        const submitButton = form.querySelector('.submit-button');
        
        const CORRECT_TITLE = 'Correct!';
        const INCORRECT_TITLE = 'Incorrect';
        
        // 1. Disable interaction
        form.querySelectorAll('input[type="radio"]').forEach(radio => radio.disabled = true);
        form.querySelectorAll('.quiz-option').forEach(option => option.style.pointerEvents = 'none');
        submitButton.classList.add('hidden');
        
        // 2. Determine result and apply styling/feedback
        const correctLabel = questionSection.querySelector('.quiz-option[data-correct="true"]');

        if (isCorrect) {
            score++;
            selectedLabel.classList.add('is-correct');

            // Display Correct feedback
            feedbackTitle.textContent = CORRECT_TITLE;
            feedbackExplanation.textContent = questionData.correctFeedback; 
            
            feedbackBox.classList.remove('incorrect', 'hidden');
        } else {
            // Highlight user's incorrect selection
            selectedLabel.classList.add('is-incorrect');
            
            // Highlight the correct answer
            correctLabel.classList.add('is-correct');

            // Display Incorrect feedback
            feedbackTitle.textContent = INCORRECT_TITLE;
            feedbackBox.classList.add('incorrect');

            // Use the specific feedback field from the incorrectly selected option
            feedbackExplanation.textContent = selectedOptionData.feedback;
            
            feedbackBox.classList.remove('hidden');
        }

        // 3. Show next button
        nextButton.classList.remove('hidden');
    }

    function handleNextQuestion(event) {
        const currentSection = event.target.closest('.quiz-page');
        const qIndex = parseInt(currentSection.dataset.qIndex);
        
        if (qIndex < totalQuestions - 1) {
            // Hide current question
            currentSection.classList.add('hidden');
            
            // Show next question
            currentQuestionIndex = qIndex + 1;
            const nextSection = quizOutputContainer.querySelector(`[data-q-index="${currentQuestionIndex}"]`);
            if (nextSection) {
                nextSection.classList.remove('hidden');
            }
        } else {
            currentSection.classList.add('hidden');
            displayFinalResults();
        }
    }
    
    // --- INITIALIZATION ---
    loadRandomQuiz();
});