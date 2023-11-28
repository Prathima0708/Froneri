import React, {useEffect, useState} from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import {TouchableOpacity} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {tw} from 'src/tw';
import {images} from 'src/assets/Images';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import RadioButton from 'src/components/RadioButton';

interface MaterialHierarchyProps {
  node: any;
  handleMaterialHierarchyNode: any;
  level: number;
  nodeName: string;
  isExpandAll: boolean;
}

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

const RenderMaterialHierarchy = (props: MaterialHierarchyProps) => {
  const {node, level, handleMaterialHierarchyNode, nodeName, isExpandAll} =
    props;
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (isExpandAll) {
      setIsCollapsed(false);
    } else {
      if (level == 0) {
        setIsCollapsed(false);
      } else {
        setIsCollapsed(true);
      }
    }
  }, []);

  const handlePress = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleRadioButton = (data: string, value: string) => {
    handleMaterialHierarchyNode(data, value);
  };

  const onRadioButtonValueChange = () => {
    handleRadioButton(node.id, node.name);
  };

  return (
    <View>
      <View row centerV marginB-v1>
        <TouchableOpacity onPress={handlePress}>
          {isCollapsed ? <images.ActiveRightIcon /> : <images.DownIcon />}
        </TouchableOpacity>
        <RadioButton
          onValueChange={onRadioButtonValueChange}
          initialValue={nodeName}
          color={
            nodeName === node.id
              ? ColourPalette.light.darkBlue
              : ColourPalette.light.lavendar
          }
          containerStyle={tw('ml-3 mr-4')}
          data={[
            {
              label: '',
              value: node.id,
            },
          ]}
        />
        <Text text13M textBlack>
          {node.name}
        </Text>
      </View>
      <Collapsible
        renderChildrenCollapsed={false}
        collapsed={isCollapsed}
        style={tw('ml-8 rounded-md')}>
        {node.children.map((child: any, index: number, row: any) => {
          let isLast = false;
          if (index + 1 === row.length) {
            isLast = true;
          }

          const onRadioButtonValueChange = () => {
            handleRadioButton(child.id, child.formattedMaterialNumber);
          };

          return child.name ? (
            <RenderMaterialHierarchy
              key={child.id}
              node={child}
              handleMaterialHierarchyNode={handleMaterialHierarchyNode}
              nodeName={nodeName}
              level={level + 1}
              isExpandAll={isExpandAll}
            />
          ) : (
            <View>
              {index === 0 && (
                <View
                  row
                  centerV
                  style={tw(
                    `${
                      index === 0 ? 'rounded-t-md' : ''
                    } py-2 border-t-default border-l-default border-r-default border-light-lavendar`,
                  )}>
                  <View flex-2 marginR-v4></View>
                  <Text text13M textBlack flex-3 marginR-v4 numberOfLines={1}>
                    Material
                  </Text>
                  <Text text13M textBlack flex-20 marginR-v4 numberOfLines={1}>
                    Description
                  </Text>
                  <Text text13M textBlack flex-4 marginR-v4 numberOfLines={1}>
                    Sales Unit
                  </Text>
                </View>
              )}
              <View
                row
                centerV
                key={child.id}
                style={[
                  tw(
                    `${
                      isLast ? 'rounded-b-md border-b-default' : ''
                    } py-2 border-t-default border-l-default border-r-default border-light-lavendar`,
                  ),
                  {backgroundColor: colors[index % colors.length]},
                ]}>
                <View flex-2 marginR-v4 center>
                  <RadioButton
                    onValueChange={onRadioButtonValueChange}
                    initialValue={nodeName}
                    color={
                      nodeName === child.id
                        ? ColourPalette.light.darkBlue
                        : ColourPalette.light.lavendar
                    }
                    containerStyle={tw('ml-3 mr-4')}
                    data={[
                      {
                        label: '',
                        value: child.id,
                      },
                    ]}
                  />
                </View>
                <Text text13R textBlack flex-3 marginR-v4 numberOfLines={1}>
                  {child.formattedMaterialNumber}
                </Text>
                <Text text13R textBlack flex-20 marginR-v4 numberOfLines={1}>
                  {child.materialDescription}
                </Text>
                <Text text13R textBlack flex-4 marginR-v4 numberOfLines={1}>
                  {child.mainSalesUnit}
                </Text>
              </View>
            </View>
          );
        })}
      </Collapsible>
    </View>
  );
};

export default RenderMaterialHierarchy;
