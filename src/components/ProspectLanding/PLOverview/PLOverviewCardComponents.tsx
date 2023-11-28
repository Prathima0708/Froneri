import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import Card from 'src/components/Card';
import { tw } from 'src/tw';
import CopyTextComponent from 'src/components/Common/CopyTextComponent';

interface PLOverviewCardProps {
  header: string;
  title1: string;
  data1: string;
  title2: string;
  data2: string;
  title3: string;
  data3: string;
  title4?: string;
  data4?: string;
  marginNotNeeded?: boolean;
  isData1Copyable?: boolean;
  isData2Copyable?: boolean;
  isData3Copyable?: boolean;
  isData4Copyable?: boolean;
}
const PLOverviewCardComponents = (props: PLOverviewCardProps) => {
  const { header, title1, title2, title3, title4, data1, data2, data3, data4, marginNotNeeded = false, isData1Copyable = false, isData2Copyable = false, isData3Copyable = false, isData4Copyable = false } =
    props;
  return (
    <Card
      padding-v4
      cardStyle={tw(
        `${header === 'Prospect Information' || header === 'Employee Details'
          ? ''
          : marginNotNeeded ? '' : 'mt-3'
        }`,
      )}>
      <Text text18M textBlack>
        {header}
      </Text>
      <View row marginT-v2>
        <View flex marginR-v3>
          <Text text13M textBlack numberOfLines={1}>
            {title1}
          </Text>
          {isData1Copyable ?
            <CopyTextComponent
              text13R
              textBlack
              marginT-v1
              style={{ maxWidth: 155 }}
              numberOfLines={header === 'Prospect Information' ? 2 : 1}
              text={data1}
            />
            :
            <Text
              text13R
              textBlack
              marginT-v1
              numberOfLines={header === 'Prospect Information' ? 2 : 1}>
              {data1}
            </Text>}
        </View>
        <View flex marginR-v3>
          <Text text13M textBlack numberOfLines={1}>
            {title2}
          </Text>
          {isData2Copyable ?
            <CopyTextComponent
              text13R textBlack marginT-v1 numberOfLines={1}
              viewStyle={{ 'centerV': true }}
              text={data2}
            />
            :
            <Text text13R textBlack marginT-v1 numberOfLines={1}>
              {data2}
            </Text>}
        </View>
        <View flex>
          <Text text13M textBlack numberOfLines={1}>
            {title3}
          </Text>
          {isData3Copyable ?
            <CopyTextComponent
              text13R
              textBlack marginT-v1 numberOfLines={0}
              style={{ maxWidth: 150 }}
              text={data3}
            />
            :
            <Text text13R textBlack marginT-v1 numberOfLines={1}>
              {data3}
            </Text>}
        </View>
      </View>
      {title4 && (
        <View row marginT-v3>
          <View flex marginR-v3>
            <Text text13M textBlack numberOfLines={1}>
              {title4}
            </Text>
            {isData4Copyable ?
              <CopyTextComponent
                text13R
                textBlack marginT-v1 numberOfLines={0}
                style={{ maxWidth: 150 }}
                text={data4}
              />
              :
              <Text text13R textBlack marginT-v1 numberOfLines={1}>
                {data4}
              </Text>}
          </View>
        </View>
      )}
    </Card>
  );
};

export default PLOverviewCardComponents;
