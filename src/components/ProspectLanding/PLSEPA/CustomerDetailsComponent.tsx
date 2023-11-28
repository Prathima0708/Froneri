import View from 'src/components/View';
import React, {useState} from 'react';
import InputText from 'src/components/InputText';
import {formatDateReverse} from 'src/utils/CommonUtil';

interface CustomerDetailsComponentProps {
  sepaData: any;
}

const CustomerDetailsComponent = (props: CustomerDetailsComponentProps) => {
  const {sepaData} = props;

  const [formData, setFormData] = useState({
    name_1: sepaData.name1,
    houseNumber: sepaData.houseNumber,
    street: sepaData.street,
    city: sepaData.city,
    postalCode: sepaData.postalCode,
  });

  const handleChange = (fieldName: string, text: string) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: text,
    }));
  };

  return (
    <View>
      <View row>
        <View flex marginR-v2>
          <InputText
            title="Agreement Number"
            isEditable={false}
            value={sepaData.agreementNumber}
          />
        </View>
        <View flex marginR-v2>
          <InputText
            title="Mandate Reference Number"
            isEditable={false}
            value={sepaData.mandateReferenceNumber}
          />
        </View>
        <View flex marginR-v2>
          <InputText
            title="Signed Date"
            isEditable={false}
            value={sepaData.signedDate}
          />
        </View>
        <View flex marginR-v2>
          <InputText
            title="Status"
            isEditable={false}
            value={sepaData.status}
          />
        </View>
      </View>
      <View row marginT-v5>
        <View flex marginR-v2>
          <InputText
            title="Name 1"
            isEditable={false}
            value={formData.name_1}
            onChangeText={(text: any) => handleChange('name_1', text)}
          />
        </View>
        <View flex marginR-v2>
          <InputText
            title="House Number"
            isEditable={false}
            value={formData.houseNumber}
            onChangeText={(text: any) => handleChange('houseNumber', text)}
          />
        </View>
        <View flex marginR-v2>
          <InputText
            title="Street"
            isEditable={false}
            value={formData.street}
            onChangeText={(text: any) => handleChange('street', text)}
          />
        </View>
        <View flex marginR-v2>
          <InputText
            title="City"
            isEditable={false}
            value={formData.city}
            onChangeText={(text: any) => handleChange('city', text)}
          />
        </View>
      </View>
      <View row marginT-v5>
        <View flex marginR-v6>
          <InputText
            title="Postal Code"
            isEditable={false}
            value={formData.postalCode}
            onChangeText={(text: any) => handleChange('postalCode', text)}
          />
        </View>
        <View flex-3 />
      </View>
    </View>
  );
};

export default CustomerDetailsComponent;
