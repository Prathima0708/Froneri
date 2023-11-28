import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import DiscoveryConditionAgreements from 'src/storage/OfflineDBStorage/WmDB/models/DiscoveryConditionAgreements';
import {getISOCurrentDate, getServerDate} from 'src/utils/CommonUtil';

const ENTITY = OFFLINE_STORAGE.MODEL.DISCOVERY_CONDITION_AGREEMENTS;
const PROSPECT_ENTITY = OFFLINE_STORAGE.MODEL.PROSPECTS;
const DISCOVERY_LIST_VALUES_ENTITY =
  OFFLINE_STORAGE.MODEL.DISCOVERY_LIST_VALUES;

export class DiscoveryConditionAgreementsRepo extends BaseRepo<DiscoveryConditionAgreements> {
  /**
   * Function returns condition agreement status
   * @returns
   */
  async checkConditionAgreement(discoveryId: string) {
    const collection = this.getCollection(ENTITY);

    const QUERY =
      'select discovery_id as discoveryId from discovery_condition_agreements ' +
      "where [discovery_id] = ? and file_name is not  null and file_name <> ''";

    const QUERY_VALUES = [discoveryId];

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
      .unsafeFetchRaw();

    if (results) {
      return results;
    } else {
      return [];
    }
  }

  /**
   * Function returns prospect linked condition agreement status
   * @returns
   */
  async checkProspectLinkedConditionAgreement() {
    try {
      const collection = this.getCollection(ENTITY);

      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        'SELECT Discovery_Id ' +
        'FROM Discovery_Condition_Agreements ' +
        `WHERE Discovery_Id = '${discoveryId}' ` +
        "AND Deleted <>'1' " +
        "AND Conditions_Status <> '0'";

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      if (results && results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  /**
   * PLP - CA agreement -> get CA agreement
   * @returns
   */
  async getConditionalAgreement(
    isFilterApplied: boolean,
    idContractType: number,
  ) {
    const collection = this.getCollection(ENTITY);

    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';

    let BASE_QUERY =
      'select dca.condition_agreement_number as conditionAgreementNumber, ' + //
      'dca.ice_start_date as iceStartDate, ' + //
      'dca.ice_conditions_html as iceConditionsHtml, ' + //
      'dca.ice_end_date as iceEndDate, ' + //
      'dca.frozenfood_start_date as frozenfoodStartDate, ' + //
      'dca.frozenfood_end_date as frozenfoodEndDate, ' + //
      "create_emp.first_name || ' ' || create_emp.last_name as createdby, " + //
      "update_emp.first_name || ' ' || update_emp.last_name as updatedby, " + //
      // 'dca.creation_datetime as creationDatetime, ' + //
      "strftime('%d-%m-%Y', dca.creation_datetime) as creationDatetime, " +
      "strftime('%d-%m-%Y',dca.update_datetime) as updateDatetime, " + //
      "strftime('%d-%m-%Y',dca.conditions_signed_datetime) as conditionsSignedDatetime, " + //
      "case when dca.conditions_status = '0' then 'Open' else 'Finalized' end as [status], " + //
      "coalesce(dca.ice_conditions, '') as iceConditions, " +
      "coalesce(dca.frozenfood_conditions, '') as frozenfoodConditions, " +
      'dca.yambs_status as yambsStatus, ' +
      'dca.conditions_status as conditionsStatus, ' +
      'dca.justification as justification, ' +
      'dca.creation_employee_number as creationEmployeeNumber, ' +
      'dca.update_employee_number as updateEmployeeNumber, ' +
      'dca.deleted as deleted, ' +
      'dca.file_name as fileName, ' +
      'dca.signature_customer as signatureCustomer, ' +
      'dca.signature_employee as signatureEmployee, ' +
      'dca.sent_datetime as sentDatetime, ' +
      'dca.id_contract_type as idContractType ' +
      'from discovery_condition_agreements as dca ' +
      'inner join employees as create_emp on dca.creation_employee_number = create_emp.employee_number ' +
      'left join employees as update_emp  on dca.update_employee_number = update_emp.employee_number ' +
      `where dca.deleted = '0' and dca.discovery_id = '${discoveryId}'`;

    if (isFilterApplied) {
      BASE_QUERY += ` and dca.id_contract_type = ${idContractType}`;
    }

    let results = await collection
      .query(Q.unsafeSqlQuery(BASE_QUERY))
      .unsafeFetchRaw();
    return results;
  }

  /**
   * PLP - CA agreement -> insert/update CA agreement
   * @returns
   */
  async insertOrUpdateConditionalAgreement(
    conditionalAgreementDataData: any,
    agreementNumber: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const prospectData = await this.getPLProspectInfo();
      const currentDate = getISOCurrentDate();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';
      const isFinalizing = conditionalAgreementDataData?.isFinalizing
        ? conditionalAgreementDataData.isFinalizing
        : false;

      const conditionalAgreementDataObj = await collection
        .query(Q.where('condition_agreement_number', agreementNumber))
        .fetch();

      const iceStartDate = conditionalAgreementDataData?.iceStartDate
        ? getServerDate(conditionalAgreementDataData?.iceStartDate)
        : '';
      const iceEndDate = conditionalAgreementDataData?.iceEndDate
        ? getServerDate(conditionalAgreementDataData?.iceEndDate)
        : '';
      const iceConditions = conditionalAgreementDataData?.iceConditions ?? '';
      const frozenfoodStartDate =
        conditionalAgreementDataData?.frozenfoodStartDate
          ? getServerDate(conditionalAgreementDataData?.frozenfoodStartDate)
          : '';
      const frozenfoodEndDate = conditionalAgreementDataData?.frozenfoodEndDate
        ? getServerDate(conditionalAgreementDataData?.frozenfoodEndDate)
        : '';
      const frozenfoodConditions =
        conditionalAgreementDataData?.frozenfoodConditions ?? '';
      const signatureCustomer = conditionalAgreementDataData?.signatureCustomer
        ? conditionalAgreementDataData?.signatureCustomer
        : '';
      const signatureEmployee = conditionalAgreementDataData?.signatureEmployee
        ? conditionalAgreementDataData?.signatureEmployee
        : '';
      const justification = conditionalAgreementDataData?.justification ?? '';
      const idContractType = conditionalAgreementDataData?.idContractType ?? '';
      const iceConditionsHtml = conditionalAgreementDataData?.htmlContent ?? '';
      const conditionsSignedDatetime =
        conditionalAgreementDataData?.conditionsSignedDatetime ?? '';

      if (conditionalAgreementDataObj.length > 0) {
        //update
        await OFFLINE_STORAGE.getDB().write(async () => {
          await conditionalAgreementDataObj[0].update((rec: any) => {
            if (isFinalizing) {
              rec.yambsStatus = '2';
              rec.conditionsStatus = '1';
            } else {
              rec.iceStartDate = iceStartDate;
              rec.iceEndDate = iceEndDate;
              rec.frozenfoodStartDate = frozenfoodStartDate;
              rec.frozenfoodEndDate = frozenfoodEndDate;
              rec.iceConditions = iceConditions;
              rec.frozenfoodConditions = frozenfoodConditions;
              rec.updateEmployeeNumber = employeeNo;
              rec.updateDatetime = currentDate;
            }
            rec.signatureCustomer = signatureCustomer;
            rec.signatureEmployee = signatureEmployee;
            rec.justification = justification;
            rec.sentDatetime = null;
            rec.iceConditionsHtml = iceConditionsHtml;

            if (
              signatureCustomer &&
              signatureEmployee &&
              !conditionsSignedDatetime
            ) {
              rec.conditionsSignedDatetime = currentDate;
            }
          });
        });
      } else {
        // insert
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.conditionAgreementNumber = agreementNumber;
            rec.iceStartDate = iceStartDate;
            rec.iceEndDate = iceEndDate;
            rec.iceConditions = iceConditions;
            rec.frozenfoodStartDate = frozenfoodStartDate;
            rec.frozenfoodEndDate = frozenfoodEndDate;
            rec.frozenfoodConditions = frozenfoodConditions;
            rec.signatureCustomer = signatureCustomer;
            rec.signatureEmployee = signatureEmployee;
            rec.justification = justification;
            rec.creationEmployeeNumber = employeeNo;
            rec.updateEmployeeNumber = null;
            rec.creationDatetime = currentDate;
            rec.updateDatetime = null;
            rec.conditionsStatus = '0';
            rec.yambsStatus = '0';
            rec.deleted = '0';
            if (signatureCustomer && signatureEmployee) {
              rec.conditionsSignedDatetime = currentDate;
            } else {
              rec.conditionsSignedDatetime = null;
            }
            rec.sentDatetime = null;
            rec.idContractType = idContractType;
            rec.iceConditionsHtml = iceConditionsHtml;
          });
        });
      }
      return true;
    } catch (error) {
      console.log('insertOrUpdateConditionalAgreement error :>> ', error);
      return false;
    }
  }

  /**
   * get CA dropdown values
   */
  async getCADropdownValues(countryCode: string) {
    const collection = this.getCollection(DISCOVERY_LIST_VALUES_ENTITY);
    const QUERY =
      'select id_contract_type as idContractType, ' +
      'description_language_1 as description, ' +
      'country_code as countryCode, ' +
      'template_name as templateName, ' +
      'file_share_path as fileSharePath, ' +
      'email_address as emailAddress, ' +
      'cc_email_address as ccEmailAddress, ' +
      'signature_required as signatureRequired, ' +
      'opentext_relevant as openTextRelevant ' +
      'from contract_type ' +
      `where country_code ='${countryCode}'` +
      'order by description_language_1';

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * get CA agreement prospect
   */
  async getConditionAgreementForProspect() {
    const collection = this.getCollection(DISCOVERY_LIST_VALUES_ENTITY);
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';

    const QUERY =
      'select distinct ' +
      'coalesce(discovery.prospect_number, discovery.external_prospect_number) as customernumber, ' +
      'coalesce(prospects.name1, "") as name1, ' +
      'coalesce(prospects.name2, "") as name2, ' +
      'coalesce(prospects.name3, "") as name3, ' +
      'coalesce(prospects.name4, "") as addressstreet2, ' +
      'coalesce(prospects.address1, "") as street1, ' +
      // 'prospects.owner_deputy_dob as dob, ' +
      // "coalesce(prospects.owner_deputy_first_name || ' ' || prospects.owner_deputy_last_name, '') as owner, " +
      'coalesce(discovery_financial_data.tax_payer_account_number, "") as taxnumber, ' +
      'coalesce(discovery_financial_data.sales_tax_identification_number, "") as salestaxidentificationnumber, ' +
      'prospects.postal_code as postalcode, ' +
      'prospects.city as city, ' +
      'prospects.house_number as housenumber, ' +
      'coalesce(discovery_financial_data.expected_turnover_1, "") as expectedturnover1, ' +
      'coalesce(discovery_financial_data.expected_turnover_2, "") as expectedturnover2, ' +
      'coalesce(discovery_financial_data.expected_turnover_3, "") as expectedturnover3, ' +
      'coalesce(discovery_sepa.bank_name, "") as bankname, ' +
      'coalesce(discovery_sepa.bic, "") as bic, ' +
      'coalesce(discovery_sepa.iban, "") as iban, ' +
      'coalesce(prospects.phone1, "") as phone, ' +
      "'' as vatregistration_number, " +
      'coalesce(prospects.mail_address, "") as mailaddress, ' +
      'coalesce(discovery_contacts1.first_name_contact_1, "") as contactname, ' +
      // "coalesce(designation_description1.designation_contact_1, '') || ' ' || coalesce(discovery_contacts1.first_name_contact_1, '') || ' ' || coalesce(discovery_contacts1.last_name_contact_1, '') as contactfirstlastname, " +
      'coalesce(discovery_contacts1.phone_num_contact_1, "") as contact1phone1, ' +
      'coalesce(discovery_contacts1.email_contact_1, "") as contactmailaddress, ' +
      "'' as address1soldto, " +
      "'' as citysoldto, " +
      "'' as postalcodesoldto " +
      'from prospects ' +
      'inner join discovery on prospects.discovery_id = discovery.discovery_id ' +
      'left join discovery_financial_data on discovery.discovery_id = discovery_financial_data.discovery_id ' +
      'left join discovery_sepa on discovery.discovery_id = discovery_sepa.discovery_id ' +
      'left join discovery_contacts as discovery_contacts1 on prospects.discovery_id = discovery_contacts1.discovery_id ' +
      `left join (select person_title, description_language_1 as designation_contact1 from person_titles) designation_description1 on designation_description1.person_title = discovery_contacts1.designation_contact_1 where discovery.discovery_id ='${discoveryId}'`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * get CA agreement customer
   */
  async getConditionAgreementForCustomer() {
    const collection = this.getCollection(DISCOVERY_LIST_VALUES_ENTITY);
    const prospectData = await this.getPLProspectInfo();
    const discoveryId = prospectData?.discoveryId
      ? prospectData.discoveryId
      : '';

    const QUERY =
      "select distinct coalesce(customers.customer_ship_to, '') as customernumber, " +
      "coalesce(customers.name1, '') as name1, " +
      "coalesce(customers.name2, '') as name2, " +
      "coalesce(customers.name3, '') as name3, " +
      "coalesce(customers.address1, '') as street1, " +
      "coalesce(customers.name4, '') as addressstreet2, " +
      // 'prospects.owner_deputy_dob as dob, ' +
      // "coalesce(prospects.owner_deputy_first_name || ' ' || prospects.owner_deputy_last_name, '') as owner, " +
      "coalesce(discovery_financial_data.tax_payer_account_number, '') as taxnumber, " +
      "coalesce(discovery_financial_data.sales_tax_identification_number, '') as salestaxidentificationnumber, " +
      "coalesce(customers_banks_information.iban_encrypted,'') as iban, " +
      'customers.postal_code as postalcode, ' +
      'customers.city as city, ' +
      'customers.house_number as housenumber, ' +
      "coalesce(customers_additional_information.expected_turnover_1, '') as expectedturnover1, " +
      "coalesce(customers_additional_information.expected_turnover_2, '') as expectedturnover2, " +
      "coalesce(customers_additional_information.expected_turnover_3, '') as expectedturnover3, " +
      "coalesce(customers.contact1_phone_1, '') as phone, " +
      "coalesce(customers_financial_information.vat_registration_number_encrypted, '') as vatregistrationnumber, " +
      "coalesce(customers.contact1_mail_address,'') as mailaddress, " +
      "coalesce(contact1_name, '') as contactname, " +
      "coalesce(contact1_name, '') as contactfirstlastname, " +
      "coalesce(customers.contact1_phone_1, '') as contact1phone1, " +
      "coalesce(customers.contact1_mail_address, '') as contactmailaddress, " +
      "coalesce(customers_sold_to.address1_sold_to,'') as address1soldto, " +
      "coalesce(customers_sold_to.city_sold_to,'') as citysoldto, " +
      "coalesce(customers_sold_to.postal_code_sold_to,'') as postalcodesoldto " +
      'from customers inner join discovery on customers.customer_ship_to = discovery.customer_ship_to ' +
      'inner join prospects on discovery.discovery_id = prospects.discovery_id ' +
      'inner join customers_sold_to on customers.customer_ship_to = customers_sold_to.customer_ship_to and ' +
      'customers.sales_organization = customers_sold_to.sales_organization and ' +
      'customers.distribution_channel = customers_sold_to.distribution_channel ' +
      'left join customers_additional_information on customers_additional_information.customer_hierarchy_node = customers.customer_ship_to ' +
      'left join discovery_financial_data on discovery_financial_data.discovery_id = discovery.discovery_id ' +
      'left join customers_financial_information on customers.customer_ship_to = customers_financial_information.customer_ship_to ' +
      'left join customers_banks_information on customers.customer_ship_to = customers_banks_information.customer_ship_to and ' +
      'customers.sales_organization = customers_banks_information.sales_organization and ' +
      'customers.distribution_channel = customers_banks_information.distribution_channel ' +
      `where discovery.discovery_id ="${discoveryId}"`;

    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();

    return results;
  }

  /**
   * Delete condition agreement
   */
  async deleteConditionAgreement(conditionAgreementNumber: string) {
    const collection = this.getCollection(ENTITY);
    let entity: any = undefined;

    // if exists, update. else create.
    if (conditionAgreementNumber) {
      entity = await collection
        .query(Q.where('condition_agreement_number', conditionAgreementNumber))
        .fetch();
    }

    if (entity) {
      await OFFLINE_STORAGE.getDB().write(async () => {
        await entity[0].update((rec: any) => {
          rec.deleted = '1';
          rec.sentDatetime = null;
        });
      });
    } else {
      return undefined;
    }
  }

  /*
   * Function returns Contract Type
   * @returns
   */
  async getConditionAgreementHtmlTemplate() {
    try {
      const collection = this.getCollection(ENTITY);
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';
      const agreementNumber = '';
      let results = await collection
        .query(
          Q.unsafeSqlQuery(
            'SELECT Discovery_Condition_Agreements.ICE_Conditions_HTML ' +
              'FROM Discovery_Condition_Agreements ' +
              `WHERE Discovery_Condition_Agreements.Discovery_ID = '${discoveryId}' AND ` +
              `Discovery_Condition_Agreements.Condition_Agreement_Number = '${agreementNumber}' `,
          ),
        )
        .unsafeFetchRaw();

      if (results) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  /**
   * PLP - insert or update discovery condition agreement
   * @returns
   */
  async insertOrUpdateDiscoveryConditionalAgreement(
    conditionalAgreementDataData: any,
  ) {
    try {
      const collection = this.getCollection(ENTITY);
      const employeeInfo = await this.getLoggedInEmployeeInfo();
      const employeeNo =
        employeeInfo.length > 0 ? employeeInfo[0].employeeNumber : '';
      const prospectData = await this.getPLProspectInfo();
      const currentDate = getISOCurrentDate();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';
      const conditionAgreementNumber =
        conditionalAgreementDataData?.conditionAgreementNumber
          ? conditionalAgreementDataData?.conditionAgreementNumber
          : '';

      const conditionalAgreementDataObj = await collection
        .query(Q.where('discovery_id', discoveryId))
        .query(Q.where('condition_agreement_number', conditionAgreementNumber))
        .fetch();

      const iceStartDate = conditionalAgreementDataData?.iceStartDate ?? '';
      const iceEndDate = conditionalAgreementDataData?.iceEndDate ?? '';
      const iceConditionsHtml =
        conditionalAgreementDataData?.iceConditionsHtml ?? '';
      const iceConditions = conditionalAgreementDataData?.iceConditions ?? '';
      const frozenfoodStartDate =
        conditionalAgreementDataData?.frozenfoodStartDate ?? '';
      const frozenfoodEndDate =
        conditionalAgreementDataData?.frozenfoodEndDate ?? '';
      const frozenfoodConditions =
        conditionalAgreementDataData?.frozenConditions ?? '';
      const justification = conditionalAgreementDataData?.justification ?? '';
      const idContractType = conditionalAgreementDataData?.idContractType ?? '';

      if (conditionalAgreementDataObj.length > 0) {
        //update
        await OFFLINE_STORAGE.getDB().write(async () => {
          await conditionalAgreementDataObj[0].update((rec: any) => {
            rec.iceStartDate = iceStartDate;
            rec.iceEndDate = iceEndDate;
            rec.iceConditionsHtml = iceConditionsHtml;
            rec.frozenfoodStartDate = frozenfoodStartDate;
            rec.frozenfoodEndDate = frozenfoodEndDate;
            rec.frozenfoodConditions = frozenfoodConditions;
            rec.justification = justification;
            rec.updateEmployeeNumber = null; //
            rec.updateDatetime = currentDate;
            rec.sentDatetime = null;
          });
        });
      } else {
        // insert
        await OFFLINE_STORAGE.getDB().write(async () => {
          await collection.create((rec: any) => {
            rec.discoveryId = discoveryId;
            rec.conditionAgreementNumber = conditionAgreementNumber;
            rec.iceStartDate = iceStartDate;
            rec.iceEndDate = iceEndDate;
            rec.iceConditions = iceConditions;
            rec.frozenfoodStartDate = frozenfoodStartDate;
            rec.frozenfoodEndDate = frozenfoodEndDate;
            rec.frozenfoodConditions = frozenfoodConditions;
            rec.signatureCustomer = null;
            rec.signatureEmployee = null;
            rec.justification = justification;
            rec.creationEmployeeNumber = employeeNo;
            rec.updateEmployeeNumber = null;
            rec.creationDatetime = currentDate;
            rec.updateDatetime = null;
            rec.conditionsStatus = '0';
            rec.yambsStatus = '0';
            rec.deleted = '0';
            rec.conditionsSignedDatetime = null; // need to check sign value
            rec.sentDatetime = null;
            rec.idContractType = idContractType;
            rec.iceConditionsHtml = iceConditionsHtml;
          });
        });
      }
      return true;
    } catch (error) {
      console.log('insertOrUpdateCondition agreement error :>> ', error);
      return false;
    }
  }

  /**
   * PLP - CA agreement -> Function returns condition agreement data of prospect
   * @returns
   */
  async getConditionDataOfProspect(agreementNumber: string) {
    try {
      const collection = this.getCollection(ENTITY);
      const prospectData = await this.getPLProspectInfo();
      const discoveryId = prospectData?.discoveryId
        ? prospectData.discoveryId
        : '';

      const QUERY =
        'SELECT DCA.ICE_Start_Date As iceStartDate, DCA.ICE_End_Date As iceEndDate, ' +
        'DCA.FrozenFood_Start_Date As frozenFoodStartDate, DCA.FrozenFood_End_Date As frozenFoodEndDate, ' +
        "COALESCE(DCA.ICE_Conditions, '') AS iceConditions, COALESCE(DCA.FrozenFood_Conditions, '') " +
        'AS frozenFoodConditions, DCA.YAMBS_Status As yambsStatus, DCA.Conditions_Status As conditionStatus, ' +
        'DCA.Justification As justification, DCA.Signature_Customer As signatureCustomer, DCA.Signature_Employee ' +
        'As signatureEmployee, DCA.ID_Contract_Type As idContractType ' +
        'FROM Discovery_Condition_Agreements AS DCA ' +
        "WHERE DCA.Deleted = '0' AND DCA.Discovery_ID = ? " +
        'AND DCA.Condition_Agreement_Number = ?';

      const QUERY_VALUES = [discoveryId, agreementNumber];

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY, QUERY_VALUES))
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getConditionDataOfProspect error :>> ', error);
      return [];
    }
  }
}
