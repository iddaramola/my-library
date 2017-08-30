var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');

// Display list of all BookInstances
/*
exports.bookinstance_list = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance list');
};
*/
// Display list of all BookInstances
exports.bookinstance_list = function(req, res, next) {

  BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });

};

// Display detail page for a specific BookInstance
exports.bookinstance_detail = function(req, res, next) {

  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('bookinstance_detail', { title: 'Book:', bookinstance: bookinstance });
    });

};

// Display BookInstance create form on GET
exports.bookinstance_create_get = function(req, res, next) {

    Book.find({},'title')
    .exec(function (err, books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('bookinstance_form', {title: 'Create Copy', book_list:books});
    });

};

// Handle BookInstance create on POST
exports.bookinstance_create_post = function(req, res, next) {

    req.checkBody('book', 'Book must be specified').notEmpty(); //We won't force Alphanumeric, because book titles might have spaces.
    req.checkBody('imprint', 'Imprint must be specified').notEmpty();
    req.checkBody('due_back', 'Invalid date').optional({ checkFalsy: true }).isDate();

    req.sanitize('book').escape();
    req.sanitize('imprint').escape();
    req.sanitize('status').escape();
    req.sanitize('book').trim();
    req.sanitize('imprint').trim();
    req.sanitize('status').trim();
    req.sanitize('due_back').toDate();

    var bookinstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back
    });

    var errors = req.validationErrors();
    if (errors) {
       //fetch all books. the logic in the template will determine which of the books
        Book.find({},'title')
        .exec(function (err, books) {
          if (err) { return next(err); }
          //Successful, so render
          res.render('bookinstance_form', { title: 'Create BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors, bookinstance:bookinstance });
        });
        return;
    }
    else {
    // Data from form is valid

        bookinstance.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to new book-instance record.
               res.redirect(bookinstance.url);
            });
    }

};

// Display BookInstance delete form on GET
exports.bookinstance_delete_get = function(req, res, next) {
    //res.send('NOT IMPLEMENTED: BookInstance delete GET');

    BookInstance.findById(req.params.id).populate('book').exec(function (err, bookinstance) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('bookinstance_delete', { title: 'Delete BookInstance', bookinstance:  bookinstance});
    })


};

// Handle BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res) {
    //res.send('NOT IMPLEMENTED: BookInstance delete POST');
    BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err) {
        if (err) { return next(err); }
        //Success - got to bookinstnaces list
        res.redirect('/catalog/bookinstances');
    });
};

// Display BookInstance update form on GET
exports.bookinstance_update_get = function(req, res, next) {
    //res.send('NOT IMPLEMENTED: BookInstance update GET');

        req.sanitize('id').escape();
        req.sanitize('id').trim();

        async.parallel({
          bookinstance: function(callback) {
              BookInstance.findById(req.params.id).populate('book').exec(callback);
          },
             books: function(callback) {
              Book.find(callback);
          }
        },  function(err, results){
              if (err) { return next(err); }

              res.render('bookinstance_form', {title: 'Update Copy', bookinstance:results.bookinstance, book_list:results.books})
        })
};

// Handle bookinstance update on POST
exports.bookinstance_update_post = function(req, res, next) {
    //res.send('NOT IMPLEMENTED: BookInstance update POST');

    req.sanitize('id').escape();
    req.sanitize('id').trim();

    req.checkBody('book', 'Book must be specified').notEmpty(); //We won't force Alphanumeric, because book titles might have spaces.
    req.checkBody('imprint', 'Imprint must be specified').notEmpty();
    req.checkBody('due_back', 'Invalid date').optional({ checkFalsy: true }).isDate();

    req.sanitize('book').escape();
    req.sanitize('imprint').escape();
    req.sanitize('status').escape();
    req.sanitize('book').trim();
    req.sanitize('imprint').trim();
    req.sanitize('status').trim();
    req.sanitize('due_back').toDate();

    var bookinstance = new BookInstance({
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back,
        _id: req.params.id
    });

    var errors = req.validationErrors();
    if (errors) {

        Book.find({},'title')
        .exec(function (err, books) {
          if (err) { return next(err); }
          //Successful, so render
          //res.render('bookinstance_form', { title: 'Update BookInstance', book_list : books, selected_book : bookinstance.book._id , errors: errors, bookinstance:bookinstance });
          res.render('bookinstance_form', { title: 'Update Copy', book_list : books, selected_book : bookinstance.book._id , errors: errors, bookinstance:bookinstance });
        });
        return;
    }
    else {
    // Data from form is valid
        BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function(err, thecopy){
          if (err) return next(err);
          //if program execution reaches here, that means the document was successfully updated
          res.redirect(thecopy.url);
        })

    }
};
