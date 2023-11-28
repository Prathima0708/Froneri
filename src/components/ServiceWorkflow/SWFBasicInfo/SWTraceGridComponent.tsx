import View from 'src/components/View';
import React, { useState } from 'react';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { FlashList } from '@shopify/flash-list';
import { images } from 'src/assets/Images';
import SWTraceGridBasicInfoComponent from './SWTraceGridBasicInfoComponent';
import { IS_SWTRACR_GRID_BASIC_DATA } from 'src/utils/Constant';
import { Pressable } from 'react-native';

interface TraceGridComponentProps {
  traceGridData: any;
  editMode: boolean;
  onDeletePress: any;
}

const SWTraceGridComponent = (props: TraceGridComponentProps) => {
  const { traceGridData, editMode, onDeletePress } = props;
  const [isSWTraceGridBasic, setISSWTraceGridBasic] = useState<any>(
    IS_SWTRACR_GRID_BASIC_DATA,
  );
  return (
    <View marginT-v5>
      <Text text18M textBlack>
        Trace Grid
      </Text>
      <View
        flex
        marginT-v3
        style={tw(
          `rounded-md bg-light-white border-default border-light-lavendar rounded-md`,
        )}>
        <View paddingH-v4 row centerV marginV-v06>
          <View width={'40%'} marginR-v4>
            <Text text13M textBlack>
              Creator
            </Text>
          </View>
          <View width={'40%'} marginR-v4>
            <Text text13M textBlack>
              Action
            </Text>
          </View>
          <View width={'20%'} marginR-v4>
            <Text text13M textBlack>
              Date and Time
            </Text>
          </View>
        </View>
        <View height={'100%'}>
          <FlashList
            data={traceGridData}
            keyExtractor={(_: any, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <SWTraceGridBasicInfoComponent
                  item={item}
                  index={index}
                  lastItem={traceGridData.length - 1 === index}
                />
              );
            }}
            estimatedItemSize={59}
          />
        </View>
      </View>
      {!editMode ? (
        <View
          marginT-v4
          marginB-v1
          width={36}
          height={36}
          center
          style={tw('border-0.5 border-light-lavendar rounded-md ')}>
          <Pressable onPress={onDeletePress}>
            <images.DeleteIcon />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default SWTraceGridComponent;
