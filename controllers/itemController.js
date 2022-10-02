const Item = require('../models/item');


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
