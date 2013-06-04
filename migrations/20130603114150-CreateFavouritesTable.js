module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.createTable(
      'Favourites', { id: { type: DataTypes.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        autoIncrement: true,
                        unique: true },
            userId: { type: DataTypes.INTEGER,
                        allowNull: false },
            postId: { type: DataTypes.INTEGER,
                      allowNull: false },
            createdAt: { type: DataTypes.DATE,
                        allowNull: false },
            updatedAt: { type: DataTypes.DATE,
                        allowNull: false }
      }, { sync: {force:true} })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.dropTable('Favourites')
        .complete(done);
  }
}