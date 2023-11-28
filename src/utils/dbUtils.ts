import {Q, Relation} from '@nozbe/watermelondb';
import {chunk} from 'lodash';

import {getDB} from 'src/storage/OfflineDBStorage/WmDB';
import {objType} from './Helper';

const database = getDB();

export class DBUtils {
  static async insertData(data: objType[], tableName: string) {
    const batchSize = 1000;
    const dataChunks = chunk(data, batchSize);

    try {
      const dataCollection = database.collections.get(tableName);
      console.log('Inserting data for', tableName);

      await database.write(async () => {
        for (const dataChunk of dataChunks) {
          const dataRecords = dataChunk.map(record =>
            dataCollection.prepareCreate((prep: any) => {
              for (const key in record) {
                if (Object.prototype.hasOwnProperty.call(record, key)) {
                  // Check the type of the value and set it accordingly
                  if (prep[key] instanceof Relation) {
                    const relationKey = prep[key];
                    relationKey.set(record[key]);
                  } else if (typeof prep[key] === 'number') {
                    prep[key] = Number(record[key]);
                  } else if (typeof prep[key] === 'string') {
                    prep[key] = String(record[key]);
                  } else if (typeof prep[key] === 'boolean') {
                    prep[key] = Boolean(Number(record[key]));
                  } else if (prep[key] === null) {
                    prep[key] = record[key];
                  }

                  if (prep[key] === 'NULL') {
                    prep[key] = null;
                  }
                }
              }
            }),
          );
          await database.batch(dataRecords);
        }
      });

      console.log('Data inserted successfully for', tableName);
    } catch (error) {
      console.log(`error in ${tableName}`, error);
    }
  }

  static async deleteAllData() {
    try {
      await database.write(async () => {
        await database.unsafeResetDatabase();
      });
      return true;
    } catch (error) {
      console.log('error while deleting the data :>> ', error);
      return false;
    }
  }

  static async getAllData() {
    try {
      const collections = database.collections.map;
      let allData = [];

      for (const collectionName in collections) {
        const collection = database.get(collectionName);
        let dataLength = await collection.query().fetchCount();

        if (dataLength > 0) {
          console.log(collectionName, dataLength);

          let temp: any = [];

          if (dataLength > 1000) {
            let offset = 0;
            const batchSize = 1000;

            while (dataLength > 0) {
              const data = await collection
                .query(Q.skip(offset), Q.take(batchSize))
                .fetch();
              temp = [...temp, ...data];
              dataLength = dataLength - batchSize;
              offset = offset + batchSize;

              console.log(
                collectionName,
                'data length',
                dataLength,
                'offset =>',
                offset,
              );
            }
          } else {
            temp = await database.get(collectionName).query().fetch();
          }

          allData.push(temp);
        }
      }
      return allData;
    } catch (error) {
      console.log(
        '🚀 ~ file: helper.ts:136 ~ ImportUtil ~ getAllData ~ error:',
        error,
      );
    }
  }
}
