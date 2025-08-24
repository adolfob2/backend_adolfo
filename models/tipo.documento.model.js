import {Sequelize, DataTypes} from 'sequelize';
import orm from '../config/sequelize.js';

export const TipoDocumento = orm.define('tipoDocumento', {
    id_tipodocumento:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        len: [1, 50]
    }

}
    
}, {
    tableName: 'tipo_documento',
    timestamps: false,
});

export const connect = async function(){
    await orm.authenticate();
    console.log("conexion establecida")
}