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
    var xp = 0; // the hero's XP starts at 0


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


    function checkKey(e) {
        e = e || window.event;

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
    }

    // Start the animation loop
    moveHero();
}
