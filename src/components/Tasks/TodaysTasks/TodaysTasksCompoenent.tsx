import React, {useEffect, useState, useContext, FC} from 'react';
import {ActivityIndicator, SafeAreaView, TouchableOpacity} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useNavigation} from '@react-navigation/native';
import View from 'src/components/View';

import PaginationHeader from 'src/components/CustomerSearch/PaginationHeader';

import NoDataComponent from 'src/components/Common/NoDataComponent';

import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {TASKS} from 'src/utils/Constant';
import {images} from 'src/assets/Images';
import InputText from 'src/components/InputText';
import TasksTopTabComponent from '../TasksTopTabComponent';
import TasksHeaderComponent from '../TasksHeaderComponent';
import TodaysTasksListingComponent from './TodaysTasksListingComponent';

const dummyData = [
  {
    callPlaceNumber: 'DE0997',
    claimsScreenLayout: null,
    creationDate: '27-01-2021',
    customerClassification: 'D',
    customerGroup15: '',
    customerShipTo: '0020373881',
    customerStatusCode: 'C',
    delegated: '0',
    description:
      'OB = Herr Steinmüller K.  hat großes Interesse an Aktionen, würde sich über ein pers. Gespräch freuen, er kauft  größere Mengen und bittet um Angebote/ MHD Ware ect.',
    discoveryId: '',
    distributionChannel: '02',
    employee: '0099112115 Carola Baer - T',
    idServiceRequestCustomer: '433A95CAF2A944F6B68A114022A30536',
    idStatus: '2',
    industryCode: 'DBF',
    name: 'Steinmüller Klaus u. Christian GdbR',
    overdue: 1,
    pickingPlantNumber: 'UE001',
    requestType: null,
    requestedDate: '03-02-2021',
    resolutionDate: null,
    resolvedEmployeeNumber: '0099111585',
    responsible: '00991115850099111585 Marcel Paul - BL',
    salesOrganization: 'DE09',
    status: 'In Progress',
    statusType: 'C',
    street3: '0020019046',
    tradeAssetsAmount: 2,
  },
];
const TodaysTasksComponent: FC = () => {
  const navigation = useNavigation();

  const limit = 20;

  const [tasksListingData, setTasksListingData] = useState<any>([]);

  const [statusType, setStatusType] = useState(TASKS.ALL);
  const [listLoading, setListLoading] = useState(false);
  const [isLeftButtonDisabled, setIsLeftButtonDisabled] = useState(false);
  const [isRightButtonDisabled, setIsRightButtonDisabled] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(limit);
  const [expandedItemIndex, setExpandedItemIndex] = useState(-1);
  useEffect(() => {
    handleSearch(start, statusType);
  }, [start, statusType]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleSearch(start, statusType);
    });
    return unsubscribe;
  }, [start, statusType]);

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };
  // handle search code
  const handleSearch = async (start: number, statusType: string) => {
    try {
      setListLoading(true);
      let ar = [];
      // setting Dummy Data
      if (statusType != 'All') {
        for (let i = 0; i < 10; i++) {
          ar.push({...dummyData[0], status: statusType, overdue: i % 2 == 0});
        }
      } else {
        for (let i = 0; i < 10; i++) {
          ar.push({
            ...dummyData[0],
            status: i % 2 == 0 ? TASKS.COMPLETED : TASKS.INPROGRESS,
            overdue: i % 2 == 0,
          });
        }
      }

      const listingData = {
        results: ar,
        totalCount: 10,
      };
      const res = listingData.results;
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
      setTasksListingData(listingData.results);
      setTotalCount(listingData.totalCount);
    } catch (error) {
      console.log('error while fetching service workflow listing :>> ', error);
    } finally {
      setListLoading(false);
    }
  };

  const handleExpandable = (index: number) => {
    if (index === expandedItemIndex) {
      setExpandedItemIndex(-1); // Close the expanded item
    } else {
      setExpandedItemIndex(index); // Expand the item
    }
  };
  // Setting the calendar filter when pressing on top tab
  const changeCalendarFilter = (data: string) => {
    setStatusType(data);
  };

  const handleLeftIconPress = () => {
    setListLoading(true);

    if (start === 0) {
      return;
    }

    setStart((prevStart: number) => prevStart - limit);
    setEnd((prevEnd: number) => prevEnd - limit);

    setListLoading(false);
  };

  const handleRightIconPress = () => {
    setListLoading(true);

    setStart((prevStart: number) => prevStart + limit);
    setEnd((prevEnd: number) => prevEnd + limit);

    setListLoading(false);
  };

  const renderContent = () => {
    if (listLoading) {
      return (
        <ActivityIndicator
          size={'large'}
          color={ColourPalette.light.darkBlue}
          style={tw('flex-1')}
        />
      );
    } else if (tasksListingData.length > 0) {
      return (
        <View
          flex
          style={tw(
            'bg-light-white border-default border-light-lavendar rounded-md',
          )}>
          <TasksHeaderComponent todaysTasks={true} />
          <FlashList
            data={tasksListingData}
            keyExtractor={(_: any, index) => index?.toString()}
            renderItem={({item, index}) => {
              return (
                <TodaysTasksListingComponent
                  expandedItemIndex={expandedItemIndex}
                  item={item}
                  index={index}
                  lastItem={tasksListingData.length - 1 === index}
                  onPressExpand={handleExpandable}
                />
              );
            }}
            estimatedItemSize={59}
            extraData={[[], expandedItemIndex]}
          />
        </View>
      );
    } else {
      return <NoDataComponent />;
    }
  };

  return (
    <>
      <View flex-7>
        <View
          marginB-v4
          row
          spread
          centerV
          paddingL-v2
          style={tw('border-default rounded-md border-light-lavendar w-md')}>
          <InputText
            placeholder="Search Customers Name , Number or Tasks Description"
            value={searchText}
            onChangeText={handleSearchTextChange}
            noBorders={true}
            onSubmitEditing={() => {}}
          />
          <TouchableOpacity onPress={() => {}}>
            <images.SearchIcon />
          </TouchableOpacity>
        </View>
        <View row spread centerH marginB-v4>
          <TasksTopTabComponent
            handleChangeCalendarFilter={(data: string) => {
              changeCalendarFilter(data);
            }}
            calendarFilterValue={statusType}
          />
        </View>

        {!listLoading && tasksListingData.length > 0 && (
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
          {renderContent()}
        </View>
      </View>
    </>
  );
};

export default TodaysTasksComponent;
