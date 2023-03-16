#!/usr/bin/env node

const hostile = require( '../src/hostile' );
const commands = require( '../src/commands' );
const split = require('split');

const add = function( host ) {
    hostile.set( `127.0.0.1`, `${host}`, function( error ) {
        if ( error ) {
            throw error;
        }
    } );
}

const remove = function( host ) {
    hostile.remove( `127.0.0.1`, `${host}`, function( error ) {
        if ( error ) {
            throw error;
        }
    } );
}

const command = function() {
    let mode = commands.command();
    let args = commands.commandArgs( false );

    switch( mode ) {
        case 'add':
            add( args );
            break;
        case 'remove':
            remove( args );
            break;
        default:
            console.error( "Invalid hosts command" );
            break;
    }
};
command();
