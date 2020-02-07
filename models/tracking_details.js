var Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tracking_details', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },     
    tracking_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    time_stamp: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    latitude: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    location_from_latling: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    tracking_count: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    max_tracking_count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    driver_mobile_number: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tracked_mobile_mumbers: {
      type: DataTypes.TEXT(),
      allowNull: true
    },
    comment: {
      type: DataTypes.TEXT(),
      allowNull: true
    },
    tracked_by_user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    tracked_mobile_number: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    vehicle_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    from_location: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    to_location: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    client_contact_mobile: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    start_date: {
      type: 'DATE',
      allowNull: false
    },
    end_date: {
      type: 'DATE',
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    updated_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }, 
    status: {
      type: DataTypes.STRING(100),
      allowNull: false
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
    tableName: 'tracking_details'
  });
};