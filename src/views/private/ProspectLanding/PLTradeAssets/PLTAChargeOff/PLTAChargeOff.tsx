import React, { useState, FC, useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import base64 from 'react-native-base64'

import View from 'src/components/View';
import Card from 'src/components/Card';

import TANotesComponent from 'src/components/ProspectLanding/PLTradeAssets/PLTARequest/TANotesComponent';
import TAChargeOffHeaderComponent from 'src/components/ProspectLanding/PLTradeAssets/PLTAChargeOff/TAChargeOffHeaderComponent';
import TAChargeOffListComponent from 'src/components/ProspectLanding/PLTradeAssets/PLTAChargeOff/TAChargeOffListComponent';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import TACaptureSignatureComponent from 'src/components/ProspectLanding/PLTradeAssets/PLTARequest/TACaptureSignatureComponent';

import { RootState, useAppSelector } from 'src/reducers/hooks';

import { withAuthScreen } from 'src/hoc/withAuthScreen';

import { tw } from 'src/tw';

import { images } from 'src/assets/Images';

import { toast } from 'src/utils/Util';
import { generateUniqueIdWithTime, getOnlyDate } from 'src/utils/CommonUtil';

import { pageNamePLTAChargeOffAgreementPreview } from 'src/routes/Routes';

import { TextsService } from 'src/services/TextsService';
import ACLService from 'src/services/ACLService';

import PLTradeAssetController from 'src/controller/PLTradeAssetController';
import { YAMBS_WORKFLOW_STATUS_TYPE } from 'src/utils/DbConst';
import DeleteModal from 'src/components/Common/DeleteModal';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import TAHeaderComponent from 'src/components/ProspectLanding/PLTradeAssets/TAHeaderComponent';

const PLTAChargeOff: FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const employeeInfo = useAppSelector(
    (state: RootState) => state.userContext.employee,
  );

  const [loading, setLoading] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isFinalizeDisabled, setIsFinalizeDisabled] = useState(false)
  const [isAgreementFinalized, setIsAgreementFinalized] = useState(false)
  const [areSignaturesEditable, setAreSignaturesEditable] = useState(true)
  const [isFormEditable, setIsFormEditable] = useState(true)
  const [isDeleteIconVisible, setIsDeleteIconVisible] = useState(true)
  const [isEditButtonVisible, setIsEditButtonVisible] = useState(false)

  const [taChargeOffData, setTaChargeOffData] = useState<any>([])

  const [formInputs, setFormInputs] = useState({
    agreementNumber: "",
    signedDate: "",
    status: "",
    createdBy: "",
    createdDate: "",
    updatedBy: "",
    updatedDate: "",
    customerSignature: "",
    customerSigneeName: "",
    employeeSignature: "",
    employeeSigneeName: "",
    notes: "",
  })

  const [errorMessages, setErrorMessages] = useState({
    customerSignature: "",
    employeeSignature: "",
    notes: "",
  })

  useEffect(() => {
    getScreenData()
  }, [])

  const getScreenData = async () => {
    try {
      setLoading(true)

      await getPreviousCustomerTAData()
      if (route.params?.isEditable) {
        await setUpdateInitialInputsData()
        await prePopulateTaChargeOffData()
        setIsFinalizeDisabled(false)
        setIsEditButtonVisible(true)
        setIsFormEditable(false)
        setAreSignaturesEditable(false)
      } else {
        setInitialInputsData()
        setIsFinalizeDisabled(true)
        setIsDeleteIconVisible(false)
        setIsEditButtonVisible(false)

        setFormInputs((prevData: any) => ({
          ...prevData,
          employeeSigneeName: employeeInfo[0].firstName + " " + employeeInfo[0].lastName
        }))
      }
    } catch (error) {
      console.log('error while fetching screen data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    } finally {
      setLoading(false)
    }
  }

  const setUpdateInitialInputsData = async () => {
    const previousScreenDataObj = route.params?.data
    const yambsStatus = previousScreenDataObj?.yambsStatus

    console.log('previousScreenDataObj :>> ', previousScreenDataObj);

    if (yambsStatus === YAMBS_WORKFLOW_STATUS_TYPE.REQUESTED || yambsStatus === YAMBS_WORKFLOW_STATUS_TYPE.COMPLETED || yambsStatus === YAMBS_WORKFLOW_STATUS_TYPE.NOT_REQUIRED) {
      setIsAgreementFinalized(true)
      setAreSignaturesEditable(false)
      setIsFormEditable(false)
      setIsDeleteIconVisible(false)
    } else {
      setIsAgreementFinalized(false)
      setAreSignaturesEditable(true)
      setIsFormEditable(true)
      setIsDeleteIconVisible(true)
    }

    const customerSignatureData = previousScreenDataObj?.signatureCustomer
    const customerSignatureArr = customerSignatureData?.split("-")

    const employeeSignatureData = previousScreenDataObj?.signatureEmployee
    const employeeSignatureArr = employeeSignatureData?.split("-")

    const customerSignature = customerSignatureArr?.length > 0 ? customerSignatureArr[0] : ""
    const customerSigneeName = customerSignatureArr?.length > 1 ? base64.decode(customerSignatureArr[1]) : ""

    const employeeSignature = employeeSignatureArr?.length > 0 ? employeeSignatureArr[0] : ""
    let employeeSigneeName = employeeSignatureArr?.length > 1 ? base64.decode(employeeSignatureArr[1]) : ""

    if (employeeSigneeName === "") {
      employeeSigneeName = employeeInfo[0].firstName + " " + employeeInfo[0].lastName
    }

    const preparedData = {
      agreementNumber: previousScreenDataObj?.taLoanAgreementNumber ?? "",
      signedDate: previousScreenDataObj?.signedDate ?? "",
      status: previousScreenDataObj?.status ?? "",
      createdBy: previousScreenDataObj?.createdBy ?? "",
      createdDate: previousScreenDataObj?.creationDate ?? "",
      updatedBy: previousScreenDataObj?.updatedBy ?? "",
      updatedDate: previousScreenDataObj?.updateDate ?? "",
      customerSignature,
      customerSigneeName,
      employeeSignature,
      employeeSigneeName,
      notes: previousScreenDataObj?.justification ?? "",
    }

    console.log('preparedData :>> ', preparedData);

    if (preparedData.signedDate) {
      setAreSignaturesEditable(false)
    } else {
      setAreSignaturesEditable(true)
    }

    setFormInputs((prevData: any) => ({
      ...prevData,
      ...preparedData
    }))

  }

  const prePopulateTaChargeOffData = async () => {
    try {
      console.log('previous screen data :>> ', route.params?.data.taLoanAgreementNumber);
      const tradeAssetChargeOffData = await PLTradeAssetController.getTradeAssetChargeOffData(route.params?.data?.taLoanAgreementNumber)
      console.log('tradeAssetChargeOffData :>> ', tradeAssetChargeOffData);

      if (tradeAssetChargeOffData.length > 0) {
        setTaChargeOffData((prevState: any) => ([...tradeAssetChargeOffData, ...prevState,]))
        return
      }
      setTaChargeOffData([])
    } catch (error) {
      console.log('error while pre populating screen data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      setTaChargeOffData([])
    }
  }

  const getPreviousCustomerTAData = async () => {
    try {
      const previousCustomerTAChargeOffData = await PLTradeAssetController.getPreviousCustomerTAChargeOff()
      console.log('previousCustomerTAChargeOffData :>> ', previousCustomerTAChargeOffData);

      if (previousCustomerTAChargeOffData.length > 0) {
        setTaChargeOffData(previousCustomerTAChargeOffData)
        return
      }

      setTaChargeOffData([])
    } catch (error) {
      console.log('error while fetching previous customer ta charge off data:>> ', error);

      toast.error({
        message: "Something went wrong"
      })
      setTaChargeOffData([])
    }
  }

  const setInitialInputsData = () => {
    let name = ""

    if (employeeInfo.length > 0) {
      name = employeeInfo[0].firstName + employeeInfo[0].lastName
    }

    setFormInputs((prevData: any) => ({
      ...prevData,
      status: "Open",
      createdDate: getOnlyDate(new Date().toISOString()),
      createdBy: name,
    }))
  }

  const validateTaChargeOffData = () => {
    let isValidated = true
    let objectIndex: number[] = [];

    taChargeOffData.forEach((item: any, index: number) => {
      if (item.status && (item.residualValue === '' || Number(item.residualValue) <= 0)) {
        isValidated = false
        objectIndex.push(index)
      }
    })

    return { isValidated, indexes: objectIndex }
  }

  const validateSignaturesAndNotes = () => {
    let isValid = true

    let tempErrorMessages = { ...errorMessages }

    if (!formInputs.customerSignature) {
      tempErrorMessages.customerSignature = "Mandatory"
      isValid = false
    }

    if (!formInputs.employeeSignature) {
      tempErrorMessages.employeeSignature = "Mandatory"
      isValid = false
    }

    if (!formInputs.notes) {
      tempErrorMessages.notes = "Mandatory"
      isValid = false
    }

    if (!isValid) {
      setErrorMessages(tempErrorMessages)
    }

    return isValid
  }

  const validateInputs = async (validateAllInputs = false) => {
    try {
      let isTaChargeOffDataValidated = true
      let isSignaturesAndNotesValidated = true

      if (taChargeOffData.length > 0) {
        const validationObj = validateTaChargeOffData()

        if (!validationObj.isValidated) {
          isTaChargeOffDataValidated = false
          const textsService = new TextsService();
          const msgResidualValueTa = await textsService.getTextsValue('MSG_RESIDUAL_VALUE_TA');

          let tempTaChargeOffData = [...taChargeOffData]

          validationObj.indexes.forEach((index: number) => {
            tempTaChargeOffData[index].residualValueError = msgResidualValueTa
          })

          setTaChargeOffData(tempTaChargeOffData)
        }
      }

      if (validateAllInputs) {
        isSignaturesAndNotesValidated = validateSignaturesAndNotes()
      }

      if (!isTaChargeOffDataValidated || !isSignaturesAndNotesValidated) {
        return false
      }

      return true
    } catch (error) {
      console.log('error while validating inputs :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      return false
    }
  }

  const saveAgreement = async () => {
    try {
      let agreementNumber = formInputs?.agreementNumber;

      if (!agreementNumber) {
        agreementNumber = generateUniqueIdWithTime();
      }

      let customerSignature = formInputs.customerSignature
      let employeeSignature = formInputs.employeeSignature

      if (formInputs.customerSigneeName.trim().length > 0) {
        const encodedCustomerSigneeName = base64.encode(formInputs.customerSigneeName)
        customerSignature = formInputs.customerSignature + "-" + encodedCustomerSigneeName
      }

      if (formInputs.employeeSigneeName.trim().length > 0) {
        const encodedEmployeeSigneeName = base64.encode(formInputs.employeeSigneeName)
        employeeSignature = formInputs.employeeSignature + "-" + encodedEmployeeSigneeName
      }

      const formData = {
        ...formInputs,
        customerSignature,
        employeeSignature,
      }

      const saveChargeOffData = await PLTradeAssetController.saveTAChargeOffData(agreementNumber, formData, taChargeOffData)

      if (!saveChargeOffData) {
        toast.error({
          message: "Something went wrong"
        })
        return false
      }

      await ACLService.saveAclGuardStatusToStorage(false)

      return agreementNumber
    } catch (error) {
      console.log('error while saving charge off data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      return false
    }
  }

  const handleSave = async () => {
    try {
      if (taChargeOffData.length === 0) {
        toast.error({
          message: "No TA Charge - Off data to save"
        })
        return false
      }

      let isTaChargeOffValid = false;

      taChargeOffData.forEach((item: any) => {
        if (item.status) {
          isTaChargeOffValid = true;
        }
      })

      if (!isTaChargeOffValid) {
        toast.error({
          message: "No TA Charge - Off data to save"
        })
        return false
      }

      const isFormValidated = await validateInputs()

      if (!isFormValidated) {
        toast.error({
          message: 'Enter All Mandatory Fields',
        });
        return false
      }

      const agreementNumber = await saveAgreement();

      if (agreementNumber) {
        toast.success({
          message: "Agreement saved"
        })

        setIsEditButtonVisible(true)
        setIsFormEditable(false)
        setAreSignaturesEditable(false)
        setIsDeleteIconVisible(true)
        setIsFinalizeDisabled(false)
        setIsEditable(false)

        if (!formInputs.signedDate && formInputs.customerSignature && formInputs.employeeSignature) {
          setFormInputs((prevData: any) => ({
            ...prevData,
            signedDate: getOnlyDate(new Date().toISOString()),
          }))
        }

        setFormInputs((prevData: any) => ({
          ...prevData,
          updatedBy: formInputs.agreementNumber ? employeeInfo[0].firstName + employeeInfo[0].lastName : prevData.updatedBy,
          updatedDate: formInputs.agreementNumber ? getOnlyDate(new Date().toISOString()) : prevData.updatedDate,
          agreementNumber: !route.params?.isEditable ? agreementNumber : prevData.agreementNumber
        }))
      }
    } catch (error) {
      console.log('error while saving agreement :>> ', error);
    }

  }

  const handlePreview = () => {
    navigation.navigate(pageNamePLTAChargeOffAgreementPreview as never, {
      data: formInputs
    } as never);
  };

  const handleFinalize = async () => {
    try {
      if (taChargeOffData.length === 0) {
        toast.error({
          message: "No TA Charge - Off data to save"
        })
        return false
      }

      let isTaChargeOffValid = false;

      taChargeOffData.forEach((item: any) => {
        if (item.status) {
          isTaChargeOffValid = true;
        }
      })

      if (!isTaChargeOffValid) {
        toast.error({
          message: "No TA Charge - Off data to save"
        })
        return false
      }

      const isFormValidated = await validateInputs(true)

      if (!isFormValidated) {
        toast.error({
          message: 'Enter All Mandatory Fields',
        });
        return false
      }

      const isAgreementSaved = await saveAgreement();

      if (!isAgreementSaved) {
        return
      }

      const yambsStatus = route.params?.data?.yambsStatus;

      if (yambsStatus === YAMBS_WORKFLOW_STATUS_TYPE.COMPLETED) {
        const textsService = new TextsService();
        const taAgreementSentToYambsMessage = await textsService.getTextsValue(
          'MSG_TA_AGREEMENT_ALREADY_SENT_TO_YAMBS',
        );

        toast.error({
          message: taAgreementSentToYambsMessage,
        })

        return
      }

      await finalizeAgreement()
    } catch (error) {
      console.log('error in finalizing the agreement :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    }
  }

  const handleEdit = () => {
    setIsEditButtonVisible(false)
    setIsFormEditable(true)
    setIsDeleteIconVisible(false)
    if (formInputs.customerSignature && formInputs.employeeSignature) {
      setAreSignaturesEditable(false)
    } else {
      setAreSignaturesEditable(true)
    }
  }

  const finalizeAgreement = async () => {
    try {

      setLoading(true)
      const isAgreementFinalized = await PLTradeAssetController.finalizeTaChargeOffAgreement(formInputs)
      console.log('isAgreementFinalized :>> ', isAgreementFinalized);

      if (!isAgreementFinalized) {
        toast.error({
          message: "Something went wrong"
        })
        return
      }

      toast.success({
        message: "Agreement finalized"
      })
      navigation.goBack()
      // setIsAgreementFinalized(true)
      // setAreSignaturesEditable(false)
      // setIsFormEditable(false)
      // setIsDeleteIconVisible(false)
    } catch (error) {
      console.log('error while finalizing the agreement :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    } finally {
      setLoading(false)
    }
  }

  const onDeletePress = async () => {
    try {
      const yambsStatus = route.params?.data?.yambsStatus;

      if (yambsStatus === YAMBS_WORKFLOW_STATUS_TYPE.REQUESTED || yambsStatus === YAMBS_WORKFLOW_STATUS_TYPE.COMPLETED || yambsStatus === YAMBS_WORKFLOW_STATUS_TYPE.NOT_REQUIRED) {
        const textsService = new TextsService();
        const taAgreementSentToYambsMessage = await textsService.getTextsValue(
          'MSG_TA_AGREEMENT_ALREADY_SENT_TO_YAMBS',
        );

        toast.error({
          message: taAgreementSentToYambsMessage,
        })

        return
      }

      setIsDeleteModalVisible(true);
    } catch (error) {
      console.log('error on delete press :>> ', error);
      toast.error({
        message: "Something went wrong"
      })

    }
  }

  const handleDeleteAgreement = async () => {
    try {
      console.log('agreementNumber :>> ', formInputs.agreementNumber);
      const isAgreementDeleted = await PLTradeAssetController.deleteTaChargeOffAgreement(formInputs.agreementNumber)

      if (!isAgreementDeleted) {
        toast.error({
          message: "Something went wrong"
        })
        return
      }
      setIsDeleteModalVisible(false);

      toast.success({
        message: "Agreement deleted"
      })

      await ACLService.saveAclGuardStatusToStorage(false)
      navigation.goBack()
    } catch (error) {
      console.log('error while deleting the agreement :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  }

  const handleCancel = async () => {
    await ACLService.saveAclGuardStatusToStorage(false)
    if (route.params?.isEditable) {
      await getScreenData()
      setIsEditButtonVisible(true)
      setIsFormEditable(false)
      setAreSignaturesEditable(false)
    } else {
      navigation.goBack()
    }
  }

  return (
    <SafeAreaView style={tw('bg-light-lightGrey flex-1')}>
      <View flex>
        <ProspectLandingHeader />
        <Card flex-1 marginH-v2 marginB-v4 padding-v4 cardStyle={{
          overflow: "hidden"
        }}>
          {loading ?
            <View flex center>
              <ActivityIndicator size={'large'} color={ColourPalette.light.black} />
            </View>
            :
            <ScrollView
              keyboardShouldPersistTaps="always"
              contentContainerStyle={{ flexGrow: 1 }}
              stickyHeaderIndices={[0]}
            >
              <View bg-white>
                <TAHeaderComponent
                  handlePreview={handlePreview}
                  handleSave={handleSave}
                  isEditable={isEditable}
                  isFinalizeDisabled={isFinalizeDisabled}
                  handleFinalize={handleFinalize}
                  isAgreementFinalized={isAgreementFinalized}
                  handleEdit={handleEdit}
                  isEditButtonVisible={isEditButtonVisible}
                  handleCancel={handleCancel}
                />
              </View>
              <TAChargeOffHeaderComponent
                formInputs={formInputs}
              />
              {taChargeOffData.length > 0 && <TAChargeOffListComponent
                taChargeOffData={taChargeOffData}
                setTaChargeOffData={setTaChargeOffData}
                isEditable={isEditable}
                setIsEditable={setIsEditable}
                isFormEditable={isFormEditable}
              />}
              <TACaptureSignatureComponent
                formInputs={formInputs}
                setFormInputs={setFormInputs}
                isEditable={isEditable}
                setIsEditable={setIsEditable}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
                areSignaturesEditable={areSignaturesEditable}
              />
              <TANotesComponent
                formInputs={formInputs}
                setFormInputs={setFormInputs}
                isEditable={isEditable}
                setIsEditable={setIsEditable}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
                isFormEditable={isFormEditable}
              />

              {isDeleteIconVisible &&
                <View flex marginT-v06>
                  <TouchableOpacity onPress={onDeletePress}>
                    <images.DeleteIcon />
                  </TouchableOpacity>
                </View>
              }
            </ScrollView>
          }
        </Card>
      </View>
      <DeleteModal
        isDeleteModalVisible={isDeleteModalVisible}
        title={`Delete\nAgreement Number\n${formInputs.agreementNumber}`}
        subTitle={'Are you sure you want to delete\nthis Agreement?'}
        onPressDelete={handleDeleteAgreement}
        onPressCancel={handleDeleteCancel}
      />
    </SafeAreaView>
  );
};

export default withAuthScreen(PLTAChargeOff);