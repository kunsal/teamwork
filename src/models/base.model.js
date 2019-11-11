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

  /**
   * Create a new model record
   * @param {object} data 
   */
  async create(data) {
    const fields = Object.keys(data).toString();
    const values = Object.values(data);
    const parameters = this.parameterize(values);
    const text = `INSERT INTO ${this.table} (${fields}) VALUES (${parameters})`;
    return query(text, values); 
  }

  /**
   * Delete model record
   * @param {string} field 
   * @param {string} value 
   */
  async delete(field, value) {
    let text = `DELETE FROM ${this.table} WHERE ${field} = $1`;
    let values = [ value ];
    return query(text, values);
  }

  /**
   * Update model
   * @param {object} data 
   * @param {string} value [filter value]
   * @param {string} field [filter field]
   */
  async update(data, value, field = 'id') {
    const fields = Object.keys(data).toString();
    const values = Object.values(data);
    const parameters = this.parameterize(values);
    const text = `UPDATE ${this.table} (${fields}) VALUES (${parameters}) WHERE ${field} = ${value}`;
    return query(text, values); 
  }

  /**
   * Parameterize query values
   * @param {array} data 
   */
  parameterize(data) {
    let count = 1;
    let parameters = [];
    data.map(d => {
      parameters.push(`$${count}`)
      count ++;
    });
    return parameters.toString();
  }
}

module.exports = BaseModel;