import React, { FC, useState } from 'react';
import { Modal, TouchableOpacity } from 'react-native-ui-lib';

import Text from 'src/components/Text';
import View from 'src/components/View';
import UserContextService from 'src/services/UserContextService';
import { tw } from 'src/tw';
import { ExportUtil, ImportUtil } from 'src/utils/Helper';
import { DBUtils } from 'src/utils/dbUtils';
import { RootState, useAppDispatch, useAppSelector } from 'src/reducers/hooks';
import { resetSyncState } from 'src/reducers/SyncSlice';


const Sync: FC = () => {
  const dispatch = useAppDispatch()
  const totalFiles = useAppSelector(
    (state: RootState) => state.sync.totalFiles
  );
  const totalFilesImported = useAppSelector(
    (state: RootState) => state.sync.totalFilesImported
  );
  const importMessage = useAppSelector(
    (state: RootState) => state.sync.importMessage
  );

  const [loading, setLoading] = useState(false);

  const importData = async () => {
    try {
      dispatch(resetSyncState())
      setLoading(true);
      const res = await ImportUtil.importDatabase();
      console.log('Res', res);
      saveUserContext();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('🚀 ~ file: Sync.tsx:83 ~ importData ~ error:', error);
    }
  };

  const saveUserContext = async () => {
    UserContextService.updateUserContext()
      .then(res => {
        console.log('User Context Saved');
      })
      .catch(err => console.log('the err', err));
  };

  const storeData = async () => {
    try {
      await ExportUtil.generateJson()
    } catch (error) {
      setLoading(false);
      console.log('🚀 ~ file: Sync.tsx:93 ~ storeData ~ error:', error);
    }
  };

  const exportData = async () => {
    try {
      setLoading(true);
      const res = await ExportUtil.exportDatabase();
      console.log('Res', res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('🚀 ~ file: Sync.tsx:103 ~ exportData ~ error:', error);
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const res = await DBUtils.getAllData();
      console.log('Res', res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('🚀 ~ file: Sync.tsx:113 ~ getData ~ error:', error);
    }
  };

  return (
    <View style={tw(`flex-1 justify-center items-center`)}>
      <View style={tw(`flex-1 justify-evenly items-center`)}>
        <TouchableOpacity onPress={() => storeData()}>
          <Text text22>Store Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => exportData()}>
          <Text text22>Export Data</Text>
        </TouchableOpacity>
        {/*<TouchableOpacity onPress={() => getData()}>
          <Text>Get Data</Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={importData}>
          <Text text22>Sync Data</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={loading} animationType="fade">
        <View flex center>
          {!totalFiles || !importMessage ? <Text text22>Setting up the sync...</Text> : <>
            <Text text22 black>
              {`Syncing data... ${totalFilesImported}/${totalFiles}\n`}
            </Text>
            <Text text22 black>
              {importMessage}
            </Text>
          </>
          }
        </View>
      </Modal>
    </View>
  );
};

export default Sync;
