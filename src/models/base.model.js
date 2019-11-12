const { query } = require('./index');

class BaseModel {
  /**
   * 
   * @param {string} table 
   */
  constructor(table) {
    this.table = table;
    this.query = query;
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
    return this.query(text, values);
  }

  /**
   * Create a new model record
   * @param {object} data 
   */
  async create(data, getBack = 'id') {
    const fields = Object.keys(data).toString();
    const values = Object.values(data);
    const parameters = this.parameterize(values);
    const text = `INSERT INTO ${this.table} (${fields}) VALUES (${parameters}) RETURNING *`;
    return this.query(text, values); 
  }

  /**
   * Delete model record
   * @param {string} field 
   * @param {string} value 
   */
  async delete(field, value) {
    let text = `DELETE FROM ${this.table} WHERE ${field} = $1 RETURNING *`;
    let values = [ value ];
    return this.query(text, values);
  }

  /**
   * Update model
   * @param {object} data 
   * @param {string} filterValue [filter value]
   * @param {string} filterField [filter field]
   */
  async update(data, filterValue, filterField = 'id') {
    const fields = Object.keys(data);
    let count = 1;
    let setData = [];
    fields.map(field => {
      setData.push(`${field} = $${count}`);
      count ++;
    });
    let text = `UPDATE ${this.table} SET ${setData} WHERE ${filterField} = ${filterValue} RETURNING *`;
    console.log(text);
    return this.query(text, Object.values(data)); 
  }

  /**
   * Check if value of a field already exists 
   * @param {string} field 
   * @param {string} value  
   * @returns {boolean}
   */
  async exists(field, value) {
    const gif = await this.findBy(field, value, true);
    // Check if user returns count
    if (gif.rowCount > 0) {
      return true;
    }
    return false;
  }

  /**
   * Parameterize this.query values
   * @param {array} data 
   * @returns {string} 
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