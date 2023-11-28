import BaseRepo from './BaseRepo';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import ContractType from 'src/storage/OfflineDBStorage/WmDB/models/ContractType';

const ENTITY = OFFLINE_STORAGE.MODEL.CONTRACT_TYPE;

export class ContractTypeRepo extends BaseRepo<ContractType> {
  /**
   * Function returns html template for the given contract type
   * @returns
   */
  async getHtmlTemplate(contractId: any) {
    try {
      const ContractTypeRepoCollection = this.getCollection(ENTITY);

      let results = await ContractTypeRepoCollection.query(
        Q.unsafeSqlQuery(
          'SELECT HTML_Template ' +
            'FROM Contract_Type ' +
            `WHERE ID_Contract_Type = '${contractId}' `,
        ),
      ).unsafeFetchRaw();

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
   * Function returns template name for terms and conditions for the given contract type
   * @returns
   */
  async getCATermsAndConditionsTemplateName(idContractType: number) {
    try {
      const contractTypeRepoCollection = this.getCollection(ENTITY);

      let results = await contractTypeRepoCollection
        .query(
          Q.unsafeSqlQuery(
            'SELECT template_name as templateName ' +
              'FROM Contract_Type ' +
              `WHERE ID_Contract_Type = ${idContractType} `,
          ),
        )
        .unsafeFetchRaw();

      if (results.length > 0) {
        return results;
      } else {
        return [];
      }
    } catch (error) {
      console.log('getCATermsAndConditionsTemplateName error :>> ', error);
      return [];
    }
  }
}
