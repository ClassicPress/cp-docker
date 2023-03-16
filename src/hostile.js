const fs = require( 'fs-extra' );
const once = require( 'once' );
const split = require( 'split' );
const through = require( 'through' );
const isWSL = require( 'is-wsl' );

const windows = isWSL;
const EOL = windows
  ? '\r\n'
  : '\n'

const exportHosts = windows
  ? '/mnt/c/Windows/System32/drivers/etc/hosts'
  : '/etc/hosts'

const getHosts = function( filePath, preserveFormatting, callback ) {
  const lines = [];
  if ( typeof callback !== 'function' ) {
    
    fs.readFileSync( filePath, { encoding: 'utf8' }).split(/\r?\n/).forEach( online );   
    return lines;

  }

  callback = once( callback );

  fs.createReadStream( filePath, { encoding: 'utf8' } ).pipe( split() ).pipe( through( online ) ).on( 'close', function() {
      callback( null, lines )
  } ).on( 'error', callback );

  function online( line ) {
    
    const lineSansComments = line.replace( /#.*/, '' );
    
    const matches = /^\s*?(.+?)\s+(.+?)\s*$/.exec( lineSansComments );

    if ( matches && matches.length === 3 ) {

      const ip = matches[1];
      const host = matches[2];
      lines.push([ ip, host ] );

    } else {
      if ( preserveFormatting ) {
        lines.push( line );
      }
    }
  }
};

const writeFile = function( lines, callback ) {
  lines = lines.map( function( line, lineNum ) {
    if ( Array.isArray( line ) ) {
      line = line[0] + ' ' + line[1];
    }
    
    return line + ( lineNum === lines.length -1 ? '' : EOL )
  } );

  if ( typeof callback !== 'function' ) {
    const stat = fs.statSync( exportHosts );

    fs.writeFileSync( exportHosts, lines.join( '' ), { mode: stat.mode } );

    return true;
  }

  callback = once( callback );

  fs.stat( exportHosts, function ( err, stat ) {
    if ( err ) {
      return callback( err );
    }

    const s = fs.createWriteStream( exportHosts, { mode: stat.mode } );
    s.on( 'close', callback );
    s.on('error', callback);

    lines.forEach( function( data ) {
      s.write( data )
    } );

    s.end();
  })

};

const get = function( preserveFormatting, callback ) {
  return getHosts( exportHosts, preserveFormatting, callback );
};

const set = function( ip, host, callback ) {
  let update = false;

  if ( typeof callback !== 'function' ) {
    return _set( exports.get( true ) );
  }

  get( true, function( err, lines ) {
    if ( err ) {
      return callback( err );
    } 

    _set( lines );
  } );

  function _set( lines ) {

    lines = lines.map( mapFunc );

    if ( ! update ) {

      const lastLine = lines[ lines.length - 1 ];
      if ( typeof lastLine === 'string' && /\s*/.test( lastLine ) ) {
        lines.splice( lines.length - 1, 0, [ ip, host ] );
      } else {
        lines.push([ ip, host ] );
      }
    }

    writeFile( lines, callback );
  }

  function mapFunc( line ) {
    
    if ( Array.isArray( line ) && line[1] === host ) {
      line[0] = ip;
      update = true;
    }
    return line;
  }
}

const remove = function( ip, host, callback ) {
  if ( typeof callback !== 'function' ) {
    return _remove( exports.get( true ) );
  }

  get( true, function( err, lines ) {
    if ( err ) {
      return callback( err );
    } 

    _remove( lines )
  } );

  function _remove( lines ) {
    lines = lines.filter( filterFunc );
    return writeFile( lines, callback );
  }

  function filterFunc( line ) {
    return ! ( Array.isArray( line ) && line[0] === ip && line[1] === host );
  }
};

module.exports = { get, remove, set };