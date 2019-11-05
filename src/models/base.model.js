const { query } = require('./index');

class BaseModel {
  /**
   * 
   * @param {string} table 
   */
  constructor(table) {
    this.table = table;
  }

  /**
   * Get record(s by field
   * @param {string} field 
   * @param {string} value 
   * @param {boolean} single 
   */
  async findBy(field, value, single = false) {
    let text = `SELECT * FROM ${this.table} WHERE ${field} = $1`;
    if (single) {
      text += ' LIMIT 1';
    } 
    let values = [ value ];
    return query(text, values);
  }
}

module.exports = BaseModel;