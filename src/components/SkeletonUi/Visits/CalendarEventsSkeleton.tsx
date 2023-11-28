import React from 'react';
import {SkeletonView} from 'react-native-ui-lib';
import {tw} from 'src/tw';
import View from 'src/components/View';

const CalendarEventsSkeleton = () => {
  return (
    <View>
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
        <View spread>
          <SkeletonView
            showContent={false}
            times={1}
            height={13}
            width={99}
            style={tw('mr-4 ml-223px')}
            borderRadius={6}
          />
          <SkeletonView
            showContent={false}
            times={1}
            height={13}
            width={130}
            style={tw('mr-4 ml-223px')}
            borderRadius={6}
          />
        </View>
        <View spread style={tw('ml-195px')}>
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
  );
};

export default CalendarEventsSkeleton;
