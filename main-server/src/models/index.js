import Startup from './startup.js';
import User from './user.js';

User.hasMany(Startup)
Startup.belongsTo(User)
Startup.sync({ alter: true })
User.sync({ alter: true })

export { Startup, User } 