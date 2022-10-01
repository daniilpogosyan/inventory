const express = require('express');
const router = express.Router();

const brandController = require('../controllers/brandController');
const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');

// BRAND ROUTES

// Get list of brands
router.get('/brands', brandController.brandListGET);

// Get info page of the brand
router.get('/brand/:id', brandController.brandDetailGET)


// CATEGORY ROUTES

// Get list of categories
router.get('/categories', categoryController.categoryListGET);

// Get the form for creating category
router.get('/category/create', categoryController.categoryFormGET);

// Get info page of the category
router.get('/category/:id', categoryController.categoryDetailGET)

// Get the form for creating category, but with the prefilled data
router.get('/category/:id/update', categoryController.categoryUpdateGET)

// Update category from the form data
router.post('/category/:id/update', categoryController.categoryUpdatePOST)

// Delete category from database
router.post('/category/:id/delete', categoryController.categoryDeletePOST)

// Create category from the form data
router.post('/category/create', categoryController.categoryFormPOST);


// ITEM ROUTES

// Get list of items
router.get('/items', itemController.itemListGET);


module.exports = router;
