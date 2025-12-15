// global variables
let map;
let currentIndex = 0;
let scoreCorrect = 0;

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
            north: 34.24268311809622,
            south: 34.24223556762081,
            east: -118.52610024312102,
            west: -118.52715662082537
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

// updates text on the html page
const questionTextEl = document.getElementById("question-text");
const scoreEl = document.getElementById("score");

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

    // shows first question
    showQuestion();
    updateScore();

    // doubleclick listener
    map.addListener("dblclick", function (e) {
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
        alert("You got " + scoreCorrect + " out of " + locations.length + " correct!");
        questionTextEl.textContent = "Game over!";
    }
}

// score display
function updateScore() {
    scoreEl.textContent = "Score: " + scoreCorrect + " / " + locations.length;
}

// run initmap on reload
window.onload = initMap;
