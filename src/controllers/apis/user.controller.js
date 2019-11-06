const response = require('../../helpers/response');
const User = require('../../models/user.model');

const user = new User();

module.exports.create = async (req, res) => {
  try {
    const data = { 
      first_name, 
      last_name, 
      email, 
      password, 
      gender,
      employee_id,
      job_role,
      department,
      is_admin 
    } = req.body;
    // Run validation
    const { error } = user.validate(data);
    if (error) return res.status(400).send(response.error(error.details[0].message));
    // Check if email already exists
    if (await user.exists('email', data.email)) {
      return res.status(400).send(response.error('Email already registered'));
    }
    // Check if employee id already exists
    if (await user.exists('employee_id', data.employee_id)) {
      return res.status(400).send(response.error('Employee ID already registered'));
    }
    // All is fine, then create user
    await user.create(data);
    res.status(201).send(response.success('User created successful'));
  } catch (e) {
    res.status(500).send(response.error('An error occurred. Please try again'));
  }
}


