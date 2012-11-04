
/*
 * GET home page.
 */

exports.index = function(req, res){
	var stats = { base: 16, gain: 1.8, cost: 140 };
	var levels = getLevels(stats);
  res.render('index',
  			{ 'title': 'Regen Calc', 'base': stats['base'], 'gain': stats['gain'], 'cost': stats['cost'],
				'levels': levels,
				'inputs': req.body && req.body.inputs,
			}
)};

exports.calc = function(req, res){
	var stats = req.param('stat');
	var levels = getLevels(stats);
  res.render('index',
  			{ 'title': 'Calc', 'base': stats['base'], 'gain': stats['gain'], 'cost': stats['cost'],
				'levels': levels,
				'inputs': req.body && req.body.inputs,
			}
)};

function getLevels(stats){
	var levels = new Array();
	for(var i=0; i<25; i++) {
		var intel = Math.round((stats['base']+i*stats['gain'])*10)/10;
		var regen = Math.round(((intel*0.04)+0.01)*100)/100;
		var time = Math.round((stats['cost']/regen)*10)/10;
		levels[i] = { 'level': i+1, 'intel': intel, 'regen': regen, 'time': time };
	}
	return levels;
}
//console.log(req.url);