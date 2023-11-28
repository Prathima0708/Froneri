import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import Dropdown from 'src/components/DropDown';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import RadioButton from 'src/components/RadioButton';
import {
  TURNOVER_GROUP_TYPES,
  TURNOVER_RADIO_BUTTON_TYPES,
} from 'src/utils/Constant';
import RenderTurnoverDetailsComponent from 'src/components/CustomerLanding/CLTurnover/RenderTurnoverDetailsComponent';
import { getLocaleNumberFormatter } from 'src/utils/CommonUtil';
import NoDataComponent from 'src/components/Common/NoDataComponent';

interface TurnoverDetailsProps {
  dropDownData: Array<any>;
  turnoverData: Array<any>;
  turnoverSummaryData: Array<any>;
}

const TurnoverDetailsComponent = (props: TurnoverDetailsProps) => {
  const { dropDownData, turnoverData, turnoverSummaryData } = props;
  const [turnoverDetailsDropdown, setTurnoverDetailsDropdown] = useState('');
  const [turnoverDetailsType, setTurnoverDetailsType] = useState('0');

  const [turnoverDetailsData, setTurnoverDetailsData] = useState<Array<any>>(
    [],
  );

  const [totalData, setTotalData] = useState({
    totalLY: '0',
    ytdLY: '0',
    ytdCY: '0',
    growthCHF: '0',
    growthPercentage: '0',
  });
  const [turnoverSummary, setTurnoverSummary] = useState({
    turnoverInvoices: '0',
    turnoverPortfolio: '0',
    deviationCA: '0',
    volumeDifference: '0',
  });

  useEffect(() => {
    if (turnoverSummaryData.length > 0) {
      setTurnoverSummary(turnoverSummaryData[0]);
    }
  }, [turnoverSummaryData]);

  useEffect(() => {
    if (dropDownData.length > 0) {
      setTurnoverDetailsDropdown(dropDownData[0].idTurnoverGroup);
    }
  }, [dropDownData]);

  useEffect(() => {
    filterAndSetTurnoverDetailsData();
  }, [turnoverData, turnoverDetailsType, turnoverDetailsDropdown]);

  const filterAndSetTurnoverDetailsData = () => {
    if (turnoverData.length > 0) {
      let filteredTurnoverData: any;

      // ** Filtering based on radio button
      // Filtering total data
      if (turnoverDetailsType === '0') {
        filteredTurnoverData = turnoverData.filter(
          (item: any) => item.typeTurnover === TURNOVER_GROUP_TYPES.TOTAL,
        );
      }
      // Filtering direct data
      else if (turnoverDetailsType === '1') {
        filteredTurnoverData = turnoverData.filter(
          (item: any) => item.typeTurnover === TURNOVER_GROUP_TYPES.DIRECT,
        );
      }
      // Filtering indirect data
      else {
        filteredTurnoverData = turnoverData.filter(
          (item: any) => item.typeTurnover === TURNOVER_GROUP_TYPES.INDIRECT,
        );
      }

      // ** Filtering based on dropdown
      // if dropdown value is not 0 then filtering the data
      if (turnoverDetailsDropdown) {
        filteredTurnoverData = filteredTurnoverData.filter(
          (item: any) => item.iDTurnoverGroup === turnoverDetailsDropdown,
        );
      }

      // ** Calculating total data
      const result = filteredTurnoverData.reduce((acc: any, item: any, index: number) => {
        acc.totalLY = acc.totalLY
          ? parseFloat(acc.totalLY) + parseFloat(item.totalLY)
          : parseFloat(item.totalLY);
        acc.ytdLY = acc.ytdLY
          ? parseFloat(acc.ytdLY) + parseFloat(item.ytdLY)
          : parseFloat(item.ytdLY);
        acc.ytdCY = acc.ytdCY
          ? parseFloat(acc.ytdCY) + parseFloat(item.ytdCY)
          : parseFloat(item.ytdCY);
        acc.growthCHF = acc.growthCHF
          ? parseFloat(acc.growthCHF) + (parseFloat(item.ytdCY) - parseFloat(item.ytdLY))
          : parseFloat(item.ytdCY) - parseFloat(item.ytdLY);

        if (index === filteredTurnoverData.length - 1) {

          acc.growthPercentage = acc.growthPercentage
            ? parseFloat(acc.growthPercentage) +
            (((parseFloat(acc.ytdCY) - parseFloat(acc.ytdLY)) / parseFloat(acc.ytdLY)) * 100)
            : (((parseFloat(acc.ytdCY) - parseFloat(acc.ytdLY)) / parseFloat(acc.ytdLY)) * 100);

          if (isNaN(acc.growthPercentage)) {
            acc.growthPercentage = '0';
          } else {
            acc.growthPercentage = Math.round(acc.growthPercentage);
          }
        }
        return acc;
      }, {});

      // ** Formatting total data
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const element = result[key];
          if (element !== '') {
            result[key] = getLocaleNumberFormatter(element).toString();
          }

          if (key === 'growthPercentage' && element !== '') {
            result[key] = result[key] + '%';
          }
        }
      }

      // ** For All markets adding sub total data
     
        const idTurnoverGroupData = filteredTurnoverData.map((item: any) => item.iDTurnoverGroup)
        const uniqueIdTurnoverGroupData = [...new Set(idTurnoverGroupData)];

        const turnoverWithSubTotalData: any = uniqueIdTurnoverGroupData.reduce((acc: any, idTurnoverGroup: any) => {
          let filteredData = filteredTurnoverData.filter((item: any) => item.iDTurnoverGroup === idTurnoverGroup);

          if (filteredData.length === 0) {
            return acc;
          }

          const subTotalData = filteredData.reduce((acc: any, item: any, index: number) => {
            acc.totalLY = acc.totalLY
              ? parseFloat(acc.totalLY) + parseFloat(item.totalLY)
              : parseFloat(item.totalLY);
            acc.ytdLY = acc.ytdLY
              ? parseFloat(acc.ytdLY) + parseFloat(item.ytdLY)
              : parseFloat(item.ytdLY);
            acc.ytdCY = acc.ytdCY
              ? parseFloat(acc.ytdCY) + parseFloat(item.ytdCY)
              : parseFloat(item.ytdCY);
            acc.growthCHF = acc.growthCHF
              ? parseFloat(acc.growthCHF) + (parseFloat(item.ytdCY) - parseFloat(item.ytdLY))
              : parseFloat(item.ytdCY) - parseFloat(item.ytdLY);

            if (index === filteredData.length - 1) {
              acc.growthPercentage = acc.growthPercentage
                ? parseFloat(acc.growthPercentage) +
                (((parseFloat(acc.ytdCY) - parseFloat(acc.ytdLY)) / parseFloat(acc.ytdLY)) * 100)
                : (((parseFloat(acc.ytdCY) - parseFloat(acc.ytdLY)) / parseFloat(acc.ytdLY)) * 100);

              if (isNaN(acc.growthPercentage)) {
                acc.growthPercentage = '0';
              } else {
                acc.growthPercentage = Math.round(acc.growthPercentage);
              }
            }

            return acc;
          }, {});

          subTotalData.formattedGrowthPercentage = getLocaleNumberFormatter(subTotalData.growthPercentage).toString() + '%'
          subTotalData.formattedGrowthCHF = getLocaleNumberFormatter(subTotalData.growthCHF).toString()
          subTotalData.formattedYtdCY = getLocaleNumberFormatter(subTotalData.ytdCY).toString()
          subTotalData.formattedTotalLY = getLocaleNumberFormatter(subTotalData.totalLY).toString()
          subTotalData.formattedYtdLY = getLocaleNumberFormatter(subTotalData.ytdLY).toString()
          subTotalData.descriptionLanguage = filteredData[0].descriptionLanguage
          subTotalData.description = "Subtotal"

          filteredData.push(subTotalData);

          acc = [...acc, ...filteredData];

          return acc;
        }, [])


        filteredTurnoverData = turnoverWithSubTotalData;
      

      setTotalData(result);
      setTurnoverDetailsData(filteredTurnoverData);
    }
  };

  const handleTurnoverDetailsDropdown = (data: any) => {
    setTurnoverDetailsDropdown(data.idTurnoverGroup);
  };

  const handleTurnoverDetailsType = (data: any) => {
    setTurnoverDetailsType(data);
  };

  const renderTurnoverDetailsDropDown = (item: any) => {
    return (
      <View row centerV padding-v2>
        <Text style={tw(`text-light-textBlack text-13px font-normal`)}>
          {item.descriptionLanguage}
        </Text>
      </View>
    );
  };

  return (
    <View flex>
      <View
        br40
        marginT-v4
        padding-v4
        style={tw('border-default border-light-lavendar')}>
        <Text text18M textBlack>
          Sales Turnover Summary
        </Text>
        <View row spread centerV marginT-v2>
          <View>
            <Text text13M textBlack>
              Turnover Invoices
            </Text>
            <Text text13R textBlack marginT-v1>
              {turnoverSummary.turnoverInvoices}
            </Text>
          </View>
          <View right>
            <Text text13M textBlack>
              Turnover Portfolio
            </Text>
            <Text text13R textBlack marginT-v1>
              {turnoverSummary.turnoverPortfolio}
            </Text>
          </View>
          <View right>
            <Text text13M textBlack>
              Deviation CA
            </Text>
            <Text text13R textBlack marginT-v1>
              {turnoverSummary.deviationCA}
            </Text>
          </View>
          <View right>
            <Text text13M textBlack>
              Volume Difference
            </Text>
            <Text text13R textBlack marginT-v1>
              {turnoverSummary.volumeDifference}
            </Text>
          </View>
        </View>
      </View>
      <View
        br40
        marginT-v2
        paddingT-v4
        paddingH-v4
        paddingB-v2
        flex
        style={tw('border-default border-light-lavendar')}>
        <View row centerV spread>
          <View row centerV>
            <Text text18M textBlack marginR-v5>
              Turnover Details
            </Text>
            {turnoverData.length > 0 && (
              <Dropdown
                extraStyle={'w-170px '}
                labelField="descriptionLanguage"
                valueField="idTurnoverGroup"
                renderItem={renderTurnoverDetailsDropDown}
                data={dropDownData}
                value={turnoverDetailsDropdown}
                onChange={handleTurnoverDetailsDropdown}
              />
            )}
          </View>
          {turnoverData.length > 0 && (
            <View>
              <RadioButton
                onValueChange={handleTurnoverDetailsType}
                initialValue={turnoverDetailsType}
                color={ColourPalette.light.darkBlue}
                data={TURNOVER_RADIO_BUTTON_TYPES}
                containerStyle={tw('mr-10')}
                labelStyle={tw('text-13px font-normal')}
              />
            </View>
          )}
        </View>
        {turnoverDetailsData.length === 0 ? (
          <NoDataComponent
            title={
              turnoverData.length > 0
                ? 'No data for the selected filters'
                : 'No data for turnover details'
            }
            subTitle={
              turnoverData.length > 0 ? 'Change the filters for data' : ''
            }
          />
        ) : (
          <View
            marginT-v4
            br20
            flex
            style={tw('border-default border-light-lavendar')}>
            <View marginH-v4 paddingV-v06 row centerV>
              <Text text13M textBlack flex-3 marginR-v5>
                Turnover Group
              </Text>
              <Text text13M textBlack flex-4 marginR-v5>
                Description
              </Text>
              <Text
                text13M
                textBlack
                flex-2
                marginR-v5
                style={tw('text-right')}>
                Total LY
              </Text>
              <Text
                text13M
                textBlack
                flex-2
                marginR-v5
                style={tw('text-right')}>
                YTD LY
              </Text>
              <Text
                text13M
                textBlack
                flex-2
                marginR-v5
                style={tw('text-right')}>
                YTD CY
              </Text>
              <Text
                text13M
                textBlack
                flex-2
                marginR-v5
                style={tw('text-right')}>
                Growth CHF
              </Text>
              <Text
                text13M
                textBlack
                flex-2
                marginR-v5
                style={tw('text-right')}>
                Growth
              </Text>
            </View>
            <View
              paddingH-v4
              paddingV-v06
              row
              centerV
              style={tw(
                'border-t-default border-light-lavendar bg-light-lightBlue6',
              )}>
              <Text text13BO textBlack flex-3 marginR-v5>
                TOTAL
              </Text>
              <Text text13BO textBlack flex-4 marginR-v5>
                --
              </Text>
              <Text text13BO textBlack flex-2 marginR-v5 style={tw('text-right')}>
                {totalData.totalLY}
              </Text>
              <Text text13BO textBlack flex-2 marginR-v5 style={tw('text-right')}>
                {totalData.ytdLY}
              </Text>
              <Text text13BO textBlack flex-2 marginR-v5 style={tw('text-right')}>
                {totalData.ytdCY}
              </Text>
              <Text text13BO textBlack flex-2 marginR-v5 style={tw('text-right')}>
                {totalData.growthCHF}
              </Text>
              <Text text13BO textBlack flex-2 marginR-v5 style={tw('text-right')}>
                {totalData.growthPercentage}
              </Text>
            </View>
            <FlatList
              data={turnoverDetailsData}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item, index }) => {
                return (
                  <RenderTurnoverDetailsComponent
                    item={item}
                    index={index}
                    lastItem={turnoverDetailsData.length - 1 === index}
                  />
                );
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default TurnoverDetailsComponent;
