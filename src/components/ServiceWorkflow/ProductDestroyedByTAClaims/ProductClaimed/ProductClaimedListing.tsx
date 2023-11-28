import View from 'src/components/View';
import React, {useState} from 'react';
import Text from 'src/components/Text';
import {tw} from 'src/tw';
import {FlashList} from '@shopify/flash-list';
import {images} from 'src/assets/Images';
import SWTraceGridBasicInfoComponent from './ProductClaimedListingComponent';
import {IS_SWTRACR_GRID_BASIC_DATA} from 'src/utils/Constant';
import {Pressable} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

interface ProductClaimedListingProps {
  tradeAssetList: any;

  onItemSelected: (index: number) => void;
}

const ProductClaimedListing = (props: ProductClaimedListingProps) => {
  const {tradeAssetList} = props;
  console.log(tradeAssetList, 'tradeAssetList');

  return (
    <View marginT-v5>
      <Text text18M textBlack>
        Trade Assets
      </Text>
      {tradeAssetList.length > 0 && (
        <View
          flex
          marginT-v3
          style={tw(
            `rounded-md bg-light-white border-default border-light-lavendar rounded-md`,
          )}>
          <View paddingH-v4 row centerV marginV-v06>
            <View width={'10%'} marginR-v4>
              <Text text13M textBlack>
                Selection
              </Text>
            </View>
            <View width={'15%'} marginR-v4>
              <Text text13M textBlack>
                Material #
              </Text>
            </View>
            <View width={'35%'} marginR-v4>
              <Text text13M textBlack>
                Material Description
              </Text>
            </View>
            <View width={'20%'} marginR-v4>
              <Text text13M textBlack>
                Equiment#
              </Text>
            </View>
            <View width={'20%'} marginR-v4>
              <Text text13M textBlack>
                Installed Date
              </Text>
            </View>
          </View>

          <FlashList
            data={tradeAssetList}
            keyExtractor={(_: any, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <SWTraceGridBasicInfoComponent
                  item={item}
                  index={index}
                  lastItem={tradeAssetList.length - 1 === index}
                  onItemSelected={props.onItemSelected && props.onItemSelected}
                />
              );
            }}
            estimatedItemSize={59}
          />
        </View>
      )}
    </View>
  );
};

export default ProductClaimedListing;
