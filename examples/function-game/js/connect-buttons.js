/*******************************************************************************
Hook up EventHandlers functions for on-screen movement buttons
*******************************************************************************/
let buttonLeft = document.getElementById('left');
buttonLeft.onclick = reactToMoveLeftButton;
let buttonRight = document.getElementById('right');
buttonRight.onclick = reactToMoveRightButton;
let buttonDown = document.getElementById('down');
buttonDown.onclick = reactToMoveDownButton;
let buttonUp = document.getElementById('up');
buttonUp.onclick = reactToMoveUpButton;

/*******************************************************************************
Hook up EventHandlers functions for on-screen jumping movement buttons
*******************************************************************************/
let buttonJumpUp = document.getElementById('jump-up');
buttonJumpUp.onclick = reactToJumpUpButton;
let buttonJumpDown = document.getElementById('jump-down');
buttonJumpDown.onclick = reactToJumpDownButton;
let buttonJumpRight = document.getElementById('jump-right');
buttonJumpRight.onclick = reactToJumpRightButton;
let buttonJumpLeft = document.getElementById('jump-left');
buttonJumpLeft.onclick = reactToJumpLeftButton;

/*******************************************************************************
Hook up EventHandlers functions for other buttons
*******************************************************************************/
let buttonAttack = document.getElementById('attack');
buttonAttack.onclick = reactToAttackButton;
let buttonJump = document.getElementById('jump');
buttonJump.onclick = reactToJumpButton;

/*******************************************************************************
Hook up anonymous EventHandler function for keyboard key presses
*******************************************************************************/
window.onkeydown = function(event) {
    switch(event.key) {
        case "ArrowDown":
        case "s":
            reactToMoveDownButton();
            break;
        case "ArrowUp":
        case "w":
            pressMoveUpButton();
            break;
        case "ArrowRight":
        case "d":
            pressMoveRightButton();
            break;
        case "ArrowLeft":
        case "a":
            pressMoveLeftButton();
            break;
        case "S":
            pressJumpDownButton();
            break;
        case "W":
            pressJumpUpButton();
            break;
        case "D":
            pressJumpRightButton();
            break;
        case "A":
            pressJumpLeftButton();
            break;
        case " ":
            pressAttackButton();
            break;
    }
}
