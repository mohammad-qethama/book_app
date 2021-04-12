'use strict';

require( 'dotenv' ).config();

const express =  require( 'express' );
const server = express();
const superagent = require( 'superagent' );
const path = require( 'path' );

const PORT = process.env.PORT || 3030;
server.set( 'views', path.join( __dirname, '/views/pages' ) );
server.set( 'view engine','ejs' );
server.use( express.static( './public/' ) );
server.use( express.urlencoded( {extended:true} ) );

server.get( '/', handleHome );
server.get( '/searches/new', newSearch );
server.post( '/searches',handelBooks );

function handleHome( req,res ){

  res.render( 'index.ejs' );
}

function newSearch( req,res ){
  res.render( './searches/new.ejs' );

}

function handelBooks( req,res ){
  let dataUsedArray = [];
  let search = req.body.search;
  let term = req.body.searchOption;
  let url = `https://www.googleapis.com/books/v1/volumes?q=${search}+${term}`;
  superagent.get( url )
    .then( data =>{
      let dataUsed = data.body.items;
      dataUsedArray = dataUsed.map( book=>{ return new Book( book ); } );

      //   res.send( dataUsedArray );
      res.render( './searches/show.ejs', {booksArr:dataUsedArray} );

    } );


}


function Book( result ){

  this.title = result.volumeInfo.title || 'N/A';
  if( result.volumeInfo.authors ){
    this.authors = result.volumeInfo.authors.join( ' , ' );
  }else{this.authors = 'N/A'; }
  this.img = result.volumeInfo.imageLinks.thumbnail || 'N/A';
  this.description = result.volumeInfo.description || 'N/A' ;



}

server.get( '*',( req,res ) =>{

  let errObj = {
    status: 500,
    responseText: 'Sorry, something went wrong'
  };
  res.status( 500 ).send( errObj );

} );


server.listen( PORT, ()=>{
  console.log( `Listening on port ${PORT}` );
} );
