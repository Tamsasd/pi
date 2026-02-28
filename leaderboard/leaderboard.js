import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const usersListRef = ref(db, "users");

const homeBtn = document.querySelector(".primary-btn");

homeBtn.addEventListener("click", () => {
  window.location.href = "../";
});

onValue(usersListRef, (snapshot) => {
  scores = [];

  snapshot.forEach((childSnapshot) => {
    scores.push(childSnapshot.val());
  });

  scores.sort((a, b) => {
    let s = b.score - a.score;
    if (s !== 0) return s;
    else return a.time - b.time;
  });

  updateMainLeaderboard();
  updateMaxLeastTime();
  updateCumulated();
  updateTopClass();
});

function getFormattedTime(elapsed) {
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const milliseconds = Math.floor(elapsed % 1000);
  return minutes + (seconds < 10 ? ":0" : ":") + seconds + "." + milliseconds;
}

const rankMain = document.getElementById("rank-main");
const rankTopSumClass = document.getElementById("rank-top-sum-class");
const rankTopAvgClass = document.getElementById("rank-top-avg-class");
const rankTopCountClass = document.getElementById("rank-top-count-class");
const rankLeastTime = document.getElementById("rank-least-time");
const rankMostTime = document.getElementById("rank-most-time");
const rankFastestTime = document.getElementById("rank-fastest-speed");

const cumSumDigits = document.getElementById("cum-sum-digits");
const cumAvgDigits = document.getElementById("cum-avg-digits");
const cumSumTime = document.getElementById("cum-sum-time");
const cumAvgTime = document.getElementById("cum-avg-time");
const cumCountClasses = document.getElementById("cum-count-classes");
const cumCountPlayers = document.getElementById("cum-count-players");
let scores = [];

function updateMainLeaderboard() {
  rankMain.innerHTML = "";
  for (let i = 0; i < scores.length; i++) {
    const rank = document.createElement("td");
    rank.textContent = i + 1 + ".";
    const name = document.createElement("td");
    name.textContent = scores[i].name;
    const score = document.createElement("td");
    score.textContent = scores[i].score;
    const cClass = document.createElement("td");
    cClass.textContent = scores[i].class;
    const time = document.createElement("td");
    time.textContent = getFormattedTime(scores[i].time);

    const row = document.createElement("tr");
    row.appendChild(rank);
    row.appendChild(name);
    row.appendChild(cClass);
    row.appendChild(score);
    row.appendChild(time);

    rankMain.appendChild(row);
  }
}

function updateMaxLeastTime() {
  rankMostTime.innerHTML = "";
  rankLeastTime.innerHTML = "";
  let mostTimeIndex = 0;
  let leastTimeIndex = 0;
  let fastestTimeIndex = 0;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i].time > scores[mostTimeIndex].time) mostTimeIndex = i;
    else if (scores[i].time < scores[leastTimeIndex].time) leastTimeIndex = i;
    if (
      scores[i].score / scores[i].time >
      scores[fastestTimeIndex].score / scores[fastestTimeIndex].time
    )
      fastestTimeIndex = i;
  }

  const leastTimeName = document.createElement("td");
  leastTimeName.textContent = scores[leastTimeIndex].name;
  const leastTimeClass = document.createElement("td");
  leastTimeClass.textContent = scores[leastTimeIndex].class;
  const leastTimeTime = document.createElement("td");
  leastTimeTime.textContent = getFormattedTime(scores[leastTimeIndex].time);

  const mostTimeName = document.createElement("td");
  mostTimeName.textContent = scores[mostTimeIndex].name;
  const mostTimeClass = document.createElement("td");
  mostTimeClass.textContent = scores[mostTimeIndex].class;
  const mostTimeTime = document.createElement("td");
  mostTimeTime.textContent = getFormattedTime(scores[mostTimeIndex].time);

  const fastestTimeName = document.createElement("td");
  fastestTimeName.textContent = scores[fastestTimeIndex].name;
  const fastestTimeClass = document.createElement("td");
  fastestTimeClass.textContent = scores[fastestTimeIndex].class;
  const fastestTimeTime = document.createElement("td");
  fastestTimeTime.textContent = (
    (scores[fastestTimeIndex].score / scores[fastestTimeIndex].time) *
    1000
  ).toFixed(3);

  const leastTimeRow = document.createElement("tr");
  leastTimeRow.appendChild(leastTimeName);
  leastTimeRow.appendChild(leastTimeClass);
  leastTimeRow.appendChild(leastTimeTime);

  const mostTimeRow = document.createElement("tr");
  mostTimeRow.appendChild(mostTimeName);
  mostTimeRow.appendChild(mostTimeClass);
  mostTimeRow.appendChild(mostTimeTime);

  const fastestTimeRow = document.createElement("tr");
  fastestTimeRow.appendChild(fastestTimeName);
  fastestTimeRow.appendChild(fastestTimeClass);
  fastestTimeRow.appendChild(fastestTimeTime);

  rankLeastTime.appendChild(leastTimeRow);
  rankMostTime.appendChild(mostTimeRow);
  rankFastestTime.appendChild(fastestTimeRow);
}

function updateCumulated() {
  let timeSum = 0;
  let scoreSum = 0;
  let scoreCount = scores.length;
  for (let i = 0; i < scoreCount; i++) {
    timeSum += scores[i].time;
    scoreSum += scores[i].score;
  }

  // !! cumCountClasses is upgraded in updateTopClass() !!
  cumSumDigits.textContent = scoreSum;
  cumAvgDigits.textContent = scoreSum / scoreCount;
  cumSumTime.textContent = getFormattedTime(timeSum);
  cumAvgTime.textContent = getFormattedTime(Math.floor(timeSum / scoreCount));
  cumCountPlayers.textContent = scores.length;
}

function updateTopClass() {
  if (scores.length === 0) return;

  const classes = new Map();
  for (let i = 0; i < scores.length; i++) {
    const className = scores[i].class;

    if (!classes.has(className)) {
      classes.set(className, { timeSum: 0, scoreSum: 0, entryCount: 0 });
    }

    const currentStats = classes.get(className);

    classes.set(className, {
      timeSum: currentStats.timeSum + scores[i].time,
      scoreSum: currentStats.scoreSum + scores[i].score,
      entryCount: currentStats.entryCount + 1,
    });
  }

  const sortedClasses = Array.from(classes.entries()).sort((a, b) => {
    const statsA = a[1];
    const statsB = b[1];

    let s = statsB.scoreSum - statsA.scoreSum;
    if (s !== 0) return s;
    return statsA.timeSum - statsB.timeSum;
  });

  cumCountClasses.textContent = sortedClasses.length;

  const topClassName = sortedClasses[0][0];
  const topClassStats = sortedClasses[0][1];

  rankTopSumClass.innerHTML = "";

  const topSumClassClass = document.createElement("td");
  topSumClassClass.textContent = topClassName;
  const topSumClassScore = document.createElement("td");
  topSumClassScore.textContent = topClassStats.scoreSum;

  const topSumClassRow = document.createElement("tr");
  topSumClassRow.appendChild(topSumClassClass);
  topSumClassRow.appendChild(topSumClassScore);

  rankTopSumClass.appendChild(topSumClassRow);

  const avgSortedClasses = Array.from(classes.entries()).sort((a, b) => {
    const statsA = a[1];
    const statsB = b[1];

    let s =
      statsB.scoreSum / statsB.entryCount - statsA.scoreSum / statsA.entryCount;
    if (s !== 0) return s;
    return statsA.timeSum - statsB.timeSum;
  });

  const topAvgClassName = avgSortedClasses[0][0];
  const topAvgClassStats = avgSortedClasses[0][1];

  rankTopAvgClass.innerHTML = "";

  const topAvgClassClass = document.createElement("td");
  topAvgClassClass.textContent = topAvgClassName;
  const topAvgClassScore = document.createElement("td");
  topAvgClassScore.textContent = topAvgClassStats.scoreSum;

  const topAvgClassRow = document.createElement("tr");
  topAvgClassRow.appendChild(topAvgClassClass);
  topAvgClassRow.appendChild(topAvgClassScore);

  rankTopAvgClass.appendChild(topAvgClassRow);

  // asodiuzagsiduzgasiudzasd

  const countSortedClasses = Array.from(classes.entries()).sort((a, b) => {
    const statsA = a[1];
    const statsB = b[1];

    let s = statsB.entryCount - statsA.entryCount;
    if (s !== 0) return s;
    s = statsB.scoreSum - statsA.scoreSum;
    if (s !== 0) return s;
    return statsA.timeSum - statsB.timeSum;
  });

  const topCountClassName = countSortedClasses[0][0];
  const topCountClassStats = countSortedClasses[0][1];

  rankTopCountClass.innerHTML = "";

  const topCountClassClass = document.createElement("td");
  topCountClassClass.textContent = topCountClassName;
  const topCountClassScore = document.createElement("td");
  topCountClassScore.textContent = topCountClassStats.entryCount;

  const topCountClassRow = document.createElement("tr");
  topCountClassRow.appendChild(topCountClassClass);
  topCountClassRow.appendChild(topCountClassScore);

  rankTopCountClass.appendChild(topCountClassRow);
}
