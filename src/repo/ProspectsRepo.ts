import BaseRepo from './BaseRepo';
import Prospects from 'src/storage/OfflineDBStorage/WmDB/models/Prospects';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {getISOCurrentDate} from 'src/utils/CommonUtil';

const ENTITY = OFFLINE_STORAGE.MODEL.PROSPECTS;

export class ProspectsRepo extends BaseRepo<Prospects> {
  /**
   * Function returns true/false based on prospect is deleted or not
   * @returns
   */
  async deleteProspect(discoveryId: string) {
    const collection = this.getCollection(ENTITY);

    const employeeInfo = await this.getLoggedInEmployeeInfo();
    const employeeNo =
      employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
    const currentDate = getISOCurrentDate();

    const prospectObj = await collection
      .query(Q.where('discovery_id', discoveryId))
      .fetch();

    if (prospectObj.length > 0) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await prospectObj[0].update((rec: any) => {
          rec.deleteProspect = '1';
          rec.updateEmployeeNumber = employeeNo;
          rec.updateDatetime = currentDate;
          rec.sentDatetime = null;
        });
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * Function returns true/false based on prospect is updated or not
   * @returns
   */
  async updateProspectData(discoveryId: string, prospectData: any) {
    try {
      const collection = this.getCollection(ENTITY);

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const idCallCenter =
        employeeInfo.length > 0 ? employeeInfo[0].idCallCenter : '';

      const currentDate = getISOCurrentDate();

      const prospectInfo = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      if (prospectInfo.length > 0) {
        const prospectObj = prospectInfo[0];

        const name = prospectData?.name ? prospectData.name : '';
        const outlet = prospectData?.outletClassification
          ? prospectData.outletClassification
          : '';
        const phone = prospectData?.phoneNumber ? prospectData.phoneNumber : '';
        const mailAddress = prospectData?.email ? prospectData.email : '';
        const houseNumber = prospectData?.streetNumber
          ? prospectData.streetNumber
          : '';
        const address = prospectData?.address ? prospectData.address : '';
        const postalCode = prospectData?.zipCode ? prospectData.zipCode : '';
        const city = prospectData?.city ? prospectData.city : '';
        const country = prospectData?.country ? prospectData.country : '';
        const affiliationHierarchyNode = prospectData?.customerHierarchy
          ? prospectData.customerHierarchy
          : '';
        const fsrEmployeeNumber = prospectData?.employeeName
          ? prospectData.employeeName
          : '';
        const idTerritory = prospectData?.idTerritory
          ? prospectData.idTerritory
          : '';
        const previousCustomerShipTo = prospectData?.previousCustomerShipTo
          ? prospectData.previousCustomerShipTo
          : '';
        const salesOrganization = prospectData?.salesOrganization
          ? prospectData.salesOrganization
          : '';
        const distributionChannel = prospectData?.distributionChannel
          ? prospectData.distributionChannel
          : '';

        await OFFLINE_STORAGE.getDB().write(async () => {
          await prospectObj.update((rec: any) => {
            rec.name1 = name;
            rec.industryCode = outlet;
            rec.phone1 = phone;
            rec.mailAddress = mailAddress;
            rec.houseNumber = houseNumber;
            rec.address1 = address;
            rec.postalCode = postalCode;
            rec.city = city;
            rec.country = country;
            rec.affiliationHierarchyNode = affiliationHierarchyNode;
            rec.idCallCenter = idCallCenter;
            rec.sentDatetime = null;
            rec.updateEmployeeNumber = employeeNo;
            rec.updateDatetime = currentDate;
            rec.employeeNumber = fsrEmployeeNumber;
            rec.idTerritory = idTerritory;

            if (previousCustomerShipTo !== '') {
              rec.previousCustomerShipTo = previousCustomerShipTo;
              rec.previousCustomerSalesOrganization = salesOrganization;
              rec.previousCustomerDistributionChannel = distributionChannel;
            }
          });
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('updateProspectData error :>> ', error);
      return false;
    }
  }

  /**
   * create new prospect - prospect info insert function
   * Function returns true/false based on prospect is inserted or not
   * discoveryId, prospectData - get from screen
   * @returns
   */
  async saveProspectData(
    discoveryId: string,
    prospectData: any,
    prospectIdTerritory: any,
    previousCustomerBasicInfoData: any,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const employeeInfo = await this.getLoggedInEmployeeInfo();

      const idCallCenter =
        employeeInfo.length > 0 ? employeeInfo[0].idCallCenter : '';

      const prospectIdTerritoryData =
        prospectIdTerritory.length > 0 ? prospectIdTerritory[0] : {};

      const previousCustomerBasicInfo =
        previousCustomerBasicInfoData.length > 0
          ? previousCustomerBasicInfoData[0]
          : {};

      const name1 = prospectData.name ? prospectData.name : '';
      const outlet = prospectData.outletClassification
        ? prospectData.outletClassification
        : '';
      const phone = prospectData.phoneNumber ? prospectData.phoneNumber : '';
      const mailAddress = prospectData.email ? prospectData.email : '';
      const houseNumber = prospectData.streetNumber
        ? prospectData.streetNumber
        : '';
      const address1 = prospectData.address ? prospectData.address : '';
      const postalCode = prospectData.zipCode ? prospectData.zipCode : '';
      const city = prospectData.city ? prospectData.city : '';
      const affiliationHierarchyNode = prospectData?.customerHierarchy
        ? prospectData.customerHierarchy
        : '';
      const country = prospectData?.country ? prospectData.country : '';
      const fsrEmployeeNumber = prospectData?.employeeName
        ? prospectData.employeeName
        : '';

      const idTerritory = prospectIdTerritoryData?.idTerritory
        ? prospectIdTerritoryData.idTerritory
        : '';

      const previousCustomerShipTo = prospectData?.previousCustomerShipTo
        ? prospectData.previousCustomerShipTo
        : '';

      const salesOrganization = prospectData.salesOrganization;
      const distributionChannel = prospectData.distributionChannel;

      // previous customer basic info
      const phone2 = previousCustomerBasicInfo?.contact1Phone2
        ? previousCustomerBasicInfo.contact1Phone2
        : '';
      const name3 = previousCustomerBasicInfo?.name3
        ? previousCustomerBasicInfo.name3
        : '';
      const street1 = previousCustomerBasicInfo?.street1
        ? previousCustomerBasicInfo.street1
        : '';
      const street2 = previousCustomerBasicInfo?.street2
        ? previousCustomerBasicInfo.street2
        : '';
      const street3 = previousCustomerBasicInfo?.street3
        ? previousCustomerBasicInfo.street3
        : '';
      const postalBox = previousCustomerBasicInfo?.postalBox
        ? previousCustomerBasicInfo.postalBox
        : '';
      const postalCodeBox = previousCustomerBasicInfo?.postalCodeBox
        ? previousCustomerBasicInfo.postalCodeBox
        : '';
      const cityBox = previousCustomerBasicInfo?.cityBox
        ? previousCustomerBasicInfo.cityBox
        : '';

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.discoveryId = discoveryId;
          rec.name1 = name1;
          rec.industryCode = outlet;
          rec.phone1 = phone;
          rec.mailAddress = mailAddress;
          rec.houseNumber = houseNumber;
          rec.address1 = address1;
          rec.postalCode = postalCode;
          rec.city = city;
          rec.sentDatetime = null;
          rec.affiliationHierarchyNode = affiliationHierarchyNode;
          rec.country = country;
          rec.idCallCenter = idCallCenter;
          rec.employeeNumber = fsrEmployeeNumber;

          rec.idTerritory = idTerritory;
          rec.deleteProspect = '0';
          rec.delegated = '0';

          if (previousCustomerShipTo !== '') {
            rec.previousCustomerShipTo = previousCustomerShipTo;
            rec.phone2 = phone2;
            rec.name3 = name3;
            rec.street1 = street1;
            rec.street2 = street2;
            rec.street3 = street3;
            rec.postalBox = postalBox;
            rec.postalCodeBox = postalCodeBox;
            rec.cityBox = cityBox;

            rec.previousCustomerSalesOrganization = salesOrganization;
            rec.previousCustomerDistributionChannel = distributionChannel;
          }
        });
      });
      return true;
    } catch (error) {
      console.log('saveProspectData error :>> ', error);
      return false;
    }
  }

  /**
   * Function returns Prospect information based on discoveryId for overview screen
   * @returns
   */
  async getProspectInfo() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        "select phone1 as phoneNumber, coalesce(address1, '') || ' ' || coalesce(house_number, '') " +
        "|| ' ' || coalesce(city, '') || ' ' || coalesce(postal_code, '') as address, " +
        'mail_address as email from prospects inner join ' +
        'discovery on discovery.discovery_id = prospects.discovery_id ' +
        'where discovery.discovery_id = ? ';

      const QUERY_VALUES = [discoveryId];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getProspectInfo error :>> ', error);
      return [];
    }
  }

  /**
   * Function stores customer data in prospects table before navigating to PLP
   * @returns
   */
  async storeCustomerDataInProspects(
    discoveryId: string,
    salesOrganization: string,
    distributionChannel: string,
    industryCode: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      await OFFLINE_STORAGE.getDB().write(async () => {
        await collection.create((rec: any) => {
          rec.discoveryId = discoveryId;
          rec.salesOrganization = salesOrganization;
          rec.distributionChannel = distributionChannel;
          rec.industryCode = industryCode;
          rec.deleteProspect = '0';
          rec.sentDatetime = null;
        });
      });
      return true;
    } catch (error) {
      console.log('storeCustomerDataInProspects error :>> ', error);
      return false;
    }
  }

  /**
   * Prepoluate Prospect Basic info - ShipTo data in PLP screen
   */
  async getPLPProspectShipToData() {
    const collection = this.getCollection(ENTITY);
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';
    const QUERY =
      'select prospects.industry_code as outlet, ' +
      'cic.description_language_1 as description, ' +
      'affiliation_hierarchy_node as customerHierarchy, ' +
      'name1, name2, name3, name4, ' +
      'house_number as houseNumber, ' +
      'address1, coalesce(street1,"") as address2, ' +
      'coalesce(street2,"") as address3, ' +
      'coalesce(street3,"") as coOrStreet3, ' +
      'postal_code as zipCode, coalesce(city,"") as city, ' +
      'postal_box as poBox, city_box, country, ' +
      'coalesce(mail_address,"") as email, ' +
      'coalesce(phone1,"") as phoneNumber, ' +
      'coalesce(phone2,"") as mobileNumber, ' +
      'coalesce(fax,"") as fax, ' +
      'discovery.web_site as website, ' +
      'coalesce(latitude,0) as latitude , ' +
      'coalesce(longitude,0) as longitude , ' +
      'prospects.shop_number_or_filial_number as shopNumber, ' +
      'prospects.kanton , coalesce(prospects.language,"") as language, ' +
      'prospects.channel_type as distributionChannel, ' +
      'prospects.previous_customer_ship_to as previousCustomerShipTo ' +
      'from prospects ' +
      'inner join discovery ' +
      'on discovery.discovery_id = prospects.discovery_id ' +
      'left outer join customers_industry_codes cic on ' +
      `cic.industry_code = prospects.industry_code ` +
      `where prospects.discovery_id = '${discoveryId}' `;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Update Prospect Basic Info - Ship to data in PLP screen
   */
  async updatePLPProspectShipToData(prospectData: any) {
    try {
      const prospect = await this.getPLProspectInfo();
      const discoveryId = prospect?.discoveryId ? prospect.discoveryId : '';

      const collection = this.getCollection(ENTITY);

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';

      const currentDate = getISOCurrentDate();

      const prospectInfo = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();

      if (prospectInfo.length > 0) {
        const prospectObj = prospectInfo[0];

        const outlet = prospectData?.outlet
          ? prospectData.outlet
          : prospectObj.industryCode;
        const affiliationHierarchyNode = prospectData?.customerHierarchy
          ? prospectData.customerHierarchy
          : prospectObj.affiliationHierarchyNode;

        const name1 = prospectData?.name1
          ? prospectData.name1
          : prospectObj.name1;

        const name2 = prospectData?.name2
          ? prospectData.name2
          : prospectObj.name2;

        const name3 = prospectData?.name3
          ? prospectData.name3
          : prospectObj.name3;

        const name4 = prospectData?.name4
          ? prospectData.name4
          : prospectObj.name4;

        const houseNumber = prospectData?.houseNumber
          ? prospectData.houseNumber
          : prospectObj.houseNumber;

        const address1 = prospectData?.address1
          ? prospectData.address1
          : prospectObj.address1;

        const street1 = prospectData?.address2
          ? prospectData.address2
          : prospectObj.street1;

        const street2 = prospectData?.address3
          ? prospectData.address3
          : prospectObj.street2;

        const street3 = prospectData?.coOrStreet3
          ? prospectData.coOrStreet3
          : prospectObj.street3;

        const postalCode = prospectData?.zipCode
          ? prospectData.zipCode
          : prospectObj.postalCode;
        const city = prospectData?.city ? prospectData.city : prospectObj.city;
        const postalBox = prospectData?.poBox
          ? prospectData.poBox
          : prospectObj.postalBox;

        const country = prospectData?.country
          ? prospectData.country
          : prospectObj.country;

        const mailAddress = prospectData?.email
          ? prospectData.email
          : prospectObj.mailAddress;

        const phone1 = prospectData?.phoneNumber
          ? prospectData.phoneNumber
          : prospectObj.phone1;
        const phone2 = prospectData?.mobileNumber
          ? prospectData.mobileNumber
          : prospectObj.phone2;

        const fax = prospectData?.fax ? prospectData.fax : prospectObj.fax;
        const shopNumberOrFilialNumber = prospectData?.shopNumber
          ? prospectData.shopNumber
          : prospectObj.shopNumberOrFilialNumber;
        const language = prospectData?.language
          ? prospectData.language
          : prospectObj.language;

        const previousCustomerShipTo = prospectData?.previousCustomerShipTo
          ? prospectData.previousCustomerShipTo
          : prospectObj.previousCustomerShipTo;

        const channelType = prospectData?.distributionChannel
          ? prospectData.distributionChannel
          : prospectObj.channelType;
        const latitude = prospectData?.latitude
          ? prospectData.latitude
          : prospectObj.latitude;
        const longitude = prospectData?.longitude
          ? prospectData.longitude
          : prospectObj.longitude;

        await OFFLINE_STORAGE.getDB().write(async () => {
          await prospectObj.update((rec: any) => {
            rec.industryCode = outlet;
            rec.affiliationHierarchyNode = affiliationHierarchyNode;
            rec.name1 = name1;
            rec.name2 = name2;
            rec.name3 = name3;
            rec.name4 = name4;
            rec.houseNumber = houseNumber;
            rec.address1 = address1;
            rec.street1 = street1;
            rec.street2 = street2;
            rec.street3 = street3;
            rec.postalCode = postalCode;
            rec.city = city;
            rec.postalBox = postalBox;
            rec.country = country;
            rec.mailAddress = mailAddress;
            rec.phone1 = phone1;
            rec.phone2 = phone2;
            rec.fax = fax;
            rec.shopNumberOrFilialNumber = shopNumberOrFilialNumber;
            rec.language = language;
            rec.channelType = channelType;
            rec.sentDatetime = null;
            rec.updateEmployeeNumber = employeeNo;
            rec.updateDatetime = currentDate;
            rec.previousCustomerShipTo = previousCustomerShipTo;
            rec.latitude = latitude;
            rec.longitude = longitude;
          });
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('updatePLPProspectShipToData error :>> ', error);
      return false;
    }
  }

  /**
   * PLP -> SEPA Agreement - not available
   * @returns
   */
  async getPLPSepAgreementNotAvailableInfo() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        `select p.name1, p.name2, p.name3, p.house_number as houseNumber, ds.prospect_number as customerNo, p.phone1 as generateAgreementNo, ` +
        'p.address1 as street, p.city, p.postal_code as postalCode,  ' +
        " 'Open' as status, '0' as sepaStatus, '1' as agreementType " +
        'from prospects p inner join discovery ds  on p.discovery_id = ds.discovery_id ' +
        `where p.discovery_id = '${discoveryId}' `;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getPLPSepaAgreementNotAvailableInfo error :>> ', error);
      return [];
    }
  }

  /**
   * PLP -> SEPA Agreement -  available
   * @returns
   */
  async getPLPSepaProspectsAgreementAvailableInfo() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        'select ds.signature_customer as customerSignature, d.prospect_number as customerNo, ' +
        'ds.mandate_reference_number as mandateReferenceNumber, ' +
        'ds.sepa_agreement_number as agreementNumber, ' +
        'ds.account_holder_name as nameOfAccountHolder, p.name1, p.name2, p.name3, p.house_number as houseNumber, ' +
        'p.address1 as street, p.city, p.postal_code as postalCode, ds.bank_name as bankName, p.phone1 as generateAgreementNo, ' +
        'ds.iban as ibanNumber, ' +
        "case when ds.sepa_signed_datetime is null then '' " +
        'else ds.sepa_signed_datetime end as signedDate, ' +
        "case when ds.sepa_status = '0' then 'Open' " +
        "when ds.sepa_status = '1' then 'Signed without Finalization' " +
        "when ds.sepa_status is null then 'Open' " +
        "else 'Signed With Finalize' end as status, ds.sepa_status as sepaStatus, " +
        'ds.form_type as agreementType from prospects p ' +
        'inner join discovery_sepa ds on p.discovery_id = ds.discovery_id ' +
        'inner join discovery d  on p.discovery_id = d.discovery_id ' +
        `where p.discovery_id = '${discoveryId}' `;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getPLPSepaAgreementAvailableInfo error :>> ', error);
      return [];
    }
  }

  /**
   * PLP -> TA Agreement - Previous customer details
   * @returns
   */
  async getPreviousCustomerDetails() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        "select coalesce(previous_customer_ship_to, '') as previousCustomerShipTo, " +
        "coalesce(previous_customer_sales_organization, '') as previousCustomerSalesOrganization, " +
        "coalesce(previous_customer_distribution_channel, '') as previousCustomerDistributionChannel " +
        'from prospects where discovery_id = ?';

      const QUERY_VALUES = [discoveryId];

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getPreviousCustomerDetails error :>> ', error);
      return [];
    }
  }

  /**
   * Update reactivate field
   * @returns boolean
   */
  async updateReactivateField() {
    try {
      const collection = this.getCollection(ENTITY);
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const currentDate = getISOCurrentDate();
      const prospectObj = await collection
        .query(Q.where('discovery_id', discoveryId))
        .fetch();
      try {
        if (prospectObj.length > 0) {
          await OFFLINE_STORAGE.getDB().write(async () => {
            await prospectObj[0].update((rec: any) => {
              rec.reactivate = '1';
              rec.sentDatetime = null;
              rec.updateEmployeeNumber = employeeNo;
              rec.updateDatetime = currentDate;
            });
          });
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    } catch (error) {
      console.log('update reactivate field error ', error);
      return false;
    }
  }

  /**
   * PLP -> Trade asset request prospect
   */
  async getTaRequestProspectAgreementPreview() {
    try {
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const collection = this.getCollection(ENTITY);
      const QUERY =
        'SELECT DISTINCT COALESCE(Discovery.Prospect_Number, Discovery.External_Prospect_Number) AS customerNumber, ' +
        "COALESCE(Prospects.Name1, '') AS name1, " +
        "COALESCE(prospects.Name2, '') AS name2, " +
        "COALESCE(Prospects.Name3, '') AS name3, " +
        "COALESCE(Prospects.Name4, '') AS addressStreet2, " +
        "COALESCE(Prospects.Address1, '') AS street1, " +
        'Prospects.Postal_Code AS postalCode, ' +
        'Prospects.City AS city, ' +
        'Prospects.House_Number AS houseNumber, ' +
        "COALESCE(Discovery_Financial_Data.TA_Minimum_Turnover_Explained, '') AS deliveryFee " +
        'FROM Prospects ' +
        'INNER JOIN Discovery ON Prospects.Discovery_Id = Discovery.Discovery_Id ' +
        'LEFT JOIN Discovery_Financial_Data ON Discovery.Discovery_Id = Discovery_Financial_Data.Discovery_Id ' +
        `WHERE Discovery.Discovery_Id = '${discoveryId}' `;

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getTaRequestProspectAgreementPreview error :>> ', error);
      return [];
    }
  }

  /**
   * get prospect country code
   */
  async getProspectCountryCode() {
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';
    const collection = this.getCollection(ENTITY);
    const QUERY =
      'select coalesce(country,"") as country, ' +
      'coalesce(cc.id_region,"") as idRegion ' +
      'from prospects p inner join discovery d on p.discovery_id = d.discovery_id ' +
      'inner join employees e on p.employee_number = e.employee_number ' +
      'inner join call_centers cc on cc.id_call_center = e.id_call_center ' +
      `where p.discovery_id = "${discoveryId}" and p.delete_prospect <>'1'`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * get customer country code
   */
  async getCustomerCountryCode() {
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';

    const collection = this.getCollection(ENTITY);
    const QUERY =
      "select coalesce(sales_organization,'') as salesOrganization " +
      'from prospects p ' +
      `where discovery_id = "${discoveryId}" and p.delete_prospect <>'1'`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * TA -> Fetch communication language and country code of prospect
   */
  async fetchLanguageAndCountryCodeOfProspect(discoveryId: string) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY = `select language, country from prospects 
        where discovery_id ='${discoveryId}'`;

      const results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('fetchLanguageAndCountryCodeOfProspect error :>> ', error);
      return [];
    }
  }
}
