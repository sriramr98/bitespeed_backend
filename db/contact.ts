import { DataTypes } from 'sequelize'
import getSequelize from './init'

const sql = getSequelize()

export default sql.define('contact', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    linkPrecedence: {
        type: DataTypes.ENUM('primary', 'secondary'),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    hooks: {
        beforeUpdate: (contact: any) => {
            contact.updatedAt = new Date()
        }
    }
})