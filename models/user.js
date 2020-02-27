var Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		enterprise_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false
		},
		name: {
			type: DataTypes.STRING(191),
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(191),
			allowNull: false
		},
		mobile: {
			type: DataTypes.BIGINT(20),
			allowNull: false
		},
		profile_pic: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		password: {
			type: DataTypes.STRING(191),
			allowNull: true
		},
		remember_token: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		user_type: {
			type: DataTypes.ENUM('consignee','fleet','admin'),
			allowNull: false
		},
		is_driver: {
			type: DataTypes.ENUM('yes','no'),
			allowNull: false,
			defaultValue:'no'
		},
		licence_no: {
			type: DataTypes.STRING(191),
			allowNull: true
		},
		licence_expiry: {
			type: 'DATE',
			allowNull: true
		},
		licence_pic: {
			type: DataTypes.STRING(255),
			allowNull: true
		},
		is_admin: {
			type: DataTypes.ENUM('yes','no'),
			allowNull: false,
			defaultValue:'yes'
		},
		is_manager: {
			type: DataTypes.ENUM('yes','no'),
			allowNull: false,
			defaultValue:'no'
		},
		is_user: {
			type: DataTypes.ENUM('yes','no'),
			allowNull: true,
			defaultValue:'no'
		},
		is_show_transporter: {
			type: DataTypes.ENUM('0','1'),
			allowNull: false,
			defaultValue:'0'
		},
		is_show_position: {
			type: DataTypes.ENUM('0','1'),
			allowNull: false,
			defaultValue:'0'
		},
		status: {
			type: DataTypes.ENUM('active', 'inactive'),
			allowNull: false,
			defaultValue:'inactive'
		},
		version: {
			type: DataTypes.STRING(20),
			allowNull: false,
			defaultValue:'2.3.3'
		},
		created_by: {
			type: DataTypes.INTEGER(10),
			allowNull: false
		},
		updated_by: {
			type: DataTypes.INTEGER(10),
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
		tableName: 'users'
	});
}