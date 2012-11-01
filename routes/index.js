
/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log(req.url);
  res.render('index', { title: 'Regen Calc', base: 16, gain: 1.8, cost: 140,
		colors: [ { name: 'Red' }, { name: 'Blue' }, { name: 'Green' } ] })
};

exports.about = function(req, res){
	console.log(req.url);
  res.render('index', { title: 'About', base: 21, gain: 3.2, hi: 'bye'  })
};