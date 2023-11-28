import View from 'src/components/View';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import RenderSalesDealsConditionComponent from 'src/components/CustomerLanding/CLConditions/RenderSalesDealsConditionComponent';
import { tw } from 'src/tw';

interface SalesDealsConditionsComponentProps {
  salesDealsConditionData: any;
}

const SalesDealsConditionsComponent = (props: SalesDealsConditionsComponentProps) => {
  const { salesDealsConditionData } = props;

  const [expandedItemIndex, setExpandedItemIndex] = useState(0);

  const handleExpandable = (index: number) => {
    if (index === expandedItemIndex) {
      setExpandedItemIndex(-1); // Close the expanded item
    } else {
      setExpandedItemIndex(index); // Expand the item
    }
  };

  return (
    <View marginT-v4>
      <FlatList
        data={salesDealsConditionData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <RenderSalesDealsConditionComponent
              item={item}
              index={index}
              expandedItemIndex={expandedItemIndex}
              onPressExpand={handleExpandable}
            />
          );
        }}
        contentContainerStyle={tw(
          'border-r-default border-l-default border-t-default border-light-lavendar',
        )}
      />
    </View>
  );
};

export default SalesDealsConditionsComponent;
