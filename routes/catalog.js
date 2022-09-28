const express = require('express');
const router = express.Router();

const brandController = require('../controllers/brandController');
const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');

// Get list of brands
router.get('/brands', brandController.brandListGET);

// Get list of categories
router.get('/categories', categoryController.categoryListGET);

// Get list of items
router.get('/items', itemController.itemListGET);


module.exports = router;
