import { Model, DataTypes } from 'sequelize'

import { sequelize } from '../util/db.js'

class Startup extends Model {}
Startup.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  city: {
    type: DataTypes.INTEGER,
  },
  state: {
    type: DataTypes.INTEGER,
  },
  category: {
    type: DataTypes.INTEGER,
  },
  length: {
    type: DataTypes.DOUBLE,
  },
  employees: {
    type: DataTypes.INTEGER,
  },
  jobsCreated: {
    type: DataTypes.INTEGER,
  },
  jobsRetained: {
    type: DataTypes.INTEGER,
  },
  cityType: {
    type: DataTypes.INTEGER,
  },
  revolvingLineCredit: {
    type: DataTypes.INTEGER,
  },
  lowDoc: {
    type: DataTypes.INTEGER,
  },
  amount: {
    type: DataTypes.DOUBLE,
  },
  prediction: {
    type: DataTypes.DOUBLE,
  },
  advice: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'startup'
})

export default Startup