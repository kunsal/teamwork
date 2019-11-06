const User = require('../models/user.model');

exports.create = async () => {
  const user = new User();
  try {
    const password = await user.hash('admins');
    const data = {
      password,
      firstName: 'Olakunle',
      lastName: 'Salami',
      email: 'kunsal@kaytivity.com',
      gender: 'male',
      employeeId: 'A002',
      jobRole: 'User Admin',
      department: 'Administration',
      isAdmin: true,
    };
    const { error } = user.validate(data);
    if (error) throw new Error(error.details[0].message);
    // Check if user already exists
    const getUser = await user.findBy('email', data.email, true);
    if (getUser.rowCount > 0) throw new Error('User already registered');
    const admin = await user.create(data);
    return admin.rowCount > 0 ? 'User created successfull' : 'Whoops! Something happened. User was not created';
  } catch (e) {
    throw new Error(e);
  }
};

require('make-runnable');
