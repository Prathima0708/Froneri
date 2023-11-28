import BaseRepo from './BaseRepo';
import CustomersIndustryCodes from 'src/storage/OfflineDBStorage/WmDB/models/CustomersIndustryCodes';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';

const ENTITY = OFFLINE_STORAGE.MODEL.CUSTOMERS_INDUSTRY_CODES;

export class CustomersIndustryCodesRepo extends BaseRepo<CustomersIndustryCodes> {
  /**
   * Function returns Outlet Classification
   * @returns
   */
  async getOutletClassification(value: string) {
    const CustomersIndustryCodesCollection = this.getCollection(ENTITY);

    let BASE_QUERY =
      'SELECT Customers_Industry_codes.Industry_Code as industryCode, ' +
      'Customers_Industry_codes.Industry_Code || " - " || Customers_Industry_codes.Description_Language_1  As descriptionLanguage, ' +
      'Customers_Industry_codes.Meal_Cost as mealCost, ' +
      'Customers_Industry_codes.Id_Customer_Channel as idCustomerChannel ' +
      'FROM Customers_Industry_codes ';
    if (value.length > 0) {
      BASE_QUERY =
        BASE_QUERY +
        `WHERE Customers_Industry_codes.Description_Language_1 LIKE '%${value}%' OR Customers_Industry_codes.Industry_Code LIKE '%${value}%' `;
    }
    BASE_QUERY = BASE_QUERY + 'order by Description_Language_1  LIMIT 10';

    let results = await CustomersIndustryCodesCollection.query(
      Q.unsafeSqlQuery(BASE_QUERY),
    ).unsafeFetchRaw();
    if (results) {
      return results;
    } else {
      return [];
    }
  }

  async getCustomerIndustryCodeChannelDescription() {
    const collection = this.getCollection(ENTITY);
    const customerInfo: any = await this.getCLCustomerInfo();

    const industryCode = customerInfo.industryCode
      ? customerInfo.industryCode
      : '';
    console.log('industryCode called', industryCode);
    const QUERY =
      'select customers_industry_codes.industry_code as industryCode, ' +
      'customers_industry_codes.description_language_1 As descriptionLanguage, ' +
      'customers_industry_codes.id_customer_channel as idCustomerChannel ' +
      `from customers_industry_codes where customers_industry_codes.industry_code="${industryCode}" `;

    console.log('QUERY', QUERY);
    let results = await collection
      .query(Q.unsafeSqlQuery(QUERY))
      .unsafeFetchRaw();
    console.log('results', results);
    if (results) {
      return results;
    } else {
      return [];
    }
  }
}
