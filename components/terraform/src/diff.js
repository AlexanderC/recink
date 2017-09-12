'use strict';

const Env = require('recink/src/helper/env');
const execa = require('execa');
const path = require('path');

class Diff {
  /**
   * @param {string} gitBinary 
   * @param {string} range 
   */
  constructor(gitBinary = Diff.GIT_BINARY, range = Diff.COMMIT_RANGE) {
    this._gitBinary = gitBinary;
    this._range = range;
    this._diff = null;
  }

  /**
   * @param {*} assets 
   * 
   * @returns {boolean}
   */
  match(...assets) {
    if (!this.hasDiff) {
      return true;
    }

    console.log('...assets', ...assets);//@todo remove

    return assets.filter(asset => {
      return this.diff.filter(changesAsset => {
        return changesAsset.indexOf(asset) === 0;
      }).length > 0;
    }).length > 0;
  }

  /**
   * @returns {Promise}
   */
  load() {
    if (!this.hasRange) {
      return Promise.resolve();
    }

    return this._gitRoot()
      .then(gitRootPath => {
        return execa(
          this.gitBinary === Diff.GIT_BINARY 
            ? this.gitBinary 
            : path.resolve(this.gitBinary), 
          [ 'diff', '--name-only', this.range ]
        ).then(result => {
          const { stdout } = result;
    
          this._diff = (stdout || '')
            .trim()
            .split('\n')
            .filter(Boolean)
            .map(file => path.resolve(path.dirname(gitRootPath), file));
    
          console.log('path.dirname(gitRootPath)', path.dirname(gitRootPath));//@todo remove
          console.log('stdout', stdout);//@todo remove
          console.log('this._diff', this._diff);//@todo remove
    
          return Promise.resolve();
        });
      });
  }

  /**
   * @returns {Promise}
   * 
   * @private
   */
  _gitRoot() {
    //git rev-parse --git-dir
    return execa(
      this.gitBinary === Diff.GIT_BINARY 
        ? this.gitBinary 
        : path.resolve(this.gitBinary), 
      [ 'rev-parse', '--git-dir' ]
    ).then(result => {
      const { stdout } = result;

      return Promise.resolve(path.resolve(stdout));
    });
  }

  /**
   * @returns {boolean}
   */
  get hasDiff() {
    return Array.isArray(this.diff);
  }

  /**
   * @returns {boolean}
   */
  get hasRange() {
    return typeof this.range === 'string';
  }

  /**
   * @returns {string}
   */
  get gitBinary() {
    return this._gitBinary;
  }

  /**
   * @returns {string}
   */
  get range() {
    return this._range;
  }

  /**
   * @returns {string}
   */
  static get GIT_BINARY() {
    return 'git';
  }

  /**
   * @returns {string}
   * 
   * @todo add support for different CI providers
   */
  static get COMMIT_RANGE() {
    return Env.read('TRAVIS_COMMIT_RANGE');
  }
}

module.exports = Diff;
