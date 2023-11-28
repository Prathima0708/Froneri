import React from 'react';
import View from 'src/components/View';
import Card from 'src/components/Card';
import CustomerLandingContentLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingContentLoader';
import LeftMenuLoader from './LeftMenuLoader';
import CustomerLandingHeaderLoader from './CustomerLandingHeaderLoader';

const OverviewLoader = () => {
  return (
    <View flex margin-v2>
      <CustomerLandingHeaderLoader />
      <View row flex>
        <View>
          <LeftMenuLoader />
        </View>
        <View flex marginB-v2>
          <Card flex-1 marginR-v2 padding-v4 marginB-v2>
            <CustomerLandingContentLoader />
          </Card>
          <Card flex-1 padding-v4 marginR-v2>
            <CustomerLandingContentLoader />
          </Card>
        </View>
        <View flex marginB-v2>
          <Card flex-1 marginR-v2 padding-v4 marginB-v2>
            <CustomerLandingContentLoader />
          </Card>
          <Card flex-1 padding-v4 marginR-v2>
            <CustomerLandingContentLoader />
          </Card>
        </View>
      </View>
    </View>
  );
};

export default OverviewLoader;
