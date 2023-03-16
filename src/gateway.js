#!/usr/bin/env node

const path = require( "../src/configure" );
const getConfigPath = path.setConfigPath();
const getGlobalPath = path.setGlobalPath();
const getComposeFile = path.setComposeFile();
const getCustomFile = path.setCustomFile();

const { execSync } = require( 'child_process' );
const { resolve } = require("path");

let started = false;

const startGateway = async function () {
	execSync( `docker-compose -f ${getComposeFile} up -d 2>/dev/null` );
	execSync( `sleep 1` )
}

const startGlobal = async function () {
	if ( started === true ) {
		return;
	}
	await startGateway();
	started = true;
}

module.exports = { startGateway, startGlobal };
