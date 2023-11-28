
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class Prospects extends Model {
	static table = 'prospects';

	@field('discovery_id') discoveryId!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('country') country!: string;
	@field('name3') name3!: string;
	@field('industry_code') industryCode!: string;
	@field('name1') name1!: string;
	@field('street1') street1!: string;
	@field('house_number') houseNumber!: string;
	@field('address1') address1!: string;
	@field('postal_code') postalCode!: string;
	@field('city') city!: string;
	@field('mail_address') mailAddress!: string;
	@field('phone1') phone1!: string;
	@field('phone2') phone2!: string;
	@field('fax') fax!: string;
	@field('id_territory') idTerritory!: string;
	@field('name2') name2!: string;
	@field('name4') name4!: string;
	@field('street2') street2!: string;
	@field('street3') street3!: string;
	@field('postal_box') postalBox!: string;
	@field('postal_code_box') postalCodeBox!: string;
	@field('city_box') cityBox!: string;
	@field('affiliation_hierarchy_node') affiliationHierarchyNode!: string;
	@field('deleted') deleted!: string;
	@field('id_call_center') idCallCenter!: number;
	@field('employee_number') employeeNumber!: string;
	@field('delete_prospect') deleteProspect!: string;
	@field('shop_number_or_filial_number') shopNumberOrFilialNumber!: string;
	@field('language') language!: string;
	@field('kanton') kanton!: string;
	@field('channel_type') channelType!: string;
	@field('reactivate') reactivate!: string;
	@field('new_customer_activation_date') newCustomerActivationDate!: string;
	@field('previous_customer_ship_to') previousCustomerShipTo!: string;
	@field('previous_customer_sales_organization') previousCustomerSalesOrganization!: string;
	@field('previous_customer_distribution_channel') previousCustomerDistributionChannel!: string;
	@field('delegated') delegated!: string;
	@field('update_employee_number') updateEmployeeNumber!: string;
	@field('update_datetime') updateDatetime!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('latitude') latitude!: string;
	@field('longitude') longitude!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default Prospects;
