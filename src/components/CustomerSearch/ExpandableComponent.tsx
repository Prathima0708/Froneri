import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';

const ExpandableComponent = (props: any) => {
  const { item } = props;

  let address = item.address1 ? item.address1 : '';
  let city = item.city ? item.city : '';
  let postalCode = item.postalCode ? item.postalCode : '';
  let noOfTradeAssets = (
    item.amountTradeAssets ? item.amountTradeAssets : ''
  ).toString();
  let abcClassification = item.abcClassification ? item.abcClassification : '';
  let distributorName = item.distributor ? item.distributor : '-';

  /**
   * turn over
   * 0 -  hide all the turn over info
   * 1 - display all the turn over info
   * 2 - display only the ICE condition (Total & Ice, not Frozen Bakery & Frozen Food)
   */

  let isShowTurnOver = item.isShowTurnOver;

  // Total Turn Over
  let totalLastYear = (
    item.totalLastYear && item.totalLastYear != null ? item.totalLastYear : 0
  ).toString();
  let totalYTDCurrentYear = (
    item.totalYTDCurrentYear && item.totalYTDCurrentYear != null
      ? item.totalYTDCurrentYear
      : 0
  ).toString();
  let totalYTDLastYear = (
    item.totalYTDLastYear && item.totalYTDLastYear != null
      ? item.totalYTDLastYear
      : 0
  ).toString();

  let totalDifference = (
    item.totalDifference && item.totalDifference != null
      ? item.totalDifference
      : 0
  ).toString();

  //Ice
  let iceLastYear = (
    item.iceTotalLastYear && item.iceTotalLastYear != null
      ? item.iceTotalLastYear
      : 0
  ).toString();
  let iceYTDCurrentYear = (
    item.iceYTDCurrentYear && item.iceYTDCurrentYear != null
      ? item.iceYTDCurrentYear
      : 0
  ).toString();
  let iceYTDLastYear = (
    item.iceYTDLastYear && item.iceYTDLastYear != null ? item.iceYTDLastYear : 0
  ).toString();
  let iceDifference = (
    item.iceDifference && item.iceDifference != null ? item.iceDifference : 0
  ).toString();

  // Frozen Bakery
  let frozenBakeryLastYear = (
    item.frozenBakeryTotalLastYear && item.frozenBakeryTotalLastYear != null
      ? item.frozenBakeryTotalLastYear
      : 0
  ).toString();
  let frozenBakeryYTDCurrentYear = (
    item.frozenBakeryYTDCurrentYear && item.frozenBakeryYTDCurrentYear != null
      ? item.frozenBakeryYTDCurrentYear
      : 0
  ).toString();
  let frozenBakeryYTDLastYear = (
    item.frozenBakeryYTDLastYear && item.frozenBakeryYTDLastYear != null
      ? item.frozenBakeryYTDLastYear
      : 0
  ).toString();
  let frozenBakeryDifference = (
    item.frozenBakeryDifference && item.frozenBakeryDifference != null
      ? item.frozenBakeryDifference
      : 0
  ).toString();

  // Frozen Food
  let frozenFoodLastYear = (
    item.frozenFoodTotalLastYear && item.frozenFoodTotalLastYear != null
      ? item.frozenFoodTotalLastYear
      : 0
  ).toString();
  let frozenFoodYTDCurrentYear = (
    item.frozenFoodYTDCurrentYear && item.frozenFoodYTDCurrentYear != null
      ? item.frozenFoodYTDCurrentYear
      : 0
  ).toString();
  let frozenFoodYTDLastYear = (
    item.frozenFoodYTDLastYear && item.frozenFoodYTDLastYear != null
      ? item.frozenFoodYTDLastYear
      : 0
  ).toString();
  let frozenFoodDifference = (
    item.frozenFoodDifference && item.frozenFoodDifference != null
      ? item.frozenFoodDifference
      : 0
  ).toString();

  return (
    <View
      marginL-v8
      marginR-v2
      padding-v2
      style={tw('border-t-default border-light-grey2')}>
      <View row>
        <View marginR-v6 flex>
          <Text text13M textBlack>
            label.general.address
          </Text>
          <Text text13R textBlack marginT-03 numberOfLines={1}>
            {address}
          </Text>
        </View>
        <View marginR-v6 flex>
          <Text text13M textBlack>
            label.general.city
          </Text>
          <Text text13R textBlack marginT-03 numberOfLines={1}>
            {city}
          </Text>
        </View>
        <View marginR-v6 flex>
          <Text text13M textBlack>
            label.general.postal_code
          </Text>
          <Text text13R textBlack marginT-03 numberOfLines={1}>
            {postalCode}
          </Text>
        </View>
        <View flex marginR-v6>
          <Text text13M textBlack>
            label.customersearch.no_of_trade_assets
          </Text>
          <Text text13R textBlack marginT-03 numberOfLines={1}>
            {noOfTradeAssets}
          </Text>
        </View>
        <View flex>
          <Text text13M textBlack>
            label.general.abc_classification
          </Text>
          <Text numberOfLines={1} text13R textBlack marginT-03>
            {abcClassification}
          </Text>
        </View>
      </View>
      <View
        row
        marginR-v2
        paddingV-v3
        style={tw('border-b-0.5 border-light-grey2')}>
        <View marginR-v6 flex>
          <Text text13M textBlack>
            label.customersearch.distributor
          </Text>
          <Text numberOfLines={1} text13R textBlack marginT-03>
            {distributorName}
          </Text>
        </View>
        <View marginR-v6 flex></View>
        <View marginR-v6 flex></View>
        <View marginR-v6 flex></View>
        <View flex></View>
      </View>
      {isShowTurnOver == 0 ? null : (
        <View
          paddingT-v3
          paddingB-v2
          style={[
            tw('relative z-10 top-0'),
            { backgroundColor: props.background },
          ]}>
          <View row>
            <View marginR-v6 flex></View>
            <View marginR-v6 flex>
              <Text text13M textBlack>
                label.general.last_year
              </Text>
            </View>
            <View marginR-v6 flex>
              <Text text13M textBlack>
                label.general.ytd_cy
              </Text>
            </View>
            <View marginR-v6 flex>
              <Text text13M textBlack>
                label.general.ytd_ly
              </Text>
            </View>
            <View flex>
              <Text text13M textBlack>
                label.general.difference
              </Text>
            </View>
          </View>
          <View row marginT-v3>
            <View marginR-v6 flex>
              <Text text13R grey2 marginT-03>
                label.createprospect.total
              </Text>
            </View>
            <View marginR-v6 flex>
              <Text numberOfLines={1} text13R textBlack marginT-03>
                {totalLastYear}
              </Text>
            </View>
            <View marginR-v6 flex>
              <Text numberOfLines={1} text13R textBlack marginT-03>
                {totalYTDCurrentYear}
              </Text>
            </View>
            <View marginR-v6 flex>
              <Text numberOfLines={1} text13R textBlack marginT-03>
                {totalYTDLastYear}
              </Text>
            </View>
            <View flex>
              <Text numberOfLines={1} text13R textBlack marginT-03>
                {totalDifference}
              </Text>
            </View>
          </View>
          <View row marginT-v3>
            <View marginR-v6 flex>
              <Text text13R grey2 marginT-03>
                label.customersearch.ice
              </Text>
            </View>
            <View marginR-v6 flex>
              <Text numberOfLines={1} text13R textBlack marginT-03>
                {iceLastYear}
              </Text>
            </View>
            <View marginR-v6 flex>
              <Text numberOfLines={1} text13R textBlack marginT-03>
                {iceYTDCurrentYear}
              </Text>
            </View>
            <View marginR-v6 flex>
              <Text numberOfLines={1} text13R textBlack marginT-03>
                {iceYTDLastYear}
              </Text>
            </View>
            <View flex>
              <Text numberOfLines={1} text13R textBlack marginT-03>
                {iceDifference}
              </Text>
            </View>
          </View>
          {isShowTurnOver == 2 ? null : (
            <View row marginT-v3>
              <View marginR-v6 flex>
                <Text text13R grey2 marginT-03>
                  label.general.frozen_bakery
                </Text>
              </View>
              <View marginR-v6 flex>
                <Text numberOfLines={1} text13R textBlack marginT-03>
                  {frozenBakeryLastYear}
                </Text>
              </View>
              <View marginR-v6 flex>
                <Text numberOfLines={1} text13R textBlack marginT-03>
                  {frozenBakeryYTDCurrentYear}
                </Text>
              </View>
              <View marginR-v6 flex>
                <Text numberOfLines={1} text13R textBlack marginT-03>
                  {frozenBakeryYTDLastYear}
                </Text>
              </View>
              <View flex>
                <Text numberOfLines={1} text13R textBlack marginT-03>
                  {frozenBakeryDifference}
                </Text>
              </View>
            </View>
          )}
          {isShowTurnOver == 2 ? null : (
            <View row marginT-v3>
              <View marginR-v6 flex>
                <Text text13R grey2 marginT-03>
                  label.createprospect.frozen_food
                </Text>
              </View>
              <View marginR-v6 flex>
                <Text numberOfLines={1} text13R textBlack marginT-03>
                  {frozenFoodLastYear}
                </Text>
              </View>
              <View marginR-v6 flex>
                <Text numberOfLines={1} text13R textBlack marginT-03>
                  {frozenFoodYTDCurrentYear}
                </Text>
              </View>
              <View marginR-v6 flex>
                <Text numberOfLines={1} text13R textBlack marginT-03>
                  {frozenFoodYTDLastYear}
                </Text>
              </View>
              <View flex>
                <Text numberOfLines={1} text13R textBlack marginT-03>
                  {frozenFoodDifference}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ExpandableComponent;
