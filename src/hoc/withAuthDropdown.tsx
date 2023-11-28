import React from 'react';
import ACLService from 'src/services/ACLService';

export const withAuthDropdown = (Component: any) => {
  const DropDownWrapper = (props: any) => {
    const onChange = (item: any) => {
      props.onChange(item);
      reportFormDirty();
    };

    // Update Form Dirty when Route guard is enabled
    const reportFormDirty = () => {
      if (ACLService.isRouteGuardApplicable()) {
        ACLService.saveAclGuardStatusToStorage(true);
      }
    };

    return (
      <>
        <Component {...props} onChange={onChange} />
      </>
    );
  };

  return DropDownWrapper;
};
