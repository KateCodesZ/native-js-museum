let currentQuestions = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let scoreChart;

document.addEventListener("DOMContentLoaded", () => {
  // Load questions from the JSON file
  fetch("data/questions.json")
    .then((response) => response.json())
    .then((data) => {
      currentQuestions = data.questions;

      // Check if sessionStorage has quiz data
      if (sessionStorage.getItem("quizData")) {
        const quizData = JSON.parse(sessionStorage.getItem("quizData"));
        currentQuestion = quizData.currentQuestion;
        score = quizData.score;
        userAnswers = quizData.userAnswers;
      }

      loadQuestion(); // Load the first or current question
    });

  document.getElementById("restart-btn").addEventListener("click", restartTest);
});

function loadQuestion() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = ""; // Clear previous question

  if (currentQuestion < currentQuestions.length) {
    const card = document.createElement("div");
    card.className = "quiz--card card";

    const headerElement = document.createElement("div");
    headerElement.className = "header";

    const progressElement = document.createElement("div");
    progressElement.className = "progress-indicator";
    progressElement.textContent = `Question ${currentQuestion + 1} of ${
      currentQuestions.length
    }`;

    const questionElement = document.createElement("div");
    questionElement.className = "question";
    questionElement.textContent = currentQuestions[currentQuestion].question;

    const imageElement = document.createElement("img");
    imageElement.src = currentQuestions[currentQuestion].image;
    imageElement.alt = "Question Image";
    imageElement.style.width = "100%";

    headerElement.appendChild(progressElement);
    headerElement.appendChild(questionElement);
    headerElement.appendChild(imageElement);

    const options = document.createElement("div");
    options.className = "options";

    const answerKeys = Object.keys(currentQuestions[currentQuestion].answers);
    answerKeys.forEach((key) => {
      const button = document.createElement("button");
      button.textContent = key;

      button.onclick = () => {
        handleButtonAnswer(
          currentQuestions[currentQuestion].answers[key],
          key,
          card
        );
      };
      options.appendChild(button);
    });

    card.appendChild(headerElement);
    card.appendChild(options);
    container.appendChild(card);
  } else {
    showScore();
  }

  // Save current state to sessionStorage
  saveQuizData();
}

function handleButtonAnswer(isCorrect, selectedAnswer, card) {
  userAnswers.push({
    question: currentQuestions[currentQuestion].question,
    selectedAnswer,
    correctAnswer: getCorrectAnswer(),
    isCorrect,
  });

  const buttons = card.querySelectorAll(".options button");
  buttons.forEach((button) => {
    if (button.textContent === selectedAnswer) {
      button.style.backgroundColor = isCorrect ? "#1b998b" : "#cc444b";
      button.style.color = "white";
    }
  });

  if (isCorrect) {
    score++;
  }

  card.classList.add("fade-out");

  setTimeout(() => {
    card.remove();
    currentQuestion++;
    loadQuestion();
  }, 300);

  // Save current state to sessionStorage
  saveQuizData();
}

function getCorrectAnswer() {
  return Object.keys(currentQuestions[currentQuestion].answers).find(
    (key) => currentQuestions[currentQuestion].answers[key]
  );
}

function showScore() {
  const container = document.getElementById("quiz-container");
  container.style.display = "none";

  const scoreContainer = document.getElementById("score-container");
  const scoreMessage = document.getElementById("score-message");

  const percentage = (score / currentQuestions.length) * 100;
  let message;

  if (percentage === 100) {
    message = "Perfect! You're a genius!";
  } else if (percentage >= 70) {
    message = "Great job! You really know your stuff.";
  } else {
    message = "Not bad! Keep practicing your art skills.";
  }

  scoreMessage.textContent = `You scored ${score} out of ${currentQuestions.length}. ${message}`;

  // Destroy the existing chart
  if (scoreChart) {
    scoreChart.destroy();
  }

  // Create the doughnut chart
  const ctx = document.getElementById("score-chart").getContext("2d");
  scoreChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Correct", "Incorrect"],
      datasets: [
        {
          data: [score, currentQuestions.length - score],
          backgroundColor: ["#1B998B", "#CC444B"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });

  scoreContainer.style.display = "block";
  // Clear sessionStorage at the end of the quiz
  sessionStorage.removeItem("quizData");
}

function restartTest() {
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  loadQuestion();
  document.getElementById("quiz-container").style.display = "flex";
  document.getElementById("score-container").style.display = "none";
  // Save reset state to sessionStorage
  saveQuizData();
}

// Save quiz state to sessionStorage
function saveQuizData() {
  const quizData = {
    currentQuestion,
    score,
    userAnswers,
  };
  sessionStorage.setItem("quizData", JSON.stringify(quizData));
}
