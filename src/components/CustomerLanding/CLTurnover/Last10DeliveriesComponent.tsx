import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { useEffect, useState } from 'react';
import { tw } from 'src/tw';
import { images } from 'src/assets/Images';
import Dropdown from 'src/components/DropDown';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { Dimensions, FlatList, ScrollView } from 'react-native';
import RenderLast10DeliveriesComponent from 'src/components/CustomerLanding/CLTurnover/RenderLast10DeliveriesComponent';
import NoDataComponent from 'src/components/Common/NoDataComponent';

interface Last10DeliveriesProps {
  dropDownData: Array<any>;
  last10DeliveriesDataHeader: Array<any>;
  last10DeliveriesData: Array<any>;
}

const width = Dimensions.get('window').width;

const Last10DeliveriesComponent = (props: Last10DeliveriesProps) => {
  const { dropDownData, last10DeliveriesDataHeader, last10DeliveriesData } =
    props;
  const [turnoverDetailsDropdown, setTurnoverDetailsDropdown] = useState();
  const [last10Deliveries, setLast10Deliveries] = useState<Array<any>>([]);

  useEffect(() => {
    if (dropDownData.length > 0) {
      setTurnoverDetailsDropdown(dropDownData[0].descriptionLanguage);
    }
  }, [dropDownData]);

  useEffect(() => {
    filterAndSetTurnoverDetailsData();
  }, [last10DeliveriesData, turnoverDetailsDropdown]);

  const filterAndSetTurnoverDetailsData = () => {
    if (last10DeliveriesData.length > 0) {
      let filteredTurnoverData: any = [];

      if (turnoverDetailsDropdown !== dropDownData[0].descriptionLanguage) {
        filteredTurnoverData = last10DeliveriesData.filter(
          (item: any) => item.turnoverGroup === turnoverDetailsDropdown,
        );
      } else {
        // If the dropdown value is 'All' then show all the data
        filteredTurnoverData = last10DeliveriesData;
      }

      setLast10Deliveries(filteredTurnoverData);
    }
  };

  const handleTurnoverDetailsDropdown = (data: any) => {
    setTurnoverDetailsDropdown(data.descriptionLanguage);
  };

  const renderTurnoverDetailsDropDown = (item: any) => {
    const descriptionLanguage = item.descriptionLanguage
      ? item.descriptionLanguage
      : '';
    return (
      <View row centerV padding-v2>
        <Text style={tw(`text-light-textBlack text-13px font-normal`)}>
          {descriptionLanguage}
        </Text>
      </View>
    );
  };

  return (
    <View flex>
      {last10DeliveriesData.length != 0 && (
        <View marginT-v3>
          <Dropdown
            extraStyle={'w-170px'}
            labelField="descriptionLanguage"
            valueField="descriptionLanguage"
            renderItem={renderTurnoverDetailsDropDown}
            data={dropDownData}
            value={turnoverDetailsDropdown}
            onChange={handleTurnoverDetailsDropdown}
          />
        </View>
      )}
      {last10Deliveries.length === 0 ? (
        <NoDataComponent
          title={
            last10DeliveriesData.length > 0
              ? 'No data for the selected filters'
              : 'No data for Last 10 Deliveries'
          }
          subTitle={
            last10DeliveriesData.length > 0 ? 'Change the filters for data' : ''
          }
        />
      ) : (
        <ScrollView
          horizontal={true}
          style={tw('flex-1')}
          showsHorizontalScrollIndicator={true}
          showsVerticalScrollIndicator={true}>
          <View
            flex
            marginT-v4
            br20
            style={tw('border-default border-light-lavendar')}>
            <View
              paddingH-v4
              paddingV-v07
              row
              centerV
              style={tw(`border-b-default border-light-lavendar`)}>
              <Text
                text13M
                textBlack
                marginR-v5
                marginV-v1
                style={{ width: (width / 100) * 9 }}>
                Description{'\n'}Language
              </Text>
              <Text
                text13M
                textBlack
                marginR-v5
                marginV-v1
                style={{ width: (width / 100) * 25 }}>
                Material{'\n'}Description
              </Text>
              <Text
                text13M
                textBlack
                marginR-v5
                marginV-v1
                style={{ width: (width / 100) * 7 }}>
                Material{'\n'}Number
              </Text>
              <Text
                text13M
                textBlack
                marginR-v5
                marginV-v1
                style={[tw('text-right'), { width: (width / 100) * 7 }]}>
                Total LY
              </Text>
              <Text
                text13M
                textBlack
                marginR-v5
                marginV-v1
                style={[tw('text-right'), { width: (width / 100) * 7 }]}>
                YTD LY
              </Text>
              <Text
                text13M
                textBlack
                marginV-v1
                marginR-v5
                style={[tw('text-right'), { width: (width / 100) * 7 }]}>
                YTD CY
              </Text>
              <Text
                text13M
                textBlack
                marginV-v1
                style={[tw('text-right'), { width: (width / 100) * 7 }]}>
                Growth
              </Text>
              {last10DeliveriesDataHeader.map((header, index) => {
                const originOrder = header.originOrder
                  ? header.originOrder
                  : '';
                return (
                  <Text
                    key={header.id}
                    text13M
                    textBlack
                    marginL-v5
                    marginV-v1
                    style={[tw('text-right'), { width: (width / 100) * 7 }]}>
                    {originOrder}
                    {originOrder == '' ? '' : '\n'}
                    {header.formattedDate}
                  </Text>
                );
              })}
            </View>
            <FlatList
              data={last10Deliveries}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item, index }) => {
                return (
                  <RenderLast10DeliveriesComponent
                    item={item}
                    index={index}
                    last10DeliveriesDataHeader={last10DeliveriesDataHeader}
                  />
                );
              }}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default Last10DeliveriesComponent;
