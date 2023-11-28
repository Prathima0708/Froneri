import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import React, { useEffect, useState } from 'react';
import Modal from 'src/components/Modal';
import { tw } from 'src/tw';
import { Alert, Keyboard, TouchableOpacity } from 'react-native';
import DateTimePicker from 'src/components/DateTimePicker';
import { DATETIME_PICKER_MODE } from 'src/utils/Constant';
import InputText from 'src/components/InputText';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import DeleteModal from 'src/components/Common/DeleteModal';
import { toast } from 'src/utils/Util';

interface VacationModalComponentProps {
  isVacationModalVisible: boolean;
  isNewVacation: boolean;
  onBackPress: any;
  handleCreateUpdateCustomerVacation: any;
  selectedVacation: any;
  handleCustomerVacationDelete: any;
  vacationData: any;
  isPassVacation: boolean;
}

const VacationModalComponent = (props: VacationModalComponentProps) => {
  const {
    isVacationModalVisible,
    isNewVacation,
    onBackPress,
    handleCreateUpdateCustomerVacation,
    selectedVacation,
    handleCustomerVacationDelete,
    vacationData,
    isPassVacation,
  } = props;
  const [isEditable, setIsEditable] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [remark, setRemark] = useState('');
  const [remarksErrorMsg, setRemarksErrorMsg] = useState('');

  useEffect(() => {
    setIsEditable(isNewVacation);
    if (isNewVacation) {
      setRemark('');
      setFromDate(new Date());
      setToDate(new Date());
    } else {
      let fromDateValue = selectedVacation.from ? selectedVacation.from : '';
      if (fromDateValue.length > 0) {
        setFromDate(new Date(fromDateValue));
      }
      let toDateValue = selectedVacation.to ? selectedVacation.to : '';
      if (toDateValue.length > 0) {
        setToDate(new Date(toDateValue));
      }
      let remark = selectedVacation.remark ? selectedVacation.remark : '';
      setRemark(remark);
    }
  }, [selectedVacation]);

  const onCancelPressed = () => {
    let fromDateValue = selectedVacation.from ? selectedVacation.from : '';
    if (fromDateValue.length > 0) {
      setFromDate(new Date(fromDateValue));
    }
    let toDateValue = selectedVacation.to ? selectedVacation.to : '';
    if (toDateValue.length > 0) {
      setToDate(new Date(toDateValue));
    }
    let remark = selectedVacation.remark ? selectedVacation.remark : '';
    setRemark(remark);
    setIsEditable(false);
  };

  const changeEditStatus = () => {
    Keyboard.dismiss();
    if (remark.length === 0 && isEditable) {
      setRemarksErrorMsg('Please add remarks');
      return;
    }

    if (isEditable) {
      // exclude editing vacation obj
      const filteredVacationData = vacationData.filter(
        (item: any) =>
          item.idCustomerVacations !== selectedVacation.idCustomerVacations,
      );
      // Check if the entered vacation is a duplicate
      const isDuplicate = filteredVacationData.some((vacation: any) => {
        const vacationFromDate = new Date(vacation.from);
        const vacationToDate = new Date(vacation.to);

        return (
          vacationFromDate.getDate() === fromDate.getDate() &&
          vacationFromDate.getMonth() === fromDate.getMonth() &&
          vacationFromDate.getFullYear() === fromDate.getFullYear() &&
          vacationToDate.getDate() === toDate.getDate() &&
          vacationToDate.getMonth() === toDate.getMonth() &&
          vacationToDate.getFullYear() === toDate.getFullYear()
        );
      });
      if (isDuplicate) {
        toast.error({
          message: 'This vacation already exists'
        })

        return;
      }

      // Check if the new vacation overlaps with any existing vacations
      const isOverlapping = filteredVacationData.some((vacation: any) => {
        const vacationFromDate = new Date(vacation.from);
        const vacationToDate = new Date(vacation.to);

        // Extract only the date portion without the time
        const fromDateOnly = new Date(
          fromDate.getFullYear(),
          fromDate.getMonth(),
          fromDate.getDate(),
        );
        const toDateOnly = new Date(
          toDate.getFullYear(),
          toDate.getMonth(),
          toDate.getDate(),
        );

        return fromDateOnly <= vacationToDate && toDateOnly >= vacationFromDate;
      });
      if (isOverlapping) {
        toast.error({
          message: 'This vacation overlaps with an existing one.'
        })
        return;
      }
      let obj = {
        ...selectedVacation,
        fromDate: fromDate,
        toDate: toDate,
        remark: remark,
      };
      handleCreateUpdateCustomerVacation &&
        handleCreateUpdateCustomerVacation(obj, isNewVacation);
    }

    if (!isNewVacation) {
      setIsEditable(!isEditable);
    }
  };

  const handleBack = () => {
    setIsEditable(false);
    onBackPress();
  };

  const handleFromDateChange = (date: any) => {
    setFromDate(date);
    setToDate(date);
  };

  const handleToDateChange = (date: any) => {
    setToDate(date);
  };

  const handleDelete = () => {
    if (selectedVacation.isActiveVacation) {
      toast.error({
        message: 'Active vacation cannot be deleted'
      })
      return;
    }
    if (isDeleteModalVisible) {
      handleCustomerVacationDelete &&
        handleCustomerVacationDelete(selectedVacation);
      setIsDeleteModalVisible(false);
    } else {
      setIsDeleteModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsDeleteModalVisible(false);
  };
  const handleRemarks = (text: string) => {
    setRemarksErrorMsg('');
    setRemark(text);
  };

  return (
    <Modal
      visible={isVacationModalVisible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View
        bg-white
        padding-v4
        style={[tw('flex-1 w-1/2'), { marginLeft: '50%' }]}>
        <View row centerV spread>
          <View row>
            {(isEditable == false || isNewVacation) && (
              <TouchableOpacity style={tw('mr-8')} onPress={handleBack}>
                <images.DefaultLeftArrowIcon />
              </TouchableOpacity>
            )}
            <View row centerV>
              <Text text18BO textBlack marginT-3>
                {isNewVacation ? 'Add a New Vacation' : 'Vacation'}
              </Text>
            </View>
          </View>
          {isPassVacation ? null : (
            <View row>
              {isEditable && isNewVacation == false && (
                <TouchableOpacity style={tw('mr-6')} onPress={onCancelPressed}>
                  <images.CancelIcon />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={changeEditStatus}>
                {isEditable ? <images.SaveIcon /> : <images.EditIcon />}
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View row centerV marginT-v4>
          <View>
            <Text text13M textBlack>
              From*
            </Text>
            <DateTimePicker
              dateFormat={'DD-MM-YYYY'}
              mode={DATETIME_PICKER_MODE.DATE}
              editable={isEditable}
              onChange={handleFromDateChange}
              minimumDate={new Date()}
              renderInput={({ value }) => {
                return (
                  <View
                    style={tw(
                      `${isEditable ? 'bg-light-white' : 'bg-light-white1'
                      } flex-row items-center rounded-md border-default border-light-lavendar  pl-2 justify-between mr-6 mt-1`,
                    )}>
                    <Text
                      text13R
                      marginR-v2
                      style={tw(
                        `${isEditable
                          ? 'text-light-textBlack'
                          : 'text-light-grey1'
                        }`,
                      )}>
                      {value}
                    </Text>
                    <images.CalendarIcon />
                  </View>
                );
              }}
              value={fromDate}
            />
          </View>
          <View>
            <Text text13M textBlack>
              To*
            </Text>
            <DateTimePicker
              dateFormat={'DD-MM-YYYY'}
              mode={DATETIME_PICKER_MODE.DATE}
              editable={isEditable}
              onChange={handleToDateChange}
              minimumDate={fromDate ? fromDate : new Date()}
              renderInput={({ value }) => {
                return (
                  <View
                    style={tw(
                      `${isEditable ? 'bg-light-white' : 'bg-light-white1'
                      } flex-row items-center rounded-md border-default border-light-lavendar  pl-2 justify-between mr-6 mt-1`,
                    )}>
                    <Text
                      text13R
                      marginR-v2
                      style={tw(
                        `${isEditable
                          ? 'text-light-textBlack'
                          : 'text-light-grey1'
                        }`,
                      )}>
                      {value}
                    </Text>
                    <images.CalendarIcon />
                  </View>
                );
              }}
              value={toDate}
            />
          </View>
        </View>
        <View marginT-v6>
          <InputText
            title="Remarks*"
            style={[tw(`p-3 h-40`), { textAlignVertical: 'top' }]}
            multiline
            isEditable={isEditable}
            value={remark}
            enableErrors
            placeholder="Enter Remarks..."
            placeholderTextColor={ColourPalette.light.grey2}
            validate={[(value: string) => value.length > 500]}
            validationMessage={['Words limit reached']}
            validateOnStart={true}
            validateOnChange={true}
            validationMessagePosition={'down'}
            showCharCounter={isEditable}
            maxLength={500}
            errorMsg={remarksErrorMsg}
            onChangeText={(text: string) => handleRemarks(text)}
          />
        </View>
        {isPassVacation
          ? null
          : !isEditable && (
            <TouchableOpacity style={tw('mt-20')} onPress={handleDelete}>
              <images.DeleteIcon />
            </TouchableOpacity>
          )}
      </View>
      <DeleteModal
        onPressDelete={handleDelete}
        onPressCancel={handleCancel}
        isDeleteModalVisible={isDeleteModalVisible}
        title="Delete Vacation?"
        subTitle={`Are you sure you want to delete\nthis vacation`}
      />
    </Modal>
  );
};

export default VacationModalComponent;
