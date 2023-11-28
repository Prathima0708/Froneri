import * as Keychain from 'react-native-keychain';

export const saveData = (key: string, value: any) => {
  const jsonValue = JSON.stringify(value);
  return Keychain.setInternetCredentials(key, key, jsonValue)
    .then(() => {
      console.log('SecureStorage: successful saveData', key);
    })
    .catch(err => {
      console.log('SecureStorage: Error saveData', key);
      throw new Error(err);
    });
};

export const getData = (key: string) => {
  return Keychain.getInternetCredentials(key)
    .then(res => {
      if (res && res.password) {
        let value = res.password;
        return value != null ? JSON.parse(value) : null;
      } else {
        return null;
      }
    })
    .catch(err => {
      console.log('SecureStorage: Error getData', key);
      throw new Error(err);
    });
};

export const getAllKeys = () => {
  return new Promise((res, rej) => {
    return [];
  });
};

export const deleteData = (key: string) => {
  return saveData(key, '')
    .then(() => {
      console.log('SecureStorage: successful deleteData', key);
    })
    .catch(err => {
      console.log('SecureStorage: Error deleteData', key);
      throw new Error(err);
    });
};
