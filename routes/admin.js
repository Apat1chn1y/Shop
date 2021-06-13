const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth1 = require('../middleware/is-auth1');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth1, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth1, adminController.getProducts);

// /admin/add-product => POST
router.post(
  '/add-product',
  [ body('categorie')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth1,
  adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth1, adminController.getEditProduct);

router.post(
  '/edit-product',
  [ body('categorie')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  isAuth1,
  adminController.postEditProduct
);

router.post('/delete-product', isAuth1, adminController.postDeleteProduct);

module.exports = router;
