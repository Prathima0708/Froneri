import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import ExpandableSection from 'src/components/ExpandableSection';
import { TouchableOpacity } from 'react-native';
import { removeLeadingZeroes } from 'src/utils/CommonUtil';

interface SalesDealsConditionsProps {
  item: any;
  index: number;
  expandedItemIndex: number;
  onPressExpand: any;
}

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

const RenderSalesDealsConditionComponent = (
  props: SalesDealsConditionsProps,
) => {
  const { item, index, expandedItemIndex, onPressExpand } = props;
  const isExpanded = index === expandedItemIndex;

  return (
    <View
      style={[
        tw(
          `${isExpanded
            ? 'border-0.5 border-light-grey3'
            : 'border-b-default border-light-lavendar'
          }`,
        ),
        {
          backgroundColor: colors[index % colors.length],
          marginBottom: isExpanded ? 2 : 0,
        },
      ]}>
      <View row centerV spread paddingV-v2 paddingH-v4>
        <Text text13BO textBlack>
          {item.title}
        </Text>
        <View row center>
          <Text text13BO textBlack marginR-v4>
            {item.data.length < 10 ? '0' : ''}
            {item.data.length.toString()}
          </Text>
          <TouchableOpacity onPress={() => onPressExpand(index)}>
            {isExpanded ? <images.UpIcon /> : <images.DownIcon />}
          </TouchableOpacity>
        </View>
      </View>
      <ExpandableSection expanded={isExpanded}>
        <View
          marginH-v4
          paddingV-v3
          style={tw('border-t-default border-light-grey2 border-opacity-25')}>
          <View style={tw('rounded-md border-default border-light-lavendar')}>
            <View
              paddingH-v4
              row
              centerV
              paddingV-v1
              style={tw('bg-light-white rounded-t-md')}>
              <Text text13M textBlack flex-3 marginR-v4>
                Condition Type
              </Text>
              <Text text13M textBlack flex-3 marginR-v4>
                Valid From
              </Text>
              <Text text13M textBlack flex-3 marginR-v4>
                Valid To
              </Text>
              <Text text13M textBlack flex-2 marginR-v4>
                Rebate
              </Text>
              <Text text13M textBlack flex-7 marginR-v4>
                Customer Hierarchy
              </Text>
              <Text text13M textBlack flex-6>
                Material Number/Group/Hierarchy
              </Text>
            </View>
            {item.data.map((data: any, i: number) => {
              const isEnd = i === item.length - 1;
              const materialNumberMaterialGroup1 = data?.materialNumberMaterialGroup1 ? removeLeadingZeroes(data.materialNumberMaterialGroup1) : '--';
              return (
                <View
                  key={i.toString()}
                  paddingH-v4
                  row
                  centerV
                  paddingV-v4
                  style={[
                    tw(
                      `${isEnd ? 'rounded-b-md' : ''
                      }border-b-default border-light-lavendar`,
                    ),
                    {
                      backgroundColor: colors[i % colors.length],
                    },
                  ]}>
                  <Text text13R textBlack flex-3 marginR-v4 numberOfLines={1}>
                    {data.conditionType}
                  </Text>
                  <Text text13R textBlack flex-3 marginR-v4 numberOfLines={1}>
                    {data.formattedValidFrom}
                  </Text>
                  <Text text13R textBlack flex-3 marginR-v4 numberOfLines={1}>
                    {data.formattedValidTo}
                  </Text>
                  <Text text13R textBlack flex-2 marginR-v4 numberOfLines={1}>
                    {data?.rebate && data?.rebate.includes('%') ? data?.rebate : data?.rebate + '%'}
                  </Text>
                  <Text text13R textBlack flex-7 marginR-v4 numberOfLines={1}>
                    {data.customerHierarchyNode}
                  </Text>
                  <Text text13R textBlack flex-6 numberOfLines={1}>
                    {materialNumberMaterialGroup1}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ExpandableSection>
    </View>
  );
};

export default RenderSalesDealsConditionComponent;
