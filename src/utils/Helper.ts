import {NativeModules} from 'react-native';
import {Q} from '@nozbe/watermelondb';
import RNFS from 'react-native-fs';
import {unzip} from 'react-native-zip-archive';

import {getDB} from 'src/storage/OfflineDBStorage/WmDB';
import excelConfigData from 'src/storage/OfflineDBStorage/WmDB/excel-import-config.json';
import LoginService from 'src/services/LoginService';

import {DBUtils} from './dbUtils';
import {authenticationDataConfig} from './data';
import {
  updateImportMessage,
  updateTotalFiles,
  updateTotalImportedFiles,
} from 'src/reducers/SyncSlice';
import {store} from 'src/store';
import EmployeesService from 'src/services/EmployeesService';
import CallPlacesService from 'src/services/CallPlacesService';
import ENV from 'src/env/env.config';

export type objType = {
  [key: string]: string;
};

type jsonType = {
  collection: string;
  data: objType[];
};

type excelImportConfigType = {
  fileName: string;
  level: number;
  table: string;
};

const {ExcelEditor} = NativeModules;
const database = getDB();
const levelHierarchy = 6;
const documentDirectoryAssetsPath = `${RNFS.DocumentDirectoryPath}/assets`;

const ENABLE_USER_SWITCH = ENV.ENABLE_USER_SWITCH;
export class ImportUtil {
  static async importDatabase(userInfo?: any) {
    const dispatch = store.dispatch;
    const employeeInfo = store.getState().userContext.employee;

    console.log('employeeInfo :>> ', employeeInfo);

    const userData = await LoginService.getUserInfo();
    console.log('userData :>> ', userData);

    let filteredAuthData: any = {};

    if (ENABLE_USER_SWITCH) {
      filteredAuthData = authenticationDataConfig.find(
        item => item.email === userInfo.email,
      );
    } else {
      filteredAuthData = authenticationDataConfig.find(
        item => item.email === userData.emailId,
      );
    }

    console.log('filteredAuthData :>> ', filteredAuthData);

    if (!filteredAuthData) {
      return;
    }

    if (employeeInfo.length > 0) {
      console.log('Deleting the data from the database');
      const isDataDeleted = await DBUtils.deleteAllData();
      console.log('isDataDeleted :>> ', isDataDeleted);
      if (!isDataDeleted) {
        return false;
      }
    }

    const user = filteredAuthData.data;
    const zipDirectoryPath = `${documentDirectoryAssetsPath}/zip`;
    const excelDirectoryPath = `${documentDirectoryAssetsPath}/excel`;

    console.log('user :>> ', user);

    const assetsZipDirPath = `data/excel/user/${user}`;

    const assetsDirData = await RNFS.readDirAssets(assetsZipDirPath);

    dispatch(updateTotalFiles({totalFiles: assetsDirData.length}));

    try {
      await RNFS.mkdir(documentDirectoryAssetsPath);
      await RNFS.mkdir(zipDirectoryPath);

      // For analytics
      // const analytics: any = [];
      let totalFilesImported = 0;

      // const filteredData = excelConfigData.filter(
      //   (data: any) =>
      //     data.table === 'call_places' || data.table === 'employees',
      // );

      // console.log('filteredData :>> ', filteredData);

      for (const configData of excelConfigData) {
        // for (const configData of excelConfigData.slice(141, 142)) { // -> order lines
        // for (const configData of excelConfigData.slice(42, 43)) { // -> Texts
        // for (const configData of excelConfigData.slice(155, 156)) { // -> Discovery Condition Agreements
        try {
          // For analytics
          // const insertionTime = new Date();

          const zipFilename = configData.fileName.replace('.xlsx', '.zip');
          const excelFilePath = `${excelDirectoryPath}/${configData.table}`;
          const zipPath = `${zipDirectoryPath}/${zipFilename}`;
          const assetsZipFilePath = `${assetsZipDirPath}/${zipFilename}`;

          const collectionName = configData.table;

          const assetsExist = await RNFS.existsAssets(assetsZipFilePath);

          if (assetsExist) {
            await RNFS.copyFileAssets(assetsZipFilePath, zipPath);

            await unzip(zipPath, excelFilePath);

            const dirResult = await RNFS.readDir(excelFilePath);

            const jsonData: any = [];

            for (const file of dirResult) {
              const path = file.path;
              dispatch(
                updateImportMessage({
                  importMessage: `Unzipping ${configData.fileName}...`,
                }),
              );

              const fileData = await ExcelEditor.convertExcelToJson(path);
              const camelCaseJsonData = fileData.map((obj: objType) =>
                ExportUtil.convertKeysToCamelCase(obj),
              );

              jsonData.push(...camelCaseJsonData);
            }

            console.log(
              'json data for ',
              configData.fileName,
              jsonData.length,
              jsonData[0],
            );

            dispatch(
              updateImportMessage({
                importMessage: `Inserting data for ${configData.fileName}...`,
              }),
            );

            // Data insertion in DB
            await DBUtils.insertData(jsonData, collectionName);
            totalFilesImported += 1;

            dispatch(
              updateImportMessage({
                importMessage: `Data inserted for ${configData.fileName}...`,
              }),
            );

            dispatch(
              updateTotalImportedFiles({
                totalFilesImported,
              }),
            );
          }
        } catch (error) {
          console.log('error while importing db :>> ', error);
          return false;
        }
      }

      const [name] = userData.emailId.split('@');

      const userDataToSet = {
        value: filteredAuthData?.callPlaceNo,
        name: name,
        email: userData.emailId,
      };

      // Changing the data of employees table
      const updateEmployeeInfoSuccess =
        await EmployeesService.findAndUpdateUserData(userDataToSet);
      if (!updateEmployeeInfoSuccess) {
        console.log(
          'updateEmployeeInfoSuccess :>> ',
          updateEmployeeInfoSuccess,
        );
        await RNFS.unlink(documentDirectoryAssetsPath);
        return false;
      }

      // Changing the data of call places table
      const updateDescriptionSuccess =
        await CallPlacesService.findAndUpdateDescription(userDataToSet);
      if (!updateDescriptionSuccess) {
        console.log('updateDescriptionSuccess :>> ', updateDescriptionSuccess);
        await RNFS.unlink(documentDirectoryAssetsPath);
        return false;
      }

      await RNFS.unlink(documentDirectoryAssetsPath);

      return true;
    } catch (error) {
      await RNFS.unlink(documentDirectoryAssetsPath);
      console.log('readJsonFiles ~ error => ', error);
      return false;
    }
  }
}

export class ExportUtil {
  // Export the database into json files
  static async exportDatabase() {
    try {
      console.log('Exporting database');

      const collections = database.collections.map;

      let allData = [];

      for (const collectionName in collections) {
        const collection = database.get(collectionName);
        let dataLength = await collection.query().fetchCount();

        if (dataLength > 0) {
          console.log('collection =>', collectionName, dataLength);
          let temp: any = [];

          if (dataLength > 1000) {
            let offset = 0;
            const batchSize = 1000;

            while (dataLength > 0) {
              const data = (
                await collection
                  .query(Q.skip(offset), Q.take(batchSize))
                  .fetch()
              ).map((item: any) => item._raw);
              temp = [...temp, ...data];
              dataLength -= batchSize;
              offset += batchSize;

              console.log(
                collectionName,
                'data length',
                dataLength,
                'offset =>',
                offset,
              );
            }
          } else {
            temp = (await database.get(collectionName).query().fetch()).map(
              (item: any) => item._raw,
            );
          }

          allData.push({
            collection: collectionName,
            data: temp,
          });
          console.log('Completed for', collectionName);
        }
      }

      console.log('All Data', allData.length);

      await RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/data`);

      allData.forEach(async item => {
        await RNFS.writeFile(
          `${RNFS.DocumentDirectoryPath}/data/${item.collection}.json`,
          JSON.stringify(item),
        );
        console.log('File written for', item.collection);
      });

      return 'Database exported successfully.';
    } catch (error) {
      console.log('Error exporting database:', error);
    }
  }

  // Convert the object keys to camel case
  static convertKeysToCamelCase(obj: objType) {
    const newObj: any = {};
    Object.keys(obj).forEach(key => {
      let newKey = key.toLowerCase();
      if (newKey.includes('_')) {
        newKey = newKey.replace(/(_\w)/g, match => match[1].toUpperCase());
      }
      newObj[newKey] = obj[key];
    });
    return newObj;
  }

  // Convert the object keys to camel case and values are the keys in snake case
  static convertKeysToCamelCaseDebug(obj: objType) {
    const newObj: any = {};
    Object.keys(obj).forEach(key => {
      const newKey = key
        .toLowerCase()
        .replace(/(_\w)/g, match => match[1].toUpperCase());
      newObj[newKey] = key;
    });
    return newObj;
  }

  // Takes the excel file name (file should be present in the assets folder) and callback function as arguments
  static convertExcelToJson(fileName: string, callback: Function) {
    console.log('Reading file', fileName);
    ExcelEditor.convertExcelToJson(
      fileName,
      async (data: objType[] | string, isError: boolean) => {
        if (isError || typeof data === 'string') {
          console.log(data);
          return callback(`ERROR!! Unable to read the file ${fileName}`);
        }

        // const camelCaseJsonData = data.map(obj =>
        //   this.convertKeysToCamelCase(obj),
        // );

        // console.log(
        //   'Json data for file',
        //   fileName,
        //   'length =>',
        //   camelCaseJsonData.length,
        //   camelCaseJsonData[camelCaseJsonData.length - 1],
        // );
        // callback(camelCaseJsonData);
        callback(data);
      },
    );
  }

  // Extracts the data from the excel file and inserts it into the database
  static async extractAndInsertData(
    data: excelImportConfigType[],
    level: number,
  ) {
    const filteredFileList: excelImportConfigType[] = data.filter(
      data => data.level === level,
    );

    console.log(
      'filteredFileList for level',
      level,
      filteredFileList.length,
      filteredFileList,
    );
    filteredFileList.forEach(async file => {
      this.convertExcelToJson(
        file.fileName,
        async (fileData: objType[] | string) => {
          // String data is returned when there is an error in reading the file otherwise array of objects is returned
          if (typeof fileData === 'string') {
            console.log(fileData);
          } else {
            console.log('JSON File data', fileData);
            // await DBUtils.insertData(fileData, file.table);
          }
        },
      );
    });
  }

  // Generates the json files from the excel files
  static async generateJson() {
    for (let i = 0; i <= levelHierarchy; i++) {
      await this.extractAndInsertData(excelConfigData, i);
    }
  }
}
