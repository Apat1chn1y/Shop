const Product = require('../models/product');
const Order = require('../models/order');
const Mail = require('nodemailer/lib/mailer');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const ITEMS_PER_PAGE = 4;

// function countPR(arr){return arr.length}
exports.getProducts = (req, res, next) => {
  if (req.session.isLoggedIn == true){
  const page = +req.query.page || 1;
  let totalItems;
  // let {categorie} = req.body
  Product.find({price: {$ne: 0}})
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return (Product.find({price: {$ne: 0}})
      // To sort in descending order (newest at top of list)
      // .sort({ _id: -1 })
      // skip MongoDB and therefore Mongoose method skips first x amt of results and is called on a cursor. find() is an object that returns a cursor, an object that enables iterating through documents of a collection
      .skip((page - 1) * ITEMS_PER_PAGE)
      // Only fetch amt of items to display on current page
      .limit(ITEMS_PER_PAGE)
  );

    })
    .then(products => {
      
      
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });}else{
      const page = +req.query.page || 1;
      let totalItems;
      // let {categorie} = req.body
      Product.find({prices: {$ne: 0}})
        .countDocuments()
        .then(numProducts => {
          totalItems = numProducts;
          return (Product.find({prices: {$ne: 0}})
          // To sort in descending order (newest at top of list)
          // .sort({ _id: -1 })
          // skip MongoDB and therefore Mongoose method skips first x amt of results and is called on a cursor. find() is an object that returns a cursor, an object that enables iterating through documents of a collection
          .skip((page - 1) * ITEMS_PER_PAGE)
          // Only fetch amt of items to display on current page
          .limit(ITEMS_PER_PAGE)
      );
    
        })
        .then(products => {
          
          
          
          res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products',
            path: '/products',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });

    }
};



exports.getProductsA = (req, res, next) => {
  if (req.session.isLoggedIn == true){
  const page = +req.query.page || 1;
  let totalItems;
  // let {categorie} = req.body
  Product.find({categorie: 'Anime', price: {$ne: 0}})
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return (Product.find({categorie: 'Anime', price: {$ne: 0}})
      // To sort in descending order (newest at top of list)
      // .sort({ _id: -1 })
      // skip MongoDB and therefore Mongoose method skips first x amt of results and is called on a cursor. find() is an object that returns a cursor, an object that enables iterating through documents of a collection
      .skip((page - 1) * ITEMS_PER_PAGE)
      // Only fetch amt of items to display on current page
      .limit(ITEMS_PER_PAGE)
  );

    })
    .then(products => {
      
      
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products Anime',
        path: '/products/Anime',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });}else{const page = +req.query.page || 1;
      let totalItems;
      // let {categorie} = req.body
      Product.find({categorie: 'Anime', prices: {$ne: 0}})
        .countDocuments()
        .then(numProducts => {
          totalItems = numProducts;
          return (Product.find({categorie: 'Anime', prices: {$ne: 0}})
          // To sort in descending order (newest at top of list)
          // .sort({ _id: -1 })
          // skip MongoDB and therefore Mongoose method skips first x amt of results and is called on a cursor. find() is an object that returns a cursor, an object that enables iterating through documents of a collection
          .skip((page - 1) * ITEMS_PER_PAGE)
          // Only fetch amt of items to display on current page
          .limit(ITEMS_PER_PAGE)
      );
    
        })
        .then(products => {
          
          
          res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products Anime',
            path: '/products/Anime',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });


    }
};


exports.getProductsM = (req, res, next) => {
  if (req.session.isLoggedIn == true){
  const page = +req.query.page || 1;
  let totalItems;
  // let {categorie} = req.body
  Product.find({categorie: 'Manga', price: {$ne: 0}})
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return (Product.find({categorie: 'Manga', price: {$ne: 0}})
      // To sort in descending order (newest at top of list)
      // .sort({ _id: -1 })
      // skip MongoDB and therefore Mongoose method skips first x amt of results and is called on a cursor. find() is an object that returns a cursor, an object that enables iterating through documents of a collection
      .skip((page - 1) * ITEMS_PER_PAGE)
      // Only fetch amt of items to display on current page
      .limit(ITEMS_PER_PAGE)
  );

    })
    .then(products => {
      
      
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products Manga',
        path: '/products/Manga',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });}else{ const page = +req.query.page || 1;
      let totalItems;
      // let {categorie} = req.body
      Product.find({categorie: 'Manga', prices: {$ne: 0}})
        .countDocuments()
        .then(numProducts => {
          totalItems = numProducts;
          return (Product.find({categorie: 'Manga', prices: {$ne: 0}})
          // To sort in descending order (newest at top of list)
          // .sort({ _id: -1 })
          // skip MongoDB and therefore Mongoose method skips first x amt of results and is called on a cursor. find() is an object that returns a cursor, an object that enables iterating through documents of a collection
          .skip((page - 1) * ITEMS_PER_PAGE)
          // Only fetch amt of items to display on current page
          .limit(ITEMS_PER_PAGE)
      );
    
        })
        .then(products => {
          
          
          res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products Manga',
            path: '/products/Manga',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });


    }
};


exports.getProductsF = (req, res, next) => {
  if (req.session.isLoggedIn == true){
  const page = +req.query.page || 1;
  let totalItems;
  // let {categorie} = req.body
  Product.find({categorie: 'Figure', price: {$ne: 0}})
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return (Product.find({categorie: 'Figure', price: {$ne: 0}})
      // To sort in descending order (newest at top of list)
      // .sort({ _id: -1 })
      // skip MongoDB and therefore Mongoose method skips first x amt of results and is called on a cursor. find() is an object that returns a cursor, an object that enables iterating through documents of a collection
      .skip((page - 1) * ITEMS_PER_PAGE)
      // Only fetch amt of items to display on current page
      .limit(ITEMS_PER_PAGE)
  );

    })
    .then(products => {
      
      
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products Figure',
        path: '/products/Figure',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });}else{const page = +req.query.page || 1;
      let totalItems;
      // let {categorie} = req.body
      Product.find({categorie: 'Figure', prices: {$ne: 0}})
        .countDocuments()
        .then(numProducts => {
          totalItems = numProducts;
          return (Product.find({categorie: 'Figure', prices: {$ne: 0}})
          // To sort in descending order (newest at top of list)
          // .sort({ _id: -1 })
          // skip MongoDB and therefore Mongoose method skips first x amt of results and is called on a cursor. find() is an object that returns a cursor, an object that enables iterating through documents of a collection
          .skip((page - 1) * ITEMS_PER_PAGE)
          // Only fetch amt of items to display on current page
          .limit(ITEMS_PER_PAGE)
      );
    
        })
        .then(products => {
          
          
          res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products Figure',
            path: '/products/Figure',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
          });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });


    }
};



exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.getCart = (req, res, next) => {
  
  
  if (req.user){
  console.log(req.user)
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });}else{
      req.sess
      .populate('cart.items.productId')
      .execPopulate()
      .then(sess => {
        const products = sess.cart.items;
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
    }
};

// exports.getsCart = (req, res, next) => {
//   req.session
//     .populate('cart.items.productId')
//     .execPopulate()
//     .then(session => {
//       const products = session.cart.items;
//       res.render('shop/cart', {
//         path: '/cart',
//         pageTitle: 'Your Cart',
//         products: products
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };
//////////
exports.postCart = (req, res, next) => {
  console.log('req.user in postcart', req.user)
  if (req.user){
  
    console.log('post user')
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      req.sess.addsToCart(product);
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });}else{
      console.log('post sess', req.sess)
      const prodId = req.body.productId;
      Product.findById(prodId)
        .then(product => {
          return req.sess.addsToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
    }
};

// exports.postsCart = (req, res, next) => {
  
//   const prodId = req.body.productId;
//   Product.findById(prodId)
//     .then(product => {
//       return req.session.addToCart(product);
//     })
//     .then(result => {
//       console.log(result);
//       res.redirect('/products');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  if (req.user){
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });}else{
      req.sess
    .removesFromsCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
    }
};

// exports.postsCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.session
//     .removeFromCart(prodId)
//     .then(result => {
//       res.redirect('/cart');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

exports.getCheckout = (req, res, next) => {
  if (req.user){
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      let total = 0;
      products.forEach(p => {

        total += p.quantity * p.productId.price; 
      });
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });}else{
      req.sess
      .populate('cart.items.productId')
      .execPopulate()
      .then(sess => {
        const products = sess.cart.items;
        let total = 0;
        products.forEach(p => {
          total += p.quantity * p.productId.prices; 
      });
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
    }
}

// exports.getCheckout = (req, res, next) => {
//   req.session
//     .populate('cart.items.productId')
//     .execPopulate()
//     .then(session => {
//       const products = session.cart.items;
//       let total = 0;
//       products.forEach(p => {
//         total += p.quantity * p.productId.price; 
//       });
//       res.render('shop/checkout', {
//         path: '/checkout',
//         pageTitle: 'Checkout',
//         products: products,
//         totalSum: total
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// }

exports.postOrder = (req, res, next) => {
  if (req.user){
  
  console.log('post user')
  const token = req.body.stripeToken; // Using Express
  let totalSum = 0;

  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {  
      user.cart.items.forEach(p => {
        totalSum += p.quantity * p.productId.price;
      });

      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      const charge = stripe.charges.create({
        amount: totalSum * 100,
        currency: 'usd',
        description: 'Demo Order',
        source: token,
        metadata: { order_id: result._id.toString() }
      });
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });}else{
      console.log('post sess')
  
  const token = req.body.stripeToken; // Using Express
  let totalSum = 0;

  req.sess
    .populate('cart.items.productId')
    .execPopulate()
    .then(sess => {  
      sess.cart.items.forEach(p => {
        totalSum += p.quantity * p.productId.prices;
      });

      const products = sess.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
    })
    .then(result => {
      const charge = stripe.charges.create({
        amount: totalSum * 100,
        currency: 'usd',
        description: 'Demo Order',
        source: token,
        metadata: { order_id: result._id.toString() }
      });
      return req.sess.clearsCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
    }
};

// exports.postsOrder = (req, res, next) => {
  
  
//   const token = req.body.stripeToken; // Using Express
//   let totalSum = 0;

//   req.session
//     .populate('cart.items.productId')
//     .execPopulate()
//     .then(session => {  
//       session.cart.items.forEach(p => {
//         totalSum += p.quantity * p.productId.price;
//       });

//       const products = session.cart.items.map(i => {
//         return { quantity: i.quantity, product: { ...i.productId._doc } };
//       });
//     })
//     .then(result => {
//       const charge = stripe.charges.create({
//         amount: totalSum * 100,
//         currency: 'usd',
//         description: 'Demo Order',
//         source: token,
//         metadata: { order_id: result._id.toString() }
//       });
//       return req.session.clearCart();
//     })
//     .then(() => {
//       res.redirect('/orders');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
