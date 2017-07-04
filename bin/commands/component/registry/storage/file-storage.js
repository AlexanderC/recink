'use strict';

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const pify = require('pify');
const AbstractStorage = require('./abstract-storage');

/**
 * File System Registry storage
 */
class FileStorage extends AbstractStorage {
  /**
   * @param {string} path
   */
  constructor(path) {
    super();
    
    this._path = path;
  }
  
  /**
   * @returns {string}
   */
  get path() {
    return this._path;
  }
  
  /**
   * @returns {string}
   */
  get registryFile() {
    return path.join(this.path, FileStorage.REGISTRY_FILE_NAME);
  }
  
  /**
   * @returns {Promise}
   */
  exists() {
    return pify(fse.pathExists)(this.registryFile);
  }
  
  /**
   * @param {string} rawData
   * 
   * @returns {Promise}
   *
   * @private
   */
  _write(rawData) {
    return pify(fse.outputFile)(this.registryFile, rawData);
  }
  
  /**
   * @returns {Promise}
   *
   * @private
   */
  _read() {
    return pify(fs.readFile)(this.registryFile);
  }
  
  /**
   * @returns {string}
   */
  static get REGISTRY_FILE_NAME() {
    return 'registry.json';
  }
}

module.exports = FileStorage;