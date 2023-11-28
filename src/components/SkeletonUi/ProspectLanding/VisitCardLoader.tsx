import React from 'react';
import View from 'src/components/View';
import Card from 'src/components/Card';
import CustomerLandingContentLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingContentLoader';

const VisitCardLoader = () => {
    return (
        <View flex marginB-v2>
            <Card flex-1 padding-v4>
                <CustomerLandingContentLoader />
            </Card>
        </View>
    );
};

export default VisitCardLoader;
