import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { tw } from 'src/tw';
import Chip from 'src/components/Chip';
import { formatDateReverse } from 'src/utils/CommonUtil';

interface FilterComponentProps {
  filterObj: any;
  handleClipFilterDismiss: any;
}
const FilterComponent = (props: FilterComponentProps) => {
  const { filterObj, handleClipFilterDismiss } = props;

  const handleNameDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, name: '' });
  };

  const handleAddressDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, address: '' });
  };

  const handlePostalCodeDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, postalCode: '' });
  };

  const handleCityDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, city: '' });
  };

  const handleProspectDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, prospectNumber: '' });
  };

  const handleExternalProspectDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, externalProspectNumber: '' });
  };

  const handlePriorityDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, priority: [] });
  };

  const handleOutletDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, outlet: [] });
  };

  const handleProductMaterial = () => {
    handleClipFilterDismiss({ ...filterObj, productMaterial: '' });
  };

  const handleABCClassificationDismiss = (obj: any) => {
    const updatedData = filterObj.abcClassification.filter(
      (item: any) => item.abcClassification !== obj.abcClassification,
    );
    handleClipFilterDismiss({ ...filterObj, abcClassification: updatedData });
  };

  const handleDistributorDismiss = (obj: any) => {
    const updatedData = filterObj.distributor.filter(
      (item: any) => item.idDistributors !== obj.idDistributors,
    );
    handleClipFilterDismiss({ ...filterObj, distributor: updatedData });
  };

  const handleProductGroupDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, productGroup: [] });
  };

  const handleCustomerHierarchyDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, customerHierarchy: [] });
  };

  const handleVisitedFromToDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, visitedFrom: '', visitedTo: '' });
  };

  const handleCreatedFromToDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, createdFrom: '', createdTill: '' });
  };

  const handleCreatedByDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, createdBy: [] });
  };

  const handleUpdatedByDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, updatedBy: [] });
  };

  const handleRequestTypeDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, requestType: [] });
  };

  const handleRequestedFromToDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, requestedFrom: '', requestedTill: '' });
  };

  const handleAssignedToDismiss = () => {
    handleClipFilterDismiss({ ...filterObj, assignedTo: [] });
  };

  return (
    <View row centerV marginT-v3 style={tw('flex-wrap')}>
      {filterObj.name && filterObj.name.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.general.name
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'122'}
            label={`${filterObj.name}`}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleNameDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.address && filterObj.address.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.general.address
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'123'}
            label={`${filterObj.address}`}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleAddressDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.postalCode && filterObj.postalCode.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.general.postal_code
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'124'}
            label={`${filterObj.postalCode}`}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handlePostalCodeDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.city && filterObj.city.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.general.city
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'125'}
            label={`${filterObj.city}`}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleCityDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.prospectNumber && filterObj.prospectNumber.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.general.prospect_number
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'141'}
            label={`${filterObj.prospectNumber}`}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleProspectDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.externalProspectNumber && filterObj.externalProspectNumber.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.general.external_prospect_number
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'142'}
            label={`${filterObj.externalProspectNumber}`}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleExternalProspectDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.outlet && filterObj.outlet.length > 0 && (
        <View row centerV marginV-v1>
          <Text text13R grey3 marginR-v2>
            Outlet:
          </Text>
          <Chip
            key={'126'}
            label={filterObj.outlet[0].descriptionLanguage}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleOutletDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.productMaterial && filterObj.productMaterial.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.customersearch.product_materials
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'127'}
            label={`${filterObj.productMaterial}`}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleProductMaterial()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.priority && filterObj.priority.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.prospectlisting.priority
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'128'}
            label={filterObj.priority[0].label}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handlePriorityDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.abcClassification && filterObj.abcClassification.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.general.abc_classification
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          {filterObj.abcClassification.map((e: any) => {
            return (
              <Chip
                key={e.descriptionLanguage}
                label={e.descriptionLanguage}
                containerStyle={tw('border-0 rounded-md mr-10px')}
                labelStyle={tw('text-light-textBlack text-13px')}
                onDismiss={() => handleABCClassificationDismiss(e)}
                dismissIconStyle={tw('h-2 w-2')}
                dismissColor={ColourPalette.light.black}
                backgroundColor={ColourPalette.light.lightBlue1}
              />
            );
          })}
        </View>
      )}
      {filterObj.productGroup && filterObj.productGroup.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.customersearch.product_group
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'129'}
            label={filterObj.productGroup[0].descriptionLanguage}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleProductGroupDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.distributor && filterObj.distributor.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.customersearch.distributor
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          {filterObj.distributor.map((e: any) => {
            return (
              <Chip
                key={e.description}
                label={e.description}
                containerStyle={tw('border-0 rounded-md mr-10px')}
                labelStyle={tw('text-light-textBlack text-13px')}
                onDismiss={() => handleDistributorDismiss(e)}
                dismissIconStyle={tw('h-2 w-2')}
                dismissColor={ColourPalette.light.black}
                backgroundColor={ColourPalette.light.lightBlue1}
              />
            );
          })}
        </View>
      )}
      {filterObj.customerHierarchy && filterObj.customerHierarchy.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.general.customer_hierarchy
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'129'}
            label={filterObj.customerHierarchy[0].details}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleCustomerHierarchyDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.visitedFrom && filterObj.visitedFrom != '' && filterObj.visitedTo && filterObj.visitedTo.length != 0 && (
        <View row centerV marginV-v1>
          <Text text13R grey3 marginR-v2>
            Visited:
          </Text>
          <Chip
            key={'139'}
            label={`${formatDateReverse(
              filterObj.visitedFrom,
            )} - ${formatDateReverse(filterObj.visitedTo)}`}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleVisitedFromToDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {(filterObj.createdFrom && filterObj.createdFrom != '') && (filterObj.createdTill && filterObj.createdTill != '') && (
        <View row centerV marginV-v1>
          <Text text13R grey3 marginR-v2>
            Created Between:
          </Text>
          <Chip
            key={'140'}
            label={`${formatDateReverse(
              filterObj.createdFrom,
            )} - ${formatDateReverse(filterObj.createdTill)}`}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleCreatedFromToDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.createdBy && filterObj.createdBy.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.general.created_by
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'143'}
            label={filterObj.createdBy[0].name}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleCreatedByDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj.updatedBy && filterObj.updatedBy.length > 0 && (
        <View row centerV marginV-v1>
          <View marginR-v2 row center>
            <Text text13R grey3 >
              label.general.updated_by
            </Text>
            <Text text13R grey3>
              :
            </Text>
          </View>
          <Chip
            key={'144'}
            label={filterObj.updatedBy[0].name}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleUpdatedByDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj?.requestType && filterObj.requestType.length > 0 && (
        <View row centerV marginV-v1>
          <Text text13R grey3 marginR-v2>
            Request Type:
          </Text>
          <Chip
            key={'145'}
            label={filterObj.requestType[0].description}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleRequestTypeDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {(filterObj?.requestedFrom && filterObj?.requestedFrom != '') && (filterObj?.requestedTill && filterObj?.requestedTill != '') && (
        <View row centerV marginV-v1>
          <Text text13R grey3 marginR-v2>
            Requested Between:
          </Text>
          <Chip
            key={'146'}
            label={`${formatDateReverse(
              filterObj.requestedFrom,
            )} - ${formatDateReverse(filterObj.requestedTill)}`}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleRequestedFromToDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
      {filterObj?.assignedTo && filterObj.assignedTo.length > 0 && (
        <View row centerV marginV-v1>
          <Text text13R grey3 marginR-v2>
            Assigned To:
          </Text>
          <Chip
            key={'147'}
            label={filterObj.assignedTo[0].name}
            containerStyle={tw('border-0 rounded-md mr-10px')}
            labelStyle={tw('text-light-textBlack text-13px')}
            onDismiss={() => handleAssignedToDismiss()}
            dismissIconStyle={tw('h-2 w-2')}
            dismissColor={ColourPalette.light.black}
            backgroundColor={ColourPalette.light.lightBlue1}
          />
        </View>
      )}
    </View>
  );
};

export default FilterComponent;
