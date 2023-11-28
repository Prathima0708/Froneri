import View from 'src/components/View';
import React from 'react';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';
import Text from 'src/components/Text';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ROUTES from 'src/routes/Routes';

interface BasicInfoContentComponentProps {
  inputsData: any;
  editMode: boolean;
  onNavigate: () => void;
}

const SWBasicInfoComponent = (props: BasicInfoContentComponentProps) => {
  const { inputsData, editMode, onNavigate } = props;
  const navigation = useNavigation();

  const onViewList = () => {
    onNavigate();
  };

  return (
    <View>
      <View marginT-v3 row>
        <View marginR-v2 style={tw('w-598px border-light-lavendar')}>
          <InputText
            title={'Plant Description'}
            value={inputsData?.plantDescription}
            isEditable={false}
          />
        </View>
        <View style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Customer Classification'}
            value={inputsData?.customerClassification}
            isEditable={false}
          />
        </View>
      </View>
      <View marginT-v5 row>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Created By'}
            value={inputsData?.createdBy}
            isEditable={false}
          />
        </View>
        <View marginR-v2 style={tw('w-293px border-light-lavendar')}>
          <InputText
            title={'Created Date and Time'}
            value={inputsData?.createdDatetime}
            isEditable={false}
          />
        </View>
        <View row style={tw('w-300px border-light-lavendar')}>
          <View flex>
            <InputText
              title={'Trade Assets'}
              value={inputsData?.tradeAssets}
              isEditable={false}
            />
          </View>
          <View flex>
            <TouchableOpacity onPress={onViewList}>
              <View flex marginT-30 marginL-20>
                <Text darkBlue>View List</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View marginT-v7 style={tw('bg-light-lavendar h-px')} />
    </View>
  );
};

export default SWBasicInfoComponent;
