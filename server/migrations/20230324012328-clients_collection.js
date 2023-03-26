module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    let values = [];
    for (let i = 0; i < 100; i++) {
      values.push({
        monthlyQuotaTotal: 10000,
        monthlyQuotaUsed: Math.floor(Math.random() * 9492),
        limitPerSecond: 10,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        monthStartTime: Date.now(),
      });
    }
    await db.collection('clients').insertMany(values);
    console.log(`URL Collection created successfully`);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection('clients').drop();
    console.log(`URL Collection dropped successfully`);
  },
};
