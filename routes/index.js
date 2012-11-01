
/*
 * GET home page.
 */

var colors = [ 'Red', 'Blue', 'Green', 'Purple'];
var base = 16;
var gain = 1.8;
var cost = 140;
var levels = new Array();
for(var i=0; i<25; i++) {
	var intel = Math.round((base+i*gain)*10)/10;
	var regen = Math.round(((intel*0.04)+0.01)*100)/100;
	var time = Math.round((cost/regen)*10)/10;
	levels[i] = { 'level': i+1, 'intel': intel, 'regen': regen, 'time': time };
}

exports.index = function(req, res){
	console.log(req.url);
  res.render('index',
  			{ 'title': 'Regen Calc', 'base': base, 'gain': gain, 'cost': cost,
				'colors': colors,
				'levels': levels,
			}
)};

exports.about = function(req, res){
	console.log(req.url);
  res.render('index', { title: 'About', base: 21, gain: 3.2, hi: 'bye'  })
};


