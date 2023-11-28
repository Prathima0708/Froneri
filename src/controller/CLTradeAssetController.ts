import {CallCentersService} from 'src/services/CallCentersService';
import {TradeAssetsCustomersService} from 'src/services/TradeAssetsCustomersService';
import {TurnoverGroupsService} from 'src/services/TurnoverGroupsService';

class CLTradeAssetController {
  private tradeAssetsCustomersService: TradeAssetsCustomersService;
  private turnoverGroupService: TurnoverGroupsService;
  private callCentersService: CallCentersService;

  constructor() {
    this.tradeAssetsCustomersService = new TradeAssetsCustomersService();
    this.turnoverGroupService = new TurnoverGroupsService();
    this.callCentersService = new CallCentersService();
  }

  async getCustomerTradeAssets() {
    const customerInfoData: any =
      await this.tradeAssetsCustomersService.getCLCustomerInfo();
    const isRemoteCustomer = customerInfoData?.isCallApi;
    let results: any = [];

    if (isRemoteCustomer) {
      const customerInfo: any =
        await this.tradeAssetsCustomersService.getCLCustomerInfo();
      const customerShipTo = customerInfo.customerShipTo
        ? customerInfo.customerShipTo
        : '';
      const salesOrganization = customerInfo.salesOrganization
        ? customerInfo.salesOrganization
        : '';
      const distributionChannel = customerInfo.distributionChannel
        ? customerInfo.distributionChannel
        : '';
      results =
        await this.tradeAssetsCustomersService.getCustomerTradeAssetsOnline(
          customerShipTo,
          salesOrganization,
          distributionChannel,
        );
      results = results?.data ? results?.data : [];
    } else {
      results = await this.tradeAssetsCustomersService.getCustomerTradeAssets();
    }
    return results;
  }
  async getTradeAssetsProfitability() {
    const customerInfoData: any =
      await this.tradeAssetsCustomersService.getCLCustomerInfo();
    const isRemoteCustomer = customerInfoData?.isCallApi;
    let results: any = [];
    if (isRemoteCustomer) {
      results =
        await this.turnoverGroupService.getTradeAssetsProfitabilityOnline();
      results = results?.data ? results?.data : [];
    } else {
      results = await this.turnoverGroupService.getTradeAssetsProfitability();
    }
    return results;
  }
  async getMaterialInfoWebPageLink() {
    return await this.callCentersService.getMaterialInfoWebPageLink();
  }
}
export default new CLTradeAssetController();
