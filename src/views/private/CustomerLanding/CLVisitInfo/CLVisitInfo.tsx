import View from 'src/components/View';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import CLLeftMenuComponent from 'src/components/CustomerLanding/CLLeftMenuComponent';
import { CUSTOMER_LANDING_SCREENS } from 'src/utils/Constant';
import CLVisitInfoController from 'src/controller/CLVisitInfoController';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import CRCAComponent from 'src/components/CustomerLanding/CLVisitInfo/CRCA/CRCAComponent';
import TurnoverFutureInfoComponent from 'src/components/CustomerLanding/CLVisitInfo/TurnoverFutureInfo/TurnoverFutureInfoComponent';
import VisitInfoUpcomingVisitModal from 'src/components/CustomerLanding/CLVisitInfo/VisitInfoUpcomingVisit/VisitInfoUpcomingVisitModal';
import UpcomingAndLastVisitComponent from 'src/components/CustomerLanding/CLVisitInfo/UpcomingAndLastVisitComponent';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import VisitsContoller from 'src/controller/VisitsController';
import {
  formatDateReverse,
  getDateWithMonthName,
  getDuration,
  getOnlyTime,
} from 'src/utils/CommonUtil';
import CLOverviewController from 'src/controller/CLOverviewController';
import { VISITS_CALL_STATUS } from 'src/utils/DbConst';
import ApiUtil from 'src/services/ApiUtil';
import { toast } from 'src/utils/Util';

const CLVisitInfo = () => {
  const [loading, setLoading] = useState(false);
  // CRCA states..
  const [openingHours, setOpeningHours] = useState([]);
  const [visitingHours, setVisitingHours] = useState([]);
  const [backgroundBarHours, setBackgroundBarHours] = useState([]);
  //
  const [nextTenVisits, setNextTenVisits] = useState([]);
  const [nextTenDeliveries, setNextTenDeliveries] = useState([]);
  const [latestTwoVisitNotes, setLatestTwoVisitNotes] = useState([]);
  const [visitModalVisible, setVisitModalVisible] = useState(false);
  const [isLastVisit, setIsLastVisit] = useState(false);

  // For last visit
  const [lastVisitInfo, setLastVisitInfo] = useState<any>({
    visitDate: '',
    visitDateFull: '',
    visitStartTime: '',
    visitEndTime: '',
    visitDuration: '',
    visitObjective: '',
    visitType: '',
    visitPreparationNotes: '',
    visitCallStatus: '',
  });

  // For modal data
  const [visitData, setVisitData] = useState<any>({
    visitDate: '',
    visitDateFull: '',
    visitStartTime: '',
    visitDuration: '',
    visitEndTime: '',
    visitObjective: '',
    visitType: '',
    visitPreparationNotes: '',
    isPausedVisit: false,
  });

  // For upcoming/current visit
  const [visitInfoData, setVisitInfoData] = useState<any>({
    idCall: '',
    visitDate: '',
    visitDateFull: '',
    visitStartTime: '',
    visitDuration: '',
    visitEndTime: '',
    visitObjective: '',
    visitType: '',
    visitPreparationNotes: '',
    callFromDateTime: '',
    callToDateTime: '',
    idEmployeeObjective: '',
    visitCallStatus: '',
    name1: '',
    name2: '',
    name3: '',
    address: '',
    isPausedVisit: false,
  });

  const [cardName, setCardName] = useState('');
  const [message, setMessage] = useState<string>('');

  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );

  const fromCustomerSearch = customerInfoData?.fromCustomerSearch;

  useEffect(() => {
    console.log('visitInfoData :>> ', visitInfoData);
    getCLInfoData();
  }, []);

  useEffect(() => {
    getLastVisit();
  }, [visitInfoData]);

  const handleModal = (fromLastVisit: boolean) => {
    if (fromLastVisit) {
      setCardName('lastVisit');
      setVisitData(lastVisitInfo);
    } else {
      setCardName('');
      setVisitData(visitInfoData);
    }
    setIsLastVisit(fromLastVisit);

    setVisitModalVisible(true);
  };

  const handleBackPress = () => {
    setVisitModalVisible(false);
  };

  const checkConnectionAndGetData = async () => {
    if (customerInfoData.isCallApi) {
      const isOnline = await ApiUtil.getAppDeviceOnlineStatus();

      if (!isOnline.status) {
        setLoading(false);
        setMessage(isOnline.errMsg);
        return;
      }

      setMessage('');
      getRemoteAndLocalData();
    } else {
      getRemoteAndLocalData();
    }
  };

  const getCLInfoData = () => {
    setLoading(true);
    getCRCAInfo();
    getVisitsInfo();
    checkConnectionAndGetData();
  };

  const getRemoteAndLocalData = () => {
    getNextVisits();
    getVisitNotes();
  };

  const getCRCAInfo = () => {
    // get the CRCA Info always from local db
    CLVisitInfoController.getCRCAInformation()
      .then(async (crcaInfo: any) => {
        const openingHours = crcaInfo.openingHours ? crcaInfo.openingHours : '';
        let opening: any = [];
        if (openingHours.length === 168) {
          opening = await CLVisitInfoController.getOpeningAndVisitingHours(
            openingHours,
          );
        }

        const visitingHours = crcaInfo.visitingHours
          ? crcaInfo.visitingHours
          : '';
        let visiting: any = [];
        if (visitingHours.length === 168) {
          visiting = await CLVisitInfoController.getOpeningAndVisitingHours(
            visitingHours,
          );
        }

        let backgroundHouring = [];
        if (opening.length != 0 || visiting != 0) {
          backgroundHouring = await CLVisitInfoController.getbackgroundBarHours(
            opening,
            visiting,
          );
        }
        if (crcaInfo.deliveryDays) {
          getNextDeliveries(crcaInfo.deliveryDays);
        }

        console.log('crcaInfo', crcaInfo);
        setBackgroundBarHours(backgroundHouring);
        setOpeningHours(opening);
        setVisitingHours(visiting);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLVisitInfo.tsx:28 ~ CLVisitInfoController.getCRCAInformation ~ error:',
          error,
        );
      });
  };

  const getVisitsInfo = () => {
    CLOverviewController.getVisit(customerInfoData, fromCustomerSearch)
      .then((visitInformation: any) => {
        console.log('new visit information data :>> ', visitInformation);
        if (visitInformation.length <= 0) {
          return;
        }

        const { visitNotes, showButtons, ...visitData } = visitInformation[0];

        visitData.visitPreparationNotes = visitNotes;
        visitData.isPausedVisit =
          visitData.visitCallStatus === VISITS_CALL_STATUS.ONHOLD;

        console.log('visit info visitData :>> ', visitData);

        setVisitInfoData(visitData);
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        })
        console.log('error while fetching visit information :>> ', error);
      });
  };

  const getLastVisit = () => {
    const idCall = visitInfoData?.idCall ? visitInfoData?.idCall : '';

    CLVisitInfoController.getLastVisitInfo(idCall)
      .then(lastVisit => {
        console.log('lastVisit :>> ', lastVisit);
        if (lastVisit.length > 0) {
          const visitInfo = lastVisit[0];
          const visitDate = visitInfo.callFromDatetime
            ? getDateWithMonthName(visitInfo.callFromDatetime)
            : '';
          const visitDateFull = visitInfo.callFromDatetime
            ? formatDateReverse(new Date(visitInfo.callFromDatetime))
            : '';
          const visitStartTime = visitInfo.callFromDatetime
            ? getOnlyTime(visitInfo.callFromDatetime)
            : '';
          const visitEndTime = visitInfo.callToDatetime
            ? getOnlyTime(visitInfo?.callToDatetime)
            : '';
          const visitObjective = visitInfo.objective ? visitInfo.objective : '';
          const visitType = visitInfo.visitType ? visitInfo.visitType : '';
          const visitPreparationNotes = visitInfo.visitPreparationNotes
            ? visitInfo.visitPreparationNotes
            : '';
          const visitDuration =
            visitInfo.callFromDatetime && visitInfo.callToDatetime
              ? getDuration(
                visitInfo.callFromDatetime,
                visitInfo.callToDatetime,
              )
              : '';

          const visitDataToSet = {
            visitDate,
            visitDateFull,
            visitStartTime,
            visitEndTime,
            visitObjective,
            visitType,
            visitPreparationNotes,
            visitDuration,
            name1: customerInfoData.name1,
            name2: customerInfoData.name2,
            name3: customerInfoData.name3,
            address: customerInfoData.address1,
          };

          setLastVisitInfo(visitDataToSet);
        }
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLVisitInfo.tsx:28 ~ CLVisitInfoController.getLastVisit ~ error:',
          error,
        );
      });
  };

  const getNextVisits = () => {
    CLVisitInfoController.getNextTenFutureVisits()
      .then(async res => {
        setNextTenVisits(res);
        console.log('getNextTenFutureVisits', res);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLVisitInfo.tsx:28 ~ CLVisitInfoController.getNextVisits ~ error:',
          error,
        );
      });
  };

  const getNextDeliveries = (deliveryDays: string) => {
    CLVisitInfoController.getNextTenDeliveries(deliveryDays)
      .then(async res => {
        setNextTenDeliveries(res);
        console.log('getNextDeliveries', res);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLVisitInfo.tsx:28 ~ CLVisitInfoController.getNextDeliveries ~ error:',
          error,
        );
      });
  };

  const getVisitNotes = () => {
    CLVisitInfoController.getLatestTwoVisitNotes()
      .then(async res => {
        setLatestTwoVisitNotes(res);
        console.log('getLatestTwoVisitNotes', res);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLVisitInfo.tsx:28 ~ CLVisitInfoController.getVisitNotes ~ error:',
          error,
        );
      })
      .finally(() => setLoading(false));
  };

  const onSaveButtonPress = (visitNote: string, idEmployeeObjective) => {
    const idCall = visitInfoData.idCall;
    const callFromDateTime = visitInfoData.callFromDateTime;
    const callToDateTime = visitInfoData.callToDateTime;

    let obj = {
      idCall,
      callFromDateTime,
      callToDateTime,
      idEmployeeObjective,
      visitType: visitInfoData.visitType,
      originalCallFromDateTime: callFromDateTime,
      originalCallToDateTime: callToDateTime,
      visitPreparationNotes: visitNote,
      preferedCallTime: visitInfoData.visitStartTime.replace(':', ''),
    };

    console.log('the obj to update is', obj);
    VisitsContoller.updateEditVisit(obj)
      .then(res => {
        console.log('visit updated successfully');
        getVisitsInfo();
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        })
        console.log('Error while updating the visit', err);
      });
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <View flex>
        <CustomerLandingHeader message={message} />
        <View row flex>
          <CLLeftMenuComponent
            activeTab={CUSTOMER_LANDING_SCREENS.VISIT_INFO}
          />
          {loading ? (
            <CustomerLandingLoader />
          ) : (
            <View flex marginR-v2 marginB-v2>
              <View flex-5 row marginB-v2>
                <UpcomingAndLastVisitComponent
                  screen="upcomingVisit"
                  onPressUpcomingVisit={handleModal}
                  visitDate={visitInfoData?.visitDate}
                  visitStartTime={visitInfoData?.visitStartTime}
                  visitEndTime={visitInfoData?.visitEndTime}
                  duration={visitInfoData?.visitDuration}
                  visitObjective={visitInfoData?.visitObjective}
                  visitPreparationNotes={visitInfoData?.visitPreparationNotes}
                  visitCallStatus={visitInfoData?.visitCallStatus}
                />
                <UpcomingAndLastVisitComponent
                  screen="lastVisit"
                  onPressUpcomingVisit={handleModal}
                  visitDate={lastVisitInfo?.visitDate}
                  visitStartTime={lastVisitInfo?.visitStartTime}
                  visitEndTime={lastVisitInfo?.visitEndTime}
                  duration={lastVisitInfo?.visitDuration}
                  visitObjective={lastVisitInfo?.visitObjective}
                  visitPreparationNotes={lastVisitInfo?.visitPreparationNotes}
                  visitCallStatus={lastVisitInfo?.visitCallStatus}
                />
              </View>
              <View flex-8 row>
                <TurnoverFutureInfoComponent
                  nextTenVisits={nextTenVisits}
                  nextTenDeliveries={nextTenDeliveries}
                  latestTwoVisitNotes={latestTwoVisitNotes}
                />
                <CRCAComponent
                  openingHours={openingHours}
                  visitingHours={visitingHours}
                  backgroundBarHours={backgroundBarHours}
                />
              </View>
            </View>
          )}
        </View>
        <VisitInfoUpcomingVisitModal
          onBackPress={handleBackPress}
          isVisible={visitModalVisible}
          fromCustomerSearch={customerInfoData?.fromCustomerSearch}
          name1={visitData?.name1}
          name2={visitData?.name2}
          name3={visitData?.name3}
          address={visitData?.address}
          visitDate={visitData?.visitDateFull}
          visitStartTime={visitData?.visitStartTime}
          visitEndTime={visitData?.visitEndTime}
          visitObjective={visitData?.visitObjective}
          visitPreparationNotes={visitData?.visitPreparationNotes}
          visitType={visitData?.visitType}
          callFromDateTime={visitData?.callFromDateTime}
          isPausedVisit={visitData?.isPausedVisit}
          onSaveButtonPress={onSaveButtonPress}
          isLastVisit={isLastVisit}
          screen={cardName}
          callStatus={visitData?.visitCallStatus}
          idEmployeeObjective={visitData?.idEmployeeObjective}
        />
      </View>
    </SafeAreaView>
  );
};

export default CLVisitInfo;
