import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Card from 'src/components/Card';
import { tw } from 'src/tw';
import { VISITS_CALL_STATUS } from 'src/utils/DbConst';
import { RootState, useAppSelector } from 'src/reducers/hooks';

interface UpcomingVisitComponentProps {
  visitDate: string;
  visitStartTime: string;
  visitEndTime: string;
  duration: number;
  visitObjective: string;
  showButtons: boolean;
  visitCallStatus: string;
  onStartButtonPress: any;
  onPauseButtonPress: any;
  onResumeButtonPress: any;
  onFinishButtonPress: any;
  onRightIconPress: any;
}

const UpcomingVisitComponent = (props: UpcomingVisitComponentProps) => {
  const {
    visitStartTime,
    visitEndTime,
    showButtons,
    visitCallStatus,
    onStartButtonPress,
    onPauseButtonPress,
    onResumeButtonPress,
    onFinishButtonPress,
    onRightIconPress,
  } = props;

  const onVisitButtonPress = () => {
    if (visitCallStatus === VISITS_CALL_STATUS.INITIAL) {
      onStartButtonPress();
    } else if (visitCallStatus === VISITS_CALL_STATUS.OPEN) {
      onFinishButtonPress();
    } else if (visitCallStatus === VISITS_CALL_STATUS.ONHOLD) {
      onResumeButtonPress();
    }
  };

  const visitDate =
    props.visitDate && props.visitDate.trim() ? props.visitDate : '--';
  const duration = props.duration && props.duration ? props.duration : '--';
  const visitObjective =
    props.visitObjective && props.visitObjective.trim()
      ? props.visitObjective
      : '--';

  const visitTime =
    visitStartTime && visitEndTime
      ? visitStartTime + ' - ' + visitEndTime
      : '--';
  const title =
    visitCallStatus === VISITS_CALL_STATUS.OPEN ||
      visitCallStatus === VISITS_CALL_STATUS.ONHOLD
      ? 'label.general.current_visit'
      : 'label.general.upcoming_visit';

  let visitButtonText = ''
  if (visitCallStatus === VISITS_CALL_STATUS.INITIAL) {
    visitButtonText = 'Start Visit'
  } else if (visitCallStatus === VISITS_CALL_STATUS.OPEN) {
    visitButtonText = 'Finish Visit'
  } else if (visitCallStatus === VISITS_CALL_STATUS.ONHOLD) {
    visitButtonText = 'Resume Visit'
  }

  return (
    <Card marginB-v2 paddingH-v4 paddingV-v3>
      <View row spread centerV>
        <View row centerV>
          <Text text18M textBlack marginR-v2 marginT-v1>
            {title}
          </Text>
          {visitCallStatus === VISITS_CALL_STATUS.OPEN ? (
            <images.InProgressPillIcon />
          ) : visitCallStatus === VISITS_CALL_STATUS.ONHOLD ? (
            <images.PausedPillIcon />
          ) : null}
        </View>
        {visitDate !== '--' &&
          <TouchableOpacity onPress={onRightIconPress}>
            <images.DefaultRightArrowIcon />
          </TouchableOpacity>
        }
      </View>
      <View marginT-v2>
        <View row>
          <Text text13R textLight flex marginR-v2>
            Visit Date
          </Text>
          <Text text13R textBlack flex-3>
            {visitDate}
          </Text>
        </View>
        <View row marginT-v2>
          <Text text13R textLight flex marginR-v2>
            Visit Time
          </Text>
          <Text text13R textBlack flex-3>
            {visitTime}
          </Text>
        </View>
        <View row marginT-v2>
          <Text text13R textLight flex marginR-v2>
            Duration
          </Text>
          <Text text13R textBlack flex-3>
            {duration}
          </Text>
        </View>
        <View row marginT-v2>
          <Text text13R textLight flex marginR-v2>
            Visit Objective
          </Text>
          <Text text13R textBlack flex-3 numberOfLines={3}>
            {visitObjective}
          </Text>
        </View>
      </View>
      {showButtons && (
        <View right marginT-v4 marginB-v2 row centerV>
          {visitCallStatus === VISITS_CALL_STATUS.OPEN && (
            <TouchableOpacity
              style={tw(
                'flex-row border-light-darkBlue border-default items-center rounded-md px-8 py-5px mr-6',
              )}
              onPress={onPauseButtonPress}>
              <images.PauseIcon />
              <Text text13R darkBlue marginL-v1>
                Pause Visit
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={tw(
              'bg-light-darkBlue flex-row items-center rounded-md px-8 py-2-1',
            )}
            onPress={onVisitButtonPress}>
            {visitCallStatus === VISITS_CALL_STATUS.OPEN ? (
              <images.FinishIcon />
            ) : (
              <images.PlayIcon />
            )}
            <Text text13R white marginL-v1>
              {visitButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
};

export default UpcomingVisitComponent;
