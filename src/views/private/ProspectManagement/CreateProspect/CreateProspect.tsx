import React, { useState, FC, useEffect } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import View from 'src/components/View';
import { tw } from 'src/tw';
import Card from 'src/components/Card';
import { images } from 'src/assets/Images';

import CreateProspectsHeader from 'src/components/Header/CreateProspectsHeader';
import ClientDetailHeaderComponent from 'src/components/Prospects/CreatePropspect/ClientDetailHeaderComponent';
import EditProspectsHeader from 'src/components/Header/EditProspectsHeader';
import DeleteModal from 'src/components/Common/DeleteModal';
import MessageModal from 'src/components/Common/MessageModal';
import ProspectInfoComponent from 'src/components/Prospects/CreatePropspect/ProspectInfoComponent';
import ProspectsController from 'src/controller/ProspectsController';
import CustomerSearchController from 'src/controller/CustomerSearchController';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import ApiUtil from 'src/services/ApiUtil';
import { withAuthScreen } from 'src/hoc/withAuthScreen';
import ACLService from 'src/services/ACLService';
import { toast } from 'src/utils/Util';
import { validateEmail } from 'src/utils/CommonUtil';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import PLOverviewController from 'src/controller/PLOverviewController';
import { useTranslation } from 'react-i18next';

const CreateProspect: FC = ({ route, navigation }: any) => {
  const screenType = route.params.screenType;
  const changeBgColor =
    screenType === 'Create' ? 'bg-light-lightGrey' : 'bg-light-white';

  // Hook - i18n translation
  const { t } = useTranslation();

  // set false to see crate prospect screen
  const [isEditable, setIsEditable] = useState(screenType === 'Create');

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [isProspectDeletable, setIsProspectDeletable] = useState(false);
  const [loading, setLoading] = useState(false);

  const [prospectInputsData, setProspectInputsData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    streetNumber: '',
    zipCode: '',
    city: '',
    country: '',
    salesArea: '',
    prospectNumber: '',
    customerHierarchy: '',
    outletClassification: '',
    employeeName: '',
    iceCreamBulk: '',
    iceCreamImpulse: '',
    frozenFood: '',
    total: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    streetNumber: '',
    zipCode: '',
    city: '',
    country: '',
    salesArea: '',
    prospectNumber: '',
    customerHierarchy: '',
    outletClassification: '',
    employeeName: '',
    iceCreamBulk: '',
    iceCreamImpulse: '',
    frozenFood: '',
    total: '',
  });

  const [mandatoryData, setMandatoryData] = useState({
    previousShipToNo: 0,
    name: 1,
    address: 0,
    phoneNumber: 1,
    streetNo: 0,
    zipCode: 0,
    city: 0,
    country: 0,
    customerHierarchy: 0,
    outlet: 0,
    iceCreamBulk: 0,
    iceCreamImpluse: 0,
    frozenFood: 0,
  });

  const [countryDropdownData, setCountryDropdownData] = useState([]);
  const [salesAreaDropdownData, setSalesAreaDropdownData] = useState([]);
  const [customerHierarchyDropdownData, setCustomerHierarchyDropdownData] =
    useState<any>([]);
  const [
    outletClassificationDropdownData,
    setOutletClassificationDropdownData,
  ] = useState<any>([]);
  const [employeeDropdownData, setEmployeeDropdownData] = useState<any>([]);

  const [discoveryId, setDiscoveryId] = useState('');
  const [prospectName, setProspectName] = useState(
    route.params.item && route.params.item?.name1
      ? route.params.item?.name1
      : '',
  );
  const [warningMessage, setWarningMessage] = useState('');
  const [previousCustomerShipTo, setPreviousCustomerShipTo] = useState('');
  const [tempPreviousCustomerShipTo, setTempPreviousCustomerShipTo] =
    useState('');
  const [errorPreviousCustomerShipTo, setErrorPreviousCustomerShipTo] =
    useState('');

  const employeeInfo = useAppSelector(
    (state: RootState) => state.userContext.employee,
  );

  useEffect(() => {
    getScreenData();
  }, []);

  useEffect(() => {
    if (
      prospectInputsData.salesArea.length > 0 &&
      prospectInputsData.salesArea !== '-'
    ) {
      getCustomerHierarchyDropdownData();
    }
  }, [prospectInputsData.salesArea]);

  useEffect(() => {
    setProspectInputsData({
      ...prospectInputsData,
      total: (
        Number(prospectInputsData.iceCreamBulk) +
        Number(prospectInputsData.iceCreamImpulse) +
        Number(prospectInputsData.frozenFood)
      ).toString(),
    });
  }, [
    prospectInputsData.iceCreamBulk,
    prospectInputsData.iceCreamImpulse,
    prospectInputsData.frozenFood,
  ]);

  const getScreenData = async () => {
    setLoading(true);
    await getCountryDropdownData();
    await getSalesAreaDropdownData();
    await getOutletClassificationDropdownData();
    await getEmployeeDropdownData();

    if (screenType === 'Edit') {
      const discoveryId =
        route.params.item && route.params.item.discoveryId
          ? route.params.item.discoveryId
          : '';

      setDiscoveryId(discoveryId);

      await getProspectData(discoveryId);
      await getDeletableStatus();
    }
    await getMandatoryFieldsConfig();

    setLoading(false);
  };

  const getMandatoryFieldsConfig = async () => {
    try {
      const mandatoryFieldsConfig =
        await ProspectsController.getMandatoryFieldsConfig();
      console.log('mandatoryFieldsConfig :>> ', mandatoryFieldsConfig);
      setMandatoryData(mandatoryFieldsConfig);
    } catch (error) {
      console.log('Error while mandatoryFieldsConfig :>> ', error);
      toast.error({
        message: 'msg.createprospect.something_went_wrong',
      });
    }
  };

  const getCountryDropdownData = async () => {
    try {
      const countryDropdownData = await ProspectsController.getCountries();
      setCountryDropdownData(countryDropdownData);
    } catch (error) {
      setCountryDropdownData([]);
      console.log('Error while country dropdown data :>> ', error);
      toast.error({
        message: 'msg.createprospect.something_went_wrong',
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
        message: 'msg.createprospect.something_went_wrong',
      });
    }
  };

  const getCustomerHierarchyDropdownData = async (searchText: string = '') => {
    const [salesOrganization, distributionChannel] =
      prospectInputsData.salesArea.split('-');

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
        message: 'msg.createprospect.something_went_wrong',
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
        message: 'msg.createprospect.something_went_wrong',
      });
    }
  };

  const getEmployeeDropdownData = async (searchText: string = '') => {
    try {
      const employeeDropdownData = await ProspectsController.getFSRData(
        searchText,
      );
      if (employeeInfo.length > 0) {
        employeeDropdownData.push({
          employeeNumber: employeeInfo[0].employeeNumber,
          employeeDetails:
            employeeInfo[0].lastName +
            '-' +
            employeeInfo[0].firstName +
            '-' +
            employeeInfo[0].employeeNumber,
        });
        if (screenType === 'Create' && prospectInputsData.employeeName === '') {
          setProspectInputsData((prevData: any) => ({
            ...prevData,
            employeeName: employeeInfo[0].employeeNumber,
          }));
        }
      }
      console.log('employeeDropdownData :>> ', employeeDropdownData);
      setEmployeeDropdownData(employeeDropdownData);
    } catch (error) {
      setEmployeeDropdownData([]);
      console.log('Error while sales area dropdown data :>> ', error);
      toast.error({
        message: 'msg.createprospect.something_went_wrong',
      });
    }
  };

  const prePopulateProspectInputsData = async (prospectObj: any) => {
    // Adding data to outlet dropdown if not present
    if (prospectObj.professionalCode) {
      const isOutletClassificationPresent = containsObject(
        outletClassificationDropdownData,
        prospectObj.professionalCode,
      );

      if (!isOutletClassificationPresent) {
        setOutletClassificationDropdownData((prevData: any) => [
          ...prevData,
          {
            industryCode: prospectObj.professionalCode,
            descriptionLanguage: `${prospectObj.professionalCode} - ${prospectObj.description}`,
          },
        ]);
      }
    }

    // Adding data to customer hierarchy dropdown if not present
    if (prospectObj.affiliationHierarchyNode) {
      const isCustomerHierarchyPresent = containsObject(
        customerHierarchyDropdownData,
        prospectObj.affiliationHierarchyNode,
      );

      if (!isCustomerHierarchyPresent) {
        setCustomerHierarchyDropdownData((prevData: any) => [
          ...prevData,
          {
            l6HierarchyValue: prospectObj.affiliationHierarchyNode,
            l6HierarchyLabel: prospectObj.affiliationHierarchyNode,
          },
        ]);
      }
    }

    // Adding data to employee name dropdown if not present
    if (prospectObj.employeeNumber) {
      const isEmployeeDataPresent = containsObject(
        employeeDropdownData,
        prospectObj.employeeNumber,
      );
      console.log('isEmployeeDataPresent :>> ', isEmployeeDataPresent);

      if (!isEmployeeDataPresent) {
        // Fetching employee data because we need to show employee name in dropdown
        const employeeData = await ProspectsController.getFSRData(
          prospectObj.employeeNumber,
        );

        setEmployeeDropdownData((prevData: any) => [
          ...prevData,
          employeeData[0],
        ]);
      }
    }

    let country: any = {};

    setCountryDropdownData((prevData: any) => {
      if (prevData.length > 0) {
        country = prevData.find(
          (item: any) => item.discoveryListValuesId === prospectObj.country,
        );
      }
      return prevData;
    });

    const prepareProspectData = {
      name: prospectObj?.establishment ? prospectObj.establishment : '',
      address: prospectObj?.address ? prospectObj.address : '',
      phoneNumber: prospectObj?.telephone ? prospectObj.telephone : '',
      email: prospectObj?.mailAddress ? prospectObj.mailAddress : '',
      streetNumber: prospectObj?.street ? prospectObj.street : '',
      zipCode: prospectObj?.zipCode ? prospectObj.zipCode : '',
      city: prospectObj?.city ? prospectObj.city : '',
      country: country?.discoveryListValuesId
        ? country.discoveryListValuesId
        : '',
      salesArea: prospectObj?.salesAreaValue ? prospectObj.salesAreaValue : '',
      prospectNumber: prospectObj?.prospectNumber
        ? prospectObj.prospectNumber
        : '',
      customerHierarchy: prospectObj?.affiliationHierarchyNode
        ? prospectObj.affiliationHierarchyNode
        : '',
      outletClassification: prospectObj?.professionalCode
        ? prospectObj.professionalCode
        : '',
      employeeName: prospectObj?.employeeNumber
        ? prospectObj.employeeNumber
        : prospectInputsData.employeeName,
      iceCreamBulk: prospectObj?.expectedTurnover1
        ? prospectObj.expectedTurnover1.toString()
        : '',
      iceCreamImpulse: prospectObj?.expectedTurnover2
        ? prospectObj.expectedTurnover2.toString()
        : '',
      frozenFood: prospectObj?.expectedTurnover3
        ? prospectObj.expectedTurnover3.toString()
        : '',
      total: prospectObj?.totalPotential ? prospectObj.totalPotential : '',
    };

    setProspectInputsData(prepareProspectData);
  };

  const getProspectData = async (discoveryId: string) => {
    try {
      const prospectData = await ProspectsController.getProspectById(
        discoveryId,
      );
      console.log('prospect Data :>> ', prospectData);

      if (prospectData.length > 0) {
        const prospectObj = prospectData[0];

        console.log('prospectObj :>> ', prospectObj);
        setPreviousCustomerShipTo(prospectObj?.previousCustomerShipTo || '');
        prePopulateProspectInputsData(prospectObj);
      }
    } catch (error) {
      setProspectInputsData({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        streetNumber: '',
        zipCode: '',
        city: '',
        country: '',
        salesArea: '',
        prospectNumber: '',
        customerHierarchy: '',
        outletClassification: '',
        employeeName: '',
        iceCreamBulk: '',
        iceCreamImpulse: '',
        frozenFood: '',
        total: '',
      });
      console.log('Error while fetching prospect data :>> ', error);
      toast.error({
        message: 'msg.createprospect.something_went_wrong',
      });
    }
  };

  const getDeletableStatus = async () => {
    try {
      const isProspectDeletable = await ProspectsController.getDeleteAccess();

      setIsProspectDeletable(isProspectDeletable);
    } catch (error) {
      setIsProspectDeletable(false);
      console.log('Error while deletable status :>> ', error);
      toast.error({
        message: 'msg.createprospect.something_went_wrong',
      });
    }
  };

  const handleInterest = async (isInterested: boolean) => {
    try {
      const isUpdated = await ProspectsController.updateNotInterested(
        discoveryId,
        isInterested,
      );

      if (!isUpdated) {
        toast.error({
          message: 'msg.createprospect.something_went_wrong',
        });
      } else {
        toast.success({
          message: 'msg.createprospect.updated_successfully',
        });
      }
    } catch (error) {
      console.log('Error while fetching updating interest :>> ', error);
      toast.error({
        message: 'msg.createprospect.something_went_wrong',
      });
    }
  };

  const validateAndGetInfo = (prevCustomerShipTo: string) => {
    if (previousCustomerShipTo !== '') {
      setTempPreviousCustomerShipTo(prevCustomerShipTo);
      setConfirmationModalVisible(true);
    } else {
      handleGetInfo(prevCustomerShipTo);
    }
  };

  const handleGetInfo = async (prevCustomerShipTo: string) => {
    setLoading(true);
    Keyboard.dismiss();
    setProspectInputsData({
      name: '',
      address: '',
      phoneNumber: '',
      email: '',
      streetNumber: '',
      zipCode: '',
      city: '',
      country: '',
      salesArea: '',
      prospectNumber: '',
      customerHierarchy: '',
      outletClassification: '',
      employeeName: '',
      iceCreamBulk: '',
      iceCreamImpulse: '',
      frozenFood: '',
      total: '',
    });
    setErrorMessages({
      name: '',
      address: '',
      phoneNumber: '',
      email: '',
      streetNumber: '',
      zipCode: '',
      city: '',
      country: '',
      salesArea: '',
      prospectNumber: '',
      customerHierarchy: '',
      outletClassification: '',
      employeeName: '',
      iceCreamBulk: '',
      iceCreamImpulse: '',
      frozenFood: '',
      total: '',
    });
    try {
      let previousNo = '';
      if (prevCustomerShipTo !== '') {
        previousNo = prevCustomerShipTo.padStart(10, '0');
      }

      console.log('previousNo', previousNo);
      let customerData = await ProspectsController.getExistingCustomerData(
        previousNo,
      );
      console.log('customerData :>> ', customerData);

      if (customerData.length === 0) {
        const isOnline = await ApiUtil.getAppDeviceOnlineStatus();

        if (isOnline) {
          if (
            prospectInputsData.salesArea === '' ||
            prospectInputsData.salesArea === '-'
          ) {
            toast.error({
              message: 'msg.createprospect.sales_area_fetch_from_host',
            });

            setErrorMessages((prevData: any) => ({
              ...prevData,
              salesArea: 'msg.createprospect.select_sales_area',
            }));

            return;
          }

          const [salesOrganization, distributionChannel] =
            prospectInputsData.salesArea.split('-');
          const customerDataFromHost =
            await ProspectsController.getExistingCustomerDataOnline(
              prevCustomerShipTo,
              salesOrganization,
              distributionChannel,
            );

          console.log('customerDataFromHost :>> ', customerDataFromHost);

          const prospectDetailsData = customerDataFromHost
            ? customerDataFromHost?.prospectDetailsData
            : null;

          if (!prospectDetailsData) {
            toast.error({
              message: 'msg.createprospect.customer_not_present',
            });
            return;
          }

          const prepareCustomerData = {
            street: prospectDetailsData?.houseNumber
              ? prospectDetailsData.houseNumber
              : '',
            country: prospectDetailsData?.country
              ? prospectDetailsData.country
              : '',
            activeInTess: prospectDetailsData?.activeInTESS
              ? prospectDetailsData.activeInTESS
              : '',
            affiliationHierarchyNode:
              prospectDetailsData?.affiliationHierarchyNode
                ? prospectDetailsData.affiliationHierarchyNode
                : '',
            customerHierL6: prospectDetailsData?.customerHierL6
              ? prospectDetailsData.customerHierL6
              : '',
            zipCode: prospectDetailsData?.postalCode
              ? prospectDetailsData.postalCode
              : '',
            city: prospectDetailsData?.city ? prospectDetailsData.city : '',
            description: prospectDetailsData?.professionalCodeDescription
              ? prospectDetailsData.professionalCodeDescription
              : '',
            address: prospectDetailsData?.address1
              ? prospectDetailsData.address1
              : '',
            professionalCode: prospectDetailsData?.professionalCode
              ? prospectDetailsData.professionalCode
              : '',
          };

          customerData = [prepareCustomerData];
        } else {
          toast.error({
            message:
              'msg.createprospect.go_online',
          });
          return;
        }
      }

      const customerObj = customerData[0];
      console.log('customerObj :>> ', customerObj);

      if (customerObj.activeInTess === '0') {
        toast.error({
          message: 'msg.createprospect.customer_inactive_in_tess',
        });
        return;
      }

      await prePopulateProspectInputsData(customerObj);
      setPreviousCustomerShipTo(prevCustomerShipTo);
    } catch (error) {
      setProspectInputsData({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        streetNumber: '',
        zipCode: '',
        city: '',
        country: '',
        salesArea: '',
        prospectNumber: '',
        customerHierarchy: '',
        outletClassification: '',
        employeeName: '',
        iceCreamBulk: '',
        iceCreamImpulse: '',
        frozenFood: '',
        total: '',
      });
      setPreviousCustomerShipTo('');
      console.log('Error while fetching customer data :>> ', error);
      toast.error({
        message: 'msg.createprospect.something_went_wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const containsObject = (res: any, value: any) => {
    for (const element of res) {
      if (
        element.industryCode === value ||
        element.customerHierL6 === value ||
        element.employeeNumber === value
      ) {
        return true;
      }
    }
    return false;
  };

  const handleEditSaveToggle = async () => {
    try {
      if (isEditable) {
        if (!validateInputs()) {
          return;
        }

        if (
          previousCustomerShipTo.length > 0 &&
          (prospectInputsData.salesArea === '' ||
            prospectInputsData.salesArea === '-')
        ) {
          toast.error({
            message: 'msg.createprospect.select_sales_area',
          });
          return;
        }
        let previousNo = '';
        if (previousCustomerShipTo !== '') {
          previousNo = previousCustomerShipTo.padStart(10, '0');
        }

        console.log('previousNo', previousNo);
        const isProspectUpdated =
          await ProspectsController.createOrUpdateProspect(
            screenType === 'Edit',
            previousNo,
            discoveryId,
            prospectInputsData,
          );

        console.log('isProspectUpdated :>> ', isProspectUpdated);

        if (typeof isProspectUpdated === 'object') {
          toast.error({
            message: isProspectUpdated.message,
          });
          return;
        }

        if (!isProspectUpdated) {
          toast.error({
            message: 'msg.createprospect.something_went_wrong',
          });
          return;
        } else {
          setProspectName(prospectInputsData.name);
          setErrorMessages({
            name: '',
            address: '',
            phoneNumber: '',
            email: '',
            streetNumber: '',
            zipCode: '',
            city: '',
            country: '',
            salesArea: '',
            prospectNumber: '',
            customerHierarchy: '',
            outletClassification: '',
            employeeName: '',
            iceCreamBulk: '',
            iceCreamImpulse: '',
            frozenFood: '',
            total: '',
          });
          toast.success({
            message: 'msg.createprospect.updated_successfully',
          });
          await ACLService.saveAclGuardStatusToStorage(false);
          navigation.goBack();
        }
      }

      setIsEditable(!isEditable);
    } catch (error) {
      toast.error({
        message: 'msg.createprospect.something_went_wrong',
      });
      console.log('Error while editing the prospect :>> ', error);
    }
  };

  const handleOnDeletePress = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteProspect = async () => {
    try {
      const data = await ProspectsController.deleteProspect(discoveryId);

      if (!data.isDeleted) {
        setIsDeleteModalVisible(false);
        setMessageModalVisible(true);
        setWarningMessage(data.message);
      } else {
        setIsDeleteModalVisible(false);
        await ACLService.saveAclGuardStatusToStorage(false);

        navigation.goBack();

        toast.success({
          message: 'msg.createprospect.prospect_deleted',
        });
      }
    } catch (error) {
      console.log('Error while deleting prospect :>> ', error);
      setIsDeleteModalVisible(false);
      setMessageModalVisible(true);
      setWarningMessage('msg.createprospect.something_went_wrong');
    }
  };

  const handleOnPressCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleOnPressOk = () => {
    setMessageModalVisible(false);
  };

  const handleConfirmationSuccess = () => {
    setConfirmationModalVisible(false);
    handleGetInfo(tempPreviousCustomerShipTo);
  };

  const handleConfirmationCancel = () => {
    setConfirmationModalVisible(false);
  };

  const handleInputChange = (fieldName: string) => (value: any) => {
    if (fieldName === 'country') {
      setProspectInputsData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.discoveryListValuesId,
      }));
    } else if (fieldName === 'salesArea') {
      if (prospectInputsData.salesArea !== value.salesAreaValue) {
        setProspectInputsData((prevData: any) => ({
          ...prevData,
          customerHierarchy: '',
        }));
      }

      setProspectInputsData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.salesAreaValue,
      }));
    } else if (fieldName === 'customerHierarchy') {
      setProspectInputsData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.l6HierarchyValue,
      }));
    } else if (fieldName === 'outletClassification') {
      setProspectInputsData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.industryCode,
      }));
    } else if (fieldName === 'employeeName') {
      setProspectInputsData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.employeeNumber,
      }));
    } else if (
      fieldName === 'iceCreamBulk' ||
      fieldName === 'iceCreamImpulse' ||
      fieldName === 'frozenFood'
    ) {
      setProspectInputsData((prevData: any) => ({
        ...prevData,
        [fieldName]: value.replace(/[^0-9]/g, ''),
      }));
    } else {
      setProspectInputsData((prevData: any) => ({
        ...prevData,
        [fieldName]: value,
      }));
    }

    setErrorMessages((prevData: any) => ({
      ...prevData,
      [fieldName]: '',
    }));
  };

  const onCustomerHierarchyFocus = () => {
    if (
      prospectInputsData.salesArea.length === 0 ||
      prospectInputsData.salesArea === '-'
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        salesArea: 'msg.createprospect.select_sales_area',
      }));
    }
  };

  const validateInputs = () => {
    setErrorPreviousCustomerShipTo('');
    setErrorMessages({
      name: '',
      address: '',
      phoneNumber: '',
      email: '',
      streetNumber: '',
      zipCode: '',
      city: '',
      country: '',
      salesArea: '',
      prospectNumber: '',
      customerHierarchy: '',
      outletClassification: '',
      employeeName: '',
      iceCreamBulk: '',
      iceCreamImpulse: '',
      frozenFood: '',
      total: '',
    });

    let isError = false;
    if (
      prospectInputsData.email.trim().length > 0 &&
      !validateEmail(prospectInputsData.email.trim())
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        email: 'label.general.invalid',
      }));
      isError = true;
    }

    if (mandatoryData.name === 1 && prospectInputsData.name.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        name: 'label.general.mandatory',
      }));
      isError = true;
    }
    if (
      mandatoryData.previousShipToNo === 1 &&
      previousCustomerShipTo.trim() === ''
    ) {
      setErrorPreviousCustomerShipTo('label.general.mandatory');
      isError = true;
    }

    if (
      mandatoryData.address === 1 &&
      prospectInputsData.address.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        address: 'label.general.mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.phoneNumber === 1 &&
      prospectInputsData.phoneNumber.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        phoneNumber: 'label.general.mandatory',
      }));
      isError = true;
    }
    if (
      mandatoryData.streetNo === 1 &&
      prospectInputsData.streetNumber.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        streetNumber: 'label.general.mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.zipCode === 1 &&
      prospectInputsData.zipCode.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        zipCode: 'label.general.mandatory',
      }));
      isError = true;
    }
    if (mandatoryData.city === 1 && prospectInputsData.city.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        city: 'label.general.mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.country === 1 &&
      prospectInputsData.country.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        country: 'label.general.mandatory',
      }));
      isError = true;
    }
    if (
      mandatoryData.customerHierarchy === 1 &&
      prospectInputsData.customerHierarchy.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        customerHierarchy: 'label.general.mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.outlet === 1 &&
      prospectInputsData.outletClassification.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        outletClassification: 'label.general.mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.iceCreamBulk === 1 &&
      prospectInputsData.iceCreamBulk.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        iceCreamBulk: 'label.general.mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.iceCreamImpluse === 1 &&
      prospectInputsData.iceCreamImpulse.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        iceCreamImpulse: 'label.general.mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.frozenFood === 1 &&
      prospectInputsData.frozenFood.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        frozenFood: 'label.general.mandatory',
      }));
      isError = true;
    }

    return !isError;
  };

  const handleCreateProspect = async () => {
    try {
      if (!validateInputs()) {
        return;
      }
      let previousNo = '';
      if (previousCustomerShipTo !== '') {
        previousNo = previousCustomerShipTo.padStart(10, '0');
      }

      const isProspectCreated =
        await ProspectsController.createOrUpdateProspect(
          screenType === 'Edit',
          previousNo,
          discoveryId,
          prospectInputsData,
        );
      console.log('isProspectCreated :>> ', isProspectCreated);

      if (typeof isProspectCreated === 'object') {
        toast.error({
          message: isProspectCreated.message,
        });
        return;
      }

      if (!isProspectCreated) {
        toast.error({
          message: 'msg.createprospect.something_went_wrong',
        });
        return;
      } else {
        await ACLService.saveAclGuardStatusToStorage(false);

        navigation.goBack();

        toast.success({
          message: 'msg.createprospect.created_successfully',
        });
      }
    } catch (error) {
      toast.error({
        message: 'msg.createprospect.something_went_wrong',
      });
      console.log('Error while creating the prospect :>> ', error);
    }
  };

  const handleNamePress = () => {
    const data = route.params.item;
    PLOverviewController.navigateToPLOverview(data);
  };

  return (
    <SafeAreaView style={tw(`${changeBgColor} flex-1`)}>
      <View flex>
        {screenType === 'Create' ? (
          <CreateProspectsHeader />
        ) : (
          <EditProspectsHeader
            handleEditSave={handleEditSaveToggle}
            isEditable={isEditable}
            handleInterest={handleInterest}
            data={route.params.item}
            prospectName={prospectName}
            handleNamePress={handleNamePress}
          />
        )}
        <Card flex-1 marginH-v2 marginB-v4 padding-v4>
          <ClientDetailHeaderComponent
            isEditable={isEditable}
            mandatoryData={mandatoryData}
            screenType={screenType}
            previousCustomerShipTo={previousCustomerShipTo}
            handleGetInfo={validateAndGetInfo}
            handleCreateProspect={handleCreateProspect}
            errorPreviousCustomerShipTo={errorPreviousCustomerShipTo}
            setErrorPreviousCustomerShipTo={setErrorPreviousCustomerShipTo}
          />
          {loading ? (
            <View flex center>
              <ActivityIndicator
                color={ColourPalette.light.black}
                size="large"
              />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}>
              <ProspectInfoComponent
                isEditable={isEditable}
                mandatoryData={mandatoryData}
                handleDelete={handleOnDeletePress}
                countryDropdownData={countryDropdownData}
                salesAreaDropdownData={salesAreaDropdownData}
                customerHierarchyDropdownData={customerHierarchyDropdownData}
                outletClassificationDropdownData={
                  outletClassificationDropdownData
                }
                employeeDropdownData={employeeDropdownData}
                getCustomerHierarchyDropdownData={
                  getCustomerHierarchyDropdownData
                }
                getOutletClassificationDropdownData={
                  getOutletClassificationDropdownData
                }
                getEmployeeDropdownData={getEmployeeDropdownData}
                errorMessages={errorMessages}
                isProspectDeletable={isProspectDeletable}
                screenType={screenType}
                inputsData={prospectInputsData}
                handleInputChange={handleInputChange}
                onCustomerHierarchyFocus={onCustomerHierarchyFocus}
              />
            </ScrollView>
          )}
        </Card>
        <DeleteModal
          isDeleteModalVisible={isDeleteModalVisible}
          title={`${t("msg.createprospect.delete")}\n${prospectName}?`}
          subTitle={`${t("msg.createprospect.are_you_sure_you_want_to_delete")}\n${prospectName}?`}
          onPressDelete={handleDeleteProspect}
          onPressCancel={handleOnPressCancel}
        />
        <MessageModal
          isVisible={messageModalVisible}
          title={`${t('msg.createprospect.could_not_delete')}\n${prospectName}?`}
          subTitle={warningMessage}
          isWarningMessage={true}
          handleOnPressSuccess={handleOnPressOk}
          icon={<images.WarningIcon />}
        />
        <MessageModal
          isVisible={confirmationModalVisible}
          title={t('msg.createprospect.would_you_like_to_overwrite_the_captured_details')}
          primaryButtonText="label.general.yes"
          secondaryButtonText="label.general.n"
          handleOnPressSuccess={handleConfirmationSuccess}
          handleOnPressCancel={handleConfirmationCancel}
        />
      </View>
    </SafeAreaView>
  );
};

export default withAuthScreen(CreateProspect);
