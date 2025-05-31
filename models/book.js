'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.hasMany(models.Review, { foreignKey: 'book_id', as: 'reviews' });
    }
  }

  Book.init({

    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    imageUrl: {
      type: DataTypes.STRING
    },    
    title: {
      type: DataTypes.STRING(255),
    
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING(100)
    },
    description: {
      type: DataTypes.TEXT
    },
    publishedDate: {
      type: DataTypes.DATEONLY
    }
  }, {
    sequelize,
    modelName: 'book',
    tableName: 'books',
    underscored: true,
    timestamps: true
  });

  return Book;
};
