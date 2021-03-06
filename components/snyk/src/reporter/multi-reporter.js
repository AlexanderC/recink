'use strict';

const AbstractReporter = require('./abstract-reporter');

/**
 * Multiple Snyk.io reporters
 */
class MultiReporter extends AbstractReporter {
  /**
   * @param {*} args
   */
  constructor(...args) {
    super(...args);
    
    this._reporters = [];
  }
  
  /**
   * @param {AbstractReporter} reporters
   *
   * @returns {MultiReporter}
   */
  add(...reporters) {
    reporters.map(reporter => this._reporters.push(reporter));
    
    return this;
  }
  
  /**
   * @returns {AbstractReporter[]}
   */
  get reporters() {
    return this._reporters;
  }
  
  /**
   * @returns {string}
   */
  get name() {
    return 'multi';
  }
  
  /**
   * @param {*} result
   * @param {*} options
   *
   * @returns {Promise}
   */
  report(result, options) {
    return Promise.all(this.reporters.map(reporter => {
      return reporter.report(result, options);
    }));
  }
}

module.exports = MultiReporter;
