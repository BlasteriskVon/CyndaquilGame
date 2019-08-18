$(document).ready(function() {
    /*
    CORRESPONDING SIZES:
        size = 6: height = 8em
        size = 12: height = 4em
    */
    var size; //how many blocks there will be. the grid's dimensions will be size * size
    var blockHeight; //height attributed to each block. directly corresponds to the size to ensure the overall grid can fit without scrolling
    var getPower = false; //checks if the user ever got the power up for the first time (becomes true after the first time)
    var readyForShoot = 0;
    var alt = 0;
    var alwaysWhite = 0;
    var alwaysBlack = 1;
    var cynday, cyndax, game, cakey, cakex, sparkyx, sparkyy;
    var state = "default";
    var direction = "right";
    var sparkSpawn = 0;
    var sparkChange = false;
    var gridPattern;
    var haveBorder;
    var didTheFireHitSomething = false;
    $("#twelve").on("click", function(){
        size = 12;
        blockHeight = 4;
        gridOptions();
    });

    $("#six").on("click", function(){
        size = 6;
        blockHeight = 8;
        gridOptions();
    });

    function altBlackWhite(x){
        if(x === 2){
            return alt;
        } else if(x === 1){
            return alwaysBlack;
        } else if(x === 0){
            return alwaysWhite;
        }
    }
    function gridOptions() {
        $(".container").empty();
        var gRow = $("<div>");
        gRow.attr("class", "row rowOne");
        $(".container").append(gRow);
        var gCol1 = $("<div>");
        gCol1.attr("class", "col-md-6 moreInstructions");
        $(".rowOne").append(gCol1);
        var instructions = $("<div>");
        instructions.text("Alright! Now just click one of the following options to decide what grid pattern you would like!");
        $(".moreInstructions").append(instructions);
        var gCol2 = $("<div>");
        gCol2.attr("class", "col-md-6 buttons");
        $(".rowOne").append(gCol2);

        var checkers = $("<button>");
        checkers.attr("id", "2");
        checkers.attr("style", "width:100%");
        checkers.text("Play Game with Checkered Board!");
        $(".buttons").append(checkers); //this button will make the checkered board pattern

        var whiteBlackBorder = $("<button>");
        whiteBlackBorder.attr("id", "0");
        whiteBlackBorder.attr("style", "width:100%");
        whiteBlackBorder.text("Play Game with a White Board!");
        $(".buttons").append(whiteBlackBorder); //this button will make a white board with black borders

        var blackWhiteBorder = $("<button>");
        blackWhiteBorder.attr("id", "1");
        blackWhiteBorder.attr("style", "width:100%");
        blackWhiteBorder.text("Play Game with a Black Board!");
        $(".buttons").append(blackWhiteBorder); //this button will make a black board with white borders

        $("#2").on("click", function(){ //checkered!
            gridPattern = 2;
            haveBorder = "";
            startGame();
        });

        $("#1").on("click", function(){ //black with white border!
            gridPattern = 1;
            haveBorder = "border-style: solid; ";
            startGame();
        });

        $("#0").on("click", function(){ //white with black border!
            gridPattern = 0;
            haveBorder = "border-style: solid; ";
            startGame();
        });
    }
    function startGame() {

    $(".container").empty();
    function blackWhite(x){
        if(x === 0){
            alt++;
            return "white";
        } else {
            alt--;
            return "black";
        }
    }

    function whiteBlack(x){
        if(x === 0){
            return "black";
        } else {
            return "white";
        }
    }

    function atSide() {
        if ((cynday < 0)||(cyndax < 0)){
            if(cynday < 0) {
                cynday = size-1;
            } else {
                cyndax = size-1;
            }
        }
        if((cynday >= size)||(cyndax >= size)){
            if(cynday >= size) {
                cynday = 0;
            } else {
                cyndax = 0;
            }
        }
    }

    function setGame(){
        cynday = 0;
        cyndax = 0;
        game = true;
        sparkChange = false;
        state = "default";
        direction = "right";
        resetStage();
        alert("Cyndaquil wants some cake! Use the arrow keys and go to the cake to make him happy!");
        if(sparkSpawn === 1){
            alert("What's this? A new power is unlocked! Go to the power sphere for Cyndaquil to transform!");
        }
        if(readyForShoot === 1){
            alert("Your power has been upgraded! Now in addition to the standing fireball, you can press A to fire a fireball that fires across the map!");
            readyForShoot++;
        }
        cakey = Math.floor(Math.random() * size);
        cakex = Math.floor(Math.random() * size);
        spark.attr("src", "assets/images/sparky.gif");

        if(cakey === 0){
            if(cakex === 0){
                cakex++;
            }
        }
        if(sparkSpawn > 0){
            do {
                sparkyx = Math.floor(Math.random() * size);
                sparkyy = Math.floor(Math.random() * size);
            } while ((sparkyy + sparkyx === 0) || ((sparkyy === cakey) && (sparkyx === cakex)));
            //the above code should force the values of sparkyx and sparkyy to be randomized until the coordinates of sparky is neither (0,0) nor matches the cake
            $(document.getElementById("(" + sparkyy + "," + sparkyx + ")")).append(spark);
        }
        cyndaquil.attr("style", "width:100%; height:100%");
        $(document.getElementById("(" + cynday + "," + cyndax + ")")).append(cyndaquil);
        cyndaquil.attr("src", "assets/images/" + state + "-" + direction + cyndaType()); //setting up the cyndaquil!
        $(document.getElementById("(" + cakey + "," + cakex + ")")).append(cake); //settiing up the cake!
    }

    for(var i = 0;i < size;i++){ //creating the board
        var newRow = $("<div>");
        var nexti = i+1
        var previ = i-1;
        var colSize = 12/size;
        newRow.addClass("row " + nexti);
        for(var j = 0;j < size;j++){
            if(j===0){ //checks if it is the start of a row
                if(i%2 === 1){ //checks if i is odd
                    alt = 1;
                } else {
                    alt = 0;
                }
            }
            var newBlock = $("<div>"); //creates the div element
            newBlock.addClass("col-md-" + colSize); //makes the class col-md-1 so it should be 12x12
            newBlock.attr("style","width: 100%; height: " + blockHeight + "em; " + haveBorder + "border-color: " + whiteBlack(altBlackWhite(gridPattern)) + "; background-color: " + blackWhite(altBlackWhite(gridPattern))); //should be black and white
            newBlock.attr("id", "(" + i + "," + j + ")"); //sets coordinates like (0,1)
            newBlock.attr("onFire","false");
            newRow.append(newBlock);
        }
        $(".container").append(newRow);
    }
    var cyndaquil = $("<img>");
    cyndaquil.attr("class","cynda"); //setting up cyndaquil
    cyndaquil.attr("id","cyndaquil");
    
    var cake = $("<img>");
    cake.attr("src", "assets/images/cake.png");
    cake.attr("id","cake"); //adding id for cake 
    cake.attr("style", "width:100%; height:auto"); //setting up cake

    var spark = $("<img>");
    spark.attr("style", "width:100%; height:100%"); //setting up spark


    $(document).keyup(function(event) {
        if(game){switch(event.which) {
            
        case 37:
            $(document.getElementById("(" + cynday + "," + cyndax + ")")).empty();
            cyndax--; //going left
            atSide();
            sparkMode();
            direction = "left";
            cyndaquil.attr("src", "assets/images/" + state + "-" + direction + cyndaType());
            gotHappy();
            break;
        
        case 38:
            $(document.getElementById("(" + cynday + "," + cyndax + ")")).empty();
            cynday--; //going up
            atSide();
            sparkMode();
            cyndaquil.attr("src", "assets/images/" + state + "-" + direction + cyndaType());
            gotHappy();
            break;

        case 39:
            $(document.getElementById("(" + cynday + "," + cyndax + ")")).empty();
            cyndax++; //going right
            atSide();
            sparkMode();
            direction = "right";
            cyndaquil.attr("src", "assets/images/" + state + "-" + direction + cyndaType());
            gotHappy();
            break;

        case 40:
            $(document.getElementById("(" + cynday + "," + cyndax + ")")).empty();
            cynday++; //going down
            atSide();
            sparkMode();
            cyndaquil.attr("src", "assets/images/" + state + "-" + direction + cyndaType());
            gotHappy();
            break;

        case 32: //if spacebar is hit
            if(state === "attack"){
                var shootDirection;
                function whichWay(){
                    if(direction === " right"){
                        shoot++;
                    } else {
                        shoot--;
                    }
                }
                function whichWay(x){
                    if(x === "right"){
                        shootDirection = cyndax + 1;
                    } else {
                        shootDirection = cyndax - 1;
                    }
                }
                whichWay(direction);
                addFire(cynday, shootDirection);
            }
            break;

        case 65: //if the A key is hit
            if(state === "attack"){
                if(readyForShoot >= 2){
                    var shoot; //the X coordinate where the fireball will be
                    var shooty = cynday;
                    var shootDirection;
                    if(direction === "right"){
                        shootDirection = "right";
                    } else {
                        shootDirection = "left";
                    }
                    function shootWay(){
                        if(direction === "right"){
                            shoot++;
                        } else {
                            shoot--;
                        }
                    }
                    function whichWay(x){
                        var shootDirection; //where the fireball should start
                        if(x === "right"){
                            shootDirection = cyndax + 1;
                        } else {
                            shootDirection = cyndax - 1;
                        }
                        return shootDirection;
                    }
                    shoot = whichWay(direction);
                    function shootTheFire(){
                        addFire(shooty, shoot);
                        setTimeout(function() {
                            //burn1x1();
                            removeFire(shooty, shoot);
                        }, 300);
                        setTimeout(function() {
                            if(shootDirection === "right"){
                                shoot++;
                            } else {
                                shoot--;
                            }
                            if((shoot >= 0)&&(shoot < size)&&(!((shooty === cakey) && (shoot === cakex)))){
                                if(!didTheFireHitSomething){
                                    shootTheFire();
                                } else { 
                                    didTheFireHitSomething = false;
                                    return;
                                }
                            } else{
                                return;
                            }
                        }, 400)
                    }
                    if(!((shooty === cakey) && (shoot === cakex))){
                        shootTheFire();
                    }
                }
                }
            break;

        case 83: //s for immediate burn
            immediateBurn();
            break;

        default:
            break;
        }
        }
    });

    function gotCake() {
        if((cynday === cakey) && (cyndax === cakex)){
            return true;
        } else {
             return false;
        }
    }

    function happyCynda() {
        if(gotCake()){
            $(document.getElementById("(" + cynday + "," + cyndax + ")")).empty();
            cyndaquil.attr("src", "assets/images/happy-cynda.gif");
            cyndaquil.attr("style", "width:100%; height:100%");
            $(document.getElementById("(" + cynday + "," + cyndax + ")")).append(cyndaquil);
            game = false;
            sparkSpawn++;
            alert("You win! Click the happy Cyndaquil to play again!");
            $(".cynda").on("mousedown", function() {
                setGame();
            });
        } else {
            if((((cynday === sparkyy) && (cyndax === sparkyx))) && (!sparkChange)){
               sparkChange = true;
            } else {
                $(document.getElementById("(" + cynday + "," + cyndax + ")")).empty();
                $(document.getElementById("(" + cynday + "," + cyndax + ")")).attr("onFire", "false");
                $(document.getElementById("(" + cynday + "," + cyndax + ")")).append(cyndaquil);
            }
        }
    }

    function gotHappy() {
        gotCake();
        happyCynda();
    }

    function sparkMode() {
        if((cynday === sparkyy) && (cyndax === sparkyx)) {
            state = "attack";
            spark.attr("src", "assets/images/powerUp.gif");
            if(!getPower){
                getPower = true;
                readyForShoot++;
                alert("You got fire! Using this new power (accessed by the Spacebar), Cyndaquil can set adjacent zones ablaze! "
                + "To remove a flame, go to that zone and Cyndaquil will absorb it back! Also don't worry, you can't burn the cake!");
            }
        }
    }

    function cyndaType(){
        if(state === "attack"){
            return ".gif";
        } else {
            return ".png";
        }
    }

    function resetStage(){ //lol more like remove all the fireballs
        for(var i = 0;i < size;i++){
            for(var j = 0;j < size;j++){
                $(document.getElementById("(" + i + "," + j + ")")).empty();
                $(document.getElementById("(" + i + "," + j + ")")).attr("onFire","false");
            }
        }
    }

    function addFire(y, x){
        if(($(document.getElementById("(" + y + "," + x + ")")).attr("onFire") === "false") && !((y === cakey) && (x === cakex))){
            var fireball = $("<img>");
            fireball.attr("src","assets/images/attack.gif")
            fireball.attr("style", "width:100%; height:100%");
            fireball.attr("id","fireball(" + y + "," + x + ")"); //this should give an id of fireball(y,x)
            $(document.getElementById("(" + y + "," + x + ")")).attr("onFire", "true");
            $(document.getElementById("(" + y + "," + x + ")")).append(fireball);
        } else {
            return;
        }
    }

    function removeFire(y, x){
        if($(document.getElementById("(" + y + "," + x + ")")).attr("onFire") === "true"){
            var fireVar = document.getElementById("fireball(" + y + "," + x + ")");
            var fireLocation = document.getElementById("(" + y + "," + x + ")");
            fireLocation.removeChild(fireVar);
            $(document.getElementById("(" + y + "," + x + ")")).attr("onFire", "false");
        } else {
            return;
        }
    }

    function immediateBurn(){
        readyForShoot = 5;
        state = "attack";
        sparkSpawn = 5;
        alert("Hello Andrew. Guess you were too impatient to play through two levels.");
        enterDungeon(size, blockHeight);
        setGame();
    }

    setGame();
    }
});