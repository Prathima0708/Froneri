import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import React from 'react';
import { tw } from 'src/tw';
import { TouchableOpacity } from 'react-native';
import CopyTextComponent from 'src/components/Common/CopyTextComponent';

interface FieldSalesContactProps {
  item: any;
  onPressFieldModal?: any;
  isFieldSalesContact: boolean;
  isTeleSalesContact: boolean;
}
const RenderContact = (props: FieldSalesContactProps) => {
  const { item, onPressFieldModal, isFieldSalesContact, isTeleSalesContact } =
    props;
  let title = item.title ? item.title : '';
  let name = '';
  if (isFieldSalesContact) {
    name =
      item.firstName && item.firstName.trim()
        ? title + item.firstName + ' ' + item.lastName
        : '--';
  } else {
    name =
      title + item?.name && typeof item.name === 'string' && item.name.trim()
        ? item.name
        : '--';
  }

  const phone1 =
    item?.phone1 && typeof item.phone1 === 'string' && item.phone1.trim()
      ? item.phone1
      : '--';
  const phone2 =
    item?.phone2 && typeof item.phone2 === 'string' && item.phone2.trim()
      ? item.phone2
      : '--';
  const emailId =
    item?.email && typeof item.email === 'string' && item.email.trim()
      ? item.email
      : '--';
  const description =
    item?.description &&
      typeof item.description === 'string' &&
      item.description.trim()
      ? item.description
      : '--';
  const fax = item?.fax && item.fax.trim() ? item.fax : '--';
  const note = item?.note && item.note.trim() ? item.note : '--';

  const onIconPress = () => {
    onPressFieldModal(item);
  };

  return (
    <View
      br40
      marginT-v2
      style={tw(
        `${isFieldSalesContact ? 'px-6 pb-6 pt-4' : 'px-6 py-6'
        } border-default border-light-lavendar`,
      )}>
      <View row centerV spread>
        <Text text13M textBlack>
          {name}
        </Text>
        {isFieldSalesContact && (
          <TouchableOpacity onPress={onIconPress}>
            <images.DefaultRightArrowIcon />
          </TouchableOpacity>
        )}
      </View>
      {isFieldSalesContact && (
        <View>
          <View row centerV marginT-v1>
            <Text text13R textLight flex>
              Phone Number
            </Text>
            <CopyTextComponent
              text13R
              textBlack
              numberOfLines={1}
              text={item.phoneNumber}
              viewStyle={{ 'flex-2': true, 'centerV': true, style: tw('-mb-1') }}
            />
          </View>
          <View row centerV marginT-v2>
            <Text text13R textLight flex>
              Mobile Number
            </Text>
            <CopyTextComponent
              text13R
              textBlack
              numberOfLines={1}
              text={item.mobileNumber}
              viewStyle={{ 'flex-2': true, 'centerV': true, style: tw('-mb-1') }}
            />
          </View>
        </View>
      )}
      {isTeleSalesContact && (
        <View>
          <View row centerV marginT-v2>
            <Text text13R textLight flex>
              Phone 1
            </Text>
            <CopyTextComponent
              text13R
              textBlack
              numberOfLines={1}
              text={phone1}
              viewStyle={{ 'flex-2': true, 'centerV': true, style: tw('-mb-1') }}
            />
          </View>
          <View row centerV marginT-v2>
            <Text text13R textLight flex>
              Phone 2
            </Text>
            <CopyTextComponent
              text13R
              textBlack
              numberOfLines={1}
              text={phone2}
              viewStyle={{ 'flex-2': true, 'centerV': true, style: tw('-mb-1') }}
            />
          </View>
        </View>
      )}
      {isFieldSalesContact && (
        <View row centerV marginT-v2>
          <Text text13R textLight flex>
            Fax
          </Text>
          <CopyTextComponent
            text13R
            textBlack
            numberOfLines={1}
            text={fax}
            viewStyle={{ 'flex-2': true, 'centerV': true, style: tw('-mb-1') }}
          />
        </View>
      )}
      <View row centerV marginT-v2>
        <Text text13R textLight flex>
          Email ID
        </Text>
        <CopyTextComponent
          text13R
          textBlack
          numberOfLines={1}
          text={emailId}
          viewStyle={{ 'flex-2': true, 'centerV': true, style: tw('-mb-1') }}
        />
      </View>
      {isTeleSalesContact && (
        <View row centerV marginT-v2>
          <Text text13R textLight flex>
            Description
          </Text>
          <Text text13R textBlack flex-2 numberOfLines={1}>
            {description}
          </Text>
        </View>
      )}
      {isFieldSalesContact && (
        <View row centerV marginT-v2>
          <Text text13R textLight flex>
            Note
          </Text>
          <Text text13R textBlack flex-2 numberOfLines={1}>
            {note}
          </Text>
        </View>
      )}
    </View>
  );
};

export default RenderContact;
