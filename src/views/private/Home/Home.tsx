import React, { FC, useContext, useEffect, useState } from 'react';
import {
  BackHandler,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { StackNavigationProp } from '@react-navigation/stack';
import { PrivateStackParamList } from 'src/routes/types';
import Card from 'src/components/Card';
import TopTabComponent from 'src/components/Home/TopTabComponent';
import RenderVisits from 'src/components/Home/RenderVisits';
import HomeLoader from 'src/components/SkeletonUi/Home/HomeLoader';
import { images } from 'src/assets/Images';
import { VISIT_STATUS } from 'src/utils/Constant';
import RenderHomeCard from 'src/components/Home/RenderHomeCard';
import { RootState, useAppDispatch, useAppSelector } from 'src/reducers/hooks';
import { ImportUtil } from 'src/utils/Helper';
import UserContextService from 'src/services/UserContextService';
import { updateSyncStatus } from 'src/reducers/SyncStatusSlice';
import HomeHeader from 'src/components/Header/HomeHeader';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {
  pageNameVisits,
  pageNameServiceWorkflow,
  pageNameTodaysTasks,
  pageNameProspects,
  pageNameSalesMaterials,
  pageNameCLOverview,
  pageNameCustomerSearch,
} from 'src/routes/Routes';
import Modal from 'src/components/Modal';
import CustomerInfoModal from 'src/components/Visits/CustomerInfoModal';
import { resetSyncState } from 'src/reducers/SyncSlice';
import ListFooterComponent from 'src/components/Home/ListFooterComponent';
import HomeContoller from 'src/controller/HomeController';
import RNExitApp from 'react-native-exit-app';
import SelectUserModal from 'src/components/Home/SelectUserModal';
import ENV from 'src/env/env.config';
import { updateSelectedUserForSync } from 'src/reducers/UserContextSlice';
import { toast } from 'src/utils/Util';
import PLOverviewController from 'src/controller/PLOverviewController';
import i18n from '../../../../i18n';
import { AppContext } from 'src/provider/AppProvider';
type HomeProp = StackNavigationProp<PrivateStackParamList>;

const ENABLE_USER_SWITCH = ENV.ENABLE_USER_SWITCH;

const Home: FC = () => {
  const navigation = useNavigation<HomeProp>();
  const [loading, setLoading] = useState(false);
  const [isSyncLoading, setIsSyncLoading] = useState(false);
  const [todaysVisits, setTodaysVisits] = useState({
    open: [],
    paused: [],
    completed: [],
  });

  const [visits, setVisitsInfo] = useState({
    serviceWorkflowAssignedByMeCount: 0,
    serviceWorkflowCreatedByMeCount: 0,
    customersToVisitTodayCount: 0,
    delegatedCustomerVisitsCount: 0,
    delegatedPropectVisitsCount: 0,
    prospectsToVisitTodayCount: 0,
    prospectsActiveCount: 0,
    prospectsNewCustomerRequestCount: 0,
    validOpenTasks: 0,
    completedTasks: 0,
    brochureCount: 0,
  });

  const [customerInfoVisible, setCustomerInfoVisible] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({});

  // pagination states for missed visits
  const [missedVisitsCount, setMissedVisitsCount] = useState(0);
  const [missedVisits, setMissedVisit] = useState<never[]>([]);
  const [isMissedVisitLoading, setIsMissedVisitsLoading] = useState(false);
  const [selectUserModalVisible, setSelectUserModalVisible] = useState(false);
  const limit = 20;
  //

  const [visitStatus, setVisitStatus] = useState(VISIT_STATUS.OPEN);

  // pass the visits data based on visit type selection
  let data;
  if (visitStatus === VISIT_STATUS.OPEN) {
    data = todaysVisits.open;
  } else if (visitStatus === VISIT_STATUS.PAUSED) {
    data = todaysVisits.paused;
  } else if (visitStatus === VISIT_STATUS.COMPLETED) {
    data = todaysVisits.completed;
  } else {
    data = missedVisits;
  }

  // Sync Status ...
  const dispatch = useAppDispatch();
  const totalFiles = useAppSelector(
    (state: RootState) => state.sync.totalFiles,
  );
  const totalFilesImported = useAppSelector(
    (state: RootState) => state.sync.totalFilesImported,
  );
  const importMessage = useAppSelector(
    (state: RootState) => state.sync.importMessage,
  );
  const isInitialSyncDone = useAppSelector(
    (state: RootState) => state.syncStatus.isInitialSyncDone,
  );
  // language states....
  const { setPreferredLanguage } = useContext(AppContext);
  const selectedLanguage = useAppSelector(
    (state: RootState) => state.userContext.selectedLanguage,
  );
  //...

  useEffect(() => {
    if (!isInitialSyncDone) {
      return;
    }
    handleWorkflowCustomerProspectTaskSales();
  }, []);

  useEffect(() => {
    handleLanguageLoadFromDB();
  }, [isInitialSyncDone]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!isInitialSyncDone) {
        return;
      }
      handleWorkflowCustomerProspectTaskSales();
    });

    return unsubscribe;
  }, [isInitialSyncDone]);

  // Back handler function
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleGoBack);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleGoBack);
      };
    }, []),
  );

  //Load the language file
  useEffect(() => {
    handleLanguageLoadFromDB();
  }, []);

  const handleLanguageLoadFromDB = () => {
    console.log('Loading the language data', isInitialSyncDone);
    if (!isInitialSyncDone) {
      return;
    }
    HomeContoller.getTextsData(selectedLanguage.textFileName)
      .then(async res => {
        console.log('res :>> ', res);
        await i18n.addResourceBundle(
          selectedLanguage.language,
          'translation',
          res,
          true,
          true,
        );
      })
      .catch(err => {
        console.log('the err is', err);
      });
  };

  // Exit app on back press
  const handleGoBack = () => {
    RNExitApp.exitApp();
    console.log('Home called handleGoBack');
    return true;
  };

  // Fetching service workflows,, customers, prospects, tasks, sales materials count
  const handleWorkflowCustomerProspectTaskSales = () => {
    setLoading(true);
    HomeContoller.getWorkflowCustomerProspectTaskSalesCount()
      .then(res => {
        setVisitsInfo(res);
        handleTodaysOpenPausedCompletedVisits();
      })
      .catch(err => {
        setLoading(false);
        console.log('the err is', err);
      });
  };

  // Get Visits ..
  const handleTodaysOpenPausedCompletedVisits = () => {
    HomeContoller.getTodaysOpenPausedCompletedVisits()
      .then(res => {
        setTodaysVisits(res);
        handleMissedVisits();
      })
      .catch(err => {
        setLoading(false);
        console.log('the err is', err);
      });
  };

  // Get Missed Visits on initial load and on refresh (i.e. when user edit or delete the visit)
  const handleMissedVisits = () => {
    HomeContoller.getMissedVisitAgenda(0, limit)
      .then(res => {
        setMissedVisitsCount(res.totalCount);
        setMissedVisit(res.results);
        setLoading(false);
        console.log('success');
      })
      .catch(err => {
        setLoading(false);
        console.log('the err is', err);
      });
  };

  // Get next 20 Missed Visits based on  start, limit set
  const getNextMissedVisits = (start: number, limit: number) => {
    console.log('start & limit :>> ', start, limit);
    setIsMissedVisitsLoading(true);
    HomeContoller.getMissedVisitAgenda(start, limit)
      .then(res => {
        console.log('the length is', missedVisits.length, res.results.length);
        setMissedVisit([...missedVisits, ...(res.results as never[])]);
        setIsMissedVisitsLoading(false);
        setLoading(false);
        console.log('success');
      })
      .catch(err => {
        setLoading(false);
        console.log('the err is', err);
      });
  };

  // Opening customer details modal
  const handleCustomerInfoModal = (data: any) => {
    setCustomerInfoVisible(true);
    setCustomerInfo(data);
  };

  // Closing customer details modal
  const hideCustomerDetails = () => {
    setCustomerInfoVisible(false);
  };

  // Navigating to customer landing screen after closing customer details modal
  const startVisitPressed = () => {
    hideCustomerDetails();
    if (customerInfo.status_type.toLowerCase() === 'p') {
      PLOverviewController.navigateToPLOverview(customerInfo);
    } else {
      navigation.navigate<any>(pageNameCLOverview, {
        customerInfo: {
          ...customerInfo,
        },
      });
    }
  };

  // Refreshing visits when user edit or delete the visit
  const refreshVisits = () => {
    setLoading(true);
    hideCustomerDetails();
    handleWorkflowCustomerProspectTaskSales();
  };

  // set visit status
  const handleVisitStatus = (val: string) => {
    setVisitStatus(val);
  };

  // Handle Sync ..
  const handleSync = () => {
    console.log('calling handle sync');
    if (ENABLE_USER_SWITCH) {
      setSelectUserModalVisible(true);
    } else {
      handleSelectUser();
    }
  };

  /**
   * once sync is done, set employee, sales rep, delegated obj
   * to global obj
   */
  const saveUserContext = (user: any) => {
    UserContextService.updateUserContext()
      .then(res => {
        dispatch(updateSelectedUserForSync({ selectedUserName: user.label }));
        dispatch(updateSyncStatus({ isInitialSyncDone: true }));
        setPreferredLanguage(selectedLanguage.language);
        console.log('User Context Saved');
        setIsSyncLoading(false);
        handleWorkflowCustomerProspectTaskSales();
        handleLanguageLoadFromDB();
      })
      .catch(err => {
        setIsSyncLoading(false);
        console.log('the err', err);
      });
  };

  // Updating flight mode
  const handleFlightMode = () => {
    UserContextService.updateFlightModeIntoReduxStore();
  };

  // Checking the sync status and navigating to visit screen
  const handleVisitNavigation = async () => {
    if (!isInitialSyncDone) {
      toast.info({
        message: 'Please sync the data first',
      });
      return;
    }
    navigation.navigate(pageNameVisits);
  };

  // Loading more missed visits on scroll to end
  const onEndReached = () => {
    if (
      visitStatus === VISIT_STATUS.MISSED &&
      missedVisits.length < missedVisitsCount
    ) {
      getNextMissedVisits(missedVisits.length, limit);
    }
  };

  // Opening select user modal for sync
  const closeSelectUserModal = () => {
    setSelectUserModalVisible(false);
  };

  // Importing data of the selected user and saving it to global obj
  const handleSelectUser = async (user?: any) => {
    setSelectUserModalVisible(false);
    try {
      setIsSyncLoading(true);
      dispatch(resetSyncState());

      const success = await ImportUtil.importDatabase(user);
      console.log('Success :>> ', success);

      if (!success) {
        setIsSyncLoading(false);
        toast.error({
          message: 'msg.createprospect.something_went_wrong',
        });
        return;
      }

      saveUserContext(user);
    } catch (error) {
      setIsSyncLoading(false);
      console.log('🚀 ~ file: Sync.tsx:83 ~ importData ~ error:', error);
    }
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      {loading ? (
        <HomeLoader />
      ) : (
        <View flex>
          <HomeHeader
            handleSync={handleSync}
            handleFlightMode={handleFlightMode}
          />
          <View
            marginH-v2
            marginB-v2
            style={tw(`flex-1 flex-row justify-between`)}>
            <View flex-3 marginR-v2>
              <Card cardStyle={{ flex: 1 }}>
                <View padding-v4 flex>
                  <TouchableWithoutFeedback onPress={handleVisitNavigation}>
                    <View row spread centerV paddingB-v4>
                      <Text textBlack text18M>
                        label.general.visits
                      </Text>
                      <images.ArrowRightIcon />
                    </View>
                  </TouchableWithoutFeedback>
                  <View row style={tw('border-light-quartz border-b-default')}>
                    <TopTabComponent
                      Icon={images.OpenIcon}
                      title={VISIT_STATUS.OPEN}
                      value={todaysVisits.open.length}
                      active={visitStatus === VISIT_STATUS.OPEN}
                      handleVisitStatus={handleVisitStatus}
                    />
                    <TopTabComponent
                      Icon={images.PausedIcon}
                      title={VISIT_STATUS.PAUSED}
                      value={todaysVisits.paused.length}
                      active={visitStatus === VISIT_STATUS.PAUSED}
                      handleVisitStatus={handleVisitStatus}
                    />
                    <TopTabComponent
                      Icon={images.CompletedIcon}
                      title={VISIT_STATUS.COMPLETED}
                      value={todaysVisits.completed.length}
                      active={visitStatus === VISIT_STATUS.COMPLETED}
                      handleVisitStatus={handleVisitStatus}
                    />
                    <TopTabComponent
                      Icon={images.MissedIcon}
                      title={VISIT_STATUS.MISSED}
                      value={missedVisitsCount}
                      active={visitStatus === VISIT_STATUS.MISSED}
                      handleVisitStatus={handleVisitStatus}
                    />
                  </View>
                  {data.length === 0 ? (
                    <NoDataComponent
                      title={
                        visitStatus === VISIT_STATUS.OPEN
                          ? 'msg.home.no_open_visits'
                          : visitStatus === VISIT_STATUS.PAUSED
                            ? 'msg.home.no_paused_visits'
                            : visitStatus === VISIT_STATUS.COMPLETED
                              ? 'msg.home.no_completed_visits'
                              : 'msg.home.no_missed_visits'
                      }
                    />
                  ) : (
                    <View marginT-v4 flex>
                      <FlatList
                        data={data}
                        style={tw('flex-1')}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          return (
                            <RenderVisits
                              item={item}
                              index={index}
                              visitStatus={visitStatus}
                              handleVisitPressed={() =>
                                handleCustomerInfoModal(item)
                              }
                            />
                          );
                        }}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                          <ListFooterComponent
                            isMissedVisitLoading={isMissedVisitLoading}
                            visitStatus={visitStatus}
                          />
                        }
                      />
                    </View>
                  )}
                </View>
              </Card>
            </View>
            <View flex>
              <View flex-4 marginB-v2>
                <RenderHomeCard
                  title="label.general.service_workflow"
                  subTitle1="label.home.assigned_to_me"
                  subTitle1Value={`${visits.serviceWorkflowAssignedByMeCount}`}
                  subTitle2="label.home.created_by_me"
                  subTitle2Value={`${visits.serviceWorkflowCreatedByMeCount}`}
                  VisitImage={images.ServiceWorkFlowCardIcon}
                  pageName={pageNameServiceWorkflow}
                  navigation={navigation}
                />
              </View>
              <View flex-4 marginB-v2>
                <RenderHomeCard
                  title="label.general.tasks"
                  subTitle1="label.general.completed"
                  subTitle1Value={`${visits.completedTasks}`}
                  subTitle2="label.home.valid"
                  subTitle2Value={`${visits.validOpenTasks}`}
                  VisitImage={images.TasksCardIcon}
                  pageName={pageNameTodaysTasks}
                  navigation={navigation}
                />
              </View>
              <View flex-5 marginB-v2>
                <RenderHomeCard
                  title="label.general.prospects"
                  delegation={`${visits.delegatedPropectVisitsCount}`}
                  subTitle1="label.general.to_visit"
                  subTitle1Value={`${visits.prospectsToVisitTodayCount}`}
                  subTitle2="label.general.active"
                  subTitle2Value={`${visits.prospectsActiveCount}`}
                  subTitle3="label.general.new_customer_req"
                  subTitle3Value={`${visits.prospectsNewCustomerRequestCount}`}
                  VisitImage={images.ProspectsCardIcon}
                  pageName={pageNameProspects}
                  navigation={navigation}
                />
              </View>
             
              <View flex-3 marginB-v2>
                <RenderHomeCard
                  title="label.general.customers"
                  delegation={`${visits.delegatedCustomerVisitsCount}`}
                  subTitle1="label.general.to_visit"
                  subTitle1Value={`${visits.customersToVisitTodayCount}`}
                  VisitImage={images.CustomersCardIcon}
                  navigation={navigation}
                  pageName={pageNameCustomerSearch}
                />
              </View>
              <View flex-3>
                <RenderHomeCard
                  title="label.general.sales_materials"
                  subTitle1="label.home.brochure"
                  subTitle1Value={`${visits.brochureCount}`}
                  VisitImage={images.SalesMaterialsCardIcon}
                  navigation={navigation}
                  pageName={pageNameSalesMaterials}
                />
              </View>
            </View>
          </View>
          <Modal
            visible={isSyncLoading}
            transparent={true}
            enableModalBlur={false}
            overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
            <View flex centerV centerH>
              <View
                style={tw('bg-light-white rounded-15px w-385px h-40')}
                centerV
                centerH
                padding-v1>
                {!totalFiles || !importMessage ? (
                  <Text text12M style={tw('text-center')}>
                    Setting up the sync...
                  </Text>
                ) : (
                  <>
                    <Text text12M black style={tw('text-center')}>
                      {`Syncing data... ${totalFilesImported}/${totalFiles}\n`}
                    </Text>
                    <Text text12R black style={tw('text-center')}>
                      {importMessage}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </Modal>
          <Modal
            visible={customerInfoVisible}
            transparent={true}
            enableModalBlur={false}
            overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
            <CustomerInfoModal
              data={customerInfo}
              onPress={hideCustomerDetails}
              startVisitPressed={startVisitPressed}
              refreshVisits={refreshVisits}
            />
          </Modal>
        </View>
      )}
      <SelectUserModal
        isModalVisible={selectUserModalVisible}
        onSelectUser={handleSelectUser}
        onPressCancel={closeSelectUserModal}
      />
    </SafeAreaView>
  );
};

export default Home;
