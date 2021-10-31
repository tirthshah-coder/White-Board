let optionsContainer = document.querySelector(".options-container");
let toolsContainer = document.querySelector(".tools-container");
let pencilToolContainer = document.querySelector(".pencil-tool-container");
let eraserToolContainer = document.querySelector(".eraser-tool-container");

let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let optionFlag = true;
let pencilFlag = false;
let eraserFlag = false;

optionsContainer.addEventListener("click", (e) => {
    optionFlag = !optionFlag;
    if(optionFlag)
        openTools();
    else 
        closeTools();
})

function openTools(){
    let iconElem = optionsContainer.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsContainer.style.display = "flex";
}

function closeTools(){
    let iconElem = optionsContainer.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");
    toolsContainer.style.display = "none";

    pencilToolContainer.style.display = "none";
    eraserToolContainer.style.display = "none";
}

pencil.addEventListener("click", (e) => {
    pencilFlag = !pencilFlag;
    if(pencilFlag) 
        pencilToolContainer.style.display = "block";
    else
        pencilToolContainer.style.display = "none";
})

eraser.addEventListener("click", (e) => {
    eraserFlag = !eraserFlag;
    if(eraserFlag)
        eraserToolContainer.style.display = "flex";
    else
        eraserToolContainer.style.display = "none";
})

upload.addEventListener("click", (e) => {
    // Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="header-container">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="content-container">
            <img src="${url}"/>
        </div>
         `;

        createStickyNotes(stickyTemplateHTML);
    })
})


sticky.addEventListener("click", (e) => {
    let stickyTemplateHTML = `
    <div class="header-container">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="content-container">
        <textarea spellcheck='false'></textarea>
    </div>
    `;

    createStickyNotes(stickyTemplateHTML);
})

function createStickyNotes(stickyTemplateHTML){
    let stickyToolContainer = document.createElement("div"); 
    stickyToolContainer.setAttribute("class", "sticky-tool-container");
    stickyToolContainer.innerHTML = stickyTemplateHTML;

    document.body.appendChild(stickyToolContainer);

    let minimizeBtn = stickyToolContainer.querySelector(".minimize");
    let removeBtn = stickyToolContainer.querySelector(".remove");
    
    noteActions(minimizeBtn, removeBtn, stickyToolContainer);

    stickyToolContainer.onmousedown = function(e){
        dragAndDrop(stickyToolContainer, e);
    }

    stickyToolContainer.ondragstart = function () {
        return false;
    };
}

function noteActions(minimizeBtn, removeBtn, stickyToolContainer){    
    removeBtn.addEventListener("click", (e) => {
        stickyToolContainer.remove();
    })

    minimizeBtn.addEventListener("click", (e) => {
        let content = stickyToolContainer.querySelector(".content-container");

        let displayProp = getComputedStyle(content).getPropertyValue("display");

        if(displayProp === "none")
            content.style.display = "block";
        else
            content.style.display = "none";
    })
}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the element, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}