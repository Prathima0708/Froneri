
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersClaimsWorkflowHeader extends Model {
	static table = 'customers_claims_workflow_header';

	@field('id_service_request_customer') idServiceRequestCustomer!: string;
	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('sap_document_number') sapDocumentNumber!: string;
	@field('complete_delivery') completeDelivery!: string;
	@field('sent_datetime') sentDatetime!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersClaimsWorkflowHeader;
