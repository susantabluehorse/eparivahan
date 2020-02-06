module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admins', {
    admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    alternate_email:{
      type : DataTypes.STRING(255),
      allowNull: true
    },
    mob_country_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    mobile: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    alt_mob_country_code:{
      type: DataTypes.STRING(50),
      allowNull :true
    },
    alternate_mobile:{
      type: DataTypes.STRING(255),
      allowNull :true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    }, 
    status: {
      type: DataTypes.ENUM('active','inactive'),
      allowNull: true
    },
    type:{
      type: DataTypes.STRING(255),
      allowNull :true
    },
    createdBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }    
  }, {
    tableName: 'admins'
  });
};
