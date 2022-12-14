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

exports.brandUpdateGET = (req, res, next) => {
  Brand.findById(req.params.id).exec((err, brand) => {
    if (err) {
      return next(err);
    }

    if (brand === null) {
      const err = new Error('Brand not found');
      err.status = 404;
      return next(err);
    }

    res.render('brand-form', {
      title: 'Update Brand',
      brand
    })
  })
}

exports.brandUpdatePOST = [
  brandValidator(),
  (req, res, next) => {
    const errors = validationResult(req);

    // plain js object that contains brand data
    const leanBrand = req.body;

    if (!errors.isEmpty()) {
      res.render('brand-form', {
        title: 'Update Brand',
        brand: leanBrand,
        errors: errors.array()
      });
      return
    }

    Brand.findByIdAndUpdate(req.params.id, {...leanBrand}, {}, (err, brand) => {
      if (err) {
        return next(err);
      }
      res.redirect(brand.url);
    })
  }
]


exports.brandDeletePOST = (req, res, next) => {
  Item.find({brand: req.params.id}).exec((err, items) => {
    if (err) {
      return next(err)
    }

    if (items.length > 0) {
      const err = new Error(`There are items from this brand in database`);
      err.status = 500;
      return next(err);
    }

    Brand.findByIdAndDelete(req.params.id).exec((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/catalog/brands');
    })
  })
}
