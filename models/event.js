module.exports = function(sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
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
    return Post;
  };
  