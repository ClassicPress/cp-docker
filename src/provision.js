#!/usr/bin/env node

const gateway			= require( '../src/gateway' );
const path				= require( '../src/configure' );
const getConfigPath		= path.setConfigPath();
const getGlobalPath		= path.setGlobalPath();
const getComposeFile	= path.setComposeFile();
const getSettingFile    = path.setSettingFile();
const getCustomFile		= path.setCustomFile();

const fs			= require( 'fs-extra' );
const yaml			= require( 'js-yaml' );
const { execSync } 	= require( 'child_process' );

const setting = yaml.load( fs.readFileSync( `${getSettingFile}`, 'utf8' ) );
const config = yaml.load( fs.readFileSync( `${getCustomFile}`, 'utf8' ) );

const production = setting.settings.production;
const options_defaults = Object.entries( config.options );
const sites_defaults = Object.entries( config.sites );

gateway.startGlobal();

const delHost = require( './delHost' );
delHost.wsl_host();

for ( const [ name, value ] of options_defaults ) {
    if ( name == 'db_restores' ) {
        const custom = '/srv/.global/custom.yml'
        execSync( `docker-compose -f ${getComposeFile} exec mariadb bash /app/databases.sh ` + name + ' ' + value + ' ' + custom, { stdio: 'inherit' } );
    }
}

for ( const [ name, value ] of sites_defaults ) {
    const provision = value.provision;
    const repo = value.repo;
    const host = value.host;
    const type = value.type;
    const dir = `/srv/www/${name}`;
    const custom = `/srv/.global/custom.yml`;

    // execSync( `docker-compose -f ${getComposeFile} exec mariadb bash /app/databases.sh ` + provision + ' ' + type + ' ' + name + ' ' + custom, { stdio: 'inherit' } );
    execSync( `docker-compose -f ${getComposeFile} exec server bash /app/sites.sh ` + name + ' ' + provision + ' ' + repo + ' ' + host + ' ' + type + ' ' +  dir + ' ' + custom, { stdio: 'inherit' } );
}

execSync( `docker-compose -f ${getComposeFile} exec server bash /app/services.sh`, { stdio: 'inherit' } );

const getWSL = require( './addHost' );
getWSL.wsl_host();
