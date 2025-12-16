const title = document.getElementById("title");
const answers = document.getElementById("answers");
const timer = document.getElementById("timer");
const next = document.getElementById("next");
const test = document.querySelector(".test");

const questions = [
    { q: "Для чего можно использовать JavaScript?", a: ["Для программ", "Для событий", "Для динамики", "Все варианты верны"], c: 3 },
    { q: "Где выполняется JavaScript?", a: ["На сервере", "В браузере", "В ОС", "В БД"], c: 1 },
    { q: "Как объявить переменную?", a: ["var", "let", "const", "Все варианты"], c: 3 },
    { q: "Какой тип данных лишний?", a: ["string", "number", "boolean", "float"], c: 3 },
    { q: "Как вывести сообщение?", a: ["alert()", "prompt()", "console.log()", "Все"], c: 3 },
    { q: "Что такое DOM?", a: ["Модель документа", "База данных", "Язык", "Фреймворк"], c: 0 },
    { q: "Как получить элемент?", a: ["getElementById", "querySelector", "getElementsByClassName", "Все"], c: 3 },
    { q: "Событие клика?", a: ["hover", "click", "press", "tap"], c: 1 },
    { q: "Что делает localStorage?", a: ["Хранит данные", "Удаляет данные", "Шифрует", "Ничего"], c: 0 },
    { q: "JSON — это?", a: ["Формат", "Язык", "БД", "API"], c: 0 },
    { q: "Какой цикл существует?", a: ["for", "while", "do..while", "Все"], c: 3 },
    { q: "JavaScript — это?", a: ["Компилируемый", "Интерпретируемый", "Машинный", "Ассемблер"], c: 1 }
];

let userName = localStorage.getItem("userName");

if (!userName || userName === "null") 
{
    userName = prompt("Введите ваше имя:");
    
    if (!userName || userName.trim() === "") 
    {
        userName = "Студент";
    }
    
    localStorage.setItem("userName", userName);
}

let current = Number(localStorage.getItem("current")) || 0;
let correct = Number(localStorage.getItem("correct")) || 0;

if (current >= questions.length) 
{
    current = 0;
    correct = 0;
    localStorage.setItem("current", 0);
    localStorage.setItem("correct", 0);
}

let time = 20;
let intervalId = null;

function load() 
{
    clearInterval(intervalId);
    next.disabled = true;

    const q = questions[current];
    title.textContent = q.q;
    
    answers.innerHTML = "";

    const counter = document.createElement("p");
    counter.className = "step";
    counter.textContent = "Вопрос " + (current + 1) + " из " + questions.length;
    answers.appendChild(counter);

    q.a.forEach((text, index) => 
    {
        const label = document.createElement("label");
        label.className = "option";
        label.innerHTML = `
            <input type="radio" name="answer" value="${index}">
            <span class="text">${text}</span>
        `;

        const input = label.querySelector("input");
        input.onchange = () => 
        {
            next.disabled = false;
        };

        answers.appendChild(label);
    });

    time = 20;
    startTimer();
}

function startTimer() 
{
    timer.textContent = "Осталось: " + time + " сек";

    intervalId = setInterval(() => 
    {
        time--;
        timer.textContent = "Осталось: " + time + " сек";

        if (time <= 0) 
        {
            clearInterval(intervalId);
            nextQuestion();
        }
    }, 1000);
}

function nextQuestion() 
{
    clearInterval(intervalId);
    const selected = document.querySelector("input[name='answer']:checked");

    if (selected && Number(selected.value) === questions[current].c) 
    {
        correct++;
    }

    current++;
    localStorage.setItem("current", current);
    localStorage.setItem("correct", correct);

    if (current >= questions.length) 
    {
        finish();
    } 
    else 
    {
        load();
    }
}

function finish() 
{
    clearInterval(intervalId);
    const percent = Math.round((correct / questions.length) * 100);

    test.innerHTML = `
        <div class="result">
            <h2>Результаты теста</h2>
            <p>Пользователь: <b>${userName}</b></p>
            <p>Правильных ответов: <b>${correct}</b> из ${questions.length}</p>
            <p>Процент выполнения: <b>${percent}%</b></p>
            <button class="reload-btn" onclick="resetTest()">Начать заново</button>
        </div>
    `;

    localStorage.removeItem("current");
    localStorage.removeItem("correct");
}

function resetTest()
{
    localStorage.clear();
    location.reload();
}

next.addEventListener("click", nextQuestion);

load();