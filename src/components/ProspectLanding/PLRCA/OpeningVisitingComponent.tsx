import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { useState } from 'react';
import OpeningVisitingDayComponent from 'src/components/ProspectLanding/PLRCA/OpeningVisitingDayComponent';
import RepeatTimingModal from './RepeatTimingModal';

interface OpeningVisitingComponentProps {
  openingHours: any;
  visitingHours: any;
  handleOpeningAndVisitingHours: any;
  setOpeningHours: any;
  setVisitingHours: any;
  isEditable: boolean;
  errorMessages: any;
  isSaveDisabled: boolean;
  setIsSaveDisabled: any;
}

const OpeningVisitingComponent = (props: OpeningVisitingComponentProps) => {
  const { openingHours, visitingHours, handleOpeningAndVisitingHours, setOpeningHours, setVisitingHours, isEditable, errorMessages, isSaveDisabled, setIsSaveDisabled } = props;

  const [isRepeatModalVisible, setIsRepeatModalVisible] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [currentHourType, setCurrentHourType] = useState('');


  const handleOnPressOk = (
    currentDay: string,
    currentHourType: string,
    days: any,
  ) => {
    const chosenDay = currentDay.toLowerCase();

    const filteredDays = Object.entries(days).filter(([_, value]) => value);
    const selectedDays = Object.fromEntries(filteredDays);

    const newObj: any = {}

    if (currentHourType === 'Opening') {
      Object.keys(selectedDays).forEach((key) => {
        newObj[`${key}MorningFrom`] = openingHours[`${chosenDay}MorningFrom`]
        newObj[`${key}MorningTo`] = openingHours[`${chosenDay}MorningTo`]
        newObj[`${key}AfternoonFrom`] = openingHours[`${chosenDay}AfternoonFrom`]
        newObj[`${key}AfternoonTo`] = openingHours[`${chosenDay}AfternoonTo`]
      })

      setOpeningHours((prevData: any) => ({
        ...prevData,
        ...newObj
      }))
    } else {
      Object.keys(selectedDays).forEach((key) => {
        newObj[`${key}MorningFrom`] = visitingHours[`${chosenDay}MorningFrom`]
        newObj[`${key}MorningTo`] = visitingHours[`${chosenDay}MorningTo`]
        newObj[`${key}AfternoonFrom`] = visitingHours[`${chosenDay}AfternoonFrom`]
        newObj[`${key}AfternoonTo`] = visitingHours[`${chosenDay}AfternoonTo`]
      })

      setVisitingHours((prevData: any) => ({
        ...prevData,
        ...newObj
      }))
    }

    setIsRepeatModalVisible(false);
    if (isSaveDisabled) {
      setIsSaveDisabled(false)
    }
  };

  const handleOnPressCancel = () => {
    setIsRepeatModalVisible(false);
  };

  const handleOnRepeatClick = (day: string, hourType: string) => {
    setIsRepeatModalVisible(true);
    setCurrentDay(day);
    setCurrentHourType(hourType);
  };

  const handleMondayMorningFrom = handleOpeningAndVisitingHours('mondayMorningFrom')

  const handleMondayMorningTo = handleOpeningAndVisitingHours('mondayMorningTo')

  const handleMondayAfternoonFrom = handleOpeningAndVisitingHours('mondayAfternoonFrom')

  const handleMondayAfternoonTo = handleOpeningAndVisitingHours('mondayAfternoonTo')

  const handleTuesdayMorningFrom = handleOpeningAndVisitingHours('tuesdayMorningFrom')

  const handleTuesdayMorningTo = handleOpeningAndVisitingHours('tuesdayMorningTo')

  const handleTuesdayAfternoonFrom = handleOpeningAndVisitingHours('tuesdayAfternoonFrom')

  const handleTuesdayAfternoonTo = handleOpeningAndVisitingHours('tuesdayAfternoonTo')

  const handleWednesdayMorningFrom = handleOpeningAndVisitingHours('wednesdayMorningFrom')

  const handleWednesdayMorningTo = handleOpeningAndVisitingHours('wednesdayMorningTo')

  const handleWednesdayAfternoonFrom = handleOpeningAndVisitingHours('wednesdayAfternoonFrom')

  const handleWednesdayAfternoonTo = handleOpeningAndVisitingHours('wednesdayAfternoonTo')

  const handleThursdayMorningFrom = handleOpeningAndVisitingHours('thursdayMorningFrom')

  const handleThursdayMorningTo = handleOpeningAndVisitingHours('thursdayMorningTo')

  const handleThursdayAfternoonFrom = handleOpeningAndVisitingHours('thursdayAfternoonFrom')

  const handleThursdayAfternoonTo = handleOpeningAndVisitingHours('thursdayAfternoonTo')

  const handleFridayMorningFrom = handleOpeningAndVisitingHours('fridayMorningFrom')

  const handleFridayMorningTo = handleOpeningAndVisitingHours('fridayMorningTo')

  const handleFridayAfternoonFrom = handleOpeningAndVisitingHours('fridayAfternoonFrom')

  const handleFridayAfternoonTo = handleOpeningAndVisitingHours('fridayAfternoonTo')

  const handleSaturdayMorningFrom = handleOpeningAndVisitingHours('saturdayMorningFrom')

  const handleSaturdayMorningTo = handleOpeningAndVisitingHours('saturdayMorningTo')

  const handleSaturdayAfternoonFrom = handleOpeningAndVisitingHours('saturdayAfternoonFrom')

  const handleSaturdayAfternoonTo = handleOpeningAndVisitingHours('saturdayAfternoonTo')

  const handleSundayMorningFrom = handleOpeningAndVisitingHours('sundayMorningFrom')

  const handleSundayMorningTo = handleOpeningAndVisitingHours('sundayMorningTo')

  const handleSundayAfternoonFrom = handleOpeningAndVisitingHours('sundayAfternoonFrom')

  const handleSundayAfternoonTo = handleOpeningAndVisitingHours('sundayAfternoonTo')

  const handleOnResetClick = (day: string, hoursType: string) => {
    if (hoursType === 'opening') {
      setOpeningHours((prevData: any) => ({
        ...prevData,
        [`${day.toLowerCase()}MorningFrom`]: '',
        [`${day.toLowerCase()}MorningTo`]: '',
        [`${day.toLowerCase()}AfternoonFrom`]: '',
        [`${day.toLowerCase()}AfternoonTo`]: '',
      }))
    } else {
      setVisitingHours((prevData: any) => ({
        ...prevData,
        [`${day.toLowerCase()}MorningFrom`]: '',
        [`${day.toLowerCase()}MorningTo`]: '',
        [`${day.toLowerCase()}AfternoonFrom`]: '',
        [`${day.toLowerCase()}AfternoonTo`]: '',
      }))
    }

    if (isSaveDisabled) {
      setIsSaveDisabled(false)
    }
  }

  return (
    <View row>
      <View flex>
        <Text text18M textBlack marginB-v2>
          Opening Hours
        </Text>
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Monday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Opening')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'opening')}
          morningFrom={openingHours.mondayMorningFrom}
          morningFromError={errorMessages.openingMondayMorningFrom}
          morningTo={openingHours.mondayMorningTo}
          morningToError={errorMessages.openingMondayMorningTo}
          afternoonFrom={openingHours.mondayAfternoonFrom}
          afternoonFromError={errorMessages.openingMondayAfternoonFrom}
          afternoonTo={openingHours.mondayAfternoonTo}
          afternoonToError={errorMessages.openingMondayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleMondayMorningFrom(item.value, 'Opening')
          }
          handleMorningTo={(item: any) =>
            handleMondayMorningTo(item.value, 'Opening')
          }
          handleAfternoonFrom={(item: any) =>
            handleMondayAfternoonFrom(item.value, 'Opening')
          }
          handleAfternoonTo={(item: any) =>
            handleMondayAfternoonTo(item.value, 'Opening')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Tuesday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Opening')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'opening')}
          morningFrom={openingHours.tuesdayMorningFrom}
          morningFromError={errorMessages.openingTuesdayMorningFrom}
          morningTo={openingHours.tuesdayMorningTo}
          morningToError={errorMessages.openingTuesdayMorningTo}
          afternoonFrom={openingHours.tuesdayAfternoonFrom}
          afternoonFromError={errorMessages.openingTuesdayAfternoonFrom}
          afternoonTo={openingHours.tuesdayAfternoonTo}
          afternoonToError={errorMessages.openingTuesdayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleTuesdayMorningFrom(item.value, 'Opening')
          }
          handleMorningTo={(item: any) =>
            handleTuesdayMorningTo(item.value, 'Opening')
          }
          handleAfternoonFrom={(item: any) =>
            handleTuesdayAfternoonFrom(item.value, 'Opening')
          }
          handleAfternoonTo={(item: any) =>
            handleTuesdayAfternoonTo(item.value, 'Opening')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Wednesday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Opening')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'opening')}
          morningFrom={openingHours.wednesdayMorningFrom}
          morningFromError={errorMessages.openingWednesdayMorningFrom}
          morningTo={openingHours.wednesdayMorningTo}
          morningToError={errorMessages.openingWednesdayMorningTo}
          afternoonFrom={openingHours.wednesdayAfternoonFrom}
          afternoonFromError={errorMessages.openingWednesdayAfternoonFrom}
          afternoonTo={openingHours.wednesdayAfternoonTo}
          afternoonToError={errorMessages.openingWednesdayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleWednesdayMorningFrom(item.value, 'Opening')
          }
          handleMorningTo={(item: any) =>
            handleWednesdayMorningTo(item.value, 'Opening')
          }
          handleAfternoonFrom={(item: any) =>
            handleWednesdayAfternoonFrom(item.value, 'Opening')
          }
          handleAfternoonTo={(item: any) =>
            handleWednesdayAfternoonTo(item.value, 'Opening')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Thursday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Opening')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'opening')}
          morningFrom={openingHours.thursdayMorningFrom}
          morningFromError={errorMessages.openingThursdayMorningFrom}
          morningTo={openingHours.thursdayMorningTo}
          morningToError={errorMessages.openingThursdayMorningTo}
          afternoonFrom={openingHours.thursdayAfternoonFrom}
          afternoonFromError={errorMessages.openingThursdayAfternoonFrom}
          afternoonTo={openingHours.thursdayAfternoonTo}
          afternoonToError={errorMessages.openingThursdayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleThursdayMorningFrom(item.value, 'Opening')
          }
          handleMorningTo={(item: any) =>
            handleThursdayMorningTo(item.value, 'Opening')
          }
          handleAfternoonFrom={(item: any) =>
            handleThursdayAfternoonFrom(item.value, 'Opening')
          }
          handleAfternoonTo={(item: any) =>
            handleThursdayAfternoonTo(item.value, 'Opening')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Friday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Opening')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'opening')}
          morningFrom={openingHours.fridayMorningFrom}
          morningFromError={errorMessages.openingFridayMorningFrom}
          morningTo={openingHours.fridayMorningTo}
          morningToError={errorMessages.openingFridayMorningTo}
          afternoonFrom={openingHours.fridayAfternoonFrom}
          afternoonFromError={errorMessages.openingFridayAfternoonFrom}
          afternoonTo={openingHours.fridayAfternoonTo}
          afternoonToError={errorMessages.openingFridayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleFridayMorningFrom(item.value, 'Opening')
          }
          handleMorningTo={(item: any) =>
            handleFridayMorningTo(item.value, 'Opening')
          }
          handleAfternoonFrom={(item: any) =>
            handleFridayAfternoonFrom(item.value, 'Opening')
          }
          handleAfternoonTo={(item: any) =>
            handleFridayAfternoonTo(item.value, 'Opening')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Saturday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Opening')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'opening')}
          morningFrom={openingHours.saturdayMorningFrom}
          morningFromError={errorMessages.openingSaturdayMorningFrom}
          morningTo={openingHours.saturdayMorningTo}
          morningToError={errorMessages.openingSaturdayMorningTo}
          afternoonFrom={openingHours.saturdayAfternoonFrom}
          afternoonFromError={errorMessages.openingSaturdayAfternoonFrom}
          afternoonTo={openingHours.saturdayAfternoonTo}
          afternoonToError={errorMessages.openingSaturdayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleSaturdayMorningFrom(item.value, 'Opening')
          }
          handleMorningTo={(item: any) =>
            handleSaturdayMorningTo(item.value, 'Opening')
          }
          handleAfternoonFrom={(item: any) =>
            handleSaturdayAfternoonFrom(item.value, 'Opening')
          }
          handleAfternoonTo={(item: any) =>
            handleSaturdayAfternoonTo(item.value, 'Opening')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Sunday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Opening')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'opening')}
          morningFrom={openingHours.sundayMorningFrom}
          morningFromError={errorMessages.openingSundayMorningFrom}
          morningTo={openingHours.sundayMorningTo}
          morningToError={errorMessages.openingSundayMorningTo}
          afternoonFrom={openingHours.sundayAfternoonFrom}
          afternoonFromError={errorMessages.openingSundayAfternoonFrom}
          afternoonTo={openingHours.sundayAfternoonTo}
          afternoonToError={errorMessages.openingSundayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleSundayMorningFrom(item.value, 'Opening')
          }
          handleMorningTo={(item: any) =>
            handleSundayMorningTo(item.value, 'Opening')
          }
          handleAfternoonFrom={(item: any) =>
            handleSundayAfternoonFrom(item.value, 'Opening')
          }
          handleAfternoonTo={(item: any) =>
            handleSundayAfternoonTo(item.value, 'Opening')
          }
        />
      </View>
      <View flex marginL-v11>
        <Text text18M textBlack marginB-v2>
          Visiting Hours
        </Text>
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Monday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Visiting')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'visiting')}
          morningFrom={visitingHours.mondayMorningFrom}
          morningFromError={errorMessages.visitingMondayMorningFrom}
          morningTo={visitingHours.mondayMorningTo}
          morningToError={errorMessages.visitingMondayMorningTo}
          afternoonFrom={visitingHours.mondayAfternoonFrom}
          afternoonFromError={errorMessages.visitingMondayAfternoonFrom}
          afternoonTo={visitingHours.mondayAfternoonTo}
          afternoonToError={errorMessages.visitingMondayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleMondayMorningFrom(item.value, 'Visiting')
          }
          handleMorningTo={(item: any) =>
            handleMondayMorningTo(item.value, 'Visiting')
          }
          handleAfternoonFrom={(item: any) =>
            handleMondayAfternoonFrom(item.value, 'Visiting')
          }
          handleAfternoonTo={(item: any) =>
            handleMondayAfternoonTo(item.value, 'Visiting')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Tuesday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Visiting')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'visiting')}
          morningFrom={visitingHours.tuesdayMorningFrom}
          morningFromError={errorMessages.visitingTuesdayMorningFrom}
          morningTo={visitingHours.tuesdayMorningTo}
          morningToError={errorMessages.visitingTuesdayMorningTo}
          afternoonFrom={visitingHours.tuesdayAfternoonFrom}
          afternoonFromError={errorMessages.visitingTuesdayAfternoonFrom}
          afternoonTo={visitingHours.tuesdayAfternoonTo}
          afternoonToError={errorMessages.visitingTuesdayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleTuesdayMorningFrom(item.value, 'Visiting')
          }
          handleMorningTo={(item: any) =>
            handleTuesdayMorningTo(item.value, 'Visiting')
          }
          handleAfternoonFrom={(item: any) =>
            handleTuesdayAfternoonFrom(item.value, 'Visiting')
          }
          handleAfternoonTo={(item: any) =>
            handleTuesdayAfternoonTo(item.value, 'Visiting')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Wednesday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Visiting')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'visiting')}
          morningFrom={visitingHours.wednesdayMorningFrom}
          morningFromError={errorMessages.visitingWednesdayMorningFrom}
          morningTo={visitingHours.wednesdayMorningTo}
          morningToError={errorMessages.visitingWednesdayMorningTo}
          afternoonFrom={visitingHours.wednesdayAfternoonFrom}
          afternoonFromError={errorMessages.visitingWednesdayAfternoonFrom}
          afternoonTo={visitingHours.wednesdayAfternoonTo}
          afternoonToError={errorMessages.visitingWednesdayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleWednesdayMorningFrom(item.value, 'Visiting')
          }
          handleMorningTo={(item: any) =>
            handleWednesdayMorningTo(item.value, 'Visiting')
          }
          handleAfternoonFrom={(item: any) =>
            handleWednesdayAfternoonFrom(item.value, 'Visiting')
          }
          handleAfternoonTo={(item: any) =>
            handleWednesdayAfternoonTo(item.value, 'Visiting')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Thursday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Visiting')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'visiting')}
          morningFrom={visitingHours.thursdayMorningFrom}
          morningFromError={errorMessages.visitingThursdayMorningFrom}
          morningTo={visitingHours.thursdayMorningTo}
          morningToError={errorMessages.visitingThursdayMorningTo}
          afternoonFrom={visitingHours.thursdayAfternoonFrom}
          afternoonFromError={errorMessages.visitingThursdayAfternoonFrom}
          afternoonTo={visitingHours.thursdayAfternoonTo}
          afternoonToError={errorMessages.visitingThursdayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleThursdayMorningFrom(item.value, 'Visiting')
          }
          handleMorningTo={(item: any) =>
            handleThursdayMorningTo(item.value, 'Visiting')
          }
          handleAfternoonFrom={(item: any) =>
            handleThursdayAfternoonFrom(item.value, 'Visiting')
          }
          handleAfternoonTo={(item: any) =>
            handleThursdayAfternoonTo(item.value, 'Visiting')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Friday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Visiting')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'visiting')}
          morningFrom={visitingHours.fridayMorningFrom}
          morningFromError={errorMessages.visitingFridayMorningFrom}
          morningTo={visitingHours.fridayMorningTo}
          morningToError={errorMessages.visitingFridayMorningTo}
          afternoonFrom={visitingHours.fridayAfternoonFrom}
          afternoonFromError={errorMessages.visitingFridayAfternoonFrom}
          afternoonTo={visitingHours.fridayAfternoonTo}
          afternoonToError={errorMessages.visitingFridayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleFridayMorningFrom(item.value, 'Visiting')
          }
          handleMorningTo={(item: any) =>
            handleFridayMorningTo(item.value, 'Visiting')
          }
          handleAfternoonFrom={(item: any) =>
            handleFridayAfternoonFrom(item.value, 'Visiting')
          }
          handleAfternoonTo={(item: any) =>
            handleFridayAfternoonTo(item.value, 'Visiting')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Saturday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Visiting')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'visiting')}
          morningFrom={visitingHours.saturdayMorningFrom}
          morningFromError={errorMessages.visitingSaturdayMorningFrom}
          morningTo={visitingHours.saturdayMorningTo}
          morningToError={errorMessages.visitingSaturdayMorningTo}
          afternoonFrom={visitingHours.saturdayAfternoonFrom}
          afternoonFromError={errorMessages.visitingSaturdayAfternoonFrom}
          afternoonTo={visitingHours.saturdayAfternoonTo}
          afternoonToError={errorMessages.visitingSaturdayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleSaturdayMorningFrom(item.value, 'Visiting')
          }
          handleMorningTo={(item: any) =>
            handleSaturdayMorningTo(item.value, 'Visiting')
          }
          handleAfternoonFrom={(item: any) =>
            handleSaturdayAfternoonFrom(item.value, 'Visiting')
          }
          handleAfternoonTo={(item: any) =>
            handleSaturdayAfternoonTo(item.value, 'Visiting')
          }
        />
        <OpeningVisitingDayComponent
          isEditable={isEditable}
          title="Sunday"
          handleOnRepeatClick={(item: string) =>
            handleOnRepeatClick(item, 'Visiting')
          }
          handleOnResetClick={(item: string) => handleOnResetClick(item, 'visiting')}
          morningFrom={visitingHours.sundayMorningFrom}
          morningFromError={errorMessages.visitingSundayMorningFrom}
          morningTo={visitingHours.sundayMorningTo}
          morningToError={errorMessages.visitingSundayMorningTo}
          afternoonFrom={visitingHours.sundayAfternoonFrom}
          afternoonFromError={errorMessages.visitingSundayAfternoonFrom}
          afternoonTo={visitingHours.sundayAfternoonTo}
          afternoonToError={errorMessages.visitingSundayAfternoonTo}
          handleMorningFrom={(item: any) =>
            handleSundayMorningFrom(item.value, 'Visiting')
          }
          handleMorningTo={(item: any) =>
            handleSundayMorningTo(item.value, 'Visiting')
          }
          handleAfternoonFrom={(item: any) =>
            handleSundayAfternoonFrom(item.value, 'Visiting')
          }
          handleAfternoonTo={(item: any) =>
            handleSundayAfternoonTo(item.value, 'Visiting')
          }
        />
      </View>
      <RepeatTimingModal
        isVisible={isRepeatModalVisible}
        currentDay={currentDay}
        currentHourType={currentHourType}
        handleOnPressOk={handleOnPressOk}
        handleOnPressCancel={handleOnPressCancel}
      />
    </View>
  );
};

export default OpeningVisitingComponent;
