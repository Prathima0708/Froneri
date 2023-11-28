import {StyleSheet, Dimensions} from 'react-native';
import View from 'src/components/View';
import React from 'react';
import {SkeletonView} from 'react-native-ui-lib';
import {tw} from 'src/tw';

const titleWidth = (Dimensions.get('window').width / 100) * 10.9;
const titleHeight = (Dimensions.get('window').height / 100) * 3;
const iconWidth = (Dimensions.get('window').width / 100) * 2.5;
const iconHeight = (Dimensions.get('window').height / 100) * 4;
const subTitleWidth = (Dimensions.get('window').width / 100) * 7.9;
const subTitleHeight = (Dimensions.get('window').height / 100) * 1.5;
const valueWidth = (Dimensions.get('window').width / 100) * 1.5;
const valueHeight = (Dimensions.get('window').height / 100) * 1.5;

interface RenderCardLoaderProps {
  content2: boolean;
  content3: boolean;
}

const RenderCardLoader = (props: RenderCardLoaderProps) => {
  const {content2, content3} = props;
  return (
    <View flex bg-white br40 padding-v4 spread>
      <View row spread>
        <SkeletonView
          showContent={false}
          height={titleHeight}
          width={titleWidth}
        />
        <SkeletonView
          showContent={false}
          height={iconHeight}
          width={iconWidth}
          borderRadius={6}
        />
      </View>
      <View row>
        <SkeletonView
          showContent={false}
          height={subTitleHeight}
          width={subTitleWidth}
        />
        <SkeletonView
          showContent={false}
          height={valueHeight}
          width={valueWidth}
          style={tw('ml-20')}
        />
      </View>
      {content2 && (
        <View row>
          <SkeletonView
            showContent={false}
            height={subTitleHeight}
            width={subTitleWidth}
          />
          <SkeletonView
            showContent={false}
            height={valueHeight}
            width={valueWidth}
            style={tw('ml-20')}
          />
        </View>
      )}
      {content3 && (
        <View row>
          <SkeletonView
            showContent={false}
            height={subTitleHeight}
            width={subTitleWidth}
          />
          <SkeletonView
            showContent={false}
            height={valueHeight}
            width={valueWidth}
            style={tw('ml-20')}
          />
        </View>
      )}
    </View>
  );
};

export default RenderCardLoader;

const styles = StyleSheet.create({});
