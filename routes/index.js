
/*
 * GET home page.
 */
var heroClass = require('../hero');

var mongoose = require('mongoose');
var schema = mongoose.Schema({name: String, base: Number, gain: Number, cost: Number});
var HeroModel = mongoose.model('HeroModel', schema);

exports.index = function(req, res){
	/*var hero = new heroClass.Hero({ name: 'default', base: 16, gain: 1.8, cost: 140 });
  res.render('index',
  			{ 'title': 'Regen Calc', 'name': hero.name, 'base': hero.base, 'gain': hero.gain, 'cost': hero.cost,
				'levels': hero.getLevels(),
				'inputs': req.body && req.body.inputs,
	}*/
  res.render('index',	{ 'title': 'Regen Calc'	});
};

exports.addhero = function(req, res){
	var stats = req.param('stat');
	var Hero = new HeroModel({ name: stats['name'], base: stats['base'], gain: stats['gain'], cost: stats['cost'] });

	Hero.save(function (err) {
	  if(err) {
	    console.log('Error: ' + err);
	  }
	  console.log('Save successful');
	});

	res.render('index',	{ 'title': 'Hero Saved'	});
};

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