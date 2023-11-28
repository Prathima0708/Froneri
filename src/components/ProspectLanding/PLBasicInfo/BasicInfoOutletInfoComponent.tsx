import View from 'src/components/View';
import React from 'react';
import {tw} from 'src/tw';
import Text from 'src/components/Text';
import Dropdown from 'src/components/DropDown';
import DropdownSearchComponent from 'src/components/DropdownSearchComponent';

interface BasicInfoOutletInfoComponentProps {
  isEditable: boolean;
  outletClassificationDropdownData: any;
  getOutletClassificationDropdownData: any;
  salesAreaDropdownData: any;
  customerHierarchyDropdownData: any;
  getCustomerHierarchyDropdownData: any;
  distributionChannelDropdownData: any;
  handleInputChange: any;
  item: any;
  onCustomerHierarchyFocus: any;
  errorMessages: any;
  mandatoryData: any;
}

const BasicInfoOutletInfoComponent = (
  props: BasicInfoOutletInfoComponentProps,
) => {
  const {
    item,
    isEditable,
    outletClassificationDropdownData,
    getOutletClassificationDropdownData,
    salesAreaDropdownData,
    customerHierarchyDropdownData,
    getCustomerHierarchyDropdownData,
    distributionChannelDropdownData,
    handleInputChange,
    onCustomerHierarchyFocus,
    errorMessages,
    mandatoryData,
  } = props;

  const handleOutlet = handleInputChange('outlet');

  const handleSalesArea = handleInputChange('salesArea');

  const handleDistributionChannel = handleInputChange('distributionChannel');

  const handleCustomerHierarchy = handleInputChange('customerHierarchy');

  const outletClassificationTitle = `Outlet Classification${
    mandatoryData.outlet == 1 ? '*' : ''
  }`;
  const customerHierarchyTitle = `Customer Hierarchy${
    mandatoryData.customerHierarchy == 1 ? '*' : ''
  }`;

  const distributionChannelTitle = `Distribution Channel${
    mandatoryData.distributionChannel == 1 ? '*' : ''
  }`;

  return (
    <View marginT-v2>
      <View centerH marginT-v2 style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          Outlet Info
        </Text>
      </View>
      <View marginT-v3 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={outletClassificationTitle}
            data={outletClassificationDropdownData}
            placeholder="Select Outlet Classification"
            search
            searchPlaceholder="Search items..."
            renderInputSearch={() => (
              <DropdownSearchComponent
                handleSearchDropdown={getOutletClassificationDropdownData}
              />
            )}
            value={item.outlet}
            labelField={'descriptionLanguage'}
            valueField={'industryCode'}
            onChange={handleOutlet}
            isEditable={isEditable}
            errorMsg={errorMessages.outlet}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title="Sales Area"
            isEditable={isEditable}
            data={salesAreaDropdownData}
            placeholder="Select Sales Area"
            value={item.salesArea}
            labelField={'salesArea'}
            valueField={'salesAreaValue'}
            onChange={handleSalesArea}
            errorMsg={errorMessages.salesArea}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={distributionChannelTitle}
            isEditable={isEditable}
            data={distributionChannelDropdownData}
            placeholder="Select Distribution Channel"
            value={item.distributionChannel}
            labelField={'description'}
            valueField={'discoveryListValuesId'}
            onChange={handleDistributionChannel}
            errorMsg={errorMessages.distributionChannel}
          />
        </View>
        <View flex style={tw('border-light-lavendar')}>
          <Dropdown
            title={customerHierarchyTitle}
            isEditable={isEditable}
            data={customerHierarchyDropdownData}
            placeholder="Select Customer Hierarchy"
            search
            searchPlaceholder="Search items..."
            renderInputSearch={() => {
              if (customerHierarchyDropdownData.length > 0) {
                return (
                  <DropdownSearchComponent
                    handleSearchDropdown={getCustomerHierarchyDropdownData}
                  />
                );
              }
              return (
                <Text text13M grey3 center>
                  No data
                </Text>
              );
            }}
            value={item.customerHierarchy}
            labelField={'l6HierarchyLabel'}
            valueField={'l6HierarchyValue'}
            onChange={handleCustomerHierarchy}
            errorMsg={errorMessages.customerHierarchy}
            onFocus={onCustomerHierarchyFocus}
          />
        </View>
      </View>
      <View marginT-v7 style={tw('bg-light-lavendar h-px')} />
    </View>
  );
};

export default BasicInfoOutletInfoComponent;
