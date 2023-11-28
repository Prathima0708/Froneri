import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {tw} from 'src/tw';

const TodaysTaskExpandableComponenet = (props: any) => {
  const {item} = props;
  return (
    <View
      marginL-v8
      marginR-v2
      padding-v3
      style={tw('border-t-default border-light-grey2')}>
      <View row>
        <View marginR-v6 flex-3>
          <Text text13M textBlack>
            Name 2
          </Text>
          <Text grey2 text13R style={tw('mt-6px')} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View marginR-v6 flex-3>
          <Text text13M textBlack>
            Name 3
          </Text>
          <Text grey2 text13R style={tw('mt-6px')} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View row flex-4>
          <View marginR-v6 flex>
            <Text text13M textBlack>
              Type
            </Text>
            <Text grey2 text13R style={tw('mt-6px')} numberOfLines={2}>
              {item.status}
            </Text>
          </View>
          <View flex-2 marginR-v6>
            <Text text13M textBlack>
              Executed By
            </Text>
            <Text grey2 text13R style={tw('mt-6px')} numberOfLines={2}>
              Ranganath Mukkunda
            </Text>
          </View>
          <View flex>
            <Text text13M textBlack>
              Executed Date
            </Text>
            <Text grey2 text13R style={tw('mt-6px')} numberOfLines={2}>
              {item.creationDate}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TodaysTaskExpandableComponenet;
