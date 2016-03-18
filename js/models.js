var TILE_H = 60;
var TILE_W = 60;
var testTower = $('#tower');
var towerChosen = false;
var clickedTile;
var lastClickedTile = 'Thrower'; //this will be set when you click the toolbar so it knows what kind of tower to place

var levelOne = ["(4,0)","(4,1)","(3,1)","(2,1)","(1,1)","(1,2)","(1,3)","(2,3)","(3,3)","(4,3)","(4,4)"];


// THIS FILE DEALS WITH THE CLASSES FOR THE GAME OBJECTS
// THIS AREA ADDRESSES THE TOWER
function Tower(name, fireRate, damage, range, cost){
    this.name = name;
    this.fireRate = fireRate;
    this.damage = damage;
    this.cost = cost;
    this.range = range;
};

Tower.prototype.upgrade = function(cost, fireRate, damage){
  this.cost += cost;
  this.fireRate = fireRate;
  this.damage = damage;
};

Tower.prototype.sell = function(){
  return Math.floor(this.cost * .8);  
};

// THIS AREA ADDRESSES THE ENEMY(FBI)
function Enemy(type, health, armor, speed,direction, x, y){
    this.type = type;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.health = health;
    this.armor = armor;
    this.speed = speed;
};

Enemy.prototype.move = function(){
	if(this.direction === "UP"){
		this.y += this.speed;
	}else if(this.direction === "DOWN"){
		this.y -= this.speed;
	}else if(this.direction === "LEFT"){
		this.x -= this.speed;
	}else if(this.direction === "RIGHT"){
		this.y += this.speed;
	}
}
    
Enemy.prototype.damage = function(damage){
    this.health -= damage*((100-this.armor)/100);  
    return this.health <= 0;
};


// THIS AREA ADDRESSES THE GAME
function Game(){
  this.wave = 0;
  this.money = 500;
  this.health = 100;
  this.Enemies = this.initEnemies(0);
};

Game.prototype.nextWave = function(){
  this.wave ++;
  this.initEnemies();
};

Game.prototype.initEnemies = function(wave){
	var numenemies = 5 + 5*wave;
	for(var i = 0; i < numenemies; i++){
		var en = new Enemy("", 100, 100, 100);
    	this.enemies.push(en);//Will be changed to dynamic function
	}
};

Game.prototype.spendCredits = function(spent){
  this.credits -= spent;  
};

Game.prototype.earnedCredits = function(earn){
  this.credits += earn;  
};

Game.prototype.damageBase = function(){
  this.health -=1;
  return this.health <= 0;
};

Game.prototype.fps = 30;

Game.prototype.run = function(){
	Game.prototype._intervalId = setInterval(this.tick, 1000 / Game.fps);
}


Game.prototype.tick = function(){
	var passedtime = new Date().getTime() - Game.prototype.previousTick;
	Game.prototype.previousTick = new Date().getTime();
	this.moveEnemies(passedtime);
	this.shootTowers(passedtime);
}

Game.prototype.moveEnemies = function(passedtime){
  //TODO when map is solidified
}

Game.prototype.shootTowers = function(passedtime){
  //TODO when map is solidified
}

var towerPlaceLogic = function(){
	clickedTile = this.id;
	var tile = document.getElementById(clickedTile);
	var clickedPositon = $( this ).offset();
  		event.stopPropagation();
	if((gameGrid.grid[clickedTile.substring(0,5)].hasTower == true || (gameGrid.towers[clickedTile] != null)) &&  $("body").hasClass("cursor_change")){
	turnCursorOff();
	alert("Sorry there is a tower there");
	}
	if(gameGrid.grid[clickedTile.substring(0,5)].hasTower == false &&  $("body").hasClass("cursor_change")){
		var newTowerDiv = document.createElement("div");
		var newTowerObj = new Tower(document.getElementsByTagName("body")[0].classList.item(0), 20, 20, 20, 20) //plan to make the class on the body, which changes cursor, have the name of the tower your trying to place, this will then cascade down for naming / determining stats of everything
		newTowerDiv.setAttribute("id",(clickedTile + "_T"));
		newTowerDiv.setAttribute("class","mapzone"); //remove hidden here and run if you want to see the prelim. map idea (not going to use the strange level format seen below however)
		newTowerDiv.style.left = (TILE_H*(gameGrid.grid[clickedTile].locationY)+200) + "px";
		newTowerDiv.style.top = (TILE_W*(gameGrid.grid[clickedTile].locationX)+200) + "px";
		gameGrid.towers[clickedTile] = newTowerObj; 
		console.log(gameGrid.towers[clickedTile]); //array of tower objects indexed at location on grid
		gameGrid.grid[clickedTile].hasTower = true;
		gameGrid.grid[clickedTile].towerType = lastClickedTile;
		console.log(gameGrid.grid[clickedTile]); //updated grid tile to reflect having tower 
		turnCursorOff();
		newTowerDiv.style.backgroundImage = "url('http://www.placecage.com/30/30')";
		newTowerDiv.style.backgroundRepeat = "no-repeat";
		newTowerDiv.style.backgroundPosition = "center";
		newTowerDiv.addEventListener("click",towerPlaceLogic);
		document.body.appendChild(newTowerDiv);
	}
}

var Grid = function(mapHeight,mapWidth) {
    var mapHeight = mapHeight;
    var mapWidth = mapWidth;
    this.grid = {};
    this.towers = {};
    this.pathTiles = {};
    // create the map zone
	
    this.createGrid = function() {
	for(var j = 0; j < mapHeight; j++)
	{
		for(var i = 0; i < mapWidth; i++)
		{
			var mapzone = document.createElement("div");
			var nonPathTile={locationY: i, locationX: j, hasTower: false,  towerType: null}; //create a new key/dictionary value for each cell/tile in our table into our grid obj, which will keep track of what exists in each cell
            var pathTile = {nextDirection: null, hasEnemy: null};
            var pos = "(" + j + "," + i + ")"; //gives us our position for these cells as a coordinate
			mapzone.setAttribute("id",pos);
			mapzone.setAttribute("class","mapzone hidden"); //remove hidden here and run if you want to see the prelim. map idea (not going to use the strange level format seen below however)
			mapzone.style.left = (TILE_H*i+200) + "px";
			mapzone.style.top = (TILE_W*j+200) + "px";
			document.body.appendChild(mapzone);
			if(levelOne.indexOf(pos) > -1)
			{
				mapzone.style.backgroundColor = "brown";
				mapzone.style.backgroundImage = "url('/img/pathtile60.png')";
				this.grid[pos] = pathTile;
				this.pathTiles[pos] = pathTile;
			}
			else
			{
				this.grid[pos] = nonPathTile;
				mapzone.style.backgroundImage = "url('/img/grasstile60.png')";
				document.getElementById(pos).addEventListener("click",towerPlaceLogic);
			}
		}
	}
}
	this.markTileDirections = function() {
		for (var pathTile in this.pathTiles){
			//pathTile.locationX
		}
	}
}

var turnCursorOn = function(e){
    $("body").toggleClass("cursor_change");
    testTower.off("click", turnCursorOn);
    $("body").on("click", turnCursorOff);
    towerChosen = true;
    e.stopImmediatePropagation();
}

var turnCursorOff = function(){
    if(towerChosen == true){
    $("body").toggleClass("cursor_change");
    $("body").off("click", turnCursorOff);
    testTower.on("click", turnCursorOn);
    towerChosen = false;
    }
}

testTower.on("click", turnCursorOn);
var gameGrid = new Grid(5,5);
gameGrid.createGrid();
