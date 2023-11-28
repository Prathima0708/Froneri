import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {images} from 'src/assets/Images';
import React from 'react';
import {FlatList} from 'react-native';
import RenderCLCHCustomerComponent from './RenderCLCHCustomerComponent';

interface CLContactHistoryCustomerComponentProps {
  data: any;
}

const CLContactHistoryCustomerComponent = (
  props: CLContactHistoryCustomerComponentProps,
) => {
  const {data} = props;

  return (
    <View flex>
      <View marginB-v2 flex>
        <View row centerV paddingH-v4 marginB-v2>
          <Text text13M textBlack flex-2 marginR-v5>
            Call Date - Time
          </Text>
          <Text text13M textBlack flex-3 marginR-v5>
            Employee Details
          </Text>
          <Text text13M textBlack flex-2 marginR-v5>
            Contact Type
          </Text>
          <Text text13M textBlack flex-5 marginR-v5>
            Manual Action
          </Text>
          <Text text13M textBlack flex-3 marginR-v5>
            Result
          </Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => (
            <RenderCLCHCustomerComponent data={item} index={index} />
          )}
        />
      </View>
    </View>
  );
};

export default CLContactHistoryCustomerComponent;
