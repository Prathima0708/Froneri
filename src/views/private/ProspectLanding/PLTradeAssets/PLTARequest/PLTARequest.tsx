import React, { useState, FC, useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import base64 from 'react-native-base64'

import View from 'src/components/View';
import Card from 'src/components/Card';

import TACreateComponent from 'src/components/ProspectLanding/PLTradeAssets/PLTARequest/TACreateComponent';
import TAWishComponent from 'src/components/ProspectLanding/PLTradeAssets/PLTARequest/TAWishComponent';
import TATakeoverComponent from 'src/components/ProspectLanding/PLTradeAssets/PLTARequest/TATakeoverComponent';
import TACaptureSignatureComponent from 'src/components/ProspectLanding/PLTradeAssets/PLTARequest/TACaptureSignatureComponent';
import TANotesComponent from 'src/components/ProspectLanding/PLTradeAssets/PLTARequest/TANotesComponent';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import DeleteModal from 'src/components/Common/DeleteModal';

import { RootState, useAppSelector } from 'src/reducers/hooks';

import { withAuthScreen } from 'src/hoc/withAuthScreen';

import { tw } from 'src/tw';

import { ColourPalette } from 'src/styles/config/ColoursStyles';

import { images } from 'src/assets/Images';

import { pageNamePLTARequestAgreementPreview } from 'src/routes/Routes';

import ACLService from 'src/services/ACLService';
import { TextsService } from 'src/services/TextsService';

import PLTradeAssetController from 'src/controller/PLTradeAssetController';

import { toast } from 'src/utils/Util';
import { generateUniqueIdWithTime, getOnlyDate } from 'src/utils/CommonUtil';
import { YAMBS_WORKFLOW_STATUS_TYPE } from 'src/utils/DbConst';
import TAHeaderComponent from 'src/components/ProspectLanding/PLTradeAssets/TAHeaderComponent';

const PLTARequest: FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const prospectData = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );

  const employeeInfo = useAppSelector(
    (state: RootState) => state.userContext.employee,
  );

  const [descriptionDropdownData, setDescriptionDropdownData] = useState([])
  const [designDropdownData, setDesignDropdownData] = useState([])
  const [followUpActionsDropdownData, setFollowUpActionsDropdownData] = useState([])
  const [taWishData, setTaWishData] = useState<any>([])
  const [taTakeOverData, setTaTakeOverData] = useState<any>([])

  const [previousCustomerDetailsData, setPreviousCustomerDetailsData] = useState<any>({})

  const [isTaTakeOverDisabled, setIsTaTakeOverDisabled] = useState(false)
  const [isProspect, setIsProspect] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isFinalizeDisabled, setIsFinalizeDisabled] = useState(false)
  const [isAgreementFinalized, setIsAgreementFinalized] = useState(false)
  const [areSignaturesEditable, setAreSignaturesEditable] = useState(true)
  const [isFormEditable, setIsFormEditable] = useState(true)
  const [isDeleteIconVisible, setIsDeleteIconVisible] = useState(true)
  const [isEditButtonVisible, setIsEditButtonVisible] = useState(false)
  const [areTaWishEditable, setAreTaWishEditable] = useState(false)

  const [taTakeoverInput, setTaTakeoverInput] = useState('')

  const [taWishLimit, setTaWishLimit] = useState(-1)

  const [formInputs, setFormInputs] = useState({
    agreementNumber: "",
    taWish: false,
    taTakeover: false,
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
    taTakeoverInput: "",
  })

  useEffect(() => {
    getScreenData()
  }, [])

  useEffect(() => {
    console.log('prospectData :>> ', prospectData);
    if (prospectData?.statusType && prospectData?.statusType.toLowerCase() === 'p') {
      setIsProspect(true)
    } else {
      setIsProspect(false)
    }
  }, [prospectData])


  const getScreenData = async () => {
    try {
      setLoading(true)
      await fetchDropdownsData()
      await getTradeAssetWishLimitData()

      if (route.params?.isEditable) {
        console.log('Previous screen Data :>> ', route.params?.data);
        await prePopulateTaWishData();
        await prePopulateTaTakeoverData();
        await getPreviousCustomerDetailsData()
        setUpdateInitialInputsData()
        setIsFinalizeDisabled(false)
        setIsEditButtonVisible(true)
        setIsFormEditable(false)
        setAreSignaturesEditable(false)
      } else {
        const previousCustomerDetailsData = await getPreviousCustomerDetailsData()
        console.log('previousCustomerDetailsData :>> ', previousCustomerDetailsData);
        if (previousCustomerDetailsData.length > 0 && previousCustomerDetailsData[0]?.previousCustomerShipTo) {
          await getTaTakeoverDataOfProspect(previousCustomerDetailsData[0])
        }

        setInitialInputsData()
        setIsFinalizeDisabled(true)
        setIsDeleteIconVisible(false)
        setIsEditButtonVisible(false)
        setAreTaWishEditable(true)

        if (prospectData?.statusType && prospectData?.statusType.toLowerCase() === 'c') {
          setIsTaTakeOverDisabled(false)
        }

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

  const fetchDropdownsData = async () => {
    await getAndSetTaDropdownData()
    await getDesignDropdownData()
    await getFollowUpActionsDropdownData()
  }

  const getTADescriptionDropdownData = async (searchText?: string, materialNumber: string = '') => {
    try {
      let descriptionDropdownData = await PLTradeAssetController.getTADescription(searchText, materialNumber)
      console.log('descriptionDropdownData :>> ', descriptionDropdownData);

      if (descriptionDropdownData.length === 0) {
        descriptionDropdownData = [{
          price: "",
          minimumTurnover: "",
          materialNumber: "",
          description: searchText,
          brand: "",
        }]
      }

      return descriptionDropdownData
    } catch (error) {
      console.log('error while fetching TA description dropdown data:>> ', error);

      toast.error({
        message: "Something went wrong"
      })

      return []
    }
  }

  const getAndSetTaDropdownData = async () => {
    try {
      const descriptionDropdownData = await getTADescriptionDropdownData()
      setDescriptionDropdownData(descriptionDropdownData)
    } catch (error) {
      setDescriptionDropdownData([])
    }
  }

  const getDesignDropdownData = async () => {
    try {
      const designDropdownData = await PLTradeAssetController.getDesignList()
      setDesignDropdownData(designDropdownData)
      console.log('designDropdownData :>> ', designDropdownData);
    } catch (error) {
      console.log('error while fetching design dropdown data:>> ', error);

      toast.error({
        message: "Something went wrong"
      })
      setDesignDropdownData([])
    }
  }

  const getTradeAssetWishLimitData = async () => {
    try {
      const limitData = await PLTradeAssetController.getTradeAssetWishLimit()

      if (limitData) {
        setTaWishLimit(Number(limitData))
        return
      }

      setTaWishLimit(-1)
    } catch (error) {
      console.log('error while fetching ta wish limit data:>> ', error);

      toast.error({
        message: "Something went wrong"
      })
      setTaWishLimit(-1)
    }
  }

  const getFollowUpActionsDropdownData = async () => {
    try {
      const followUpActionsDropdownData = await PLTradeAssetController.getFollowUpActions()
      setFollowUpActionsDropdownData(followUpActionsDropdownData)
      console.log('followUpActionsDropdownData :>> ', followUpActionsDropdownData);
    } catch (error) {
      console.log('error while fetching follow up actions dropdown data:>> ', error);

      toast.error({
        message: "Something went wrong"
      })
      setFollowUpActionsDropdownData([])
    }
  }

  const prePopulateTaWishData = async () => {
    try {
      const taWishData = await PLTradeAssetController.getTaWishData(route.params?.data?.taLoanAgreementNumber)
      console.log('pre populate taWishData :>> ', taWishData);

      if (taWishData.length > 0) {
        let preparedTaWishData: any = []

        setDescriptionDropdownData((prevData: any) => {
          taWishData.forEach((item: any) => {
            let containsDescription = false
            prevData.forEach((data: any) => {
              if (data.description === item.taDescription) {
                containsDescription = true
              }
            });

            if (!containsDescription) {
              getTADescriptionDropdownData(item.taDescription).then((data: any) => {
                preparedTaWishData.push({
                  ...item,
                  descriptionDropdownData: [
                    ...prevData,
                    ...data
                  ]
                })
              }).catch((error) => {
                console.log('error while fetching description dropdown data :>> ', error);
                toast.error({
                  message: "Something went wrong"
                })
              })
            } else {
              preparedTaWishData.push({
                ...item,
                descriptionDropdownData: prevData
              })
            }
          })

          return prevData
        })

        setTaWishData(preparedTaWishData)
        return
      }

      setTaWishData([])
    } catch (error) {
      console.log('error while fetching ta wish data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      setTaWishData([])
    }
  }

  const prePopulateTaTakeoverData = async () => {
    try {
      const taTakeoverData = await PLTradeAssetController.getTaTakeoverData(route.params?.data?.taLoanAgreementNumber, prospectData?.statusType && prospectData?.statusType.toLowerCase() === 'p')
      console.log('pre populate taTakeoverData :>> ', taTakeoverData);

      if (taTakeoverData.length > 0) {
        setTaTakeOverData(taTakeoverData)

        if (prospectData?.statusType && prospectData?.statusType.toLowerCase() === 'c') {
          setTaTakeoverInput(taTakeoverData[0].previousCustomerShipTo)
        }

        return
      }

      setTaTakeOverData([])
    } catch (error) {
      console.log('error while fetching ta takeover data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      setTaTakeOverData([])
    }
  }

  const getPreviousCustomerDetailsData = async () => {
    try {
      const previousCustomerDetailsData = await PLTradeAssetController.getPreviousCustomerDetails()
      console.log('previousCustomerDetailsData :>> ', previousCustomerDetailsData);

      if (previousCustomerDetailsData.length > 0) {
        setPreviousCustomerDetailsData(previousCustomerDetailsData[0])
        if (previousCustomerDetailsData[0]?.previousCustomerShipTo) {
          setTaTakeoverInput(previousCustomerDetailsData[0]?.previousCustomerShipTo)
        }
      } else {
        setPreviousCustomerDetailsData({})
      }
      setIsTaTakeOverDisabled(true)
      return previousCustomerDetailsData
    } catch (error) {
      console.log('error while fetching previous customer details data:>> ', error);

      toast.error({
        message: "Something went wrong"
      })
      setPreviousCustomerDetailsData([])
      setIsTaTakeOverDisabled(false)
      return []
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

  const setUpdateInitialInputsData = () => {
    const previousScreenDataObj = route.params?.data
    const yambsStatus = previousScreenDataObj?.yambsStatus

    console.log('previousScreenDataObj :>> ', yambsStatus, previousScreenDataObj);

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
      taWish: !!previousScreenDataObj?.taWish,
      taTakeover: !!previousScreenDataObj?.too,
      signedDate: previousScreenDataObj?.signedDate ?? "",
      status: previousScreenDataObj?.status ?? "",
      createdBy: previousScreenDataObj?.createdBy ?? "",
      createdDate: previousScreenDataObj?.creationDate ?? "",
      updatedBy: previousScreenDataObj?.updatedBy ?? "",
      updatedDate: previousScreenDataObj?.updateDate ?? "",
      notes: previousScreenDataObj?.justification ?? "",
      customerSignature,
      customerSigneeName,
      employeeSignature,
      employeeSigneeName,
    }

    console.log('preparedData :>> ', preparedData);

    setFormInputs((prevData: any) => ({
      ...prevData,
      ...preparedData
    }))
  }

  const getTaTakeoverDataOfProspect = async (previousCustomerDetailsData: any) => {
    try {
      const prospectTaTakeoverData = await PLTradeAssetController.getTaTakeoverOfProspect(previousCustomerDetailsData.previousCustomerSalesOrganization, previousCustomerDetailsData.previousCustomerDistributionChannel)
      console.log('prospectTaTakeoverData :>> ', prospectTaTakeoverData);

      if (prospectTaTakeoverData.length > 0) {
        setTaTakeOverData(prospectTaTakeoverData)
        return
      }

      setTaTakeOverData([])
    } catch (error) {
      console.log('error while fetching ta takeover data of prospect :>> ', error);

      toast.error({
        message: "Something went wrong"
      })

      setTaTakeOverData([])
    } finally {
      setIsTaTakeOverDisabled(true)
    }
  }

  const handleDisplayTa = async (customerShipTo: string) => {
    try {
      if (!customerShipTo) {
        setErrorMessages((prevData: any) => ({
          ...prevData,
          taTakeoverInput: "Mandatory"
        }))
        return
      } else if (customerShipTo.length < 8) {
        setErrorMessages((prevData: any) => ({
          ...prevData,
          taTakeoverInput: "Invalid"
        }))
        return
      } else {
        setErrorMessages((prevData: any) => ({
          ...prevData,
          taTakeoverInput: ""
        }))
      }

      const displayTaData = await PLTradeAssetController.getTaTakeoverOfPreviousCustomerInTaRequest(customerShipTo)
      console.log('displayTaData :>> ', displayTaData);

      if (displayTaData.length > 0) {
        setTaTakeOverData(displayTaData)
        setPreviousCustomerDetailsData({
          ...previousCustomerDetailsData,
          previousCustomerShipTo: customerShipTo
        })
      } else {
        setTaTakeOverData([])
        toast.info({
          message: "There are no trade assets linked to selected customer"
        })
      }

    } catch (error) {
      console.log('error while fetching display ta data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      setTaTakeOverData([])
    }
  }

  const handlePreview = () => {
    navigation.navigate(pageNamePLTARequestAgreementPreview as never, {
      isProspect,
      data: formInputs
    } as never);
  };

  const validateTaWishData = () => {
    let isValid = true

    let tempTaWishData = [...taWishData]

    for (const taWishItem of tempTaWishData) {
      if (!taWishItem.design) {
        taWishItem.designError = "Mandatory"
        isValid = false
      }

      if (!Number(taWishItem.quantity)) {
        taWishItem.quantityError = "Mandatory"
        isValid = false
      }

      if (!Number(taWishItem.expectedTurnover)) {
        taWishItem.expectedTurnoverError = "Mandatory"
        isValid = false
      }
    }

    if (!isValid) {
      setTaWishData(tempTaWishData)
    }

    return isValid
  }

  const validateTaTakeoverData = () => {
    let isValid = true

    let tempTaTakeoverData = [...taTakeOverData]

    for (const taWishItem of tempTaTakeoverData) {
      if (taWishItem.taTransfer && !Number(taWishItem.expectedTurnoverTa)) {
        taWishItem.expectedTurnoverTaError = "Mandatory"
        isValid = false
      } else if (!taWishItem.taTransfer && !taWishItem.followUpAction && prospectData?.statusType && prospectData?.statusType.toLowerCase() === 'p') {
        taWishItem.followUpActionError = "Mandatory"
        isValid = false
      }
    }

    if (!isValid) {
      setTaTakeOverData(tempTaTakeoverData)
    }

    return isValid
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

  const validateInputs = (validateAllInputs = false) => {
    let isTaWishDataValidated = true
    let isTaTakeoverDataValidated = true
    let isSignaturesAndNotesValidated = true

    if (taWishData.length > 0) {
      isTaWishDataValidated = validateTaWishData()
    }

    if (taTakeOverData.length > 0) {
      isTaTakeoverDataValidated = validateTaTakeoverData()
    }

    if (validateAllInputs) {
      isSignaturesAndNotesValidated = validateSignaturesAndNotes()
    }

    if (!isTaWishDataValidated || !isTaTakeoverDataValidated || !isSignaturesAndNotesValidated) {
      return false
    }

    return true
  }

  const saveSingleAgreement = async (agreementNumber: string, taWishData: any, taTakeOverData: any) => {
    try {
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

      const isTaRequestSaved = await PLTradeAssetController.saveTARequestData(agreementNumber, formData, previousCustomerDetailsData, taWishData, taTakeOverData, taWishLimit, prospectData?.statusType && prospectData?.statusType.toLowerCase() === 'p')

      return isTaRequestSaved;
    } catch (error) {
      console.log('error while saving single agreement :>> ', error);
      return false;
    }
  }

  const saveAgreement = async () => {
    try {
      if (taWishLimit === 1 && !route.params?.isEditable && taTakeOverData.length > 0) {
        for (const taTakeover of taTakeOverData) {
          const agreementNumber = generateUniqueIdWithTime();

          const isTaRequestSaved = await saveSingleAgreement(agreementNumber, [], [taTakeover])

          if (!isTaRequestSaved) {
            toast.error({
              message: "Something went wrong"
            })
            return false
          }
        }

        if (taWishData.length > 0) {
          const agreementNumber = generateUniqueIdWithTime();

          const isTaRequestSaved = await saveSingleAgreement(agreementNumber, taWishData, [])

          if (!isTaRequestSaved) {
            toast.error({
              message: "Something went wrong"
            })
            return false
          }
        }

        await ACLService.saveAclGuardStatusToStorage(false)
        return true

      } else if (taWishLimit === 1 && route.params?.isEditable && taWishData.length > 0 && taTakeOverData.length > 0) {
        const taTakeoverAgreementNumber = formInputs?.agreementNumber;
        const taWishAgreementNumber = generateUniqueIdWithTime();

        const isTaWishSave = await saveSingleAgreement(taTakeoverAgreementNumber, [], taTakeOverData)
        const isTaTakeoverSave = await saveSingleAgreement(taWishAgreementNumber, taWishData, [])

        if (!isTaWishSave || !isTaTakeoverSave) {
          toast.error({
            message: "Something went wrong"
          })
          return false
        }

        await ACLService.saveAclGuardStatusToStorage(false)
        return true
      } else {
        let agreementNumber = formInputs?.agreementNumber;

        if (!agreementNumber) {
          agreementNumber = generateUniqueIdWithTime();
        }

        const isTaRequestSaved = await saveSingleAgreement(agreementNumber, taWishData, taTakeOverData)

        if (!isTaRequestSaved) {
          toast.error({
            message: "Something went wrong"
          })
          return
        }

        await ACLService.saveAclGuardStatusToStorage(false)
        return agreementNumber
      }
    } catch (error) {
      console.log('error while saving the agreement :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      return false
    }
  }

  const handleSave = async () => {
    try {
      if (taTakeOverData.length === 0 && taWishData.length === 0) {
        toast.error({
          message: "Enter at least one trade asset"
        })
        return
      }
      const isFormValidated = validateInputs()

      if (!isFormValidated) {
        toast.error({
          message: 'Enter All Mandatory Fields',
        });
        return
      }

      const agreementNumber = await saveAgreement();

      if (agreementNumber) {
        toast.success({
          message: "Agreement saved"
        })

        if (taWishLimit === 1) {
          navigation.goBack()
          return
        }

        setIsEditButtonVisible(true)
        setIsFormEditable(false)
        setAreSignaturesEditable(false)
        setIsDeleteIconVisible(true)
        setIsFinalizeDisabled(false)
        setIsEditable(false)
        setAreTaWishEditable(false)

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
      } else {
        toast.error({
          message: "Something went wrong"
        })
      }
    } catch (error) {
      console.log('error while saving the agreement :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    }
  };

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
      const isAgreementDeleted = await PLTradeAssetController.deleteTaRequestAgreement(formInputs.agreementNumber, isProspect)

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

  const handleFinalize = async () => {
    try {
      if (taTakeOverData.length === 0 && taWishData.length === 0) {
        toast.error({
          message: "Enter at least one trade asset"
        })
        return
      }
      const isFormValidated = validateInputs(true)

      if (!isFormValidated) {
        toast.error({
          message: 'Enter All Mandatory Fields',
        });
        return
      }

      const isAgreementSaved = await saveAgreement();
      console.log('isAgreementSaved :>> ', isAgreementSaved);

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
      if (taWishLimit === 1) {
        setAreTaWishEditable(false)
        setTaTakeOverData((prevData: any) => (prevData.map((item: any) => (
          {
            ...item,
            expectedTurnoverTaDisabled: true,
            taTransferDisabled: true,
            followUpActionDisabled: true
          }
        ))))
      } else {
        setAreTaWishEditable(true)
      }
    } else {
      setAreSignaturesEditable(true)
      setAreTaWishEditable(true)
    }
    if (prospectData?.statusType && prospectData?.statusType.toLowerCase() === 'c') {
      setIsTaTakeOverDisabled(false)
    }
  }

  const finalizeAgreement = async () => {
    try {
      setLoading(true)
      const isAgreementFinalized = await PLTradeAssetController.finalizeTaRequestAgreement(formInputs, taWishData, taTakeOverData, isProspect, previousCustomerDetailsData)
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
    } catch (error) {
      console.log('error while finalizing the agreement :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    await ACLService.saveAclGuardStatusToStorage(false)
    if (route.params?.isEditable) {
      await getScreenData()
      setIsEditButtonVisible(true)
      setIsFormEditable(false)
      setAreTaWishEditable(false)
      setAreSignaturesEditable(false)
      setIsEditable(false)
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
            <View>
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
                <TACreateComponent
                  formInputs={formInputs}
                />
                <TAWishComponent
                  taWishData={taWishData}
                  setTaWishData={setTaWishData}
                  designDropdownData={designDropdownData}
                  taWishLimit={taWishLimit}
                  getTADescriptionDropdownData={getTADescriptionDropdownData}
                  initialDescriptionDropdownData={descriptionDropdownData}
                  isEditable={isEditable}
                  setIsEditable={setIsEditable}
                  areTaWishEditable={areTaWishEditable}
                  taTakeOverData={taTakeOverData}
                />
                {(!route.params?.isEditable || (taTakeOverData.length > 0 || (taWishLimit !== 1 && prospectData?.statusType && prospectData?.statusType.toLowerCase() === 'c')))
                  && <TATakeoverComponent
                    isTaTakeOverDisabled={isTaTakeOverDisabled}
                    taTakeOverData={taTakeOverData}
                    setTaTakeOverData={setTaTakeOverData}
                    followUpActionsDropdownData={followUpActionsDropdownData}
                    handleDisplayTa={handleDisplayTa}
                    isEditable={isEditable}
                    setIsEditable={setIsEditable}
                    taTakeoverInput={taTakeoverInput}
                    setTaTakeoverInput={setTaTakeoverInput}
                    isFormEditable={isFormEditable}
                    errorMessages={errorMessages}
                    taWishLimit={taWishLimit}
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
            </View>
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
    </SafeAreaView >
  );
};

export default withAuthScreen(PLTARequest);
