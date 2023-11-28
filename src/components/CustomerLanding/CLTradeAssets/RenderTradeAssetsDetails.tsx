import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {useState} from 'react';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {tw} from 'src/tw';
import {images} from 'src/assets/Images';
import {TouchableOpacity} from 'react-native';
import ExpandableSection from 'src/components/ExpandableSection';
import {getOnlyDate} from 'src/utils/CommonUtil';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

interface TradeAssetsDetailsProps {
  item: any;
  index: number;
}

const RenderTradeAssetsDetails = (props: TradeAssetsDetailsProps) => {
  const {item, index} = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const materialNumber = item.materialNumber
    ? item.materialNumber.toString()
    : '-';
  const materialDescription = item.materialDescription
    ? item.materialDescription
    : '-';
  const equipmentNumber = item.equipmentNumber
    ? item.equipmentNumber.toString()
    : '';
  const installedDate = item.installedDate
    ? getOnlyDate(item.installedDate)
    : '-';
  const status1 = item.status1 ? item.status1 : '';
  const brand = item.brand ? item.brand : '-';
  const constructionYear = item.constructionYear
    ? getOnlyDate(item.constructionYear)
    : '-';
  const price = item.price ? item.price.toString() : '--';
  const targetTurnover = item.targetTurnover
    ? item.targetTurnover.toString()
    : '--';
  const orderNumber = item.batchNumber ? item.batchNumber.toString() : '--';
  const taAgreementNumber = item.manufacturerModel
    ? item.manufacturerModel.toString()
    : '--';

  return (
    <View
      style={[
        tw(`${isExpanded ? 'border-0.5 border-light-grey3' : ''} m-px`),
        {backgroundColor: colors[index % colors.length]},
      ]}>
      <View row centerV paddingV-v2 paddingH-v3>
        <Text text13M grey2 flex-2 numberOfLines={1} marginR-v3>
          {materialNumber}
        </Text>
        <Text text13M grey2 flex-4 numberOfLines={1} marginR-v3>
          {materialDescription}
        </Text>
        <Text text13M grey2 flex-2 numberOfLines={1} marginR-v3>
          {equipmentNumber}
        </Text>
        <Text text13M grey2 flex-2 numberOfLines={1} marginR-v3>
          {installedDate}
        </Text>
        <Text text13M grey2 flex-2 numberOfLines={1}>
          {status1}
        </Text>
        <TouchableOpacity style={tw('flex-1')} onPress={handleExpanded}>
          {isExpanded ? <images.UpIcon /> : <images.DownIcon />}
        </TouchableOpacity>
      </View>
      <ExpandableSection expanded={isExpanded}>
        <View
          row
          marginH-v4
          paddingV-v3
          style={tw('border-t-0.5 border-light-grey1')}>
          <View row spread flex-13>
            <View marginR-v2>
              <Text text13M textBlack>
                Brand
              </Text>
              <Text text13R grey2 marginT-v03>
                {brand}
              </Text>
            </View>
            <View marginR-v2>
              <Text text13M textBlack>
                Construction Date
              </Text>
              <Text text13R grey2 marginT-v03>
                {constructionYear}
              </Text>
            </View>
            <View marginR-v2 right>
              <Text text13M textBlack>
                Price
              </Text>
              <Text text13R grey2 marginT-v03>
                {price}
              </Text>
            </View>
            <View marginR-v2 right>
              <Text text13M textBlack>
                Target Turnover
              </Text>
              <Text text13R grey2 marginT-v03>
                {targetTurnover}
              </Text>
            </View>
            <View marginR-v2>
              <Text text13M textBlack>
                Order #
              </Text>
              <Text text13R grey2 marginT-v03>
                {orderNumber}
              </Text>
            </View>
            <View marginR-v2>
              <Text text13M textBlack>
                TA Agreement #
              </Text>
              <Text text13R grey2 marginT-v03>
                {taAgreementNumber}
              </Text>
            </View>
          </View>
          <View flex-2></View>
        </View>
      </ExpandableSection>
    </View>
  );
};

export default RenderTradeAssetsDetails;
