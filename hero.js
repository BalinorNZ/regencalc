/**
 * @constructor
 * @param {object} stats
 */

exports.Hero = function (stats) {
	this.name = stats.name;
	this.base = parseFloat(stats.base);
 	this.gain = parseFloat(stats.gain);
 	this.cost = parseFloat(stats.cost);
 	this.regen_percent = parseFloat(stats.regen_percent);
 	this.regen_raw = parseFloat(stats.regen_raw);
}

exports.Hero.prototype.getLevels = function() {
	var levels = new Array();
	for(var i=0; i<25; i++) {
		var intel = Math.round((this.base+i*this.gain)*10)/10;
		//var regen = (intel*0.04)+0.01;//Math.round(((intel*0.04)+0.01)*100)/100;
		//[Base Mana Regen + (Intelligence* .04)] * [1 + (% Total Percentage Increase)] + static regen
		var regen = ((0.01 + (intel() * 0.04))*(this.regen_percent / 100)) + this.regen_raw;
		var time = Math.round((this.cost/regen)*10)/10;
		levels[i] = { 'level': i+1, 'intel': intel, 'regen': regen.toFixed(2), 'time': time };
	}
	return levels;
}
