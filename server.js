'use strict';

require( 'dotenv' ).config();

const express =  require( 'express' );
const server = express();
const superagent = require( 'superagent' );
const pg = require( 'pg' );
const path = require( 'path' );


const PORT = process.env.PORT || 3030;
const client = new pg.Client( { connectionString: process.env.DATABASE_URL , ssl: { rejectUnauthorized: false }} );
server.set( 'views', path.join( __dirname, '/views/pages' ) );
server.set( 'view engine','ejs' );
server.use( express.static( './public/' ) );
server.use( express.urlencoded( {extended:true} ) );

server.get( '/', handleHome );
server.get( '/searches/new', newSearch );
server.post( '/searches',handelBooks );
server.get( '/books/:id',detailedBooks );

server.post( '/books' , bookChosen );

function handleHome( req,res ){

  let SQL = 'SELECT * FROM books;';

  client.query( SQL )
    .then( booksDB =>{
      // console.log( booksDB );

      res.render( 'index.ejs',{booksArr:booksDB.rows} );
    } ).catch(
      err=> {res.send( err );} );



}

function newSearch( req,res ){
  res.render( './searches/new.ejs' );

}

function handelBooks( req,res ){
  let dataUsedArray = [];
  let search = req.body.search;
  let term = req.body.searchOption;
  let url = `https://www.googleapis.com/books/v1/volumes?q=+${term}:${search}`;
  superagent.get( url )
    .then( data =>{
      let dataUsed = data.body.items;
      dataUsedArray = dataUsed.map( book=>{ return new Book( book ); } );
      // console.log( dataUsedArray );

      // res.send( dataUsedArray );
      res.render( './searches/show.ejs', {booksArr:dataUsedArray} );

    } );


}

function detailedBooks( req,res ){



  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let safeValue = [req.params.id[0]] ;
  // console.log( safeValue );

  client.query( SQL,safeValue )
    .then( booksDB =>{
      // console.log( booksDB );

      res.render( './books/show.ejs',{book:booksDB.rows[0]} );
    } ).catch(
      err=> {res.send( err );} );



}

function bookChosen( req,res ){
  // console.log( req.body );
  let SQL = 'INSERT INTO books (author ,title,isbn,categories,image_url,description)  VALUES ($1,$2,$3,$4,$5,$6) RETURNING *; ';
  let safeValues = [req.body.author , req.body.title , req.body.isbn,req.body.categories, req.body.image_url, req.body.description];
  client.query( SQL,safeValues )
    .then( data =>{
      let idChosen = data.rows[0].id;
      res.redirect( `/books/${idChosen}` );
    } );


}


function Book( result ){

  this.title = result.volumeInfo.title || 'N/A';
  if( result.volumeInfo.authors ){
    this.authors = result.volumeInfo.authors.join( ' , ' );
  }else{this.authors = 'N/A'; }
  this.img = ( result.volumeInfo.imageLinks ) ? result.volumeInfo.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
  this.description = result.volumeInfo.description || 'N/A' ;
  this.isbn = ( result.volumeInfo.industryIdentifiers ) ? `${result.volumeInfo.industryIdentifiers[0].type}: ${result.volumeInfo.industryIdentifiers[0].identifier} ` : 'ISBN N\A';
  this.categories = ( result.volumeInfo.categories ) ? result.volumeInfo.categories.join( ' , ' ) : 'N/A' ;



}

server.get( '*',( req,res ) =>{

  let errObj = {
    status: 500,
    responseText: 'Sorry, something went wrong'
  };
  res.status( 500 ).send( errObj );

} );

client.connect()
  .then( () => {
    server.listen( PORT, () => console.log( `Listening on port: ${PORT}` ) );
  } );
