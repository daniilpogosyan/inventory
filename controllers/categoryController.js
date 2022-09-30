const { body, validationResult } = require('express-validator');


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

exports.categoryFormGET = (req, res, next) => {
  res.render('category-form', {
    title: "New Category",
  })
}

exports.categoryFormPOST = [
  body('name')
    .trim()
    .isLength({min: 3, max: 50})
    .escape()
    .withMessage('"Name" length should be from 3 to 50 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(errors.array());
    }

    const category = new Category({
      name: req.body.name
    });
    category.save((err, category) => {
      if (err) {
        return next(err)
      }
      
      res.redirect(category.url)
    })
  }
]