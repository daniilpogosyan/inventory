const express = require('express');
const router = express.Router();

const brandController = require('../controllers/brandController');
const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');

// BRAND ROUTES

// Get list of brands
router.get('/brands', brandController.brandListGET);

// Get the form for creating brand
router.get('/brand/create', brandController.brandFormGET);

// Create a new brand
router.post('/brand/create', brandController.brandFormPOST);

// Get brand creating form prefilled with current data
router.get('/brand/:id/update', brandController.brandUpdateGET);

// Update brand 
router.post('/brand/:id/update', brandController.brandUpdatePOST);

// Delete brand from database
router.post('/brand/:id/delete', brandController.brandDeletePOST);

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

//Get form for item creating
router.get('/item/create', itemController.itemFormGET);

// Create item
router.post('/item/create', itemController.itemFormPOST);

// Get item form prefilled with existing data
router.get('/item/:id/update', itemController.itemUpdateGET);

// Update existing item
router.post('/item/:id/update', itemController.itemUpdatePOST);

// Delete item from database
router.post('/item/:id/delete', itemController.itemDeletePOST);

// Get info page of the item
router.get('/item/:id', itemController.itemDetailGET);


module.exports = router;
