import View from 'src/components/View';
import {tw} from 'src/tw';
import React, {useState} from 'react';
import Dropdown from 'src/components/DropDown';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {images} from 'src/assets/Images';
import Text from 'src/components/Text';
import {NOTES_DROPDOWN} from 'src/utils/DropdownConst';

interface NotesTopTabComponentProps {
  notesType: string;
  handleNotesFilter: any;
}

const NotesDropDownComponent = (props: NotesTopTabComponentProps) => {
  const {notesType, handleNotesFilter} = props;

  const renderItem = (item: any) => {
    return (
      <View row centerV padding-v2>
        <Text
          style={tw(
            `${
              item.value === notesType
                ? 'text-light-darkBlue'
                : 'text-light-textBlack'
            } text-13px font-normal`,
          )}>
          {item.label}
        </Text>
      </View>
    );
  };

  const handleNotes = (item: any) => {
    handleNotesFilter(item);
  };

  return (
    <View>
      <Dropdown
        extraStyle={'ml-6 w-140px'}
        labelField="label"
        valueField="value"
        renderItem={renderItem}
        data={NOTES_DROPDOWN}
        value={notesType}
        onChange={handleNotes}
      />
    </View>
  );
};

export default NotesDropDownComponent;
