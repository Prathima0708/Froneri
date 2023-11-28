import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import MessageModal from 'src/components/Common/MessageModal';
import { resetProspectLandingState } from 'src/reducers/ProspectLandingSlice';

import ACLService from 'src/services/ACLService';
import { store } from 'src/store';

export const withAuthScreen = (
  Component: React.FC<any>,
  fromPLP = false,
) => {
  const ScreenWrapper = (props: any) => {
    const [isVisible, setIsVisible] = useState(false);
    const [actionToDispatch, setActionToDispatch] = useState(null);
    useEffect(() => {
      resetGuardStatus();
    }, []);

    const resetGuardStatus = async () => {
      ACLService.saveAclGuardStatusToStorage(false);
    };
    /** Listener for check form dirty
     *  Form dirty Alert show, if route guard is enabled
     */
    useEffect(() => {
      const unsubscribe = props.navigation.addListener(
        'beforeRemove',
        async (e: { preventDefault: () => void; data: { action: any } }) => {
          if (ACLService.isRouteGuardApplicable()) {
            e.preventDefault();
            const isFormDirty = await ACLService.isFormDirty();
            if (isFormDirty) {
              setIsVisible(true);
              setActionToDispatch(e.data.action);
            } else {
              props.navigation.dispatch(e.data.action);
            }
          }
        },
      );

      return unsubscribe;
    }, [props.navigation]);

    const handleLeave = async () => {
      ACLService.saveAclGuardStatusToStorage(false);
      setIsVisible(false);
      props.navigation.dispatch(actionToDispatch);
      if (fromPLP) {
        setTimeout(() => {
          const dispatch = store.dispatch;
          dispatch(resetProspectLandingState());
        }, 500);
      }
    };

    const handleBackModal = async () => {
      setIsVisible(false);
    };

    const confirmDiscardChanges = async () => {
      return new Promise(resolve => {
        Alert.alert(
          'Discard changes?',
          'You have unsaved changes. Are you sure you want to discard them and leave this screen?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve(false),
            },
            {
              text: 'Discard',
              style: 'destructive',
              onPress: () => resolve(true),
            },
          ],
        );
      });
    };

    const handleNextScreen = async () => {
      if (ACLService.isRouteGuardApplicable()) {
        const isFormDirty = await ACLService.isFormDirty();
        if (isFormDirty) {
          const shouldDiscardChanges = await confirmDiscardChanges();
          if (shouldDiscardChanges) {
            ACLService.saveAclGuardStatusToStorage(false);
            // props.navigation.navigate(pageNameFontStyles);
          }
        } else {
          // props.navigation.navigate(pageNameFontStyles);
        }
      } else {
        // props.navigation.navigate(pageNameFontStyles);
      }
    };

    return (
      <>
        <Component {...props} handleNextScreen={handleNextScreen} />
        {isVisible && (
          <MessageModal
            isVisible={isVisible}
            title="You have unsaved changes"
            subTitle="Are you sure you want to leave this page?"
            primaryButtonText="No, stay on the page"
            secondaryButtonText="Yes, leave"
            handleOnPressSuccess={handleBackModal}
            handleOnPressCancel={handleLeave}
          />
        )}
      </>
    );
  };

  return ScreenWrapper;
};
