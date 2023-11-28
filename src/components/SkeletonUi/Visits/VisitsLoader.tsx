import React from 'react';
import View from 'src/components/View';
import {tw} from 'src/tw';
import {SafeAreaView} from 'react-native';
import VisitsHeaderSkeleton from './VisitsHeaderSkeleton';
import {SkeletonView} from 'react-native-ui-lib';
import CalendarEventsSkeleton from 'src/components/SkeletonUi/Visits/CalendarEventsSkeleton';

const VisitsLoader = () => {
  return (
    <SafeAreaView style={tw('flex-1 bg-light-lavendar p-3')}>
      <VisitsHeaderSkeleton />
      <View flex bg-white br40 marginH-v1 marginB-v1 padding-v3>
        <View spread row>
          <View row>
            <SkeletonView
              showContent={false}
              times={1}
              height={36}
              width={36}
              style={tw('mr-4')}
              borderRadius={6}
            />
            <SkeletonView
              showContent={false}
              times={1}
              height={36}
              width={51}
              style={tw('mr-4')}
              borderRadius={6}
            />
            <SkeletonView
              showContent={false}
              times={1}
              height={36}
              width={80}
              style={tw('mr-4')}
              borderRadius={6}
            />
          </View>
          <View row>
            <SkeletonView
              showContent={false}
              times={1}
              height={36}
              width={98}
              style={tw('mr-4')}
              borderRadius={6}
            />
            <SkeletonView
              showContent={false}
              times={1}
              height={36}
              width={36}
              style={tw('mr-4')}
              borderRadius={6}
            />
            <SkeletonView
              showContent={false}
              times={1}
              height={36}
              width={36}
              style={tw('mr-4')}
              borderRadius={6}
            />
            <SkeletonView
              showContent={false}
              times={1}
              height={36}
              width={106}
              style={tw('mr-4')}
              borderRadius={6}
            />
            <SkeletonView
              showContent={false}
              times={1}
              height={36}
              width={138}
              borderRadius={6}
            />
          </View>
        </View>
        <View marginT-v4>
          <CalendarEventsSkeleton />
          <CalendarEventsSkeleton />
          <CalendarEventsSkeleton />
        </View>
        <View row padding-v3 br20 bg-white2 marginT-v1>
          <View row>
            <SkeletonView
              showContent={false}
              times={1}
              height={36}
              width={36}
              style={tw('mr-4')}
              borderRadius={6}
            />
            <View spread>
              <SkeletonView
                showContent={false}
                times={1}
                height={13}
                width={99}
                style={tw('mr-4')}
                borderRadius={6}
              />
              <SkeletonView
                showContent={false}
                times={1}
                height={13}
                width={99}
                style={tw('mr-4')}
                borderRadius={6}
              />
            </View>
          </View>
          <SkeletonView
            showContent={false}
            times={1}
            height={13}
            width={99}
            style={tw('mr-4 ml-223px')}
            borderRadius={6}
          />
          <View spread style={tw('ml-223px')}>
            <SkeletonView
              showContent={false}
              times={1}
              height={13}
              width={142}
              style={tw('mr-4')}
              borderRadius={6}
            />
            <SkeletonView
              showContent={false}
              times={1}
              height={13}
              width={86}
              borderRadius={6}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VisitsLoader;
