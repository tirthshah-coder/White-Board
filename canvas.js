let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilWidthElement = document.querySelector(".pencil-width");
let eraserWidthElement = document.querySelector(".eraser-width");
let pencilColors = document.querySelectorAll(".pencil-color");

let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let isMouseDown = false;
let pencilColor = "black";
let pencilWidth = pencilWidthElement.value;
let eraserColor = "white";
let eraserWidth = eraserWidthElement.value;

let undoTrackerArr = [];
let undoTrackIdx = 0;
let redoTrackerArr = [];
let redoTrackIdx = 0;

let trackIdx = 0;
let undoRedoTrackerArr = [];
let canvasUrl;

// API
let tool = canvas.getContext("2d");
tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;

// When mouse click pressed 
canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    // When click, position of its x and y coordinates
    beginPath({
        x: e.clientX,   
        y: e.clientY
    })
})

// Move mouse -> fill path but only when its mouse clicked pressed
canvas.addEventListener("mousemove", (e) => {
    if(isMouseDown){
        drawStroke({
            x: e.clientX,   
            y: e.clientY
        })
    }
})

// When mouse click released
canvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;

    canvasUrl = canvas.toDataURL();
    undoRedoTrackerArr.push(canvasUrl);
    trackIdx = undoRedoTrackerArr.length - 1;
    // undoTrackerArr.push(url);
    // console.log(undoTrackerArr.length);
    // redoTrackerArr.push(url);
    // undoTrackIdx = undoTrackerArr.length - 1;
    // redoTrackIdx = redoTrackerArr.length - 1;
})

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y); // starting pt
}

function drawStroke(strokeObj){
    tool.lineTo(strokeObj.x, strokeObj.y); // ending pt
    tool.stroke();
}

pencilColors.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        pencilColor = color;
        tool.strokeStyle = pencilColor;
    })
})

pencilWidthElement.addEventListener("change", (e) => {
    pencilWidth = pencilWidthElement.value;
    tool.lineWidth = pencilWidth;
})

eraserWidthElement.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElement.value;
    tool.lineWidth = eraserWidth;
})

// If eraser not then by default pencil should be selected
eraser.addEventListener("click", (e) => {
    if(eraserFlag){
        tool.strokeStyle = eraserColor; // white
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilWidth;
    }
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

// redo.addEventListener("click", (e) => {
//     if(redoTrackIdx <= redoTrackerArr.length - 1){
//         redoTrackIdx++;
//     }

//     let dataObj = {
//         redoTrackIdx,
//         redoTrackerArr
//     }

//     tool.clearRect(0, 0, canvas.width, canvas.height);
//     redoUI(dataObj);
// })

// undo.addEventListener("click", (e) => {
//     console.log("clicked");
//     if(undoTrackIdx >= 0){
//         undoTrackerArr.pop();
//         undoTrackIdx--;
//     } 
    
//     let dataObj = {
//         undoTrackIdx,
//         undoTrackerArr
//     }
//     tool.clearRect(0, 0, canvas.width, canvas.height);
//     undoUI(dataObj);
// })

// function undoUI(trackObj){
//     undoTrackIdx = trackObj.undoTrackIdx;
//     undoTrackerArr = trackObj.undoTrackerArr;
//     let url = undoTrackerArr[undoTrackIdx];
//     let img = new Image(); 
//     img.src = url;
//     img.onload = (e) => {
//         // img, st (x,y), end(x,y)
//         tool.drawImage(img, 0, 0, canvas.width, canvas.height);
//     }
// }

// function redoUI(trackObj){
//     redoTrackIdx = trackObj.redoTrackIdx;
//     redoTrackerArr = trackObj.redoTrackerArr;
//     let url = redoTrackerArr[redoTrackIdx];
//     let img = new Image(); 
//     img.src = url;
//     img.onload = (e) => {
//         // img, st (x,y), end(x,y)
//         tool.drawImage(img, 0, 0, canvas.width, canvas.height);
//     }
// }

redo.addEventListener("click", (e) => {
    if(trackIdx <= undoRedoTrackerArr.length - 1){
        undoRedoTrackerArr.push(canvasUrl);
        trackIdx++;
    }

    let dataObj = {
        trackIdx,
        undoRedoTrackerArr
    }

    tool.clearRect(0, 0, canvas.width, canvas.height);
    undoRedoUI(dataObj);
})

undo.addEventListener("click", (e) => {
    if(trackIdx >= 0){
        undoRedoTrackerArr.pop();
        trackIdx--;
    } 
    
    let dataObj = {
        trackIdx,
        undoRedoTrackerArr
    }
    tool.clearRect(0, 0, canvas.width, canvas.height);
    undoRedoUI(dataObj);
})

// UI Change Canvas
function undoRedoUI(trackObj){
    trackIdx = trackObj.trackIdx;
    undoRedoTrackerArr = trackObj.undoRedoTrackerArr;
    let url = undoRedoTrackerArr[trackIdx];
    let img = new Image(); 
    img.src = url;
    img.onload = (e) => {
        // img, st (x,y), end(x,y)
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}
