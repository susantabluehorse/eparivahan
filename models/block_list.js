var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('block_list', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    blocked_by_enterprise_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    blocked_enterprise_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }, 
    blocked_status: {
      type: DataTypes.ENUM('0','1',''),
      allowNull: false
    },
    blocked_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: true
    }   
  }, {
    timestamps: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'block_list'
  });
};