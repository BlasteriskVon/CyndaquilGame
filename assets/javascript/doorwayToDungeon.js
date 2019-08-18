var size;
var colSize;
var blockHeight;
function enterDungeon(sizeOriginal, blockHeightOriginal){
    $(".container").empty();
    $(".container").css({"background-image":"url(assets/images/dungeon.png)", "background-size":"cover", "background-repeat":"no-repeat"});
    size = sizeOriginal;
    colSize = 12/size;
    blockHeight = blockHeightOriginal;
     for(var i = 0;i < size;i++){ //creating the board
        var newRow = $("<div>");
        var colSize = 12/size;
        newRow.addClass("row");
        for(var j = 0;j < size;j++){
            if(j===0){ //checks if it is the start of a row
                if(i%2 === 1){ //checks if i is odd
                    alt = 1;
                } else {
                    alt = 0;
                }
            }
            var newBlock = $("<div>"); //creates the div element
            newBlock.addClass("col-md-" + colSize); 
            newBlock.attr("style","width: 100%; height: " + blockHeight + "em; border-style: solid; border-color: black"); //should be black border
            newBlock.attr("id", j + "-" + i ); //sets coordinates like (0,1)
            newBlock.attr("onFire","false");
            newBlock.attr("status", "free");
            newRow.append(newBlock);
        }
        $(".container").append(newRow);
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
    $("#" + obj.picture.attr("id")).remove();
    $("#" + getLocation(obj)).attr("status", "free");
}


function getLocation(obj){
    var location = obj.x_Coordinate + "-" + obj.y_Coordinate;
    return location;
}

function setLocation(obj, x_Coordinate, y_Coordinate){
    obj.x_Coordinate = x_Coordinate;
    obj.y_Coordinate = y_Coordinate;
}