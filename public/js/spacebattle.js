const delayCharacter = 10;
let gameOver = true;

class Spaceship {
    constructor(name, hull, firepower, accuracy) {
        this.name = name;
        this.hull = hull || (Math.floor(Math.random() * 4) + 3);
        // this.firepower = firepower || (Math.floor(Math.random() * 3) + 2);
        // this.accuracy = accuracy || ((Math.floor(Math.random() * 4) + 5) / 10);
        this.weapons = [
            {name: "Needler", accuracy: .8, firepower: 3}, 
            {name: "Laser Cannon", accuracy: .4, firepower: 8},
            {name: "Disintigration Ray", accuracy: .1, firepower: 100},
        ];
    }

    attack(target) {
        let weapon = this.weapons[Math.floor(Math.random() * this.weapons.length)];
        message += `\n${this.name} fires ${weapon.name}! `;
        if (Math.random() < weapon.accuracy) {
            message += `\n${this.name} hits ${target.name}!`;
            target.hull -= weapon.firepower;
            
        } else {
            message += `\nBad aim. ${this.name} misses ${target.name}!`;
        }
    }
}

///////////////////////// Initializations ////////////////////
const ussAnemone = new Spaceship("USS ANEMONE", hull=20, firepower=10, accuracy=.7);
const alienFleet = [];
const numAlienShips = Math.floor(Math.random() * 5) + 4;
for (let i = 0; i < numAlienShips; i++){
    const alienShip = new Spaceship(`Alien Ship ${i + 1}`);
    alienFleet.push(alienShip);
}

////////////////////// DOM ELEMENTS /////////////////////////
const warReport = document.querySelector('#warReport');


function blinker(){
    const blinky = document.querySelector('#blinky');
    
    const blinkyInterval = setInterval(() => {
        blinky.style.opacity = "0";
        setTimeout(()=> {
            blinky.style.opacity = "100%";
        }, 500);
    },1000);
    
}



function report(message){
    const pastMessage = document.querySelector('.pastMessage')
    if (pastMessage) {
        pastMessage.remove();
    }
    const para = document.createElement('p');
    para.className = "pastMessage";
    warReport.append(para);
    
    let counter = 0;
    const messageInterval = setInterval(() => {
        if (message[counter] !== " ") {
            para.innerText += message[counter];
            counter++
        } else {
            para.innerText += message.slice(counter, counter + 2)
            counter += 2
        }
        if (counter >= message.length) {
            clearInterval(messageInterval);
            const buttons = document.querySelectorAll('button');
            for (let btn of buttons){
                btn.style.opacity = "100%";
            }
        }
    }, delayCharacter);
    messages.push(message)
}



/////////////////////// GAME LOGIC  //////////////////////////

function encounter(ussAnemone, alienFleet){
    gameOver = false;

    const buttonDiv = document.createElement('div')
    buttonDiv.id = "buttonDiv"
    const attackBtn = document.createElement('button')
    attackBtn.id = "attackBtn"
    attackBtn.innerText = "Attack"
    const retreatBtn = document.createElement('button')
    retreatBtn.id = "retreatBtn"
    retreatBtn.innerText = "Retreat"
    document.querySelector('#actions').append(buttonDiv)
    buttonDiv.append(attackBtn)
    attackBtn.addEventListener('click', battleExchange);
    buttonDiv.append(retreatBtn);
    const buttons = document.querySelectorAll('button')

    message = `Alien fleet approaching.\nThere are ${alienFleet.length} ships total.`
    report(message);
}

function battleExchange(){
    const buttons = document.querySelectorAll('button');
    for (let btn of buttons){
        btn.style.opacity = "0";
    };
    message = "";
    if (ussAnemone.hull > 0 && alienFleet.length > 0){
        ussAnemone.attack(alienFleet[0]);
        assessDamage(ussAnemone, alienFleet[0])
        if (alienFleet[0]) {
            alienFleet[0].attack(ussAnemone);
            assessDamage(alienFleet[0], ussAnemone)
        }
    }
    report(message);
    if (gameOver) {
        if (ussAnemone.hull <= 0) {
            message = 'The aliens are victorious. Mankind is doomed.';
        } else {
            message = 'The aliens are defeated. Mankind is saved.';
        }
        report(message);
    }
}

    

function assessDamage(attacker, target){
    if (target.hull <= 0) {
        message += `\n${attacker.name} destroys ${target.name}!`;
        alienFleet.shift();
        message += `\n${alienFleet.length} alien ships remain.`
    } else {
        message += `\n${target.name} has ${target.hull} hull points remaining.`
    }
    if (ussAnemone.hull <= 0 || alienFleet.length === 0){
        gameOver = true;
    }
}

////////////////// THE GAME /////////////////////////////

let message;
const messages = []


blinker();
encounter(ussAnemone, alienFleet);
