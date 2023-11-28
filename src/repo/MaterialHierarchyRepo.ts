import BaseRepo from './BaseRepo';
import MaterialHierarchy from 'src/storage/OfflineDBStorage/WmDB/models/MaterialHierarchy';
import {OFFLINE_STORAGE} from 'src/storage/Storage';
import {Q} from '@nozbe/watermelondb';
import {generateAccentString} from 'src/utils/Util';

const ENTITY = OFFLINE_STORAGE.MODEL.MATERIAL_HIERARCHY;
const TEMP_HIERARCHY_ENTITY = OFFLINE_STORAGE.MODEL.TEMP_HIERARCHY;

export class MaterialHierarchyRepo extends BaseRepo<MaterialHierarchy> {
  /**
   * Function adds temporary data in temp_hierarchy table
   * @returns []
   */
  async insertTemporaryDataInHierarchy(rows: any) {
    const database = OFFLINE_STORAGE.getDB();

    const tempTable = this.getCollection(TEMP_HIERARCHY_ENTITY);

    await database.write(async () => {
      for (const row of rows) {
        await tempTable.create((record: any) => {
          record[`materialHierarchyNodeL${row.level}`] =
            row.material_hierarchy_node;
        });
      }
    });
  }

  /**
   * Function removes temporary data from temp_hierarchy table
   * @returns []
   */
  async removeTemporaryDataInHierarchy() {
    try {
      const database = OFFLINE_STORAGE.getDB();

      const tempTable = this.getCollection(TEMP_HIERARCHY_ENTITY);

      await database.write(async () => {
        const allRecords = await tempTable.query().fetch();
        console.log('allRecords length', allRecords.length);

        if (allRecords.length > 0) {
          for (const record of allRecords) {
            await record.destroyPermanently();
          }
          console.log('All records deleted from temp_hierarchy table');
        }
      });
    } catch (error) {
      console.log(
        'Error while deleting temp data from temp_hierarchy table',
        error,
      );
    }
  }

  /**
   * Function returns Material Hierarchy
   * @returns []
   */
  async getMaterialHierarchy(
    filterObj: {
      materialHierarchy?: string;
      materialNumber?: string;
      materialDescription?: string;
    } = {},
  ) {
    try {
      const collection = this.getCollection(ENTITY);
      let filterQuery = '';

      const rows = await collection
        .query(
          Q.unsafeSqlQuery(
            'SELECT material_hierarchy_node, level FROM Material_Hierarchy',
          ),
        )
        .unsafeFetchRaw();

      await this.insertTemporaryDataInHierarchy(rows);

      if (Object.keys(filterObj).length > 0) {
        if (filterObj.materialNumber) {
          const splittedMaterialNumber = filterObj.materialNumber.split(',');
          if (splittedMaterialNumber.length > 0) {
            filterQuery += '(';
            splittedMaterialNumber.forEach((materialNumber: string, index) => {
              if (index === 0) {
                filterQuery += `truncatedLeadingZerosMaterialNumber like '%${materialNumber}%' `;
              } else {
                filterQuery += `or truncatedLeadingZerosMaterialNumber like '%${materialNumber}%' `;
              }
            });
            filterQuery += ')';
          }
        }

        if (filterObj.materialDescription) {
          if (filterQuery.length > 0) {
            filterQuery += 'and ';
          }

          const accentList = generateAccentString(
            filterObj.materialDescription,
          );
          accentList.forEach((accent: string, index: number) => {
            if (index === 0) {
              filterQuery += `(materialDescription like '%${accent}%' `;
            } else {
              filterQuery += `or materialDescription like '%${accent}%' `;
            }
          });

          filterQuery += ')';
        }

        if (filterObj.materialHierarchy) {
          if (filterQuery.length > 0) {
            filterQuery += 'and ';
          }
          filterQuery += `(materialHierarchyNodeL1 like '%${filterObj.materialHierarchy}%' `;
          filterQuery += `or materialHierarchyNodeL2 like '%${filterObj.materialHierarchy}%' `;
          filterQuery += `or materialHierarchyNodeL3 like '%${filterObj.materialHierarchy}%' `;
          filterQuery += `or materialHierarchyNodeL4 like '%${filterObj.materialHierarchy}%' `;
          filterQuery += `or materialHierarchyNodeL5 like '%${filterObj.materialHierarchy}%') `;
        }

        if (filterQuery) {
          filterQuery = `where ${filterQuery}`;
        }
      }

      console.log('filterQuery :>> ', filterQuery);

      const QUERY =
        "select * from (select coalesce(max(c.material_hierarchy_node_l1 || ' ' || mh1.description_language_1), '') as materialHierarchyNodeL1, " +
        "coalesce(max(c.material_hierarchy_node_l2 || ' ' || mh2.description_language_1), '') as materialHierarchyNodeL2, " +
        "coalesce(max(c.material_hierarchy_node_l3 || ' ' || mh3.description_language_1), '') as materialHierarchyNodeL3, " +
        "coalesce(max(c.material_hierarchy_node_l4 || ' ' || mh4.description_language_1), '') as materialHierarchyNodeL4, " +
        "coalesce(max(c.material_hierarchy_node_l5 || ' ' || mh5.description_language_1), '') as materialHierarchyNodeL5, " +
        'm.material_number as materialNumber, cast(m.material_number as integer) as truncatedLeadingZerosMaterialNumber, ' +
        'm.description_language_1 as materialDescription, m.main_sales_unit as mainSalesUnit, ' +
        "'' as materialHierarchyNode from temp_hierarchy c " +
        'inner join materials m on m.material_hierarchy_node_l1 = c.material_hierarchy_node_l1 ' +
        'or m.material_hierarchy_node_l2 = c.material_hierarchy_node_l2 ' +
        'or m.material_hierarchy_node_l3 = c.material_hierarchy_node_l3 ' +
        'or m.material_hierarchy_node_l4 = c.material_hierarchy_node_l4 ' +
        'or m.material_hierarchy_node_l5 = c.material_hierarchy_node_l5 ' +
        'left join material_hierarchy mh1 on mh1.material_hierarchy_node = c.material_hierarchy_node_l1 ' +
        'left join material_hierarchy mh2 on mh2.material_hierarchy_node = c.material_hierarchy_node_l2 ' +
        'left join material_hierarchy mh3 on mh3.material_hierarchy_node = c.material_hierarchy_node_l3 ' +
        'left join material_hierarchy mh4 on mh4.material_hierarchy_node = c.material_hierarchy_node_l4 ' +
        'left join material_hierarchy mh5 on mh5.material_hierarchy_node = c.material_hierarchy_node_l5 ' +
        'group by m.material_number, m.description_language_1, m.main_sales_unit)' +
        filterQuery;

      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();

      await this.removeTemporaryDataInHierarchy();

      return results;
    } catch (error) {
      console.log('error while fetching material hierarchy data :>>', error);
    }
  }
  /**
   * Function returns Material Hierarchy
   * @returns []
   */
  async getMaterialProductGroup(
    materialHierarchyFromSapNode: string,
    materialHierarchyNode: string,
  ) {
    try {
      const collection = this.getCollection(ENTITY);

      const QUERY = `select description_language_1   
      from material_hierarchy  
      where (material_hierarchy_node ='${materialHierarchyFromSapNode}'  
      or material_hierarchy_node='${materialHierarchyNode}') `;
      let results = await collection
        .query(Q.unsafeSqlQuery(QUERY))
        .unsafeFetchRaw();
      return results;
    } catch (error) {
      console.log(
        'error while fetching getMaterialProductGroup data :>>',
        error,
      );
    }
  }
}
