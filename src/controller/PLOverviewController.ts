import {pageNamePLOverview} from 'src/routes/Routes';
import {CustomersService} from 'src/services/CustomersService';
import {DiscoveryService} from 'src/services/DiscoveryService';
import {ProspectsService} from 'src/services/ProspectsService';
import {CallsService} from 'src/services/CallsService';
import {
  formatDateReverse,
  getDateWithMonthName,
  getDuration,
  getISOCurrentDate,
  getLocaleNumberFormatter,
  getOnlyTime,
  getUUID,
  removeLeadingZeroes,
} from 'src/utils/CommonUtil';
import {ExportUtil} from 'src/utils/Helper';
import {navigate} from 'src/utils/NavigationUtil';
import {toast} from 'src/utils/Util';
import CLOverviewController from './CLOverviewController';
import {VISITS_CALL_STATUS} from 'src/utils/DbConst';
import ApiUtil from 'src/services/ApiUtil';

export class PLOverviewController {
  private prospectsService: ProspectsService;
  private discoveryService: DiscoveryService;
  private customersService: CustomersService;
  private callsService: CallsService;

  constructor() {
    this.prospectsService = new ProspectsService();
    this.discoveryService = new DiscoveryService();
    this.customersService = new CustomersService();
    this.callsService = new CallsService();
  }

  async navigateToPLOverview(data: any) {
    try {
      // If the customer is remote, then don't allow to navigate to CRM
      if (data?.isCallApi) {
        toast.info({
          message: 'CRM is not available for remote customers',
        });
        return;
      }

      let formattedData = data;

      // If the data is in snake case, then convert it to camel case
      if (formattedData?.status_type) {
        formattedData = ExportUtil.convertKeysToCamelCase(data);
      }

      if (
        formattedData?.statusType &&
        formattedData?.statusType.toLowerCase() === 'p'
      ) {
        if (!formattedData?.discoveryId) {
          toast.info({
            message: 'CRM is not available for remote prospect',
          });
          return;
        }

        const isDataExists =
          await this.discoveryService.checkIsProspectDataExist(
            formattedData.discoveryId,
          );

        if (!isDataExists) {
          toast.info({
            message: 'CRM is not available for remote prospect',
          });
          return;
        }
      }

      // If discovery id is not present, then store the data in discovery and prospects
      if (!formattedData.discoveryId) {
        const discoveryId = getUUID();

        const isDataInsertedInDiscovery =
          await this.discoveryService.storeCustomerDataInDiscovery(
            discoveryId,
            formattedData.customerShipTo,
          );

        if (!isDataInsertedInDiscovery) {
          toast.error({
            message: 'Something went wrong',
          });
          return;
        }

        const isDataInsertedInProspects =
          await this.prospectsService.storeCustomerDataInProspects(
            discoveryId,
            formattedData.salesOrganization,
            formattedData.distributionChannel,
            formattedData.industryCode || formattedData.industrycode,
          );

        if (!isDataInsertedInProspects) {
          toast.error({
            message: 'Something went wrong',
          });
          return;
        }

        formattedData.discoveryId = discoveryId;
        formattedData.industryCode =
          formattedData.industryCode || formattedData.industrycode;
      }

      // Navigating to PLOverview
      navigate(
        pageNamePLOverview as never,
        {
          data: formattedData,
        } as never,
      );
    } catch (error) {
      console.log('error while navigating to PLOverview :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  }

  async getProspectInfo() {
    return await this.prospectsService.getProspectInfo();
  }

  async getProspectDetailsExpectedTurnoverAndEmployeeDetails() {
    return await this.discoveryService.getProspectDetailsExpectedTurnoverAndEmployeeDetails();
  }

  async getCustomerDetailsExpectedTurnoverAndEmployeeDetails() {
    return await this.customersService.getCustomerDetailsExpectedTurnoverAndEmployeeDetails();
  }

  async getProspectOrCustomerDetailsExpectedTurnoverAndEmployeeDetails() {
    const prospectData = await this.customersService.getPLProspectInfo();
    let data = [];

    if (
      prospectData?.statusType &&
      prospectData?.statusType.toLowerCase() === 'c'
    ) {
      data = await this.getCustomerDetailsExpectedTurnoverAndEmployeeDetails();
    } else {
      data = await this.getProspectDetailsExpectedTurnoverAndEmployeeDetails();
    }

    if (data.length > 0) {
      data.forEach((data: any) => {
        data.formattedIce = data.ice
          ? getLocaleNumberFormatter(data.ice).toString()
          : '0';
        data.formattedFrozenFood = data.frozenFood
          ? getLocaleNumberFormatter(data.frozenFood).toString()
          : '0';
        data.formattedFrozenBakery = data.frozenBakery
          ? getLocaleNumberFormatter(data.frozenBakery).toString()
          : '0';
        data.formattedTotal = data.total
          ? getLocaleNumberFormatter(data.total).toString()
          : '0';
        data.formattedExternalProspectNumber = data.externalProspectNumber
          ? removeLeadingZeroes(data.externalProspectNumber)
          : '';
      });
    }

    return data;
  }

  async getVisitData(isUpcomingVisit: boolean = false) {
    const prospectInfoData = await this.prospectsService.getPLProspectInfo();
    let visitData = [];

    if (isUpcomingVisit) {
      visitData = await this.callsService.getUpcomingVisitForProspect();

      if (visitData.length === 0) {
        const isOnline = await ApiUtil.getAppDeviceOnlineStatus();

        if (isOnline.status) {
          visitData = await this.callsService.getUpcomingVisitOnline(
            prospectInfoData?.prospectNumber ||
              prospectInfoData?.customerShipTo,
          );

          if (visitData?.callFromDatetime) {
            visitData = [visitData];
          } else {
            visitData = [];
          }
        }
      }
    } else {
      visitData = await CLOverviewController.getVisitFromIdCall(
        prospectInfoData,
        true,
      );
    }

    let showButtons;

    if (visitData.length > 0) {
      const visitInfoObj = visitData[0];

      const visitDate =
        (visitInfoObj?.callFromDatetime &&
          getDateWithMonthName(visitInfoObj?.callFromDatetime)) ||
        '';
      const visitDateFull =
        (visitInfoObj?.callFromDatetime &&
          formatDateReverse(new Date(visitInfoObj?.callFromDatetime))) ||
        '';
      const visitStartTime =
        (visitInfoObj?.callFromDatetime &&
          getOnlyTime(visitInfoObj?.callFromDatetime.replace('T', ' '))) ||
        '';
      const visitEndTime =
        (visitInfoObj?.callToDatetime &&
          getOnlyTime(visitInfoObj?.callToDatetime.replace('T', ' '))) ||
        '';
      const visitDuration =
        (visitInfoObj?.callFromDatetime &&
          visitInfoObj?.callToDatetime &&
          getDuration(
            visitInfoObj?.callFromDatetime,
            visitInfoObj?.callToDatetime,
          )) ||
        '';

      if (
        // isRemoteCustomer ||
        visitInfoObj.callStatus === VISITS_CALL_STATUS.FINISHED
      ) {
        showButtons = false;
      } else if (isUpcomingVisit) {
        const date1 = visitInfoObj?.callFromDatetime;
        const date2 = getISOCurrentDate();

        const extractedDate1 = date1.split(' ')[0];
        const extractedDate2 = date2.split(' ')[0];

        showButtons = extractedDate1 === extractedDate2;
      } else {
        const date1 = visitInfoObj?.callFromDatetime;
        const date2 = getISOCurrentDate();

        const extractedDate1 = date1.split(' ')[0];
        const extractedDate2 = date2.split(' ')[0];

        showButtons =
          visitInfoObj?.callFromDatetime <= getISOCurrentDate() ||
          extractedDate1 === extractedDate2;
      }

      const formattedVisitData = {
        name1: prospectInfoData?.name1 || prospectInfoData?.customerName || '',
        name2: prospectInfoData?.name2 || '',
        name3: prospectInfoData?.name3 || '',
        address: prospectInfoData?.address1 || '',
        visitDate,
        visitDateFull,
        visitStartTime,
        visitEndTime,
        visitDuration,
        visitObjective: visitInfoObj?.visitObjective || '',
        visitCallStatus: visitInfoObj.callStatus || '',
        visitType: visitInfoObj?.visitType || '',
        callPlaceNumber: visitInfoObj?.callPlaceNumber || '',
        idCall: visitInfoObj?.idCall || '',
        callFromDateTime: visitInfoObj?.callFromDatetime || '',
        callToDateTime: visitInfoObj?.callToDatetime || '',
        idEmployeeObjective: visitInfoObj?.idEmployeeObjective || '',
        visitNotes: visitInfoObj?.visitPreparationNotes || '',
        showButtons,
      };

      visitData = [formattedVisitData];
    }

    return visitData;
  }

  async getUpcomingVisitOnline(prospectNumber: string) {
    const data = await this.callsService.getUpcomingVisitOnline(prospectNumber);
    if (data?.callFromDatetime) {
      return [data];
    }

    return [];
  }
}

export default new PLOverviewController();
