import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { pageNamePLCreateEditCA } from 'src/routes/Routes';
import { AGREEMENT_STATUS_PILLS_CONFIG } from '../PLTradeAssets/RenderTAComponent';
import { YAMBS_WORKFLOW_STATUS_TYPE } from 'src/utils/DbConst';
import PillsComponent from 'src/components/Common/PillsComponent';

interface RenderConditionAgreementProps {
  item: any;
  lastItem: boolean;
  index: number;
}

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

const RenderConditionAgreement = (props: RenderConditionAgreementProps) => {
  const navigation = useNavigation();
  const { item, lastItem, index } = props;

  const conditionAgreementNumber = item?.conditionAgreementNumber
    ? item?.conditionAgreementNumber.trim()
    : '--';
  const description = item?.description ? item?.description.trim() : '--';
  const createdby = item?.createdby ? item?.createdby.trim() : '--';
  const creationDatetime = item?.creationDatetime
    ? item?.creationDatetime.trim()
    : '--';
  const status = item?.status ? item?.status.trim() : '--';

  let statusColourPalette = AGREEMENT_STATUS_PILLS_CONFIG.OPEN;

  const handleNavigation = () => {
    navigation.navigate(pageNamePLCreateEditCA as never, {
      data: item,
      isEditable: true,
    } as never);
  };

  console.log('conditionStatus :>> ', item?.yambsStatus);

  if (item?.yambsStatus === YAMBS_WORKFLOW_STATUS_TYPE.COMPLETED) {
    statusColourPalette = AGREEMENT_STATUS_PILLS_CONFIG.FINALIZED;
  }

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View
        row
        centerV
        padding-v4
        style={[
          tw(
            `${lastItem ? 'rounded-b-md' : ''
            } border-l-default border-r-default border-b-default border-light-lavendar`,
          ),
          { backgroundColor: colors[index % colors.length] },
        ]}>
        <Text flex-2 text13R textBlack marginR-v5 numberOfLines={1}>
          {conditionAgreementNumber}
        </Text>
        <Text flex-2 text13R textBlack marginR-v5 numberOfLines={1}>
          {description}
        </Text>
        <Text flex text13R textBlack marginR-v5 numberOfLines={1}>
          {createdby}
        </Text>
        <Text flex text13R textBlack marginR-v5 numberOfLines={1}>
          {creationDatetime}
        </Text>
        <View flex >
          <PillsComponent item={{
            title: status,
            ...statusColourPalette
          }} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderConditionAgreement;
