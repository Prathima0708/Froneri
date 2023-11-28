import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {useState} from 'react';
import Card from 'src/components/Card';
import {CUSTOMER_DETAILS_TYPES} from 'src/utils/Constant';
import CustomerDetailsTopTabComponent from './CustomerDetailsTopTabComponent';
import {removeLeadingZeroes} from 'src/utils/CommonUtil';

const CustomerDetailsComponent = (props: any) => {
  const {customerDetails} = props;

  const [cdSelectedValue, setCDSelectedValue] = useState(
    CUSTOMER_DETAILS_TYPES.GENERAL_INFORMATION,
  );

  const handleCDSelectedValue = (data: string) => {
    setCDSelectedValue(data);
  };

  let title1 = '';
  let title2 = '';
  let title3 = '';
  let title4 = '';
  let title5 = '';

  let value1 = '';
  let value2 = '';
  let value3 = '';
  let value4 = '';
  let value5 = '';

  // General Information
  if (cdSelectedValue == CUSTOMER_DETAILS_TYPES.GENERAL_INFORMATION) {
    title1 = 'Wholesaler';
    title2 = 'Outlet Classification / Channel';
    title3 = 'ABC Classification';
    title4 = 'Payment Term';
    title5 = 'VAT Registration Number';

    value1 = customerDetails?.generalInfo?.wholesaler
      ? removeLeadingZeroes(customerDetails?.generalInfo?.wholesaler).toString()
      : '-';
    value2 = customerDetails?.generalInfo?.outletClassification
      ? customerDetails?.generalInfo?.outletClassification
      : '-';
    value3 = customerDetails?.generalInfo?.abcClassification
      ? customerDetails?.generalInfo?.abcClassification
      : '-';
    value4 = customerDetails?.generalInfo?.paymentTerm
      ? customerDetails?.generalInfo?.paymentTerm
      : '-';
    value5 = customerDetails?.generalInfo?.vatRegistrationNumber
      ? customerDetails?.generalInfo?.vatRegistrationNumber
      : '-';
  }

  // Hierarchy Information
  if (cdSelectedValue == CUSTOMER_DETAILS_TYPES.CUSTOMER_HIERARCHY) {
    title1 = 'L3';
    title2 = 'L4';
    title3 = 'L5';
    title4 = 'L6';

    value1 = customerDetails?.hierarchyInfo?.level3
      ? customerDetails?.hierarchyInfo?.level3
      : '-';
    value2 = customerDetails?.hierarchyInfo?.level4
      ? customerDetails?.hierarchyInfo?.level4
      : '-';
    value3 = customerDetails?.hierarchyInfo?.level5
      ? customerDetails?.hierarchyInfo?.level5
      : '-';
    value4 = customerDetails?.hierarchyInfo?.level6
      ? customerDetails?.hierarchyInfo?.level6
      : '-';
  }

  // Territory Information
  if (cdSelectedValue == CUSTOMER_DETAILS_TYPES.TERRITORY_INFORMATION) {
    title1 = 'Sales Representative';
    title2 = 'Sales Manager';
    title3 = 'Key Account Manager';
    title4 = 'Sales Responsible';

    value1 = customerDetails?.territoryInfo?.salesRepresentative
      ? customerDetails?.territoryInfo?.salesRepresentative
      : '-';
    value2 = customerDetails?.territoryInfo?.salesManager
      ? customerDetails?.territoryInfo?.salesManager
      : '-';
    value3 = customerDetails?.territoryInfo?.keyAccountManager
      ? customerDetails?.territoryInfo?.keyAccountManager
      : '-';
    value4 = customerDetails?.territoryInfo?.salesResponsible
      ? customerDetails?.territoryInfo?.salesResponsible
      : '-';
  }

  return (
    <Card flex-1 padding-v3>
      <Text text18M textBlack>
        Customer Details
      </Text>
      <CustomerDetailsTopTabComponent
        handleChangeTab={handleCDSelectedValue}
        customerDetailsSelectedValue={cdSelectedValue}
      />
      <View marginT-v2>
        <View row centerV paddingH-v3 paddingV-7>
          <Text flex-2 text13R textBlack>
            {title1}
          </Text>
          <Text flex-3 text13R textBlack numberOfLines={1}>
            {value1}
          </Text>
        </View>
        <View row centerV paddingH-v3 paddingV-7>
          <Text flex-2 text13R textBlack>
            {title2}
          </Text>
          <Text flex-3 text13R textBlack numberOfLines={0}>
            {value2}
          </Text>
        </View>
        <View row centerV paddingH-v3 paddingV-7>
          <Text flex-2 text13R textBlack>
            {title3}
          </Text>
          <Text flex-3 text13R textBlack numberOfLines={1}>
            {value3}
          </Text>
        </View>
        <View row centerV paddingH-v3 paddingV-7>
          <Text flex-2 text13R textBlack>
            {title4}
          </Text>
          <Text flex-3 text13R textBlack numberOfLines={1}>
            {value4}
          </Text>
        </View>
        {cdSelectedValue == CUSTOMER_DETAILS_TYPES.CUSTOMER_HIERARCHY ||
        cdSelectedValue ==
          CUSTOMER_DETAILS_TYPES.TERRITORY_INFORMATION ? null : (
          <View row centerV paddingH-v3 paddingV-7>
            <Text flex-2 text13R textBlack>
              {title5}
            </Text>
            <Text flex-3 text13R textBlack numberOfLines={1}>
              {value5}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

export default CustomerDetailsComponent;
