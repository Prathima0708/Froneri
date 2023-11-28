import React from 'react';
import { TouchableOpacity } from 'react-native';

import View from 'src/components/View';
import Text from 'src/components/Text';

import { tw } from 'src/tw';

import { BUTTON_TYPE } from 'src/components/Button/ButtonType';

interface TAHeaderComponentProps {
  handlePreview?: any;
  handleSave?: any;
  isEditable: boolean;
  isFinalizeDisabled: boolean;
  handleFinalize: any;
  isAgreementFinalized: any;
  handleEdit: any;
  isEditButtonVisible: boolean;
  handleCancel: any;
}

const TAHeaderComponent = (props: TAHeaderComponentProps) => {
  const { handlePreview, handleSave, handleEdit, isEditable, isFinalizeDisabled, handleFinalize, isAgreementFinalized, isEditButtonVisible, handleCancel } = props;

  return (
    <View center style={tw('flex-row')} marginB-v4>
      <Text
        text24BO
        style={tw("leading-9")}
      >
        Trade Assets Agreement
      </Text>
      <View flex-4 row center style={tw('justify-end')}>
        {!isAgreementFinalized && <View>
          {isEditButtonVisible ? <TouchableOpacity
            style={tw(
              `${BUTTON_TYPE.PRIMARY_BORDER_ENABLED} px-8 ml-6`,
            )}
            onPress={handleEdit}
          >
            <Text
              text13R
              style={tw(BUTTON_TYPE.PRIMARY_BORDER_ENABLED_LABEL)}
            >
              {'  '}
              Edit
            </Text>
          </TouchableOpacity> : <View row center style={tw('items-end justify-end')}>
            <TouchableOpacity
              style={tw('py-2 px-4 flex-row items-center')}
              onPress={handleCancel}
              disabled={!isEditable}
            >
              <Text text13R style={tw(
                `${isEditable
                  ? BUTTON_TYPE.CANCEL_LIGHT_ENABLED_LABEL
                  : BUTTON_TYPE.CANCEL_LIGHT_DISABLED_LABEL
                }`,
              )}>
                {'  '}
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw(
                `${isEditable
                  ? BUTTON_TYPE.PRIMARY_BORDER_ENABLED
                  : BUTTON_TYPE.PRIMARY_DISABLED
                } px-8 ml-6`,
              )}
              onPress={handleSave}
              disabled={!isEditable}
            >
              <Text
                text13R
                style={tw(
                  `${isEditable
                    ? BUTTON_TYPE.PRIMARY_BORDER_ENABLED_LABEL
                    : BUTTON_TYPE.PRIMARY_DISABLED_LABEL
                  }`,
                )}
              >
                {'  '}
                Save
              </Text>
            </TouchableOpacity>
          </View>}
        </View>}
        <TouchableOpacity
          disabled={isFinalizeDisabled}
          style={tw(
            `${isFinalizeDisabled
              ? BUTTON_TYPE.PRIMARY_DISABLED
              : BUTTON_TYPE.PRIMARY_BORDER_ENABLED
            } px-8 ml-6 ${isAgreementFinalized ? "mr-2" : ""}`,
          )}
          onPress={handlePreview}>
          <Text text13R style={tw(
            `${isFinalizeDisabled
              ? BUTTON_TYPE.PRIMARY_DISABLED_LABEL
              : BUTTON_TYPE.PRIMARY_BORDER_ENABLED_LABEL
            }`,
          )}>
            {'  '}
            Preview
          </Text>
        </TouchableOpacity>
        {!isAgreementFinalized && <TouchableOpacity
          disabled={isFinalizeDisabled}
          style={tw(
            `${isFinalizeDisabled
              ? BUTTON_TYPE.PRIMARY_DISABLED
              : BUTTON_TYPE.PRIMARY_ENABLED
            } px-36px ml-6`,
          )}
          onPress={handleFinalize}>
          <Text text13R style={tw(
            `${isFinalizeDisabled
              ? BUTTON_TYPE.PRIMARY_DISABLED_LABEL
              : BUTTON_TYPE.PRIMARY_ENABLED_LABEL
            }`,
          )}>
            {'  '}
            Finalize
          </Text>
        </TouchableOpacity>}
      </View>
    </View>
  );
};

export default TAHeaderComponent;
