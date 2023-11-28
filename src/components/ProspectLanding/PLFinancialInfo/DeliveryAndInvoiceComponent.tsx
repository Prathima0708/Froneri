import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import {tw} from 'src/tw';
import InputText from 'src/components/InputText';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import Dropdown from 'src/components/DropDown';

interface DeliveryAndInvoiceComponentProps {
  deliveryTypeDropdownData: any;
  invoiceRhythmDropdownData: any;
  rekapDropdownData: any;
  pdfInvoicingDropdownData: any;
  inputData?: any;
  setDeliveryTypeDropdownData?: any;
  handleInputChange: any;
  errorMessages?: any;
  isEditable: boolean;
  mandatoryData: any;
}

const DeliveryAndInvoiceComponent = (
  props: DeliveryAndInvoiceComponentProps,
) => {
  const {
    deliveryTypeDropdownData,
    invoiceRhythmDropdownData,
    rekapDropdownData,
    pdfInvoicingDropdownData,
    inputData,
    handleInputChange,
    errorMessages,
    isEditable,
    mandatoryData,
  } = props;

  const handleDeliveryNoteType = handleInputChange('deliveryNoteType');
  const handleInvoiceRhythm = handleInputChange('invoiceRhythm');
  const handleRekap = handleInputChange('rekap');
  const handlePdfInvoicing = handleInputChange('pdfInvoicing');
  const handleEmailPdfInvoicing = handleInputChange('emailPdfInvoicing');

  const deliveryNoteTypeTitle = mandatoryData.deliveryNoteType
    ? 'Delivery Note Type*'
    : 'Delivery Note Type';
  const invoiceRhythmTitle = mandatoryData.invoiceRhythm
    ? 'Invoice Rhythm*'
    : 'Invoice Rhythm';
  const rekapTitle = mandatoryData.rekap ? 'Rekap*' : 'Rekap';
  const pdfInvoicingTitle = mandatoryData.pdfInvoicing
    ? 'PDF Invoicing*'
    : 'PDF Invoicing';
  const emailPdfInvoicingTitle = mandatoryData.emailPdfInvoicing
    ? 'Email PDF Invoicing*'
    : 'Email PDF Invoicing';

  return (
    <View padding-v4 marginT-v2>
      <View centerH style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          Delivery and Invoicing
        </Text>
      </View>
      <View marginT-v5 row>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={deliveryNoteTypeTitle}
            data={deliveryTypeDropdownData}
            placeholder={isEditable && 'List of Items'}
            value={inputData.deliveryNoteType}
            labelField={'description'}
            valueField={'discoveryListValuesId'}
            onChange={handleDeliveryNoteType}
            errorMsg={errorMessages.deliveryNoteType}
            isEditable={isEditable}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={invoiceRhythmTitle}
            data={invoiceRhythmDropdownData}
            placeholder={isEditable && 'List of Items'}
            value={inputData.invoiceRhythm}
            labelField={'description'}
            valueField={'discoveryListValuesId'}
            onChange={handleInvoiceRhythm}
            errorMsg={errorMessages.invoiceRhythm}
            search={invoiceRhythmDropdownData.length === 0}
            renderInputSearch={() => (
              <Text text13M grey3 center>
                No data
              </Text>
            )}
            isEditable={isEditable}
          />
        </View>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <Dropdown
            title={rekapTitle}
            data={rekapDropdownData}
            placeholder={isEditable && 'List of Items'}
            value={inputData.rekap}
            labelField={'description'}
            valueField={'discoveryListValuesId'}
            onChange={handleRekap}
            errorMsg={errorMessages.rekap}
            search={rekapDropdownData.length === 0}
            renderInputSearch={() => (
              <Text text13M grey3 center>
                No data
              </Text>
            )}
            isEditable={isEditable}
          />
        </View>
        <View flex style={tw('border-light-lavendar')}>
          <Dropdown
            title={pdfInvoicingTitle}
            data={pdfInvoicingDropdownData}
            placeholder={isEditable && 'List of Items'}
            value={inputData.pdfInvoicing}
            labelField={'description'}
            valueField={'discoveryListValuesId'}
            onChange={handlePdfInvoicing}
            errorMsg={errorMessages.pdfInvoicing}
            isEditable={isEditable}
          />
        </View>
      </View>
      <View marginT-v6 row centerV>
        <View flex marginR-v2 style={tw('border-light-lavendar')}>
          <InputText
            title={emailPdfInvoicingTitle}
            style={tw(
              'rounded-md border-default border-light-lavendar mt-1 px-3 py-1',
            )}
            placeholder={isEditable && 'Email for PDF Invoicing'}
            inputPlaceHolderTextColor={ColourPalette.light.grey2}
            value={inputData.emailPdfInvoicing}
            onChangeText={handleEmailPdfInvoicing}
            errorMsg={errorMessages.emailPdfInvoicing}
            isEditable={isEditable}
          />
        </View>
        <View style={tw('flex-3')} marginR-v2 />
      </View>
    </View>
  );
};

export default DeliveryAndInvoiceComponent;
