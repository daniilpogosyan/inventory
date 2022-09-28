const Brand = require('../models/brand');


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