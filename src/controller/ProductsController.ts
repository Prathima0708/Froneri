import {ParametersValuesService} from 'src/services/ParametersValuesService';

class ProductsController {
  private parametersValuesService: ParametersValuesService;

  constructor() {
    this.parametersValuesService = new ParametersValuesService();
  }

  async getProducts() {
    return await this.parametersValuesService.getParameterValue(
      'URL_link_to_product_website',
    );
  }
}
export default new ProductsController();
