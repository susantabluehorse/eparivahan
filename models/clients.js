module.exports = function(sequelize, DataTypes) {
    return sequelize.define('clients', {
      client_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },      
      username: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment : "username should be email id"
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
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true
      },      
      parent_client:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      signatory_person:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      signatory_person_designation:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      website:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      industry:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      opertaing_house:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      note:{
        type: DataTypes.STRING(255),
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('active','inactive'),
        allowNull: true
      },
      terms:{
        type: DataTypes.STRING(100),
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
      tableName: 'clients'
    });
  };
  