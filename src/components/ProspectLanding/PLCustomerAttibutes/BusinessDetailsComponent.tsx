import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import { tw } from 'src/tw';
import InputText from 'src/components/InputText';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import Dropdown from 'src/components/DropDown';
import { images } from 'src/assets/Images';
import { PRIORITY_DROPDOWN } from 'src/utils/DropdownConst';
import CheckBox from 'src/components/CheckBox';
import DateTimePicker from 'src/components/DateTimePicker';
import { DATETIME_PICKER_MODE } from 'src/utils/Constant';
import { TouchableOpacity } from 'react-native';

interface BusinessDetailsComponentProps {
  abcClassificationDropdownData?: any;
  startBusinessReasonDropdownData?: any;
  distributerDropdownData?: any;
  inputData?: any;
  handleInputChange?: any;
  handleSaveCustomerInfo?: any;
  errorMessages?: any;
  handleScooping?: any;
  handleIndirectCustomer?: any;
  mandatoryData?: any;
  nameDropdownData?: any;
  isEnableWholeSaler: boolean;
  isEnableDistributor: boolean;
  isEditable: boolean;
  handleCancel: any;
}

const BusinessDetailsComponent = (props: BusinessDetailsComponentProps) => {
  const {
    abcClassificationDropdownData,
    startBusinessReasonDropdownData,
    distributerDropdownData,
    inputData,
    handleInputChange,
    errorMessages,
    handleScooping,
    handleIndirectCustomer,
    handleSaveCustomerInfo,
    mandatoryData,
    nameDropdownData,
    isEnableWholeSaler,
    isEnableDistributor,
    isEditable,
    handleCancel,
  } = props;

  const abcClassificationTitle = `ABC Classification${mandatoryData.abcClassification === 1 ? '*' : ''
    }`;
  const priorityTitle = `Priority${mandatoryData.priority === 1 ? '*' : ''}`;
  const keyAccountGLNCodeTitle = `Key Account GLN Code${mandatoryData.keyAccountGLNCode === 1 ? '*' : ''
    }`;
  const scoopingTitle = `Scooping${mandatoryData.scooping === 1 ? '*' : ''}`;
  const startBusinessDateTitle = `Start Business Date${mandatoryData.startBusinessDate === 1 ? '*' : ''
    }`;
  const startBusinessReasonTitle = `Start Business Reason${mandatoryData.startBusinessReason === 1 ? '*' : ''
    }`;
  const indirectCustomerTitle = `Indirect Customer${mandatoryData.indirectCustomer === 1 ? '*' : ''
    }`;
  const firstName = `First Name${mandatoryData.firstName === 1 ? '*' : ''}`;
  const lastName = `Last Name${mandatoryData.lastName === 1 ? '*' : ''}`;
  const nameTitle = `Canvasser Name${mandatoryData.name === 1 ? '*' : ''}`;
  let wholeSalerCustomerNumberTitle = `Wholesaler Customer Number${mandatoryData.wholeSalerCustomerNumber === 1 ? '*' : ''
    }`;
  let distributorTitle = `Distributor${mandatoryData.distributer === 1 ? '*' : ''
    }`;

  const handleAbcClassification = handleInputChange('abcClassification');
  const handlePriority = handleInputChange('priority');
  const handleStartBusinessDate = handleInputChange('startBusinessDate');
  const handleStartBusinessReason = handleInputChange('startBusinessReason');
  const handleKeyAccountGLNCode = handleInputChange('keyAccountGLNCode');
  const handleWholeSalerCustomerNumber = handleInputChange(
    'wholeSalerCustomerNumber',
  );
  const handleDistributer = handleInputChange('distributer');
  const handleFirstName = handleInputChange('firstName');
  const handleLastName = handleInputChange('lastName');
  const handleName = handleInputChange('name');

  return (
    <View>
      <View paddingH-v4 paddingB-v4>
        <View marginT-v3 row>
          <View flex marginR-v2 style={tw('border-light-lavendar')}>
            <Dropdown
              title={abcClassificationTitle}
              data={abcClassificationDropdownData}
              placeholder="Select ABC Classification"
              value={inputData.abcClassification}
              labelField={'descriptionLanguage'}
              valueField={'abcClassification'}
              onChange={handleAbcClassification}
              errorMsg={errorMessages.abcClassification}
              isEditable={isEditable}
            />
          </View>
          <View flex marginR-v2 style={tw('border-light-lavendar')}>
            <Dropdown
              title={priorityTitle}
              data={PRIORITY_DROPDOWN}
              placeholder="Select Priority"
              value={inputData.priority}
              labelField={'label'}
              valueField={'value'}
              onChange={handlePriority}
              errorMsg={errorMessages.priority}
            />
          </View>
          <View flex marginR-v2 style={tw('border-light-lavendar')} centerV>
            <View marginT-v4 row>
              <CheckBox
                label={scoopingTitle}
                labelStyle={tw('text-light-grey2')}
                value={inputData.scooping}
                onValueChange={handleScooping}
                color={
                  inputData
                    ? ColourPalette.light.darkBlue
                    : ColourPalette.light.grey4
                }
              />
            </View>
          </View>
        </View>
        <View marginT-v6 row>
          <View flex marginR-v2 style={tw('border-light-lavendar')}>
            <Text text13M textBlack>
              {startBusinessDateTitle}
            </Text>
            <DateTimePicker
              dateFormat={'DD-MM-YYYY'}
              mode={DATETIME_PICKER_MODE.DATE}
              maximumDate={new Date()}
              onChange={handleStartBusinessDate}
              renderInput={({ value }: any) => {
                return (
                  <View
                    style={tw(
                      `flex-row items-center rounded-md border-default border-light-lavendar  pl-3 justify-between mt-1 ${isEditable ? 'bg-light-white' : 'bg-light-white1'
                      } `,
                    )}>
                    <Text text13R marginR-v2 textBlack>
                      {value}
                    </Text>
                    <images.CalendarIcon />
                  </View>
                );
              }}
              value={inputData.startBusinessDate}
              errorMsg={errorMessages.startBusinessDate}
              editable={isEditable}
            />
          </View>
          <View flex marginR-v2 style={tw('border-light-lavendar')}>
            <Dropdown
              title={startBusinessReasonTitle}
              data={startBusinessReasonDropdownData}
              placeholder={'Select Start Business Reason'}
              value={inputData.startBusinessReason}
              labelField={'description'}
              valueField={'idCustomerBusinessReason'}
              onChange={handleStartBusinessReason}
              errorMsg={errorMessages.startBusinessReason}
              isEditable={isEditable}
            />
          </View>
          <View flex marginR-v2 style={tw('border-light-lavendar')}>
            <InputText
              title={keyAccountGLNCodeTitle}
              placeholder="Enter Key Account GLN Code"
              value={inputData.keyAccountGLNCode}
              onChangeText={handleKeyAccountGLNCode}
              maxLength={35}
              errorMsg={errorMessages.keyAccountGLNCode}
              isEditable={isEditable}
            />
          </View>
        </View>
        <View marginT-v6 row>
          <View flex marginR-v2 style={tw('border-light-lavendar')}>
            <View marginT-v4 row centerV>
              <CheckBox
                label={indirectCustomerTitle}
                labelStyle={tw('text-light-grey2')}
                value={inputData.indirectCustomer}
                onValueChange={handleIndirectCustomer}
                color={
                  inputData
                    ? ColourPalette.light.darkBlue
                    : ColourPalette.light.grey4
                }
                disabled={!isEditable}
              />
            </View>
          </View>
          <View flex marginR-v2 style={tw('border-light-lavendar')}>
            <InputText
              title={wholeSalerCustomerNumberTitle}
              keyboardType="numeric"
              placeholder="Enter Wholesaler Customer Number"
              value={inputData.wholeSalerCustomerNumber}
              onChangeText={handleWholeSalerCustomerNumber}
              maxLength={10}
              errorMsg={errorMessages.wholeSalerCustomerNumber}
              isEditable={isEnableWholeSaler}
            />
          </View>
          <View flex marginR-v2 style={tw('border-light-lavendar')}>
            <Dropdown
              title={distributorTitle}
              data={distributerDropdownData}
              placeholder="Select Distributor"
              value={inputData.distributer}
              labelField={'description'}
              valueField={'idDistributors'}
              onChange={handleDistributer}
              errorMsg={errorMessages.distributer}
              isEditable={isEnableDistributor}
            />
          </View>
        </View>
      </View>
      <View padding-v4>
        <View centerH style={tw('flex-row justify-between')}>
          <Text text18M textBlack>
            Owner / Deputy Details
          </Text>
        </View>
        <View marginT-v3 row>
          <View flex marginR-v2 style={tw('border-light-lavendar')}>
            <InputText
              title={firstName}
              placeholder="Enter First Name"
              value={inputData.firstName}
              onChangeText={handleFirstName}
              errorMsg={errorMessages.firstName}
              maxLength={35}
              isEditable={isEditable}
            />
          </View>
          <View flex marginR-v2 style={tw('border-light-lavendar')}>
            <InputText
              title={lastName}
              placeholder="Enter Last Name"
              value={inputData.lastName}
              onChangeText={handleLastName}
              errorMsg={errorMessages.firstName}
              maxLength={35}
              isEditable={isEditable}
            />
          </View>
          <View flex />
        </View>
      </View>
      <View padding-v4>
        <View centerH style={tw('flex-row justify-between')}>
          <Text text18M textBlack>
            FSR Details
          </Text>
        </View>
        <View marginT-v3 row>
          <View flex marginR-v2 style={tw('border-light-lavendar')}>
            <Dropdown
              title={nameTitle}
              data={nameDropdownData}
              placeholder="Select Name"
              value={inputData.name}
              labelField={'employee'}
              valueField={'partnerNumber'}
              onChange={handleName}
              errorMsg={errorMessages.name}
              isEditable={isEditable}
            />
          </View>
          <View flex />
          <View flex />
        </View>
      </View>
    </View>
  );
};

export default BusinessDetailsComponent;
