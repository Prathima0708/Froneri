import {CustomerBusinessReasonsService} from 'src/services/CustomerBusinessReasonsService';

class PLCustomerBusinessReasonsController {
  private customerBusinessReasonsService: CustomerBusinessReasonsService;

  constructor() {
    this.customerBusinessReasonsService = new CustomerBusinessReasonsService();
  }

  async getCustomersBusinessReasons() {
    const customerBusinessReasonInfo =
      await this.customerBusinessReasonsService.getCustomersBusinessReasons();

    return customerBusinessReasonInfo;
  }
}
export default new PLCustomerBusinessReasonsController();
