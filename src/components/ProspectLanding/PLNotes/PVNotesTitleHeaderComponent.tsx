import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {useEffect, useState} from 'react';
import {tw} from 'src/tw';
import {TouchableOpacity} from 'react-native';
import {images} from 'src/assets/Images';
import PVNotesListingHeaderComponent from './PVNotesListingHeaderComponent';
import RenderNotesComponent from '../PLContacts/RenderNotesComponent';
import NoDataComponent from 'src/components/Common/NoDataComponent';

type PVNotesTitleHeaderComponentProps = {
  notes: Array<any>;
  setNoteModalVisible: any;
  setIsNotesEditable?: any;
};

const PVNotesTitleHeaderComponent = (
  props: PVNotesTitleHeaderComponentProps,
) => {
  const {setNoteModalVisible, setIsNotesEditable, notes} = props;
  const [prospectsData, setProspectsData] = useState(notes);
  const MAX_LENGTH = 6;

  useEffect(() => {
    setProspectsData(notes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const onAddNotePress = () => {
    setNoteModalVisible(true);
    setIsNotesEditable(true);
  };

  const prospectRenderItems = () => {
    return prospectsData?.length > 0 ? (
      prospectsData?.map((item: any, index: number) => (
        <RenderNotesComponent
          key={index}
          item={item}
          index={index}
          lastItem={prospectsData?.length - 1 === index}
          setNoteModalVisible={setNoteModalVisible}
          setIsNotesEditable={setIsNotesEditable}
        />
      ))
    ) : (
      <NoDataComponent title="No Data Available" />
    );
  };

  return (
    <View flex padding-v4>
      <View centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          {'Prospection Visit Notes'}
        </Text>
        <TouchableOpacity
          style={tw('py-2 px-5 flex-row items-center')}
          disabled={prospectsData?.length === MAX_LENGTH ? true : false}
          onPress={onAddNotePress}>
          <images.AddNotesIcon />
          <Text text13R marginL-v1 style={tw('text-light-darkBlue')}>
            {'Add Note'}
          </Text>
        </TouchableOpacity>
      </View>
      <View flex marginT-v3 row>
        <View
          flex
          style={tw(
            'rounded-md bg-light-white border-default border-light-lavendar rounded-md',
          )}>
          <PVNotesListingHeaderComponent />
          {prospectRenderItems()}
        </View>
      </View>
    </View>
  );
};

export default PVNotesTitleHeaderComponent;
