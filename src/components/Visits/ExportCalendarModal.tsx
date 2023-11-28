import { ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import Modal from 'src/components/Modal';
import DateTimePicker from 'src/components/DateTimePicker';
import { DATETIME_PICKER_MODE } from 'src/utils/Constant';
import { ColourPalette } from 'src/styles/config/ColoursStyles';

interface ExportCalendarProps {
  onPressExport: any;
  onPressCancel: any;
  isModalVisible: boolean;
  loading: boolean;
}

const ExportCalendarModal = (props: ExportCalendarProps) => {
  const { onPressCancel, onPressExport, isModalVisible, loading } = props;
  const [visitedFrom, setVisitedFrom] = useState<any>(new Date());
  const [visitedTo, setVisitedTo] = useState<any>(new Date());

  const handleVisitedFrom = (date: any) => {
    setVisitedFrom(date);
  };

  const handleVisitedTo = (date: any) => {
    setVisitedTo(date);
  };

  const onExportButtonPress = () => {
    onPressExport(visitedFrom, visitedTo);
  };

  return (
    <Modal visible={isModalVisible}>
      <View flex center>
        <View bg-white br40 style={tw('self-center')} padding-v4>
          <Text text18BO textBlack center marginT-v2>
            label.visits.export_calendar
          </Text>
          <Text text13R textBlack center marginV-v4 style={tw("w-253px")}>
            message.visits.export_calendar_description
          </Text>
          <View>
            <Text text13M textBlack>
              label.general.visited_from
            </Text>
            <DateTimePicker
              dateFormat={'DD-MM-YYYY'}
              mode={DATETIME_PICKER_MODE.DATE}
              onChange={handleVisitedFrom}
              maximumDate={new Date()}
              renderInput={({ value }: any) => {
                return (
                  <View>
                    <TouchableOpacity
                      style={tw(
                        `bg-light-white flex-row items-center rounded-md border-default border-light-lavendar pl-3 justify-between mt-1`,
                      )}>
                      <Text text13R style={tw('text-light-textBlack')}>
                        {value}
                      </Text>
                      <images.CalendarIcon />
                    </TouchableOpacity>
                  </View>
                );
              }}
              value={visitedFrom}
            />
          </View>
          <View marginT-v4>
            <Text text13M textBlack>
              label.general.visited_to
            </Text>
            <DateTimePicker
              dateFormat={'DD-MM-YYYY'}
              mode={DATETIME_PICKER_MODE.DATE}
              maximumDate={new Date()}
              onChange={handleVisitedTo}
              renderInput={({ value }: any) => {
                return (
                  <View>
                    <TouchableOpacity
                      style={tw(
                        `bg-light-white flex-row items-center rounded-md border-default border-light-lavendar pl-3 justify-between mt-1`,
                      )}>
                      <Text text13R style={tw('text-light-textBlack')}>
                        {value}
                      </Text>
                      <images.CalendarIcon />
                    </TouchableOpacity>
                  </View>
                );
              }}
              value={visitedTo}
            />
          </View>
          <View marginT-v3>
            <TouchableOpacity
              onPress={onExportButtonPress}
              disabled={loading}
              style={tw(
                'bg-light-darkBlue justify-center items-center rounded-md w-64 mt-3 flex-row py-2',
              )}>
              {
                loading ? <ActivityIndicator size="small" color={ColourPalette.light.white} style={tw('mt-1')} /> :
                  <>
                    <images.ExportWhiteIcon />
                    <Text text13R white marginL-v1>
                      label.visits.export
                    </Text>
                  </>
              }
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressCancel}
              style={tw(
                ' justify-center items-center rounded-md w-64 mt-12px',
              )}>
              <Text text13R grey2 marginV-v2>
                btn.general.cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ExportCalendarModal;
