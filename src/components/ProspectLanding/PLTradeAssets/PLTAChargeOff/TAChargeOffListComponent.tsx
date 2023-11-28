import React from 'react';
import { FlashList } from '@shopify/flash-list';

import View from 'src/components/View';
import Text from 'src/components/Text';

import TAChargeOffListingHeaderComponent from './TAChargeOffListingHeaderComponent';
import RenderTAChargeOffComponent from './RenderTAChargeOffComponent';

import { tw } from 'src/tw';

interface TAChargeOffListComponentProps {
  taChargeOffData: any;
  setTaChargeOffData: any;
  isEditable: boolean;
  setIsEditable: any;
  isFormEditable: boolean;
}

const TAChargeOffListComponent = (props: TAChargeOffListComponentProps) => {
  const { taChargeOffData, setTaChargeOffData, isEditable, setIsEditable, isFormEditable } = props;

  const handleInputChange = (fieldName: string, index: number) => (value: any) => {
    if (fieldName === 'status') {
      setTaChargeOffData((prevData: any) => {
        const newData = [...prevData]
        newData[index].status = !newData[index].status
        return newData
      })
    } else {
      setTaChargeOffData((prevData: any) => {
        const newData = [...prevData]
        newData[index][fieldName] = value.replace(/[^0-9]/g, '');
        newData[index]['residualValueError'] = ''
        return newData
      })
    }

    if (!isEditable) {
      setIsEditable(true)
    }
  };

  return (
    <View marginT-v4>
      <View centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          TA Charge off
        </Text>
      </View>
      <View marginT-v5>
        <TAChargeOffListingHeaderComponent />
      </View>
      <View flex style={tw('border-light-grey1')}>
        <FlashList
          data={taChargeOffData}
          keyExtractor={(_, index: number) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <RenderTAChargeOffComponent
                item={item}
                index={index}
                lastItem={taChargeOffData.length - 1 === index}
                handleInputChange={handleInputChange}
                isEditable={isFormEditable}
              />
            );
          }}
          estimatedItemSize={59}
          extraData={isFormEditable}
          keyboardShouldPersistTaps="always"
        />
      </View>
      <View marginT-v4 style={tw('bg-light-lavendar h-px')} />
    </View>
  );
};

export default TAChargeOffListComponent;
