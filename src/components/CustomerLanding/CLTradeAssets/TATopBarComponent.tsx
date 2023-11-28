import { TouchableOpacity, Linking } from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { images } from 'src/assets/Images';
import React, { useState } from 'react';
import Dropdown from 'src/components/DropDown';
import { TA_ORDERS_DROPDOWN } from 'src/utils/DropdownConst';
import { toast } from 'src/utils/Util';

const TATopBarComponent = () => {
  const [tradeAssetsDropdown, setTradeAssetsDropdown] = useState('');

  const handleTADropdown = (data: any) => {
    toast.info({
      message: 'Screen is in progress',
    })
    // setTradeAssetsDropdown(data.value);
  };

  const handleMaterialInfo = async () => {
    const url = 'https://www.froneri-shop.ch/';
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      toast.error({
        message: 'Something went wrong',
      })
    }
  };

  const renderTAOrderDropdown = (item: any) => {
    return (
      <View row centerV padding-v1>
        <images.ExternalLinkIcon />
        <Text text13R textBlack marginL-v1>
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <View padding-v4 row centerV right>
      <TouchableOpacity onPress={handleMaterialInfo}>
        <View
          br20
          row
          padding-v1
          paddingR-v2
          centerV
          style={tw('border-default border-light-lavendar')}>
          <images.ExternalLinkIcon />
          <Text text13R textBlack marginL-v01 marginT-v02>
            Material Information
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleTADropdown}>
        <View
          marginH-v6
          br20
          row
          padding-v1
          centerV
          style={tw('border-default border-light-lavendar')}>
          <images.ContractIcon />
          <Text text13R textBlack marginL-v01 marginT-v02>
            TA Contracts
          </Text>
        </View>
      </TouchableOpacity>
      <Dropdown
        extraStyle={'w-170px bg-light-darkBlue '}
        extraSelectedTextStyle={'pl-1 text-light-white'}
        extraPlaceholderStyle={'pl-1 text-light-white'}
        labelField="label"
        valueField="value"
        renderItem={renderTAOrderDropdown}
        placeholder="TA Orders"
        data={TA_ORDERS_DROPDOWN}
        value={tradeAssetsDropdown}
        onChange={handleTADropdown}
        icon={<images.WhiteDownIcon />}
      />
    </View>
  );
};

export default TATopBarComponent;
