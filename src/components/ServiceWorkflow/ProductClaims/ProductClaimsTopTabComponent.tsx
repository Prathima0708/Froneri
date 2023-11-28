import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {PRODUCT_CLAIMS_TYPES} from 'src/utils/Constant';

interface ProductClaimsTopTabComponentProps {
  handleChangeTab: any;
  parterDetailsSelectedValue: string;
}

const ProductClaimsTopTabComponent = (
  props: ProductClaimsTopTabComponentProps,
) => {
  const {handleChangeTab, parterDetailsSelectedValue} = props;

  const PRODUCT_CLAIMS_FILTERS = [
    {id: 1, title: PRODUCT_CLAIMS_TYPES.PRODUCT_DETAILS},
    {id: 2, title: PRODUCT_CLAIMS_TYPES.CLAIMS_SETTLEMENTS},
  ];

  const handleNotesTab = (id: number) => {
    let parterDetailsSelectedValue = PRODUCT_CLAIMS_TYPES.PRODUCT_DETAILS;
    if (id == 1) {
      parterDetailsSelectedValue = PRODUCT_CLAIMS_TYPES.PRODUCT_DETAILS;
    } else if (id == 2) {
      parterDetailsSelectedValue = PRODUCT_CLAIMS_TYPES.CLAIMS_SETTLEMENTS;
    }
    handleChangeTab(parterDetailsSelectedValue);
  };

  return (
    <View row>
      {PRODUCT_CLAIMS_FILTERS.map((item, i) => {
        return (
          <View key={item.id}>
            <TouchableOpacity
              style={tw(
                `${
                  item.title == parterDetailsSelectedValue
                    ? 'bg-light-lightBlue1'
                    : ''
                } rounded-md justify-center items-center px-12px py-2 mr-6`,
              )}
              onPress={() => handleNotesTab(item.id)}>
              <Text
                text13R
                darkBlue
                style={tw(
                  `${
                    item.title == parterDetailsSelectedValue
                      ? 'text-light-darkBlue'
                      : 'text-light-grey1'
                  }`,
                )}>
                {item.title}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default ProductClaimsTopTabComponent;
