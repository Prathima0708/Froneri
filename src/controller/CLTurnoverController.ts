import {DeliveriesDetailedLast10Service} from 'src/services/DeliveriesDetailedLast10Service';
import {MaterialHierarchyService} from 'src/services/MaterialHierarchyService';
import {TurnoverAggregatedMonthService} from 'src/services/TurnoverAggregatedMonthService';
import {OrdersAggregatedService} from 'src/services/OrdersAggregatedService';
import {TurnoverGroupsService} from 'src/services/TurnoverGroupsService';
import {
  formatDateReverse,
  getLocaleNumberFormatter,
} from 'src/utils/CommonUtil';
import {MONTH_DATA} from 'src/utils/Constant';

export class CLTurnoverController {
  private deliveriesDetailedLast10Service: DeliveriesDetailedLast10Service;
  private materialHierarchyService: MaterialHierarchyService;
  private turnoverAggregatedMonthService: TurnoverAggregatedMonthService;
  private ordersAggregatedService: OrdersAggregatedService;
  private turnoverGroupsService: TurnoverGroupsService;

  constructor() {
    this.deliveriesDetailedLast10Service =
      new DeliveriesDetailedLast10Service();
    this.materialHierarchyService = new MaterialHierarchyService();
    this.turnoverAggregatedMonthService = new TurnoverAggregatedMonthService();
    this.ordersAggregatedService = new OrdersAggregatedService();
    this.turnoverGroupsService = new TurnoverGroupsService();
  }

  async getTurnoverSummary() {
    const customerInfoData: any =
      await this.deliveriesDetailedLast10Service.getCLCustomerInfo();
    const isRemoteCustomer = customerInfoData?.isCallApi;

    let turnoverSummaryData = [];

    if (isRemoteCustomer) {
      turnoverSummaryData =
        await this.ordersAggregatedService.getTurnoverSummaryOnline();
    } else {
      turnoverSummaryData =
        await this.ordersAggregatedService.getTurnoverSummary();
    }

    if (turnoverSummaryData.length === 0) {
      return [];
    }

    let turnoverInvoices = 0,
      turnoverPortfolio = 0,
      turnoverValueForDeviation = 0,
      deviationCA = 0,
      volumeDifference = 0,
      netWeightCurrentYear = 0,
      netWeightPreviousYear = 0;

    for (const data of turnoverSummaryData) {
      if (data.type === 'D' && data.category === 'Turnover') {
        turnoverInvoices += data.turnoverValue;
      } else if (data.type === 'D' && data.category === 'Order') {
        netWeightCurrentYear += data.netWeight;
        turnoverPortfolio += data.netAmount;
      } else if (data.type === 'F' && data.category === 'Turnover') {
        turnoverValueForDeviation += data.turnoverValue;
      } else if (data.type === 'F' && data.category === 'Order') {
        netWeightPreviousYear += data.netWeight;
      }
    }

    deviationCA =
      turnoverInvoices + turnoverPortfolio - turnoverValueForDeviation;
    volumeDifference = netWeightCurrentYear - netWeightPreviousYear;

    const calculatedTurnoverSummaryData = [
      {
        turnoverInvoices: getLocaleNumberFormatter(turnoverInvoices).toString(),
        turnoverPortfolio:
          getLocaleNumberFormatter(turnoverPortfolio).toString(),
        deviationCA: getLocaleNumberFormatter(deviationCA).toString(),
        volumeDifference: getLocaleNumberFormatter(volumeDifference).toString(),
      },
    ];

    return calculatedTurnoverSummaryData;
  }

  async getLast10Deliveries() {
    const customerInfoData: any =
      await this.deliveriesDetailedLast10Service.getCLCustomerInfo();
    const isRemoteCustomer = customerInfoData?.isCallApi;

    let deliveriesDetailedLast10Data = [];

    if (isRemoteCustomer) {
      deliveriesDetailedLast10Data =
        await this.deliveriesDetailedLast10Service.getLast10DeliveriesOnline();
    } else {
      deliveriesDetailedLast10Data =
        await this.deliveriesDetailedLast10Service.getLast10Deliveries();
    }

    function add(arr: any, date: any, orginOrder: any) {
      const {length} = arr;
      const id = length + 1;
      const found = arr.some((el: any) => el.deliveryDate === date);
      if (!found)
        arr.push({
          id,
          orginOrder: orginOrder ? orginOrder : '',
          deliveryDate: date ? date : '',
          formattedDate: date ? formatDateReverse(new Date(date)) : '',
        });
      return arr;
    }
    let arr: any = [];

    for (const element of deliveriesDetailedLast10Data) {
      add(arr, element.deliveryDate, element.orginOrder);
    }

    let newArray = arr.filter(function (el: any) {
      return el.deliveryDate != '';
    });

    newArray.sort((a: any, b: any) => {
      const dateA = new Date(a.deliveryDate);
      const dateB = new Date(b.deliveryDate);
      return dateB - dateA;
    });

    console.log('header array------>', newArray);
    let last10DeliveriesHeader: any = newArray;

    // Create an object to store the distinct material numbers and their respective data
    const distinctMaterialNumbers: any = {};

    // Iterate over the original array
    deliveriesDetailedLast10Data.forEach((obj: any) => {
      const {materialNumber, type} = obj;
      const formatedDate = obj.deliveryDate
        ? formatDateReverse(new Date(obj.deliveryDate))
        : '';

      // Check if the materialNumber already exists in the distinctMaterialNumbers object
      if (distinctMaterialNumbers.hasOwnProperty(materialNumber)) {
        let orginOrder = obj.orginOrder ? obj.orginOrder.toString() : '';
        let deliveryDate = formatedDate ? formatedDate : '';
        let quantity = obj.quantity ? obj.quantity.toString() : '';

        // If it exists, add the current object's data to the existing materialNumber object
        if (type === 'B') {
          distinctMaterialNumbers[materialNumber].deliveriesLY =
            obj.deliveriesLY ? obj.deliveriesLY.toString() : '';
          distinctMaterialNumbers[materialNumber].deliveriesYTDLY =
            obj.deliveriesYTDLY ? obj.deliveriesYTDLY : 0;
          distinctMaterialNumbers[materialNumber].deliveriesYTDCY =
            obj.deliveriesYTDCY ? obj.deliveriesYTDCY : 0;
        }
        // If it exists, add the current object's data to the existing materialNumber object
        distinctMaterialNumbers[materialNumber].data.push({
          orginOrder: orginOrder,
          deliveryDate: deliveryDate,
          quantity: quantity,
        });
      } else {
        let materialNumberData = obj.materialNumber
          ? obj.materialNumber.toString()
          : '';
        let turnoverGroup = obj.turnoverGroup ? obj.turnoverGroup : '';
        let description = obj.description ? obj.description : '';
        let deliveriesLY = type === 'B' ? obj.deliveriesLY.toString() : '';
        let deliveriesYTDLY = type === 'B' ? obj.deliveriesYTDLY : 0;
        let deliveriesYTDCY = type === 'B' ? obj.deliveriesYTDCY : 0;
        let types = obj.type ? obj.type : '';
        let orginOrder = obj.orginOrder ? obj.orginOrder.toString() : '';
        let deliveryDate = formatedDate ? formatedDate : '';
        let quantity = obj.quantity ? obj.quantity.toString() : '';

        // If it doesn't exist, create a new object with the current object's data and assign it to the materialNumber
        distinctMaterialNumbers[materialNumber] = {
          materialNumber: materialNumberData,
          turnoverGroup: turnoverGroup,
          description: description,
          deliveriesLY: deliveriesLY,
          deliveriesYTDLY: deliveriesYTDLY,
          deliveriesYTDCY: deliveriesYTDCY,
          type: types,
          data: [
            {
              orginOrder: orginOrder,
              deliveryDate: deliveryDate,
              quantity: quantity,
            },
          ],
        };
      }
    });

    // Convert the distinctMaterialNumbers object to an array of objects
    const last10Deliveries = Object.values(distinctMaterialNumbers);

    return [last10DeliveriesHeader, last10Deliveries];
  }

  async getMonthlyTurnover() {
    const customerInfoData: any =
      await this.deliveriesDetailedLast10Service.getCLCustomerInfo();
    const isRemoteCustomer = customerInfoData?.isCallApi;

    let monthlyTurnoverData = [];

    if (isRemoteCustomer) {
      monthlyTurnoverData =
        await this.turnoverAggregatedMonthService.getMonthlyTurnoverOnline();
    } else {
      monthlyTurnoverData =
        await this.turnoverAggregatedMonthService.getMonthlyTurnover();
    }

    if (
      !Array.isArray(monthlyTurnoverData) ||
      monthlyTurnoverData.length === 0
    ) {
      return [];
    }

    const preparedDataObj = monthlyTurnoverData.reduce(
      (acc: any, curr: any) => {
        if (acc[curr.turnoverGroupDescription]) {
          acc[curr.turnoverGroupDescription].push(curr);
        } else {
          acc[curr.turnoverGroupDescription] = [curr];
        }
        return acc;
      },
      {},
    );

    let calculatedMonthlyTurnoverData = [];

    for (const key in preparedDataObj) {
      if (Object.prototype.hasOwnProperty.call(preparedDataObj, key)) {
        const element = preparedDataObj[key];
        for (let i = 1; i <= 12; i++) {
          let turnoverValue = 0,
            turnoverEvolution = 0,
            turnoverValueDependency = 0;
          let volumeValue = 0,
            volumeEvolution = 0,
            volumeValueDependency = 0;
          const filteredData = element.filter((item: any) => item.month === i);

          if (filteredData.length > 0) {
            const filteredTurnoverValueObj = filteredData.find(
              (item: any) => item.type === 'A',
            );
            const filteredTurnoverEvolutionObj = filteredData.find(
              (item: any) => item.type === 'B',
            );

            if (filteredTurnoverValueObj) {
              // Turnover value
              turnoverValue = filteredTurnoverValueObj.turnoverValue;
              // Volume value
              volumeValue = filteredTurnoverValueObj.weightValue;
            }

            if (filteredTurnoverEvolutionObj) {
              // Turnover value
              turnoverValueDependency =
                filteredTurnoverEvolutionObj.turnoverValue;
              // Volume value
              volumeValueDependency = filteredTurnoverEvolutionObj.weightValue;
            }

            turnoverEvolution = turnoverValue - turnoverValueDependency;
            volumeEvolution = volumeValue - volumeValueDependency;

            const preparedData = {
              turnoverGroupDescription: key,
              month: i,
              turnoverData: {
                value: turnoverValue,
                evolution: turnoverEvolution,
                formattedValue: getLocaleNumberFormatter(
                  turnoverValue,
                  2,
                ).toString(),
                formattedEvolution: getLocaleNumberFormatter(
                  turnoverEvolution,
                  2,
                ).toString(),
              },
              volumeData: {
                value: volumeValue,
                evolution: volumeEvolution,
                formattedValue: getLocaleNumberFormatter(
                  volumeValue,
                  2,
                ).toString(),
                formattedEvolution: getLocaleNumberFormatter(
                  volumeEvolution,
                  2,
                ).toString(),
              },
            };

            calculatedMonthlyTurnoverData.push(preparedData);
          }
        }
      }
    }

    // let newMonthData: any = MONTH_DATA.slice();
    let newMonthData: any = JSON.parse(JSON.stringify(MONTH_DATA));

    for (let index = 1; index <= 12; index++) {
      const filteredData = calculatedMonthlyTurnoverData.filter(
        (item: any) => item.month === index,
      );
      if (filteredData.length > 0) {
        filteredData.reduce((acc, item) => {
          const index = item.month - 1;
          const turnoverGroupDescription = item.turnoverGroupDescription;

          acc[index][turnoverGroupDescription] = item;
          if (!acc[index].Cumulative) {
            acc[index].Cumulative = {};
          }

          const turnoverObj = acc[index].Cumulative.turnoverData;
          const volumeObj = acc[index].Cumulative.volumeData;

          const totalTurnoverValue =
            turnoverObj && turnoverObj !== null
              ? turnoverObj.value + item.turnoverData.value
              : item.turnoverData.value;

          const totalTurnoverEvolution =
            turnoverObj && turnoverObj !== null
              ? turnoverObj.evolution + item.turnoverData.evolution
              : item.turnoverData.evolution;

          const totalVolumeValue =
            volumeObj && volumeObj !== null
              ? volumeObj.value + item.volumeData.value
              : item.volumeData.value;

          const totalVolumeEvolution =
            volumeObj && volumeObj !== null
              ? volumeObj.evolution + item.volumeData.evolution
              : item.volumeData.evolution;

          acc[index].Cumulative.turnoverData = {
            value: totalTurnoverValue,
            evolution: totalTurnoverEvolution,
            formattedValue: getLocaleNumberFormatter(
              totalTurnoverValue,
              2,
            ).toString(),
            formattedEvolution: getLocaleNumberFormatter(
              totalTurnoverEvolution,
              2,
            ).toString(),
          };

          acc[index].Cumulative.volumeData = {
            value: totalVolumeValue,
            evolution: totalVolumeEvolution,
            formattedValue: getLocaleNumberFormatter(
              totalVolumeValue,
              2,
            ).toString(),
            formattedEvolution: getLocaleNumberFormatter(
              totalVolumeEvolution,
              2,
            ).toString(),
          };

          return acc;
        }, newMonthData);
      }
    }

    const testData = newMonthData.reduce((acc: any, curr: any) => {
      Object.keys(curr).forEach(key => {
        if (key !== 'id' && key !== 'title') {
          const currentTurnoverData = curr[key].turnoverData;
          const currentVolumeData = curr[key].volumeData;

          let turnoverValue =
            currentTurnoverData && acc[key]
              ? currentTurnoverData.value + acc[key].turnoverData.value
              : currentTurnoverData.value;
          let turnoverEvolution =
            currentTurnoverData && acc[key]
              ? currentTurnoverData.evolution + acc[key].turnoverData.evolution
              : currentTurnoverData.evolution;

          let volumeValue =
            currentVolumeData && acc[key]
              ? currentVolumeData.value + acc[key].volumeData.value
              : currentVolumeData.value;
          let volumeEvolution =
            currentVolumeData && acc[key]
              ? currentVolumeData.evolution + acc[key].volumeData.evolution
              : currentVolumeData.evolution;

          if (turnoverValue === 0) {
            turnoverValue = currentTurnoverData.value;
          }

          if (turnoverEvolution === 0) {
            turnoverEvolution = currentTurnoverData.evolution;
          }

          if (volumeValue === 0) {
            volumeValue = currentVolumeData.value;
          }

          if (volumeEvolution === 0) {
            volumeEvolution = currentVolumeData.evolution;
          }

          acc[key] = {
            turnoverData: {
              value: turnoverValue,
              evolution: turnoverEvolution,
              formattedValue: getLocaleNumberFormatter(
                turnoverValue,
                2,
              ).toString(),
              formattedEvolution: getLocaleNumberFormatter(
                turnoverEvolution,
                2,
              ).toString(),
            },
            volumeData: {
              value: volumeValue,
              evolution: volumeEvolution,
              formattedValue: getLocaleNumberFormatter(
                volumeValue,
                2,
              ).toString(),
              formattedEvolution: getLocaleNumberFormatter(
                volumeEvolution,
                2,
              ).toString(),
            },
          };
        }
      });
      return acc;
    }, {});

    testData.title = 'Total';
    testData.id = newMonthData.length + 1;

    newMonthData.push(testData);

    return newMonthData;
  }

  async getMaterialHierarchy(
    filterObj: {
      materialHierarchy?: string;
      materialNumber?: string;
      materialDescription?: string;
    } = {},
  ) {
    const materialHierarchyData =
      await this.materialHierarchyService.getMaterialHierarchy(filterObj);

    console.log(
      'materialHierarchyData length :>> ',
      materialHierarchyData.length,
    );

    if (materialHierarchyData.length === 0) {
      return [];
    }

    const hierarchy: any = [];
    const materialHierarchyNodes = [
      'materialHierarchyNodeL1',
      'materialHierarchyNodeL2',
      'materialHierarchyNodeL3',
      'materialHierarchyNodeL4',
      'materialHierarchyNodeL5',
    ];

    materialHierarchyData.forEach((item: any) => {
      const nodeL1 = item.materialHierarchyNodeL1;
      const nodeL2 = item.materialHierarchyNodeL2;
      const nodeL3 = item.materialHierarchyNodeL3;
      const nodeL4 = item.materialHierarchyNodeL4;
      const nodeL5 = item.materialHierarchyNodeL5;

      // Filter out the excluded fields
      const filteredItem: any = Object.fromEntries(
        Object.entries(item).filter(
          ([key]) => !materialHierarchyNodes.includes(key),
        ),
      );

      // Find or create the parent node
      let parentNode = hierarchy.find((node: any) => node.name === nodeL1);
      if (!parentNode) {
        parentNode = {
          id: nodeL1.replaceAll(' ', '') + Math.random(),
          name: nodeL1,
          children: [],
        };
        hierarchy.push(parentNode);
      }

      // Find or create the child node
      let childNode = parentNode.children.find(
        (node: any) => node.name === nodeL2,
      );
      if (!childNode) {
        childNode = {
          id: nodeL2.replaceAll(' ', '') + Math.random(),
          name: nodeL2,
          children: [],
        };
        parentNode.children.push(childNode);
      }

      // Find or create the grandchild node
      let grandchildNode = childNode.children.find(
        (node: any) => node.name === nodeL3,
      );
      if (!grandchildNode) {
        grandchildNode = {
          id: nodeL3.replaceAll(' ', '') + Math.random(),
          name: nodeL3,
          children: [],
        };
        childNode.children.push(grandchildNode);
      }

      // Find or create the great-grandchild node
      let greatGrandchildNode = grandchildNode.children.find(
        (node: any) => node.name === nodeL4,
      );
      if (!greatGrandchildNode) {
        greatGrandchildNode = {
          id: nodeL4.replaceAll(' ', '') + Math.random(),
          name: nodeL4,
          children: [],
        };
        grandchildNode.children.push(greatGrandchildNode);
      }

      // Find or create the leaf node
      let leafNode = greatGrandchildNode.children.find(
        (node: any) => node.name === nodeL5,
      );
      if (!leafNode) {
        leafNode = {
          id: nodeL5.replaceAll(' ', '') + Math.random(),
          name: nodeL5,
          children: [],
        };
        greatGrandchildNode.children.push(leafNode);
      }

      filteredItem.id =
        filteredItem.materialNumber +
        filteredItem.materialDescription +
        Math.random();
      filteredItem.formattedMaterialNumber =
        filteredItem.truncatedLeadingZerosMaterialNumber.toString();

      // Add the filtered item to the leaf node
      leafNode.children.push(filteredItem);
    });

    return hierarchy;
  }

  async getAllTurnoverDetails() {
    const customerInfoData: any =
      await this.deliveriesDetailedLast10Service.getCLCustomerInfo();
    const isRemoteCustomer = customerInfoData?.isCallApi;

    let allTurnoverDetailsData = [];

    if (isRemoteCustomer) {
      allTurnoverDetailsData =
        await this.turnoverGroupsService.getAllTurnoverDetailsOnline();
    } else {
      allTurnoverDetailsData =
        await this.turnoverGroupsService.getAllTurnoverDetails();
    }

    if (allTurnoverDetailsData.length === 0) {
      return [];
    }

    allTurnoverDetailsData = allTurnoverDetailsData.map((item: any) => {
      item.formattedGrowthPercentage =
        item?.growthPercentage || item?.growthPercentage === 0
          ? getLocaleNumberFormatter(item.growthPercentage).toString()
          : '';
      if (isNaN(item.formattedGrowthPercentage)) {
        item.formattedGrowthPercentage = '';
      }
      if (item.formattedGrowthPercentage !== '') {
        item.formattedGrowthPercentage = item.formattedGrowthPercentage + '%';
      }
      item.formattedGrowthCHF =
        item?.growthCHF || item?.growthCHF === 0
          ? getLocaleNumberFormatter(item.growthCHF).toString()
          : '';
      item.formattedYtdCY =
        item?.ytdCY || item?.ytdCY === 0
          ? getLocaleNumberFormatter(item.ytdCY).toString()
          : '';
      item.formattedTotalYearBeforePreviousYear =
        item?.totalYearBeforePreviousYear ||
        item?.totalYearBeforePreviousYear === 0
          ? getLocaleNumberFormatter(
              item.totalYearBeforePreviousYear,
            ).toString()
          : '';
      item.formattedTotalLY =
        item?.totalLY || item?.totalLY === 0
          ? getLocaleNumberFormatter(item.totalLY).toString()
          : '';
      item.formattedYtdLY =
        item?.ytdLY || item?.ytdLY === 0
          ? getLocaleNumberFormatter(item.ytdLY).toString()
          : '';

      return item;
    });

    return allTurnoverDetailsData;
  }

  async getTurnoverGroupDropdown() {
    return await this.turnoverGroupsService.getTurnoverGroupDropdown();
  }
}
export default new CLTurnoverController();
