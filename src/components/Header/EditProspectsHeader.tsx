import React, { useState } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { useNavigation } from '@react-navigation/native';
import { images } from 'src/assets/Images';
import { TouchableOpacity } from 'react-native';
import PillsComponent from 'src/components/Common/PillsComponent';
import { PROSPECT_STATUS, PROSPECT_STATUS_TITLE } from 'src/utils/Constant';
import CustomerIconComponent2 from '../Common/CustomerIconComponent2';
import { toast } from 'src/utils/Util';

interface EditProspectsHeaderProps {
  isEditable: boolean;
  handleEditSave: any;
  handleInterest: any;
  handleNamePress: any;
  data: any;
  prospectName: string;
}

const EditProspectsHeader = (props: EditProspectsHeaderProps) => {
  const {
    isEditable,
    handleEditSave,
    handleInterest,
    handleNamePress,
    data,
    prospectName,
  } = props;
  const [isInterested, setIsInterested] = useState(
    data?.newCustomerRequestStatus !== PROSPECT_STATUS_TITLE.NOT_INTERESTED,
  );
  const [title, setTitle] = useState(data?.newCustomerRequestStatus);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
    return true;
  };

  const handleIsInterested = async () => {
    if (data.customerShipTo !== '') {
      toast.error({
        message:
          'label.createprospect.not_possible_to_change_status',
      });
      return;
    }

    try {
      await handleInterest(!isInterested);
      setIsInterested(!isInterested);
      setTitle(
        !isInterested
          ? PROSPECT_STATUS_TITLE.INITIAL
          : PROSPECT_STATUS_TITLE.NOT_INTERESTED,
      );
    } catch (error) {
      console.log('Something went wrong while handling interest', error);
    }
  };

  const handleEdit = () => {
    if (data.customerShipTo !== '') {
      toast.error({
        message:
          'label.createprospect.not_possible_to_update',
      });
      return;
    }
    handleEditSave();
  };

  const filteredProspectStatus = PROSPECT_STATUS.find(
    item => item.title === title,
  );

  return (
    <View
      centerH
      marginH-v4
      marginT-v4
      style={tw('flex-row justify-between ml-5')}>
      <View row centerV>
        <TouchableOpacity onPress={handleGoBack}>
          <images.DefaultLeftArrowIcon />
        </TouchableOpacity>
        <View row centerV marginL-v5>
          <CustomerIconComponent2 item={data} />
          <TouchableOpacity onPress={handleNamePress} disabled={isEditable}>
            <Text
              marginT-v03
              text18M
              textBlack
              marginL-v2
              marginR-v4
              numberOfLines={1}
              style={tw('max-w-screen-md underline')}>
              {prospectName}
            </Text>
          </TouchableOpacity>
          <View>
            <PillsComponent item={{ ...filteredProspectStatus }} />
          </View>
        </View>
        <View row flex style={tw('justify-end')}>
          <View style={tw('bg-light-white')}>
            {isEditable ? null : (
              <TouchableOpacity style={tw('')} onPress={handleIsInterested}>
                {isInterested ? (
                  <images.ThumbDownIcon />
                ) : (
                  <images.ThumbUpIcon />
                )}
              </TouchableOpacity>
            )}
          </View>
          {title == 'New Cust. Req.' ? null : (
            <TouchableOpacity
              onPress={handleEdit}
              style={tw(
                `${isEditable
                  ? 'bg-light-darkBlue'
                  : 'border-light-darkBlue border-default'
                }  rounded-md py-2 px-36px flex-row items-center ml-6`,
              )}>
              <Text
                text13R
                style={tw(
                  `${isEditable ? 'text-light-white' : 'text-light-darkBlue'}`,
                )}>
                {isEditable ? 'btn.general.save' : 'btn.general.edit'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default EditProspectsHeader;
