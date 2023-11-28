import View from 'src/components/View';
import Text from 'src/components/Text';
import Card from 'src/components/Card';
import React, {useState} from 'react';
import {images} from 'src/assets/Images';
import {FlatList, TouchableOpacity} from 'react-native';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import NotesDropDownComponent from './NotesDropDownComponent';
import {tw} from 'src/tw';
import {getOnlyDate} from 'src/utils/CommonUtil';
import {NOTES_TYPES} from 'src/utils/Constant';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface NotesComponentProps {
  onPressAddNote: any;
  onPressNotes: any;
  customerNotes: any;
}

const NotesComponent = (props: NotesComponentProps) => {
  const {customerNotes, onPressAddNote, onPressNotes} = props;
  const [notesType, setNotesType] = useState('1');
  const handleNotesFilter = (item: any) => {
    setNotesType(item.value);
  };

  let notes = [];
  if (notesType === '2') {
    notes = customerNotes.filter((note: any) => note.type == '1');
  } else if (notesType === '3') {
    notes = customerNotes.filter((note: any) => note.type == '2');
  } else {
    notes = customerNotes;
  }

  const renderNotes = ({item, index}: any) => {
    const note = item.internalMessages ? item.internalMessages : '';
    const name = item.employeeName ? item.employeeName : '';

    let creationDate = item.creationDate ? item.creationDate : '';
    if (creationDate != '') {
      creationDate = getOnlyDate(creationDate);
    }

    let validToDate = item.validToDate ? item.validToDate : '';
    if (validToDate.length > 0) {
      validToDate = getOnlyDate(validToDate);
    }

    const handleNotePressed = (item: any) => {
      onPressNotes(item);
    };

    return (
      <TouchableOpacity onPress={() => handleNotePressed(item)}>
        <View
          row
          centerV
          paddingH-v4
          paddingV-v1
          style={{backgroundColor: colors[index % colors.length]}}>
          <Text flex-7 text13R textBlack numberOfLines={1}>
            {note}
          </Text>
          <Text flex-2 text13R textBlack numberOfLines={1} marginL-v3>
            {name}
          </Text>
          <Text flex-1 text13R textBlack numberOfLines={1} marginL-v3>
            {creationDate}
          </Text>
          <Text flex-1 text13R textBlack numberOfLines={1} marginL-v3>
            {validToDate}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View flex-11>
      <Card flex-1 padding-v3>
        <View>
          <View row centerV spread>
            <View row centerV>
              <Text text18M textBlack>
                Notes
              </Text>
              <NotesDropDownComponent
                notesType={notesType}
                handleNotesFilter={handleNotesFilter}
              />
            </View>
            <TouchableOpacity
              onPress={onPressAddNote}
              style={tw('flex-row items-center')}>
              <images.PlusIconWithBorder />
              <Text darkBlue margin-v1>
                Add Note
              </Text>
            </TouchableOpacity>
          </View>
          <View marginT-v2>
            <View row centerV paddingH-v4 paddingV-v1>
              <Text flex-7 text13M textBlack>
                Note
              </Text>
              <Text flex-2 text13M textBlack marginL-v3>
                Employee Name
              </Text>
              <Text flex-1 text13M textBlack marginL-v3>
                Created On
              </Text>
              <Text flex-1 text13M textBlack marginL-v3>
                Valid Till
              </Text>
            </View>
            <View>
              {notes.length === 0 ? (
                <View centerH marginT-v9>
                  <Text text12R grey1>
                    {'No Data Found'}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={notes}
                  keyExtractor={(item, i) => i.toString()}
                  renderItem={renderNotes}
                />
              )}
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default NotesComponent;
