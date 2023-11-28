import {DiscoveryListValuesService} from 'src/services/DiscoveryListValuesService';
import {DiscoveryPreviousOwnerTradeAssetsService} from 'src/services/DiscoveryPreviousOwnerTradeAssetsService';
import {DiscoveryTradeAssetsService} from 'src/services/DiscoveryTradeAssetsService';
import {MaterialsService} from 'src/services/MaterialsService';
import {ParametersValuesService} from 'src/services/ParametersValuesService';
import {ProspectsService} from 'src/services/ProspectsService';
import {TradeAssetsCustomersService} from 'src/services/TradeAssetsCustomersService';
import {DiscoveryTradeAssetsChargeOffService} from 'src/services/DiscoveryTradeAssetsChargeOffService';
import {DiscoveryService} from 'src/services/DiscoveryService';
import {DiscoveryNewTradeAssetsWishedService} from 'src/services/DiscoveryNewTradeAssetsWishedService';
import {CustomersService} from 'src/services/CustomersService';
import {DiscoveryAgreementRequestsService} from 'src/services/DiscoveryAgreementRequestsService';
import {ServiceRequestsCustomersService} from 'src/services/ServiceRequestsCustomersService';
import {ServiceRequestsCustomersJournalService} from 'src/services/ServiceRequestsCustomersJournalService';
import {ActivitiesService} from 'src/services/ActivitiesService';

import {
  generateUniqueIdWithTime,
  getLocaleNumberFormatter,
  removeLeadingZeroes,
  getUUID,
} from 'src/utils/CommonUtil';
import {DROPDOWN_CONTROL_NAME} from 'src/utils/ControlName';
import {
  REQUESTED_AGREEMENT_TYPE,
  YAMBS_WORKFLOW_STATUS_TYPE,
} from 'src/utils/DbConst';

import PLFinancialInfoController from './PLFinancialInfoController';
import ApiUtil from 'src/services/ApiUtil';
import {TradeAssetsContractTemplatesService} from 'src/services/TradeAssetsContractTemplatesService';
import {ProspectsRepo} from 'src/repo/ProspectsRepo';

class PLTradeAssetController {
  private discoveryTradeAssetsService: DiscoveryTradeAssetsService;
  private materialsService: MaterialsService;
  private discoveryListValuesService: DiscoveryListValuesService;
  private prospectsService: ProspectsService;
  private tradeAssetsCustomersService: TradeAssetsCustomersService;
  private parametersValuesService: ParametersValuesService;
  private discoveryPreviousOwnerTradeAssetsService: DiscoveryPreviousOwnerTradeAssetsService;
  private discoveryTradeAssetsChargeOffService: DiscoveryTradeAssetsChargeOffService;
  private discoveryService: DiscoveryService;
  private customersService: CustomersService;
  private discoveryNewTradeAssetsWishedService: DiscoveryNewTradeAssetsWishedService;
  private discoveryAgreementRequestsService: DiscoveryAgreementRequestsService;
  private serviceRequestsCustomersService: ServiceRequestsCustomersService;
  private serviceRequestsCustomersJournalService: ServiceRequestsCustomersJournalService;
  private activitiesService: ActivitiesService;
  private tradeAssetsContractTemplatesService: TradeAssetsContractTemplatesService;

  constructor() {
    this.discoveryTradeAssetsService = new DiscoveryTradeAssetsService();
    this.materialsService = new MaterialsService();
    this.discoveryListValuesService = new DiscoveryListValuesService();
    this.prospectsService = new ProspectsService();
    this.tradeAssetsCustomersService = new TradeAssetsCustomersService();
    this.parametersValuesService = new ParametersValuesService();
    this.discoveryPreviousOwnerTradeAssetsService =
      new DiscoveryPreviousOwnerTradeAssetsService();
    this.discoveryTradeAssetsChargeOffService =
      new DiscoveryTradeAssetsChargeOffService();
    this.discoveryService = new DiscoveryService();
    this.customersService = new CustomersService();
    this.discoveryNewTradeAssetsWishedService =
      new DiscoveryNewTradeAssetsWishedService();
    this.discoveryAgreementRequestsService =
      new DiscoveryAgreementRequestsService();
    this.serviceRequestsCustomersService =
      new ServiceRequestsCustomersService();
    this.serviceRequestsCustomersJournalService =
      new ServiceRequestsCustomersJournalService();
    this.activitiesService = new ActivitiesService();
    this.tradeAssetsContractTemplatesService =
      new TradeAssetsContractTemplatesService();
  }

  async getTAListing() {
    return await this.discoveryTradeAssetsService.getTAListing();
  }

  async getTADescription(searchText: string = '', materialNumber: string = '') {
    return await this.materialsService.getTADescription(
      searchText,
      materialNumber,
    );
  }

  async getDesignList() {
    return await this.discoveryListValuesService.getDiscoveryListByControlName(
      DROPDOWN_CONTROL_NAME.TA_DESIGN,
    );
  }

  async getTradeAssetWishLimit() {
    return await this.parametersValuesService.getParameterValue(
      'Restrict_Single_Trade_Asset_Per_Contract',
    );
  }

  async getFollowUpActions() {
    return await this.discoveryListValuesService.getDiscoveryListByControlName(
      DROPDOWN_CONTROL_NAME.FOLLOW_UP_ACTIONS,
    );
  }

  async getPreviousCustomerDetails() {
    return await this.prospectsService.getPreviousCustomerDetails();
  }

  async getTaTakeoverOfProspect(
    previousCustomerSalesOrganization: string,
    previousCustomerDistributionChannel: string,
  ) {
    const taTakeOverData =
      await this.discoveryPreviousOwnerTradeAssetsService.getTaTakeoverOfProspect(
        previousCustomerSalesOrganization,
        previousCustomerDistributionChannel,
      );

    if (taTakeOverData.length > 0) {
      taTakeOverData.forEach((taTakeOver: any) => {
        if (taTakeOver.taTransfer) {
          taTakeOver.taTransferOriginal = taTakeOver.taTransfer;
          taTakeOver.taTransfer = true;
        }
        taTakeOver.followUpActionDisabled = true;
        taTakeOver.expectedTurnoverTaDisabled = false;
        taTakeOver.taTransferDisabled = false;
      });

      return taTakeOverData;
    }

    return [];
  }

  async getTaTakeoverOfPreviousCustomerInTaRequest(customerShipTo: string) {
    let taTakeOverDataOfPreviousCustomer =
      await this.tradeAssetsCustomersService.getTaTakeoverOfPreviousCustomerInTaRequest(
        customerShipTo,
      );

    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();

    if (taTakeOverDataOfPreviousCustomer.length === 0 && isOnline.status) {
      const apiResponse =
        await this.tradeAssetsCustomersService.getTradeAssetNotTakenOverOnline(
          customerShipTo,
        );

      console.log('apiResponse :>> ', apiResponse);

      if (apiResponse?.data?.length > 0) {
        taTakeOverDataOfPreviousCustomer = apiResponse.data;
      }
    }

    if (taTakeOverDataOfPreviousCustomer.length > 0) {
      taTakeOverDataOfPreviousCustomer.forEach((taTakeOver: any) => {
        taTakeOver.taTransferOriginal = taTakeOver?.taTransfer;
        taTakeOver.taTransfer = true;
        taTakeOver.followUpActionDisabled = true;
        taTakeOver.expectedTurnoverTaDisabled = false;
        taTakeOver.taTransferDisabled = false;
        taTakeOver.priceTag = taTakeOver?.priceTag
          ? taTakeOver.priceTag.toString()
          : '';
        taTakeOver.description = taTakeOver?.description
          ? taTakeOver.description
          : taTakeOver?.materialDescription;
        taTakeOver.expectedTurnoverTa = taTakeOver?.expectedTurnoverTa
          ? taTakeOver.expectedTurnoverTa
          : '';
      });

      return taTakeOverDataOfPreviousCustomer;
    }

    return [];
  }

  async getPreviousCustomerTAChargeOff() {
    const previousCustomerTAChargeOffData =
      await this.tradeAssetsCustomersService.getPreviousCustomerTAChargeOff();

    if (previousCustomerTAChargeOffData.length > 0) {
      previousCustomerTAChargeOffData.forEach((taChargeOff: any) => {
        taChargeOff.status = !!Number(taChargeOff.taChargeOff);
        taChargeOff.formattedMaterialNumber = removeLeadingZeroes(
          taChargeOff.materialNumber.trim(),
        );
      });

      return previousCustomerTAChargeOffData;
    }

    return [];
  }

  async saveTAChargeOffData(
    agreementNumber: string,
    tradeAssetsData: any,
    taChargeOffData: any,
  ) {
    tradeAssetsData = {
      ...tradeAssetsData,
      agreementNumber,
      status: tradeAssetsData?.isFinalized ? '1' : '0',
      taProcess: '2',
    };

    const isTradeAssetsInserted =
      await this.discoveryTradeAssetsService.insertOrUpdateTaRequest(
        tradeAssetsData,
      );

    if (!isTradeAssetsInserted) {
      return false;
    }

    if (taChargeOffData?.length > 0) {
      const isTAChargeOffSaved =
        await this.discoveryTradeAssetsChargeOffService.insertOrUpdateTaChargeOffData(
          taChargeOffData,
          agreementNumber,
        );

      if (!isTAChargeOffSaved) {
        return false;
      }
    }

    const isDiscoveryUpdated =
      await this.discoveryService.updateSepaOverwriteInfo();

    if (!isDiscoveryUpdated) {
      return false;
    }

    return true;
  }

  async saveTARequestData(
    agreementNumber: any,
    tradeAssetsData: any,
    previousCustomerDetailsData: any,
    taWishData: any,
    taTakeOverData: any,
    taWishLimit: number,
    isProspect: boolean,
  ) {
    tradeAssetsData = {
      ...tradeAssetsData,
      agreementNumber,
      status: tradeAssetsData?.isFinalized ? '1' : '0',
      taProcess: '1',
    };

    const isTradeAssetsSaved =
      await this.discoveryTradeAssetsService.insertOrUpdateTaRequest(
        tradeAssetsData,
      );

    if (!isTradeAssetsSaved) {
      return false;
    }

    const isTaWishSaved =
      await this.discoveryNewTradeAssetsWishedService.insertOrUpdateTaWish(
        taWishData,
        agreementNumber,
      );

    if (!isTaWishSaved) {
      return false;
    }

    if (!isProspect) {
      const customerData = await this.customersService.fetchCustomerInfo(
        previousCustomerDetailsData.previousCustomerShipTo,
      );

      if (customerData.length > 0) {
        previousCustomerDetailsData = {
          ...previousCustomerDetailsData,
          previousCustomerShipTo: customerData[0]?.customerShipTo,
          previousCustomerSalesOrganization: customerData[0]?.salesOrganization,
          previousCustomerDistributionChannel:
            customerData[0]?.distributionChannel,
        };
      }
    }
    const isTaTakeoverSaved =
      await this.discoveryPreviousOwnerTradeAssetsService.insertOrUpdateTaTakeover(
        taTakeOverData,
        previousCustomerDetailsData,
        agreementNumber,
      );

    if (!isTaTakeoverSaved) {
      return false;
    }

    return true;
  }

  async getTradeAssetChargeOffData(agreementNumber: string) {
    const taChargeOffData =
      await this.customersService.getTradeAssetChargeOffData(agreementNumber);

    console.log('taChargeOffData original :>> ', taChargeOffData);

    if (taChargeOffData.length > 0) {
      const preparedTaChargeOffData = taChargeOffData.map(
        (taChargeOff: any) => ({
          residualValue: taChargeOff.residualValue.toString(),
          constructionDate: taChargeOff?.installationDate ?? '',
          description: taChargeOff.description,
          serialNumber: taChargeOff.serialNumber,
          formattedMaterialNumber: removeLeadingZeroes(
            taChargeOff.materialNumber.trim(),
          ),
          materialNumber: taChargeOff.materialNumber,
          status: !!Number(taChargeOff.taChargeOff),
          id: taChargeOff.id,
        }),
      );

      return preparedTaChargeOffData;
    }

    return [];
  }

  async getTaRequestCustomerPreviewData() {
    return await this.customersService.getTaRequestCustomerPreviewData();
  }

  async getTaRequestProspectAgreementPreview() {
    return await this.prospectsService.getTaRequestProspectAgreementPreview();
  }

  async getTradeAssetWishPreviewData(agreementNumber: string) {
    const taWishPreviewData =
      await this.discoveryService.getTradeAssetWishPreviewData(agreementNumber);

    if (taWishPreviewData.length > 0) {
      taWishPreviewData.forEach((taWish: any) => {
        taWish.price = getLocaleNumberFormatter(taWish.price, 2).toString();
        taWish.expectedTurnover = getLocaleNumberFormatter(
          taWish.expectedTurnover,
          2,
        ).toString();
        taWish.quantity = taWish.quantity.toString();
      });

      return taWishPreviewData;
    }

    return [];
  }

  async getTradeAssetTakeOverPreviewData(agreementNumber: string) {
    const taTakeoverPreviewData =
      await this.discoveryService.getTradeAssetTakeOverPreviewData(
        agreementNumber,
      );

    if (taTakeoverPreviewData.length > 0) {
      taTakeoverPreviewData.forEach((taTakeover: any) => {
        taTakeover.price = getLocaleNumberFormatter(
          taTakeover.price,
          2,
        ).toString();
        taTakeover.expectedTurnover = getLocaleNumberFormatter(
          taTakeover.expectedTurnoverTa,
          2,
        ).toString();
      });

      return taTakeoverPreviewData;
    }

    return taTakeoverPreviewData;
  }

  async getTaWishData(agreementNumber: string) {
    const taWishData =
      await this.discoveryNewTradeAssetsWishedService.getTaWishData(
        agreementNumber,
      );

    if (taWishData.length > 0) {
      taWishData.forEach((taWish: any) => {
        taWish.price = taWish.price.toString();
        taWish.expectedTurnover = taWish.expectedTurnover.toString();
        taWish.quantity = taWish.quantity.toString();
      });

      return taWishData;
    }

    return [];
  }

  async getTaTakeoverData(agreementNumber: string, isProspect: boolean) {
    const taTakeoverData =
      await this.discoveryPreviousOwnerTradeAssetsService.getTaTakeoverData(
        agreementNumber,
      );

    if (taTakeoverData.length > 0) {
      taTakeoverData.forEach((taTakeOver: any) => {
        if (Number(taTakeOver?.taTransfer)) {
          taTakeOver.taTransferOriginal = taTakeOver.taTransfer;
          taTakeOver.taTransfer = true;
          taTakeOver.followUpActionDisabled = true;
          taTakeOver.expectedTurnoverTaDisabled = false;
        } else {
          taTakeOver.taTransferOriginal = taTakeOver.taTransfer;
          taTakeOver.taTransfer = false;
          taTakeOver.followUpActionDisabled = false;
          taTakeOver.expectedTurnoverTaDisabled = true;
        }

        if (isProspect) {
          taTakeOver.taTransferDisabled = false;
        } else {
          taTakeOver.taTransferDisabled = true;
        }

        taTakeOver.expectedTurnoverTa =
          taTakeOver.expectedTurnoverTa.toString();
        taTakeOver.priceTag = taTakeOver.priceTag.toString();
      });

      return taTakeoverData;
    }

    return [];
  }

  async getTaChargeOffPreviewData(agreementNumber: string) {
    const formattedTaChargeOffData = await this.getTradeAssetChargeOffData(
      agreementNumber,
    );
    const allTaChargeOffData =
      await this.customersService.getTradeAssetChargeOffData(agreementNumber);

    let prospectInfo = [];

    if (allTaChargeOffData.length > 0) {
      const chargeOffDataObj = allTaChargeOffData[0];
      prospectInfo[0] = {
        houseNumber: chargeOffDataObj?.houseNumber ?? '',
        postalCode: chargeOffDataObj?.postalCode ?? '',
        city: chargeOffDataObj?.city ?? '',
        street1: chargeOffDataObj?.street1 ?? '',
        name3: chargeOffDataObj?.name3 ?? '',
        name2: chargeOffDataObj?.name2 ?? '',
        name1: chargeOffDataObj?.name1 ?? '',
        customerNumber: chargeOffDataObj?.customerNumber ?? '',
        agreementNumber: chargeOffDataObj?.agreementNumber ?? '',
        justification: chargeOffDataObj?.justification ?? '',
      };
    }

    return {
      taChargeOffData: formattedTaChargeOffData,
      prospectInfo,
    };
  }

  async deleteTaRequestAgreement(agreementNumber: string, isProspect: boolean) {
    const isDiscoveryTradeAssetsUpdated =
      await this.discoveryTradeAssetsService.updateTradeAssetsDeleteStatus(
        agreementNumber,
      );

    if (!isDiscoveryTradeAssetsUpdated) {
      return false;
    }

    if (isProspect) {
      const isPreviousOwnerTradeAssetsDeleted =
        await this.discoveryPreviousOwnerTradeAssetsService.updatePrevOwnerTradeAssetsStatus(
          agreementNumber,
        );

      if (!isPreviousOwnerTradeAssetsDeleted) {
        return false;
      }
    } else {
      const isPreviousOwnerTradeAssetsDeleted =
        await this.discoveryPreviousOwnerTradeAssetsService.deletePrevOwnerTradeAssetsStatus(
          agreementNumber,
        );

      if (!isPreviousOwnerTradeAssetsDeleted) {
        return false;
      }
    }

    return true;
  }

  async deleteTaChargeOffAgreement(agreementNumber: string) {
    const isDiscoveryTradeAssetsUpdated =
      await this.discoveryTradeAssetsService.updateTradeAssetsDeleteStatus(
        agreementNumber,
      );

    if (!isDiscoveryTradeAssetsUpdated) {
      return false;
    }

    const isTaChargeOffDeleted =
      await this.discoveryTradeAssetsChargeOffService.deleteDiscoveryTradeAssetsChargeOff(
        agreementNumber,
      );

    if (!isTaChargeOffDeleted) {
      return false;
    }

    return true;
  }

  async finalizeTaChargeOffAgreement(tradeAssetsData: any) {
    const financialData =
      await PLFinancialInfoController.getProspectOrCustomerFinancialInfo();

    let expectedTurnover1 = 0,
      expectedTurnover2 = 0,
      expectedTurnover3 = 0;

    if (financialData.length > 0) {
      expectedTurnover1 = financialData[0]?.expectedTurnover1;
      expectedTurnover2 = financialData[0]?.expectedTurnover2;
      expectedTurnover3 = financialData[0]?.expectedTurnover3;
    }

    const preparedFinancialData = {
      expectedTurnover1,
      expectedTurnover2,
      expectedTurnover3,
    };

    const isDiscoveryTradeAssetsUpdated =
      await this.discoveryTradeAssetsService.updateTaRequestFinalize(
        tradeAssetsData?.agreementNumber,
        tradeAssetsData,
        YAMBS_WORKFLOW_STATUS_TYPE.NOT_REQUIRED,
      );

    if (!isDiscoveryTradeAssetsUpdated) {
      return false;
    }

    const isDiscoveryAgreementRequestCreated =
      await this.discoveryAgreementRequestsService.createFinalizeAgreementRequest(
        REQUESTED_AGREEMENT_TYPE.CHARGE_OFF_AGREEMENT,
        tradeAssetsData,
        preparedFinancialData,
      );

    console.log(
      'isDiscoveryAgreementRequestCreated :>> ',
      isDiscoveryAgreementRequestCreated,
    );

    if (!isDiscoveryAgreementRequestCreated) {
      return false;
    }

    return true;
  }

  async finalizeTaRequestAgreement(
    tradeAssetsData: any,
    taWishData: any,
    taTakeOverData: any,
    isProspect: boolean,
    previousCustomerDetailsData: any,
  ) {
    const agreementNumber = tradeAssetsData?.agreementNumber;

    let isTaTransferSelected = false;
    let yambsStatus = YAMBS_WORKFLOW_STATUS_TYPE.REQUESTED;

    if (taTakeOverData?.length > 0) {
      taTakeOverData.forEach((taTakeOver: any) => {
        if (taTakeOver?.taTransfer) {
          isTaTransferSelected = true;
        }
      });
    }

    if (taWishData.length === 0 && !isTaTransferSelected) {
      yambsStatus = YAMBS_WORKFLOW_STATUS_TYPE.NOT_REQUIRED;
    }

    const isDiscoveryTradeAssetsUpdated =
      await this.discoveryTradeAssetsService.updateTaRequestFinalize(
        agreementNumber,
        tradeAssetsData,
        yambsStatus,
      );

    console.log(
      'isDiscoveryTradeAssetsUpdated :>> ',
      isDiscoveryTradeAssetsUpdated,
    );

    if (!isDiscoveryTradeAssetsUpdated) {
      return false;
    }

    if (taWishData.length > 0) {
      const financialData =
        await PLFinancialInfoController.getProspectOrCustomerFinancialInfo();

      let expectedTurnover1 = 0,
        expectedTurnover2 = 0,
        expectedTurnover3 = 0;

      if (financialData.length > 0) {
        expectedTurnover1 = financialData[0]?.expectedTurnover1;
        expectedTurnover2 = financialData[0]?.expectedTurnover2;
        expectedTurnover3 = financialData[0]?.expectedTurnover3;
      }

      const preparedFinancialData = {
        expectedTurnover1,
        expectedTurnover2,
        expectedTurnover3,
      };

      const isDiscoveryAgreementRequestCreated =
        await this.discoveryAgreementRequestsService.createFinalizeAgreementRequest(
          REQUESTED_AGREEMENT_TYPE.LOAN_AGREEMENT,
          tradeAssetsData,
          preparedFinancialData,
        );

      console.log(
        'isDiscoveryAgreementRequestCreated :>> ',
        isDiscoveryAgreementRequestCreated,
      );

      if (!isDiscoveryAgreementRequestCreated) {
        return false;
      }
    }

    if (taTakeOverData.length > 0) {
      const tradeAssetId = getUUID();

      const isDiscoveryPreviousOwnerTradeAssetsFinalized =
        await this.discoveryPreviousOwnerTradeAssetsService.finalizePreviousOwnerTradeAssets(
          tradeAssetId,
          agreementNumber,
        );

      console.log(
        'isDiscoveryPreviousOwnerTradeAssetsFinalized :>> ',
        isDiscoveryPreviousOwnerTradeAssetsFinalized,
      );

      if (!isDiscoveryPreviousOwnerTradeAssetsFinalized) {
        return false;
      }

      if (isProspect) {
        const isTaRequestServiceDataInserted =
          await this.serviceRequestsCustomersService.insertTaRequestServiceData(
            tradeAssetId,
            previousCustomerDetailsData[0]?.previousCustomerShipTo,
          );

        console.log(
          'isTaRequestServiceDataInserted :>> ',
          isTaRequestServiceDataInserted,
        );

        if (!isTaRequestServiceDataInserted) {
          return false;
        }
      }

      const isCustomerJournalInformationInserted =
        await this.serviceRequestsCustomersJournalService.insertTaRequestCustomerJournal(
          tradeAssetId,
        );

      console.log(
        'isCustomerJournalInformationInserted :>> ',
        isCustomerJournalInformationInserted,
      );

      if (!isCustomerJournalInformationInserted) {
        return false;
      }

      const prospectInfoData = await this.activitiesService.getPLProspectInfo();
      let customerNumber = '';

      if (!isProspect) {
        customerNumber = prospectInfoData?.customerShipTo
          ? prospectInfoData?.customerShipTo
          : prospectInfoData?.prospectNumber;
      }

      const isActivitiesDataInserted =
        await this.activitiesService.insertTaRequestCustomerJournal(
          tradeAssetId,
          customerNumber,
        );

      console.log('isActivitiesDataInserted :>> ', isActivitiesDataInserted);

      if (!isActivitiesDataInserted) {
        return false;
      }

      let description = '';

      const serviceRequestsData =
        await this.serviceRequestsCustomersService.getServiceRequestForFinalize(
          tradeAssetId,
        );

      console.log('serviceRequestsData :>> ', serviceRequestsData);
      if (serviceRequestsData.length > 0) {
        for (const serviceData of serviceRequestsData) {
          description +=
            serviceData?.serialNumber + ' ' + serviceData?.followUpAction;
        }
      }

      console.log('description :>> ', description);

      const isServiceRequestCustomersDataUpdated =
        await this.serviceRequestsCustomersService.updateTaRequestServiceData(
          tradeAssetId,
          description,
        );

      console.log(
        'isServiceRequestCustomersDataUpdated :>> ',
        isServiceRequestCustomersDataUpdated,
      );

      if (!isServiceRequestCustomersDataUpdated) {
        return false;
      }
    }

    return true;
  }

  async getTermsAndConditionsTemplateName(
    prospectInfoData: any,
    isProspect: boolean,
  ) {
    const prospectsRepo = new ProspectsRepo();
    let market = await this.prospectsService.getCurrentUserMarket();
    if (market === 'DEAT') {
      market = 'DE';
    }

    const selectedLanguageInfo = await prospectsRepo.getSelectedLanguageInfo();

    const userLanguage = selectedLanguageInfo?.language
      ? selectedLanguageInfo?.language.toUpperCase()
      : '';
    const abcClassification = prospectInfoData?.abcClassification
      ? prospectInfoData?.abcClassification
      : '';

    if (isProspect) {
      const prospectAgreementData =
        await this.prospectsService.fetchLanguageAndCountryCodeOfProspect(
          prospectInfoData?.discoveryId,
        );

      console.log('prospectAgreementData :>> ', prospectAgreementData);

      if (prospectAgreementData.length > 0) {
        const countriesData =
          await this.discoveryListValuesService.getCountries();
        const foundCountry = countriesData.find(
          (item: any) =>
            item.discoveryListValuesId === prospectAgreementData[0]?.country,
        );

        console.log('foundCountry :>> ', foundCountry);

        const country = foundCountry ? foundCountry.itemValue : market;
        const language = prospectAgreementData[0]?.language
          ? prospectAgreementData[0]?.language
          : userLanguage;

        console.log('country :>> ', country);

        return await this.tradeAssetsContractTemplatesService.getTermsAndConditionsTemplateName(
          abcClassification,
          isProspect,
          language,
          country,
        );
      } else {
        return await this.tradeAssetsContractTemplatesService.getTermsAndConditionsTemplateName(
          abcClassification,
          isProspect,
          userLanguage,
          market,
        );
      }
    } else {
      const customerAgreementData =
        await this.customersService.fetchLanguageAndCountryCodeOfCustomer(
          prospectInfoData?.customerShipTo,
          prospectInfoData?.salesOrganization,
          prospectInfoData?.distributionChannel,
        );

      if (customerAgreementData.length > 0) {
        const country = customerAgreementData[0]?.country
          ? customerAgreementData[0]?.country
          : market;
        const language = customerAgreementData[0]?.language
          ? customerAgreementData[0]?.language
          : userLanguage;

        return await this.tradeAssetsContractTemplatesService.getTermsAndConditionsTemplateName(
          abcClassification,
          isProspect,
          language,
          country,
        );
      } else {
        return await this.tradeAssetsContractTemplatesService.getTermsAndConditionsTemplateName(
          abcClassification,
          isProspect,
          userLanguage,
          market,
        );
      }
    }
  }
}
export default new PLTradeAssetController();
