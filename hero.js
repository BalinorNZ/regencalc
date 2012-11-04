/**
 * @constructor
 */
function Hero () {
	this.baseInt = 0;
 	this.intPerLevel = 0.0;
 	this.level = 1;
	this.heroName = ""; // TODO: should be enum
}


Hero.prototype.timeToRegen = function (mana) {
	// calculate using regenRate function;
};

Hero.prototype.regenRate = function () {
	//calculate this based off current hero stats
};

//This probably should go in another file
function Lina () {
	this.baseInt = 27;
	this.intPerLevel = 3.2;
	this.heroName = "Lina";
}
Lina.prototype = new Hero();