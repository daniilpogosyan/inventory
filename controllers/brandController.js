const Brand = require('../models/brand');
const Item = require('../models/item');

const { body, validationResult } = require('express-validator');


const brandValidator = () => [
  body('name')
    .trim()
    .isLength({min: 3, max: 50})
    .escape()
    .withMessage('"Name" length should be from 3 to 50 characters'),
  body('description')
    .trim()
    .isLength({max: 500})
    .escape()
    .withMessage('Description should not be longer 500 characters')
]

exports.brandListGET = (req, res, next) => {
  Brand.find().exec((err, brands) => {
    if (err) {
      return next(err)
    }
    
    res.render('brand-list', {
      title: 'Brands',
      brands: brands
    });
  });
}

exports.brandDetailGET = (req, res, next) => {
  Promise.all([
    Brand
      .findById(req.params.id)
      .exec(),
    Item.find({brand: req.params.id})
      .populate('category', 'name')
      .populate('brand', 'name')
      .exec()
  ]).then(([brand, itemsOfBrand]) => {
    if (brand == null) {
      const err = new Error('Brand not found');
      err.status = 404;
      return next(err)
    }

    res.render('brand-detail', {
      title: brand.name,
      brand: brand,
      items: itemsOfBrand
    })
  }).catch((err) => {
    next(err);
  })
}

exports.brandFormGET = (req, res, next) => {
  res.render('brand-form', {
    title: "New Brand"
  });
}

exports.brandFormPOST = [
  brandValidator(),
  (req, res, next) => {
    const errors = validationResult(req);
    const brand = new Brand(req.body);

    if (!errors.isEmpty()) {
      res.render('brand-form', {
        title: 'New Brand',
        brand,
        errors: errors.array()
      });
      return;
    }

    brand.save((err, brand) => {
      if (err) {
        return next(err)
      }

      res.redirect(brand.url)
    })
  }
]