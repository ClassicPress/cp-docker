#!/usr/bin/env node

const path = require( 'path' );
const rootPath = path.dirname( __dirname );
const globalPath = path.join( `${rootPath}/.global` );
const certsPath = path.join( `${rootPath}/certificates` );
const configPath = path.join( `${rootPath}/config` );
const databasePath = path.join( `${rootPath}/databases` );
const logsPath = path.join( `${rootPath}/logs` );
const srcPath = path.join( `${rootPath}/src` );
const sitesPath = path.join( `${rootPath}/sites` );
const composeFile = path.join( `${globalPath}/docker-compose.yml` );
const settingFile = path.join( `${globalPath}/.settings.yml` );
const customFile = path.join( `${globalPath}/custom.yml`);

const setRootPath = function() {
    return rootPath;
};

const setGlobalPath = function() {
    return globalPath;
};

const setCertsPath = function() {
    return certsPath;
};

const setConfigPath = function() {
    return configPath;
};

const setDatabasesPath = function() {
    return databasePath;
};

const setLogsPath = function() {
    return logsPath;
};

const setSitesPath = function() {
    return sitesPath;
};

const setSrcPath = function() {
    return srcPath;
};

const setComposeFile = function() {
	return composeFile;
};

const setSettingFile = function() {
	return settingFile;
};

const setCustomFile = function() {
	return customFile;
};

module.exports = { setRootPath, setGlobalPath, setCertsPath, setConfigPath, setDatabasesPath, setLogsPath, setSitesPath, setSrcPath, setComposeFile, setSettingFile, setCustomFile };
