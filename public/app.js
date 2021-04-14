'use strict';

$( document ).ready( function(){

  console.log( 'js is alive!!' );
  $( '#editForm' ).hide();

  $( '#updateBtn' ).on( 'click', function(){
    console.log( 'hello' );

    $( '#editForm' ).toggle();

  } );


} );

