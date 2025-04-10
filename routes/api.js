/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const mongodb = require('mongodb');
const ObjectId = mongoose.Types.ObjectId;

// Create Book Schema
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] }
});

// Create Book Model
const Book = mongoose.model('Book', BookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      try {
        // Find all books and return formatted response
        const books = await Book.find({});
        const formattedBooks = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }));
        return res.json(formattedBooks);
      } catch (err) {
        console.error(err);
        return res.status(500).send('Error fetching books');
      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      
      // Check if title exists
      if (!title) {
        return res.send('missing required field title');
      }
      
      try {
        // Create new book
        const newBook = new Book({ title });
        const savedBook = await newBook.save();
        return res.json({ 
          _id: savedBook._id,
          title: savedBook.title 
        });
      } catch (err) {
        console.error(err);
        return res.status(500).send('Error saving book');
      }
    })
    
    .delete(async function(req, res){
      try {
        // Delete all books
        await Book.deleteMany({});
        return res.send('complete delete successful');
      } catch (err) {
        console.error(err);
        return res.status(500).send('Error deleting books');
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      
      // Validate ObjectId format
      if (!ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      try {
        // Find book by id
        const book = await Book.findById(bookid);
        
        // Check if book exists
        if (!book) {
          return res.send('no book exists');
        }
        
        // Return book with comments
        return res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (err) {
        console.error(err);
        return res.status(500).send('Error finding book');
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      
      // Validate ObjectId format
      if (!ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      // Check if comment exists
      if (!comment) {
        return res.send('missing required field comment');
      }
      
      try {
        // Find book and update with new comment
        const book = await Book.findByIdAndUpdate(
          bookid,
          { $push: { comments: comment } },
          { new: true } // Return updated document
        );
        
        // Check if book exists
        if (!book) {
          return res.send('no book exists');
        }
        
        // Return updated book
        return res.json({
          _id: book._id,
          title: book.title,
          comments: book.comments
        });
      } catch (err) {
        console.error(err);
        return res.status(500).send('Error updating book');
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      
      // Validate ObjectId format
      if (!ObjectId.isValid(bookid)) {
        return res.send('no book exists');
      }
      
      try {
        // Find and delete book
        const result = await Book.findByIdAndDelete(bookid);
        
        // Check if book was found and deleted
        if (!result) {
          return res.send('no book exists');
        }
        
        return res.send('delete successful');
      } catch (err) {
        console.error(err);
        return res.status(500).send('Error deleting book');
      }
    });
  
};