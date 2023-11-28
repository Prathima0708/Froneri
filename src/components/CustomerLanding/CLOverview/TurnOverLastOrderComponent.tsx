import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import React, { useState } from 'react';
import Card from 'src/components/Card';
import { TouchableOpacity } from 'react-native';

interface TurnOverLastOrderComponentProps {
  mainTitle: string;
  title1: string;
  title2: string;
  title3: string;
  title4: string;
  title4AdditionalText?: string;
  value1: string;
  value2: string;
  value3: string;
  value4: string;
  onRightIconPress: any;
}

const TurnOverLastOrderComponent = (props: TurnOverLastOrderComponentProps) => {
  const { mainTitle, title1, title2, title3, title4, title4AdditionalText = '', onRightIconPress } = props;
  let isEmpty = false;

  if (
    (!props?.value1 && !props?.value2 && !props?.value3 && !props?.value4) ||
    (props?.value1 === '0' &&
      props?.value2 === '0' &&
      props?.value3 === '0' &&
      props?.value4 === '0')
  ) {
    isEmpty = true;
  }
  const value1 = props?.value1 ? props?.value1 : '--';
  const value2 = props?.value2 ? props?.value2 : '--';
  const value3 = props?.value3 ? props?.value3 : '--';
  const value4 = props?.value4 ? props?.value4 : '--';

  return (
    <Card marginR-v2 marginB-v2 paddingH-v4 paddingV-v3>
      <View centerV>
        <View row spread centerV>
          <Text text18M textBlack>
            {mainTitle}
          </Text>
          <TouchableOpacity onPress={onRightIconPress}>
            <images.DefaultRightArrowIcon />
          </TouchableOpacity>
        </View>
        {!isEmpty ? (
          <View row marginT-v1>
            <View flex>
              <Text text13M textBlack>
                {title1}
              </Text>
              <Text marginT-v1 text13R textBlack numberOfLines={1}>
                {value1}
              </Text>
            </View>
            <View flex>
              <Text text13M textBlack>
                {title2}
              </Text>
              <Text marginT-v1 text13R textBlack numberOfLines={1}>
                {value2}
              </Text>
            </View>
            <View flex>
              <Text text13M textBlack>
                {title3}
              </Text>
              <Text marginT-v1 text13R textBlack numberOfLines={1}>
                {value3}
              </Text>
            </View>
            <View flex>
              <View row>
                <Text text13M textBlack>
                  {title4}
                </Text>
                <Text text13M textBlack>
                  {title4AdditionalText}
                </Text>
              </View>
              <Text marginT-v1 text13R textBlack numberOfLines={1}>
                {value4}
              </Text>
            </View>
          </View>
        ) : (
          <View row marginT-v1>
            <Text text13M textBlack>
              No data
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};

export default TurnOverLastOrderComponent;
