var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tracking_mappers', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    load_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }, 
    tracking_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }, 
    users: {
      type: DataTypes.TEXT(),
      allowNull: true
    },
    created_at: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    },
    updated_at: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()'),
      allowNull: true
    }   
  }, {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tracking_mappers'
  });
};