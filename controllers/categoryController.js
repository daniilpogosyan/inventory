const { body, validationResult } = require('express-validator');


const Category = require('../models/category');
const Item = require('../models/item');

const categoryValidator = () => {
  return body('name')
    .trim()
    .isLength({min: 3, max: 50})
    .escape()
    .withMessage('"Name" length should be from 3 to 50 characters')
}

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

exports.categoryDetailGET = (req, res, next) => {
  Promise.all([
    Category
      .findById(req.params.id)
      .exec(),
    Item.find({category: req.params.id})
      .populate('category', 'name')
      .populate('brand', 'name')
      .exec()
  ]).then(([category, itemsOfCategory]) => {
    if (category == null) {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err)
    }

    res.render('category-detail', {
      title: category.name,
      category: category,
      items: itemsOfCategory
    })
  }).catch((err) => {
    next(err);
  })
}

exports.categoryFormGET = (req, res, next) => {
  res.render('category-form', {
    title: "New Category",
  })
}

exports.categoryFormPOST = [
  categoryValidator(),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name
    });

    if (!errors.isEmpty()) {
      res.render('category-form', {
        title: 'New Category',
        category: category,
        errors: errors.array()
      });
      return;
    }

    category.save((err, category) => {
      if (err) {
        return next(err)
      }

      res.redirect(category.url)
    })
  }
]

exports.categoryUpdateGET = (req, res, next) => {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) {
      return next(err)
    }

    if (category === null) {
      const err = new Error('Category not found');
      err.status = 123;
      return next(err);
    }

    res.render('category-form', {
      title: 'Update Category',
      category
    })
  })
}

exports.categoryUpdatePOST = [
  categoryValidator(),
  (req, res, next) => {
    const errors = validationResult(req);
    
    // use lean object instead of mongoose.Document to save memory usage
    const leanCategory = req.body;

    if (!errors.isEmpty()) {
      res.render('category-form', {
        title: 'New Category',
        category: leanCategory,
        errors: errors.array()
      });
      return      
    }

    Category.findByIdAndUpdate(req.params.id, {...req.body}, {}, (err, category) => {
      if (err) {
        return next(err);
      }

      res.redirect(category.url);
    });
  }
]