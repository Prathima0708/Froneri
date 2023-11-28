import View from 'src/components/View';
import Text from 'src/components/Text';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {images} from 'src/assets/Images';
import {useNavigation} from '@react-navigation/native';
import {tw} from 'src/tw';
import Card from 'src/components/Card';
import DateTimePicker from 'src/components/DateTimePicker';
import {DATETIME_PICKER_MODE} from 'src/utils/Constant';
import InputText from 'src/components/InputText';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import RenderProductStatisticsComponent from 'src/components/CustomerLanding/CLTurnover/RenderProductStatisticsComponent';
import {
  pageNameCLMaterialHierarchy,
  pageNameCLProductStatistics,
} from 'src/routes/Routes';
import CLProductStatisticsController from 'src/controller/CLProductStatisticsController';
import ApiUtil from 'src/services/ApiUtil';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import CLProductStatisticsPaginationComponent from 'src/components/CustomerLanding/CLProductStatistics/CLProductStatisticsPaginationComponent';
import {toast} from 'src/utils/Util';

let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

const CLProductStatistics = () => {
  const navigation = useNavigation();
  // state variables ...
  const [deliveredFrom, setDeliveredFrom] = useState<string | Date>('');
  const [deliveredTo, setDeliveredTo] = useState<string | Date>('');
  const [materialNumber, setMaterialNumber] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialHierarchyNode, setMaterialHierarchy] = useState('');
  const [loading, setLoading] = useState(false);
  const [productStatisticsData, setProductStatisticsData] = useState([]);
  const [sortedProductStatisticsData, setSortedProductStatisticsData] =
    useState([]);
  const [materialDescriptionSort, setMaterialDescriptionSort] = useState('');
  const [quantitySort, setQuantitySort] = useState('');
  const [netAmountSort, setNetAmountSort] = useState('');

  const [isLeftActive, setIsLeftActive] = useState(true);
  const [isRightActive, setIsRightActive] = useState(true);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(20);

  // ...
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setDeliveredFrom(new Date(currentYear + '-01-01'));
    setDeliveredTo(new Date());
  }, []);
  // Showing the list loader and fetching data after checking the internet connection
  useEffect(() => {
    getProductStatisticsData();
  }, [pageNumber]);

  // Filter product statistics data ..
  const handleDisplayProductStatistics = () => {
    if (deliveredFrom == '' || deliveredTo == '') {
      toast.error({
        message: 'Both Delivered From and Delivered to are required',
      });
      return;
    }
    Keyboard.dismiss();
    getProductStatisticsData();
  };

  const getProductStatisticsData = async () => {
    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();

    if (deliveredFrom === '' || deliveredTo === '') {
      return;
    }

    if (!isOnline.status) {
      console.log('isOnline.errMsg', isOnline.errMsg);
      toast.info({
        message: isOnline.errMsg,
      });
      return;
    }

    setLoading(true);

    CLProductStatisticsController.getProductStatistics(
      pageNumber,
      pageSize,
      deliveredFrom,
      deliveredTo,
      materialNumber,
      materialDescription,
      materialHierarchyNode,
    )
      .then(data => {
        console.log(
          'product statistics data :>> ',
          data.data.length,
          data.total,
        );

        let productStatisticsData = data.data;

        // Hiding the left icon and setting the end value to total when page number is 1, i.e. first page
        if (pageNumber === 1) {
          setIsLeftActive(false);
          if (productStatisticsData.length < pageSize) {
            setEnd(productStatisticsData.length);
          } else {
            setEnd(pageSize);
          }
        } else {
          setIsLeftActive(true);
        }

        // Hiding the right icon when data is less than page size i.e. last page
        if (productStatisticsData.length < pageSize) {
          setIsRightActive(false);
        } else {
          setIsRightActive(true);
        }

        // Setting the total value and contact history data
        setTotal(data.total);
        setProductStatisticsData(productStatisticsData);
        setSortedProductStatisticsData(productStatisticsData);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLProductStatistics.tsx:89 ~ handleDisplayProductStatistics ~ error:',
          error,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // sort material description column in asc, des
  const handleMaterialDescriptionSort = () => {
    if (productStatisticsData.length == 0) {
      return;
    }
    if (materialDescriptionSort == '') {
      setMaterialDescriptionSort('ASC');
      const sortedAscending = [...productStatisticsData].sort(
        (a: any, b: any) =>
          a.materialDescription.localeCompare(b.materialDescription),
      );
      setSortedProductStatisticsData([...sortedAscending]);
    }
    if (materialDescriptionSort == 'ASC') {
      setMaterialDescriptionSort('DES');
      const sortedDescending = [...productStatisticsData].sort(
        (a: any, b: any) =>
          b.materialDescription.localeCompare(a.materialDescription),
      );
      setSortedProductStatisticsData([...sortedDescending]);
    }
    if (materialDescriptionSort == 'DES') {
      setMaterialDescriptionSort('');
      setSortedProductStatisticsData([...productStatisticsData]);
    }
  };

  // sort quantity column in asc, des
  const handleQuantitySort = () => {
    if (productStatisticsData.length == 0) {
      return;
    }
    if (quantitySort == '') {
      setQuantitySort('ASC');
      const sortedAscending = [...productStatisticsData].sort(
        (a: any, b: any) => a.quantity - b.quantity,
      );
      setSortedProductStatisticsData([...sortedAscending]);
    }
    if (quantitySort == 'ASC') {
      setQuantitySort('DES');
      const sortedDescending = [...productStatisticsData].sort(
        (a: any, b: any) => b.quantity - a.quantity,
      );
      setSortedProductStatisticsData([...sortedDescending]);
    }
    if (quantitySort == 'DES') {
      setQuantitySort('');
      setSortedProductStatisticsData([...productStatisticsData]);
    }
  };

  // sort net amount column in asc, des
  const handleNetAmountSort = () => {
    if (productStatisticsData.length == 0) {
      return;
    }
    if (netAmountSort == '') {
      setNetAmountSort('ASC');
      const sortedAscending = [...productStatisticsData].sort(
        (a: any, b: any) => a.netAmount - b.netAmount,
      );
      setSortedProductStatisticsData([...sortedAscending]);
    }
    if (netAmountSort == 'ASC') {
      setNetAmountSort('DES');
      const sortedDescending = [...productStatisticsData].sort(
        (a: any, b: any) => b.netAmount - a.netAmount,
      );
      setSortedProductStatisticsData([...sortedDescending]);
    }
    if (netAmountSort == 'DES') {
      setNetAmountSort('');
      setSortedProductStatisticsData([...productStatisticsData]);
    }
  };

  const handleDeliveredFrom = (date: any) => {
    setDeliveredFrom(date);
  };

  const handleDeliveredTo = (date: any) => {
    setDeliveredTo(date);
  };

  const handleMaterialNumber = (text: string) => {
    setMaterialNumber(text);
  };

  const handleMaterialDescription = (text: string) => {
    setMaterialDescription(text);
  };

  const handleMaterialHierarchy = (text: string) => {
    setMaterialHierarchy(text);
  };

  const handleOnPressMaterialHierarchy = () => {
    navigation.navigate(
      pageNameCLMaterialHierarchy as never,
      {
        materialHierarchy: materialHierarchyNode,
        handleMaterialHierarchy,
      } as never,
    );
  };

  const handleClearFilter = () => {
    setDeliveredFrom('');
    setDeliveredTo('');
    setMaterialNumber('');
    setMaterialDescription('');
    setMaterialHierarchy('');
    setProductStatisticsData([]);
    setSortedProductStatisticsData([]);
  };

  const renderEmptyData = () => {
    return [...Array(9)].map((e, i) => {
      return (
        <View
          key={i.toString()}
          style={[
            tw(`border-t-default border-light-lavendar h-table-field`),
            {backgroundColor: colors[i % colors.length]},
          ]}
        />
      );
    });
  };

  // Handling the previous pagination
  const onLeftIconPress = () => {
    let endCondition = end - start;

    // Setting the end value to start if it is less than start
    if (endCondition < pageSize) {
      setEnd(start - 1);
    } else {
      setEnd(end - pageSize);
    }

    setStart(start - pageSize);
    setPageNumber(pageNumber - 1);

    // Disabling the left and right icons when data is loading for the pages
    setIsLeftActive(false);
    setIsRightActive(false);
  };

  // Handling the next pagination
  const onRightIconPress = () => {
    let endToSet = end + pageSize;

    // Setting the end value to total if it is greater than total
    if (endToSet > total) {
      setEnd(total);
    }
    // Setting the end value to endToSet if it is less than total
    else {
      setEnd(endToSet);
    }

    setStart(start + pageSize);
    setPageNumber(pageNumber + 1);

    // Disabling the left and right icons when data is loading for the pages
    setIsLeftActive(false);
    setIsRightActive(false);
  };

  return (
    <SafeAreaView style={tw('flex-1')}>
      <CustomerLandingHeader screen={pageNameCLProductStatistics} />
      <Card flex-1 marginH-v2 marginB-v2 padding-v4>
        <Text text18M textBlack>
          Product Statistics
        </Text>
        <View row centerV marginT-v4>
          <View flex>
            <Text text13M textBlack>
              Delivered From*
            </Text>
            <DateTimePicker
              dateFormat={'DD-MM-YYYY'}
              mode={DATETIME_PICKER_MODE.DATE}
              maximumDate={new Date()}
              onChange={handleDeliveredFrom}
              renderInput={({value}: any) => {
                return (
                  <View
                    style={tw(
                      'flex-row items-center rounded-md border-default border-light-lavendar  pl-3 justify-between mr-3 mt-1',
                    )}>
                    <Text text13R marginR-v2 textBlack>
                      {value}
                    </Text>
                    <images.CalendarIcon />
                  </View>
                );
              }}
              value={deliveredFrom}
            />
          </View>
          <View flex>
            <Text text13M textBlack>
              Delivered To*
            </Text>
            <DateTimePicker
              dateFormat={'DD-MM-YYYY'}
              mode={DATETIME_PICKER_MODE.DATE}
              maximumDate={new Date()}
              onChange={handleDeliveredTo}
              renderInput={({value}: any) => {
                return (
                  <View
                    style={tw(
                      'flex-row items-center rounded-md border-default border-light-lavendar  pl-3 justify-between mr-3 mt-1',
                    )}>
                    <Text text13R marginR-v2 textBlack>
                      {value}
                    </Text>
                    <images.CalendarIcon />
                  </View>
                );
              }}
              value={deliveredTo}
            />
          </View>
          <View flex marginR-v2>
            <Text text13M textBlack>
              Material Hierarchy
            </Text>
            <View
              row
              spread
              centerV
              style={tw(
                'rounded-md border-default border-light-lavendar mt-1',
              )}>
              <View flex>
                <InputText
                  style={tw('py-1 px-3')}
                  noBorders={true}
                  value={materialHierarchyNode}
                  placeholder="Enter Material Hierarchy or Select..."
                  placeholderTextColor={ColourPalette.light.grey2}
                  onChangeText={handleMaterialHierarchy}
                />
              </View>
              <TouchableOpacity onPress={handleOnPressMaterialHierarchy}>
                <images.MeatBallsIcon />
              </TouchableOpacity>
            </View>
          </View>
          <View flex>
            <InputText
              title="Material Number"
              value={materialNumber}
              placeholder="Enter Material Number"
              onChangeText={handleMaterialNumber}
            />
          </View>
        </View>
        <View marginT-v5>
          <View row>
            <View flex marginR-v6>
              <InputText
                title="Material Description"
                value={materialDescription}
                placeholder="Enter Material Number"
                onChangeText={handleMaterialDescription}
              />
            </View>
            <View flex row centerV right marginT-v4>
              <TouchableOpacity
                onPress={handleClearFilter}
                style={tw('justify-center items-center rounded-md mr-3')}>
                <Text darkBlue marginV-v06 marginH-v7>
                  Clear Filter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDisplayProductStatistics}
                style={tw(
                  'justify-center items-center bg-light-darkBlue rounded-md',
                )}>
                <Text white marginV-v06 marginH-v7>
                  Display Product Statistics
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View flex>
          {sortedProductStatisticsData.length > 0 && (
            <CLProductStatisticsPaginationComponent
              totalCount={total}
              start={start}
              end={end}
              isLeftActive={isLeftActive}
              isRightActive={isRightActive}
              onLeftIconPress={onLeftIconPress}
              onRightIconPress={onRightIconPress}
            />
          )}
          <View
            flex
            style={tw(
              `rounded-md bg-light-white border-default border-light-lavendar rounded-md ${
                sortedProductStatisticsData.length > 0 ? '' : 'mt-30px'
              }`,
            )}>
            <View paddingH-v4 row centerV marginV-v1>
              <View flex-3 row centerV marginR-v6>
                <Text text13M textBlack>
                  Material Number
                </Text>
              </View>
              <View flex-12 row centerV marginR-v6>
                <TouchableOpacity
                  style={tw('flex-row')}
                  onPress={handleMaterialDescriptionSort}>
                  <Text text13M textBlack marginT-v02>
                    Material Description
                  </Text>
                  <images.UpDownArrowIcon />
                </TouchableOpacity>
              </View>
              <View flex row centerV marginR-v6>
                <TouchableOpacity
                  style={tw('flex-row')}
                  onPress={handleQuantitySort}>
                  <Text text13M textBlack marginT-v02>
                    Qty
                  </Text>
                  <images.UpDownArrowIcon />
                </TouchableOpacity>
              </View>
              <View flex-2 row centerV marginR-v6 right>
                <TouchableOpacity
                  style={tw('flex-row')}
                  onPress={handleNetAmountSort}>
                  <Text text13M textBlack marginT-v02>
                    Net Amount
                  </Text>
                  <images.UpDownArrowIcon />
                </TouchableOpacity>
              </View>
              <View flex-2 row centerV marginR-v6>
                <Text text13M textBlack>
                  Price Unit
                </Text>
              </View>
              <View flex-2 row centerV right>
                <Text text13M textBlack>
                  Unit Price
                </Text>
              </View>
            </View>
            {loading ? (
              <View center flex>
                <ActivityIndicator size={'small'} color={'black'} />
              </View>
            ) : (
              <FlatList
                data={sortedProductStatisticsData}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item, index}) => {
                  return (
                    <RenderProductStatisticsComponent
                      item={item}
                      index={index}
                      lastItem={
                        sortedProductStatisticsData.length - 1 === index
                      }
                    />
                  );
                }}
                contentContainerStyle={tw('pb-px')}
                ListEmptyComponent={renderEmptyData}
              />
            )}
          </View>
        </View>
      </Card>
    </SafeAreaView>
  );
};

export default CLProductStatistics;
