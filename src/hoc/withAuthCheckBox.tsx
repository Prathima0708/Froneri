import React from 'react';
import ACLService from 'src/services/ACLService';

export const withAuthCheckBox = (Component: React.FC<any>) => {
    const CheckBoxWrapper = (props: any) => {
        const onValueChange = (text: any) => {
            props.onValueChange(text);
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
                <Component {...props} onValueChange={onValueChange} />
            </>
        );
    };

    return CheckBoxWrapper;
};
