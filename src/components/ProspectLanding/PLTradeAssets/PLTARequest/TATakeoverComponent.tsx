import React from 'react';
import { useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import View from 'src/components/View';
import Text from 'src/components/Text';
import InputText from 'src/components/InputText';
import { BUTTON_TYPE } from 'src/components/Button/ButtonType';

import TATakeoverListingHeaderComponent from './TATakeoverListingHeaderComponent';
import RenderTATakeoverComponent from './RenderTATakeoverComponent';

import { tw } from 'src/tw';

interface TATakeoverComponentProps {
  isTaTakeOverDisabled: any;
  taTakeOverData: any;
  setTaTakeOverData: any;
  followUpActionsDropdownData: any;
  handleDisplayTa: any;
  isEditable: boolean;
  setIsEditable: any;
  taTakeoverInput: any;
  setTaTakeoverInput: any;
  isFormEditable: boolean;
  errorMessages: any;
  taWishLimit: any;
}

const TATakeoverComponent = (props: TATakeoverComponentProps) => {
  let {
    isTaTakeOverDisabled,
    taTakeOverData,
    setTaTakeOverData,
    followUpActionsDropdownData,
    handleDisplayTa,
    isEditable,
    setIsEditable,
    taTakeoverInput,
    setTaTakeoverInput,
    isFormEditable,
    errorMessages,
    taWishLimit,
  } = props;

  const route = useRoute<any>();
  const numericFields = ['priceTag', 'expectedTurnoverTa'];

  if (taWishLimit === 1 && route.params?.isEditable) {
    isTaTakeOverDisabled = true;
  }

  const handleInputChange = (fieldName: string, index: number) => (value: any) => {
    if (numericFields.includes(fieldName)) {
      value = value.replace(/\D/g, '');
    }

    if (fieldName === 'followUpAction') {
      setTaTakeOverData((prevData: any) => {
        const newData = [...prevData]
        newData[index].followUpAction = value.discoveryListValuesId
        newData[index].followUpActionError = '';
        return newData
      })
    } else if (fieldName === 'taTransfer') {
      setTaTakeOverData((prevData: any) => {
        const newData = [...prevData]
        newData[index].taTransfer = !newData[index].taTransfer

        if (newData[index].taTransfer) {
          newData[index].expectedTurnoverTaDisabled = false;
          newData[index].followUpActionDisabled = true;
          newData[index].followUpAction = '';
        } else {
          newData[index].expectedTurnoverTaDisabled = true;
          newData[index].followUpActionDisabled = false;
          newData[index].expectedTurnoverTa = '';
        }

        newData[index].expectedTurnoverTaError = '';
        newData[index].followUpActionError = '';

        return newData
      })
    } else {
      setTaTakeOverData((prevData: any) => {
        const newData = [...prevData]
        newData[index][fieldName] = value.replace(/\D/g, '')
        newData[index][`${fieldName}Error`] = '';
        return newData
      })
    }

    if (!isEditable) {
      setIsEditable(true)
    }
  };

  const handleTaTakeoverBtn = () => {
    handleDisplayTa(taTakeoverInput)
    if (!isEditable) {
      setIsEditable(true)
    }
  };

  const handleTaTakeoverInput = (value: string) => {
    setTaTakeoverInput(value.replace(/[^0-9]/g, ''))
  }

  return (
    <View marginT-v4>
      <View centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          TA Takeover
        </Text>
      </View>
      <View marginT-v2 row>
        <View flex marginR-v2 marginT-v03>
          <InputText
            value={taTakeoverInput}
            onChangeText={handleTaTakeoverInput}
            isEditable={!isTaTakeOverDisabled}
            maxLength={10}
            errorMsg={errorMessages?.taTakeoverInput}
          />
        </View>
        <View flex marginT-v06 style={tw('items-start justify-start')}>
          <TouchableOpacity
            style={tw(
              `${isTaTakeOverDisabled
                ? BUTTON_TYPE.PRIMARY_DISABLED
                : BUTTON_TYPE.PRIMARY_BORDER_ENABLED
              } px-36px`,
            )}
            onPress={handleTaTakeoverBtn}
            disabled={isTaTakeOverDisabled}
          >
            <Text text13R style={tw(
              `${isTaTakeOverDisabled
                ? BUTTON_TYPE.PRIMARY_DISABLED_LABEL
                : BUTTON_TYPE.PRIMARY_BORDER_ENABLED_LABEL
              }`,
            )}>
              Display TA
            </Text>
          </TouchableOpacity>
        </View>
        <View flex marginR-v2 />
        <View flex marginR-v2 />
      </View>
      {taTakeOverData.length > 0 && <View>
        <View marginT-v5>
          <TATakeoverListingHeaderComponent />
        </View>
        <View flex style={tw('border-light-grey1')}>
          <FlashList
            data={taTakeOverData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <RenderTATakeoverComponent
                  item={item}
                  index={index}
                  lastItem={taTakeOverData.length - 1 === index}
                  handleInputChange={handleInputChange}
                  followUpActionsDropdownData={followUpActionsDropdownData}
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
      </View>}
    </View>
  );
};

export default TATakeoverComponent;
