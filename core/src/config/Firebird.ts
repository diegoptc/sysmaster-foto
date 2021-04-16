const Firebird = require('node-firebird')

export class FirebirdConnection {
  public static db: any = null;

  public static getConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!FirebirdConnection.db) {
        Firebird.attach(
          {
            host: process.env.FIREBIRD_HOST,
            port: process.env.FIREBIRD_PORT,
            database: process.env.FIREBIRD_DATABASE,
            user: process.env.FIREBIRD_USER,
            password: process.env.FIREBIRD_PASSWORD
          },
          function (err: any, db: any) {
            if (err) {
              reject(err);
              return;
            } else {
              FirebirdConnection.db = db;
              resolve(db);
              return;
            }
          }
        );
      } else {
        resolve(FirebirdConnection.db)
        return;
      }
    })
  }
}