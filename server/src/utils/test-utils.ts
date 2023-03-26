import { database, config, up, down } from 'migrate-mongo';

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbName = 'test-db';

export const initDB = async () => {
  // config.shouldExist = async () => true;
  config.read = async function() {
    return {
      mongodb: {
        // url: `mongodb://${dbHost}:27017`,
        url: `mongodb://localhost:27017`,
        databaseName: dbName,
        options: {
          useNewUrlParser: true,
        },
      },
      migrationsDir: 'migrations',
      changelogCollectionName: 'migrations',
    };
  };

  const { db, client } = await database.connect();
  const migrated = await up(db);

  migrated.forEach((fileName: string) => console.log('Migrated:', fileName));
  client.close();
};

export const destroyDB = async () => {
  // config.shouldExist = () => true;
  config.read = async function() {
    return {
      mongodb: {
        // url: `mongodb://${dbHost}:27017`,
        url: `mongodb://localhost:27017`,
        databaseName: dbName,
        options: {
          useNewUrlParser: true,
        },
      },
      migrationsDir: 'migrations',
      changelogCollectionName: 'migrations',
    };
  };

  const { db, client } = await database.connect();
  const migrated = await down(db);

  migrated.forEach((fileName: string) => console.log('Migrated:', fileName));
  client.close();
};
