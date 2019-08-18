$(document).ready(function() {
    /*
    CORRESPONDING SIZES:
        size = 6: height = 8em
        size = 12: height = 4em
    */
   /*
    *************************************************************************
    STARTING MODE: "GET THE CAKE"
    *************************************************************************
    */
    function alertDialog(pause, id, title, message, functions){
        if(pause) {
            game.pause();
        }
        var newAlert = $("<div id=\"" + id + "\" title=\"" + title + "\"><p>" + message + "</p></div>");
        newAlert.hide();
                $(".container").append(newAlert);
                $(function() {
                    $("#" + id).dialog({
                        buttons: [
                            {
                                text: "OK",
                                click: function() {
                                    $(this).dialog("close");
                                    functions();
                                    game.startUp();
                                }
                            }
                        ]
                    });
                });
    }
    var size; //how many blocks there will be. the grid's dimensions will be size * size
    var blockHeight; //height attributed to each block. directly corresponds to the size to ensure the overall grid can fit without scrolling
    var alt = 0;
    var alwaysWhite = 0;
    var alwaysBlack = 1;
    var gridPattern;
    var haveBorder;
    var numberOfFireballs;
    var numberOfEnemies;
    var enemyArray;
    var game = {
        ready: false,
        level: 0,
        enemiesDefeated: 0,
        firstMovingEnemy: false,
        startUp: function(){
            this.ready = true;
        },
        end: function(){
            this.ready = false;
        },
        pause: function(){
            this.ready = false;
        },
        moveUp: function() {
            this.level++;
            document.title = "Level " + this.level + ":";
            switch(this.level){
                case 1:
                    document.title += " Seriously? This is a Piece of Cake!";
                    break;
                case 2:
                    document.title += " Whoa! Things are Heating Up!";
                    break;
                case 3:
                    document.title += " In Case You Haven't Figured It Out, Use Spacebar to Shoot a Fire Ball!";
                    break;
                case 4:
                    document.title += " Hitting the \"A\" Key Does Nothing Whatsoever. Don't Do It.";
                    break;
                case 5:
                    document.title += " Has an Enemy Started Chasing You Yet?";
                    break;
                case 6:
                    document.title += " You See the Pun is \"Cynda\" Sounds Like \"Cinder\" and \"Quil\" is a Guardians of the Galaxy Reference!";
                    break;
                case 7:
                    document.title += " <Creator Forgot to Add a Title Here>";
                    break;
                case 8:
                    document.title += " Okay I Lied. The \"A\" Key Does Do Something.";
                    break;
                case 9:
                    document.title += " I Know \"Cyndaquil Game\" is a Lazy Name But \"Cyndaquil's Bizarre Adventure\" Would've Gotten Me Sued";
                    break;
                case 10:
                    document.title += " You Got Me. I Didn't Forget to Add a Title for Level 7. I Was Just Lazy.";
                    break;
                case 11:
                    document.title += " <But This Time I Actually Forgot>";
                    break;
                case 13:
                    document.title += " Starting Now.";
                    break;
                default:
                    document.title += " Wow. Good Job! You Got Past the Levels I Made Specific Titles For (Well, aside from Level 20)! You Must be Really Good! Also Yes This Means If You Keep Going You'll Only See This Message.";
                    break;
            }
        },
        enemyDefeated: function() {
            this.enemiesDefeated++;
            $("#" + getLocation(cake)).attr("status", "free");
        }
    }
    var cyndaquil = {
        name: "Cyndaquil",
        state: "default",
        status: "free",
        direction: "right",
        x_Coordinate: 0,
        y_Coordinate: 0,
        picture: undefined,
        usedFire: false,
        moveReady: true,
        moveInterval: undefined,
        setPicture: function() {
            var settedPicture = $("<img>", {id: "cyndaquil"});
            settedPicture.attr("src", "assets/images/" + this.state + "-" + this.direction + ".gif");
            settedPicture.attr("style", "width:100%; height:auto");
            this.picture = settedPicture;
        },
        updatePicture: function() {
            this.picture.attr("src", "assets/images/" + this.state + "-" + this.direction + ".gif");
            this.picture.css({"width":"100%", "height":"auto"});
        },
        moveUp: function() {
            this.y_Coordinate--;
            this.direction = "up";
            this.updatePicture();
        },
        moveDown: function() {
            this.y_Coordinate++;
            this.direction = "down";
            this.updatePicture();
        },
        moveLeft: function() {
            this.x_Coordinate--;
            this.direction = "left";
            this.updatePicture();
        },
        moveRight: function() {
            this.x_Coordinate++;
            this.direction = "right";
            this.updatePicture();
        },
        setMoveReady: function() {
            this.moveReady = true;
        },
        getReady: function() {
            this.moveReady = false;
            this.moveInterval = setTimeout(function() {
                cyndaquil.setMoveReady();
            }, 50);
        },
        amReady: function() {
            clearInterval(this.moveInterval);
            cyndaquil.setMoveReady();
        },
        blazeOut: function() {
            powerSphere.x_Coordinate = -90;
            powerSphere.y_Coordinate = -90;
            this.state = "attack";
            if(!this.usedFire){
                game.pause();
                var fireAlert = $("<div id='fireAlert' title='Whoa! New Power!'>" +
                "<p>A new power-up has been attained! Hit a specific key on the keyboard to access it! Hint: Make sure you have a lot of space!</p>" +
                "</div>");
                fireAlert.hide();
                $(".container").append(fireAlert);
                $(function() {
                    $("#fireAlert").dialog({
                        buttons: [
                            {
                                text: "OK",
                                click: function() {
                                    $(this).dialog("close");
                                    game.startUp();
                                }
                            }
                        ]
                    });
                });
                this.usedFire = true;
            }
        },
        resetCynda: function() {
            this.state = "default";
            this.direction =  "right";
            this.x_Coordinate = 0;
            this.y_Coordinate = 0;
            this.setPicture();
            this.updatePicture();
        }
    }

    var cake = {
        x_Coordinate: 0,
        y_Coordinate: 0,
        picture: undefined,
        status: "free",
        setPicture: function() {
            var settedPicture = $("<img>");
            settedPicture.attr("src", "assets/images/cake.png");
            settedPicture.attr("style", "width:100%; height:auto");
            settedPicture.attr("id", "cake");
            this.picture = settedPicture;
        },
        setLocation: function() {
            this.x_Coordinate = Math.floor(Math.random() * size);
            this.y_Coordinate = Math.floor(Math.random() * size);
            if(inVicinity(this, cyndaquil)){
                this.setLocation();
            } else {
                this.setPicture();
            }
        }
    }

    var powerSphere = {
        x_Coordinate: undefined,
        y_Coordinate: undefined,
        timesSetLocation: 0,
        status: "free",
        picture: undefined,
        setPicture: function() {
            var settedPicture = $("<img>");
            settedPicture.attr("src", "assets/images/sparky.gif");
            settedPicture.attr("style", "width:100%; height:100%");
            settedPicture.attr("id", "powerSphere");
            this.picture = settedPicture;
        },
        setLocation: function() {
            this.x_Coordinate = Math.floor(Math.random() * size);
            this.y_Coordinate = Math.floor(Math.random() * size);
            if(sameLocation(this, cyndaquil) || inVicinity(cake, this)){
                this.setLocation();
                return;
            } else {
                this.setPicture();
                return;
            }
        }
    }

    function Fireball(x_Coordinate, y_Coordinate, direction, class_number, filter){
        this.x_Coordinate = x_Coordinate;
        this.y_Coordinate = y_Coordinate;
        this.status = "free";
        this.direction = direction;
        this.picture = $("<img>");
        this.picture.attr("id", "fireball" + class_number);
        this.picture.attr("src","assets/images/attack.gif");
        this.picture.attr("style", "width:100%; height:100%");
        this.picture.css("filter", filter);
        this.interval;
        this.moveLeft = function() {
            this.x_Coordinate--;
        }
        this.moveRight = function() {
            this.x_Coordinate++;
        }
        this.moveUp = function() {
            this.y_Coordinate--;
        }
        this.moveDown = function() {
            this.y_Coordinate++;
        }
        this.move = function() {
            switch(this.direction){
                case "left":
                    this.moveLeft();
                    break;
                case "right":
                    this.moveRight();
                    break;
                case "up":
                    this.moveUp();
                    break;
                case "down":
                    this.moveDown();
                    break;
                default:
                    break;
            }
        }
    }

    function Enemy(x_Coordinate, y_Coordinate, class_number, movable){
        this.x_Coordinate = x_Coordinate;
        this.y_Coordinate = y_Coordinate;
        this.status = "blockedByEnemy";
        this.picture = $("<img>");
        this.picture.attr("id", "enemy" + class_number);
        this.picture.attr("src", "assets/images/enemy.gif");
        this.picture.attr("style", "width:100%; height:100%");
        this.movable = movable;
        this.moveInterval = undefined;
    }

    function atSide(obj) {
        if((obj.y_Coordinate < 0)||(obj.x_Coordinate < 0)){
            if(obj.y_Coordinate < 0) {
                obj.y_Coordinate = size-1;
            } else {
                obj.x_Coordinate = size-1;
            }
        }
        if((obj.y_Coordinate >= size)||(obj.x_Coordinate >= size)){
            if(obj.y_Coordinate >= size) {
                obj.y_Coordinate = 0;
            } else {
                obj.x_Coordinate = 0;
            }
        }
    }

    function relativeLocation(obj1, obj2){
        if(obj1.x_Coordinate === obj2.x_Coordinate && obj1.y_Coordinate > obj2.y_Coordinate){
            return "up";
        } else
        if(obj1.x_Coordinate === obj2.x_Coordinate && obj1.y_Coordinate < obj2.y_Coordinate){
            return "down";
        } else
        if(obj1.y_Coordinate === obj2.y_Coordinate && obj1.x_Coordinate > obj2.x_Coordinate){
            return "left";
        } else
        if(obj1.y_Coordinate === obj2.y_Coordinate && obj1.x_Coordinate < obj2.x_Coordinate){
            return "right";
        } else
        if(obj1.y_Coordinate > obj2.y_Coordinate && obj1.x_Coordinate > obj2.x_Coordinate){
            return "upper-left";
        } else
        if(obj1.y_Coordinate > obj2.y_Coordinate && obj1.x_Coordinate < obj2.x_Coordinate){
            return "upper-right";
        } else
        if(obj1.y_Coordinate < obj2.y_Coordinate && obj1.x_Coordinate > obj2.x_Coordinate){
            return "lower-left";
        } else
        if(obj1.y_Coordinate < obj2.y_Coordinate && obj1.x_Coordinate < obj2.x_Coordinate){
            return "lower-right";
        } else { return; }
    }

    function atSides(obj){
        if((obj.y_Coordinate < 0)||(obj.x_Coordinate < 0)){
            return true;
        } else if((obj.y_Coordinate >= size)||(obj.x_Coordinate >= size)){
            return true;
        } else {
            return false;
        }
    }

    function sameLocation(obj1, obj2){
        if(getLocation(obj1) === getLocation(obj2)){
            return true;
        } else {
            return false;
        }
    }

    function place(obj, removeObj) {
        if(removeObj){
            removeObject(obj);
        }
        $("#" + getLocation(obj)).append(obj.picture);
        $("#" + getLocation(obj)).attr("status", obj.status);
    }

    function removeObject(obj){
        if($("#" + obj.picture.attr("id")).length > 0){
            $("#" + obj.picture.attr("id")).remove();
            if(obj.status != "free"){
                $("#" + getLocation(obj)).attr("status", "free");
            }
        }
    }

    
    function getLocation(obj){
        var location = obj.x_Coordinate + "-" + obj.y_Coordinate;
        return location;
    }

    function setLocation(obj, x_Coordinate, y_Coordinate){
        obj.x_Coordinate = x_Coordinate;
        obj.y_Coordinate = y_Coordinate;
    }

    function surroundingArea(obj1){
        var surrounding_x_Coordinates = [obj1.x_Coordinate, obj1.x_Coordinate + 1, obj1.x_Coordinate - 1];
        var surrounding_y_Coordinates = [obj1.y_Coordinate, obj1.y_Coordinate + 1, obj1.y_Coordinate - 1];
        var surrounding_Coordinates = [];
        for(var i = 0;i < surrounding_x_Coordinates.length;i++){
            for(var j = 0;j < surrounding_y_Coordinates.length;j++){
                var new_coordinate = surrounding_x_Coordinates[i] + "-" + surrounding_y_Coordinates[j];
                surrounding_Coordinates.push(new_coordinate);
            }
        }
        return surrounding_Coordinates;
    }

    function inVicinity(obj1, obj2){
        if(surroundingArea(obj1).includes(getLocation(obj2))){
            return true;
        } else {
            return false;
        }
    }

    function inEnemyZone(obj){
        var answer = false;
        for(var i = 0;i < enemyArray.length;i++){
            if(sameLocation(enemyArray[i], obj)){
                answer = true;
            }
        }
        return answer;
    }

    function enemyIntervalShift() {
        if((cyndaquil.picture.css("filter") === "none") || (game.level === 19)){
            return 0;
        } else {
            if(game.level < 16){
                return 200;
            } else {
                return 100;
            }
        }
    }

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

    function setGame(x, y){
        var startAlert = $("<div id='startAlert' title='The Level Begins!'><p>Cyndaquil wants some cake! Use the arrow keys and go to the cake to make him happy!</p></div>");
        startAlert.hide();
        $(".container").append(startAlert);
        $(function() {
            $("#startAlert").dialog({
                buttons: [
                    {
                        text: "OK",
                        click: function() {
                            $(this).dialog("close");
                            beginGame(x,y);
                        }
                    }
                ]
            });
        });
    }
    function beginGame(x, y){
        game.startUp();
        game.moveUp();
        sparkChange = false;
        cyndaquil.resetCynda();
        setLocation(cyndaquil, x, y);
        cake.setLocation();
        resetStage();
        numberOfFireballs = 0;
        numberOfEnemies = 0;
        enemyArray = [];

        place(cyndaquil, true);
        place(cake, true);
        if(game.level === 2){
            powerSphere.setLocation();
            place(powerSphere, true);
            game.pause();
            var powerAlert = $("<div id='powerAlert' title=\"What's this?\"><p>A new power is unlocked! Go to the power sphere for Cyndaquil to transform!</p></div>");
            powerAlert.hide();
            $(".container").append(powerAlert);
            $(function() {
                $("#powerAlert").dialog({
                    buttons: [
                        {
                            text: "OK",
                            click: function() {
                                $(this).dialog("close");
                                game.startUp();
                            }
                        }
                    ]
                });
            });
        }
        if(game.level >= 3){
            if(game.level===3){
                game.pause();
                var enemyAlert = $("<div id='enemyAlert' title='Obstacles Arrive to Astonish!'><p>" +
                "Oh no! Enemies from the land of Poorly Drawn MS Paint Sprites have arrived to stop you from getting the cake! But I hear they can't stand the heat...</p></div>");
                enemyAlert.hide();
                $(".container").append(enemyAlert);
                $(function() {
                    $("#enemyAlert").dialog({
                        buttons: [
                            {
                                text: "OK",
                                click: function() {
                                    $(this).dialog("close");
                                    game.startUp();
                                }
                            }
                        ]
                    });
                });
            };

            powerSphere.setLocation();
            place(powerSphere, true);
            if(game.enemiesDefeated < 3){
                var cake_x_Coordinates = [cake.x_Coordinate, cake.x_Coordinate + 1, cake.x_Coordinate - 1];
                var cake_y_Coordinates = [cake.y_Coordinate, cake.y_Coordinate + 1, cake.y_Coordinate - 1];
                for(var i = 0;i < cake_x_Coordinates.length;i++){
                    for(var j = 0;j < cake_y_Coordinates.length;j++){
                        var newEnemy = new Enemy(cake_x_Coordinates[i], cake_y_Coordinates[j], numberOfEnemies, false);
                        if(sameLocation(newEnemy, cake)){
                            //avoids enemy placed at same location as cake
                        } else {
                            place(newEnemy, true);
                            enemyArray.push(newEnemy);
                            $("#" + getLocation(cake)).attr("status", "blocked");
                            numberOfEnemies++;
                        }
                    }
                }
        } else {
            var movingEnemy = new Enemy(cake.x_Coordinate, cake.y_Coordinate, numberOfEnemies, true);
            enemyArray.push(movingEnemy);
            $("#" + getLocation(cake)).attr("status", "blocked");
            numberOfEnemies++;
            if(movingEnemy.movable) {
                movingEnemy.moveInterval = setInterval(function() {
                    switch(relativeLocation(movingEnemy, cyndaquil)){
                        case "up":
                            removeObject(movingEnemy);
                            $("#" + getLocation(cake)).attr("status", "blocked");
                            movingEnemy.y_Coordinate--;
                            if(sameLocation(movingEnemy, cake) || sameLocation(movingEnemy, powerSphere)){
                                movingEnemy.y_Coordinate++;
                                place(movingEnemy, true);
                            } else {
                                if(sameLocation(movingEnemy, cyndaquil)){
                                    removeObject(movingEnemy);
                                    clearInterval(movingEnemy.moveInterval);
                                    youLose();
                                } else {
                                    place(movingEnemy, true);
                                }
                            }
                            break;
                        case "down":
                            removeObject(movingEnemy);
                            $("#" + getLocation(cake)).attr("status", "blocked");
                            movingEnemy.y_Coordinate++;
                            if(sameLocation(movingEnemy, cake) || sameLocation(movingEnemy, powerSphere)){
                                movingEnemy.y_Coordinate--;
                                place(movingEnemy, true);
                            } else {
                                if(sameLocation(movingEnemy, cyndaquil)){
                                    removeObject(movingEnemy);
                                    clearInterval(movingEnemy.moveInterval);
                                    youLose();
                                } else {
                                    place(movingEnemy, true);
                                }
                            }
                            break;
                        case "right":
                            removeObject(movingEnemy);
                            $("#" + getLocation(cake)).attr("status", "blocked");
                            movingEnemy.x_Coordinate++;
                            if(sameLocation(movingEnemy, cake) || sameLocation(movingEnemy, powerSphere)){
                                movingEnemy.x_Coordinate--;
                                place(movingEnemy, true);
                            } else {
                                if(sameLocation(movingEnemy, cyndaquil)){
                                    removeObject(movingEnemy);
                                    clearInterval(movingEnemy.moveInterval);
                                    youLose();
                                } else {
                                    place(movingEnemy, true);
                                }
                            }
                            break;
                        case "left":
                            removeObject(movingEnemy);
                            $("#" + getLocation(cake)).attr("status", "blocked");
                            movingEnemy.x_Coordinate--;
                            if(sameLocation(movingEnemy, cake) || sameLocation(movingEnemy, powerSphere)){
                                movingEnemy.x_Coordinate++;
                                place(movingEnemy, true);
                            } else {
                                if(sameLocation(movingEnemy, cyndaquil)){
                                    removeObject(movingEnemy);
                                    clearInterval(movingEnemy.moveInterval);
                                    youLose();
                                } else {
                                    place(movingEnemy, true);
                                }
                            }
                            break;
                        case "upper-left":
                            removeObject(movingEnemy);
                            $("#" + getLocation(cake)).attr("status", "blocked");
                            movingEnemy.x_Coordinate--;
                            movingEnemy.y_Coordinate--;
                            if(sameLocation(movingEnemy, cake) || sameLocation(movingEnemy, powerSphere)){
                                movingEnemy.x_Coordinate++;
                                movingEnemy.y_Coordinate++;
                                place(movingEnemy, true);
                            } else {
                                if(sameLocation(movingEnemy, cyndaquil)){
                                    removeObject(movingEnemy);
                                    clearInterval(movingEnemy.moveInterval);
                                    youLose();
                                } else {
                                    place(movingEnemy, true);
                                }
                            }
                            break;
                        case "upper-right":
                            removeObject(movingEnemy);
                            $("#" + getLocation(cake)).attr("status", "blocked");
                            movingEnemy.x_Coordinate++;
                            movingEnemy.y_Coordinate--;
                            if(sameLocation(movingEnemy, cake) || sameLocation(movingEnemy, powerSphere)){
                                movingEnemy.x_Coordinate--;
                                movingEnemy.y_Coordinate++;
                                place(movingEnemy, true);
                            } else {
                                if(sameLocation(movingEnemy, cyndaquil)){
                                    removeObject(movingEnemy);
                                    clearInterval(movingEnemy.moveInterval);
                                    youLose();
                                } else {
                                    place(movingEnemy, true);
                                }
                            }
                            break;
                        case "lower-left":
                            removeObject(movingEnemy);
                            $("#" + getLocation(cake)).attr("status", "blocked");
                            movingEnemy.x_Coordinate--;
                            movingEnemy.y_Coordinate++;
                            if(sameLocation(movingEnemy, cake) || sameLocation(movingEnemy, powerSphere)){
                                movingEnemy.x_Coordinate++;
                                movingEnemy.y_Coordinate--;
                                place(movingEnemy, true);
                            } else {
                                if(sameLocation(movingEnemy, cyndaquil)){
                                    removeObject(movingEnemy);
                                    clearInterval(movingEnemy.moveInterval);
                                    youLose();
                                } else {
                                    place(movingEnemy, true);
                                }
                            }
                            break;
                        case "lower-right":
                            removeObject(movingEnemy);
                            $("#" + getLocation(cake)).attr("status", "blocked");
                            movingEnemy.x_Coordinate++;
                            movingEnemy.y_Coordinate++;
                            if(sameLocation(movingEnemy, cake) || sameLocation(movingEnemy, powerSphere)){
                                movingEnemy.x_Coordinate--;
                                movingEnemy.y_Coordinate--;
                                place(movingEnemy, true);
                            } else {
                                if(sameLocation(movingEnemy, cyndaquil)){
                                    removeObject(movingEnemy);
                                    clearInterval(movingEnemy.moveInterval);
                                    youLose();
                                } else {
                                    place(movingEnemy, true);
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }, Math.max((1300 - (100 * game.level)), 50, enemyIntervalShift()));
            }
        }
        }
        if(game.level === 20){
            document.title = "Wow! You Made It To Level 20! You Win!";
            for(var i = 0;i < size;i++){
                for(var j = 0;j < size;j++){
                    $("#" + i + "-" + j).css("background-color","transparent");
                }
            }
            $(".container").css({"background-image":"url('assets/images/happy-cynda.gif')", "background-size":"cover"});
            game.ready = false;
            for(var i = 0;i < enemyArray.length;i++){
                enemyArray[i].picture.attr("src","assets/images/cake.png");
                if(enemyArray[i].movable){
                    clearInterval(enemyArray[i].moveInterval);
                }
            }
        }
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
            newBlock.attr("id", j + "-" + i); //sets coordinates like 0-1... I don't like the - though, but 0,1 feels clunky... gah!
            newBlock.attr("onFire","false");
            newBlock.attr("status", "free");
            newRow.append(newBlock);
        }
        $(".container").append(newRow);
    }


    //$(document).keyup(keyPress);
    function keyPress(event) {
        if(game.ready){switch(event.which) {
            
        case 37:
            if(cyndaquil.moveReady || cyndaquil.direction != "left"){
                if(cyndaquil.direction != "left"){
                    cyndaquil.amReady();
                }
                cyndaquil.moveLeft(); //going left
                atSide(cyndaquil);
                if($("#" + getLocation(cyndaquil)).attr("status") != "free"){
                    cyndaquil.x_Coordinate++;
                    atSide(cyndaquil);
                    break;
                } else {
                    moveCyndaquil();
                    cyndaquil.getReady();
                    break;
                }
            } else {
                break;
            }       
        
        case 38:
            if(cyndaquil.moveReady || cyndaquil.direction != "up"){
                if(cyndaquil.direction != "up"){
                    cyndaquil.amReady();
                }
                cyndaquil.moveUp(); //going up
                atSide(cyndaquil);
                if($("#" + getLocation(cyndaquil)).attr("status") != "free"){
                    cyndaquil.y_Coordinate++;
                    atSide(cyndaquil);
                    break;
                } else {
                    moveCyndaquil();
                    cyndaquil.getReady();
                    break;
                }
            } else {
                break;
            } 

        case 39:
            if(cyndaquil.moveReady || cyndaquil.direction != "right"){
                if(cyndaquil.direction != "right"){
                    cyndaquil.amReady();
                }
                cyndaquil.moveRight(); //going right
                atSide(cyndaquil);
                if($("#" + getLocation(cyndaquil)).attr("status") != "free"){
                    cyndaquil.x_Coordinate--;
                    atSide(cyndaquil);
                    break;
                } else {
                    moveCyndaquil();
                    cyndaquil.getReady();
                    break;
                }
            } else {
                break;
            }

        case 40:
            if(cyndaquil.moveReady || cyndaquil.direction != "down"){
                if(cyndaquil.direction != "down"){
                    cyndaquil.amReady();
                }
                cyndaquil.moveDown(); //going down
                atSide(cyndaquil);
                if($("#" + getLocation(cyndaquil)).attr("status") != "free"){
                    cyndaquil.y_Coordinate--;
                    atSide(cyndaquil);
                    break;
                } else {
                    moveCyndaquil();
                    cyndaquil.getReady();
                    break;
                }
            } else {
                break;
            }
        
        case 32://if spacebar is hit
        if(cyndaquil.state === "attack"){
            var newFireball = new Fireball(cyndaquil.x_Coordinate, cyndaquil.y_Coordinate, cyndaquil.direction, numberOfFireballs, cyndaquil.picture.css("filter"));
            var stopEarly = false;
            numberOfFireballs++;
            newFireball.move();
            if(!(sameLocation(newFireball, cake) || sameLocation(newFireball, cyndaquil) || atSides(newFireball) || $("#" + getLocation(newFireball)).attr("status") === "blocked")){
                for(var i = 0;i < enemyArray.length;i++){
                    if(sameLocation(enemyArray[i], newFireball)){
                        removeObject(enemyArray[i]);
                        clearInterval(enemyArray[i].moveInterval);
                        enemyArray.splice(i, 1);
                        stopEarly = true;
                        game.enemyDefeated();
                    }
                }
                if($("#" + getLocation(newFireball)).is(":empty")){
                    place(newFireball, true);
                }

                setTimeout(function() {
                    removeObject(newFireball);
                    newFireball.move();
                }, 300)
                if(!stopEarly){
                    newFireball.interval = setInterval(function() {
                        if(sameLocation(newFireball, cake) || atSides(newFireball) || stopEarly || $("#" + getLocation(newFireball)).attr("status") === "blocked"){
                            clearInterval(newFireball.interval);
                            removeObject(newFireball);
                        } else {
                            if(inEnemyZone(newFireball)){
                                for(var i = 0;i < enemyArray.length;i++){
                                    if(sameLocation(enemyArray[i], newFireball)){
                                        removeObject(enemyArray[i]);
                                        clearInterval(enemyArray[i].moveInterval);
                                        enemyArray.splice(i, 1);
                                        stopEarly = true;
                                        game.enemyDefeated();
                                    }
                                }
                            }
                            removeObject(newFireball);
                            if($("#" + getLocation(newFireball)).is(":empty")){
                                place(newFireball, true);
                            }
                            if(!stopEarly){
                                newFireball.move();
                            }
                        }
                    }, 400)
                }
            }
        }
        break;

        /*case 83: //s for start dungeon room
            cake.x_Coordinate = -10;
            cake.y_Coordinate = -10;
            cyndaquil.mapX = 1;
            cyndaquil.mapY = 2;
            cyndaquil.getMap = function() {
                return cyndaquil.mapX + "," + cyndaquil.mapY;
            }
            setLocation(cyndaquil, 3, 4);
            setLocation(powerSphere, 4, 2);
            powerSphere.setPicture();
            enterDungeon(cyndaquil.getMap());
            place(cyndaquil, true);
            place(powerSphere, true);
            break;*/

        case 65: //a to change hue
            if(cyndaquil.picture.css("filter") === "none"){
                cyndaquil.picture.css("filter", "hue-rotate(90deg)");
            } else {
                cyndaquil.picture.css("filter", "none");
            }
            break;

        default:
            break;
        }
        }
    }

    var currentKeyListener = keyPress;

    $(document).on("keydown", currentKeyListener);
    $(document).off("keyup", function(){
        clearTimeout(cyndaquil.moveInterval);
        cyndaquil.moveReady = true;
    });

    function moveCyndaquil(){
        if(sameLocation(cyndaquil, cake)){
            place(cyndaquil, true);
            gotCake();
        } else {
            if(sameLocation(cyndaquil, powerSphere)){
                removeObject(powerSphere);
                cyndaquil.blazeOut();
                cyndaquil.updatePicture();
                place(cyndaquil, true);
            } else {
                $("#" + getLocation(cyndaquil)).empty();
                place(cyndaquil, true);
            }
        }
    }

    function gotCake() {
            $("#" + getLocation(cyndaquil)).empty();
            for(var i = 0;i < enemyArray.length;i++){
                if(enemyArray[i].movable){
                    removeObject(enemyArray[i]);
                    clearInterval(enemyArray[i].moveInterval);
                }
            }
            var victoryCynda = $("<img>", {id:"victoryCynda"});
            victoryCynda.attr("src", "assets/images/happy-cynda.gif");
            victoryCynda.attr("style", "width:100%; height:100%");
            $("#" + getLocation(cyndaquil)).append(victoryCynda);
            game.end();
            var gotCakeAlert = $("<div id='gotCakeAlert' title='Victory!'><p>" +
                "You got the cake! Click the \"Next Level\" button to continue!</p></div>");
            gotCakeAlert.hide();
            $(".container").append(gotCakeAlert);
            $(function() {
                $("#gotCakeAlert").dialog({
                    buttons: [
                        {
                            text: "Next Level",
                            click: function() {
                                $(this).dialog("close");
                                    setGame(0,0);
                            }
                        },
                        {
                            text: "I'm Done",
                            click: function() {
                                $(this).dialog("close");
                                $(".container").html("Thank you for playing!");
                            }
                        }
                    ]
                });
            });

            /*$("#victoryCynda").on("mousedown", function() {
                setGame(0, 0);
            });*/
        }

    function resetStage(){ //lol more like remove all the fireballs
        for(var i = 0;i < size;i++){
            for(var j = 0;j < size;j++){
                $("#" + j + "-" + i).empty();
                $("#" + j + "-" + i).attr("onFire","false");
                $("#" + j + "-" + i).attr("status", "free");
            }
        }
    }

    function youLose() {
        game.end();
        cyndaquil.picture.css("filter", "grayscale(100%)");
        cyndaquil.picture.addClass("defeatedCynda");
        var gameOverAlert = $("<div id='gameOverAlert' title='Defeat!'><p>Game Over! Click \"Try Again\" to try again!</p></div>");
        gameOverAlert.hide();
        var buttonsArray;
        if(game.level < 11){
            buttonsArray = [
                {
                    text: "Try Again",
                    click: function() {
                        $(this).dialog("close");
                            game.level--;
                            setGame(0,0);
                    }
                },
                {
                    text: "I'm Done",
                    click: function() {
                        $(this).dialog("close");
                        $(".container").html("Thank you for playing!");
                    }
                }
            ];
        } else {
            buttonsArray = [
                {
                    text: "Try Again",
                    click: function() {
                        $(this).dialog("close");
                            game.level--;
                            setGame(0,0);
                    }
                },
                {
                    text: "I'm Done",
                    click: function() {
                        $(this).dialog("close");
                        $(".container").html("Thank you for playing!");
                    }
                },
                {
                    text: "Secret Mode",
                    click: function() {
                        $(this).dialog("close");
                        cake.x_Coordinate = -10;
                        cake.y_Coordinate = -10;
                        cyndaquil.resetCynda();
                        cyndaquil.mapX = 1;
                        cyndaquil.mapY = 2;
                        cyndaquil.getMap = function() {
                            return cyndaquil.mapX + "," + cyndaquil.mapY;
                        }
                        setLocation(cyndaquil, 3, 4);
                        setLocation(powerSphere, 4, 2);
                        powerSphere.setPicture();
                        enterDungeon(cyndaquil.getMap());
                        place(cyndaquil, true);
                        place(powerSphere, true);
                        game.startUp();
                    }
                }
            ];
        }
        $(".container").append(gameOverAlert);
        $(function() {
            $("#gameOverAlert").dialog({
                buttons: buttonsArray
            });
        });
        /*$(".defeatedCynda").on("mousedown", function() {
            game.level--;
            setGame(0, 0);
        })*/
    }

    setGame(0, 0);
    /*
    *************************************************************************
    DUNGEON MODE: MAP STARTING AT 1,2
    *************************************************************************
    */
   var mapsArray = [];
   for(var i = 0;i < 3;i++){
       for(var j = 0;j < 3;j++){
           var newMap = {
               name: j + "," + i,
               _name: j + "-" + i,
               size: 0,
               colSize: 0,
               blockHeight: 0,
               itemsArray: [],
               wallArray: undefined,
               functions: undefined,
               visited: false
           }
           mapsArray.push(newMap);
           console.log(newMap.name);
       }
   }

   function getMap(coordinate){
       for(var i = 0;i < mapsArray.length;i++){
           if(mapsArray[i].name === coordinate){
               return mapsArray[i];
           }
       }
   }

   var startMap = getMap("1,2");

   startMap.table = {
       name: "table",
       x_Coordinate: 4,
       y_Coordinate: 1,
       status: "blocked",
       picture: undefined,
       place: true,
       setPicture: function() {
           var settedPicture = $("<img>");
           settedPicture.attr("src", "assets/images/1-2/table.png");
           settedPicture.css({"width":"100%", "height":"100%"});
           settedPicture.attr("id", "table1-2");
           this.picture = settedPicture;
       }
   }
   startMap.itemsArray.push(startMap.table);
   startMap.skull = {
       name: "skull",
       x_Coordinate: 1,
       y_Coordinate: 2,
       status: "blocked",
       place: true,
       picture: undefined,
       setPicture: function() {
           var settedPicture = $("<img>");
           settedPicture.attr("src", "assets/images/1-2/skull.png");
           settedPicture.css({"width":"100%", "height":"100%"});
           settedPicture.attr("id", "skull1-2");
           this.picture = settedPicture;
       }
   }
   startMap.itemsArray.push(startMap.skull);
   startMap.size = 6;
   startMap.blockHeight = 8;
   startMap.wallArray = ["0-0","1-0","2-0","4-0","5-0","0-1","5-1","5-2","0-3","5-3","0-4","5-4","0-5","1-5","2-5","3-5","4-5","5-5"];
   startMap.keyPress = function(event) {
    if(game.ready){switch(event.which) {
        
    case 37:
        if(cyndaquil.moveReady || cyndaquil.direction != "left"){
            if(cyndaquil.direction != "left"){
                cyndaquil.amReady();
            }
            cyndaquil.moveLeft(); //going left
            atSide(cyndaquil);
            if($("#" + getLocation(cyndaquil)).attr("status") != "free"){
                cyndaquil.x_Coordinate++;
                atSide(cyndaquil);
                break;
            } else {
                moveCyndaquil();
                cyndaquil.getReady();
                break;
            }
        } else {
            break;
        }       
    
    case 38:
        if(cyndaquil.moveReady || cyndaquil.direction != "up"){
            if(cyndaquil.direction != "up"){
                cyndaquil.amReady();
            }
            cyndaquil.moveUp(); //going up
            atSide(cyndaquil);
            if($("#" + getLocation(cyndaquil)).attr("status") != "free"){
                cyndaquil.y_Coordinate++;
                atSide(cyndaquil);
                break;
            } else {
                moveCyndaquil();
                cyndaquil.getReady();
                break;
            }
        } else {
            break;
        } 

    case 39:
        if(cyndaquil.moveReady || cyndaquil.direction != "right"){
            if(cyndaquil.direction != "right"){
                cyndaquil.amReady();
            }
            cyndaquil.moveRight(); //going right
            atSide(cyndaquil);
            if($("#" + getLocation(cyndaquil)).attr("status") != "free"){
                cyndaquil.x_Coordinate--;
                atSide(cyndaquil);
                break;
            } else {
                moveCyndaquil();
                cyndaquil.getReady();
                break;
            }
        } else {
            break;
        }

    case 40:
        if(cyndaquil.moveReady || cyndaquil.direction != "down"){
            if(cyndaquil.direction != "down"){
                cyndaquil.amReady();
            }
            cyndaquil.moveDown(); //going down
            atSide(cyndaquil);
            if($("#" + getLocation(cyndaquil)).attr("status") != "free"){
                cyndaquil.y_Coordinate--;
                atSide(cyndaquil);
                break;
            } else {
                moveCyndaquil();
                cyndaquil.getReady();
                break;
            }
        } else {
            break;
        }
    
    case 32://if spacebar is hit
    if(cyndaquil.state === "attack"){
        var newFireball = new Fireball(cyndaquil.x_Coordinate, cyndaquil.y_Coordinate, cyndaquil.direction, numberOfFireballs, cyndaquil.picture.css("filter"));
        var stopEarly = false;
        numberOfFireballs++;
        newFireball.move();
        if(!(sameLocation(newFireball, cake) || sameLocation(newFireball, cyndaquil) || atSides(newFireball) || $("#" + getLocation(newFireball)).attr("status") === "blocked")){
            for(var i = 0;i < enemyArray.length;i++){
                if(sameLocation(enemyArray[i], newFireball)){
                    removeObject(enemyArray[i]);
                    clearInterval(enemyArray[i].moveInterval);
                    enemyArray.splice(i, 1);
                    stopEarly = true;
                    game.enemyDefeated();
                }
            }
            if($("#" + getLocation(newFireball)).is(":empty")){
                place(newFireball, true);
            }

            setTimeout(function() {
                removeObject(newFireball);
                newFireball.move();
            }, 300)
            if(!stopEarly){
                newFireball.interval = setInterval(function() {
                    if(sameLocation(newFireball, cake) || atSides(newFireball) || stopEarly || $("#" + getLocation(newFireball)).attr("status") === "blocked"){
                        clearInterval(newFireball.interval);
                        removeObject(newFireball);
                    } else {
                        if(inEnemyZone(newFireball)){
                            for(var i = 0;i < enemyArray.length;i++){
                                if(sameLocation(enemyArray[i], newFireball)){
                                    removeObject(enemyArray[i]);
                                    clearInterval(enemyArray[i].moveInterval);
                                    enemyArray.splice(i, 1);
                                    stopEarly = true;
                                    game.enemyDefeated();
                                }
                            }
                        }
                        removeObject(newFireball);
                        if($("#" + getLocation(newFireball)).is(":empty")){
                            place(newFireball, true);
                        }
                        if(!stopEarly){
                            newFireball.move();
                        }
                    }
                }, 400)
            }
        }
    }
    break;

    case 65: //a to change hue
        if(cyndaquil.picture.css("filter") === "none"){
            cyndaquil.picture.css("filter", "hue-rotate(180deg)");
        } else {
            cyndaquil.picture.css("filter", "none");
        }
        break;

    default:
        break;
    }
    }
}

   startMap.functions = function() {
    document.title = "Room " + startMap._name;
    $(document).off("keydown", currentKeyListener);
    currentKeyListener = this.keyPress;
    $(document).on("keydown", currentKeyListener);
    if(!this.visited){
        alertDialog(true, "introToDungeon", "Well This Is Different!", "The cake is gone! The enemy is gone! What's going on?!", function() {this.visited = true;}.bind(startMap))
    }
   }

   function enterDungeon(coordinate){
       $(".container").empty();
       $(".container").css({"background-image":"url(assets/images/dungeonFloor.png)", "background-size":"cover", "background-repeat":"no-repeat"});
       var chosenMap = getMap(coordinate);
       chosenMap.functions();
       for(var i = 0;i < chosenMap.size;i++){ //creating the board
           var newRow = $("<div>");
           chosenMap.colSize = 12/chosenMap.size;
           newRow.addClass("row");
           for(var j = 0;j < chosenMap.size;j++){
               if(j===0){ //checks if it is the start of a row
                   if(i%2 === 1){ //checks if i is odd
                       alt = 1;
                   } else {
                       alt = 0;
                   }
               }
               var newBlock = $("<div>"); //creates the div element
               newBlock.addClass("col-md-" + chosenMap.colSize); 
               newBlock.attr("style","width: 100%; height: " + chosenMap.blockHeight + "em; border-style: solid; border-color: black"); //should be black border
               newBlock.attr("id", j + "-" + i ); //sets coordinates like (0,1)
               newBlock.attr("onFire","false");
               newBlock.attr("status", "free");
               newRow.append(newBlock);
           }
           $(".container").append(newRow);
       }
       for(var i = 0;i < chosenMap.wallArray.length;i++){
           $("#" + chosenMap.wallArray[i]).css("background-color", "grey");
           $("#" + chosenMap.wallArray[i]).attr("status", "blocked");
       }
       for(var i = 0;i < chosenMap.itemsArray.length;i++){
           if(chosenMap.itemsArray[i].place){
            chosenMap.itemsArray[i].setPicture();
            place(chosenMap.itemsArray[i], true);
           }
       }
   }

    }

});