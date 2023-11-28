import React, {FC, useEffect, useState} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import View from 'src/components/View';
import {tw} from 'src/tw';
import Text from 'src/components/Text';
import {images} from 'src/assets/Images';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import PLSepaPreviewController from 'src/controller/PLSepaPreviewController';
import {toast} from 'src/utils/Util';
import {formatDateReverse} from 'src/utils/CommonUtil';

const PLSEPAPreview: FC = (props: any) => {
  const {sepaData} = props.route.params;
  const [previewLabel, setPreviewLabel] = useState({
    title: '',
    body: '',
  });
  const [ibanArray, setIbanArray] = useState([]);
  const [signedDate, setSignedDate] = useState('');

  useEffect(() => {
    getPreviewScreensLabelFromTextsReport();
    try {
      console.log('sepaData', sepaData);
      if (sepaData.ibanNumber && sepaData.ibanNumber != '') {
        const iban = sepaData.ibanNumber.split('');
        setIbanArray(iban);
      }
      if (
        sepaData.originalFormatSignedDate &&
        sepaData.originalFormatSignedDate != ''
      ) {
        const signed = sepaData.originalFormatSignedDate.split(' ');
        if (signed.length > 0) {
          setSignedDate(signed[0]);
        }
      }
    } catch (e) {
      console.log('error', e);
    }
  }, []);

  const getPreviewScreensLabelFromTextsReport = async () => {
    try {
      const response =
        await PLSepaPreviewController.getPreviewScreensLabelFromTextsReport(
          sepaData.agreementType == 'SEPA',
        );
      console.log('Preview response', response);
      if (response) {
        setPreviewLabel(response);
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  return (
    <SafeAreaView style={tw('bg-light-lightGrey flex-1')}>
      <View flex>
        <ProspectLandingHeader />
        <View style={tw('bg-light-lightBlue3 h-6 justify-center items-center')}>
          <Text text13R>{'Preview: SEPA Agreement'}</Text>
        </View>
        <View
          flex-1
          marginH-v4
          marginB-v4
          padding-v4
          marginT-v3
          style={tw('bg-light-white border-default border-light-lavendar')}>
          <ScrollView style={tw('flex-1')}>
            <View flex>
              <View row centerV>
                <View flex-2 style={tw('border-light-darkBlue')}>
                  <images.FroneriIcon />
                </View>
                <View flex-4 style={tw('border-light-grey1 justify-center')}>
                  <Text textBlack text20BO>
                    {previewLabel.title}
                  </Text>
                </View>
              </View>
              <View marginT-v3 style={tw('bg-light-black h-px')} />
              <View row flex marginT-v3>
                <Text flex-13 text13R>
                  {previewLabel.body}
                </Text>
              </View>
              <View marginT-v3 row>
                <Text textBlack text13M>
                  {'Customer Number:'}
                </Text>
                <Text textBlack text13R marginT-v05 marginL-v02>
                  {sepaData.customerNo}
                </Text>
              </View>
              <View marginT-v3>
                {sepaData.name1 && (
                  <Text textBlack text13M>
                    {sepaData.name1}
                  </Text>
                )}
                {sepaData.name2 && (
                  <Text textBlack text13M>
                    {sepaData.name2}
                  </Text>
                )}
                {sepaData.name3 && (
                  <Text textBlack text13M>
                    {sepaData.name3}
                  </Text>
                )}
              </View>
              <View marginT-v3 row>
                <Text textBlack text13M>
                  {'Address:'}
                </Text>
                <Text textBlack text13R marginT-v05 marginL-v02>
                  {sepaData.street +
                    ', ' +
                    sepaData.houseNumber +
                    ', ' +
                    sepaData.postalCode}
                </Text>
              </View>
              <Text textBlack text13R marginT-v05 marginL-v02>
                {sepaData.city}
              </Text>
              <View marginT-v3 row>
                <Text textBlack text13M>
                  {'Name of the Bank Account holder:'}
                </Text>
                <Text textBlack text13R marginT-v05 marginL-v02>
                  {sepaData.nameOfAccountHolder}
                </Text>
              </View>
              <View marginT-v3 row centerV>
                <Text textBlack text13M>
                  {'IBAN:'}
                </Text>
                {ibanArray.length > 0 &&
                  ibanArray.map((item: any, index: number) => {
                    return (
                      <Text
                        key={index}
                        textBlack
                        text13R
                        marginL-v1
                        style={tw(
                          'rounded-md bg-light-white border-default border-light-lavendar rounded-md px-10px py-1',
                        )}>
                        {item}
                      </Text>
                    );
                  })}
              </View>
            </View>
            <View flex bg-black></View>
          </ScrollView>
          <View marginT-v3 row style={tw('items-end')}>
            <Text textBlack text13M>
              {'Date:'}
            </Text>
            <Text textBlack text13R marginT-v05 marginL-v02>
              {signedDate ? formatDateReverse(new Date(signedDate)) : '--'}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PLSEPAPreview;
