import View from 'src/components/View';
import Text from 'src/components/Text';
import {images} from 'src/assets/Images';
import React from 'react';
import Card from 'src/components/Card';
import {TouchableOpacity} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {tw} from 'src/tw';
import CopyTextComponent from 'src/components/Common/CopyTextComponent';

interface ContactComponentProps {
  contactsData: any;
  onRightIconPress: any;
}

const RenderContacts = (props: any) => {
  const {item, index} = props;

  const name = item?.name ? item.name.trim() : '--';
  const phoneNumber = item.phoneNumber ? item.phoneNumber.trim() : '--';
  const mobileNumber = item.mobileNumber ? item.mobileNumber.trim() : '--';

  return (
    <View row centerV style={tw(index !== 0 ? 'mt-2-1' : 'mt-0')}>
      <Text text13R textBlack flex-2 marginR-v1 numberOfLines={1}>
        {name}
      </Text>
      <View row centerV flex-4>
        <images.CallIcon />
        <CopyTextComponent
          text13R
          textBlack
          flex
          numberOfLines={1}
          text={phoneNumber}
          style={tw('mt-1')}
          viewStyle={{'marginR-v2': true}}
        />
        <images.CallIcon />
        <CopyTextComponent
          text13R
          textBlack
          flex
          numberOfLines={1}
          text={mobileNumber}
          style={tw('mt-1')}
          viewStyle={{'marginR-v2': true}}
        />
      </View>
    </View>
  );
};

const ContactComponent = (props: ContactComponentProps) => {
  const {contactsData, onRightIconPress} = props;

  return (
    <Card marginR-v2 marginB-v2 paddingH-v4 paddingV-v3>
      <View centerV>
        <View row spread centerV>
          <Text text18M textBlack>
            label.general.contacts
          </Text>
          <TouchableOpacity onPress={onRightIconPress}>
            <images.DefaultRightArrowIcon />
          </TouchableOpacity>
        </View>
        <View marginT-v1>
          <FlatList
            data={contactsData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => {
              return <RenderContacts item={item} index={index} />;
            }}
          />
        </View>
      </View>
    </Card>
  );
};

export default ContactComponent;
