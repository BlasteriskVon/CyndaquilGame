var mapsArray = [];
for(var i = 0;i < 3;i++){
    for(var j = 0;j < 3;j++){
        var newMap = {
            name: j + "," + i,
            size: 0,
            colSize: 0,
            blockHeight: 0,
            itemsArray: [],
            wallArray: undefined
        }
        mapsArray.push(newMap);
    }
}

function getMap(coordinate){
    for(var i = 0;i < mapsArray.length;i++){
        if(mapsArray[i].name = coordinate){
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

function enterDungeon(coordinate){
    $(".container").empty();
    $(".container").css({"background-image":"url(assets/images/dungeonFloor.png)", "background-size":"cover", "background-repeat":"no-repeat"});
    var chosenMap = getMap(coordinate);
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
        chosenMap.itemsArray[i].setPicture();
        place(chosenMap.itemsArray[i], true);
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
        $("#" + getLocation(obj)).attr("status", "free");
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