import {OrdersService} from 'src/services/OrdersService';
import {ParametersValuesService} from 'src/services/ParametersValuesService';
import {TextsService} from 'src/services/TextsService';
import {TransShipmentPointsService} from 'src/services/TransShipmentPointsService';
import {TspRoutesService} from 'src/services/TspRoutesService';
import {getLocaleNumberFormatter, getOnlyDate} from 'src/utils/CommonUtil';

class CLOrderHistoryController {
  private ordersService: OrdersService;
  private textsService: TextsService;
  private tspRoutesService: TspRoutesService;
  private transShipmentPointsService: TransShipmentPointsService;
  private parametersValuesService: ParametersValuesService;

  constructor() {
    this.ordersService = new OrdersService();
    this.textsService = new TextsService();
    this.tspRoutesService = new TspRoutesService();
    this.transShipmentPointsService = new TransShipmentPointsService();
    this.parametersValuesService = new ParametersValuesService();
  }

  // get the order drop down
  async getOrderTypeDropDown() {
    let returnOrderTranslationKey = await this.textsService.getTextsValue(
      'ORDER_TYPE_RETURN_REQUEST',
    );
    let finishedGoodsTranslationKey = await this.textsService.getTextsValue(
      'ORDER_TYPE_FINISHED_GOODS',
    );
    let tradeAssetInstallTranslationKey = await this.textsService.getTextsValue(
      'ORDER_TYPE_TRADE_ASSET_INSTAL',
    );
    let tradeAssetPickupTranslationKey = await this.textsService.getTextsValue(
      'ORDER_TYPE_TRADE_ASSET_PICKUP',
    );
    let donationOrderTranslationKey = await this.textsService.getTextsValue(
      'ORDER_TYPE_DONATION',
    );
    let sampleToConsumerTranslationKey = await this.textsService.getTextsValue(
      'ORDER_TYPE_SAMPLE_TO_CONSUMMER',
    );
    let creditOrderTranslationKey = await this.textsService.getTextsValue(
      'ORDER_TYPE_CREDIT_ORDER',
    );
    let gastroOrderTranslationKey = await this.textsService.getTextsValue(
      'ORDER_TYPE_GASTRO_SERVICE',
    );
    returnOrderTranslationKey =
      returnOrderTranslationKey === ''
        ? 'Return order'
        : returnOrderTranslationKey;

    finishedGoodsTranslationKey =
      finishedGoodsTranslationKey == ''
        ? 'Finished Goods'
        : finishedGoodsTranslationKey;

    tradeAssetInstallTranslationKey =
      tradeAssetInstallTranslationKey == ''
        ? 'Trade Asset Install'
        : tradeAssetInstallTranslationKey;

    tradeAssetPickupTranslationKey =
      tradeAssetPickupTranslationKey == ''
        ? 'Trade Asset Pickup'
        : tradeAssetPickupTranslationKey;

    donationOrderTranslationKey =
      donationOrderTranslationKey == ''
        ? 'Donation Order'
        : donationOrderTranslationKey;

    sampleToConsumerTranslationKey =
      sampleToConsumerTranslationKey == ''
        ? 'Sample to Consumer'
        : sampleToConsumerTranslationKey;

    creditOrderTranslationKey =
      creditOrderTranslationKey == ''
        ? 'Credit Order'
        : creditOrderTranslationKey;

    gastroOrderTranslationKey =
      gastroOrderTranslationKey == ''
        ? 'POSM/Gastro order'
        : gastroOrderTranslationKey;

    return [
      {
        id: '1',
        orderType: 'RE',
        orderSubType: 'FG',
        description: 'Return order',
        translationKey: returnOrderTranslationKey,
      },
      {
        id: '2',
        orderType: 'TA',
        orderSubType: 'FG',
        description: 'Finished Goods',
        translationKey: finishedGoodsTranslationKey,
      },
      {
        id: '3',
        orderType: 'TA',
        orderSubType: 'TAIB',
        description: 'Trade Asset Install',
        translationKey: tradeAssetInstallTranslationKey,
      },
      {
        id: '4',
        orderType: 'TA',
        orderSubType: 'TAOB',
        description: 'Trade Asset Pickup',
        translationKey: tradeAssetPickupTranslationKey,
      },
      {
        id: '5',
        orderType: 'ZDON',
        orderSubType: 'DON',
        description: 'Donation Order',
        translationKey: donationOrderTranslationKey,
      },
      {
        id: '6',
        orderType: 'ZSAD',
        orderSubType: 'FG',
        description: 'Sample to Consumer',
        translationKey: sampleToConsumerTranslationKey,
      },
      {
        id: '7',
        orderType: 'TA',
        orderSubType: 'CWOR',
        description: 'Credit Order',
        translationKey: creditOrderTranslationKey,
      },
      {
        id: '8',
        orderType: 'TA',
        orderSubType: 'GAST',
        description: 'POSM/Gastro order',
        translationKey: gastroOrderTranslationKey,
      },
    ];
  }

  // get the order type description
  async getOrderTypeDescription(orderType: string, orderSubType: string) {
    const array = await this.getOrderTypeDropDown();
    const matchingOrder = array.find(
      item =>
        item.orderType === orderType && item.orderSubType === orderSubType,
    );
    return matchingOrder ? matchingOrder.description : '';
  }

  // get the order lines from offline / online
  async getOrderLinesInfo(idOrder: string, isFilterApplied: boolean) {
    let orderLines = [];
    let results = [];
    if (isFilterApplied) {
      results = await this.ordersService.getCustomerLinesOnline(idOrder);
    } else {
      results = await this.ordersService.getOrderHistoryOrderLinesInfo(idOrder);
    }
    for (const orderline of results) {
      let orderlinesObj = {
        ...orderline,
        formattedNetAmount: orderline.netAmount
          ? getLocaleNumberFormatter(orderline.netAmount, 2).toString()
          : '0',
        formattedRegularQuantity: orderline.regularQuantity
          ? getLocaleNumberFormatter(orderline.regularQuantity).toString()
          : '0',
        formattedFreeQuantity: orderline.freeQuantity
          ? getLocaleNumberFormatter(orderline.freeQuantity).toString()
          : '0',
        formattedTotalQuantity: orderline.totalQuantity
          ? getLocaleNumberFormatter(orderline.totalQuantity).toString()
          : '0',
      };
      orderLines.push(orderlinesObj);
    }
    return orderLines;
  }

  // get the order history
  async getCustomerOrderHistory(
    isFilterApplied: boolean,
    pageNumber: number,
    pageSize: number,
    searchOrderObj: any,
  ) {
    const customerInfoData: any = await this.ordersService.getCLCustomerInfo();
    const isRemoteCustomer = customerInfoData?.isCallApi;
    let results: any = [];
    let total = 0;
    // For Filter -> call online api for both local & remote customers
    if (isFilterApplied) {
      results = await this.ordersService.getCustomerOrderHistoryOnline(
        pageNumber,
        pageSize,
        searchOrderObj,
      );
      total = results.total;
      results = results.data;
    } else {
      // For remote customer no api -> display no data
      if (isRemoteCustomer) {
        results = [];
        total = 0;
      } else {
        results = await this.ordersService.getCustomerOrderHistory();
        total = results.length;
      }
    }

    let finalResults: any = [];
    for (const element of results) {
      let obj = {
        ...element,
        orderStatusText: await this.getOrderStatusText(element),
        orderOriginText: await this.getOrderOriginText(element.originOrder),
        orderTypeDescription: await this.getOrderTypeDescription(
          element.orderType,
          element.tessOrderSubType,
        ),
        localCreationDateTime: element.creationDateTime
          ? getOnlyDate(element.creationDateTime)
          : '-',
        localDeliveryDate: element.deliveryDateTime
          ? getOnlyDate(element.deliveryDateTime)
          : '-',
        formattedNetAmount: element.netAmount
          ? getLocaleNumberFormatter(element.netAmount, 2).toString()
          : '0',
      };

      finalResults.push(obj);
    }

    return {results: finalResults, total};
  }

  // get the order origin text
  async getOrderOriginText(orderOrigin: string) {
    let orderOriginText = '';
    let orderOriginTranslationKey = '';
    const orderOriginValue = orderOrigin ? orderOrigin.toString() : '';
    switch (orderOriginValue) {
      case '10':
        orderOriginTranslationKey = 'MSG_ORIGIN_TELESALES';
        break;
      case '11':
        orderOriginTranslationKey = 'MSG_ORIGIN_FAX';
        break;
      case '12':
        orderOriginTranslationKey = 'MSG_ORIGIN_VOIC';
        break;
      case '13':
        orderOriginTranslationKey = 'MSG_ORIGIN_SALES_REP';
        break;
      case '14':
        orderOriginTranslationKey = 'MSG_ORIGIN_OTHERS';
        break;
      case '15':
        orderOriginTranslationKey = 'MSG_ORIGIN_SAP';
        break;
      case '16':
        orderOriginTranslationKey = 'MSG_ORIGIN_EDI';
        break;
      case '17':
        orderOriginTranslationKey = 'MSG_ORIGIN_WEB';
        break;
      case '18':
        orderOriginTranslationKey = 'MSG_ORIGIN_MOBILE';
        break;
      case '19':
        orderOriginTranslationKey = 'MSG_ORIGIN_FAX';
        break;

      default:
        orderOriginTranslationKey = '';
        break;
    }
    if (orderOriginTranslationKey != '') {
      let orderOriginText = await this.textsService.getTextsValue(
        orderOriginTranslationKey,
      );
      return orderOriginText;
    }

    return orderOriginText;
  }

  async getOrderStatusText(item: any) {
    const delivery = item.delivery ? item.delivery : '';
    const orderStatus = item.orderStatus ? item.orderStatus.toString() : '';
    const confirmationRequired = item.confirmationRequired
      ? item.confirmationRequired.toString()
      : '';
    const deliveryDateTime = item.deliveryDateTime ? item.deliveryDateTime : '';
    const creationDateTime = item.creationDateTime ? item.creationDateTime : '';
    const deliveryPlantNumber = item.deliveringPlantNumber
      ? item.deliveringPlantNumber
      : '';
    const tessOrderType = item.tessOrderType ? item.tessOrderType : '';
    const route = item.route ? item.route : '';
    const sapBlocking = item.sapBlocking ? item.sapBlocking : '';

    let orderStatusTranslationKey = '';
    let orderStatusText = '';

    if (delivery == '1') {
      orderStatusTranslationKey = 'MSG_ORDER_STATUS_DELIVERED'; //status -> delivered
    } else {
      if (delivery != '1' && orderStatus != '') {
        if (orderStatus == '0') {
          //ORDER_STATUS_LOCAL
          orderStatusTranslationKey = 'MSG_ORDER_STATUS_0_DESCRIPTION';
        } else if (orderStatus == '1') {
          //ORDER_STATUS_APPROVED
          orderStatusTranslationKey = 'MSG_ORDER_STATUS_1_DESCRIPTION';
        } else if (orderStatus == '2') {
          //ORDER_STATUS_APPROVAL_PENDING
          orderStatusTranslationKey = 'MSG_ORDER_STATUS_2_DESCRIPTION';
        } else if (orderStatus == '4') {
          //ORDER_STATUS_TRANSFERED_TO_SAP
          orderStatusTranslationKey = 'MSG_ORDER_STATUS_4_DESCRIPTION';
        } else if (orderStatus == '5') {
          //ORDER_STATUS_MODIFIED
          orderStatusTranslationKey = 'MSG_ORDER_STATUS_5_DESCRIPTION';
        } else if (orderStatus == '6') {
          //ORDER_STATUS_EXISTING_ORDER_APPROVAL
          orderStatusTranslationKey = 'MSG_ORDER_STATUS_2_DESCRIPTION';
        } else if (orderStatus == '7') {
          //ORDER_STATUS_SALES_MANAGER_APPROVAL_PENDING
          orderStatusTranslationKey = 'MSG_ORDER_STATUS_7_DESCRIPTION';
        } else if (orderStatus == '8') {
          //ORDER_STATUS_RTM_APPROVAL_PENDING
          orderStatusTranslationKey = 'MSG_ORDER_STATUS_8_DESCRIPTION';
        } else if (orderStatus == '9') {
          //ORDER_STATUS_REJECTED
          orderStatusTranslationKey = 'MSG_ORDER_STATUS_9_DESCRIPTION';
        } else if (confirmationRequired == 'A') {
          //ORDER_STATUS_PAUSED
          orderStatusTranslationKey = 'MSG_ORDER_CONFIRMATION_REQUIRED';
        }
      }

      console.log('item', item);
      const enableOrderCutOffTime =
        await this.parametersValuesService.getParameterValue(
          'Enable_Order_Taking_Cut_Off_Time',
        );
      // Order Taking cut off time...
      if (tessOrderType == 'FG') {
        if (enableOrderCutOffTime == '1') {
          let isOrderTakingCutOffTimeReached =
            await this.checkIsOrderTakingCutOffTimeReached(
              deliveryDateTime,
              deliveryPlantNumber,
              route,
              creationDateTime,
            );
          // 2- Pending or 9 - Rejected
          if (
            isOrderTakingCutOffTimeReached &&
            orderStatus != '2' &&
            orderStatus != '9'
          ) {
            const deliveryDate = new Date(deliveryDateTime);
            const currentDate = new Date(); // Current date

            const timeDifference =
              deliveryDate.getTime() - currentDate.getTime();
            const dayDifferenceOfCurrentDateAndDeliveryDate = Math.ceil(
              timeDifference / (1000 * 60 * 60 * 24),
            );

            if (dayDifferenceOfCurrentDateAndDeliveryDate <= 0) {
              orderStatusTranslationKey = 'MSG_ORDER_PARTIAL_MODIFICATION';
            }
          }
        }
      }

      // Route planning cut off time ....
      const platformCustomersSalesOffices =
        await this.parametersValuesService.getParameterValue(
          'Platform_Customers_Sales_Offices',
        );
      if (platformCustomersSalesOffices == '' && tessOrderType == 'FG') {
        if (enableOrderCutOffTime == '1') {
          let isOrderTakingCutOffTimeReached =
            await this.checkIsRoutePlanningCutOffTimeReached(
              deliveryDateTime,
              deliveryPlantNumber,
              route,
              creationDateTime,
            );
          // 2- Pending or 9 - Rejected
          if (
            isOrderTakingCutOffTimeReached &&
            orderStatus != '2' &&
            orderStatus != '9'
          ) {
            const deliveryDate = new Date(deliveryDateTime);
            const currentDate = new Date(); // Current date

            const timeDifference =
              deliveryDate.getTime() - currentDate.getTime();
            const dayDifferenceOfCurrentDateAndDeliveryDate = Math.ceil(
              timeDifference / (1000 * 60 * 60 * 24),
            );

            if (dayDifferenceOfCurrentDateAndDeliveryDate <= 0) {
              orderStatusTranslationKey = 'MSG_ROUTE_PLANNING_IN_PROGRESS';
            }
          }
        }
      }
      // ....
      // Sap Blocking
      if (sapBlocking == '1') {
        orderStatusTranslationKey = 'MSG_SAP_BLOCKING';
      }
    }

    if (orderStatusTranslationKey != '') {
      orderStatusText = await this.textsService.getTextsValue(
        orderStatusTranslationKey,
      );
      return orderStatusText;
    }
    return orderStatusText;
  }

  async checkIsOrderTakingCutOffTimeReached(
    deliveryDateTime: string,
    deliveryPlantNo: string,
    route: string,
    creationDateTime: string,
  ) {
    // call getCutOffTimeInfo function to get delivery lead time
    // & order taking cut off time
    let deliveryLeadTime = '';
    let orderTakingCutOffTime = '';
    let numberOfDeliveryDays = 0;
    let numberOfWorkDays = 0;

    if (route != '') {
      let cutOffTimeInfo = await this.getCutOffTimeInfo(route);
      if (cutOffTimeInfo.length > 0) {
        deliveryLeadTime = cutOffTimeInfo[0].deliveryLeadTime
          ? cutOffTimeInfo[0].deliveryLeadTime
          : '1';
        deliveryLeadTime = deliveryLeadTime === '0' ? '1' : deliveryLeadTime;
        orderTakingCutOffTime = cutOffTimeInfo[0].orderTakingCutOffTime
          ? cutOffTimeInfo[0].orderTakingCutOffTime
          : '';
      }
    }

    // if order taking cut off time is not available then call
    // getTSPLevelCutOfftime function to get order taking cut off time
    if (orderTakingCutOffTime == '' && deliveryPlantNo != '') {
      let tspInfo = await this.getTSPLevelCutOffTime(deliveryPlantNo);
      if (tspInfo.length > 0)
        orderTakingCutOffTime = tspInfo[0].orderTakingCutOffTime
          ? tspInfo[0].orderTakingCutOffTime
          : '';
    }

    const creationDate = new Date(creationDateTime);
    const deliveryDate = new Date(deliveryDateTime);

    // find the number of delivery days
    const timeDifference = deliveryDate.getTime() - creationDate.getTime();
    numberOfDeliveryDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    // exclude the creation date & delivery only consider in between days
    if (
      creationDate.getDate() === deliveryDate.getDate() &&
      creationDate.getMonth() === deliveryDate.getMonth() &&
      creationDate.getFullYear() === deliveryDate.getFullYear()
    ) {
      numberOfDeliveryDays -= 2;
    } else {
      numberOfDeliveryDays -= 1;
    }
    // .....

    /**
     * Here numberOfDeliveryDays <= 2 + Number(deliveryLeadTime)
     * 2 - weekend days
     */

    if (
      orderTakingCutOffTime !== '' &&
      numberOfDeliveryDays <= 2 + Number(deliveryLeadTime)
    ) {
      /*
       * find the number of working days..
       * Here exclude weekend days
       */
      let currentDate = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
      while (currentDate < deliveryDate) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          numberOfWorkDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // .....

      // if delivery day is saturday or sunday then add 1
      if (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
        numberOfWorkDays = numberOfWorkDays + 1;
      }

      //Calculate the number of days by deducting the delivery lead time
      numberOfWorkDays = numberOfWorkDays - Number(deliveryLeadTime);

      if (numberOfWorkDays < 1) {
        // Get the current date and time
        const currentDate = new Date();

        // Convert the cutoff time string to a Date object
        const cutoffTime = new Date();
        cutoffTime.setHours(
          parseInt(orderTakingCutOffTime.slice(0, 2)),
          parseInt(orderTakingCutOffTime.slice(2)),
          0,
        );

        // find the day between between current date & delivery date
        const timeDifference = deliveryDate.getTime() - currentDate.getTime();
        const dayDifferenceOfCurrentAndDelivery = Math.ceil(
          timeDifference / (1000 * 60 * 60 * 24),
        );
        if (
          currentDate > cutoffTime &&
          numberOfWorkDays < 0 &&
          dayDifferenceOfCurrentAndDelivery > 0
        ) {
          return true;
        }

        // Modification not allowed on Saturday and sunday for monday delivery.
        // if (currentDate.getDay() === 6 || currentDate.getDay() === 0) {
        //   return true;
        // }
      }
    }

    return false;
  }

  async checkIsRoutePlanningCutOffTimeReached(
    deliveryDateTime: string,
    deliveryPlantNo: string,
    route: string,
    creationDateTime: string,
  ) {
    // call getCutOffTimeInfo function to get delivery lead time
    // & order taking cut off time
    let deliveryLeadTime = '';
    let routePlanningCutOffTime = '';
    let numberOfDeliveryDays = 0;
    let numberOfWorkDays = 0;

    if (route != '') {
      let cutOffTimeInfo = await this.getCutOffTimeInfo(route);
      console.log('cutOffTimeInfo', cutOffTimeInfo);
      if (cutOffTimeInfo.length > 0) {
        deliveryLeadTime = cutOffTimeInfo[0].deliveryLeadTime
          ? cutOffTimeInfo[0].deliveryLeadTime
          : '1';
        deliveryLeadTime = deliveryLeadTime === '0' ? '1' : deliveryLeadTime;
        routePlanningCutOffTime = cutOffTimeInfo[0].routePlanningCutOffTime
          ? cutOffTimeInfo[0].routePlanningCutOffTime
          : '';
      }
    }

    // if order taking cut off time is not available then call
    // getTSPLevelCutOfftime function to get order taking cut off time
    if (routePlanningCutOffTime == '' && deliveryPlantNo != '') {
      let tspInfo = await this.getTSPLevelCutOffTime(deliveryPlantNo);
      if (tspInfo.length > 0)
        routePlanningCutOffTime = tspInfo[0].routePlanningCutOffTime
          ? tspInfo[0].routePlanningCutOffTime
          : '';
    }

    const creationDate = new Date(creationDateTime);
    const deliveryDate = new Date(deliveryDateTime);

    // find the number of delivery days
    const timeDifference = deliveryDate.getTime() - creationDate.getTime();
    numberOfDeliveryDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    // exclude the creation date & delivery only consider in between days
    if (
      creationDate.getDate() === deliveryDate.getDate() &&
      creationDate.getMonth() === deliveryDate.getMonth() &&
      creationDate.getFullYear() === deliveryDate.getFullYear()
    ) {
      numberOfDeliveryDays -= 2;
    } else {
      numberOfDeliveryDays -= 1;
    }
    // .....

    /**
     * Here numberOfDeliveryDays <= 2 + Number(deliveryLeadTime)
     * 2 - weekend days
     */

    if (
      routePlanningCutOffTime !== '' &&
      numberOfDeliveryDays <= 2 + Number(deliveryLeadTime)
    ) {
      /*
       * find the number of working days..
       * Here exclude weekend days
       */
      let currentDate = new Date(creationDate.getTime() + 24 * 60 * 60 * 1000);
      while (currentDate < deliveryDate) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          numberOfWorkDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      // .....

      // if delivery day is saturday or sunday then add 1
      if (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
        numberOfWorkDays = numberOfWorkDays + 1;
      }

      //Calculate the number of days by deducting the delivery lead time
      numberOfWorkDays = numberOfWorkDays - Number(deliveryLeadTime);

      if (numberOfWorkDays < 1) {
        // Get the current date and time
        const currentDate = new Date();

        // Convert the cutoff time string to a Date object
        const cutoffTime = new Date();
        cutoffTime.setHours(
          parseInt(routePlanningCutOffTime.slice(0, 2)),
          parseInt(routePlanningCutOffTime.slice(2)),
          0,
        );

        // find the day between between current date & delivery date
        const timeDifference = deliveryDate.getTime() - currentDate.getTime();
        const dayDifferenceOfCurrentAndDelivery = Math.ceil(
          timeDifference / (1000 * 60 * 60 * 24),
        );
        if (
          currentDate > cutoffTime &&
          numberOfWorkDays < 0 &&
          dayDifferenceOfCurrentAndDelivery > 0
        ) {
          return true;
        }

        // Modification not allowed on Saturday and sunday for monday delivery.
        // if (currentDate.getDay() === 6 || currentDate.getDay() === 0) {
        //   return true;
        // }
      }
    }

    return false;
  }

  async getCutOffTimeInfo(route: string) {
    return await this.tspRoutesService.getCutOffTimeInfo(route);
  }

  async getTSPLevelCutOffTime(deliveryPlantNo: string) {
    return await this.transShipmentPointsService.getTSPLevelCutOffTime(
      deliveryPlantNo,
    );
  }
}
export default new CLOrderHistoryController();
