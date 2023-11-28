import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import View from 'src/components/View';
import Text from 'src/components/Text';
import CheckBox from 'src/components/CheckBox';
import PillsComponent from 'src/components/Common/PillsComponent';

import { pageNamePLTAChargeOff, pageNamePLTARequest } from 'src/routes/Routes';

import { tw } from 'src/tw';

import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { YAMBS_WORKFLOW_STATUS_TYPE } from 'src/utils/DbConst';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderTAComponentProps {
  item: any;
  index: number;
  lastItem: boolean;
}

export const AGREEMENT_STATUS_PILLS_CONFIG = {
  OPEN: {
    bgColor: 'bg-light-lightGrey',
    borderColor: 'border-light-grey5',
    textColor: 'text-light-textBlack',
  },
  FINALIZED: {
    bgColor: 'bg-light-green100',
    borderColor: 'border-light-green300',
    textColor: 'text-light-green800',
  }
}

const RenderTAComponent = (props: RenderTAComponentProps) => {
  const navigation = useNavigation();

  const { item, index, lastItem } = props;

  const taLoanNumber = item?.taLoanAgreementNumber ? item?.taLoanAgreementNumber.trim() : '--';
  const taWish = item?.taWish ? "Yes" : "No";
  const taTakeOver = item?.too ? "Yes" : "No";
  const createdBy = item?.createdBy ? item?.createdBy.trim() : '--';
  const createdDate = item?.creationDate ? item?.creationDate.trim() : '--';
  const status = item?.status ? item?.status.trim() : '--';

  let statusColourPalette = AGREEMENT_STATUS_PILLS_CONFIG.OPEN;

  const handleNavigation = () => {
    if (item.taProcess === '1') {
      navigation.navigate(pageNamePLTARequest as never, {
        data: item,
        isEditable: true
      } as never)
    } else {
      navigation.navigate(pageNamePLTAChargeOff as never, {
        data: item,
        isEditable: true
      } as never)
    }
  };

  if (item?.yambsStatus === YAMBS_WORKFLOW_STATUS_TYPE.REQUESTED || item?.yambsStatus === YAMBS_WORKFLOW_STATUS_TYPE.COMPLETED || item?.yambsStatus === YAMBS_WORKFLOW_STATUS_TYPE.NOT_REQUIRED) {
    statusColourPalette = AGREEMENT_STATUS_PILLS_CONFIG.FINALIZED;
  }

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View
        flex
        paddingH-v4
        row
        paddingV-v4
        style={[
          tw(
            `${lastItem ? 'rounded-b-md' : ''
            } border-l-default border-r-default border-b-default border-light-lavendar`,
          ),
          { backgroundColor: colors[index % colors.length] },
        ]}>
        <View flex marginR-v4>
          <Text numberOfLines={1} text13R textBlack>
            {taLoanNumber}
          </Text>
        </View>
        <View flex style={tw('items-center')}>
          <Text numberOfLines={1} text13R textBlack>
            {taWish}
          </Text>
        </View>
        <View flex style={tw('items-center')}>
          <Text numberOfLines={1} text13R textBlack>
            {taTakeOver}
          </Text>
        </View>
        <View flex style={tw('items-center')}>
          <Text numberOfLines={1} text13R textBlack>
            {createdBy}
          </Text>
        </View>
        <View flex style={tw('items-center')}>
          <Text numberOfLines={1} text13R textBlack>
            {createdDate}
          </Text>
        </View>
        <View flex style={tw('items-center')}>
          <View>
            <PillsComponent item={{
              title: status,
              ...statusColourPalette
            }} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(RenderTAComponent);
