#!/usr/bin/env node

// Here, we have the basic paths to different directory without the need to
// reconfigured, just extended if necessary. Some of these may not needed will
// be taken out later once this project is complete.
const path = require( './configure' );
const { execSync } = require( 'child_process' );
const fs = require( 'fs-extra' );
const yaml = require( 'js-yaml' );
const getCustomFile = path.setCustomFile();
const getSettingFile = path.setSettingFile();
const isWSL = require( 'is-wsl' );

const setting = yaml.load( fs.readFileSync ( `${getSettingFile}`, 'utf-8' ));
const config = yaml.load( fs.readFileSync( `${getCustomFile}`, 'utf8' ) );
const sites_defaults = Object.entries( config.sites );
const production = setting.settings.production;

const wsl_host = function() {
	if ( production == false ) {
		if ( isWSL ) {
			for ( const [ name, value ] of sites_defaults ) {
				const provision = value.provision;
				const hosts = value.host;

				for ( const host of hosts ) {
					if ( provision == true ) {
						if ( host.endsWith( '.test' ) ) {
							execSync( `cpdocker-hosts remove ${host}` );
						}
					}
				}
			}
		} else {
			for ( const [ name, value ] of sites_defaults ) {
				const provision = value.provision;
				const hosts = value.host;

				for ( const host of hosts ) {
					if ( provision == true ) {
						if ( host.endsWith( '.test' ) ) {
							execSync( `sudo cpdocker-hosts remove ${host}` );
						}
					}
				}
			}
		}
	}
};

module.exports = { wsl_host };
