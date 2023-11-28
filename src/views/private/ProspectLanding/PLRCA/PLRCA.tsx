import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

import { tw } from 'src/tw';

import View from 'src/components/View';
import Text from 'src/components/Text';
import Card from 'src/components/Card';

import MessageModal from 'src/components/Common/MessageModal';
import PLLeftMenuComponent from 'src/components/ProspectLanding/PLLeftMenuComponent/PLLeftMenuComponent';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import PLRCATopTabComponent from 'src/components/ProspectLanding/PLRCA/PLRCATopTabComponent';
import OpeningVisitingComponent from 'src/components/ProspectLanding/PLRCA/OpeningVisitingComponent';
import VisitCallDeliveryPlanComponent from 'src/components/ProspectLanding/PLRCA/VisitCallDeliveryPlanComponent';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';

import { withAuthScreen } from 'src/hoc/withAuthScreen';

import { PROSPECT_LANDING_SCREENS, RCA_TYPES } from 'src/utils/Constant';
import { toast } from 'src/utils/Util';
import { CALL_AND_DELIVERY_WEEK_DROPDOWN } from 'src/utils/DropdownConst';

import ACLService from 'src/services/ACLService';

import PLRCAController from 'src/controller/PLRCAController';

import { RootState, useAppSelector } from 'src/reducers/hooks';

import { ColourPalette } from 'src/styles/config/ColoursStyles';


const PLRCA = () => {
  const prospectData = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );

  const isEditable =
    prospectData?.statusType && prospectData?.statusType.toLowerCase() === 'p';

  const [activeTab, setActiveTab] = useState(RCA_TYPES[0].title);

  const [seasonDropdownData, setSeasonDropdownData] = useState([])
  const [callFrequencyDropdownData, setCallFrequencyDropdownData] = useState([])
  const [distributionCenterDropdownData, setDistributionCenterDropdownData] = useState([])
  const [transitCallPlaceDropdownData, setTransitCallPlaceDropdownData] = useState<any>([])
  const [weekDropdownData, setWeekDropdownData] = useState<any>([])
  const [callAndDeliveryWeekDropdownData, setCallAndDeliveryWeekDropdownData] = useState<typeof CALL_AND_DELIVERY_WEEK_DROPDOWN>([])

  // Input fields state
  const [inputFields, setInputFields] = useState({
    season: '',
    callFrequency: '',
    callWeek: '',
    deliveryWeek: '',
    distributionCenter: '',
    transitCallPlace: '',
    notes: '',
    mondayCall: false,
    tuesdayCall: false,
    wednesdayCall: false,
    thursdayCall: false,
    fridayCall: false,
    saturdayCall: false,
    sundayCall: false,
    mondayDropdown: -1,
    tuesdayDropdown: -1,
    wednesdayDropdown: -1,
    thursdayDropdown: -1,
    fridayDropdown: -1,
    saturdayDropdown: -1,
    sundayDropdown: -1,
  })

  // Error message state
  const [errorMessages, setErrorMessages] = useState({
    season: '',
    callFrequency: '',
    callWeek: '',
    deliveryWeek: '',
    distributionCenter: '',
    transitCallPlace: '',
    notes: '',
    mondayDropdown: '',
    tuesdayDropdown: '',
    wednesdayDropdown: '',
    thursdayDropdown: '',
    fridayDropdown: '',
    saturdayDropdown: '',
    sundayDropdown: '',

    openingMondayMorningFrom: '',
    openingMondayMorningTo: '',
    openingMondayAfternoonFrom: '',
    openingMondayAfternoonTo: '',

    openingTuesdayMorningFrom: '',
    openingTuesdayMorningTo: '',
    openingTuesdayAfternoonFrom: '',
    openingTuesdayAfternoonTo: '',

    openingWednesdayMorningFrom: '',
    openingWednesdayMorningTo: '',
    openingWednesdayAfternoonFrom: '',
    openingWednesdayAfternoonTo: '',

    openingThursdayMorningFrom: '',
    openingThursdayMorningTo: '',
    openingThursdayAfternoonFrom: '',
    openingThursdayAfternoonTo: '',

    openingFridayMorningFrom: '',
    openingFridayMorningTo: '',
    openingFridayAfternoonFrom: '',
    openingFridayAfternoonTo: '',

    openingSaturdayMorningFrom: '',
    openingSaturdayMorningTo: '',
    openingSaturdayAfternoonFrom: '',
    openingSaturdayAfternoonTo: '',

    openingSundayMorningFrom: '',
    openingSundayMorningTo: '',
    openingSundayAfternoonFrom: '',
    openingSundayAfternoonTo: '',

    visitingMondayMorningFrom: '',
    visitingMondayMorningTo: '',
    visitingMondayAfternoonFrom: '',
    visitingMondayAfternoonTo: '',

    visitingTuesdayMorningFrom: '',
    visitingTuesdayMorningTo: '',
    visitingTuesdayAfternoonFrom: '',
    visitingTuesdayAfternoonTo: '',

    visitingWednesdayMorningFrom: '',
    visitingWednesdayMorningTo: '',
    visitingWednesdayAfternoonFrom: '',
    visitingWednesdayAfternoonTo: '',

    visitingThursdayMorningFrom: '',
    visitingThursdayMorningTo: '',
    visitingThursdayAfternoonFrom: '',
    visitingThursdayAfternoonTo: '',

    visitingFridayMorningFrom: '',
    visitingFridayMorningTo: '',
    visitingFridayAfternoonFrom: '',
    visitingFridayAfternoonTo: '',

    visitingSaturdayMorningFrom: '',
    visitingSaturdayMorningTo: '',
    visitingSaturdayAfternoonFrom: '',
    visitingSaturdayAfternoonTo: '',

    visitingSundayMorningFrom: '',
    visitingSundayMorningTo: '',
    visitingSundayAfternoonFrom: '',
    visitingSundayAfternoonTo: '',
  })

  // Opening hours state
  const [openingHours, setOpeningHours] = useState<any>({
    mondayMorningFrom: '',
    mondayMorningTo: '',
    mondayAfternoonFrom: '',
    mondayAfternoonTo: '',

    tuesdayMorningFrom: '',
    tuesdayMorningTo: '',
    tuesdayAfternoonFrom: '',
    tuesdayAfternoonTo: '',

    wednesdayMorningFrom: '',
    wednesdayMorningTo: '',
    wednesdayAfternoonFrom: '',
    wednesdayAfternoonTo: '',

    thursdayMorningFrom: '',
    thursdayMorningTo: '',
    thursdayAfternoonFrom: '',
    thursdayAfternoonTo: '',

    fridayMorningFrom: '',
    fridayMorningTo: '',
    fridayAfternoonFrom: '',
    fridayAfternoonTo: '',

    saturdayMorningFrom: '',
    saturdayMorningTo: '',
    saturdayAfternoonFrom: '',
    saturdayAfternoonTo: '',

    sundayMorningFrom: '',
    sundayMorningTo: '',
    sundayAfternoonFrom: '',
    sundayAfternoonTo: '',
  });

  // Visiting hours state
  const [visitingHours, setVisitingHours] = useState({
    mondayMorningFrom: '',
    mondayMorningTo: '',
    mondayAfternoonFrom: '',
    mondayAfternoonTo: '',

    tuesdayMorningFrom: '',
    tuesdayMorningTo: '',
    tuesdayAfternoonFrom: '',
    tuesdayAfternoonTo: '',

    wednesdayMorningFrom: '',
    wednesdayMorningTo: '',
    wednesdayAfternoonFrom: '',
    wednesdayAfternoonTo: '',

    thursdayMorningFrom: '',
    thursdayMorningTo: '',
    thursdayAfternoonFrom: '',
    thursdayAfternoonTo: '',

    fridayMorningFrom: '',
    fridayMorningTo: '',
    fridayAfternoonFrom: '',
    fridayAfternoonTo: '',

    saturdayMorningFrom: '',
    saturdayMorningTo: '',
    saturdayAfternoonFrom: '',
    saturdayAfternoonTo: '',

    sundayMorningFrom: '',
    sundayMorningTo: '',
    sundayAfternoonFrom: '',
    sundayAfternoonTo: '',
  });

  // Mandatory fields state
  const [mandatoryData, setMandatoryData] = useState({
    openingMondayMorningFrom: 0,
    openingMondayMorningTo: 0,
    openingMondayAfternoonFrom: 0,
    openingMondayAfternoonTo: 0,

    openingTuesdayMorningFrom: 0,
    openingTuesdayMorningTo: 0,
    openingTuesdayAfternoonFrom: 0,
    openingTuesdayAfternoonTo: 0,

    openingWednesdayMorningFrom: 0,
    openingWednesdayMorningTo: 0,
    openingWednesdayAfternoonFrom: 0,
    openingWednesdayAfternoonTo: 0,

    openingThursdayMorningFrom: 0,
    openingThursdayMorningTo: 0,
    openingThursdayAfternoonFrom: 0,
    openingThursdayAfternoonTo: 0,

    openingFridayMorningFrom: 0,
    openingFridayMorningTo: 0,
    openingFridayAfternoonFrom: 0,
    openingFridayAfternoonTo: 0,

    openingSaturdayMorningFrom: 0,
    openingSaturdayMorningTo: 0,
    openingSaturdayAfternoonFrom: 0,
    openingSaturdayAfternoonTo: 0,

    openingSundayMorningFrom: 0,
    openingSundayMorningTo: 0,
    openingSundayAfternoonFrom: 0,
    openingSundayAfternoonTo: 0,

    visitingMondayMorningFrom: 0,
    visitingMondayMorningTo: 0,
    visitingMondayAfternoonFrom: 0,
    visitingMondayAfternoonTo: 0,

    visitingTuesdayMorningFrom: 0,
    visitingTuesdayMorningTo: 0,
    visitingTuesdayAfternoonFrom: 0,
    visitingTuesdayAfternoonTo: 0,

    visitingWednesdayMorningFrom: 0,
    visitingWednesdayMorningTo: 0,
    visitingWednesdayAfternoonFrom: 0,
    visitingWednesdayAfternoonTo: 0,

    visitingThursdayMorningFrom: 0,
    visitingThursdayMorningTo: 0,
    visitingThursdayAfternoonFrom: 0,
    visitingThursdayAfternoonTo: 0,

    visitingFridayMorningFrom: 0,
    visitingFridayMorningTo: 0,
    visitingFridayAfternoonFrom: 0,
    visitingFridayAfternoonTo: 0,

    visitingSaturdayMorningFrom: 0,
    visitingSaturdayMorningTo: 0,
    visitingSaturdayAfternoonFrom: 0,
    visitingSaturdayAfternoonTo: 0,

    visitingSundayMorningFrom: 0,
    visitingSundayMorningTo: 0,
    visitingSundayAfternoonFrom: 0,
    visitingSundayAfternoonTo: 0,

    season: 0,
    callFrequency: 0,
    callWeek: 0,
    deliveryWeek: 0,
    distributionCenter: 0,
    transitCallPlace: 0,

    callDayMonday: 0,
    callDayTuesday: 0,
    callDayWednesday: 0,
    callDayThursday: 0,
    callDayFriday: 0,
    callDaySaturday: 0,
    callDaySunday: 0,

    deliveryDayMonday: 0,
    deliveryDayTuesday: 0,
    deliveryDayWednesday: 0,
    deliveryDayThursday: 0,
    deliveryDayFriday: 0,
    deliveryDaySaturday: 0,
    deliveryDaySunday: 0,

    notes: 0,
  });

  const [screenLoading, setScreenLoading] = useState(false) // Screen loading state
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false); // Cancel modal state
  const [callDayDisabled, setCallDayDisabled] = useState(false) // State for disabling call day fields
  const [formLoading, setFormLoading] = useState(false) // Form loading state
  const [isSaveDisabled, setIsSaveDisabled] = useState(true)

  // Delivery day input fields for validation
  const deliveryDayFields = [
    "mondayDropdown",
    "tuesdayDropdown",
    "wednesdayDropdown",
    "thursdayDropdown",
    "fridayDropdown",
    "saturdayDropdown",
    "sundayDropdown",
  ];

  // Call day input fields for validation
  const callDayFields = [
    "mondayCall",
    "tuesdayCall",
    "wednesdayCall",
    "thursdayCall",
    "fridayCall",
    "saturdayCall",
    "sundayCall",
  ];

  // Delivery day mandatory fields for validation
  const deliveryMandatoryFields = [
    'deliveryDayMonday',
    'deliveryDayTuesday',
    'deliveryDayWednesday',
    'deliveryDayThursday',
    'deliveryDayFriday',
    'deliveryDaySaturday',
    'deliveryDaySunday',
  ]

  // Fetching screen data
  useEffect(() => {
    getScreenData();
  }, [])

  // Populating call frequency dropdown data based on season
  useEffect(() => {
    const callFrequencyDropdownData: any = seasonDropdownData.find((item: any) => item.season === inputFields.season)
    if (callFrequencyDropdownData) {
      setCallFrequencyDropdownData(callFrequencyDropdownData.data)
      setCallAndDeliveryWeekDropdownData([])
      setMandatoryData((prevData: any) => ({
        ...prevData,
        callWeek: 0,
        deliveryWeek: 0,
      }))
    } else {
      setCallFrequencyDropdownData([])
    }
  }, [inputFields.season])

  // Enabling/Disabling call day fields based on call frequency
  useEffect(() => {
    if (inputFields.callFrequency !== '') {
      handleFilledCallFrequency()
    } else {
      handleEmptyCallFrequency()
    }
  }, [inputFields.callFrequency])

  const handleFilledCallFrequency = () => {
    setCallFrequencyDropdownData((prevData: any) => {
      const weekData: any = prevData.find((item: any) => item.label === inputFields.callFrequency)

      if (weekData) {
        const slicedData = CALL_AND_DELIVERY_WEEK_DROPDOWN.slice(0, Number(weekData.frequency))

        if (inputFields.callWeek && Number(inputFields.callWeek) > Number(weekData.frequency)) {
          setInputFields((prevData: any) => ({
            ...prevData,
            callWeek: '',
          }))
        }

        if (inputFields.deliveryWeek && Number(inputFields.deliveryWeek) > Number(weekData.frequency)) {
          setInputFields((prevData: any) => ({
            ...prevData,
            deliveryWeek: '',
          }))
        }

        setCallAndDeliveryWeekDropdownData(slicedData)
      } else {
        setCallAndDeliveryWeekDropdownData([])
      }
      return prevData
    })

    if (!isEditable) {
      setCallDayDisabled(true)
    }
    else {
      setCallDayDisabled(false)
      setMandatoryData((prevData: any) => ({
        ...prevData,
        callWeek: 1,
        deliveryWeek: 1,
      }))
    }
  }

  const handleEmptyCallFrequency = () => {
    setCallDayDisabled(true)
    setInputFields((prevData: any) => ({
      ...prevData,
      mondayCall: false,
      tuesdayCall: false,
      wednesdayCall: false,
      thursdayCall: false,
      fridayCall: false,
      saturdayCall: false,
      sundayCall: false,
      mondayDropdown: -1,
      tuesdayDropdown: -1,
      wednesdayDropdown: -1,
      thursdayDropdown: -1,
      fridayDropdown: -1,
      saturdayDropdown: -1,
      sundayDropdown: -1,
    }))
  }

  // Fetching all screen data
  const getScreenData = async () => {
    setScreenLoading(true)
    await getSeasonDropdownData()
    await getDistributionCenterDropdownData()
    await getTransitCallPlaceDropdownData()
    await getWeekDropdownData()

    await prePopulateData()
    setScreenLoading(false)
  }

  // Checking if data is available in dropdown or not
  const containsObject = (res: any, value: any) => {
    for (const element of res) {
      if (
        element.callPlaceNumber === value
      ) {
        return true;
      }
    }
    return false;
  };

  // Fetching season dropdown data
  const getSeasonDropdownData = async () => {
    try {
      const seasonDropdownData = await PLRCAController.getSeasonData();

      if (seasonDropdownData.length > 0) {
        setSeasonDropdownData(seasonDropdownData)
      } else {
        setSeasonDropdownData([])
      }

    } catch (error) {
      console.log('error while fetching season dropdown data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      setSeasonDropdownData([])
    }
  }

  // Fetching distribution center dropdown data
  const getDistributionCenterDropdownData = async () => {
    try {
      const distributionCenterDropdownData = await PLRCAController.getDistributionCenter();

      if (distributionCenterDropdownData.length > 0) {
        setDistributionCenterDropdownData(distributionCenterDropdownData)
      } else {
        setDistributionCenterDropdownData([])
      }

    } catch (error) {
      console.log('error while fetching distribution center dropdown data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      setDistributionCenterDropdownData([])
    }
  }

  // Fetching transit call place dropdown data
  const getTransitCallPlaceDropdownData = async (searchText: string = '') => {
    try {
      const transitCallPlaceDropdownData = await PLRCAController.getTransitCallPlace(searchText);

      if (transitCallPlaceDropdownData.length > 0) {
        setTransitCallPlaceDropdownData(transitCallPlaceDropdownData)
      } else {
        setTransitCallPlaceDropdownData([])
      }

    } catch (error) {
      console.log('error while fetching transit call place dropdown data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      setTransitCallPlaceDropdownData([])
    }
  }

  // Fetching week dropdown data for call day and delivery day
  const getWeekDropdownData = async () => {
    try {
      const weekDropdownData = await PLRCAController.getWeekData();

      if (weekDropdownData.length > 0) {
        setWeekDropdownData(weekDropdownData)
      } else {
        setWeekDropdownData([])
      }

    } catch (error) {
      console.log('error while fetching week dropdown data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      setWeekDropdownData([])
    }
  }

  // Pre populating screen data by checking the status type
  const prePopulateData = async () => {
    if (
      prospectData?.statusType &&
      prospectData?.statusType.toLowerCase() === 'c'
    ) {
      await prePopulateCustomerData()
    } else {
      await getMandatoryFieldsData()
      await prePopulateProspectData()
    }
  }

  // Fetching mandatory fields data
  const getMandatoryFieldsData = async () => {
    try {
      const mandatoryFieldsData = await PLRCAController.getRCAMandatoryFieldsConfig();

      setMandatoryData((prevData: any) => ({
        ...prevData,
        ...mandatoryFieldsData
      }))

    } catch (error) {
      console.log('error while fetching mandatory fields :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      setMandatoryData({
        openingMondayMorningFrom: 0,
        openingMondayMorningTo: 0,
        openingMondayAfternoonFrom: 0,
        openingMondayAfternoonTo: 0,

        openingTuesdayMorningFrom: 0,
        openingTuesdayMorningTo: 0,
        openingTuesdayAfternoonFrom: 0,
        openingTuesdayAfternoonTo: 0,

        openingWednesdayMorningFrom: 0,
        openingWednesdayMorningTo: 0,
        openingWednesdayAfternoonFrom: 0,
        openingWednesdayAfternoonTo: 0,

        openingThursdayMorningFrom: 0,
        openingThursdayMorningTo: 0,
        openingThursdayAfternoonFrom: 0,
        openingThursdayAfternoonTo: 0,

        openingFridayMorningFrom: 0,
        openingFridayMorningTo: 0,
        openingFridayAfternoonFrom: 0,
        openingFridayAfternoonTo: 0,

        openingSaturdayMorningFrom: 0,
        openingSaturdayMorningTo: 0,
        openingSaturdayAfternoonFrom: 0,
        openingSaturdayAfternoonTo: 0,

        openingSundayMorningFrom: 0,
        openingSundayMorningTo: 0,
        openingSundayAfternoonFrom: 0,
        openingSundayAfternoonTo: 0,

        visitingMondayMorningFrom: 0,
        visitingMondayMorningTo: 0,
        visitingMondayAfternoonFrom: 0,
        visitingMondayAfternoonTo: 0,

        visitingTuesdayMorningFrom: 0,
        visitingTuesdayMorningTo: 0,
        visitingTuesdayAfternoonFrom: 0,
        visitingTuesdayAfternoonTo: 0,

        visitingWednesdayMorningFrom: 0,
        visitingWednesdayMorningTo: 0,
        visitingWednesdayAfternoonFrom: 0,
        visitingWednesdayAfternoonTo: 0,

        visitingThursdayMorningFrom: 0,
        visitingThursdayMorningTo: 0,
        visitingThursdayAfternoonFrom: 0,
        visitingThursdayAfternoonTo: 0,

        visitingFridayMorningFrom: 0,
        visitingFridayMorningTo: 0,
        visitingFridayAfternoonFrom: 0,
        visitingFridayAfternoonTo: 0,

        visitingSaturdayMorningFrom: 0,
        visitingSaturdayMorningTo: 0,
        visitingSaturdayAfternoonFrom: 0,
        visitingSaturdayAfternoonTo: 0,

        visitingSundayMorningFrom: 0,
        visitingSundayMorningTo: 0,
        visitingSundayAfternoonFrom: 0,
        visitingSundayAfternoonTo: 0,

        season: 0,
        callFrequency: 0,
        callWeek: 0,
        deliveryWeek: 0,
        distributionCenter: 0,
        transitCallPlace: 0,

        callDayMonday: 0,
        callDayTuesday: 0,
        callDayWednesday: 0,
        callDayThursday: 0,
        callDayFriday: 0,
        callDaySaturday: 0,
        callDaySunday: 0,

        deliveryDayMonday: 0,
        deliveryDayTuesday: 0,
        deliveryDayWednesday: 0,
        deliveryDayThursday: 0,
        deliveryDayFriday: 0,
        deliveryDaySaturday: 0,
        deliveryDaySunday: 0,

        notes: 0,
      })
    }
  }

  // Pre populating customer data
  const prePopulateCustomerData = async () => {
    try {
      const customerData = await PLRCAController.getCustomerRCAData()

      if (customerData.length === 0) {
        resetInputFields()
        return
      }

      const customerDataObj = customerData[0]
      const openingAndVisitingHoursData: any = PLRCAController.getFormattedOpeningAndVisitingHoursData(customerDataObj)

      formatAndSetData(customerDataObj)

      if (openingAndVisitingHoursData?.openingHours && Object.keys(openingAndVisitingHoursData?.openingHours).length > 0) {
        setOpeningHours(openingAndVisitingHoursData?.openingHours)
      } else {
        resetOpeningHours()
      }

      if (openingAndVisitingHoursData?.visitingHours && Object.keys(openingAndVisitingHoursData?.visitingHours).length > 0) {
        setVisitingHours(openingAndVisitingHoursData?.visitingHours)
      } else {
        resetVisitingHours()
      }
    } catch (error) {
      console.log('error while pre populating customer data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      resetInputFields()
    }
  }

  // Pre populating prospect data
  const prePopulateProspectData = async () => {
    try {
      await getProspectOpeningAndVisitingHours()
      await getProspectCallAndDeliveryData()
    } catch (error) {
      console.log('error while fetching prospect data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    }
  }

  // Resetting opening hours
  const resetOpeningHours = () => {
    setOpeningHours({
      mondayMorningFrom: '',
      mondayMorningTo: '',
      mondayAfternoonFrom: '',
      mondayAfternoonTo: '',

      tuesdayMorningFrom: '',
      tuesdayMorningTo: '',
      tuesdayAfternoonFrom: '',
      tuesdayAfternoonTo: '',

      wednesdayMorningFrom: '',
      wednesdayMorningTo: '',
      wednesdayAfternoonFrom: '',
      wednesdayAfternoonTo: '',

      thursdayMorningFrom: '',
      thursdayMorningTo: '',
      thursdayAfternoonFrom: '',
      thursdayAfternoonTo: '',

      fridayMorningFrom: '',
      fridayMorningTo: '',
      fridayAfternoonFrom: '',
      fridayAfternoonTo: '',

      saturdayMorningFrom: '',
      saturdayMorningTo: '',
      saturdayAfternoonFrom: '',
      saturdayAfternoonTo: '',

      sundayMorningFrom: '',
      sundayMorningTo: '',
      sundayAfternoonFrom: '',
      sundayAfternoonTo: '',
    })
  }

  // Resetting visiting hours
  const resetVisitingHours = () => {
    setVisitingHours({
      mondayMorningFrom: '',
      mondayMorningTo: '',
      mondayAfternoonFrom: '',
      mondayAfternoonTo: '',

      tuesdayMorningFrom: '',
      tuesdayMorningTo: '',
      tuesdayAfternoonFrom: '',
      tuesdayAfternoonTo: '',

      wednesdayMorningFrom: '',
      wednesdayMorningTo: '',
      wednesdayAfternoonFrom: '',
      wednesdayAfternoonTo: '',

      thursdayMorningFrom: '',
      thursdayMorningTo: '',
      thursdayAfternoonFrom: '',
      thursdayAfternoonTo: '',

      fridayMorningFrom: '',
      fridayMorningTo: '',
      fridayAfternoonFrom: '',
      fridayAfternoonTo: '',

      saturdayMorningFrom: '',
      saturdayMorningTo: '',
      saturdayAfternoonFrom: '',
      saturdayAfternoonTo: '',

      sundayMorningFrom: '',
      sundayMorningTo: '',
      sundayAfternoonFrom: '',
      sundayAfternoonTo: '',
    })
  }

  // Resetting input fields
  const resetInputFields = () => {
    setInputFields({
      season: '',
      callFrequency: '',
      callWeek: '',
      deliveryWeek: '',
      distributionCenter: '',
      transitCallPlace: '',
      notes: '',
      mondayCall: false,
      tuesdayCall: false,
      wednesdayCall: false,
      thursdayCall: false,
      fridayCall: false,
      saturdayCall: false,
      sundayCall: false,
      mondayDropdown: -1,
      tuesdayDropdown: -1,
      wednesdayDropdown: -1,
      thursdayDropdown: -1,
      fridayDropdown: -1,
      saturdayDropdown: -1,
      sundayDropdown: -1,
    })
  }

  // Resetting error messages
  const resetErrorMessages = () => {
    setErrorMessages({
      season: '',
      callFrequency: '',
      callWeek: '',
      deliveryWeek: '',
      distributionCenter: '',
      transitCallPlace: '',
      notes: '',
      mondayDropdown: '',
      tuesdayDropdown: '',
      wednesdayDropdown: '',
      thursdayDropdown: '',
      fridayDropdown: '',
      saturdayDropdown: '',
      sundayDropdown: '',

      openingMondayMorningFrom: '',
      openingMondayMorningTo: '',
      openingMondayAfternoonFrom: '',
      openingMondayAfternoonTo: '',

      openingTuesdayMorningFrom: '',
      openingTuesdayMorningTo: '',
      openingTuesdayAfternoonFrom: '',
      openingTuesdayAfternoonTo: '',

      openingWednesdayMorningFrom: '',
      openingWednesdayMorningTo: '',
      openingWednesdayAfternoonFrom: '',
      openingWednesdayAfternoonTo: '',

      openingThursdayMorningFrom: '',
      openingThursdayMorningTo: '',
      openingThursdayAfternoonFrom: '',
      openingThursdayAfternoonTo: '',

      openingFridayMorningFrom: '',
      openingFridayMorningTo: '',
      openingFridayAfternoonFrom: '',
      openingFridayAfternoonTo: '',

      openingSaturdayMorningFrom: '',
      openingSaturdayMorningTo: '',
      openingSaturdayAfternoonFrom: '',
      openingSaturdayAfternoonTo: '',

      openingSundayMorningFrom: '',
      openingSundayMorningTo: '',
      openingSundayAfternoonFrom: '',
      openingSundayAfternoonTo: '',

      visitingMondayMorningFrom: '',
      visitingMondayMorningTo: '',
      visitingMondayAfternoonFrom: '',
      visitingMondayAfternoonTo: '',

      visitingTuesdayMorningFrom: '',
      visitingTuesdayMorningTo: '',
      visitingTuesdayAfternoonFrom: '',
      visitingTuesdayAfternoonTo: '',

      visitingWednesdayMorningFrom: '',
      visitingWednesdayMorningTo: '',
      visitingWednesdayAfternoonFrom: '',
      visitingWednesdayAfternoonTo: '',

      visitingThursdayMorningFrom: '',
      visitingThursdayMorningTo: '',
      visitingThursdayAfternoonFrom: '',
      visitingThursdayAfternoonTo: '',

      visitingFridayMorningFrom: '',
      visitingFridayMorningTo: '',
      visitingFridayAfternoonFrom: '',
      visitingFridayAfternoonTo: '',

      visitingSaturdayMorningFrom: '',
      visitingSaturdayMorningTo: '',
      visitingSaturdayAfternoonFrom: '',
      visitingSaturdayAfternoonTo: '',

      visitingSundayMorningFrom: '',
      visitingSundayMorningTo: '',
      visitingSundayAfternoonFrom: '',
      visitingSundayAfternoonTo: '',
    })
  }

  // Formatting and setting input data of prospect/customer after fetching from query
  const formatAndSetData = (dataObj: any) => {
    const inputObj = {
      season: '',
      callFrequency: '',
      callWeek: '',
      deliveryWeek: '',
      distributionCenter: '',
      transitCallPlace: '',
      notes: '',
      mondayCall: false,
      tuesdayCall: false,
      wednesdayCall: false,
      thursdayCall: false,
      fridayCall: false,
      saturdayCall: false,
      sundayCall: false,
      mondayDropdown: -1,
      tuesdayDropdown: -1,
      wednesdayDropdown: -1,
      thursdayDropdown: -1,
      fridayDropdown: -1,
      saturdayDropdown: -1,
      sundayDropdown: -1,
    }

    if (dataObj?.callCalendarId) {
      setSeasonDropdownData((prevData: any) => {
        prevData.forEach((data: any) => {
          const filteredData = data.data.find((item: any) => item.label === dataObj.callCalendarId.trim())
          if (filteredData) {
            inputObj.season = data.season
            inputObj.callFrequency = filteredData.label
          }
        })
        return prevData
      })
    }

    if (dataObj?.callPlaceNumber) {
      const isTransitCallPlaceExist = containsObject(transitCallPlaceDropdownData, dataObj.callPlaceNumber.trim())
      if (!isTransitCallPlaceExist) {
        setTransitCallPlaceDropdownData((prevData: any) => (
          [...prevData,
          {
            callPlaceName: dataObj?.callPlaceName || '',
            callPlaceNumber: dataObj.callPlaceNumber.trim(),
          }]
        ))
      }
      inputObj.transitCallPlace = dataObj.callPlaceNumber.trim()
    }

    inputObj.distributionCenter = dataObj?.distributionCentre ? dataObj?.distributionCentre.trim() : ''
    inputObj.notes = dataObj.deliveryComments ? dataObj.deliveryComments.trim() : ''
    inputObj.callWeek = dataObj?.callWeek ? dataObj?.callWeek : ''
    inputObj.deliveryWeek = dataObj?.deliveryWeek ? dataObj?.deliveryWeek : ''
    inputObj.mondayCall = dataObj.mondayCall
    inputObj.tuesdayCall = dataObj.tuesdayCall
    inputObj.wednesdayCall = dataObj.wednesdayCall
    inputObj.thursdayCall = dataObj.thursdayCall
    inputObj.fridayCall = dataObj.fridayCall
    inputObj.saturdayCall = dataObj.saturdayCall
    inputObj.sundayCall = dataObj.sundayCall
    inputObj.mondayDropdown = dataObj.mondayDropdown
    inputObj.tuesdayDropdown = dataObj.tuesdayDropdown
    inputObj.wednesdayDropdown = dataObj.wednesdayDropdown
    inputObj.thursdayDropdown = dataObj.thursdayDropdown
    inputObj.fridayDropdown = dataObj.fridayDropdown
    inputObj.saturdayDropdown = dataObj.saturdayDropdown
    inputObj.sundayDropdown = dataObj.sundayDropdown

    setInputFields((prevData: any) => ({
      ...prevData,
      ...inputObj
    }))
  }

  // Fetching prospect opening and visiting hours data
  const getProspectOpeningAndVisitingHours = async () => {
    try {
      const openingAndVisitingHoursData: any = await PLRCAController.getOpeningAndVisitingHoursData();

      if (Object.keys(openingAndVisitingHoursData).length === 0) {
        resetOpeningHours()
        resetVisitingHours()
        return
      }

      if (openingAndVisitingHoursData?.openingHours && Object.keys(openingAndVisitingHoursData?.openingHours).length > 0) {
        setOpeningHours(openingAndVisitingHoursData?.openingHours)
      } else {
        resetOpeningHours()
      }

      if (openingAndVisitingHoursData?.visitingHours && Object.keys(openingAndVisitingHoursData?.visitingHours).length > 0) {
        setVisitingHours(openingAndVisitingHoursData?.visitingHours)
      } else {
        resetVisitingHours()
      }

    } catch (error) {
      console.log('error while fetching opening and visiting hours of prospect :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      resetOpeningHours()
      resetVisitingHours()
    }
  }

  // Fetching prospect call and delivery data
  const getProspectCallAndDeliveryData = async () => {
    try {
      const prospectCallAndDeliveryData = await PLRCAController.getProspectRCAData();

      if (prospectCallAndDeliveryData.length === 0) {
        resetInputFields()
        return
      }

      const prospectCallAndDeliveryDataObj = prospectCallAndDeliveryData[0]
      console.log("prospectCallAndDeliveryDataObj :>> ", prospectCallAndDeliveryDataObj)

      formatAndSetData(prospectCallAndDeliveryDataObj)

    } catch (error) {
      console.log('error while fetching prospect call and delivery data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      resetInputFields()
    }
  }

  // Showing error when call frequency is focused and season is not selected
  const onCallFrequencyFocus = () => {
    if (inputFields.season === '') {
      setErrorMessages({
        ...errorMessages,
        season: 'Select season first'
      })
    }
  }

  // Handling input change for call and delivery day tab
  const handleInputChange = (fieldName: string) => (value: any) => {
    if (fieldName === 'season') {
      setInputFields((prevData: any) => ({
        ...prevData,
        [fieldName]: value.season,
        callFrequency: '',
      }));
    }
    else if (fieldName === 'callFrequency' || fieldName === 'callWeek' || fieldName === 'deliveryWeek' || deliveryDayFields.includes(fieldName)) {
      setInputFields((prevData: any) => ({
        ...prevData,
        [fieldName]: value.value,
      }));
    }
    else if (fieldName === 'distributionCenter') {
      setInputFields((prevData: any) => ({
        ...prevData,
        [fieldName]: value.rdcNumber,
      }));
    }
    else if (fieldName === 'transitCallPlace') {
      setInputFields((prevData: any) => ({
        ...prevData,
        [fieldName]: value.callPlaceNumber,
      }));
    }
    else if (callDayFields.includes(fieldName)) {
      setInputFields((prevData: any) => ({
        ...prevData,
        [fieldName]: !prevData[fieldName],
      }));

      const callDayIndex = callDayFields.findIndex((day: string) => day === fieldName)

      setMandatoryData((prevData: any) => ({
        ...prevData,
        [deliveryMandatoryFields[callDayIndex]]: !prevData[fieldName] ? 1 : 0,
      }))

    }
    else {
      setInputFields((prevData: any) => ({
        ...prevData,
        [fieldName]: value,
      }));
    }

    setErrorMessages((prevData: any) => ({
      ...prevData,
      [fieldName]: '',
    }));

    if (isSaveDisabled) {
      setIsSaveDisabled(false)
    }
  };

  // Handling input change for opening and visiting hours tab
  const handleOpeningAndVisitingHours = (fieldName: string) => (value: any, hoursType: string) => {
    if (hoursType === 'Opening') {
      setOpeningHours((prevData: any) => ({ ...prevData, [fieldName]: value }));
      if (value !== '-1') {
        formatAndSetHoursKey('opening', fieldName, '')
      }
    } else {
      setVisitingHours((prevData: any) => ({ ...prevData, [fieldName]: value }));
      if (value !== '-1') {
        formatAndSetHoursKey('visiting', fieldName, '')
      }
    }

    if (isSaveDisabled) {
      setIsSaveDisabled(false)
    }
  }

  // Changing the tab
  const handleRCASelectedValue = (data: string) => {
    setActiveTab(data);
  };

  // Opening the modal if form is dirty and user clicks on cancel button else showing toast
  const handleCancelModal = async () => {
    setIsCancelModalVisible(!isCancelModalVisible);
  };

  // Discarding the data and resetting the form
  const handleDiscard = async () => {
    try {
      setIsCancelModalVisible(false);
      setFormLoading(true);
      await prePopulateProspectData();
      await ACLService.saveAclGuardStatusToStorage(false);
      resetErrorMessages()
      setIsSaveDisabled(true)
    } catch (error) {
      console.log('error while discarding data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
      await ACLService.saveAclGuardStatusToStorage(true);
    } finally {
      setFormLoading(false);
    }
  };

  // Formatting hours key based on hours name. Eg: opening, mondayMorningFrom, ''(data to set) -> set data in openingMondayMorningFrom
  const formatAndSetHoursKey = (hoursName: string, key: string, message: string = 'Mandatory') => {
    const keyName = hoursName + key.charAt(0).toUpperCase() + key.slice(1)
    setErrorMessages((prevData: any) => ({
      ...prevData,
      [keyName]: message,
    }))
  }

  // Validating opening and visiting hours data
  const validateHours = (hours: any, hoursName: string) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let isNotFilled = false;

    for (const day of days) {
      const morningFrom = `${day}MorningFrom`;
      const morningTo = `${day}MorningTo`;
      const afternoonFrom = `${day}AfternoonFrom`;
      const afternoonTo = `${day}AfternoonTo`;

      const isMorningFromEmpty = hours[morningFrom] === '' || hours[morningFrom] === '-1';
      const isMorningToEmpty = hours[morningTo] === '' || hours[morningTo] === '-1';
      const isAfternoonFromEmpty = hours[afternoonFrom] === '' || hours[afternoonFrom] === '-1';
      const isAfternoonToEmpty = hours[afternoonTo] === '' || hours[afternoonTo] === '-1';

      if ((hours[morningFrom] && hours[morningFrom] !== '-1') || (hours[morningTo] && hours[morningTo] !== '-1') || (hours[afternoonFrom] && hours[afternoonFrom] !== '-1') || (hours[afternoonTo] && hours[afternoonTo] !== '-1')) {
        if (isMorningFromEmpty) {
          formatAndSetHoursKey(hoursName, morningFrom);
          isNotFilled = true;
        }
        if (isMorningToEmpty) {
          formatAndSetHoursKey(hoursName, morningTo);
          isNotFilled = true;
        }
        if (isAfternoonFromEmpty) {
          formatAndSetHoursKey(hoursName, afternoonFrom);
          isNotFilled = true;
        }
        if (isAfternoonToEmpty) {
          formatAndSetHoursKey(hoursName, afternoonTo);
          isNotFilled = true;
        }

        if (!isMorningFromEmpty && !isMorningToEmpty && !isAfternoonFromEmpty && !isAfternoonToEmpty) {
          const morningFromNumeric = Number(hours[morningFrom])
          const morningToNumeric = Number(hours[morningTo])
          const afternoonFromNumeric = Number(hours[afternoonFrom])
          const afternoonToNumeric = Number(hours[afternoonTo])

          if ((afternoonFromNumeric >= morningFromNumeric) && (afternoonFromNumeric <= morningToNumeric) || (afternoonToNumeric >= morningFromNumeric) && (afternoonToNumeric <= morningToNumeric)) {
            formatAndSetHoursKey(hoursName, afternoonFrom, "Time Overlapping");
            isNotFilled = true;
          }

          if ((morningFromNumeric >= afternoonFromNumeric) && (morningFromNumeric <= afternoonToNumeric) || (morningToNumeric >= afternoonFromNumeric) && (morningToNumeric <= afternoonToNumeric)) {
            formatAndSetHoursKey(hoursName, morningFrom, "Time Overlapping");
            isNotFilled = true;
          }

          if (morningFromNumeric >= morningToNumeric) {
            formatAndSetHoursKey(hoursName, morningFrom, `Invalid ${hoursName} hours`);
            isNotFilled = true;
          }

          if (afternoonFromNumeric >= afternoonToNumeric) {
            formatAndSetHoursKey(hoursName, afternoonFrom, `Invalid ${hoursName} hours`);
            isNotFilled = true;
          }
        }
      }
    }

    return isNotFilled;
  };

  // Validating all the input fields
  const validateInputs = () => {
    resetErrorMessages();

    let isError = false;

    [visitingHours, openingHours].forEach((hours: any, index: number) => {
      const isNotFilled = validateHours(hours, index === 0 ? 'visiting' : 'opening')
      if (isNotFilled) {
        isError = true
      }
    })

    if (
      mandatoryData.season && inputFields.season.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        season: 'Mandatory',
      }));
      isError = true;
    }

    if (mandatoryData.callFrequency && inputFields.callFrequency.trim() === '') {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        callFrequency: 'Mandatory',
      }));
      isError = true;
    }
    if (
      mandatoryData.callWeek &&
      inputFields.callWeek.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        callWeek: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.deliveryWeek &&
      inputFields.deliveryWeek.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        deliveryWeek: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.distributionCenter &&
      inputFields.distributionCenter.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        distributionCenter: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.transitCallPlace &&
      inputFields.transitCallPlace.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        transitCallPlace: 'Mandatory',
      }));
      isError = true;
    }
    if (
      mandatoryData.notes &&
      inputFields.notes.trim() === ''
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        notes: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.deliveryDayMonday &&
      inputFields.mondayDropdown < 0
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        mondayDropdown: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.deliveryDayTuesday &&
      inputFields.tuesdayDropdown < 0
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        tuesdayDropdown: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.deliveryDayWednesday &&
      inputFields.wednesdayDropdown < 0
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        wednesdayDropdown: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.deliveryDayThursday &&
      inputFields.thursdayDropdown < 0
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        thursdayDropdown: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.deliveryDayFriday &&
      inputFields.fridayDropdown < 0
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        fridayDropdown: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.deliveryDaySaturday &&
      inputFields.saturdayDropdown < 0
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        saturdayDropdown: 'Mandatory',
      }));
      isError = true;
    }

    if (
      mandatoryData.deliveryDaySunday &&
      inputFields.sundayDropdown < 0
    ) {
      setErrorMessages((prevData: any) => ({
        ...prevData,
        sundayDropdown: 'Mandatory',
      }));
      isError = true;
    }

    return !isError;
  };

  // Saving the data if there are any changes else showing the toast message
  const handleSave = async () => {
    try {
      if (!validateInputs()) {
        toast.error({
          message: "Please enter all the mandatory fields in all the tabs."
        })
        return;
      }

      const isUpdated = await PLRCAController.insertOrUpdateProspectRCAData(inputFields, openingHours, visitingHours, weekDropdownData);

      if (isUpdated) {
        await ACLService.saveAclGuardStatusToStorage(false);
        setIsSaveDisabled(true)
        toast.success({
          message: "Data saved successfully"
        })
      } else {
        toast.error({
          message: "Something went wrong"
        })
      }

    } catch (error) {
      console.log('error while saving the data :>> ', error);
      toast.error({
        message: "Something went wrong"
      })
    }
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <ProspectLandingHeader screen="PLRCA"
        fromPLP={true}
      />
      <View flex row>
        <PLLeftMenuComponent activeTab={PROSPECT_LANDING_SCREENS.RCA} />
        {screenLoading ? (
          <CustomerLandingLoader />
        ) : (
          <Card flex-1 marginB-v2 marginR-v2 padding-v4>
            <View row centerV spread>
              <PLRCATopTabComponent
                handleChangeTab={handleRCASelectedValue}
                RCASelectedValue={activeTab}
              />
              {isEditable && <View row centerV>
                <TouchableOpacity
                  onPress={handleCancelModal}
                  style={tw('p-2 rounded-md')}
                  disabled={isSaveDisabled}
                >
                  <Text
                    text13R
                    style={tw(isSaveDisabled ? 'text-light-grey1' : 'text-light-textBlack')}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  style={tw(`${isSaveDisabled ? 'bg-light-white1' : 'bg-light-darkBlue'} py-2 px-36px rounded-md ml-6`)}
                  disabled={isSaveDisabled}
                >
                  <Text
                    text13R
                    style={tw(
                      `${isSaveDisabled ? 'text-light-grey1' : 'text-light-white'}`,
                    )}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>}
            </View>
            {formLoading ?
              <View flex center>
                <ActivityIndicator
                  color={ColourPalette.light.darkBlue}
                  size="large"
                />
              </View>
              : <ScrollView style={tw('mt-6')}>
                {activeTab === RCA_TYPES[0].title ? (
                  <OpeningVisitingComponent {...{
                    openingHours,
                    visitingHours,
                    handleOpeningAndVisitingHours,
                    setOpeningHours,
                    setVisitingHours,
                    isEditable,
                    errorMessages,
                    isSaveDisabled,
                    setIsSaveDisabled,
                  }} />
                ) : (
                  <VisitCallDeliveryPlanComponent {...{
                    inputFields,
                    errorMessages,
                    seasonDropdownData,
                    callFrequencyDropdownData,
                    distributionCenterDropdownData,
                    transitCallPlaceDropdownData,
                    weekDropdownData,
                    handleInputChange,
                    getTransitCallPlaceDropdownData,
                    onCallFrequencyFocus,
                    callDayDisabled,
                    isEditable,
                    mandatoryData,
                    callAndDeliveryWeekDropdownData,
                  }} />
                )}
              </ScrollView>}
          </Card>)}
        <MessageModal
          isVisible={isCancelModalVisible}
          title="Discard the Changes?"
          subTitle="Your unsaved edits will be lost"
          primaryButtonText="Yes, Discard"
          secondaryButtonText="No, Keep the changes"
          handleOnPressSuccess={handleDiscard}
          handleOnPressCancel={handleCancelModal}
        />
      </View>
    </SafeAreaView>
  );
};

export default withAuthScreen(PLRCA, true);
