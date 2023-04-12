/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require("../models").Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      Book.find({}).then(function(data) {
        if (!data) {
          res.json([]);
        } else {
          const formattedData = data.map(function(book) {
            return {
              _id: book._id,
              title: book.title,
              comments: book.comments,
              commentcount: book.comments.length
            }
          })
          res.json(formattedData);
        }
      })
      .catch(function(err) {
        if(err) {
          res.json({});
        }
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) {
        res.send("missing required field title");
        return;
      }
      const newBook = new Book({ title, comments: [] });
      newBook.save()
             .then(function(data) {
              if (!data) {
                res.send("there was an error saving");
              } else {
                res.json({ _id: data._id, title: data.title });
              }
            })
            .catch(function(err) {
              if(err) {
                res.json({ error: "there was an error" });
              }
            })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      Book.deleteMany({}).then(function(data) {
        if (!data) {
          res.send("error");
        } else {
          res.send("complete delete successful");
        }
      })
      .catch(function(err) {
        if (err) {
          res.send("error");
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.findById(bookid).then(function(data) {
        if (!data) {
          res.send("no book exists");
        } else {
          res.json({
            comments: data.comments,
            _id: data._id,
            title: data.title,
            commentcount: data.comments.length
          });
        }
      })
      .catch(function(err) {
        if (err) {
          res.send("error");
        }
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!comment) {
        res.send("missing required field comment");
        return;
      }
      Book.findById(bookid).then(function(data) {
        if (!data) {
          res.send("no book exists");
        } else {
          data.comments.push(comment);
          data.save().then(function(saveData) {
                res.json({
                  comments: saveData.comments,
                  _id: saveData._id,
                  title: saveData.title,
                  commentcount: saveData.comments.length
                });
              })
        }
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      Book.findByIdAndDelete(bookid).then(function(data) {
        if (!data) {
          res.send("no book exists");
        } else {
          res.send("delete successful");
        }
      })
      .catch(function(err) {
        if (err) {
          res.send("error");
        }
      });      
    });
  
};
