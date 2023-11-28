import React from 'react';
import ACLService from 'src/services/ACLService';

export const withAuthInput = (Component: React.FC<any>) => {
  const InputWrapper = (props: any) => {
    const onChangeText = (text: any) => {
      props.onChangeText(text);
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
        <Component {...props} onChangeText={onChangeText} />
      </>
    );
  };

  return InputWrapper;
};
