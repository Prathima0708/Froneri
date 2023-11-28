
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class ParametersValues extends Model {
	static table = 'parameters_values';

	@field('parameter_name') parameterName!: string;
	@field('parameter_value') parameterValue!: string;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: number;
}

export default ParametersValues;
