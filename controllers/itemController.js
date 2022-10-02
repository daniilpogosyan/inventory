const Item = require('../models/item');
const Brand = require('../models/brand');
const Category = require('../models/category');

const { body, validationResult } = require('express-validator');

const itemValidator = () => [
  body('name')
    .trim()
    .isLength({min: 3, max: 50})
    .escape()
    .withMessage('Name should contain from 3 to 50 alpha-numerical characters'),
  body('description')
    .trim()
    .isLength({max: 500})
    .escape()
    .withMessage('Description can contain up to 500 alpha-numerical characters'),
  body('brand')
    .escape(),
  body('category')
    .customSanitizer((category) => {
      // Tranformation to an instance of Array is required
      // since some array methods [ some(..) ] are used in the template item-form.pug
      
      if (!Array.isArray(category)) {
        return [category];
      }
      if (category == undefined) {
        return [];
      }
      return category
    }),
  body('price')
    .escape()
    .exists()
    .isFloat({min: 0.01})
    .withMessage('Price should be a number greater than or equal to 0.01'),
    body('numberInStock')
    .escape()
    .exists()
    .isInt({min: 0})
    .withMessage('Number in stock should be a positive integer or zero')
  ];

exports.itemListGET = (req, res, next) => {
  Item
  .find()
  .populate('brand', 'name')
  .populate('category', 'name')
  .exec((err, items) => {
    if (err) {
      return next(err)
    }
    
    res.render('item-list', {
      title: 'Items',
      items: items
    })
  })
}

exports.itemDetailGET = (req, res, next) => {
  Item
  .findById(req.params.id)
  .populate('brand', 'name')
  .populate('category', 'name')
  .exec((err, item) => {
    if (err) {
      return next(err);
    }

    if (item === null) {
      const err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }

    res.render('item-detail', {
      title: item.name,
      item
    });
  })
}

exports.itemFormGET = (req, res, next) => {
  Promise.all([
    Category.find().exec(),
    Brand.find().exec()
  ])
  .then(([categories, brands]) => {
    res.render('item-form', {
      title: 'New Item',
      brands,
      categories
    })
  })
  .catch((err) => {
    next(err);
  }) 
}

exports.itemFormPOST = [
  itemValidator(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Promise.all([
        Category.find().exec(),
        Brand.find().exec()
      ])
      .then(([categories, brands]) => {
        res.render('item-form', {
          title: 'New Item',
          item: req.body,
          categories,
          brands,
          errors: errors.array()
        })
      });
      return;
    }

    Item.create(req.body, (err, item) => {
      if (err) {
        return next(err);
      }
      res.redirect(item.url);
    })
  }
]

exports.itemUpdateGET = (req, res, next) => {
  Promise.all([
    Category.find().exec(),
    Brand.find().exec(),
    Item.findById(req.params.id).exec()
  ]).then(([categories, brands, item]) => {
    if (item === null) {
      const err = new Error('Item not found');
      err.status = 404;
      return next(err);
    }
    res.render('item-form', {
      title: 'Update Item',
      categories,
      brands,
      item
    })
  })
  .catch(err => {
    next(err);
  })
}

exports.itemUpdatePOST = [
  itemValidator(),
  (req, res, next) => {
    const errors = validationResult(req);

    const leanItem = req.body;

    if (!errors.isEmpty()) {
      Promise.all([
        Category.find().exec(),
        Brand.find().exec()
      ]).then(([categories, brands]) => {
        res.render('item-form', {
          title: 'Update Item',
          item: leanItem,
          categories,
          brands,
          errors: errors.array()
        });
      })
      .catch(err => {
        next(err);
      })
      return;
    }

    Item.findByIdAndUpdate(req.params.id, leanItem, {}, (err, item) => {
      if (err) {
        return next(err);
      }
      res.redirect(item.url);
    });    
  }
]

exports.itemDeletePOST = (req, res, next) => {
  Item.findByIdAndDelete(req.params.id).exec((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/catalog/items');
  })
}