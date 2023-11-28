import React, { useState } from 'react';
import { FlatList } from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import RenderFinancialContractsComponent from 'src/components/CustomerLanding/CLConditions/RenderFinancialContractsComponent';

interface FinancialContractsComponentProps {
  financialContractsData: any;
}

const FinancialContractsComponent = (props: FinancialContractsComponentProps) => {
  const { financialContractsData } = props;

  const [expandedItemIndex, setExpandedItemIndex] = useState(0);

  const handleExpandable = (index: number) => {
    if (index === expandedItemIndex) {
      setExpandedItemIndex(-1); // Close the expanded item
    } else {
      setExpandedItemIndex(index); // Expand the item
    }
  };

  return (
    <View
      marginT-v4
      flex
      style={tw(
        'rounded-md bg-light-white border-default border-light-lavendar rounded-md',
      )}>
      <View paddingH-v4 row centerV paddingV-v1>
        <Text text13M textBlack flex-5 marginR-v6>
          Contract No.
        </Text>
        <Text text13M textBlack flex-3 marginR-v6>
          Contract Start
        </Text>
        <Text text13M textBlack flex-3 marginR-v6>
          Contract End
        </Text>
        <Text text13M textBlack flex-13 marginR-v6>
          Condition Description
        </Text>
        <Text text13M textBlack flex-3 marginR-v6>
          Target Value
        </Text>
        <Text text13M textBlack flex-3>
          Condition
        </Text>
      </View>
      <FlatList
        data={financialContractsData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <RenderFinancialContractsComponent
              item={item}
              index={index}
              expandedItemIndex={expandedItemIndex}
              onPressExpand={handleExpandable}
            />
          );
        }}
        style={tw('rounded-b-md')}
        contentContainerStyle={tw(
          'border-r-default border-l-default border-t-default border-light-lavendar rounded-b-md',
        )}
      />
    </View>
  );
};

export default FinancialContractsComponent;
