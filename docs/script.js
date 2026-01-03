let questions = [];
let wrongNotes = JSON.parse(localStorage.getItem("wrongNotes")) || [];

/* 화면 전환 */
function showScreen(id) {
  document.querySelectorAll("section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "flex";
}

function goMenu() {
  showScreen("menu-screen");
}

/* CSV 자동 로드 */
fetch("question.csv")
  .then(res => res.text())
  .then(text => {
    const lines = text.trim().split("\n").slice(1);
    questions = lines.map(line => {
      const [subject, unit, question, choices, answer] = line.split(",");
      return { subject, unit, question, choices, answer };
    });
  });

/* 문제 풀기 */
function startQuiz() {
  showScreen("study-screen");
  showRandomQuestion();
}

function showRandomQuestion() {
  const q = questions[Math.floor(Math.random() * questions.length)];

  document.getElementById("content").innerHTML = `
    <h3>[${q.subject}] ${q.unit}</h3>
    <p>${q.question}</p>
    <p>${q.choices}</p>
    <button onclick="submitAnswer('${q.answer}')">정답 입력</button>
  `;
}

function submitAnswer(correct) {
  const user = prompt("정답을 입력하세요");
  if (user !== correct) {
    alert("❌ 오답!");
    wrongNotes.push(correct);
    localStorage.setItem("wrongNotes", JSON.stringify(wrongNotes));
  } else {
    alert("⭕ 정답!");
  }
  showRandomQuestion();
}

/* 문제 전체 보기 */
function viewAll() {
  showScreen("study-screen");
  document.getElementById("content").innerHTML =
    questions.map(q =>
      `<p>📘 [${q.subject}] ${q.unit} - ${q.question}</p>`
    ).join("");
}

/* 오답 보기 */
function viewWrong() {
  showScreen("study-screen");
  document.getElementById("content").innerHTML =
    wrongNotes.length
      ? wrongNotes.map(w => `<p>❌ 오답: ${w}</p>`).join("")
      : "<p>🎉 오답이 없습니다!</p>";
}
