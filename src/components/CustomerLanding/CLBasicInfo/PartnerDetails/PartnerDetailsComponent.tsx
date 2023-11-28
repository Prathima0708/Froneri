import View from 'src/components/View';
import Text from 'src/components/Text';
import Card from 'src/components/Card';
import React, { useState } from 'react';
import PDTopTabComponent from './PDTopTabComponent';
import { PARTNER_DETAILS_TYPES } from 'src/utils/Constant';
import { removeLeadingZeroes } from 'src/utils/CommonUtil';
import CopyTextComponent from 'src/components/Common/CopyTextComponent';

const PartnerDetailsComponent = (props: any) => {
  const { partnerDetails } = props;
  const [pdSelectedValue, setPDSelectedValue] = useState(
    PARTNER_DETAILS_TYPES.SHIP_TO,
  );

  const handlePDSelectedValue = (data: string) => {
    setPDSelectedValue(data);
  };
  let partnerInfo: any = {};
  let partnerNo = '';
  let salesArea = '';
  let name1 = '';
  let name2 = '';
  let name3 = '';
  let address = '';
  let postalCode = '';
  let phone = '';
  let fax = '';
  let email = '';

  if (pdSelectedValue === PARTNER_DETAILS_TYPES.SHIP_TO) {
    partnerInfo = partnerDetails.customersShipToInfo;
    partnerNo = partnerInfo.customerShipTo
      ? removeLeadingZeroes(partnerInfo.customerShipTo)
      : '-';
  }
  if (pdSelectedValue === PARTNER_DETAILS_TYPES.BILL_TO) {
    partnerInfo = partnerDetails.customersBillToInfo;
    console.log('partnerInfo', partnerInfo);
    partnerNo = partnerInfo.billTo
      ? removeLeadingZeroes(partnerInfo.billTo)
      : '-';
  }
  if (pdSelectedValue === PARTNER_DETAILS_TYPES.SOLD_TO) {
    partnerInfo = partnerDetails.customersSoldToInfo;
    partnerNo = partnerInfo.soldTo
      ? removeLeadingZeroes(partnerInfo.soldTo)
      : '-';
  }
  if (pdSelectedValue === PARTNER_DETAILS_TYPES.PAYER) {
    partnerInfo = partnerDetails.customersPayerInfo;
    partnerNo = partnerInfo.payer
      ? removeLeadingZeroes(partnerInfo.payer)
      : '-';
  }

  salesArea = partnerInfo.salesArea ? partnerInfo.salesArea : '-';
  name1 = partnerInfo.name1 ? partnerInfo.name1 : '-';
  name2 = partnerInfo.name2 ? partnerInfo.name2 : '-';

  name3 = partnerInfo.name3 ? partnerInfo.name3 : '-';
  address = partnerInfo.address ? partnerInfo.address : '-';
  postalCode = partnerInfo.postalCode ? partnerInfo.postalCode : '-';
  phone =
    partnerInfo?.phone && partnerInfo?.phone.trim() ? partnerInfo.phone : '-';
  fax = partnerInfo.fax ? partnerInfo.fax : '-';
  email = partnerInfo.email ? partnerInfo.email : '-';

  return (
    <Card flex-1 marginR-v2 padding-v3>
      <Text text18M textBlack>
        Partner Details
      </Text>
      <PDTopTabComponent
        handleChangeTab={handlePDSelectedValue}
        parterDetailsSelectedValue={pdSelectedValue}
      />
      <View marginT-v2>
        <View row centerV paddingH-v3 paddingV-7>
          <Text flex-2 text13R textBlack>
            {pdSelectedValue} | Sales Area
          </Text>
          <Text flex-3 numberOfLines={1}>
            {`${partnerNo} | ${salesArea}`}
          </Text>
        </View>
        <View row centerV paddingH-v3 paddingV-7>
          <Text flex-2 text13R textBlack>
            Name 1
          </Text>
          <Text flex-3 numberOfLines={1}>
            {name1}
          </Text>
        </View>
        <View row centerV paddingH-v3 paddingV-7>
          <Text flex-2 text13R textBlack>
            Name 2
          </Text>
          <Text flex-3 numberOfLines={1}>
            {name2}
          </Text>
        </View>
        <View row centerV paddingH-v3 paddingV-7>
          <Text flex-2 text13R textBlack>
            Name 3
          </Text>
          <Text flex-3 numberOfLines={1}>
            {name3}
          </Text>
        </View>
        <View row centerV paddingH-v3 paddingV-7>
          <Text flex-2 text13R textBlack>
            Address
          </Text>
          <CopyTextComponent
            numberOfLines={1}
            text={`${address} ${postalCode}`}
            viewStyle={{ 'flex-3': true, 'centerV': true }}
          />
        </View>
        <View row centerV paddingH-v3 paddingV-7>
          <Text flex-2 text13R textBlack>
            Phone | Fax
          </Text>
          <View row flex-3 centerV>
            <CopyTextComponent
              numberOfLines={1}
              text={phone}
              viewStyle={{
                'centerV': true,
                'marginR-v1': true,
              }}
            />
            <Text flex-3 numberOfLines={1}>
              {`|  ${fax}`}
            </Text>
          </View>
        </View>
        <View row centerV paddingH-v3 paddingV-7>
          <Text flex-2 text13R textBlack>
            E-mail
          </Text>
          <CopyTextComponent
            text13R
            textBlack
            numberOfLines={1}
            text={email}
            viewStyle={{ 'flex-3': true }}
          />
        </View>
      </View>
    </Card>
  );
};

export default PartnerDetailsComponent;
