import React from 'react';
import { FlashList } from '@shopify/flash-list';

import View from 'src/components/View';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import TAListingHeaderComponent from './TAListingHeaderComponent';
import RenderTAComponent from './RenderTAComponent';

import { tw } from 'src/tw';

type TATitleHeaderComponentProps = {
  tabTitle?: string;
  taListingData: any;
};

const TATitleHeaderComponent = (props: TATitleHeaderComponentProps) => {
  const { tabTitle, taListingData } = props;

  return (
    <View flex marginT-v4>
      {taListingData.length > 0 && <TAListingHeaderComponent />}
      <View flex centerV style={tw('border-light-grey1')}>
        {taListingData.length > 0 ? <FlashList
          data={taListingData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <RenderTAComponent
                item={item}
                index={index}
                lastItem={taListingData.length - 1 === index}
              />
            );
          }}
          estimatedItemSize={59}
        /> :
          <View flex>
            <NoDataComponent title={`No ${tabTitle} Agreement`} subTitle='Please Create Agreement' />
          </View>
        }
      </View>
    </View>
  );
};

export default TATitleHeaderComponent;
