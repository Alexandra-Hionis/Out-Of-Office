module.exports = function(sequelize, DataTypes) {
    var Event = sequelize.define("Event", {
      eventName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 200]
        }
      },
      location: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [1, 200]
        }
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [1, 200]
        }
      },
      category: {
        type: DataTypes.STRING,
        defaultValue: ""
      }
    });
    Event.associate = function(models) {
        // Associating Event with Posts
        // When an Event is deleted, also delete any associated Posts
        Event.belongsToMany(models.User,{
            through: "UserEvents"
          });
      };
    return Event;
  };
  