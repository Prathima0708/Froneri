import View from 'src/components/View';
import Text from 'src/components/Text';
import Card from 'src/components/Card';
import React, {useState} from 'react';
import CRCADropdownComponent from 'src/components/CustomerLanding/CLVisitInfo/CRCA/CRCADropdownComponent';
import {tw} from 'src/tw';
import CRCAGraph from 'src/components/CustomerLanding/CLVisitInfo/CRCA/CRCAGraph';

const CRCAComponent = (props: any) => {
  const {openingHours, visitingHours, backgroundBarHours} = props;
  const [crcaType, setCRCAType] = useState('1');

  const handleCRCAChange = (item: any) => {
    setCRCAType(item.value);
  };

  return (
    <Card flex-1 padding-v4>
      <View row centerV spread>
        <Text text18M textBlack>
          CRCA/Business Hours
        </Text>
        {openingHours.length === 0 && visitingHours.length === 0 ? null : (
          <CRCADropdownComponent
            selectedValue={crcaType}
            handleCRCA={handleCRCAChange}
          />
        )}
      </View>
      {openingHours.length === 0 && visitingHours.length === 0 ? (
        <View centerH centerV flex>
          <Text text12R textBlack>
            {'No Data Found'}
          </Text>
        </View>
      ) : (
        <View>
          <View row centerV marginT-v2>
            <View row centerV marginR-v4>
              <View
                padding-v1
                marginR-v1
                style={tw(`bg-light-lightBlue4 rounded-default`)}></View>
              <Text style={tw(`text-light-textBlack text-13px font-normal`)}>
                Opening Hrs
              </Text>
            </View>
            <View row centerV marginR-v4>
              <View
                padding-v1
                marginR-v1
                style={tw(`bg-light-lightBlue5 rounded-default`)}></View>
              <Text style={tw(`text-light-textBlack text-13px font-normal`)}>
                Visiting Hrs
              </Text>
            </View>
            <View row centerV>
              <View
                padding-v1
                marginR-v1
                style={tw(`bg-light-grey6 rounded-default`)}></View>
              <Text style={tw(`text-light-textBlack text-13px font-normal`)}>
                Closed
              </Text>
            </View>
          </View>

          <CRCAGraph
            crcaType={crcaType}
            openingHours={openingHours}
            visitingHours={visitingHours}
            backgroundBarHours={backgroundBarHours}
          />
        </View>
      )}
    </Card>
  );
};

export default CRCAComponent;
