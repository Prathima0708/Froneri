import {CustomerHierarchiesShipToService} from 'src/services/CustomerHierarchiesShipToService';
import {RebateTrackerRebateFinancialConditionsService} from 'src/services/RebateTrackerRebateFinancialConditionsService';
import {SalesDealsCustomerShipToAggregatedService} from 'src/services/SalesDealsCustomerShipToAggregatedService';
import {TextsService} from 'src/services/TextsService';
import {getOnlyDate} from 'src/utils/CommonUtil';
import {
  formatDateReverse,
  getLocaleNumberFormatter,
} from 'src/utils/CommonUtil';

export class CLConditionsController {
  private rebateTrackerRebateFinancialConditionsService: RebateTrackerRebateFinancialConditionsService;
  private salesDealsCustomerShipToAggregated: SalesDealsCustomerShipToAggregatedService;
  private customerHierarchiesShipToService: CustomerHierarchiesShipToService;
  private textsService: TextsService;

  constructor() {
    this.rebateTrackerRebateFinancialConditionsService =
      new RebateTrackerRebateFinancialConditionsService();
    this.salesDealsCustomerShipToAggregated =
      new SalesDealsCustomerShipToAggregatedService();
    this.customerHierarchiesShipToService =
      new CustomerHierarchiesShipToService();
    this.textsService = new TextsService();
  }

  findDistinctContractObjects = (contracts: any) => {
    const distinctContracts: any = [];
    const contractNumbers = new Set();

    contracts.forEach((contract: any) => {
      if (!contractNumbers.has(contract.contractNumber)) {
        contractNumbers.add(contract.contractNumber);
        distinctContracts.push(contract);
      }
    });
    return distinctContracts;
  };

  findDistinctConditionObjects = (conditions: any) => {
    const distinctConditions: any = [];
    const conditionID = new Set();

    conditions.forEach((condition: any) => {
      if (!conditionID.has(condition.conditionID)) {
        conditionID.add(condition.conditionID);
        distinctConditions.push(condition);
      }
    });
    return distinctConditions;
  };

  async getAllContracts() {
    const customerInfo: any =
      await this.rebateTrackerRebateFinancialConditionsService.getCLCustomerInfo();
    const isRemoteCustomer = customerInfo?.isCallApi;

    let rTypeLevelOneContractsData = [];
    let fTypeLevelOneContractsData = [];

    let distinctRContractNumbers: any = [];
    let distinctFContractNumbers: any = [];

    if (isRemoteCustomer) {
      const contractsDataFromOnline =
        await this.rebateTrackerRebateFinancialConditionsService.getAllContractsOnline();
      const contractsNumbers = contractsDataFromOnline.contractsNumbers
        ? contractsDataFromOnline.contractsNumbers.length > 0
          ? contractsDataFromOnline.contractsNumbers
          : []
        : [];
      const contracts = contractsDataFromOnline.contracts
        ? contractsDataFromOnline.contracts.length > 0
          ? contractsDataFromOnline.contracts
          : []
        : [];

      const matchingRContracts = contracts.filter(
        (contract: any) => contract.contractType === 'R',
      );
      const matchingFContracts = contracts.filter(
        (contract: any) => contract.contractType === 'F',
      );

      rTypeLevelOneContractsData.push(...matchingRContracts);

      fTypeLevelOneContractsData.push(...matchingFContracts);

      distinctRContractNumbers = this.findDistinctContractObjects(
        rTypeLevelOneContractsData,
      );

      distinctFContractNumbers = this.findDistinctContractObjects(
        fTypeLevelOneContractsData,
      );

      console.log(
        'rTypeLevelOneContractsData :>> ',
        rTypeLevelOneContractsData,
      );
      console.log(
        'fTypeLevelOneContractsData :>> ',
        fTypeLevelOneContractsData,
      );
    } else {
      const contractsNumbers =
        await this.rebateTrackerRebateFinancialConditionsService.getContractsLevelOneData();

      let contracts: any = [];
      if (contractsNumbers.length > 0) {
        for (const contractData of contractsNumbers) {
          let contractTwoLevel =
            await this.rebateTrackerRebateFinancialConditionsService.getContractsLevelTwoData(
              contractData.contractNumber,
            );
          contracts = [...contracts, ...contractTwoLevel];
        }
      }

      const matchingRContracts = contracts.filter(
        (contract: any) => contract.contractType === 'R',
      );
      const matchingFContracts = contracts.filter(
        (contract: any) => contract.contractType === 'F',
      );

      rTypeLevelOneContractsData.push(...matchingRContracts);
      fTypeLevelOneContractsData.push(...matchingFContracts);

      distinctRContractNumbers = this.findDistinctContractObjects(
        rTypeLevelOneContractsData,
      );

      distinctFContractNumbers = this.findDistinctContractObjects(
        fTypeLevelOneContractsData,
      );
    }

    for (const contractData of distinctRContractNumbers) {
      contractData.formattedContractStartDate = contractData?.contractStartDate
        ? getOnlyDate(contractData.contractStartDate)
        : '';

      contractData.formattedContractEndDate = contractData?.contractEndDate
        ? getOnlyDate(contractData.contractEndDate)
        : '';

      contractData.formattedTargetValue = contractData?.targetValue
        ? getLocaleNumberFormatter(contractData.targetValue)
        : '';

      let finalConditions: any = [];

      // level two grouping logic....
      let contractsConditions = rTypeLevelOneContractsData.filter(
        item => item.contractNumber === contractData.contractNumber,
      );

      let distinctRConditionsID =
        this.findDistinctConditionObjects(contractsConditions);

      for (const condition of distinctRConditionsID) {
        let distinctCondition = rTypeLevelOneContractsData.filter(
          item =>
            item.contractNumber === contractData.contractNumber &&
            item.conditionID === condition.conditionID,
        );

        // logic to find the level 3 target range..
        let rangeData: {
          targetValueStart: any;
          targetValueEnd: any;
          bonusFactor: any;
        }[] = [];
        if (distinctCondition && distinctCondition.length > 0)
          for (const item of distinctCondition) {
            let obj = {
              targetValueStart: item.targetValueStart
                ? item.targetValueStart
                : 0,
              targetValueEnd: item.targetValueEnd ? item.targetValueEnd : 0,
              bonusFactor: item.bonusFactor ? item.bonusFactor : 0,
            };
            rangeData.push(obj);
          }

        condition.rangeData = rangeData;
        condition.formattedConditionStartDate = condition?.conditionStartDate
          ? getOnlyDate(condition.conditionStartDate)
          : '';
        condition.formattedConditionEndDate = condition?.conditionEndDate
          ? getOnlyDate(condition.conditionEndDate)
          : '';
        condition.formattedExpectedAccrualValue =
          condition?.expectedAccrualValue
            ? getLocaleNumberFormatter(
                condition?.expectedAccrualValue,
              ).toString()
            : '';
        condition.formattedBonusFactor = condition?.bonusFactor
          ? getLocaleNumberFormatter(condition?.bonusFactor).toString()
          : '';
        condition.formattedInitialFinanceAmount =
          condition?.initialFinanceAmount
            ? getLocaleNumberFormatter(
                condition?.initialFinanceAmount,
              ).toString()
            : '';
        finalConditions.push(condition);
      }

      contractData.conditions = finalConditions;
    }

    for (const contractData of distinctFContractNumbers) {
      contractData.formattedContractStartDate = contractData?.contractStartDate
        ? getOnlyDate(contractData.contractStartDate)
        : '';

      contractData.formattedContractEndDate = contractData?.contractEndDate
        ? getOnlyDate(contractData.contractEndDate)
        : '';

      contractData.formattedTargetValue = contractData?.targetValue
        ? getLocaleNumberFormatter(contractData.targetValue)
        : '';

      let finalConditions: any = [];

      // level two grouping logic....
      let contractsConditions = fTypeLevelOneContractsData.filter(
        item => item.contractNumber === contractData.contractNumber,
      );

      let distinctFConditionsID =
        this.findDistinctConditionObjects(contractsConditions);

      for (const condition of distinctFConditionsID) {
        let distinctCondition = fTypeLevelOneContractsData.filter(
          item =>
            item.contractNumber === contractData.contractNumber &&
            item.conditionID === condition.conditionID,
        );
        // logic to find the level 3 target range..
        let rangeData: {
          targetValueStart: any;
          targetValueEnd: any;
          bonusFactor: any;
        }[] = [];
        if (distinctCondition && distinctCondition.length > 0)
          for (const item of distinctCondition) {
            let obj = {
              targetValueStart: item.targetValueStart
                ? item.targetValueStart
                : 0,
              targetValueEnd: item.targetValueEnd ? item.targetValueEnd : 0,
              bonusFactor: item?.penalty
                ? getLocaleNumberFormatter(item.penalty, 2).toString()
                : 0,
            };
            rangeData.push(obj);
          }
        condition.rangeData = rangeData;
        condition.formattedConditionStartDate = condition?.conditionStartDate
          ? getOnlyDate(condition.conditionStartDate)
          : '';
        condition.formattedConditionEndDate = condition?.conditionEndDate
          ? getOnlyDate(condition.conditionEndDate)
          : '';
        condition.formattedExpectedAccrualValue =
          condition?.expectedAccrualValue
            ? getLocaleNumberFormatter(
                condition?.expectedAccrualValue,
              ).toString()
            : '';
        condition.formattedBonusFactor = condition?.bonusFactor
          ? getLocaleNumberFormatter(condition?.bonusFactor).toString()
          : '';
        condition.formattedInitialFinanceAmount =
          condition?.initialFinanceAmount
            ? getLocaleNumberFormatter(
                condition?.initialFinanceAmount,
              ).toString()
            : '';
        finalConditions.push(condition);
      }

      contractData.conditions = finalConditions;
    }

    return {
      contractsData: distinctRContractNumbers,
      fTypeContractsData: distinctFContractNumbers,
    };
  }

  async getSalesDealsConditions() {
    const customerInfo: any =
      await this.salesDealsCustomerShipToAggregated.getCLCustomerInfo();
    const isRemoteCustomer = customerInfo?.isCallApi;

    let salesDealsConditionsData = [];

    if (isRemoteCustomer) {
      salesDealsConditionsData =
        await this.salesDealsCustomerShipToAggregated.getSalesDealsConditionsOnline();
    } else {
      salesDealsConditionsData =
        await this.salesDealsCustomerShipToAggregated.getSalesDealsConditions();
    }

    if (salesDealsConditionsData.length === 0) {
      return [];
    }

    salesDealsConditionsData = await Promise.all(
      salesDealsConditionsData.map(
        async (salesDealsConditionsDataItem: any) => {
          const materialNumberMaterialGroup =
            salesDealsConditionsDataItem.materialNumberMaterialGroup1;

          salesDealsConditionsDataItem.materialNumberMaterialGroup1 =
            materialNumberMaterialGroup ? materialNumberMaterialGroup : '';

          const textsValue = await this.textsService.getTextsValue(
            `MSG_CONDITION_GROUP${salesDealsConditionsDataItem.group}`,
            "and form = 'MAN_FACT_SHEET_MOBILE'",
          );

          salesDealsConditionsDataItem.text = textsValue;

          salesDealsConditionsDataItem.formattedValidFrom =
            salesDealsConditionsDataItem?.validFrom
              ? formatDateReverse(
                  new Date(salesDealsConditionsDataItem.validFrom),
                )
              : '';

          salesDealsConditionsDataItem.formattedValidTo =
            salesDealsConditionsDataItem?.validTo
              ? formatDateReverse(
                  new Date(salesDealsConditionsDataItem.validTo),
                )
              : '';

          return salesDealsConditionsDataItem;
        },
      ),
    );

    const groupedData = salesDealsConditionsData.reduce(
      (result: any, item: any) => {
        const foundItem = result.find((obj: any) => obj.title === item.text);
        if (foundItem) {
          foundItem.data.push(item);
        } else {
          result.push({title: item.text, data: [item]});
        }
        return result;
      },
      [],
    );

    return groupedData;
  }
}
export default new CLConditionsController();
