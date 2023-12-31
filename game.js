
// Boss Class
class Boss {
    constructor(name, xPosition, yPosition, question, answer) {
        this.name = name;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.question = question;
        this.answer = answer;
    }
}

// Random Boss Generator
function getNewBoss(name, question, answer) {
    var xPosition = Math.floor(Math.random() * background.offsetWidth);
    var yPosition = Math.floor(Math.random() * background.offsetHeight);
    return new Boss(name, xPosition, yPosition, question, answer);
}


window.onload = function() {
    var hero = document.getElementById('hero');
    var background = document.getElementById('background');
    var game = document.getElementById('game');
    var baseheroSpeed = 20;
    var basebackgroundSpeed = 10;
    var buffer = 50;

    var spriteWidth = 256; // width of a single sprite
    var spriteHeight = 256; // height of a single sprite
    var spriteCount = 0;
    var direction = {
        'down': 0,
        'up': 1,
        'left': 2,
        'right': 3
    };

    var xpElement = document.getElementById('xp');
    var heroXp = 0; // the hero's XP starts at 0


    var inBattle = false; // Add this global variable


    // This will hold all of the bosses in the game
    var bosses = [];
    var currentBoss = null;


    var num_bosses = 20
    // Assuming your CSV file is hosted at 'https://example.com/myfile.csv'
    fetch('https://raw.githubusercontent.com/VincentZuo/Code/main/catgame.csv')
        .then(response => response.text())
        .then(data => {
            var results = Papa.parse(data, {
                header: true,
                dynamicTyping: true
            }).data;
            console.log("results parsed ", results)

            // Now results is an array of objects, where each object is a row from the CSV file
            // Each object has properties corresponding to the column names in the CSV file

            // You can create the bosses here, using the data from the CSV file
            results.forEach(row => {
                let randomBoss = getNewBoss(row.Id, row.question, row.answer);
                bosses.push(randomBoss); // Add the boss to the bosses array
                // ... rest of your boss creation code ...''
                console.log("randomBoss created ", randomBoss)
                var bossElement = document.createElement('div');
                bossElement.classList.add('boss');
                bossElement.style.left = randomBoss.xPosition + 'px';
                bossElement.style.top = randomBoss.yPosition + 'px';
                bossElement.id = randomBoss.name;

            // Add the boss to the game
            document.getElementById('background').appendChild(bossElement);
            animateBoss(bossElement);

            });
        })
        .catch(error => console.error('Error:', error));



    // for (let i = 0; i < num_bosses; i++) {
    //     // Generate a new boss
    //     var aboss = bosses[i]
    //         console.log("a boss selected ", aboss)

    //     // Create the boss element
    //     var bossElement = document.createElement('div');
    //     bossElement.classList.add('boss');
    //     bossElement.style.left = aboss.xPosition + 'px';
    //     bossElement.style.top = aboss.yPosition + 'px';
    //     bossElement.id = aboss.name;

    //     // Add the boss to the game
    //     document.getElementById('background').appendChild(bossElement);
    //     animateBoss(bossElement);
    // }
    // Boss sprite dimensions
    var bossSpriteWidth = 300;
    var bossSpriteHeight = 300;

    // Animation function
    function animateBoss(boss) {
        var bossSpriteCount = 0;

        setInterval(function() {
            bossSpriteCount = (bossSpriteCount + 1) % 4; // Assuming there are 4 frames in your sprite sheet
            var backgroundX = '-' + (bossSpriteCount * bossSpriteWidth) + 'px';
            boss.style.backgroundPosition = backgroundX + ' ' + '0px'; // Assuming animation is in a single row
        }, 200); // Change sprite every 500ms
    }



    // Store the latest keydown event
    var latestKeyDownEvent = null;
    document.onkeydown = function(e) {
        latestKeyDownEvent = e || window.event;
        if (e.keyCode == '16') { // the key code for Shift is 16
            shiftPressed = true;
        }
        latestKeyDownEvent = e;
    };

    // Keyup event
    var shiftPressed = false;
    document.onkeyup = function(e) {
        e = e || window.event;
        if (e.keyCode == '16') {
            shiftPressed = false;
        }
    };


    function moveHero() {
        // If there has been a keydown event, check it
        if (latestKeyDownEvent !== null) {
            checkKey(latestKeyDownEvent);
            // Reset the latest keydown event
            latestKeyDownEvent = null;
        }

        // Request the next frame
        requestAnimationFrame(moveHero);
    }

    function initiateBattle(boss) {
        // Set the question for this boss
        document.getElementById('question').innerText = currentBoss.question;
        console.log(currentBoss);

        // Show the battle screen
        document.getElementById('battle').style.display = 'block';
    }


    function checkKey(e) {
        e = e || window.event;

        if (inBattle) {
            return; // Do nothing if in battle
        }

        var heroPosition = hero.getBoundingClientRect();
        var gamePosition = game.getBoundingClientRect();

        var logicalHeroLeft = hero.getBoundingClientRect().left / 0.5;


        var bgLeft = parseInt(window.getComputedStyle(background).getPropertyValue('left'), 10);
        var bgTop = parseInt(window.getComputedStyle(background).getPropertyValue('top'), 10);

        spriteCount = (spriteCount + 1) % 4; // Assuming there are 4 frames in your sprite sheet

        var backgroundX = '-' + (spriteCount * spriteWidth) + 'px';
        var backgroundY = '0px';

        // In your moveHero function, you can set the speed dynamically
        var heroSpeed = shiftPressed ? baseheroSpeed * 3 : baseheroSpeed;
        var backgroundSpeed = shiftPressed ? basebackgroundSpeed * 3 : basebackgroundSpeed;
        console.log("shiftPressed ", shiftPressed)


        if (e.keyCode == '39') {
            // right arrow
            backgroundY = '-' + (direction['right'] * spriteHeight) + 'px';
            backgroundX = '-' + (spriteCount * spriteWidth) + 'px';
            hero.style.backgroundPosition = backgroundX + ' ' + backgroundY;

            // console.log("before logic")
            // console.log(hero.style.left, game.style.left)            
            // console.log(heroPosition.left, gamePosition.left)            

            if (heroPosition.right < gamePosition.right - buffer) {
                hero.style.left = (heroPosition.left - gamePosition.left + heroSpeed) + 'px';
            } else if (bgLeft - backgroundSpeed > gamePosition.left - background.offsetWidth + gamePosition.width && bgLeft - backgroundSpeed + background.offsetWidth > gamePosition.right) {  
                background.style.left = (bgLeft - backgroundSpeed) + 'px';
            } else if (heroPosition.right + heroSpeed < gamePosition.right) {
                hero.style.left = (heroPosition.left - gamePosition.left + heroSpeed) + 'px';
            }
        } else if (e.keyCode == '37') {
            // left arrow
            backgroundY = '-' + (direction['left'] * spriteHeight) + 'px';
            backgroundX = '-' + (spriteCount * spriteWidth) + 'px';
            hero.style.backgroundPosition = backgroundX + ' ' + backgroundY;

            if (heroPosition.left > gamePosition.left + buffer) {
                hero.style.left = (heroPosition.left - gamePosition.left - heroSpeed) + 'px';
            } else if (bgLeft + backgroundSpeed < gamePosition.left && bgLeft + backgroundSpeed + background.offsetWidth > gamePosition.left) {
                background.style.left = (bgLeft + backgroundSpeed) + 'px';
            } else if (heroPosition.left - heroSpeed > gamePosition.left) {
                hero.style.left = (heroPosition.left - gamePosition.left - heroSpeed) + 'px';
            }
        } else if (e.keyCode == '38') {
            // up arrow
            backgroundY = '-' + (direction['up'] * spriteHeight) + 'px';
            backgroundX = '-' + (spriteCount * spriteWidth) + 'px';
            hero.style.backgroundPosition = backgroundX + ' ' + backgroundY;

            if (heroPosition.top > gamePosition.top + buffer) {
                hero.style.top = (heroPosition.top - gamePosition.top - heroSpeed) + 'px';
            } else if (
                bgTop + backgroundSpeed < gamePosition.top) {
                background.style.top = (bgTop + backgroundSpeed) + 'px';
            } else if (heroPosition.top - heroSpeed > gamePosition.top) {
                hero.style.top = (heroPosition.top - gamePosition.top - heroSpeed) + 'px';
            }

        } else if (e.keyCode == '40') {
            // down arrow
            backgroundY = '-' + (direction['down'] * spriteHeight) + 'px';
            backgroundX = '-' + (spriteCount * spriteWidth) + 'px';
            hero.style.backgroundPosition = backgroundX + ' ' + backgroundY;

            if (heroPosition.bottom < gamePosition.bottom - buffer) {
                hero.style.top = (heroPosition.top - gamePosition.top + heroSpeed) + 'px';
            } else if (
                bgTop - backgroundSpeed + background.offsetHeight > gamePosition.top + gamePosition.height &&
                bgTop - backgroundSpeed + background.offsetHeight > gamePosition.bottom) {
                background.style.top = (bgTop - backgroundSpeed) + 'px';
            } else if (heroPosition.bottom + heroSpeed < gamePosition.bottom) {
                hero.style.top = (heroPosition.top - gamePosition.top + heroSpeed) + 'px';
            }
        }

        if (e.keyCode == '32') {
            // spacebar pressed
            for (var boss of bosses) {
                var bossElement = document.getElementById(boss.name);
                var bossPosition = bossElement.getBoundingClientRect();

                if (Math.abs(heroPosition.left - bossPosition.left) < 100 && 
                    Math.abs(heroPosition.top - bossPosition.top) < 100) {
                    // The hero is close to a boss
                    
                    // Initiate battle
                    currentBoss = boss;
                    initiateBattle(boss);
                    inBattle = true;
                    break;
                }
            }
        }
    }

    document.getElementById('answer').addEventListener('keydown', function(e) {
        if (e.keyCode == '13') {
            // Enter key was pressed
            var answer = document.getElementById('answer').value;
            
            // Check if the answer is correct
            if (answer == currentBoss.answer) {
                // Answer is correct, increase XP
                heroXp += 10;
                document.getElementById('xp').innerText = 'XP: ' + heroXp;
            }
            
            // Remove the boss
            var bossElement = document.getElementById(currentBoss.name);
            bossElement.parentNode.removeChild(bossElement);
            bosses = bosses.filter(item => item !== currentBoss);

            // Hide the battle screen
            document.getElementById('battle').style.display = 'none';
            inBattle = false;
        }
    });


    // Start the animation loop
    moveHero();
}
