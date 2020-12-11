module.exports = function(sequelize, DataTypes) {
    var UserEvents = sequelize.define("UserEvents",{
        id:{
           type:DataTypes.INTEGER,
           autoIncrement: true,
           primaryKey: true     
        }
    });
    return UserEvents;
};