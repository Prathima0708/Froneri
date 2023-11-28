import React, { FC, useEffect, useState } from 'react';
import { BackHandler, SafeAreaView } from 'react-native';
import View from 'src/components/View';
import { tw } from 'src/tw';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { PrivateStackParamList } from 'src/routes/types';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import CLLeftMenuComponent from 'src/components/CustomerLanding/CLLeftMenuComponent';
import CustomerInfoComponent from 'src/components/CustomerLanding/CLOverview/CustomerInfoComponent';
import ContactComponent from 'src/components/CustomerLanding/CLOverview/ContactComponent';
import TurnOverLastOrderComponent from 'src/components/CustomerLanding/CLOverview/TurnOverLastOrderComponent';
import UpcomingVisitComponent from 'src/components/CustomerLanding/CLOverview/UpcomingVisitComponent';
import TaskServiceTASalesComponent from 'src/components/CustomerLanding/CLOverview/TaskServiceTASalesComponent';
import { CUSTOMER_LANDING_SCREENS } from 'src/utils/Constant';
import CLOverviewController from 'src/controller/CLOverviewController';
import { RootState, useAppDispatch, useAppSelector } from 'src/reducers/hooks';
import {
  resetCustomerLandingState,
  setContactsInfo,
  setCustomerInfo,
  setUpcomingVisitIdCall,
} from 'src/reducers/CustomerLandingSlice';
import { VISITS_CALL_STATUS } from 'src/utils/DbConst';
import VisitsContoller from 'src/controller/VisitsController';
import VisitInfoUpcomingVisitModal from 'src/components/CustomerLanding/CLVisitInfo/VisitInfoUpcomingVisit/VisitInfoUpcomingVisitModal';
import * as ROUTES from 'src/routes/Routes';
import ApiUtil from 'src/services/ApiUtil';
import { getOnlyDate, getOnlyTime } from 'src/utils/CommonUtil';
import { toast } from 'src/utils/Util';
import PLOverviewController from 'src/controller/PLOverviewController';
import OverviewLoader from 'src/components/SkeletonUi/CustomerLanding/OverviewLoader';

type CustomersProp = StackNavigationProp<PrivateStackParamList>;

const CLOverview: FC = () => {
  const navigation = useNavigation<CustomersProp>();
  const { params } = useRoute<any>();

  const [isCustomerOnVacation, setIsCustomerOnVacation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [visitNotesModalVisible, setVisitNotesModalVisible] = useState(false);

  const [tasks, setTasks] = useState(0);
  const [serviceWorkflow, setServiceWorkflow] = useState(0);
  const [tradeAssetsAmount, setTradeAssetsAmount] = useState(0);
  const [salesMaterial, setSalesMaterial] = useState(0);

  const [turnoverDetails, setTurnoverDetails] = useState({
    ytdCY: '',
    ytdLY: '',
    totalLY: '',
    growthCHF: '',
    growthPercentage: '',
  });
  const [lastOrderDetails, setLastOrderDetails] = useState({
    creationDatetime: '',
    deliveryDatetime: '',
    originOrder: '',
    netAmount: '',
  });
  const [visitData, setVisitData] = useState({
    name1: '',
    name2: '',
    name3: '',
    address: '',
    visitDate: '',
    visitDateFull: '',
    visitStartTime: '',
    visitEndTime: '',
    visitDuration: '',
    visitObjective: '',
    visitCallStatus: '',
    visitType: '',
    callPlaceNumber: '',
    idCall: '',
    callFromDateTime: '',
    callToDateTime: '',
    idEmployeeObjective: -1,
  });

  const [vacationDate, setVacationDate] = useState('');
  const [visitPreparationNotes, setVisitPreparationNotes] = useState('');
  const [message, setMessage] = useState<string>('');

  const [contactsData, setContactsData] = useState<any>([])

  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );

  const customerInfo = params?.customerInfo
    ? params?.customerInfo
    : customerInfoData;
  const fromCustomerSearch = !customerInfo?.id_call;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (customerInfo) {
      fetchCustomerInfo();
    }
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (customerInfoData?.contact1Name) {
      fetchContacts();
    }
  }, [customerInfoData])

  useEffect(() => {
    checkConnectionAndGetData();
  }, [customerInfoData.isCallApi]);

  // In case of remote customer, we need to check if the app and device is online or not
  const checkConnectionAndGetData = async () => {
    if (customerInfoData.isCallApi) {
      const isOnline = await ApiUtil.getAppDeviceOnlineStatus();

      if (!isOnline.status) {
        setLoading(false);
        setMessage(isOnline.errMsg);
        return;
      }

      setMessage('');
      fetchCLData();
    }
  };

  // Fetch all the data for customer landing overview page
  const fetchCLData = () => {
    setLoading(true);
    checkCustomerOnVacation();
    fetchVisits();
    fetchTurnover();
    fetchSalesMaterialsInfo();
    fetchTasksListing();
    fetchServiceWorkflows();
    fetchLastOrder();
  };

  // Fetch the customer info from the database
  const fetchCustomerInfo = () => {
    setLoading(true);
    CLOverviewController.getCustomerInfo(customerInfo)
      .then(customers => {
        // If no data found, then it's a remote customer
        const isRemoteCustomer = customers.length <= 0;

        // TODO: How to set the trade assets amount value for remote customer
        if (isRemoteCustomer) {
          setCustomerObjAndCallApi(customerInfo, true);
        } else {
          setTradeAssetsAmount(customers[0].tradeAssetsAmount);
          const customerData = {
            ...customers[0],
            ...customerInfo,
          };
          setCustomerObjAndCallApi(customerData, false);
        }
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('🚀 ~ file: CLOverview.tsx:74 ~ ).then ~ error:', error);
      });
  };

  // Setting the customer info object in redux and calling the api
  const setCustomerObjAndCallApi = (customerObj: any, isCallApi: boolean) => {
    const customerInfoObj = {
      ...customerObj,
      fromCustomerSearch,
      isCallApi,
    };
    console.log(
      'Is remote customer?',
      isCallApi,
      'customerInfoObj :>> ',
      customerInfoObj,
    );
    dispatch(resetCustomerLandingState());
    dispatch(setCustomerInfo({ customerInfo: customerInfoObj }));
    if (isCallApi) {
      checkConnectionAndGetData();
      return;
    }
    fetchCLData();
  };

  // Checking if the customer is on vacation or not
  const checkCustomerOnVacation = () => {
    CLOverviewController.isCustomerOnVacation(customerInfo)
      .then(customerVacationResult => {
        if (customerVacationResult) {
          setIsCustomerOnVacation(true);
          setVacationDate(customerVacationResult.endVacationDateTime);
        } else {
          setIsCustomerOnVacation(false);
        }
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('🚀 ~ file: CLOverview.tsx:66 ~ ).then ~ error:', error);
      });
  };

  /**
   * Fetching the visits for the customer
   *
   * if fromCustomerSearch is true, then we need to fetch the upcoming visit information
   * else we need to fetch the current visit information
   *
   * and add the visit information in the redux
   */
  const fetchVisits = () => {
    CLOverviewController.getVisit(customerInfo, fromCustomerSearch)
      .then((visitInformation: any) => {
        console.log('new visit information data :>> ', visitInformation);
        if (visitInformation.length <= 0) {
          setShowButtons(false);
          return;
        }

        const { visitNotes, showButtons, ...visitData } = visitInformation[0];

        setVisitData(visitData);
        setVisitPreparationNotes(visitNotes);
        setShowButtons(showButtons);
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('error while fetching visit information :>> ', error);
      });
  };

  // Fetching the contacts data of the customer
  const fetchContacts = () => {
    CLOverviewController.getContacts(customerInfo)
      .then(contacts => {
        console.log('contacts :>> ', contacts);

        let contactsData = []
        if (contacts.length > 0) {
          const contactsObj = contacts[0]

          const title = contactsObj.title ? contactsObj.title.trim() : '';
          const firstName = contactsObj.firstName ? contactsObj.firstName.trim() : '';
          const lastName = contactsObj.lastName ? contactsObj.lastName.trim() : '';
          const name = title + ' ' + firstName + ' ' + lastName;

          contactsData.push({
            name: name,
            phoneNumber: contactsObj.phoneNumber ? contactsObj.phoneNumber.trim() : '--',
            mobileNumber: contactsObj.mobileNumber ? contactsObj.mobileNumber.trim() : '--',
          })
        }

        contactsData.push({
          name: customerInfoData?.contact1Name ? customerInfoData?.contact1Name.trim() : '--',
          phoneNumber: customerInfoData?.contact1Phone1 ? customerInfoData?.contact1Phone1.trim() : '--',
          mobileNumber: customerInfoData?.contact1Phone2 ? customerInfoData?.contact1Phone2.trim() : '--',
        })

        setContactsData(contactsData)
        dispatch(setContactsInfo({ contactsInfo: contacts }));
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log(
          '🚀 ~ file: CLOverview.tsx:100 ~ CLOverviewController.getContacts ~ error:',
          error,
        );
      });
  };

  // Fetching the turnover data of the customer
  const fetchTurnover = () => {
    CLOverviewController.getTurnover(customerInfo)
      .then((turnoverInformation: any) => {
        console.log('turnoverInformation :>> ', turnoverInformation);
        setTurnoverDetails(turnoverInformation);
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log(
          '🚀 ~ file: CLOverview.tsx:85 ~ CLOverviewController.getTurnover ~ error:',
          error,
        );
      });
  };

  // Fetching the last order information of the customer
  const fetchLastOrder = () => {
    CLOverviewController.getLastOrder(customerInfo)
      .then((orderDetails: any) => {
        console.log('orderDetails :>> ', orderDetails);
        setLastOrderDetails(orderDetails);
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('🚀 ~ file: CLOverview.tsx:95 ~ .then ~ error:', error);
      })
      .finally(() => setLoading(false));
  };

  // Fetching the tasks count of the customer
  const fetchTasksListing = () => {
    CLOverviewController.getTasksListing(customerInfo)
      .then(tasksCount => {
        console.log('tasksCount :>> ', tasksCount);
        setTasks(tasksCount);
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('🚀 ~ file: CLOverview.tsx:135 ~ ).then ~ error:', error);
      });
  };

  // Fetching the service workflow count of the customer
  const fetchServiceWorkflows = () => {
    CLOverviewController.getServiceWorkflow(customerInfo)
      .then(serviceWorkflowCount => {
        console.log('serviceWorkflowCount :>> ', serviceWorkflowCount);
        setServiceWorkflow(serviceWorkflowCount);
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('🚀 ~ file: CLOverview.tsx:146 ~ ).then ~ error:', error);
      });
  };

  // Fetching the sales material count of the customer
  const fetchSalesMaterialsInfo = () => {
    CLOverviewController.getSalesMaterialBrochureCount(customerInfo)
      .then(salesMaterialCount => {
        console.log('salesMaterialCount :>> ', salesMaterialCount);
        setSalesMaterial(salesMaterialCount);
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log(
          '🚀 ~ file: CLOverview.tsx:155 ~ CLOverviewController.getSalesMaterialBrochureCount ~ error:',
          error,
        );
      });
  };

  // Starting the visit
  const onStartButtonPress = () => {
    VisitsContoller.getOpenVisits()
      .then(visits => {
        console.log('getOpenVisits', visits);
        if (visits.length > 0 && visits[0].idCall !== visitData.idCall) {
          let inProgressVisitDate = visits[0].callFromDatetime
            ? getOnlyDate(visits[0].callFromDatetime)
            : '';

          let inProgressVisitTime = visits[0].callFromDatetime
            ? getOnlyTime(visits[0].callFromDatetime)
            : '';

          toast.info({
            message: `A visit is already in progress on date ${inProgressVisitDate} and time ${inProgressVisitTime}.\nPlease finish or pause it before starting a new one.`,
            duration: 6000,
          });
          return;
        }
        VisitsContoller.updateStartVisit(visitData.idCall)
          .then(res => {
            console.log('Visit started successfully');
            const visitCallStatus = VISITS_CALL_STATUS.OPEN;
            if (fromCustomerSearch) {
              dispatch(
                setUpcomingVisitIdCall({ upcomingVisitIdCall: visitData.idCall }),
              );
            }
            setVisitData({
              ...visitData,
              visitCallStatus,
            });
          })
          .catch(err => {
            toast.error({
              message: 'Something went wrong',
            });
            console.log('error while starting the visit', err);
          });
      })
      .catch(error => {
        console.log('error while fetching the open visits', error);
      });
  };

  // Pausing the visit
  const onPauseButtonPress = () => {
    CLOverviewController.pauseVisit(visitData.callPlaceNumber, visitData.idCall)
      .then(() => {
        navigation.goBack();
        toast.success({
          message: 'Visit paused successfully',
        });
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('error while pausing the visit :>> ', error);
      });
  };

  // Resuming the visit
  const onResumeButtonPress = () => {
    VisitsContoller.getOpenVisits()
      .then(visits => {
        if (visits.length > 0 && visits[0].idCall !== visitData.idCall) {
          let inProgressVisitDate = visits[0].callFromDatetime
            ? getOnlyDate(visits[0].callFromDatetime)
            : '';

          let inProgressVisitTime = visits[0].callFromDatetime
            ? getOnlyTime(visits[0].callFromDatetime)
            : '';

          toast.info({
            message: `A visit is already in progress on date ${inProgressVisitDate} and time ${inProgressVisitTime}.\nPlease finish or pause it before starting a new one.`,
            duration: 6000,
          });
          return;
        }

        CLOverviewController.resumeVisit(visitData.idCall)
          .then(() => {
            console.log('Visit resumed successfully');
            const visitCallStatus = VISITS_CALL_STATUS.OPEN;
            setVisitData({
              ...visitData,
              visitCallStatus,
            });
          })
          .catch(error => {
            toast.error({
              message: 'Something went wrong',
            });
            console.log('error while resuming the visit :>> ', error);
          });
      })
      .catch(error => {
        console.log('error while fetching the open visits', error);
      });
  };

  /**
   * Finishing the Visit
   *
   * Before finishing the visit, we need to check the visit preparation notes and the linked orders
   * @param visitNote
   * parameter is needed because visitPreparationNotes state is not updating immediately
   */
  const onFinishButtonPress = (fromModalButton: boolean = false) => {
    if (!fromModalButton) {
      setVisitNotesModalVisible(true);
      return;
    }

    CLOverviewController.checkOrderLinkWithFinishVisit(visitData.idCall)
      .then((isOrderLinked: boolean) => {
        if (!isOrderLinked) {
          toast.info({
            message: 'Orders associated to the visit is in paused status',
          });
          return;
        }

        CLOverviewController.finishVisit(visitData.idCall)
          .then(() => {
            setVisitNotesModalVisible(false);
            navigation.goBack();

            toast.success({
              message: 'Visit finished successfully',
            });
          })
          .catch(error => {
            toast.error({
              message: 'Something went wrong',
            });
            console.log('error while finishing the visit :>> ', error);
          });
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('error while checking the linked orders :>> ', error);
      });
  };

  // Hiding the visit notes modal when back button is pressed
  const onBackPress = () => {
    setVisitNotesModalVisible(false);
  };

  // Updating the visit preparation notes and finishing the visit
  const onFinishVisitPress = (
    visitNote: string,
    idEmployeeObjective: number,
  ) => {
    setVisitPreparationNotes(visitNote);
    const idCall = visitData.idCall;
    const callFromDateTime = visitData.callFromDateTime;
    const callToDateTime = visitData.callToDateTime;

    let obj = {
      idCall,
      callFromDateTime,
      callToDateTime,
      idEmployeeObjective,
      visitType: visitData.visitType,
      originalCallFromDateTime: callFromDateTime,
      originalCallToDateTime: callToDateTime,
      visitPreparationNotes: visitNote,
      preferedCallTime: visitData.visitStartTime.replace(':', ''),
    };

    console.log('the obj to update is', obj);
    VisitsContoller.updateEditVisit(obj)
      .then(() => {
        onFinishButtonPress(true);
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('Error while updating the visit', err);
      });
  };

  const onContactIconPress = () => {
    navigation.dispatch(
      StackActions.replace(ROUTES.pageNameCLContacts as never),
    );
  };

  const onTurnoverIconPress = () => {
    navigation.dispatch(
      StackActions.replace(ROUTES.pageNameCLTurnover as never),
    );
  };

  const onLastOrderIconPress = () => {
    navigation.dispatch(
      StackActions.replace(ROUTES.pageNameCLOrderHistory as never),
    );
  };

  const onVisitIconPress = () => {
    navigation.dispatch(
      StackActions.replace(ROUTES.pageNameCLVisitInfo as never),
    );
  };

  const onTasksIconPress = () => {
    navigation.dispatch(StackActions.replace(ROUTES.pageNameCLTasks as never));
  };

  const onServiceWorkflowIconPress = () => {
    navigation.dispatch(
      StackActions.replace(ROUTES.pageNameCLServiceWorkflow as never),
    );
  };

  const onTradeAssetIconPress = () => {
    navigation.dispatch(
      StackActions.replace(ROUTES.pageNameCLTradeAsset as never),
    );
  };

  const onSalesMaterialIconPress = () => {
    navigation.dispatch(
      StackActions.replace(ROUTES.pageNameCLSalesMaterials as never),
    );
  };

  const onCrmButtonPress = () => {
    PLOverviewController.navigateToPLOverview(customerInfoData)
  }

  return loading ? (
    <OverviewLoader />
  ) : (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <CustomerLandingHeader
        message={message}
        screen={ROUTES.pageNameCLOverview}
      />
      <View flex row>
        <CLLeftMenuComponent activeTab={CUSTOMER_LANDING_SCREENS.OVERVIEW} />
        <View flex marginR-v2 marginB-v2 row>
          <View flex>
            <CustomerInfoComponent
              vacationDate={vacationDate}
              isOnVacation={isCustomerOnVacation}
              isNewOrder={false}
              onCrmButtonPress={onCrmButtonPress}
            />
            <ContactComponent
              {...{ contactsData, onRightIconPress: onContactIconPress }}
            />
            <TurnOverLastOrderComponent
              mainTitle="label.general.turnover"
              title1="label.general.ytd_cy"
              title2="label.general.ytd_ly"
              title3="label.general.growth_chf"
              title4="label.general.growth"
              title4AdditionalText="%"
              value1={turnoverDetails.ytdCY}
              value2={turnoverDetails.ytdLY}
              value3={turnoverDetails.growthCHF}
              value4={turnoverDetails.growthPercentage}
              onRightIconPress={onTurnoverIconPress}
            />
            <TurnOverLastOrderComponent
              mainTitle="label.general.last_order"
              title1="label.general.creation"
              title2="label.general.delivery"
              title3="label.general.origin"
              title4="label.general.net_amount"
              value1={lastOrderDetails.creationDatetime}
              value2={lastOrderDetails.deliveryDatetime}
              value3={lastOrderDetails.originOrder}
              value4={lastOrderDetails.netAmount}
              onRightIconPress={onLastOrderIconPress}
            />
          </View>
          <View flex>
            <UpcomingVisitComponent
              {...{
                visitDate: visitData.visitDate,
                visitStartTime: visitData.visitStartTime,
                visitEndTime: visitData.visitEndTime,
                duration: visitData.visitDuration,
                visitObjective: visitData.visitObjective,
                showButtons: showButtons,
                visitCallStatus: visitData.visitCallStatus,
                onStartButtonPress,
                onPauseButtonPress,
                onResumeButtonPress,
                onFinishButtonPress,
                onRightIconPress: onVisitIconPress,
              }}
            />
            <TaskServiceTASalesComponent
              title="label.general.tasks"
              count={tasks}
              onRightIconPress={onTasksIconPress}
            />
            <TaskServiceTASalesComponent
              title="label.general.service_workflow"
              count={serviceWorkflow}
              onRightIconPress={onServiceWorkflowIconPress}
            />
            <TaskServiceTASalesComponent
              title="label.general.trade_assets"
              count={tradeAssetsAmount}
              onRightIconPress={onTradeAssetIconPress}
            />
            <TaskServiceTASalesComponent
              title="label.general.sales_materials"
              count={salesMaterial}
              onRightIconPress={onSalesMaterialIconPress}
            />
          </View>
        </View>
      </View>
      <VisitInfoUpcomingVisitModal
        {...{
          isVisible: visitNotesModalVisible,
          onBackPress,
          fromCustomerSearch,
          name1: visitData.name1,
          name2: visitData.name2,
          name3: visitData.name3,
          address: visitData.address,
          visitDate: visitData.visitDateFull,
          visitStartTime: visitData.visitStartTime,
          visitEndTime: visitData.visitEndTime,
          visitObjective: visitData.visitObjective,
          callStatus: visitData.visitCallStatus,
          visitType: visitData.visitType,
          idEmployeeObjective: visitData.idEmployeeObjective,
          visitPreparationMessage:
            'Please add visit preparation notes to finish the visit',
          onFinishBtnPress: onFinishVisitPress,
          isEdit: true,
          fromCLOverview: true,
          visitPreparationNotes,
        }}
      />
    </SafeAreaView>
  );
};

export default CLOverview;
