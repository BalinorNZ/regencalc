/**
 * @constructor
 * @param {object} stats
 */

exports.Hero = function (stats) {
	this.base = parseFloat(stats.base);
 	this.gain = parseFloat(stats.gain);
 	this.cost = parseFloat(stats.cost);
}

exports.Hero.prototype.getLevels = function() {
	var levels = new Array();
	for(var i=0; i<25; i++) {
		var intel = Math.round((this.base+i*this.gain)*10)/10;
		var regen = Math.round(((intel*0.04)+0.01)*100)/100;
		var time = Math.round((this.cost/regen)*10)/10;
		levels[i] = { 'level': i+1, 'intel': intel, 'regen': regen, 'time': time };
	}
	return levels;
}
