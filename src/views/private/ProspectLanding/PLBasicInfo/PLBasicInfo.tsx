import View from 'src/components/View';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  CLIENT_DETAILS_TYPES,
  PROSPECT_LANDING_SCREENS,
} from 'src/utils/Constant';
import PLLeftMenuComponent from 'src/components/ProspectLanding/PLLeftMenuComponent/PLLeftMenuComponent';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import Card from 'src/components/Card';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import BasicInfoContentComponent from 'src/components/ProspectLanding/PLBasicInfo/BasicInfoContentComponent';
import BasicInfoAddressComponent from 'src/components/ProspectLanding/PLBasicInfo/BasicInfoAddressComponent';
import BasicInfoOutletInfoComponent from 'src/components/ProspectLanding/PLBasicInfo/BasicInfoOutletInfoComponent';
import BasicInfoMoreInfoComponent from 'src/components/ProspectLanding/PLBasicInfo/BasicInfoMoreInfoComponent';
import BasicInfoTopTabComponent from 'src/components/ProspectLanding/PLBasicInfo/BasicInfoTopTabComponent';
import Text from 'src/components/Text/Text';
import BasicInfoBillToAddressComponent from 'src/components/ProspectLanding/PLBasicInfo/BasicInfoBillToAddressComponent';
import CustomerSearchController from 'src/controller/CustomerSearchController';
import { toast } from 'src/utils/Util';
import ProspectsController from 'src/controller/ProspectsController';
import PLBasicInfoController from 'src/controller/PLBasicInfoController';
import { DROPDOWN_CONTROL_NAME } from 'src/utils/ControlName';
import { RootState, useAppDispatch, useAppSelector } from 'src/reducers/hooks';
import { withAuthScreen } from 'src/hoc/withAuthScreen';
import ACLService from 'src/services/ACLService';
import { allowOnlyOneDot, mobileRegex, validateEmail } from 'src/utils/CommonUtil';
import MessageModal from 'src/components/Common/MessageModal';
import { setProspectInfo } from 'src/reducers/ProspectLandingSlice';

const PLBasicInfo = () => {
  // Basic info states....
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [pdSelectedValue, setPDSelectedValue] = useState(
    CLIENT_DETAILS_TYPES.SHIP_TO,
  );
  const [countryDropdownData, setCountryDropdownData] = useState([]);
  const [
    outletClassificationDropdownData,
    setOutletClassificationDropdownData,
  ] = useState<any>([]);

  const [salesAreaDropdownData, setSalesAreaDropdownData] = useState([]);
  const [customerHierarchyDropdownData, setCustomerHierarchyDropdownData] =
    useState<any>([]);

  const [distributionChannelDropdownData, setDistributionChannelDropdownData] =
    useState<any>([]);
  const [languageDropdownData, setLanguageDropdownData] = useState<any>([]);

  const [shipToState, setShipToState] = useState<any>({
    name1: '',
    name2: '',
    name3: '',
    name4: '',
    email: '',
    phoneNumber: '',
    mobileNumber: '',
    fax: '',
    houseNumber: '',
    address1: '',
    address2: '',
    address3: '',
    zipCode: '',
    poBox: '',
    city: '',
    country: '',
    coOrStreet3: '',
    latitude: '',
    longitude: '',
    outlet: '',
    salesArea: '',
    distributionChannel: '',
    customerHierarchy: '',
    website: '',
    shopNumber: '',
    language: '',
    previousCustomerShipTo: '',
  });
  const [shipToErrorMessages, setShipToErrorMessages] = useState<any>({
    name1: '',
    name2: '',
    name3: '',
    name4: '',
    email: '',
    phoneNumber: '',
    mobileNumber: '',
    fax: '',
    houseNumber: '',
    address1: '',
    address2: '',
    address3: '',
    zipCode: '',
    poBox: '',
    city: '',
    country: '',
    coOrStreet3: '',
    latitude: '',
    longitude: '',
    outlet: '',
    salesArea: '',
    distributionChannel: '',
    customerHierarchy: '',
    website: '',
    shopNumber: '',
    language: '',
    previousCustomerShipTo: '',
  });
  const [shipToMandatoryFields, setShipToMandatoryFields] = useState<any>({
    name1: 0,
    name2: 0,
    name3: 0,
    name4: 0,
    email: 0,
    phoneNumber: 0,
    mobileNumber: 0,
    fax: 0,
    houseNumber: 0,
    address1: 0,
    address2: 0,
    address3: 0,
    zipCode: 0,
    poBox: 0,
    city: 0,
    country: 0,
    coOrStreet3: 0,
    latitude: 0,
    longitude: 0,
    outlet: 0,
    salesArea: 0,
    distributionChannel: 0,
    customerHierarchy: 0,
    website: 0,
    shopNumber: 0,
    language: 0,
    previousCustomerShipTo: 0,
  });
  const [billToState, setBillToState] = useState<any>({
    name1: '',
    name2: '',
    name3: '',
    name4: '',
    email: '',
    phoneNumber: '',
    mobileNumber: '',
    fax: '',
    houseNumber: '',
    address1: '',
    address2: '',
    address3: '',
    zipCode: '',
    poBox: '',
    postalCodePOBox: '',
    cityPOBox: '',
    city: '',
    country: '',
  });
  const [billToErrorMessages, setBillToErrorMessages] = useState({
    name1: '',
    name2: '',
    name3: '',
    name4: '',
    email: '',
    phoneNumber: '',
    mobileNumber: '',
    fax: '',
    houseNumber: '',
    address1: '',
    address2: '',
    address3: '',
    zipCode: '',
    poBox: '',
    postalCodePOBox: '',
    cityPOBox: '',
    city: '',
    country: '',
  });
  const [billToMandatoryFields, setBillToMandatoryFields] = useState<any>({
    name1: 0,
    name2: 0,
    name3: 0,
    name4: 0,
    email: 0,
    phoneNumber: 0,
    mobileNumber: 0,
    fax: 0,
    houseNumber: 0,
    address1: 0,
    address2: 0,
    address3: 0,
    zipCode: 0,
    poBox: 0,
    postalCodePOBox: 0,
    cityPOBox: 0,
    city: 0,
    country: 0,
  });

  const [deliveryAddressState, setDeliveryAddressState] = useState<any>({
    name1: '',
    name2: '',
    name3: '',
    name4: '',
    email: '',
    phoneNumber: '',
    mobileNumber: '',
    fax: '',
    houseNumber: '',
    address1: '',
    address2: '',
    address3: '',
    zipCode: '',
    poBox: '',
    postalCodePOBox: '',
    cityPOBox: '',
    city: '',
    country: '',
  });
  const [deliveryAddressErrorMessages, setDeliveryAddressErrorMessages] =
    useState<any>({
      name1: '',
      name2: '',
      name3: '',
      name4: '',
      email: '',
      phoneNumber: '',
      mobileNumber: '',
      fax: '',
      houseNumber: '',
      address1: '',
      address2: '',
      address3: '',
      zipCode: '',
      poBox: '',
      postalCodePOBox: '',
      cityPOBox: '',
      city: '',
      country: '',
    });
  const [deliveryAddressMandatoryFields, setDeliveryAddressMandatoryFields] =
    useState<any>({
      name1: 0,
      name2: 0,
      name3: 0,
      name4: 0,
      email: 0,
      phoneNumber: 0,
      mobileNumber: 0,
      fax: 0,
      houseNumber: 0,
      address1: 0,
      address2: 0,
      address3: 0,
      zipCode: 0,
      poBox: 0,
      postalCodePOBox: 0,
      cityPOBox: 0,
      city: 0,
      country: 0,
    });
  const prefixToRemove = 'https://';
  const [isDiscardVisible, setIsDiscardVisible] = useState(false);
  // .....

  const prospectInfo = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );
  const statusType = prospectInfo.statusType ? prospectInfo.statusType : 'c';
  const isEditable = statusType.toLowerCase() === 'p';

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (shipToState.salesArea.length > 0 && shipToState.salesArea !== '-') {
      getCustomerHierarchyDropdownData();
    }
  }, [shipToState.salesArea]);

  const loadInitialData = async () => {
    setLoading(true);
    await getCountryDropdownData();
    await getSalesAreaDropdownData();
    await getOutletClassificationDropdownData();
    await getDistributionChannelDropdownData();
    await getLanguageDropdownData();
    await getShipToPrepopulatedData();
    await getBillToPrepopulatedData();
    await getDeliveryAddressPrepopulatedData();
    await getShipToMandantoryFields();
    await getBillToMandantoryFields();
    await getDeliveryAddressMandantoryFields();
    setLoading(false);
  };

  const getCountryDropdownData = async () => {
    try {
      const countryDropdownControlName = DROPDOWN_CONTROL_NAME.COUNTRY_SHIP_TO;
      const countryDropdownData =
        await PLBasicInfoController.getDropdownListValues(
          countryDropdownControlName,
        );
      console.log('countryDropdownData ', countryDropdownData);
      setCountryDropdownData(countryDropdownData);
    } catch (error) {
      setCountryDropdownData([]);
      console.log('Error while country dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getLanguageDropdownData = async () => {
    try {
      const countryDropdownData =
        await PLBasicInfoController.getLanguageDropdownData();
      console.log('countryDropdownData', countryDropdownData);
      setLanguageDropdownData(countryDropdownData);
    } catch (error) {
      setLanguageDropdownData([]);
      console.log('Error while language dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getDistributionChannelDropdownData = async () => {
    try {
      const dcDropdownControlName =
        DROPDOWN_CONTROL_NAME.SHIP_TO_DISTRIBUTION_CHANNEL;
      const distributionChannelData =
        await PLBasicInfoController.getDropdownListValues(
          dcDropdownControlName,
        );
      console.log('distributionChannelData ', distributionChannelData);
      setDistributionChannelDropdownData(distributionChannelData);
    } catch (error) {
      setDistributionChannelDropdownData([]);
      console.log('Error while country dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getSalesAreaDropdownData = async () => {
    try {
      const salesAreaDropdownData = await ProspectsController.getSalesArea();
      setSalesAreaDropdownData(salesAreaDropdownData);
    } catch (error) {
      setSalesAreaDropdownData([]);
      console.log('Error while sales area dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getCustomerHierarchyDropdownData = async (searchText: string = '') => {
    console.log('Sales Area called');
    const [salesOrganization, distributionChannel] =
      shipToState.salesArea.split('-');
    console.log('Sales Area: >>', salesOrganization, distributionChannel);
    try {
      const customerHierarchyDropdownData =
        await ProspectsController.getCustomerHierarchies(
          salesOrganization,
          distributionChannel,
          searchText,
        );
      console.log(
        'customerHierarchyDropdownData :>> ',
        customerHierarchyDropdownData,
      );
      setCustomerHierarchyDropdownData(customerHierarchyDropdownData);
    } catch (error) {
      setCustomerHierarchyDropdownData([]);
      console.log('Error while sales area dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getOutletClassificationDropdownData = async (
    searchText: string = '',
  ) => {
    try {
      const outletClassificationDropdownData =
        await CustomerSearchController.getOutletClassification(searchText);
      setOutletClassificationDropdownData(outletClassificationDropdownData);
    } catch (error) {
      setOutletClassificationDropdownData([]);
      console.log('Error while sales area dropdown data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const handlePDSelectedValue = (data: string) => {
    setPDSelectedValue(data);
  };

  const onCustomerHierarchyFocus = () => {
    if (shipToState.salesArea.length === 0 || shipToState.salesArea === '-') {
      toast.error({
        message: 'Please select sales area',
      });
      setShipToErrorMessages((prevData: any) => ({
        ...prevData,
        salesArea: 'Please select sales area',
      }));
    }
  };
  const containsObject = (res: any, value: any) => {
    for (const element of res) {
      if (element.industryCode === value || element.customerHierL6 === value) {
        return true;
      }
    }
    return false;
  };
  const getShipToPrepopulatedData = async () => {
    try {
      const response = await PLBasicInfoController.getShipToPrepopulatedData();
      console.log('getShipToPrepopulatedData :>> ', response);

      if (response.length > 0) {
        const prepopulatedData = response[0];

        // Adding data to outlet dropdown if not present
        if (prepopulatedData.outlet) {
          const isOutletClassificationPresent = containsObject(
            outletClassificationDropdownData,
            prepopulatedData.outlet,
          );

          if (!isOutletClassificationPresent) {
            setOutletClassificationDropdownData((prevData: any) => [
              ...prevData,
              {
                industryCode: prepopulatedData.outlet,
                descriptionLanguage: `${prepopulatedData.outlet} - ${prepopulatedData.description}`,
              },
            ]);
          }
        }

        // Adding data to customer hierarchy dropdown if not present
        if (prepopulatedData.customerHierarchy) {
          const isCustomerHierarchyPresent = containsObject(
            customerHierarchyDropdownData,
            prepopulatedData.customerHierarchy,
          );

          if (!isCustomerHierarchyPresent) {
            setCustomerHierarchyDropdownData((prevData: any) => [
              ...prevData,
              {
                l6HierarchyValue: prepopulatedData.customerHierarchy,
                l6HierarchyLabel: prepopulatedData.customerHierarchy,
              },
            ]);
          }
        }
        let website = prepopulatedData.website ? prepopulatedData.website : '';
        let trimmedWebsiteUrl = '';
        if (website.startsWith(prefixToRemove)) {
          // Use substring to remove the prefix
          trimmedWebsiteUrl = website.substring(prefixToRemove.length);
          console.log(trimmedWebsiteUrl); // Output: "ajsndksdks.com"
        }
        const prepareProspectData = {
          name1: prepopulatedData.name1 ? prepopulatedData.name1 : '',
          name2: prepopulatedData.name2 ? prepopulatedData.name2 : '',
          name3: prepopulatedData.name3 ? prepopulatedData.name3 : '',
          name4: prepopulatedData.name4 ? prepopulatedData.name4 : '',
          email: prepopulatedData.email ? prepopulatedData.email : '',
          phoneNumber: prepopulatedData.phoneNumber
            ? prepopulatedData.phoneNumber
            : '',
          mobileNumber: prepopulatedData.mobileNumber
            ? prepopulatedData.mobileNumber
            : '',
          fax: prepopulatedData.fax ? prepopulatedData.fax : '',
          houseNumber: prepopulatedData.houseNumber
            ? prepopulatedData.houseNumber
            : '',
          address1: prepopulatedData.address1 ? prepopulatedData.address1 : '',
          address2: prepopulatedData.address2 ? prepopulatedData.address2 : '',
          address3: prepopulatedData.address3 ? prepopulatedData.address3 : '',
          zipCode: prepopulatedData.zipCode ? prepopulatedData.zipCode : '',
          poBox: prepopulatedData.poBox ? prepopulatedData.poBox : '',
          city: prepopulatedData.city ? prepopulatedData.city : '',
          country: prepopulatedData.country ? prepopulatedData.country : '',
          coOrStreet3: prepopulatedData.coOrStreet3
            ? prepopulatedData.coOrStreet3
            : '',
          latitude: prepopulatedData.latitude ? prepopulatedData.latitude : '',
          longitude: prepopulatedData.longitude
            ? prepopulatedData.longitude
            : '',
          outlet: prepopulatedData.outlet ? prepopulatedData.outlet : '',
          salesArea: '',
          distributionChannel: prepopulatedData.distributionChannel
            ? prepopulatedData.distributionChannel
            : '',
          customerHierarchy: prepopulatedData.customerHierarchy
            ? prepopulatedData.customerHierarchy
            : '',
          website: trimmedWebsiteUrl,
          shopNumber: prepopulatedData.shopNumber
            ? prepopulatedData.shopNumber
            : '',
          language: prepopulatedData.language ? prepopulatedData.language : '',
          previousCustomerShipTo: prepopulatedData.previousCustomerShipTo
            ? prepopulatedData.previousCustomerShipTo
            : '',
        };
        setShipToState(prepareProspectData);
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      });
      console.log('Error while getting prepopulated data :>> ', error);
    }
  };
  const getBillToPrepopulatedData = async () => {
    try {
      const response = await PLBasicInfoController.getBillToPrepopulatedData();
      console.log('prepopulatedData :>> ', response);

      if (response.length > 0) {
        const prepopulatedData = response[0];
        const prepareProspectData = {
          name1: prepopulatedData.name1 ? prepopulatedData.name1 : '',
          name2: prepopulatedData.name2 ? prepopulatedData.name2 : '',
          name3: prepopulatedData.name3 ? prepopulatedData.name3 : '',
          name4: prepopulatedData.name4 ? prepopulatedData.name4 : '',
          email: prepopulatedData.email ? prepopulatedData.email : '',
          phoneNumber: prepopulatedData.phoneNumber
            ? prepopulatedData.phoneNumber
            : '',
          mobileNumber: prepopulatedData.mobileNumber
            ? prepopulatedData.mobileNumber
            : '',
          fax: prepopulatedData.fax ? prepopulatedData.fax : '',
          houseNumber: prepopulatedData.houseNumber
            ? prepopulatedData.houseNumber
            : '',
          address1: prepopulatedData.address1 ? prepopulatedData.address1 : '',
          address2: prepopulatedData.address2 ? prepopulatedData.address2 : '',
          address3: prepopulatedData.address3 ? prepopulatedData.address3 : '',
          zipCode: prepopulatedData.zipCode ? prepopulatedData.zipCode : '',
          poBox: prepopulatedData.poBox ? prepopulatedData.poBox : '',
          postalCodePOBox: prepopulatedData.postalCodePOBox
            ? prepopulatedData.postalCodePOBox
            : '',
          cityPOBox: prepopulatedData.cityPOBox
            ? prepopulatedData.cityPOBox
            : '',
          city: prepopulatedData.city ? prepopulatedData.city : '',
          country: prepopulatedData.country ? prepopulatedData.country : '',
        };
        setBillToState(prepareProspectData);
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      });
      console.log('Error while getting prepopulated data :>> ', error);
    }
  };

  const getDeliveryAddressPrepopulatedData = async () => {
    try {
      const response =
        await PLBasicInfoController.getDeliveryAddressPrepopulatedData();
      console.log('prepopulatedData :>> ', response);

      if (response.length > 0) {
        const prepopulatedData = response[0];
        const prepareProspectData = {
          name1: prepopulatedData.name1 ? prepopulatedData.name1 : '',
          name2: prepopulatedData.name2 ? prepopulatedData.name2 : '',
          name3: prepopulatedData.name3 ? prepopulatedData.name3 : '',
          name4: prepopulatedData.name4 ? prepopulatedData.name4 : '',
          email: prepopulatedData.email ? prepopulatedData.email : '',
          phoneNumber: prepopulatedData.phoneNumber
            ? prepopulatedData.phoneNumber
            : '',
          mobileNumber: prepopulatedData.mobileNumber
            ? prepopulatedData.mobileNumber
            : '',
          fax: prepopulatedData.fax ? prepopulatedData.fax : '',
          houseNumber: prepopulatedData.houseNumber
            ? prepopulatedData.houseNumber
            : '',
          address1: prepopulatedData.address1 ? prepopulatedData.address1 : '',
          address2: prepopulatedData.address2 ? prepopulatedData.address2 : '',
          address3: prepopulatedData.address3 ? prepopulatedData.address3 : '',
          zipCode: prepopulatedData.zipCode ? prepopulatedData.zipCode : '',
          poBox: prepopulatedData.poBox ? prepopulatedData.poBox : '',
          postalCodePOBox: prepopulatedData.postalCodePOBox
            ? prepopulatedData.postalCodePOBox
            : '',
          cityPOBox: prepopulatedData.cityPOBox
            ? prepopulatedData.cityPOBox
            : '',
          city: prepopulatedData.city ? prepopulatedData.city : '',
          country: prepopulatedData.country ? prepopulatedData.country : '',
        };
        setDeliveryAddressState(prepareProspectData);
      }
    } catch (error) {
      toast.error({
        message: 'Something went wrong',
      });
      console.log('Error while getting prepopulated data :>> ', error);
    }
  };

  const handleShipToInputChange = (fieldName: string) => (value: any) => {
    if (fieldName === 'country' || fieldName === 'distributionChannel') {
      setShipToState((prevData: any) => ({
        ...prevData,
        [fieldName]: value.discoveryListValuesId,
      }));
    } else if (fieldName === 'salesArea') {
      if (shipToState.salesArea !== value.salesAreaValue) {
        setShipToState((prevData: any) => ({
          ...prevData,
          customerHierarchy: '',
        }));
      }

      setShipToState((prevData: any) => ({
        ...prevData,
        [fieldName]: value.salesAreaValue,
      }));
    } else if (fieldName === 'customerHierarchy') {
      setShipToState((prevData: any) => ({
        ...prevData,
        [fieldName]: value.l6HierarchyValue,
      }));
    } else if (fieldName === 'outlet') {
      setShipToState((prevData: any) => ({
        ...prevData,
        [fieldName]: value.industryCode,
      }));
    } else if (fieldName === 'language') {
      setShipToState((prevData: any) => ({
        ...prevData,
        [fieldName]: value.languageKey,
      }));
    } else {
      setShipToState((prevData: any) => ({
        ...prevData,
        [fieldName]: value,
      }));
    }
    setShipToErrorMessages((prevData: any) => ({
      ...prevData,
      [fieldName]: '',
    }));
  };

  const handleBillToInputChange = (fieldName: string) => (value: any) => {
    if (fieldName === 'country') {
      setBillToState((prevData: any) => ({
        ...prevData,
        [fieldName]: value.discoveryListValuesId,
      }));
    } else {
      setBillToState((prevData: any) => ({
        ...prevData,
        [fieldName]: value,
      }));
    }
    setBillToErrorMessages((prevData: any) => ({
      ...prevData,
      [fieldName]: '',
    }));
  };

  const handleDeliveryAddressInputChange =
    (fieldName: string) => (value: any) => {
      if (fieldName === 'country') {
        setDeliveryAddressState((prevData: any) => ({
          ...prevData,
          [fieldName]: value.discoveryListValuesId,
        }));
      } else {
        setDeliveryAddressState((prevData: any) => ({
          ...prevData,
          [fieldName]: value,
        }));
      }
      setDeliveryAddressErrorMessages((prevData: any) => ({
        ...prevData,
        [fieldName]: '',
      }));
    };

  const handleSave = async () => {
    if (pdSelectedValue === CLIENT_DETAILS_TYPES.SHIP_TO) {
      try {
        // Check mandatory fields and update error messages accordingly
        const newErrorMessages: any = {};
        let hasError = false;

        Object.keys(shipToMandatoryFields).forEach(field => {
          if (shipToMandatoryFields[field] === 1 && !shipToState[field]) {
            newErrorMessages[field] = 'Mandatory';
            hasError = true;
          } else {
            newErrorMessages[field] = '';
          }
        });

        setShipToErrorMessages(newErrorMessages);

        if (
          shipToState.email.trim().length > 0 &&
          !validateEmail(shipToState.email.trim())
        ) {
          setShipToErrorMessages((prevData: any) => ({
            ...prevData,
            email: 'Invalid',
          }));
          hasError = true;
        }
        if (
          shipToState.previousCustomerShipTo.trim().length > 0 &&
          isNaN(Number(shipToState.previousCustomerShipTo))
        ) {
          setShipToErrorMessages((prevData: any) => ({
            ...prevData,
            previousCustomerShipTo: 'Invalid',
          }));
          hasError = true;
        }

        if (
          shipToState.phoneNumber.trim().length > 0 &&
          !mobileRegex.test(shipToState.phoneNumber)
        ) {
          setShipToErrorMessages((prevData: any) => ({
            ...prevData,
            phoneNumber: 'Invalid',
          }));
          hasError = true;
        }
        if (
          shipToState.mobileNumber.trim().length > 0 &&
          !mobileRegex.test(shipToState.mobileNumber)
        ) {
          setShipToErrorMessages((prevData: any) => ({
            ...prevData,
            mobileNumber: 'Invalid',
          }));
          hasError = true;
        }

        if (hasError) {
          toast.error({
            message: 'Enter All Mandatory Details',
          });
          return;
        }

        if (
          shipToState.latitude.trim().length > 0 &&
          !allowOnlyOneDot(shipToState.latitude.trim())
        ) {
          setShipToErrorMessages((prevData: any) => ({
            ...prevData,
            latitude: 'Invalid',
          }));
          toast.error({
            message: 'Enter Valid Latitude',
          });
          return;
        }
        if (
          shipToState.longitude.trim().length > 0 &&
          !allowOnlyOneDot(shipToState.longitude.trim())
        ) {
          setShipToErrorMessages((prevData: any) => ({
            ...prevData,
            longitude: 'Invalid',
          }));
          toast.error({
            message: 'Enter Valid Longitude',
          });
          return;
        }
        const response = await PLBasicInfoController.updateProspectShipToInfo(
          shipToState,
        );
        if (response) {
          dispatch(setProspectInfo({
            prospectInfo: {
              ...prospectInfo,
              name1: shipToState.name1,
              customerName: shipToState.name1,
            }
          }))

          toast.success({
            message: 'Changes Saved Successfully',
          });
          getShipToPrepopulatedData();
          await ACLService.saveAclGuardStatusToStorage(false);
        } else {
          toast.error({
            message: 'Failed to save the change',
          });
        }
      } catch (error) {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('Error while getting prepopulated data :>> ', error);
      }
    } else if (pdSelectedValue === CLIENT_DETAILS_TYPES.BILL_TO) {
      try {
        // Check mandatory fields and update error messages accordingly
        const newErrorMessages: any = {};
        let hasError = false;

        Object.keys(billToMandatoryFields).forEach(field => {
          if (billToMandatoryFields[field] === 1 && !billToState[field]) {
            newErrorMessages[field] = 'Mandatory';
            hasError = true;
          } else {
            newErrorMessages[field] = '';
          }
        });

        setBillToErrorMessages(newErrorMessages);

        if (
          billToState.email.trim().length > 0 &&
          !validateEmail(billToState.email.trim())
        ) {
          setBillToErrorMessages((prevData: any) => ({
            ...prevData,
            email: 'Enter valid email id',
          }));
          hasError = true;
        }

        if (
          billToState.zipCode.trim().length > 0 &&
          isNaN(Number(billToState.zipCode))
        ) {
          setBillToErrorMessages((prevData: any) => ({
            ...prevData,
            zipCode: 'Enter valid number',
          }));
          hasError = true;
        }

        if (
          billToState.phoneNumber.trim().length > 0 &&
          !mobileRegex.test(billToState.phoneNumber)
        ) {
          setBillToErrorMessages((prevData: any) => ({
            ...prevData,
            phoneNumber: 'Invalid',
          }));
          hasError = true;
        }
        if (
          billToState.mobileNumber.trim().length > 0 &&
          !mobileRegex.test(billToState.mobileNumber)
        ) {
          setBillToErrorMessages((prevData: any) => ({
            ...prevData,
            mobileNumber: 'Invalid',
          }));
          hasError = true;
        }

        if (hasError) {
          toast.error({
            message: 'Enter All Mandatory Details',
          });
          return;
        }
        console.log('billToState :>> ', billToState);
        const response =
          await PLBasicInfoController.updateProspectBillToDiscoveryInfo(
            billToState,
          );
        if (response) {
          toast.success({
            message: 'Changes Saved Successfully',
          });
          getBillToPrepopulatedData();
          await ACLService.saveAclGuardStatusToStorage(false);
        } else {
          toast.error({
            message: 'Failed to save the change',
          });
        }
      } catch (error) {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('Error while getting prepopulated data :>> ', error);
      }
    } else {
      try {
        const newErrorMessages: any = {};
        let hasError = false;

        Object.keys(deliveryAddressMandatoryFields).forEach(field => {
          if (
            deliveryAddressMandatoryFields[field] === 1 &&
            !deliveryAddressState[field]
          ) {
            newErrorMessages[field] = 'Mandatory';
            hasError = true;
          } else {
            newErrorMessages[field] = '';
          }
        });

        setDeliveryAddressErrorMessages(newErrorMessages);

        if (
          deliveryAddressState.email.trim().length > 0 &&
          !validateEmail(deliveryAddressState.email.trim())
        ) {
          setDeliveryAddressErrorMessages((prevData: any) => ({
            ...prevData,
            email: 'Enter valid email id',
          }));
          hasError = true;
        }

        if (
          deliveryAddressState.zipCode.trim().length > 0 &&
          isNaN(Number(deliveryAddressState.zipCode))
        ) {
          setDeliveryAddressErrorMessages((prevData: any) => ({
            ...prevData,
            zipCode: 'Enter valid number',
          }));
          hasError = true;
        }

        if (
          deliveryAddressState.phoneNumber.trim().length > 0 &&
          !mobileRegex.test(deliveryAddressState.phoneNumber)
        ) {
          setDeliveryAddressErrorMessages((prevData: any) => ({
            ...prevData,
            phoneNumber: 'Invalid',
          }));
          hasError = true;
        }
        if (
          deliveryAddressState.mobileNumber.trim().length > 0 &&
          !mobileRegex.test(deliveryAddressState.mobileNumber)
        ) {
          setDeliveryAddressErrorMessages((prevData: any) => ({
            ...prevData,
            mobileNumber: 'Invalid',
          }));
          hasError = true;
        }


        if (hasError) {
          toast.error({
            message: 'Enter All Mandatory Details',
          });
          return;
        }
        const response =
          await PLBasicInfoController.updateProspectDeliveryAddressInfo(
            deliveryAddressState,
          );
        if (response) {
          toast.success({
            message: 'Changes Saved Successfully',
          });
          getDeliveryAddressPrepopulatedData();
          await ACLService.saveAclGuardStatusToStorage(false);
        } else {
          toast.error({
            message: 'Failed to save the change',
          });
        }
      } catch (error) {
        toast.error({
          message: 'Something went wrong',
        });
        console.log('Error while getting prepopulated data :>> ', error);
      }
    }
  };

  const getShipToMandantoryFields = async () => {
    try {
      const mandatoryFieldsConfig =
        await PLBasicInfoController.getShipToMandatoryFieldsConfig();
      console.log('mandatoryFieldsConfig :>> ', mandatoryFieldsConfig);
      setShipToMandatoryFields(mandatoryFieldsConfig);
    } catch (error) {
      console.log('Error while mandatoryFieldsConfig :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getBillToMandantoryFields = async () => {
    try {
      const mandatoryFieldsConfig =
        await PLBasicInfoController.getBillToMandatoryFieldsConfig();
      console.log('mandatoryFieldsConfig :>> ', mandatoryFieldsConfig);
      setBillToMandatoryFields(mandatoryFieldsConfig);
    } catch (error) {
      console.log('Error while mandatoryFieldsConfig :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  const getDeliveryAddressMandantoryFields = async () => {
    try {
      const mandatoryFieldsConfig =
        await PLBasicInfoController.getDeliveryAddressMandatoryFieldsConfig();
      console.log('mandatoryFieldsConfig :>> ', mandatoryFieldsConfig);
      setDeliveryAddressMandatoryFields(mandatoryFieldsConfig);
    } catch (error) {
      console.log('Error while mandatoryFieldsConfig :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
    }
  };

  // Discard changes ....
  const handleCancel = async () => {
    const isFormDirty = await ACLService.isFormDirty();
    if (isFormDirty) {
      setIsDiscardVisible(true);
    } else {
      toast.info({
        message: 'No changes to discard',
      });
    }
  };

  const handleDiscardCancel = () => {
    setIsDiscardVisible(false);
  };
  const handleDiscardChanges = async () => {
    if (pdSelectedValue == CLIENT_DETAILS_TYPES.SHIP_TO) {
      getShipToPrepopulatedData();
    }

    if (pdSelectedValue == CLIENT_DETAILS_TYPES.BILL_TO) {
      getBillToPrepopulatedData();
    }

    if (pdSelectedValue == CLIENT_DETAILS_TYPES.ALTERNATE_DELIVERY_ADDRESS) {
      getDeliveryAddressPrepopulatedData();
    }
    await ACLService.saveAclGuardStatusToStorage(false);
    setIsDiscardVisible(false);
  };
  // ..

  return (
    <SafeAreaView style={tw('flex-1')}>
      <View flex>
        <ProspectLandingHeader
          message={''}
          fromPLP={true}
        />
        <View row flex>
          <PLLeftMenuComponent
            activeTab={PROSPECT_LANDING_SCREENS.BASIC_INFO}
          />
          {loading ? (
            <CustomerLandingLoader />
          ) : (
            <View flex>
              <Card flex-1 marginR-v2 marginB-v2 padding-v4>
                <View>
                  <View row marginR-v3>
                    <View flex-7 centerV>
                      <BasicInfoTopTabComponent
                        handleChangeTab={handlePDSelectedValue}
                        parterDetailsSelectedValue={pdSelectedValue}
                      />
                    </View>
                    <View flex-1 center marginH-v3>
                      {isEditable ? (
                        <View row centerV>
                          <TouchableOpacity
                            style={tw(' m-6')}
                            onPress={handleCancel}>
                            <Text grey2 text13R>
                              {'Cancel'}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={tw(
                              'bg-light-darkBlue rounded-md py-2 px-8 flex-row items-center ml-6',
                            )}
                            onPress={handleSave}>
                            <Text white text13R>
                              {'Save'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <Text text18M textBlack marginV-v2>
                    Client Details
                  </Text>
                </View>

                <View flex>
                  {pdSelectedValue === CLIENT_DETAILS_TYPES.SHIP_TO && (
                    <ScrollView
                      contentContainerStyle={{ flexGrow: 1 }}
                      keyboardShouldPersistTaps="always"
                      showsVerticalScrollIndicator={false}>
                      <View flex-1>
                        <BasicInfoContentComponent
                          isEditable={isEditable}
                          item={shipToState}
                          handleInputChange={handleShipToInputChange}
                          errorMessages={shipToErrorMessages}
                          mandatoryData={shipToMandatoryFields}
                        />
                        <BasicInfoAddressComponent
                          isEditable={isEditable}
                          countryDropdownData={countryDropdownData}
                          item={shipToState}
                          handleInputChange={handleShipToInputChange}
                          errorMessages={shipToErrorMessages}
                          mandatoryData={shipToMandatoryFields}
                          statusType={statusType}
                        />
                        <BasicInfoOutletInfoComponent
                          item={shipToState}
                          isEditable={isEditable}
                          outletClassificationDropdownData={
                            outletClassificationDropdownData
                          }
                          getOutletClassificationDropdownData={
                            getOutletClassificationDropdownData
                          }
                          salesAreaDropdownData={salesAreaDropdownData}
                          customerHierarchyDropdownData={
                            customerHierarchyDropdownData
                          }
                          distributionChannelDropdownData={
                            distributionChannelDropdownData
                          }
                          getCustomerHierarchyDropdownData={
                            getCustomerHierarchyDropdownData
                          }
                          handleInputChange={handleShipToInputChange}
                          onCustomerHierarchyFocus={onCustomerHierarchyFocus}
                          errorMessages={shipToErrorMessages}
                          mandatoryData={shipToMandatoryFields}
                        />
                        <BasicInfoMoreInfoComponent
                          isEditable={isEditable}
                          item={shipToState}
                          handleInputChange={handleShipToInputChange}
                          languageDropdownData={languageDropdownData}
                          errorMessages={shipToErrorMessages}
                          mandatoryData={shipToMandatoryFields}
                        />
                      </View>
                    </ScrollView>
                  )}
                  {pdSelectedValue === CLIENT_DETAILS_TYPES.BILL_TO && (
                    <ScrollView
                      contentContainerStyle={{ flexGrow: 1 }}
                      keyboardShouldPersistTaps="always"
                      showsVerticalScrollIndicator={false}>
                      <View flex>
                        <View marginT-v2>
                          <BasicInfoContentComponent
                            isEditable={isEditable}
                            item={billToState}
                            handleInputChange={handleBillToInputChange}
                            errorMessages={billToErrorMessages}
                            mandatoryData={billToMandatoryFields}
                          />
                        </View>
                        <BasicInfoBillToAddressComponent
                          isEditable={isEditable}
                          countryDropdownData={countryDropdownData}
                          item={billToState}
                          handleInputChange={handleBillToInputChange}
                          errorMessages={billToErrorMessages}
                          mandatoryData={billToMandatoryFields}
                        />
                      </View>
                    </ScrollView>
                  )}
                  {pdSelectedValue ===
                    CLIENT_DETAILS_TYPES.ALTERNATE_DELIVERY_ADDRESS && (
                      <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="always"
                        showsVerticalScrollIndicator={false}>
                        <View flex marginT-v2>
                          <BasicInfoContentComponent
                            isEditable={isEditable}
                            item={deliveryAddressState}
                            handleInputChange={handleDeliveryAddressInputChange}
                            errorMessages={deliveryAddressErrorMessages}
                            mandatoryData={deliveryAddressMandatoryFields}
                          />
                          <BasicInfoBillToAddressComponent
                            isEditable={isEditable}
                            countryDropdownData={countryDropdownData}
                            item={deliveryAddressState}
                            handleInputChange={handleDeliveryAddressInputChange}
                            errorMessages={deliveryAddressErrorMessages}
                            mandatoryData={deliveryAddressMandatoryFields}
                          />
                        </View>
                      </ScrollView>
                    )}
                </View>
              </Card>
            </View>
          )}
        </View>
      </View>
      {isDiscardVisible ? (
        <MessageModal
          isVisible={isDiscardVisible}
          title="Discard the Changes?"
          subTitle="Your unsaved edits will be lost"
          primaryButtonText="Yes, Discard"
          secondaryButtonText="No, Keep the changes"
          handleOnPressSuccess={handleDiscardChanges}
          handleOnPressCancel={handleDiscardCancel}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default withAuthScreen(PLBasicInfo, true);
