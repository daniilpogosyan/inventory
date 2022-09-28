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