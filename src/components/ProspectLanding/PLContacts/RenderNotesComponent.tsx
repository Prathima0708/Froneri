import {TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {formatDateReverse} from 'src/utils/CommonUtil';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface RenderCustomerSearchProps {
  item: any;
  index: number;
  lastItem: boolean;
  setNoteModalVisible?: any;
  setIsNotesEditable?: any;
}
const RenderProspectComponent = (props: RenderCustomerSearchProps) => {
  const {item, index, lastItem, setNoteModalVisible, setIsNotesEditable} =
    props;

  const notes = item.internalMessage ? item.internalMessage.trim() : '--';
  const employeeName = item.employeeName ? item.employeeName.trim() : '--';
  const createdOn = item.visitDate
    ? formatDateReverse(new Date(item.visitDate))
    : '--';

  const handleNavigation = () => {
    setNoteModalVisible(true, item);
    setIsNotesEditable(false);
  };

  return (
    <TouchableOpacity onPress={handleNavigation}>
      <View
        paddingH-v4
        row
        centerV
        paddingV-v06
        style={[
          tw(
            `${
              lastItem ? 'rounded-b-md' : ''
            } border-t-default border-light-lavendar`,
          ),
          {backgroundColor: colors[index % colors.length]},
        ]}>
        <View flex-8 marginR-v4>
          <TouchableOpacity onPress={handleNavigation}>
            <Text numberOfLines={1} text13R textBlack>
              {notes}
            </Text>
          </TouchableOpacity>
        </View>
        <View flex-2 marginR-v4>
          <Text numberOfLines={1} text13R textBlack style={tw('pl-12')}>
            {employeeName}
          </Text>
        </View>
        <View flex style={tw('items-end')}>
          <Text numberOfLines={1} text13R textBlack>
            {createdOn}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(RenderProspectComponent);
