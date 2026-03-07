import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFHsdytND92wprIoIYpY4ps5y6RsMGF34",
  authDomain: "piii-6bdd2.firebaseapp.com",
  databaseURL:
    "https://piii-6bdd2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "piii-6bdd2",
  storageBucket: "piii-6bdd2.firebasestorage.app",
  messagingSenderId: "55657566199",
  appId: "1:55657566199:web:3820d9e646bbe33af428f2",
  measurementId: "G-G7H5WE5Y7T",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const auth = getAuth(app);
const usersListRef = ref(db, "users");

const CIPHERED_PI =
  "MTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQzMzgzMjc5NTAyODg0MTk3MTY5Mzk5Mzc1MTA1ODIwOTc0OTQ0NTkyMzA3ODE2NDA2Mjg2MjA4OTk4NjI4MDM0ODI1MzQyMTE3MDY3OTgyMTQ4MDg2NTEzMjgyMzA2NjQ3MDkzODQ0NjA5NTUwNTgyMjMxNzI1MzU5NDA4MTI4NDgxMTE3NDUwMjg0MTAyNzAxOTM4NTIxMTA1NTU5NjQ0NjIyOTQ4OTU0OTMwMzgxOTY0NDI4ODEwOTc1NjY1OTMzNDQ2MTI4NDc1NjQ4MjMzNzg2NzgzMTY1MjcxMjAxOTA5MTQ1NjQ4NTY2OTIzNDYwMzQ4NjEwNDU0MzI2NjQ4MjEzMzkzNjA3MjYwMjQ5MTQxMjczNzI0NTg3MDA2NjA2MzE1NTg4MTc0ODgxNTIwOTIwOTYyODI5MjU0MDkxNzE1MzY0MzY3ODkyNTkwMzYwMDExMzMwNTMwNTQ4ODIwNDY2NTIxMzg0MTQ2OTUxOTQxNTExNjA5NDMzMDU3MjcwMzY1NzU5NTkxOTUzMDkyMTg2MTE3MzgxOTMyNjExNzkzMTA1MTE4NTQ4MDc0NDYyMzc5OTYyNzQ5NTY3MzUxODg1NzUyNzI0ODkxMjI3OTM4MTgzMDExOTQ5MTI5ODMzNjczMzYyNDQwNjU2NjQzMDg2MDIxMzk0OTQ2Mzk1MjI0NzM3MTkwNzAyMTc5ODYwOTQzNzAyNzcwNTM5MjE3MTc2MjkzMTc2NzUyMzg0Njc0ODE4NDY3NjY5NDA1MTMyMDAwNTY4MTI3MTQ1MjYzNTYwODI3Nzg1NzcxMzQyNzU3Nzg5NjA5MTczNjM3MTc4NzIxNDY4NDQwOTAxMjI0OTUzNDMwMTQ2NTQ5NTg1MzcxMDUwNzkyMjc5Njg5MjU4OTIzNTQyMDE5OTU2MTEyMTI5MDIxOTYwODY0MDM0NDE4MTU5ODEzNjI5Nzc0NzcxMzA5OTYwNTE4NzA3MjExMzQ5OTk5OTk4MzcyOTc4MDQ5OTUxMDU5NzMxNzMyODE2MDk2MzE4NTk1MDI0NDU5NDU1MzQ2OTA4MzAyNjQyNTIyMzA4MjUzMzQ0Njg1MDM1MjYxOTMxMTg4MTcxMDEwMDAzMTM3ODM4NzUyODg2NTg3NTMzMjA4MzgxNDIwNjE3MTc3NjY5MTQ3MzAzNTk4MjUzNDkwNDI4NzU1NDY4NzMxMTU5NTYyODYzODgyMzUzNzg3NTkzNzUxOTU3NzgxODU3NzgwNTMyMTcxMjI2ODA2NjEzMDAxOTI3ODc2NjExMTk1OTA5MjE2NDIwMTk4OTM4MDk1MjU3MjAxMDY1NDg1ODYzMjc4ODY1OTM2MTUzMzgxODI3OTY4MjMwMzAxOTUyMDM1MzAxODUyOTY4OTk1NzczNjIyNTk5NDEzODkxMjQ5NzIxNzc1MjgzNDc5MTMxNTE1NTc0ODU3MjQyNDU0MTUwNjk1OTUwODI5NTMzMTE2ODYxNzI3ODU1ODg5MDc1MDk4MzgxNzU0NjM3NDY0OTM5MzE5MjU1MDYwNDAwOTI3NzAxNjcxMTM5MDA5ODQ4ODI0MDEyODU4MzYxNjAzNTYzNzA3NjYwMTA0NzEwMTgxOTQyOTU1NTk2MTk4OTQ2NzY3ODM3NDQ5NDQ4MjU1Mzc5Nzc0NzI2ODQ3MTA0MDQ3NTM0NjQ2MjA4MDQ2Njg0MjU5MDY5NDkxMjkzMzEzNjc3MDI4OTg5MTUyMTA0NzUyMTYyMDU2OTY2MDI0MDU4MDM4MTUwMTkzNTExMjUzMzgyNDMwMDM1NTg3NjQwMjQ3NDk2NDczMjYzOTE0MTk5MjcyNjA0MjY5OTIyNzk2NzgyMzU0NzgxNjM2MDA5MzQxNzIxNjQxMjE5OTI0NTg2MzE1MDMwMjg2MTgyOTc0NTU1NzA2NzQ5ODM4NTA1NDk0NTg4NTg2OTI2OTk1NjkwOTI3MjEwNzk3NTA5MzAyOTU1MzIxMTY1MzQ0OTg3MjAyNzU1OTYwMjM2NDgwNjY1NDk5MTE5ODgxODM0Nzk3NzUzNTY2MzY5ODA3NDI2NTQyNTI3ODYyNTUxODE4NDE3NTc0NjcyODkwOTc3NzcyNzkzODAwMDgxNjQ3MDYwMDE2MTQ1MjQ5MTkyMTczMjE3MjE0NzcyMzUwMTQxNDQxOTczNTY4NTQ4MTYxMzYxMTU3MzUyNTUyMTMzNDc1NzQxODQ5NDY4NDM4NTIzMzIzOTA3Mzk0MTQzMzM0NTQ3NzYyNDE2ODYyNTE4OTgzNTY5NDg1NTYyMDk5MjE5MjIyMTg0MjcyNTUwMjU0MjU2ODg3NjcxNzkwNDk0NjAxNjUzNDY2ODA0OTg4NjI3MjMyNzkxNzg2MDg1Nzg0MzgzODI3OTY3OTc2NjgxNDU0MTAwOTUzODgzNzg2MzYwOTUwNjgwMDY0MjI1MTI1MjA1MTE3MzkyOTg0ODk2MDg0MTI4NDg4NjI2OTQ1NjA0MjQxOTY1Mjg1MDIyMjEwNjYxMTg2MzA2NzQ0Mjc4NjIyMDM5MTk0OTQ1MDQ3MTIzNzEzNzg2OTYwOTU2MzY0MzcxOTE3Mjg3NDY3NzY0NjU3NTczOTYyNDEzODkwODY1ODMyNjQ1OTk1ODEzMzkwNDc4MDI3NTkwMDk5NDY1NzY0MDc4OTUxMjY5NDY4Mzk4MzUyNTk1NzA5ODI1ODIyNjIwNTIyNDg5NDA3NzI2NzE5NDc4MjY4NDgyNjAxNDc2OTkwOTAyNjQwMTM2Mzk0NDM3NDU1MzA1MDY4MjAzNDk2MjUyNDUxNzQ5Mzk5NjUxNDMxNDI5ODA5MTkwNjU5MjUwOTM3MjIxNjk2NDYxNTE1NzA5ODU4Mzg3NDEwNTk3ODg1OTU5NzcyOTc1NDk4OTMwMTYxNzUzOTI4NDY4MTM4MjY4NjgzODY4OTQyNzc0MTU1OTkxODU1OTI1MjQ1OTUzOTU5NDMxMDQ5OTcyNTI0NjgwODQ1OTg3MjczNjQ0Njk1ODQ4NjUzODM2NzM2MjIyNjI2MDk5MTI0NjA4MDUxMjQzODg0MzkwNDUxMjQ0MTM2NTQ5NzYyNzgwNzk3NzE1NjkxNDM1OTk3NzAwMTI5NjE2MDg5NDQxNjk0ODY4NTU1ODQ4NDA2MzUzNDIyMDcyMjI1ODI4NDg4NjQ4MTU4NDU2MDI4NTA2MDE2ODQyNzM5NDUyMjY3NDY3Njc4ODk1MjUyMTM4NTIyNTQ5OTU0NjY2NzI3ODIzOTg2NDU2NTk2MTE2MzU0ODg2MjMwNTc3NDU2NDk4MDM1NTkzNjM0NTY4MTc0MzI0MTEyNTE1MDc2MDY5NDc5NDUxMDk2NTk2MDk0MDI1MjI4ODc5NzEwODkzMTQ1NjY5MTM2ODY3MjI4NzQ4OTQwNTYwMTAxNTAzMzA4NjE3OTI4NjgwOTIwODc0NzYwOTE3ODI0OTM4NTg=";

const PI = atob(CIPHERED_PI).split("").join("");

const CLASSES = [
  "9.a",
  "9.ajtp",
  "9.b",
  "9.c",
  "9.d",
  "10.a",
  "10.b",
  "10.c",
  "10.d",
  "10.e",
  "11.a",
  "11.b",
  "11.c",
  "11.d",
  "11.e",
  "12.a",
  "12.b",
  "12.c",
  "12.d",
  "12.e",
  "Tanár",
];

const MAX_LIVES = 3;

const loginElement = document.getElementById("login");
const digitsElement = document.getElementById("digits");
const rankingElement = document.getElementById("ranking");
const startInfos = document.getElementById("start-infos");
const nameInput = document.getElementById("nameInput");
const classInput = document.getElementById("classInput");
const startButton = document.getElementById("start-button");
const livesElement = document.getElementById("lives");
const endWindowElement = document.getElementById("end-window");
const loginStartDiv = document.getElementById("login-start");
const loginLeaderboardDiv = document.getElementById("login-leaderboard");
const loginLoginDiv = document.getElementById("login-login");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const loginButton = document.getElementById("login-button");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const leaderboard1 = document.getElementById("leaderboard-1");
const endName = document.getElementById("end-name");
const endDigits = document.getElementById("end-digits");
const endTime = document.getElementById("end-time");
const endNext = document.getElementById("end-next");
const endRank = document.getElementById("end-rank");

// ─── State ───────────────────────────────────────────────────────────────────

let currentIndex = 0;
let scores = [];
let startDate;
let player;
let inputDisabled = true;
let lifeCount = MAX_LIVES;

startButton.disabled = true;
loginLoginDiv.style.display = "none";

createLivesElements();
createClassOptions();

nameInput.addEventListener("change", handleInputChange);
classInput.addEventListener("change", handleInputChange);
startButton.addEventListener("click", handleStart);
loginBtn.addEventListener("click", showLoginForm);
logoutBtn.addEventListener("click", logout);
loginButton.addEventListener("click", login);

document.querySelectorAll(".exit-end").forEach((el) => {
  el.addEventListener("click", showStartScreen);
});

document.querySelectorAll(".btn-leaderboard").forEach((btn) => {
  btn.addEventListener("click", () => {
    window.location.href = "./leaderboard/";
  });
});

document.addEventListener("keydown", (event) => {
  if (inputDisabled) return;
  const k = event.key;
  if (k >= "0" && k <= "9") {
    if (k === PI[currentIndex]) {
      digitsElement.textContent += k;
      currentIndex++;
    } else if (lifeCount > 1) {
      loseLife();
    } else {
      handleEnd();
    }
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    showStartScreen();
  } else {
    showLoginScreen();
  }
});

onValue(usersListRef, (snapshot) => {
  scores = [];
  snapshot.forEach((childSnapshot) => {
    scores.push(childSnapshot.val());
  });
  scores.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    return scoreDiff !== 0 ? scoreDiff : a.time - b.time;
  });
  updateLeaderboardUI();
  handleInputChange();
});

function writePlayerData() {
  const newPlayerRef = push(usersListRef);
  set(newPlayerRef, player);
}

function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  if (!email || !password) return;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      showStartScreen();
    })
    .catch((error) => {
      alert("Hiba a bejelentkezésnél:\n" + error.message);
    });
}

function logout() {
  const isConfirmed = confirm("Biztosan ki akar jelentkezni?");
  if (!isConfirmed) return;

  signOut(auth).catch((error) => {
    alert("Hiba a kijelentkezésnél:\n" + error.message);
  });
}

function handleStart() {
  player = {
    name: nameInput.value,
    class: classInput.value,
    time: 0,
    score: 0,
  };

  currentIndex = 0;
  startDate = new Date();
  lifeCount = MAX_LIVES;

  showSessionScreen();
}

function handleEnd() {
  const currentDate = new Date();
  player.score = currentIndex;
  player.time = currentDate - startDate;

  writePlayerData();
  showEndScreen();
}

function loseLife() {
  document.getElementById("life" + lifeCount).textContent = "💔";
  triggerErrorFlash();
  lifeCount--;
}

function triggerErrorFlash() {
  document.body.animate(
    [
      { backgroundColor: "white" },
      { backgroundColor: "#ffcccc", offset: 0.5 },
      { backgroundColor: "white" },
    ],
    { duration: 300, iterations: 1, easing: "ease-out" },
  );
}

function handleInputChange() {
  let name = nameInput.value;
  const cClass = classInput.value;

  name = name.trim().replace(/\s+/g, " ");
  nameInput.value = name;

  const maxLength = 60;
  const hungarianNameRegex = /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s\.\-]+$/;

  if (
    cClass === "" ||
    name === "" ||
    name.length > maxLength ||
    !hungarianNameRegex.test(name)
  ) {
    startButton.disabled = true;
    return;
  }

  const alreadyExists = scores.some(
    (s) => s.name === name && s.class === cClass,
  );
  startButton.disabled = alreadyExists;
}

function updateLeaderboardUI() {
  rankingElement.innerHTML = "";
  const topScores = scores.slice(0, 5);

  for (let i = 0; i < topScores.length; i++) {
    const row = document.createElement("tr");

    const cells = [
      i + 1 + ".",
      topScores[i].name,
      topScores[i].class,
      topScores[i].score,
      getFormattedTime(topScores[i].time),
    ];

    for (const text of cells) {
      const td = document.createElement("td");
      td.textContent = text;
      row.appendChild(td);
    }

    rankingElement.appendChild(row);
  }
}

function getFormattedTime(elapsed) {
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const milliseconds = Math.floor(elapsed % 1000);
  return minutes + (seconds < 10 ? ":0" : ":") + seconds + "." + milliseconds;
}

function createLivesElements() {
  for (let i = 0; i < MAX_LIVES; i++) {
    const newElement = document.createElement("div");
    newElement.classList.add("life");
    newElement.id = "life" + (i + 1);
    newElement.textContent = "❤️";
    livesElement.appendChild(newElement);
  }
}

function createClassOptions() {
  for (const cls of CLASSES) {
    const option = document.createElement("option");
    option.value = cls;
    option.textContent = cls;
    classInput.appendChild(option);
  }
}

function showLoginForm() {
  loginStartDiv.style.display = "none";
  loginLeaderboardDiv.style.display = "none";
  loginLoginDiv.style.display = "flex";
}

function showLoginScreen() {
  nameInput.value = "";
  classInput.value = "";

  loginStartDiv.style.display = "flex";
  loginLeaderboardDiv.style.display = "flex";
  loginLoginDiv.style.display = "none";
  loginElement.style.display = "flex";
  startInfos.style.display = "none";
  digitsElement.style.display = "none";
  livesElement.style.display = "none";
  endWindowElement.style.display = "none";
  leaderboard1.style.display = "none";
  logoutBtn.style.display = "none";
  inputDisabled = true;
}

function showStartScreen() {
  nameInput.value = "";
  classInput.value = "";

  loginElement.style.display = "none";
  startInfos.style.display = "block";
  digitsElement.style.display = "none";
  livesElement.style.display = "none";
  endWindowElement.style.display = "none";
  leaderboard1.style.display = "block";
  logoutBtn.style.display = "block";
  inputDisabled = true;
}

function showSessionScreen() {
  digitsElement.innerHTML = "3.";

  startInfos.style.display = "none";
  digitsElement.style.display = "block";
  livesElement.style.display = "flex";
  endWindowElement.style.display = "none";
  logoutBtn.style.display = "none";
  inputDisabled = false;
}

function showEndScreen() {
  endName.textContent = player.name + " " + player.class;
  endDigits.textContent = player.score;
  endTime.textContent = getFormattedTime(player.time);
  endNext.textContent = PI[currentIndex];

  const rankIndex = scores.findIndex(
    (s) => s.name === player.name && s.class === player.class,
  );
  endRank.textContent = rankIndex !== -1 ? rankIndex + 1 : "N/A";

  endWindowElement.style.display = "block";
  startInfos.style.display = "none";
  digitsElement.style.display = "none";
  livesElement.style.display = "none";
}
