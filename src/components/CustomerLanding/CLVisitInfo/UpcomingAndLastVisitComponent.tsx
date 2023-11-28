import View from 'src/components/View';
import Text from 'src/components/Text';
import {images} from 'src/assets/Images';
import Card from 'src/components/Card';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {tw} from 'src/tw';
import {RootState, useAppSelector} from 'src/reducers/hooks';
import {VISITS_CALL_STATUS} from 'src/utils/DbConst';

interface UpcomingAndLastVisitComponentProps {
  onPressUpcomingVisit?: any;
  screen: string;
  visitDate: string;
  visitStartTime: string;
  visitEndTime: string;
  duration: string;
  visitObjective: string;
  visitPreparationNotes: string;
  visitCallStatus: string;
}

const UpcomingAndLastVisitComponent = (
  props: UpcomingAndLastVisitComponentProps,
) => {
  const {
    onPressUpcomingVisit,
    screen,
    visitStartTime,
    visitEndTime,
    visitCallStatus,
  } = props;

  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );

  const handleClick = () => {
    if (screen == 'lastVisit') {
      onPressUpcomingVisit(true);
    } else {
      onPressUpcomingVisit();
    }
  };

  const visitDate =
    props.visitDate && props.visitDate.trim() ? props.visitDate : '--';
  const duration = props.duration && props.duration ? props.duration : '--';
  const visitObjective =
    props.visitObjective && props.visitObjective.trim()
      ? props.visitObjective
      : '--';
  const visitPreparationNotes =
    props.visitPreparationNotes && props.visitPreparationNotes.trim()
      ? props.visitPreparationNotes
      : '--';

  const visitTime =
    visitStartTime && visitEndTime
      ? visitStartTime + ' - ' + visitEndTime
      : '--';
  let title = '';
  if (
    visitCallStatus === VISITS_CALL_STATUS.OPEN ||
    visitCallStatus === VISITS_CALL_STATUS.ONHOLD
  ) {
    title = 'Current Visit';
  } else if (screen == 'upcomingVisit') {
    title = 'Upcoming Visit';
  } else {
    title = 'Last Visit';
  }

  return (
    <Card
      flex-1
      paddingH-v4
      paddingV-v3
      cardStyle={tw(`${screen == 'upcomingVisit' ? 'mr-3' : ''}`)}>
      <View row spread centerV>
        <View row centerV>
          <Text text18M textBlack marginR-v2>
            {title}
          </Text>
          {visitCallStatus === VISITS_CALL_STATUS.OPEN ? (
            <images.InProgressPillIcon />
          ) : visitCallStatus === VISITS_CALL_STATUS.ONHOLD ? (
            <images.PausedPillIcon />
          ) : null}
        </View>
        {visitStartTime && (
          <TouchableOpacity onPress={handleClick}>
            <images.DefaultRightArrowIcon />
          </TouchableOpacity>
        )}
        {/* {visitStartTime && <TouchableOpacity onPress={handleClick}>
          <images.DefaultRightArrowIcon />
        </TouchableOpacity>} */}
      </View>
      <View marginT-v2>
        <View row>
          <Text text13R textLight flex marginR-v2>
            Visit Date
          </Text>
          <Text text13R textBlack flex-2>
            {visitDate}
          </Text>
        </View>
        <View row marginT-v2>
          <Text text13R textLight flex marginR-v2>
            Visit Time
          </Text>
          <Text text13R textBlack flex-2>
            {visitTime}
          </Text>
        </View>
        <View row marginT-v2>
          <Text text13R textLight flex marginR-v2>
            Duration
          </Text>
          <Text text13R textBlack flex-2 numberOfLines={1}>
            {duration}
          </Text>
        </View>
        <View row marginT-v2>
          <Text text13R textLight flex marginR-v2>
            Visit Objective
          </Text>
          <Text text13R textBlack flex-2 numberOfLines={1}>
            {visitObjective}
          </Text>
        </View>
        <View row marginT-v2>
          <Text text13R textLight flex marginR-v2 numberOfLines={1}>
            Visit Preparation Notes
          </Text>
          <Text text13R textBlack flex-2 numberOfLines={2}>
            {visitPreparationNotes}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default UpcomingAndLastVisitComponent;
