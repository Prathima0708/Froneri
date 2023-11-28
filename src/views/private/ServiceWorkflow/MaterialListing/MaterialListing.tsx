import React, { FC, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import Text from 'src/components/Text';
import View from 'src/components/View';
import Card from 'src/components/Card';
import InputText from 'src/components/InputText';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import PaginationHeader from 'src/components/CustomerSearch/PaginationHeader';
import RenderServiceWorkflowComponent from 'src/components/ServiceWorkflow/MaterialListing/RenderServiceWorkflowComponent';
import ServiceWorkFlowLandingHeader from 'src/components/Header/ServiceWorkFlowLandingHeader';

import { tw } from 'src/tw';

import { images } from 'src/assets/Images';

import { ColourPalette } from 'src/styles/config/ColoursStyles';

import { RootState, useAppSelector } from 'src/reducers/hooks';

import { toast } from 'src/utils/Util';

import ServiceWorkflowController from 'src/controller/ServiceWorkflowController';


const ListingHeaderServiceWorkflowComponent = () => {
  return (
    <View paddingH-v4 row centerV marginV-v06>
      <View flex marginR-v4>
        <Text text13M textBlack>
          Material No.
        </Text>
      </View>
      <View flex-4 marginR-v4>
        <Text text13M textBlack>
          Description
        </Text>
      </View>
      <View flex marginR-v4>
        <Text text13M textBlack>
          Equipment No.
        </Text>
      </View>
      <View flex marginR-v4>
        <Text text13M textBlack>
          Brand
        </Text>
      </View>
      <View flex>
        <Text text13M textBlack>
          Installed Date
        </Text>
      </View>
    </View>
  );
};

const MaterialListing: FC = () => {
  const limit = 20;
  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );
  const route = useRoute<any>();

  const [loading, setLoading] = useState(false);
  const [materialListingData, setMaterialListingData] = useState<any>([]);
  const [workflowObj, setWorkflowObj] = useState({
    searchText: '',
  });

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(limit);
  const [customerData, setCustomerData] = useState<any>({});
  const [totalCount, setTotalCount] = useState(0);
  const [isLeftButtonDisabled, setIsLeftButtonDisabled] = useState(false);
  const [isRightButtonDisabled, setIsRightButtonDisabled] = useState(false);

  useEffect(() => {
    if (route.params?.fromCLP) {
      setCustomerData(customerInfoData);
    } else {
      setCustomerData(route.params?.data);
    }
  }, []);

  useEffect(() => {
    handleSearch(
      start,
      workflowObj.searchText
    );
  }, [start])


  const handleSearch = async (start: number, searchText: string) => {
    try {
      setLoading(true);

      const paramData = route.params?.customerData;

      const data = await ServiceWorkflowController.getServiceWorkflowTradeAssets(
        paramData?.customerShipTo,
        paramData?.salesOrganization,
        paramData?.distributionChannel,
        start,
        limit,
        searchText
      )

      console.log('service workflow data :>> ', data);

      let res = data.results;

      setTotalCount(data.totalCount);
      if (start === 0) {
        setIsLeftButtonDisabled(true);
      } else {
        setIsLeftButtonDisabled(false);
      }

      if (res.length < limit) {
        setEnd(start + res.length);
        setIsRightButtonDisabled(true);
      } else {
        setEnd(start + limit);
        setIsRightButtonDisabled(false);
      }

      setMaterialListingData(data.results);
    } catch (error) {
      console.log('error while fetching screen data :>> ', error);
      toast.error({
        message: "something went wrong"
      })

      setMaterialListingData([]);
      setStart(0);
      setEnd(limit);
      setTotalCount(0);
      setIsLeftButtonDisabled(true);
      setIsRightButtonDisabled(true);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchTextChange = (text: string) => {
    setWorkflowObj({ ...workflowObj, searchText: text });
  };

  const handleSearchText = () => {
    Keyboard.dismiss();
    setStart(0);
    setEnd(limit);
    handleSearch(0, workflowObj.searchText);
  };

  const handleLeftIconPress = () => {
    setLoading(true);

    if (start === 0) {
      return;
    }

    setStart((prevStart: number) => prevStart - limit);
    setEnd((prevEnd: number) => prevEnd - limit);

    setLoading(false);
  };

  const handleRightIconPress = () => {
    setLoading(true);

    setStart((prevStart: number) => prevStart + limit);
    setEnd((prevEnd: number) => prevEnd + limit);

    setLoading(false);
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <View flex>
        <ServiceWorkFlowLandingHeader data={customerData} />
        <Card flex-1 marginH-v2 marginB-v4 padding-v4>
          <View flex-7>
            <View row marginB-v2>
              <View
                row
                centerV
                centerH
                style={tw(
                  'border-default rounded-md border-light-lavendar w-300px',
                )}>
                <InputText
                  placeholder="Search Material Number or Description"
                  style={tw('ml-14px mr-14px')}
                  value={workflowObj.searchText}
                  onChangeText={handleSearchTextChange}
                  onSubmitEditing={handleSearchText}
                  noBorders
                />
                <TouchableOpacity onPress={handleSearchText}>
                  <images.SearchIcon />
                </TouchableOpacity>
              </View>
            </View>

            {!loading && materialListingData.length > 0 && (
              <PaginationHeader
                currentPage={`${start + 1}`}
                totalPages={`${end}`}
                totalCustomers={`${totalCount}`}
                isLeftButtonDisabled={isLeftButtonDisabled}
                isRightButtonDisabled={isRightButtonDisabled}
                handleLeftIconPress={handleLeftIconPress}
                handleRightIconPress={handleRightIconPress}
              />
            )}
            <View marginT-v2 flex>
              {loading ? (
                <ActivityIndicator
                  size={'large'}
                  color={ColourPalette.light.black}
                  style={tw('flex-1')}
                />
              ) : materialListingData.length === 0 ? (
                <NoDataComponent />
              ) : (
                <View
                  flex
                  style={tw(
                    'rounded-md bg-light-white border-default border-light-lavendar rounded-md',
                  )}>
                  <ListingHeaderServiceWorkflowComponent />
                  <FlashList
                    data={materialListingData}
                    keyExtractor={(_: any, index) => index.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <RenderServiceWorkflowComponent
                          item={item}
                          index={index}
                          lastItem={materialListingData.length - 1 === index}
                        />
                      );
                    }}
                    estimatedItemSize={59}
                  />
                </View>
              )}
            </View>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default MaterialListing;
