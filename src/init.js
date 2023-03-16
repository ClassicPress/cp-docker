#!/usr/bin/env node

const path			 = require( '../src/configure' );
const commands       = require( './commands' );
const replace        = require( 'replace-in-file' );
const getConfigPath  = path.setConfigPath();
const getGlobalPath  = path.setGlobalPath();
const getCustomFile  = path.setCustomFile();

const fs = require( 'fs-extra' );

const command = async function() {
    const dev = commands.subcommand();

    if ( dev == 'local' ) {
        const options = { files: '.global/.settings.yml', from: /true/g, to: 'false', };
        replace( options );

        if ( ! fs.existsSync( `${getCustomFile}` ) ) {
            fs.copyFileSync( `${getConfigPath}/local.yml`, `${getGlobalPath}/custom.yml` );
        }
    } else if ( dev == 'live') {
        const options = { files: '.global/.settings.yml', from: /false/g, to: 'true', };
        replace( options );

        if ( ! fs.existsSync( `${getCustomFile}` ) ) {
            fs.copyFileSync( `${getConfigPath}/live.yml`, `${getGlobalPath}/custom.yml` );
        }
    }
}

module.exports = { command };



