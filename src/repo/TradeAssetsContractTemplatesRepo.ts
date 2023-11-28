import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import TradeAssetsContractTemplates from 'src/storage/OfflineDBStorage/WmDB/models/TradeAssetsContractTemplates';
import BaseApiService from 'src/services/BaseApiService';

const ENTITY = OFFLINE_STORAGE.MODEL.TRADE_ASSETS_CONTRACT_TEMPLATES;

export class TradeAssetsContractTemplatesRepo extends BaseRepo<TradeAssetsContractTemplates> {
  /**
   * Function returns template name for the given contract type
   * @returns
   */
  async getTermsAndConditionsTemplateName(
    market: string,
    abcClassification: string,
    language: string,
    isProspect: boolean,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY = `select template_name as templateName from trade_assets_contract_templates where country_code = '${market}'`;

      const resultsOfCountry = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();
      console.log('resultsOfCountry :>> ', resultsOfCountry);

      if (resultsOfCountry.length > 1) {
        const QUERY = `select template_name as templateName from trade_assets_contract_templates where country_code = '${market}' and language = '${language}'`;

        const resultsOfCountryAndLang = await collection
          .query(Q.unsafeSqlQuery(QUERY))
          .unsafeFetchRaw();

        console.log('resultsOfCountryAndLang :>> ', resultsOfCountryAndLang);

        if (resultsOfCountryAndLang.length > 1) {
          // abc classification logic
          const QUERY = `select template_name as templateName from trade_assets_contract_templates where country_code = '${market}' and language = '${language}' and abc_classification = '${abcClassification}'`;

          const resultsOfCountryAndLangAndAbc = await collection
            .query(Q.unsafeSqlQuery(QUERY))
            .unsafeFetchRaw();

          console.log(
            'resultsOfCountryAndLangAndAbc :>> ',
            resultsOfCountryAndLangAndAbc,
          );

          if (resultsOfCountryAndLangAndAbc.length > 1) {
            // customer type logic
            let customerType = 'C';
            if (isProspect) {
              customerType = 'P';
            }
            const QUERY = `select template_name as templateName from trade_assets_contract_templates where country_code = '${market}' and language = '${language}' and abc_classification = '${abcClassification}' and customer_type = '${customerType}'`;

            const resultsOfCountryAndLangAndAbcAndCustomerType =
              await collection.query(Q.unsafeSqlQuery(QUERY)).unsafeFetchRaw();
            console.log(
              'resultsOfCountryAndLangAndAbcAndCustomerType :>> ',
              resultsOfCountryAndLangAndAbcAndCustomerType,
            );

            if (resultsOfCountryAndLangAndAbcAndCustomerType.length > 0) {
              return resultsOfCountryAndLangAndAbcAndCustomerType;
            } else {
              return resultsOfCountryAndLangAndAbc;
            }
          } else if (resultsOfCountryAndLangAndAbc.length > 0) {
            return resultsOfCountryAndLangAndAbc;
          } else {
            return resultsOfCountryAndLang;
          }
        } else if (resultsOfCountryAndLang.length > 0) {
          return resultsOfCountryAndLang;
        } else {
          return resultsOfCountry;
        }
      } else {
        return resultsOfCountry;
      }
    } catch (error) {
      console.log('getTermsAndConditionsTemplateName error :>> ', error);
      return [];
    }
  }
}
