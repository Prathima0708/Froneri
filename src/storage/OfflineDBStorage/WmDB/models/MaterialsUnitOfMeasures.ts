
import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class MaterialsUnitOfMeasures extends Model {
	static table = 'materials_unit_of_measures';

	@field('material_number') materialNumber!: string;
	@field('unit_of_measure_1') unitOfMeasure1!: string;
	@field('unit_of_measure_2') unitOfMeasure2!: string;
	@field('conversion_factor') conversionFactor!: number;
	@field('data_origin') dataOrigin!: string;
	@field('last_sync_on') lastSyncOn!: string;
}

export default MaterialsUnitOfMeasures;
