const Category = require('../models/category');


exports.categoryListGET = (req, res, next) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return next(err)
    }
    
    res.render('category-list', {
      title: 'Categories',
      categories: categories
    });
  });
}
