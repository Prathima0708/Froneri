
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Employees extends Model {
	static table = 'employees';

	@field('employee_number') employeeNumber!: string;
	@field('windows_name') windowsName!: string;
	@field('id_call_center') idCallCenter!: number;
	@field('call_place_number') callPlaceNumber!: string;
	@field('first_name') firstName!: string;
	@field('last_name') lastName!: string;
	@field('phone') phone!: string;
	@field('language') language!: string;
	@field('mail_address') mailAddress!: string;
	@field('id_employee_function') idEmployeeFunction!: string;
	@field('enable_alternative_tours') enableAlternativeTours!: string;
	@field('km_limit_alternative_tours') kmLimitAlternativeTours!: number;
	@field('time_limit_alternative_tours') timeLimitAlternativeTours!: number;
	@field('enable_customer_language') enableCustomerLanguage!: string;
	@field('enable_stock_updates') enableStockUpdates!: string;
	@field('enable_test_user') enableTestUser!: string;
	@field('reset_environment') resetEnvironment!: string;
	@field('synchronization_master_station') synchronizationMasterStation!: string;
	@field('enable_quick_cancel') enableQuickCancel!: string;
	@field('time_message_not_transfered_orders') timeMessageNotTransferedOrders!: number;
	@field('enable_fax_orders') enableFaxOrders!: string;
	@field('enable_print_preview') enablePrintPreview!: string;
	@field('enable_show_price_calculation_detail') enableShowPriceCalculationDetail!: string;
	@field('last_connection_datetime') lastConnectionDatetime!: string;
	@field('last_connection_version') lastConnectionVersion!: string;
	@field('deleted') deleted!: string;
	@field('synchronize_all_data') synchronizeAllData!: string;
	@field('enable_free_products') enableFreeProducts!: string;
	@field('enable_mobile_user') enableMobileUser!: string;
	@field('employee_category') employeeCategory!: string;
	@field('telesales_manager') telesalesManager!: string;
	@field('telesales_deputy_manager') telesalesDeputyManager!: string;
	@field('regional_trade_asset_manager') regionalTradeAssetManager!: string;
	@field('fsm_approval_for_ta_order') fsmApprovalForTaOrder!: string;
	@field('fsm_approval_for_posm_order') fsmApprovalForPosmOrder!: string;
	@field('enable3g') enable3G!: string;
	@field('dual_mode') dualMode!: string;
	@field('last_logged_in_employee_category') lastLoggedInEmployeeCategory!: string;
	@field('is_citrix_user') isCitrixUser!: string;
	@field('enable_display_mode') enableDisplayMode!: string;
	@field('id_sales_team') idSalesTeam!: string;
	@field('head_of_sales') headOfSales!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default Employees;
