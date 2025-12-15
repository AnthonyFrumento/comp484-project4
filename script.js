// global variables
let map;
let currentIndex = 0;
let scoreCorrect = 0;
let startTime = null;
let timerInterval = null;
let gameStarted = false;

// building Coordinates
let locations = [
    {
        name: "Bookstein Hall",
        area: {
            north: 34.242508464535256,
            south: 34.24142778756867,
            east: -118.53004185243029,
            west: -118.53113784429856
        }
    },

    {
        name: "Redwood Hall",
        area: {
            north: 34.24239930587565,
            south: 34.241285879461714,
            east: -118.52557205426888,
            west: -118.52705098305493
        }
    },

    {
        name: "The SRC",
        area: {
            north: 34.24066366416868,
            south: 34.23929914084515,
            east: -118.52467413322017,
            west: -118.52525514095758
        }
    },

    {
        name: "Maple Hall",
        area: {
            north: 34.23785818020527,
            south: 34.23736693798621,
            east: -118.53090676167571,
            west: -118.5315405882983
        }
    },

    {
        name: "Magnolia Hall",
        area: {
            north: 34.23968120960524,
            south: 34.23921181059939,
            east: -118.52810736075924,
            west: -118.52846388823447
        }
    }
];

// update text
const questionTextEl = document.getElementById("question-text");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");

//start button event listener
startBtn.addEventListener("click", function () {
    gameStarted = true;

    questionTextEl.style.display = "block";
    scoreEl.style.display = "block";
    timerEl.style.display = "block";


    startBtn.style.display = "none";

    showQuestion();
    updateScore();
    startTimer();
});

function initMap() {
    // map center
    const csunCenter = { lat: 34.2395, lng: -118.5290 };

    // creates map
    map = new google.maps.Map(document.getElementById("map"), {
        center: csunCenter,
        zoom: 16.7,

        // turns off panning and zooming
        disableDefaultUI: true,
        gestureHandling: "none",
        zoomControl: false,
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,

        // removes labels and icons from the map
        styles: [
            {
                featureType: "all",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "poi",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "poi.business",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "poi.school",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // on start
    showQuestion();
    updateScore();

    // doubleclick listener
    map.addListener("dblclick", function (e) {
        if (!gameStarted) return;

        // gameover
        if (currentIndex >= locations.length) {
            alert("Game over! Reload the page to play again.");
            return;
        }

        // used to determine where dblclick coords are 
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        console.log("Double-click at:", lat, lng);

        checkAnswer(lat, lng);
    });
}

startBtn.addEventListener("click", function () {
  gameStarted = true;

  // Show text and timer
  questionTextEl.style.display = "block";
  scoreEl.style.display = "block";
  timerEl.style.display = "block";
  startBtn.style.display = "none";

  // Hide the start button
  startBtn.style.display = "none";

  // Begin game logic
  showQuestion();
  updateScore();
  startTimer();
});


// shows current question
function showQuestion() {
    const current = locations[currentIndex];
    questionTextEl.textContent = "Double-click on the map where you think " + current.name + " is.";
}

// check if dblclick is correct
function isInsideBox(lat, lng, box) {
    // north = larger, south = smaller
    const withinLat = lat <= box.north && lat >= box.south;
    // east = larger, west = smaller
    const withinLng = lng <= box.east && lng >= box.west;

    return withinLat && withinLng;
}

// colored rectangle for correct area
function drawBox(area, color) {
    new google.maps.Rectangle({
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35,
    map: map,
    bounds: {
        north: area.north,
        south: area.south,
        east: area.east,
        west: area.west
    }
    });
}

// checks answer after dblclick
function checkAnswer(lat, lng) {
    const current = locations[currentIndex];

    if (isInsideBox(lat, lng, current.area)) {
        alert("Correct! That's " + current.name + ".");
        drawBox(current.area, "green");
        scoreCorrect++;
    } else {
        alert("Incorrect. Here's where " + current.name + " is.");
        drawBox(current.area, "red");
    }

    updateScore();
    currentIndex++;

    // next question or finish game
    if (currentIndex < locations.length) {
        showQuestion();
    } else {
        // stop and set final timer text
        stopTimer();
        const finalTimeText = timerEl.textContent.replace("Time: ", "");
        //final prompt
        alert("You got " + scoreCorrect + " out of " + locations.length + " correct!\n" + "Your time: " + finalTimeText);
        questionTextEl.textContent = "Game over! Reload the page to play again.";
    }
}

// score display
function updateScore() {
    scoreEl.textContent = "Score: " + scoreCorrect + " / " + locations.length;
}

// timer
function startTimer() {
    startTime = Date.now();

    // update every second
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (!startTime) return;
    const now = Date.now();
    const diffMs = now - startTime;
    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const minStr = String(minutes).padStart(2, "0");
    const secStr = String(seconds).padStart(2, "0");
    timerEl.textContent = "Time: " + minStr + ":" + secStr;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    startTime = null;
}

// run initmap on reload
window.onload = initMap;
