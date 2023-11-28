import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { useEffect, useState } from 'react';
import { tw } from 'src/tw';
import { TouchableOpacity } from 'react-native';
import ClientDetailToolTip from './ClientDetailToolTip';
import InputText from 'src/components/InputText';

interface ClientDetailHeaderComponentProps {
  handleGetInfo: any;
  isEditable?: boolean;
  screenType?: string;
  previousCustomerShipTo: string;
  handleCreateProspect?: any;
  mandatoryData: any;
  errorPreviousCustomerShipTo: string;
  setErrorPreviousCustomerShipTo: any;
}

const ClientDetailHeaderComponent = (
  props: ClientDetailHeaderComponentProps,
) => {
  const {
    handleGetInfo,
    isEditable,
    screenType,
    previousCustomerShipTo,
    handleCreateProspect,
    mandatoryData,
    errorPreviousCustomerShipTo,
    setErrorPreviousCustomerShipTo,
  } = props;

  const [prevCustomerShipToNumber, setPrevCustomerShipToNumber] = useState('');

  useEffect(() => {
    setPrevCustomerShipToNumber(previousCustomerShipTo);
  }, [previousCustomerShipTo])


  const previousCustomerShipToTitle =
    mandatoryData.previousShipToNo === 1
      ? 'label.general.previous_customer_Ship_to*'
      : 'label.general.previous_customer_Ship_to';

  const handlePrevCustomerShipToNumber = (value: string) => {
    setPrevCustomerShipToNumber(value);
    setErrorPreviousCustomerShipTo('');
  };

  const handleGetInfoButton = () => {
    if (prevCustomerShipToNumber.trim().length === 0) {
      setErrorPreviousCustomerShipTo('msg.createprospect.enter_previous_customer_ship_to_number');
      return;
    }

    if (isNaN(Number(prevCustomerShipToNumber))) {
      setErrorPreviousCustomerShipTo(
        'msg.createprospect.enter_valid_previous_customer_ship_to_number',
      );
      return;
    }

    handleGetInfo(prevCustomerShipToNumber);
  };

  return (
    <View>
      <View centerV row spread>
        <View row centerV>
          <Text text18M textBlack>
            {'label.createprospect.client_details'}
          </Text>
          <View marginL-v1>
            <ClientDetailToolTip />
          </View>
        </View>
        {screenType == 'Create' && (
          <TouchableOpacity
            style={tw(
              `bg-light-darkBlue rounded-md py-2 px-36px flex-row items-center ml-6`,
            )}
            onPress={handleCreateProspect}>
            <Text text13R style={tw(`text-light-white`)}>
              {'btn.general.save'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View marginT-v2 row centerV>
        <View row flex marginR-v2>
          <View flex>
            <InputText
              title={previousCustomerShipToTitle}
              isEditable={isEditable}
              value={prevCustomerShipToNumber}
              onChangeText={handlePrevCustomerShipToNumber}
              keyboardType="numeric"
              maxLength={10}
              errorMsg={errorPreviousCustomerShipTo}
            />
          </View>
          <View flex-3 marginT-v4 marginL-v2 marginR-v4 left>
            <TouchableOpacity
              disabled={!isEditable}
              style={tw(
                `${isEditable
                  ? 'border-light-darkBlue'
                  : 'border-light-lavendar bg-light-white1'
                }  rounded-md py-2 px-2 flex-row items-center border-default`,
              )}
              onPress={handleGetInfoButton}>
              <Text
                text13R
                style={tw(
                  `${isEditable ? 'text-light-darkBlue' : 'text-light-grey1'}`,
                )}>
                btn.createprospect.get_info
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View marginV-v4 style={tw('bg-light-lavendar h-px')} />
    </View>
  );
};

export default ClientDetailHeaderComponent;
