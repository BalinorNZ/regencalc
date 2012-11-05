
/*
 * GET home page.
 */
var heroClass = require('../hero');

exports.index = function(req, res){
	var hero = new heroClass.Hero({ base: 16, gain: 1.8, cost: 140 });
  res.render('index',
  			{ 'title': 'Regen Calc', 'base': hero.base, 'gain': hero.gain, 'cost': hero.cost,
				'levels': hero.getLevels(),
				'inputs': req.body && req.body.inputs,
			}
)};

exports.calc = function(req, res){
	var stats = req.param('stat');
	var hero = new heroClass.Hero({ base: stats['base'], gain: stats['gain'], cost: stats['cost'] })//req.param('stat'));
  res.render('index',
  			{ 'title': 'Regen Calc', 'base': hero.base, 'gain': hero.gain, 'cost': hero.cost,
				'levels': hero.getLevels(),
				'inputs': req.body && req.body.inputs,
			}
)};

//console.log(req.url);