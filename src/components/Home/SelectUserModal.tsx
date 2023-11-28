import {TouchableOpacity} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {images} from 'src/assets/Images';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import Modal from 'src/components/Modal';
import Dropdown from 'src/components/DropDown';
import {authenticationDataConfig, languageConfig} from 'src/utils/data';
import {RootState, useAppDispatch, useAppSelector} from 'src/reducers/hooks';
import {updateSelectedLanguage} from 'src/reducers/UserContextSlice';

interface SelectUserModalProps {
  isModalVisible: boolean;
  onSelectUser: any;
  onPressCancel: any;
}

const SelectUserModal = (props: SelectUserModalProps) => {
  const {isModalVisible, onSelectUser, onPressCancel} = props;
  const [selectUserDropdownValue, setSelectUserDropdownValue] = useState(
    authenticationDataConfig[0],
  );
  const [languageDropdownValue, setLanguageDropdownValue] = useState<any>('');
  const dispatch = useAppDispatch();
  const selectedLanguage = useAppSelector(
    (state: RootState) => state.userContext.selectedLanguage,
  );
  useEffect(() => {
    if (selectedLanguage) {
      setLanguageDropdownValue(selectedLanguage);
    } else {
      setLanguageDropdownValue(languageConfig[0]);
    }
  }, []);

  const handleSelectDropdown = (value: any) => {
    setSelectUserDropdownValue(value);
  };

  const onSyncDataPress = () => {
    onSelectUser(selectUserDropdownValue);
  };

  const handleSelectedLanguage = (value: any) => {
    console.log('value :>> ', value);
    dispatch(updateSelectedLanguage({selectedLanguage: value}));
    setLanguageDropdownValue(value);
  };

  return (
    <Modal visible={isModalVisible}>
      <View flex center>
        <View bg-white br40 style={tw('self-center')} padding-v4>
          <Text text18BO textBlack center marginT-v2>
            Select the user & language
          </Text>
          <Dropdown
            extraStyle={'mt-8 mb-4'}
            labelField="label"
            valueField="callPlaceNo"
            data={authenticationDataConfig}
            value={selectUserDropdownValue}
            onChange={handleSelectDropdown}
          />
          <Dropdown
            extraStyle={'mb-4'}
            labelField="label"
            valueField="language"
            data={languageConfig}
            value={languageDropdownValue}
            onChange={handleSelectedLanguage}
          />
          <TouchableOpacity
            onPress={onSyncDataPress}
            style={tw(
              'bg-light-darkBlue justify-center items-center rounded-md w-64 mt-12px',
            )}>
            <Text text13R lightGrey marginV-v2>
              Sync data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPressCancel}
            style={tw(' justify-center items-center rounded-md w-64 mt-12px')}>
            <Text text13R grey2 marginV-v2>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SelectUserModal;
