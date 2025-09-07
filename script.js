const questionParent = document.querySelector(".questions-container");
const optionsParent = document.querySelector(".options-container");
const nextBtn = document.querySelector(".next");
const quitBtn = document.querySelector(".quit");
const quizCategory = document.querySelector(".quiz-category");
const scoreContainer = document.querySelector(".cur-score");
const rules = document.querySelector(".rule-book");
const quizBook = document.querySelector(".quiz");
const playBtn = document.querySelector(".play-btn");
const qnsCount = document.querySelector(".qns-count");
const result = document.querySelector(".result");
const quizType = document.querySelector(".select-quiz-type");
const selectQuizCategory = document.querySelector(".select-quiz-category");
const selectDifficulty = document.querySelector(".select-difficulty");
const confirmBtn = document.querySelector(".confirm-button");
const scienceComputersBtn = document.querySelector(".sc-button");
const generalKnowledgeBtn = document.querySelector(".gk-button");
const sportsBtn = document.querySelector(".sports-button");
const easyBtn = document.querySelector(".easy-button");
const mediumBtn = document.querySelector(".medium-button");
const hardBtn = document.querySelector(".hard-button");


let apiURL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";
let difficultyLevel = "easy";

easyBtn.addEventListener("click", () => {
  easyBtn.classList.add("selected");
  mediumBtn.classList.remove("selected");
  hardBtn.classList.remove("selected");
  difficultyLevel = "easy";
});
mediumBtn.addEventListener("click", () => {
  easyBtn.classList.remove("selected");
  mediumBtn.classList.add("selected");
  hardBtn.classList.remove("selected");  
  difficultyLevel = "medium";
});
hardBtn.addEventListener("click", () => {
  easyBtn.classList.remove("selected");
  mediumBtn.classList.remove("selected");
  hardBtn.classList.add("selected");  
  difficultyLevel = "hard";
});

scienceComputersBtn.addEventListener("click", () => {
  scienceComputersBtn.classList.add("selected");
  generalKnowledgeBtn.classList.remove("selected");
  sportsBtn.classList.remove("selected");  
  if(difficultyLevel == "easy") {
    apiURL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple";
  }
  else if(difficultyLevel == "medium") {
    apiURL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple";
  }
  else if(difficultyLevel == "hard") {
    apiURL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple";
  }
});

generalKnowledgeBtn.addEventListener("click", () => {
  scienceComputersBtn.classList.remove("selected");
  generalKnowledgeBtn.classList.add("selected");
  sportsBtn.classList.remove("selected");   
  if(difficultyLevel == "easy") {
    apiURL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple";
  }
  else if(difficultyLevel == "medium") {    
    apiURL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple";
  }
  else if(difficultyLevel == "hard") {
    apiURL = "https://opentdb.com/api.php?amount=10&category=9&difficulty=hard&type=multiple";
  }
});

sportsBtn.addEventListener("click", () => {
  scienceComputersBtn.classList.remove("selected");
  generalKnowledgeBtn.classList.remove("selected");
  sportsBtn.classList.add("selected");    
  if(difficultyLevel == "easy") {
    apiURL = "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple";
  }
  else if(difficultyLevel == "medium") {
    apiURL = "https://opentdb.com/api.php?amount=10&category=21&difficulty=medium&type=multiple";
  }
  else if(difficultyLevel == "hard") {
    apiURL = "https://opentdb.com/api.php?amount=10&category=21&difficulty=hard&type=multiple";
  }
});

let quizzes = [];
let currentQuestion = 0;
let score = 0;

const getJson = async (apiURL) => {
  try {
    const {
      data: { results },
    } = await axios.get(apiURL);
    return results;
  } 
  catch (err) {
    console.log(err);
  }
};

const getData = async () => {
  quizzes = await getJson(apiURL);
};

getData();

playBtn.addEventListener("click", () => {
  quizType.classList.remove("hide");
  rules.classList.add("hide");
});

confirmBtn.addEventListener("click", async () => {
  quizBook.classList.remove("hide");
  quizType.classList.add("hide");

  quizzes = await getJson(apiURL);

  currentQuestion = 0;
  score = 0;
  questionParent.innerText = "";
  optionsParent.innerText = "";

  console.log(quizzes);
  console.log(quizzes.length);

  createQuestionAndOptions(quizzes, currentQuestion);
});

function createQuestionAndOptions(quizzes, index) {  
    qnsCount.innerText = `Q${currentQuestion+1}/${quizzes.length}`;
    scoreContainer.innerText = `Score: ${score}`;
    quizCategory.innerText = quizzes[currentQuestion].category;
    
    const questionEle = document.createElement("p");
    questionEle.innerText = `Q${currentQuestion + 1}: ${
        quizzes[currentQuestion].question
    }`;
    questionParent.appendChild(questionEle);
    let options = [
        quizzes[currentQuestion].correct_answer, 
        ...quizzes[currentQuestion].incorrect_answers
    ].sort(() => Math.random() - 0.5);

    for(let option of options) {
        const optionBtn = document.createElement("button");
        optionBtn.classList.add("button");
        optionBtn.setAttribute("name", option);
        optionBtn.innerText = option;
        optionsParent.appendChild(optionBtn);
    }
}

nextBtn.addEventListener("click", () => {
    if (nextBtn.innerText === "Next") {
        currentQuestion++;
        console.log({currentQuestion});
        questionParent.innerText = "";
        optionsParent.innerText = "";
        qnsCount.innerText = `Q${currentQuestion + 1}/${quizzes.length}`;
        createQuestionAndOptions(quizzes, currentQuestion);
        if (currentQuestion === quizzes.length-1) {
            nextBtn.innerText = "Submit";
            return;
        }
    }
    if (nextBtn.innerText === "Submit") {
        console.log("here");
        quizBook.classList.add("hide");
        result.classList.remove("hide");
        result.innerText = `Your Score: ${score}`
    }
});

quitBtn.addEventListener("click", () => {
  currentQuestion = 0;
  questionParent.innerText = "";
  optionsParent.innerText = "";
  score = 0;
  createQuestionAndOptions(quizzes, currentQuestion);
  rules.classList.remove("hide");
  quizBook.classList.add("hide");
});

function disableOptions() {
    document
        .querySelectorAll(".button")
        .forEach((button) => button.setAttribute("disabled", true));
}

optionsParent.addEventListener("click", (e) => {
    if(e.target.name == quizzes[currentQuestion].correct_answer) {
        e.target.classList.add("success");
        score++;
        scoreContainer.innerText = `Score: ${score}`;
    }
    else {
        e.target.classList.add("error");
    }
    disableOptions();
});