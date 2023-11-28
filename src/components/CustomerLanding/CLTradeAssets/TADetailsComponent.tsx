import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import {tw} from 'src/tw';
import {FlatList} from 'react-native';
import RenderTradeAssetsDetails from 'src/components/CustomerLanding/CLTradeAssets/RenderTradeAssetsDetails';
import NoDataComponent from 'src/components/Common/NoDataComponent';

const TADetailsComponent = (props: any) => {
  const {tradeAssetsData} = props;

  return (
    <View
      br40
      margin-v2
      flex
      padding-v4
      style={tw('border-default border-light-lavendar')}>
      <Text text18M textBlack>
        Trade Assets Details
      </Text>
      {tradeAssetsData.length === 0 ? (
        <NoDataComponent />
      ) : (
        <View flex marginT-v1>
          <View row centerV paddingV-v2 paddingH-v3>
            <Text text13M textBlack flex-2 marginR-v3>
              Material #
            </Text>
            <Text text13M textBlack flex-4 marginR-v3>
              Description
            </Text>
            <Text text13M textBlack flex-2 marginR-v3>
              Equipment #
            </Text>
            <Text text13M textBlack flex-2 marginR-v3>
              Installed Date
            </Text>
            <Text text13M textBlack flex-2>
              Status
            </Text>
            <View flex />
          </View>
          <FlatList
            data={tradeAssetsData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => {
              return <RenderTradeAssetsDetails item={item} index={index} />;
            }}
          />
        </View>
      )}
    </View>
  );
};

export default TADetailsComponent;
