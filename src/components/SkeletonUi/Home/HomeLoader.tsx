import {StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {SkeletonView} from 'react-native-ui-lib';
import View from 'src/components/View';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import HeaderSkeleton from 'src/components/SkeletonUi/HeaderSkeleton';
import RenderCardLoader from './RenderCardLoader';

let boxes = [1, 2, 3, 4];

const titleWidth = (Dimensions.get('window').width / 100) * 8.1;
const titleHeight = (Dimensions.get('window').height / 100) * 3.1;
const contentWidth = (Dimensions.get('window').width / 100) * 69;
const contentHeight = (Dimensions.get('window').height / 100) * 9;

const HomeLoader = () => {
  return (
    <View
      flex
      padding-v3
      style={{backgroundColor: ColourPalette.light.lavendar}}>
      <HeaderSkeleton />
      <View row flex spread style={tw(`flex-1 flex-row justify-between`)}>
        <View flex-3 bg-white marginR-v2 br40 padding-v4>
          <SkeletonView height={titleHeight} width={titleWidth} />
          <View
            paddingV-v4
            row
            style={tw('border-b-default border-light-lightGrey')}>
            <SkeletonView
              height={1}
              width={titleWidth}
              style={[
                tw('border-2 border-light-lightGrey absolute'),
                {bottom: -3},
              ]}
            />
            <SkeletonView height={titleHeight} width={titleWidth} />
            <SkeletonView
              height={titleHeight}
              width={titleWidth}
              style={tw('ml-10')}
            />
            <SkeletonView
              height={titleHeight}
              width={titleWidth}
              style={tw('ml-10')}
            />
            <SkeletonView
              height={titleHeight}
              width={titleWidth}
              style={tw('ml-10')}
            />
          </View>
          <View marginT-v4>
            <SkeletonView
              height={contentHeight}
              width={contentWidth}
              times={7}
              style={tw('mt-1')}
              borderRadius={12}
            />
          </View>
        </View>
        <View flex>
          <View flex-4 marginB-v2>
            <RenderCardLoader content2={true} content3={false} />
          </View>
          <View flex-4 marginB-v2>
            <RenderCardLoader content2={true} content3={false} />
          </View>
          <View flex-5 marginB-v2>
            <RenderCardLoader content2={true} content3={true} />
          </View>
          <View flex-3 marginB-v2>
            <RenderCardLoader content2={false} content3={false} />
          </View>
          <View flex-3 marginB>
            <RenderCardLoader content2={false} content3={false} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeLoader;

const styles = StyleSheet.create({});
