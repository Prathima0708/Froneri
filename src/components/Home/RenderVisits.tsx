import { TouchableWithoutFeedback } from 'react-native';
import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { VISIT_STATUS } from 'src/utils/Constant';
import { getDuration, getOnlyDate, getOnlyTime } from 'src/utils/CommonUtil';
import CustomerIconComponent from 'src/components/Common/CustomerIconComponent';
import { VISITS_CALL_STATUS } from 'src/utils/DbConst';

let colors = [ColourPalette.light.white, ColourPalette.light.offWhite];

interface RenderVisitsProps {
  item: any;
  index: number;
  visitStatus: string;
  handleVisitPressed: any;
}
const RenderVisits = (props: RenderVisitsProps) => {
  const { item, index, visitStatus, handleVisitPressed } = props;

  const callFromDate = getOnlyDate(item.call_from_datetime);
  const callFromTime = getOnlyTime(item.call_from_datetime);
  const timeDuration = getDuration(
    item.call_from_datetime,
    item.call_to_datetime,
  );

  let name2 = '';
  if (item.name2 !== 'NULL' && item.name3 !== 'NULL') {
    name2 = item.name2 + ' ' + item.name3;
  } else if (item.name2 !== 'NULL') {
    name2 = item.name2;
  } else if (item.name3 !== 'NULL') {
    name2 = item.name3;
  }

  let address = item.address1 + ' ' + item.city + ' ' + item.postal_code;

  const visitPressed = () => {
    handleVisitPressed && handleVisitPressed(item);
  };

  return (
    <TouchableWithoutFeedback
      onPress={visitPressed}
      style={{ backgroundColor: colors[index % colors.length] }}>
      <View row centerV padding-v3>
        <View row flex>
          <CustomerIconComponent item={item} />
        </View>
        <View row flex-16 style={tw('justify-between')}>
          <View flex-2 marginR-v2>
            <Text numberOfLines={1} text13R textBlack>
              {item.customer_name}
            </Text>
            <Text textLight text13R>
              {item.customer_ship_to}
            </Text>
          </View>
          <View flex-2 marginR-v2>
            <Text numberOfLines={2} textLight text13R>
              {name2}
            </Text>
          </View>
          <View flex-2 marginR-v2>
            <Text numberOfLines={2} textLight text13R>
              {address}
            </Text>
          </View>
          <View marginR-v2 flex>
            {visitStatus === VISIT_STATUS.MISSED ? (
              <Text textLight text13R>
                {callFromDate}
              </Text>
            ) : null}
            {item.call_status === VISITS_CALL_STATUS.OPEN &&
              <View row centerV>
                <View
                  style={tw(
                    'bg-light-lightGreen h-3 w-3 rounded-md mr-1',
                  )} />
                <Text text13R darkBlue4>
                  label.general.in_progress
                </Text>
              </View>}
          </View>
          <View marginR-v2>
            <Text textLight text13R style={tw('self-end')}>
              {callFromTime}
            </Text>
            <Text textLight text13R style={tw('self-end')}>
              {timeDuration}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RenderVisits;
