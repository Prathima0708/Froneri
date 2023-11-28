import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class CustomerContacts extends Model {
  static table = 'customer_contacts';

  @field('id_customer_contact') idCustomerContact!: string;
  @field('customer_ship_to') customerShipTo!: string;
  @field('sales_organization') salesOrganization!: string;
  @field('distribution_channel') distributionChannel!: string;
  @field('title') title!: string;
  @field('first_name') firstName!: string;
  @field('last_name') lastName!: string;
  @field('phone_number') phoneNumber!: string;
  @field('mobile_number') mobileNumber!: string;
  @field('fax') fax!: string;
  @field('email_id') emailId!: string;
  @field('creation_datetime') creationDatetime!: string;
  @field('created_by_employee_number') createdByEmployeeNumber!: string;
  @field('updated_datetime') updatedDatetime!: string;
  @field('updated_by_employee_number') updatedByEmployeeNumber!: string;
  @field('note') note!: string;
  @field('sent_datetime') sentDatetime!: string;
  @field('data_origin') dataOrigin!: string;
  @field('last_sync_on') lastSyncOn!: string;
}

export default CustomerContacts;
