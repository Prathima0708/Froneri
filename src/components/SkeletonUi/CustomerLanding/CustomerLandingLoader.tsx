import React from 'react';
import View from 'src/components/View';
import Card from 'src/components/Card';
import CustomerLandingContentLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingContentLoader';

const CustomerLandingLoader = () => {
  return (
    <View flex marginB-v2 marginR-v2>
      <View flex row marginB-v2>
        <Card flex-1 marginR-v2 padding-v4>
          <CustomerLandingContentLoader />
        </Card>
        <Card flex-1 padding-v4>
          <CustomerLandingContentLoader />
        </Card>
      </View>
      <View flex row>
        <Card flex-1 marginR-v2 padding-v4>
          <CustomerLandingContentLoader />
        </Card>
        <Card flex-1 padding-v4>
          <CustomerLandingContentLoader />
        </Card>
      </View>
    </View>
  );
};

export default CustomerLandingLoader;
