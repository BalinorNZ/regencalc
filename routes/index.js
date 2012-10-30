
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express', base: '16', gain: '1.8', hi: 'bye' });
};

exports.about = function(req, res){
  res.render('index', { title: 'About', base: '21', gain: '3.2', hi: 'bye'  })
};