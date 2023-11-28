import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = (key: string, value: any) => {
  const jsonValue = JSON.stringify(value);
  return AsyncStorage.setItem(key, jsonValue)
    .then(() => {
      console.log('AsyncStorage: successful saveData', key);
    })
    .catch(err => {
      // saving error
      console.log('AsyncStorage: Error saveData', key);
      throw new Error(err);
    });
};

export const getData = (key: string) => {
  return AsyncStorage.getItem(key)
    .then(res => {
      return res != null ? JSON.parse(res) : null;
    })
    .catch(err => {
      console.log('AsyncStorage: Error getData', key);
      throw new Error(err);
    });
};

export const getAllKeys = () => {
  return AsyncStorage.getAllKeys()
    .then(res => {
      return res;
    })
    .catch(err => {
      console.log('AsyncStorage: Error getAllKeys');
      throw new Error(err);
    });
};

export const deleteData = (key: string) => {
  return AsyncStorage.removeItem(key)
    .then(() => {})
    .catch(err => {
      console.log('AsyncStorage: Error deleting', key);
      throw new Error(err);
    });
};
