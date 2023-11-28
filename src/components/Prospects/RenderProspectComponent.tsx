import { TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import CustomerIconComponent2 from 'src/components/Common/CustomerIconComponent2';
import PillsComponent from 'src/components/Common/PillsComponent';
import { PROSPECT_STATUS } from 'src/utils/Constant';
import { useNavigation } from '@react-navigation/native';
import { pageNameCreateProspect } from 'src/routes/Routes';
import { useAppDispatch } from 'src/reducers/hooks';
import PLOverviewController from 'src/controller/PLOverviewController';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderCustomerSearchProps {
  item: any;
  index: number;
  lastItem: boolean;
}
const RenderProspectComponent = (props: RenderCustomerSearchProps) => {
  const { item, index, lastItem } = props;
  const dispatch = useAppDispatch();

  const navigation = useNavigation();

  const name = item.name1 ? item.name1.trim() : '--';
  const status = item.newCustomerRequestStatus
    ? item.newCustomerRequestStatus.trim()
    : '--';
  const address = item.address1 ? item.address1.trim() : '--';
  const prospectNumber = item.prospectNumber
    ? item.prospectNumber.trim()
    : '--';
  const industryCode = item.industryCode ? item.industryCode.trim() : '--';

  const handleProspectLandingNavigation = () => {
    // dispatch(resetProspectLandingState())
    // navigation.navigate(pageNamePLOverview as never, {
    //   data: item
    // } as never);
    PLOverviewController.navigateToPLOverview(item)
  };

  const filteredProspectStatus = PROSPECT_STATUS.find(
    item => item.title === status,
  );
  const handleNavigation = () => {
    navigation.navigate(
      pageNameCreateProspect as never,
      { screenType: 'Edit', item: item } as never,
    );
  };

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View
        paddingH-v4
        row
        centerV
        paddingV-v1
        style={[
          tw(
            `${lastItem ? 'rounded-b-md' : ''
            } border-t-default border-light-lavendar`,
          ),
          { backgroundColor: colors[index % colors.length] },
        ]}>
        <View flex-3 row centerV marginR-v4>
          <CustomerIconComponent2 item={item} />
          <View marginL-v2 marginR-v4>
            <TouchableOpacity onPress={handleProspectLandingNavigation}>
              <Text
                numberOfLines={1}
                text13R
                textBlack
                marginV-v3
                style={tw(`${name === '--' ? '' : 'underline'}`)}>
                {name}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View flex-2 marginR-v4>
          <PillsComponent item={{ ...filteredProspectStatus }} />
        </View>
        <View flex-3 marginR-v4>
          <Text numberOfLines={1} text13R grey2>
            {address}
          </Text>
        </View>
        <View flex marginR-v4>
          <Text numberOfLines={1} text13R grey2>
            {prospectNumber}
          </Text>
        </View>
        <View flex-2>
          <Text numberOfLines={1} text13R grey2>
            {industryCode}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(RenderProspectComponent);
