import {FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import Card from 'src/components/Card';
import TurnoverFutureInfoTopTabComponent from './TurnoverFutureInfoTopTabComponent';
import {TURNOVER_FUTURE_INFO_TYPES} from 'src/utils/Constant';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {tw} from 'src/tw';
import VisitsNotesModal from 'src/components/CustomerLanding/CLVisitInfo/TurnoverFutureInfo/VisitNoteModal';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

const TurnoverFutureInfoComponent = (props: any) => {
  const {nextTenVisits, nextTenDeliveries, latestTwoVisitNotes} = props;
  const [turnoverFutureInfoValue, setTurnoverFutureInfoValue] = useState(
    TURNOVER_FUTURE_INFO_TYPES.NEXT_VISITS,
  );
  const [isVisitNotesModalVisible, setIsVisitNotesModalVisible] =
    useState(false);
  const [selectedNotes, setSelectedNotes] = useState({});

  let data = [];
  if (turnoverFutureInfoValue === TURNOVER_FUTURE_INFO_TYPES.NEXT_VISITS) {
    data = nextTenVisits;
  }
  if (turnoverFutureInfoValue === TURNOVER_FUTURE_INFO_TYPES.NEXT_DELIVERIES) {
    data = nextTenDeliveries;
  }
  if (turnoverFutureInfoValue === TURNOVER_FUTURE_INFO_TYPES.VISIT_NOTES) {
    console.log('Setting ten visits data', latestTwoVisitNotes);
    data = latestTwoVisitNotes;
  }

  const handleVisitNotes = (item: any) => {
    setSelectedNotes(item);
    setIsVisitNotesModalVisible(true);
  };

  const handleVisitNotesModalBack = () => {
    setIsVisitNotesModalVisible(false);
  };

  const handleTurnoverFutureInfoValue = (data: string) => {
    console.log('tab data :>> ', data);
    setTurnoverFutureInfoValue(data);
  };

  const renderNextVisitsAndDeliveries = ({item, index}: any) => {
    return (
      <View
        row
        centerV
        paddingH-v4
        paddingV-v06
        style={{backgroundColor: colors[index % colors.length]}}>
        <View row centerV>
          <Text flex text13R textBlack>
            {item.day}
          </Text>
          <Text flex text13R textBlack>
            {item.value}
          </Text>
        </View>
      </View>
    );
  };
  const renderVisitNotes = ({item, index}: any) => {
    const visitNote = item.visitNote ? item.visitNote : '';

    const visitDate = item.visitDate ? item.visitDate : '';
    return (
      <TouchableOpacity onPress={() => handleVisitNotes(item)}>
        <View
          row
          centerV
          paddingH-v4
          paddingV-v06
          style={{backgroundColor: colors[index % colors.length]}}>
          <View row centerV>
            <Text flex text13R textBlack>
              {visitDate}
            </Text>
            <Text flex-3 text13R textBlack numberOfLines={1}>
              {visitNote}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Card flex-1 marginR-v2 padding-v4>
      <TurnoverFutureInfoTopTabComponent
        handleChangeTab={handleTurnoverFutureInfoValue}
        turnoverFutureInfoSelectedValue={turnoverFutureInfoValue}
      />
      {data.length === 0 ? (
        <View flex center>
          <Text text12R textBlack center>
            {'No Data Found'}
          </Text>
        </View>
      ) : (
        <View flex>
          {turnoverFutureInfoValue == TURNOVER_FUTURE_INFO_TYPES.VISIT_NOTES ? (
            <View marginT-v2 flex>
              <FlatList
                data={latestTwoVisitNotes}
                keyExtractor={(item, i) => i.toString()}
                renderItem={renderVisitNotes}
              />
            </View>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item, i) => i.toString()}
              renderItem={renderNextVisitsAndDeliveries}
              style={tw('mt-6')}
            />
          )}
        </View>
      )}
      <VisitsNotesModal
        isVisitsNotesModalVisible={isVisitNotesModalVisible}
        selectedNotes={selectedNotes}
        handleBack={handleVisitNotesModalBack}
      />
    </Card>
  );
};

export default TurnoverFutureInfoComponent;
