const Brand = require('../models/brand');
const Item = require('../models/item');

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
