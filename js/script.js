import userMessages from '../lang/messages/en/user.js';

class Button {
    constructor(order) {
        this.order = order;
        this.btn = document.createElement("button");
        this.btn.id = this.order;
        this.btn.style.backgroundColor = this.getRandomColor();
        this.btn.style.width = "10em";
        this.btn.textContent = this.order;
        this.btn.style.fontSize = "x-large";
        this.btn.style.height = "5em";
        this.btn.style.position = "relative";
        document.getElementById("gameSpace").appendChild(this.btn);
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

class ButtonManager {
    constructor() {
        this.buttons = [];
        this.targetButton = 1;
    }

    async generateAllButtons(n) {
        for(let i = 0; i < n; ++i) {
            this.buttons.push(new Button(i+1));
        }

        await this.sleep(this.buttons.length * 1000);
        this.randomizeLocations(n);

        this.repeatShuffle(n);
    }

    async repeatShuffle(n) {
        for(let i = 0; i < n; ++i) {
            await this.sleep(2000);
            this.randomizeLocations(n);
        }

        for(let i = 0; i < n; ++i) {
            this.initializeButtonListener(document.getElementById(i+1))
        }
    }

    initializeButtonListener(button) {
        button.textContent = "";
        button.addEventListener('click', () => {
            this.checkTarget(button);
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    randomizeLocations(n) {
        for(let i = 0; i < n; ++i) {
            let butt = document.getElementById(i+1);
            butt.style.position = "absolute";
            let top = Math.floor(Math.random() * 70);
            let left = Math.floor(Math.random() * 70); 
            butt.style.top = top + "%";
            butt.style.left = left + "%";
        }
    }

    checkTarget(button) {
        if(button.id == this.targetButton) {
            button.textContent = button.id;
            this.targetButton++;
            if(button.id == this.buttons.length) {
                document.getElementById("correct").style.visibility = "visible";
                document.getElementById("start-btn").disabled = false;
            }
        } else {
            document.getElementById("wrong").style.visibility = "visible";
            document.getElementById("start-btn").disabled = false;
            for(let i = 0; i < this.buttons.length; i++) {
                let btn = document.getElementById(i+1);
                btn.textContent = btn.id;
            }
        }
    }
}

class Game {
    constructor(numOfButtons) {
        this.numOfButtons = numOfButtons;
        this.startBtn = document.getElementById('start-btn');
        this.buttonManager = new ButtonManager();
        this.initializeEventListener();
        document.getElementById("wrong").innerHTML = userMessages.wrong;
        document.getElementById("correct").innerHTML = userMessages.correct;
    }

    initializeEventListener() {
        this.startBtn.addEventListener('click', () => {
            document.getElementById("wrong").style.visibility = "hidden";
            document.getElementById("correct").style.visibility = "hidden";
            for(let i = 0; i < this.buttonManager.buttons.length; i++) {
                document.getElementById(i+1).remove();
            }
            this.buttonManager.buttons = [];
            this.buttonManager.targetButton = 1;
            const inputValue = document.getElementById('gameQ').value;
            if(this.checkValidInput(inputValue)) {
                this.numOfButtons = inputValue;
                this.buttonManager.generateAllButtons(this.numOfButtons);
                document.getElementById("start-btn").disabled = true;
            }
        });
    }
    
    checkValidInput(val) {
        if (val < 3 || val > 7) {
            return false;
        } else 
            return true;
    }
}

let G = new Game;
