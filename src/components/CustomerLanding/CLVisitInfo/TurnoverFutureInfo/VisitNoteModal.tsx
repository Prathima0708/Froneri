import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import React, { useState } from 'react';
import Modal from 'src/components/Modal';
import { TouchableOpacity } from 'react-native';
import { getOnlyDate } from 'src/utils/CommonUtil';

interface VisitsNotesModalProps {
  isVisitsNotesModalVisible: boolean;
  handleBack: any;
  selectedNotes: any;
}

const VisitsNotesModal = (props: VisitsNotesModalProps) => {
  const { isVisitsNotesModalVisible, handleBack, selectedNotes } = props;

  const visitNote = selectedNotes.visitNote ? selectedNotes.visitNote : '--';
  const visitDate = selectedNotes.visitDate ? selectedNotes.visitDate : '--';
  const salesRepName = selectedNotes.salesRepName
    ? selectedNotes.salesRepName
    : '--';
  const visitObjective = selectedNotes.visitObjective
    ? selectedNotes.visitObjective
    : '--';

  const onBackPress = () => {
    handleBack();
  };

  return (
    <Modal
      visible={isVisitsNotesModalVisible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View
        bg-white
        padding-v4
        style={[tw('flex-1 w-1/2'), { marginLeft: '50%' }]}>
        <View row centerV spread>
          <View row>
            <TouchableOpacity style={tw('mr-8')} onPress={onBackPress}>
              <images.LeftArrowIcon />
            </TouchableOpacity>
            <View row centerV>
              <Text text18BO textBlack marginT-3>
                Note
              </Text>
            </View>
          </View>
        </View>
        <View marginT-v1>
          <Text text13M textBlack>
            Note
          </Text>
          <View
            style={tw(
              `bg-light-white1 rounded-md border-default border-light-lavendar mt-2 p-3 h-40`,
            )}>
            <Text grey1 text13R>
              {visitNote}
            </Text>
          </View>
        </View>
        <View row centerV marginT-v6>
          <View>
            <Text text13M textBlack>
              Visited On
            </Text>
            <Text text13R textBlack marginT-v1>
              {visitDate}
            </Text>
          </View>
          <View style={tw('ml-24')}>
            <Text text13M textBlack>
              Employee Name
            </Text>
            <Text text13R textBlack marginT-v1>
              {salesRepName}
            </Text>
          </View>
        </View>
        <View marginT-v6>
          <View>
            <Text text13M textBlack>
              Visit Objective
            </Text>
            <Text text13R textBlack marginT-v1>
              {visitObjective}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VisitsNotesModal;
