import View from 'src/components/View';
import React, {useState} from 'react';
import {tw} from 'src/tw';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';
import RenderPCModalComponent from './RenderPCModalComponent';
import ListingHeaderPCModalComponent from './ListingHeaderPCModalComponent';
import Text from 'src/components/Text';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import {FlatList} from 'react-native';

interface PCModalContentComponentProps {
  item: any;
  handleInputChange: any;
  errorMessages: any;
  isEditable: boolean;
}

const PCModalContentComponent = (props: PCModalContentComponentProps) => {
  const {item, handleInputChange, errorMessages, isEditable} = props;

  const handleSalesRepName = handleInputChange('salesRepName');

  const handlePhoneNumber = handleInputChange('phoneNumber');

  const handleEmail = handleInputChange('email');

  const handleDateAndTime = handleInputChange('dateAndTime');

  return (
    <View>
      <View marginT-v1>
        <Text text18M textBlack>
          Claim Entered By
        </Text>

        {item?.claimEnteredBy.map((item: any, index: any) => (
          <View key={index + ''} marginT-v2 row>
            <View flex marginR-v2 style={tw('border-light-lavendar')}>
              <InputText
                title={'TSO/Sales Rep Name'}
                inputPlaceHolderTextColor={ColourPalette.light.grey2}
                value={item.name ? item.name : '-'}
                onChangeText={handleSalesRepName}
                isEditable={isEditable}
                maxLength={35}
                errorMsg={errorMessages.salesRepName}
              />
            </View>
            <View flex marginR-v2 style={tw('border-light-lavendar')}>
              <InputText
                title={'Phone Number'}
                inputPlaceHolderTextColor={ColourPalette.light.grey2}
                value={item.phone ? item.phone : '-'}
                onChangeText={handlePhoneNumber}
                isEditable={isEditable}
                maxLength={35}
                errorMsg={errorMessages.phoneNumber}
              />
            </View>
            <View flex marginR-v2 style={tw('border-light-lavendar')}>
              <InputText
                title={'Email'}
                inputPlaceHolderTextColor={ColourPalette.light.grey2}
                value={item.mail_address ? item.mail_address : '-'}
                onChangeText={handleEmail}
                isEditable={isEditable}
                maxLength={35}
                errorMsg={errorMessages.email}
              />
            </View>
            <View flex style={tw('border-light-lavendar')}>
              <InputText
                title={'Entry Date and Time'}
                inputPlaceHolderTextColor={ColourPalette.light.grey2}
                value={item.entry_date ? item.entry_date : '-'}
                onChangeText={handleDateAndTime}
                isEditable={isEditable}
                maxLength={35}
                errorMsg={errorMessages.dateAndTime}
              />
            </View>
          </View>
        ))}
      </View>
      <View marginT-v5>
        <Text text18M textBlack>
          Customer Data
        </Text>
        {item.customerDetail.map((item: any, index: any) => (
          <View>
            <View marginT-v2 row>
              <View flex marginR-v2 style={tw('border-light-lavendar')}>
                <InputText
                  title={'Sales Area'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.salesArea ? item.salesArea + '' : '-'}
                  onChangeText={handleSalesRepName}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.salesRepName}
                />
              </View>
              <View flex marginR-v2 style={tw('border-light-lavendar')}>
                <InputText
                  title={'Name 1'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.name1 ? item.name1 : '-'}
                  onChangeText={handlePhoneNumber}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.phoneNumber}
                />
              </View>
              <View flex marginR-v2 style={tw('border-light-lavendar')}>
                <InputText
                  title={'Name 2'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.name2 ? item.name2 : '-'}
                  onChangeText={handleEmail}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.email}
                />
              </View>
              <View flex style={tw('border-light-lavendar')}>
                <InputText
                  title={'Name 3'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.name3 && item.name3.trim() ? item.name3 : '-'}
                  onChangeText={handleDateAndTime}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.dateAndTime}
                />
              </View>
            </View>
            <View marginT-v3 row>
              <View flex marginR-v2 style={tw('border-light-lavendar')}>
                <InputText
                  title={'Street 1'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.street1 ? item.street1 : '-'}
                  onChangeText={handleSalesRepName}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.salesRepName}
                />
              </View>
              <View flex marginR-v2 style={tw('border-light-lavendar')}>
                <InputText
                  title={'Street 2'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.street2 ? item.street2 : '-'}
                  onChangeText={handlePhoneNumber}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.phoneNumber}
                />
              </View>
              <View flex marginR-v2 style={tw('border-light-lavendar')}>
                <InputText
                  title={'Street 3'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.street3 ? item.street3 : '-'}
                  onChangeText={handleEmail}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.email}
                />
              </View>
              <View flex style={tw('border-light-lavendar')}>
                <InputText
                  title={'Address'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.address1 ? item.address1 : '-'}
                  onChangeText={handleDateAndTime}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.dateAndTime}
                />
              </View>
            </View>
            <View marginT-v3 row>
              <View flex marginR-v2 style={tw('border-light-lavendar')}>
                <InputText
                  title={'Postal Code'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.postal_code ? item.postal_code : '-'}
                  onChangeText={handleSalesRepName}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.salesRepName}
                />
              </View>
              <View flex marginR-v2 style={tw('border-light-lavendar')}>
                <InputText
                  title={'Phone Number'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.phone ? item.phone + '' : '-'}
                  onChangeText={handlePhoneNumber}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.phoneNumber}
                />
              </View>
              <View flex marginR-v2 style={tw('border-light-lavendar')}>
                <InputText
                  title={'Fax Number'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.fax ? item.fax + '' : '-'}
                  onChangeText={handleEmail}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.email}
                />
              </View>
              <View flex style={tw('border-light-lavendar')}>
                <InputText
                  title={'Email'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.email ? item.email : '-'}
                  onChangeText={handleDateAndTime}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.dateAndTime}
                />
              </View>
            </View>
            <View marginT-v3 row>
              <View flex marginR-v2 style={tw('border-light-lavendar')}>
                <InputText
                  title={'RDC'}
                  inputPlaceHolderTextColor={ColourPalette.light.grey2}
                  value={item.rdc ? item.rdc : '-'}
                  onChangeText={handleSalesRepName}
                  isEditable={isEditable}
                  maxLength={35}
                  errorMsg={errorMessages.salesRepName}
                />
              </View>
              <View flex-3 />
            </View>
          </View>
        ))}
      </View>
      <View marginT-v5>
        <Text text18M textBlack>
          Sales Rep
        </Text>
        <View marginT-v2 flex>
          {item.salesRepDetail.length === 0 ? (
            <NoDataComponent />
          ) : (
            <View
              flex
              style={tw(
                'rounded-md bg-light-white border-default border-light-lavendar rounded-md',
              )}>
              <ListingHeaderPCModalComponent />
              <View flex>
                <FlatList
                  data={item?.salesRepDetail ?? []}
                  keyExtractor={(_: any, index) => index.toString()}
                  renderItem={({item, index}) => {
                    return (
                      <RenderPCModalComponent
                        item={item}
                        index={index}
                        lastItem={
                          item?.salesRepDetail
                            ? item?.salesRepDetail.length - 1 === index
                            : false
                        }
                      />
                    );
                  }}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default PCModalContentComponent;
