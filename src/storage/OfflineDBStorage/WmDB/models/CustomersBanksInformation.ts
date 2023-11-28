
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomersBanksInformation extends Model {
	static table = 'customers_banks_information';

	@field('customer_ship_to') customerShipTo!: string;
	@field('sales_organization') salesOrganization!: string;
	@field('distribution_channel') distributionChannel!: string;
	@field('customer_payer') customerPayer!: string;
	@field('bank_account_number_encrypted') bankAccountNumberEncrypted!: string;
	@field('bank_control_key_encrypted') bankControlKeyEncrypted!: string;
	@field('bank_country_key_encrypted') bankCountryKeyEncrypted!: string;
	@field('bank_number_encrypted') bankNumberEncrypted!: string;
	@field('bank_name_encrypted') bankNameEncrypted!: string;
	@field('iban_encrypted') ibanEncrypted!: string;
	@field('iban_bic_encrypted') ibanBicEncrypted!: string;
	@field('account_holder_name_1') accountHolderName1!: string;
	@field('account_holder_name_2') accountHolderName2!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default CustomersBanksInformation;
