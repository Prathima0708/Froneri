import View from 'src/components/View';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { PROSPECT_LANDING_SCREENS } from 'src/utils/Constant';
import PLLeftMenuComponent from 'src/components/ProspectLanding/PLLeftMenuComponent/PLLeftMenuComponent';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import PLOverviewCardComponents from 'src/components/ProspectLanding/PLOverview/PLOverviewCardComponents';
import MessageModal from 'src/components/Common/MessageModal';
import PLUpcomingVisitModal from 'src/components/ProspectLanding/PLOverview/PLUpcomingVisitModal';
import { images } from 'src/assets/Images';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootState, useAppDispatch, useAppSelector } from 'src/reducers/hooks';
import { resetProspectLandingState, setProspectInfo } from 'src/reducers/ProspectLandingSlice';
import { getOnlyDate, getOnlyTime, getUUID } from 'src/utils/CommonUtil';
import PLOverviewController from 'src/controller/PLOverviewController';
import { toast } from 'src/utils/Util';
import OverviewLoader from 'src/components/SkeletonUi/CustomerLanding/OverviewLoader';
import VisitsController from 'src/controller/VisitsController';
import { VISITS_CALL_STATUS } from 'src/utils/DbConst';
import CLOverviewController from 'src/controller/CLOverviewController';
import { pageNamePLBasicInfo } from 'src/routes/Routes';
import VisitCardLoader from 'src/components/SkeletonUi/ProspectLanding/VisitCardLoader';
import UpcomingVisitComponent from 'src/components/CustomerLanding/CLOverview/UpcomingVisitComponent';
import PLNewCustomerController from 'src/controller/PLNewCustomerController';
import { withAuthScreen } from 'src/hoc/withAuthScreen';

const PLOverview = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const dispatch = useAppDispatch();
  const prospectInfoData = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );

  const [prospectInformation, setProspectInformation] = useState({
    address: "",
    phoneNumber: "",
    email: "",
  })
  const [isReactivate, setIsReactivate] = useState(false);
  const [prospectDetailsExpectedTurnoverAndEmployeeDetails, setProspectDetailsExpectedTurnoverAndEmployeeDetails] = useState({
    industryCode: "",
    customerHierarchy: "",
    fsr: "",
    priority: "",
    ice: "",
    frozenFood: "",
    frozenBakery: "",
    total: "",
    createdBy: "",
    createdDate: "",
    updatedBy: "",
    updatedDate: "",
    prospectNumber: "",
    externalProspectNumber: "",
    customerShipToNumber: "",
    previousCustomerShipToNumber: "",
  })

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
    visitNotes: '',
    idEmployeeObjective: -1,
  });

  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [upcomingVisitModalVisible, setUpcomingVisitModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(false)
  const [visitLoading, setVisitLoading] = useState(false)
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setLoading(true)
    checkAndStoreData();
  }, [])

  useEffect(() => {
    if (prospectInfoData?.discoveryId && prospectInfoData?.discoveryId !== "" && prospectInfoData?.statusType && prospectInfoData?.statusType.toLowerCase() === 'p') {
      console.log('prospectInfoData in overview :>> ', prospectInfoData);
      getScreenData()
    }
  }, [prospectInfoData?.discoveryId])


  const changeReactivateVal = (val: boolean) => {
    PLNewCustomerController.updateReactivateField().then(res => {
      console.log(res);
      setIsReactivate(val)
    })
      .catch(e => {
        toast.error({
          message: "Something went wrong"
        })
        console.log('reactivate error..', e)
        setIsReactivate(!val)
      });
  }

  const checkAndStoreData = () => {
    if (route.params?.data) {
      let prospectInfo = route.params.data;

      if (prospectInfo.discoveryId === "") {
        prospectInfo.discoveryId = getUUID();
      }

      dispatch(resetProspectLandingState());
      dispatch(setProspectInfo({ prospectInfo }))
      if (prospectInfo?.statusType.toLowerCase() === 'c') {
        navigation.replace(pageNamePLBasicInfo as never)
      }
    }
  }

  const getScreenData = async () => {
    await getProspectInformationData();
    await getProspectDetailsExpectedTurnoverAndEmployeeDetailsData();
    setLoading(false)
    if (
      prospectInfoData?.statusType &&
      prospectInfoData?.statusType.toLowerCase() === 'p'
    ) {
      setVisitLoading(true)
      await fetchVisits();
    }
  }

  const getProspectInformationData = async () => {
    try {
      const prospectInformationData = await PLOverviewController.getProspectInfo();
      console.log('prospectInformationData :>> ', prospectInformationData);
      if (prospectInformationData.length > 0) {
        setProspectInformation(prospectInformationData[0]);
        return
      }

      setProspectInformation({
        address: "",
        phoneNumber: "",
        email: "",
      })

    } catch (error) {
      console.log('error while fetching prospect information :>> ', error);

      toast.error({
        message: "Something went wrong"
      })

      setProspectInformation({
        address: "",
        phoneNumber: "",
        email: "",
      })
    }
  }

  const getProspectDetailsExpectedTurnoverAndEmployeeDetailsData = async () => {
    try {
      const data = await PLOverviewController.getProspectOrCustomerDetailsExpectedTurnoverAndEmployeeDetails();

      console.log('Prospect details data :>> ', data);

      let preparedData: any = {};

      if (data.length > 0) {
        const dataObj = data[0];

        preparedData = {
          industryCode: dataObj?.industryCode && dataObj?.industryCode.trim() ? dataObj?.industryCode : "",
          customerHierarchy: dataObj?.customerHierarchy && dataObj?.customerHierarchy.trim() ? dataObj?.customerHierarchy : "",
          fsr: dataObj?.fsr && dataObj?.fsr.trim() ? dataObj?.fsr : "",
          priority: dataObj?.priority && dataObj?.priority.trim() ? dataObj?.priority : "",
          ice: dataObj?.formattedIce && dataObj?.formattedIce.trim() ? dataObj?.formattedIce : "",
          frozenFood: dataObj?.formattedFrozenFood && dataObj?.formattedFrozenFood.trim() ? dataObj?.formattedFrozenFood : "",
          frozenBakery: dataObj?.formattedFrozenBakery && dataObj?.formattedFrozenBakery.trim() ? dataObj?.formattedFrozenBakery : "",
          total: dataObj?.formattedTotal && dataObj?.formattedTotal.trim() ? dataObj?.formattedTotal : "",
          createdBy: dataObj?.createdBy && dataObj?.createdBy.trim() ? dataObj?.createdBy : "",
          createdDate: dataObj?.createdDate && dataObj?.createdDate.trim() ? dataObj?.createdDate : "",
          updatedBy: dataObj?.updatedBy && dataObj?.updatedBy.trim() ? dataObj?.updatedBy : "",
          updatedDate: dataObj?.updatedDate && dataObj?.updatedDate.trim() ? dataObj?.updatedDate : "",
          prospectNumber: dataObj?.prospectNumber && dataObj?.prospectNumber.trim() ? dataObj?.prospectNumber : "",
          externalProspectNumber: dataObj?.formattedExternalProspectNumber && dataObj?.formattedExternalProspectNumber.trim() ? dataObj?.formattedExternalProspectNumber : "",
          customerShipToNumber: dataObj?.customerShipTo && dataObj?.customerShipTo.trim() ? dataObj?.customerShipTo : "",
          previousCustomerShipToNumber: dataObj?.previousCustomerShipTo && dataObj?.previousCustomerShipTo.trim() ? dataObj?.previousCustomerShipTo : "",
        }
      } else {

        preparedData = {
          industryCode: "",
          customerHierarchy: "",
          fsr: "",
          priority: "",
          ice: "",
          frozenFood: "",
          frozenBakery: "",
          total: "",
          createdBy: "",
          createdDate: "",
          updatedBy: "",
          updatedDate: "",
          prospectNumber: "",
          externalProspectNumber: "",
          customerShipToNumber: "",
          previousCustomerShipToNumber: "",
        }
      }

      setProspectDetailsExpectedTurnoverAndEmployeeDetails(preparedData)

      if (!prospectInfoData?.prospectNumber) {
        console.log('storing new prospect data :>> ', {
          ...prospectInfoData,
          prospectNumber: preparedData.prospectNumber
        });
        dispatch(setProspectInfo({
          prospectInfo: {
            ...prospectInfoData,
            prospectNumber: preparedData.prospectNumber
          }
        }))
      }
    } catch (error) {
      console.log('error while fetching prospect details :>> ', error);

      toast.error({
        message: "Something went wrong"
      })

      setProspectDetailsExpectedTurnoverAndEmployeeDetails({
        industryCode: "",
        customerHierarchy: "",
        fsr: "",
        priority: "",
        ice: "",
        frozenFood: "",
        frozenBakery: "",
        total: "",
        createdBy: "",
        createdDate: "",
        updatedBy: "",
        updatedDate: "",
        prospectNumber: "",
        externalProspectNumber: "",
        customerShipToNumber: "",
        previousCustomerShipToNumber: "",
      })
    }
  }

  const resetVisitInformation = () => {
    setVisitData({
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
      visitNotes: '',
      idEmployeeObjective: -1,
    })
    setShowButtons(false);
  }

  const fetchVisits = async () => {
    const isUpcomingVisit = !prospectInfoData?.idCall;
    try {
      const visitData = await PLOverviewController.getVisitData(isUpcomingVisit)
      console.log('visitData :>> ', visitData);

      if (visitData.length > 0) {
        let { showButtons, ...visitInformation } = visitData[0];

        setShowButtons(showButtons);

        setProspectInformation((prevProspectInformation: any) => {
          visitInformation.address = prevProspectInformation.address

          return ({
            ...prevProspectInformation,
          })
        })

        setVisitData(visitInformation);
        return
      }

      resetVisitInformation();
    } catch (error) {
      console.log('error while fetching visit data :>> ', error);

      toast.error({
        message: "Something went wrong"
      })

      resetVisitInformation();
    } finally {
      setVisitLoading(false)
    }
  }

  const handleOnPressYes = async () => {
    const isEventCreated = await PLNewCustomerController.createEvent()
    console.log('isEventCreated :>> ', isEventCreated);

    if (!isEventCreated) {
      toast.error({
        message: "Something went wrong"
      })
      return
    }

    const isNewCustomerRequestStatusUpdated = await PLNewCustomerController.updateNewCustomerRequestStatus()
    console.log('isNewCustomerRequestStatusUpdated :>> ', isNewCustomerRequestStatusUpdated);

    if (!isNewCustomerRequestStatusUpdated) {
      toast.error({
        message: "Something went wrong"
      })
      return
    }

    setMessageModalVisible(false);

    toast.success({
      message: "New Customer Creation Request sent successfully"
    })

  };

  const handleOnPressCancel = () => {
    setMessageModalVisible(false);
  };

  const handleUpcomingVisitModalBackPress = () => {
    setUpcomingVisitModalVisible(false);
  };

  const onVisitIconPress = () => {
    setUpcomingVisitModalVisible(true);
  };

  const onPressCustomerCreationReq = async () => {
    const isCustomerCreationRequestSent = await PLNewCustomerController.checkCustomerCreationRequestSent()

    if (isCustomerCreationRequestSent) {
      toast.error({
        message: "New customer creation has already been requested"
      })
      return;
    }

    const areMandatoryFieldsValid = await PLNewCustomerController.checkMandatoryFieldsData()
    console.log('areMandatoryFieldsValid :>> ', areMandatoryFieldsValid);

    if (!areMandatoryFieldsValid) {
      toast.error({
        message: "Please fill all the mandatory fields"
      })
      return;
    }

    const isSEPAValidated = await PLNewCustomerController.checkSEPAValidation()
    console.log('isSEPAValidated :>> ', isSEPAValidated);

    if (!isSEPAValidated) {
      toast.error({
        message: "Please sign SEPA before requesting\nfor a new customer creation"
      })
      return;
    }

    const taValidated = await PLNewCustomerController.checkTAValidation()
    console.log('taValidated :>> ', taValidated);

    if (!taValidated.status) {
      toast.error({
        message: taValidated.message
      })
      return;
    }

    const isConditionValidated = await PLNewCustomerController.checkConditionValidation()
    console.log('isConditionValidated :>> ', isConditionValidated);

    if (!isConditionValidated) {
      toast.error({
        message: "Open Text workflow is not requested for the TA\nAgreements/Condition Agreements to be transferred"
      })
      return;
    }

    setMessageModalVisible(true);
  };

  // Starting the visit
  const onStartButtonPress = () => {
    VisitsController.getOpenVisits()
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
          })
          return;
        }
        VisitsController.updateStartVisit(visitData.idCall)
          .then(() => {
            const visitCallStatus = VISITS_CALL_STATUS.OPEN;
            setVisitData({
              ...visitData,
              visitCallStatus,
            });
          })
          .catch(error => {
            toast.error({
              message: 'Something went wrong',
            })
            console.log('error while starting the prospect visit', error);
          });
      })
      .catch(error => {
        console.log('error while fetching the prospect open visits', error);
      });
  };

  // Pausing the visit
  const onPauseButtonPress = () => {
    CLOverviewController.pauseVisit(visitData.callPlaceNumber, visitData.idCall)
      .then(() => {
        toast.success({
          message: 'Visit paused successfully',
        })
        navigation.goBack()
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        })
        console.log('error while pausing the prospect visit :>> ', error);
      });
  };

  // Resuming the visit
  const onResumeButtonPress = () => {
    VisitsController.getOpenVisits()
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
          })
          return;
        }

        CLOverviewController.resumeVisit(visitData.idCall)
          .then(() => {
            const visitCallStatus = VISITS_CALL_STATUS.OPEN;
            setVisitData({
              ...visitData,
              visitCallStatus,
            });
          })
          .catch(error => {
            toast.error({
              message: 'Something went wrong',
            })
            console.log('error while resuming the prospect visit :>> ', error);
          });
      })
      .catch(error => {
        console.log('error while fetching the prospect open visits', error);
      });
  };

  // Finishing the visit
  const onFinishButtonPress = (
    fromModalButton: boolean = false,
  ) => {
    if (!fromModalButton) {
      setUpcomingVisitModalVisible(true);
      return;
    }

    let obj = {
      idCall: visitData.idCall,
      callFromDateTime: visitData.callFromDateTime,
      callToDateTime: visitData.callToDateTime,
      idEmployeeObjective: visitData.idEmployeeObjective,
      visitType: visitData.visitType,
      originalCallFromDateTime: visitData.callFromDateTime,
      originalCallToDateTime: visitData.callToDateTime,
      visitPreparationNotes: visitData.visitNotes,
      preferedCallTime: visitData.visitStartTime.replace(':', ''),
    };

    VisitsController.updateEditVisit(obj)
      .then(() => {
        CLOverviewController.checkOrderLinkWithFinishVisit(visitData.idCall)
          .then((isOrderLinked: boolean) => {
            if (!isOrderLinked) {
              toast.info({
                message: 'Orders associated to the visit is in paused status',
              })
              return;
            }

            CLOverviewController.finishVisit(visitData.idCall)
              .then(() => {
                setUpcomingVisitModalVisible(false);
                toast.success({
                  message: 'Visit finished successfully',
                })
                navigation.goBack()

              })
              .catch(error => {
                toast.error({
                  message: 'Something went wrong',
                })
                console.log('error while finishing the prospect visit :>> ', error);
              });
          })
          .catch(error => {
            toast.error({
              message: 'Something went wrong',
            })
            console.log('error while checking the linked orders of prospect :>> ', error);
          });
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        })
        console.log('Error while updating the visit', err);
      });
  };

  return <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
    {loading ? (
      <OverviewLoader />
    ) :
      (
        <>
          <ProspectLandingHeader
            screen="PLOverview"
            isReactivate={isReactivate}
            onChangeReactivate={changeReactivateVal}
            onPressCustomerCreationReq={onPressCustomerCreationReq}
            fromPLP={true}
          />
          <View flex row>
            <PLLeftMenuComponent activeTab={PROSPECT_LANDING_SCREENS.OVERVIEW} />
            <View flex marginR-v2 marginB-v2 row>
              <View flex>
                {prospectInfoData?.statusType && prospectInfoData?.statusType.toLowerCase() === "p"
                  && <PLOverviewCardComponents
                    header="Prospect Information"
                    title1="Address"
                    title2="Phone Number"
                    title3="Email"
                    data1={prospectInformation.address || "--"}
                    data2={prospectInformation.phoneNumber || "--"}
                    data3={prospectInformation.email || "--"}
                    isData1Copyable={true}
                    isData2Copyable={true}
                    isData3Copyable={true}
                  />}
                <PLOverviewCardComponents
                  header="Prospect Details"
                  title1="Industry Code"
                  title2="Customer Hierarchy"
                  title3="FSR"
                  title4="Priority"
                  data1={prospectDetailsExpectedTurnoverAndEmployeeDetails.industryCode || "--"}
                  data2={prospectDetailsExpectedTurnoverAndEmployeeDetails.customerHierarchy || "--"}
                  data3={prospectDetailsExpectedTurnoverAndEmployeeDetails.fsr || "--"}
                  data4={prospectDetailsExpectedTurnoverAndEmployeeDetails.priority || "--"}
                  marginNotNeeded={prospectInfoData?.statusType && prospectInfoData?.statusType.toLowerCase() === "c"}
                />
                <PLOverviewCardComponents
                  header="Expected Turnover"
                  title1="ICE"
                  title2="Frozen Food"
                  title3="Frozen Bakery"
                  title4="Total"
                  data1={prospectDetailsExpectedTurnoverAndEmployeeDetails.ice}
                  data2={prospectDetailsExpectedTurnoverAndEmployeeDetails.frozenFood}
                  data3={prospectDetailsExpectedTurnoverAndEmployeeDetails.frozenBakery}
                  data4={prospectDetailsExpectedTurnoverAndEmployeeDetails.total}
                />
              </View>
              <View flex marginL-v2>
                {visitLoading ?
                  <VisitCardLoader /> :
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
                }
                <PLOverviewCardComponents
                  header="Employee Details"
                  title1="Created By"
                  title2="Created Date"
                  title3="Updated By"
                  title4="Updated Date"
                  data1={prospectDetailsExpectedTurnoverAndEmployeeDetails.createdBy || "--"}
                  data2={prospectDetailsExpectedTurnoverAndEmployeeDetails.createdDate || "--"}
                  data3={prospectDetailsExpectedTurnoverAndEmployeeDetails.updatedBy || "--"}
                  data4={prospectDetailsExpectedTurnoverAndEmployeeDetails.updatedDate || "--"}
                />
                <PLOverviewCardComponents
                  header="Prospect & Customer Numbers"
                  title1="Prospect Number"
                  title2="External Prospect Number"
                  title3="Customer Ship To Number"
                  title4="Previous Customer Ship To Number"
                  data1={prospectDetailsExpectedTurnoverAndEmployeeDetails.prospectNumber || "--"}
                  data2={prospectDetailsExpectedTurnoverAndEmployeeDetails.externalProspectNumber || "--"}
                  data3={prospectDetailsExpectedTurnoverAndEmployeeDetails.customerShipToNumber || "--"}
                  data4={prospectDetailsExpectedTurnoverAndEmployeeDetails.previousCustomerShipToNumber || "--"}
                  isData1Copyable
                  isData2Copyable
                  isData3Copyable
                  isData4Copyable
                />
              </View>
            </View>
            <PLUpcomingVisitModal
              isVisible={upcomingVisitModalVisible}
              handleBack={handleUpcomingVisitModalBackPress}
              data={visitData}
              setData={setVisitData}
              onFinishButtonPress={onFinishButtonPress}
            />
            <MessageModal
              isVisible={messageModalVisible}
              title={`Send Prospect to\nCustomer Creation Request?`}
              subTitle={`Please confirm to send the prospect for new\ncustomer creation request`}
              primaryButtonText="Yes, Send"
              secondaryButtonText="Cancel"
              handleOnPressSuccess={handleOnPressYes}
              handleOnPressCancel={handleOnPressCancel}
              icon={<images.MessageIcon />}
            />
          </View>
        </>
      )}
  </SafeAreaView>
};

export default withAuthScreen(PLOverview, true);
