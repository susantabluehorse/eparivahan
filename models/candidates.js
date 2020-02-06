module.exports = function(sequelize, DataTypes) {
    return sequelize.define('candidates', {
      candidate_id: {
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
      provider: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      provider_id: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      provider_image: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      profile_picture: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      name:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      first_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      middle_name:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      last_name:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      email:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      mob_country_code:{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      mobile:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      gender:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      dob:{
        type: DataTypes.DATE,
        allowNull: true
      },
      nationality:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      terms:{
        type: DataTypes.STRING(100),
        allowNull: true
      },
      cv_name:{
        type: DataTypes.STRING(100),
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
      tableName: 'candidates'
    });
  };
  