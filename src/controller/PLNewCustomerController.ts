import {CustomersPaymentMethodsService} from 'src/services/CustomersPaymentMethodsService';
import {DiscoveryConditionAgreementsService} from 'src/services/DiscoveryConditionAgreementsService';
import {DiscoveryNewTradeAssetsWishedService} from 'src/services/DiscoveryNewTradeAssetsWishedService';
import {DiscoveryPreviousOwnerTradeAssetsService} from 'src/services/DiscoveryPreviousOwnerTradeAssetsService';
import {DiscoverySepaService} from 'src/services/DiscoverySepaService';
import {DiscoveryService} from 'src/services/DiscoveryService';
import {EventsService} from 'src/services/EventsService';
import {ProspectsService} from 'src/services/ProspectsService';
import {ParametersValuesService} from 'src/services/ParametersValuesService';

import PLBasicInfoController from './PLBasicInfoController';
import PLCustomerInfoController from './PLCustomerInfoController';
import PLContactsController from './PLContactsController';
import PLFinancialInfoController from './PLFinancialInfoController';
import PLRCAController from './PLRCAController';

class PLNewCustomerController {
  private customersPaymentMethodsService: CustomersPaymentMethodsService;
  private discoveryService: DiscoveryService;
  private prospectsService: ProspectsService;
  private discoverySepaService: DiscoverySepaService;
  private discoveryPreviousOwnerTradeAssetsService: DiscoveryPreviousOwnerTradeAssetsService;
  private discoveryNewTradeAssetsWishedService: DiscoveryNewTradeAssetsWishedService;
  private discoveryConditionAgreementsService: DiscoveryConditionAgreementsService;
  private eventService: EventsService;
  private parametersValuesService: ParametersValuesService;

  constructor() {
    this.customersPaymentMethodsService = new CustomersPaymentMethodsService();
    this.discoveryService = new DiscoveryService();
    this.prospectsService = new ProspectsService();
    this.discoverySepaService = new DiscoverySepaService();
    this.discoveryPreviousOwnerTradeAssetsService =
      new DiscoveryPreviousOwnerTradeAssetsService();
    this.discoveryConditionAgreementsService =
      new DiscoveryConditionAgreementsService();
    this.discoveryNewTradeAssetsWishedService =
      new DiscoveryNewTradeAssetsWishedService();
    this.eventService = new EventsService();
    this.parametersValuesService = new ParametersValuesService();
  }

  private checkMandatoryConfigsAndValidateData(
    mandatoryConfigs: any,
    fieldsData: any,
  ) {
    for (const key of Object.keys(mandatoryConfigs)) {
      if (mandatoryConfigs[key] && !fieldsData[key]) {
        return false;
      }
    }

    return true;
  }

  private async checkBasicInfoMandatoryFields() {
    try {
      const shipToMandatoryFieldsConfig =
        await PLBasicInfoController.getShipToMandatoryFieldsConfig();
      const billToMandatoryFieldsConfig =
        await PLBasicInfoController.getBillToMandatoryFieldsConfig();
      const deliveryAddressMandatoryFieldsConfig =
        await PLBasicInfoController.getDeliveryAddressMandatoryFieldsConfig();

      const shipToPrePopulateData =
        await PLBasicInfoController.getShipToPrepopulatedData();
      const billToPrePopulateData =
        await PLBasicInfoController.getBillToPrepopulatedData();
      const deliveryAddressPrePopulateData =
        await PLBasicInfoController.getDeliveryAddressPrepopulatedData();

      if (shipToPrePopulateData.length > 0) {
        const isShipToMandatoryFieldsValid =
          this.checkMandatoryConfigsAndValidateData(
            shipToMandatoryFieldsConfig,
            shipToPrePopulateData[0],
          );
        if (!isShipToMandatoryFieldsValid) {
          return false;
        }
      }

      if (billToPrePopulateData.length > 0) {
        const isBillToMandatoryFieldsValid =
          this.checkMandatoryConfigsAndValidateData(
            billToMandatoryFieldsConfig,
            billToPrePopulateData[0],
          );
        if (!isBillToMandatoryFieldsValid) {
          return false;
        }
      }

      if (deliveryAddressPrePopulateData.length > 0) {
        const isDeliveryAddressMandatoryFieldsValid =
          this.checkMandatoryConfigsAndValidateData(
            deliveryAddressMandatoryFieldsConfig,
            deliveryAddressPrePopulateData[0],
          );
        if (!isDeliveryAddressMandatoryFieldsValid) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log(
        'error while checking basic info mandatory fields :>> ',
        error,
      );
      return false;
    }
  }

  private async checkCustomerAttributesFields() {
    try {
      const customerAttributesMandatoryFieldsConfig =
        await PLCustomerInfoController.getMandatoryFieldsConfig();

      const customerAttributesPrePopulateData =
        await PLCustomerInfoController.getProspectOrCustomerAttributeInfo();

      if (customerAttributesPrePopulateData.length > 0) {
        let customerAttributesPrePopulateDataObj =
          customerAttributesPrePopulateData[0];
        customerAttributesPrePopulateDataObj = {
          ...customerAttributesPrePopulateDataObj,
          startBusinessDate:
            customerAttributesPrePopulateDataObj.startCustomerBusinessDatetime,
          startBusinessReason:
            customerAttributesPrePopulateDataObj.idCustomerBusinessReasonStart,
          keyAccountGLNCode:
            customerAttributesPrePopulateDataObj.keyAccountGlnCode,
          wholeSalerCustomerNumber:
            customerAttributesPrePopulateDataObj.wholesalerCustomerNumber,
          distributer: customerAttributesPrePopulateDataObj.idDistributors,
          firstName: customerAttributesPrePopulateDataObj.ownerDeputyFirstName,
          lastName: customerAttributesPrePopulateDataObj.ownerDeputyLastName,
          name: customerAttributesPrePopulateDataObj.canvasserEmployeeNumber,
        };

        const isCustomerAttributesMandatoryFieldsValid =
          this.checkMandatoryConfigsAndValidateData(
            customerAttributesMandatoryFieldsConfig,
            customerAttributesPrePopulateDataObj,
          );

        if (!isCustomerAttributesMandatoryFieldsValid) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log(
        'error while checking customer attributes mandatory fields :>> ',
        error,
      );
      return false;
    }
  }

  private async checkContactsFields() {
    try {
      const contactsFieldsConfig =
        await PLContactsController.getMandatoryFieldsConfig();

      const contactsPrePopulateData =
        await PLContactsController.getContactsData();

      if (contactsPrePopulateData.length > 0) {
        let contactsPrePopulateDataObj = contactsPrePopulateData[0];
        contactsPrePopulateDataObj = {
          ...contactsPrePopulateDataObj,
          contact1FirstName: contactsPrePopulateDataObj.firstNameContact1,
          contact2FirstName: contactsPrePopulateDataObj.firstNameContact2,
          contact1LastName: contactsPrePopulateDataObj.lastNameContact1,
          contact2LastName: contactsPrePopulateDataObj.lastNameContact2,
          contact1PhoneNo: contactsPrePopulateDataObj.phoneNumContact1,
          contact2PhoneNo: contactsPrePopulateDataObj.phoneNumContact2,
          contact1MobileNo: contactsPrePopulateDataObj.mobileNumContact1,
          contact2MobileNo: contactsPrePopulateDataObj.mobileNumContact2,
          contact1FaxNo: contactsPrePopulateDataObj.faxNumContact1,
          contact2FaxNo: contactsPrePopulateDataObj.faxNumContact2,
          contact1Email: contactsPrePopulateDataObj.emailContact1,
          contact2Email: contactsPrePopulateDataObj.emailContact2,
          contact1Notes: contactsPrePopulateDataObj.comment1,
          contact2Notes: contactsPrePopulateDataObj.comment2,
        };

        const isContactsFieldsValid = this.checkMandatoryConfigsAndValidateData(
          contactsFieldsConfig,
          contactsPrePopulateDataObj,
        );

        if (!isContactsFieldsValid) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log('error while checking contacts mandatory fields :>> ', error);
      return false;
    }
  }

  private async checkRCAFields() {
    try {
      const rcaFieldsConfig =
        await PLRCAController.getRCAMandatoryFieldsConfig();

      const openingAndVisitingHoursData: any =
        await PLRCAController.getOpeningAndVisitingHoursData();
      const callAndDeliveryData = await PLRCAController.getProspectRCAData();

      if (callAndDeliveryData.length > 0) {
        const callAndDeliveryDataObj = callAndDeliveryData[0];

        const openingAndVisitingHoursPreparedData = Object.keys(
          openingAndVisitingHoursData,
        ).reduce((acc: any, key: any) => {
          const formattedKey = key.replace('Hours', '');

          const formattedData = Object.keys(
            openingAndVisitingHoursData[key],
          ).reduce((acc: any, item: any) => {
            return {
              ...acc,
              [`${formattedKey}${item.charAt(0).toUpperCase()}${item.slice(
                1,
              )}`]: Number(openingAndVisitingHoursData[key][item]),
            };
          }, {});

          return {
            ...acc,
            ...formattedData,
          };
        }, {});

        const rcaPrePopulateDataObj = {
          season: callAndDeliveryDataObj.callCalendarId,
          callFrequency: callAndDeliveryDataObj.callCalendarId,
          callWeek: callAndDeliveryDataObj.callWeek,
          deliveryWeek: callAndDeliveryDataObj.deliveryWeek,
          distributionCenter: callAndDeliveryDataObj.distributionCentre,
          transitCallPlace: callAndDeliveryDataObj.callPlaceNumber,
          callDayMonday: callAndDeliveryDataObj.mondayCall,
          callDayTuesday: callAndDeliveryDataObj.tuesdayCall,
          callDayWednesday: callAndDeliveryDataObj.false,
          callDayThursday: callAndDeliveryDataObj.thursdayCall,
          callDayFriday: callAndDeliveryDataObj.fridayCall,
          callDaySaturday: callAndDeliveryDataObj.saturdayCall,
          callDaySunday: callAndDeliveryDataObj.sundayCall,
          deliveryDayMonday: callAndDeliveryDataObj.mondayDropdown,
          deliveryDayTuesday: callAndDeliveryDataObj.tuesdayDropdown,
          deliveryDayWednesday: callAndDeliveryDataObj.wednesdayDropdown,
          deliveryDayThursday: callAndDeliveryDataObj.thursdayDropdown,
          deliveryDayFriday: callAndDeliveryDataObj.fridayDropdown,
          deliveryDaySaturday: callAndDeliveryDataObj.saturdayDropdown,
          deliveryDaySunday: callAndDeliveryDataObj.sundayDropdown,
          notes: callAndDeliveryDataObj.deliveryComments,
          ...openingAndVisitingHoursPreparedData,
        };

        const isRcaFieldsValid = this.checkMandatoryConfigsAndValidateData(
          rcaFieldsConfig,
          rcaPrePopulateDataObj,
        );

        if (!isRcaFieldsValid) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log('error while checking RCA mandatory fields :>> ', error);
      return false;
    }
  }

  private async checkFinancialInfoFields() {
    try {
      const financialInfoFieldsConfig =
        await PLFinancialInfoController.getMandatoryFieldsConfig();

      const financialInfoPrePopulateData =
        await PLFinancialInfoController.getProspectOrCustomerFinancialInfo();

      if (financialInfoPrePopulateData.length > 0) {
        let financialInfoPrePopulateDataObj = financialInfoPrePopulateData[0];

        financialInfoPrePopulateDataObj = {
          ...financialInfoPrePopulateDataObj,
          taxPayerAccNumber:
            financialInfoPrePopulateDataObj.taxPayerAccountNumber,
          salesTaxIdNumber:
            financialInfoPrePopulateDataObj.salesTaxIdentificationNumber,
          expectedTurnOverOne:
            financialInfoPrePopulateDataObj.expectedTurnover1,
          expectedTurnOverTwo:
            financialInfoPrePopulateDataObj.expectedTurnover2,
          expectedTurnOverThree:
            financialInfoPrePopulateDataObj.expectedTurnover3,
          emailPdfInvoicing:
            financialInfoPrePopulateDataObj.emailForPdfInvoicing,
          paymentMethods: financialInfoPrePopulateDataObj.paymentMethod,
        };

        const isFinancialInfoFieldsValid =
          this.checkMandatoryConfigsAndValidateData(
            financialInfoFieldsConfig,
            financialInfoPrePopulateDataObj,
          );

        if (!isFinancialInfoFieldsValid) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log(
        'error while checking financial info mandatory fields :>> ',
        error,
      );
      return false;
    }
  }

  async checkMandatoryFieldsData() {
    try {
      const isBasicInfoMandatoryFieldsValid =
        await this.checkBasicInfoMandatoryFields();
      console.log(
        'isBasicInfoMandatoryFieldsValid :>> ',
        isBasicInfoMandatoryFieldsValid,
      );

      if (!isBasicInfoMandatoryFieldsValid) {
        return false;
      }

      const isCustomerAttributesValid =
        await this.checkCustomerAttributesFields();
      console.log('isCustomerAttributesValid :>> ', isCustomerAttributesValid);

      if (!isCustomerAttributesValid) {
        return false;
      }

      const isContactsValid = await this.checkContactsFields();
      console.log('isContactsValid :>> ', isContactsValid);

      if (!isContactsValid) {
        return false;
      }

      const isRCAValid = await this.checkRCAFields();
      console.log('isRCAValid :>> ', isRCAValid);

      if (!isRCAValid) {
        return false;
      }

      const isFinancialInfoValid = await this.checkFinancialInfoFields();
      console.log('isFinancialInfoValid :>> ', isFinancialInfoValid);

      if (!isFinancialInfoValid) {
        return false;
      }

      return true;
    } catch (error) {
      console.log('error while checking mandatory fields :>> ', error);
      return false;
    }
  }

  async checkSEPAValidation() {
    try {
      const sepaMandatoryForNewCustomerCreation =
        await this.parametersValuesService.getParameterValue(
          'SEPA_Mandatory_For_New_Customer_Creation',
        );

      if (sepaMandatoryForNewCustomerCreation === '1') {
        const sepaMandatoryData =
          await this.customersPaymentMethodsService.checkSEPA();

        if (sepaMandatoryData.length > 0) {
          const finalizedSepaAgreements =
            await this.discoverySepaService.checkSEPAAgreements();

          if (finalizedSepaAgreements.length <= 0) {
            return false;
          }
        }
      }

      return true;
    } catch (error) {
      console.log('error while checking SEPA validation :>> ', error);
      return false;
    }
  }

  async checkTAValidation() {
    try {
      const taMandatoryForNewCustomerCreation =
        await this.parametersValuesService.getParameterValue(
          'TA_Mandatory_For_New_Customer_Creation',
        );

      if (taMandatoryForNewCustomerCreation === '1') {
        const taLinkedWithPreviousCustomerData =
          await this.discoveryPreviousOwnerTradeAssetsService.checkPreviousCustomersTradeAssets();

        if (taLinkedWithPreviousCustomerData.length > 0) {
          for (const taLinkedWithPreviousCustomer of taLinkedWithPreviousCustomerData) {
            if (
              taLinkedWithPreviousCustomer.TOO === '1' &&
              taLinkedWithPreviousCustomer.YAMBS_Status === '0'
            ) {
              return {
                status: false,
                message:
                  'Open Text workflow is not requested for the\nTA Agreements/Condition Agreements to be transferred',
              };
            }

            if (taLinkedWithPreviousCustomer.YAMBS_Status === '0') {
              return {
                status: false,
                message:
                  'Pick up workflow is not requested for the trade assets to be returned',
              };
            }
          }
        }

        const taOfProspectLinkedWithPreviousCustomerData =
          await this.discoveryPreviousOwnerTradeAssetsService.checkPreviousCustomersTradeAssetsWithoutAgreement();

        if (taOfProspectLinkedWithPreviousCustomerData.length > 0) {
          return {
            status: false,
            message:
              'New customer creation can be requested only after the TA associated\nwith previous owner are either taken over/picked up',
          };
        }

        const notFinalizedNewTaAgreementsData =
          await this.discoveryNewTradeAssetsWishedService.checkDiscoveryNewTradeAssetsAgreement();

        if (notFinalizedNewTaAgreementsData.length > 0) {
          return {
            status: false,
            message: 'OPENTEXT workflow is not requested for new trade assets',
          };
        }
      }

      return {
        status: true,
        message: '',
      };
    } catch (error) {
      console.log('error while checking SEPA validation :>> ', error);
      return {
        status: false,
        message: 'Something went wrong',
      };
    }
  }

  async checkConditionValidation() {
    try {
      const conditionMandatoryForNewCustomerCreation =
        await this.parametersValuesService.getParameterValue(
          'Condition_Mandatory_For_New_Customer_Creation',
        );

      if (conditionMandatoryForNewCustomerCreation === '1') {
        const notFinalizedConditionAgreementLinkedToProspectData =
          await this.discoveryConditionAgreementsService.checkProspectLinkedConditionAgreement();

        if (notFinalizedConditionAgreementLinkedToProspectData.length > 0) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log('error while checking SEPA validation :>> ', error);
      return false;
    }
  }

  async updateNewCustomerRequestStatus() {
    return await this.discoveryService.updateNewCustomerRequestStatus();
  }

  async updateReactivateField() {
    return await this.prospectsService.updateReactivateField();
  }

  async createEvent() {
    return await this.eventService.createEvent();
  }

  async checkCustomerCreationRequestSent() {
    const prospectData = await this.discoveryService.getPLProspectInfo();

    const completedStatusData =
      await this.discoveryService.checkCompletedStatus(
        prospectData?.discoveryId,
      );

    if (completedStatusData.length > 0) {
      return true;
    }

    return false;
  }
}
export default new PLNewCustomerController();
