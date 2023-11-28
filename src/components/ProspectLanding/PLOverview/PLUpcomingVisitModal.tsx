import View from 'src/components/View';
import Text from 'src/components/Text';
import { ScrollView, TouchableOpacity } from 'react-native';
import { images } from 'src/assets/Images';
import React, { useState, useEffect } from 'react';
import Modal from 'src/components/Modal';
import { tw } from 'src/tw';
import Dropdown from 'src/components/DropDown';
import RadioButton from 'src/components/RadioButton';
import { VISIT_TYPES } from 'src/utils/Constant';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import InputText from 'src/components/InputText';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import CustomerIconComponent2 from 'src/components/Common/CustomerIconComponent2';
import VisitsController from 'src/controller/VisitsController';
import { toast } from 'src/utils/Util';
import { VISITS_CALL_STATUS } from 'src/utils/DbConst';

interface PLUpcomingVisitModalProps {
  isVisible: boolean;
  handleBack: any;
  data: any;
  onFinishButtonPress: any;
  setData: any;
}

const PLUpcomingVisitModal = (props: PLUpcomingVisitModalProps) => {
  const { isVisible, handleBack, data, setData, onFinishButtonPress } = props;

  const [visitObjectives, setVisitObjectives] = useState([]);

  const [value, setValue] = useState('');
  const [visitType, setVisitType] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    visitObjective: '',
    visitNote: '',
  })

  const prospectInfoData = useAppSelector(
    (state: RootState) => state.prospectLanding.prospectInfo,
  );

  const name1 = data?.name1 && data?.name1.trim() || ""
  const name2 = data?.name2 && data?.name2.trim() || ""
  const name3 = data?.name3 && data?.name3.trim() || ""

  const name = `${name1} ${name2}`
  const prospectNumber = prospectInfoData?.prospectNumber || "--"
  const address = data?.address && data?.address.trim() || "--"
  const visitDate = data?.visitDateFull || "--"
  const visitStart = data?.visitStartTime || "--"
  const visitEnd = data?.visitEndTime || "--"
  const isEditable = data?.visitCallStatus === VISITS_CALL_STATUS.OPEN

  useEffect(() => {
    setVisitType(data?.visitType || "")
    setupDropdown();
  }, [isVisible, data])

  // Setup the visit objectives dropdown
  const setupDropdown = async () => {
    VisitsController.getEmployeesObjectives()
      .then((objectives) => {
        setVisitObjectives(objectives);
      })
      .catch(error => {
        console.log('error while setting dropdown', error);

        setVisitObjectives([]);
        toast.error({
          message: 'Something went wrong',
        })
      });
  };

  const handleDropDown = (item: any) => {
    setData((prevData: any) => ({
      ...prevData,
      idEmployeeObjective: item.idEmployeeObjective,
    }))
  };

  const handleVisitNote = (text: string) => {
    setData((prevData: any) => ({
      ...prevData,
      visitNotes: text,
    }))
  };

  const validateInputs = () => {
    let isValid = true;
    const errorMessages = {
      visitObjective: '',
      visitNote: '',
    }

    if (!data.idEmployeeObjective) {
      isValid = false;
      errorMessages.visitObjective = 'Please select visit objective';
    }

    if (data.visitNotes.trim().length === 0) {
      isValid = false;
      errorMessages.visitNote = 'Please enter visit note';
    }

    setErrorMessages(errorMessages);
    return isValid;
  }

  const finishVisit = () => {
    if (!validateInputs()) {
      return
    }

    onFinishButtonPress(true)
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      enableModalBlur={false}
      overlayBackgroundColor={'rgba(0, 0, 0, 0.4)'}>
      <View
        bg-white
        padding-v4
        style={[tw('flex-1 w-1/2'), { marginLeft: '50%' }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View row centerV>
            <TouchableOpacity style={tw('mr-8')} onPress={handleBack}>
              <images.DefaultLeftArrowIcon />
            </TouchableOpacity>
            <View marginR-v4>
              <CustomerIconComponent2
                item={{ ...prospectInfoData, visitType: null }}
              />
            </View>
            <View>
              <Text text18BO textBlack>
                {name}
              </Text>
              {name3 &&
                <Text text13M textBlack>
                  {name3}
                </Text>
              }
            </View>
          </View>
          <View>
            <View marginT-v6 row>
              <View flex>
                <Text text13M textBlack>
                  Prospect Number
                </Text>
                <Text text13R textBlack marginT-v1>
                  {prospectNumber}
                </Text>
              </View>
              <View flex>
                <Text text13M textBlack>
                  Address
                </Text>
                <Text text13R textBlack marginT-v1 numberOfLines={1}>
                  {address}
                </Text>
              </View>
            </View>
          </View>
          <View marginT-v4 row>
            <View flex-2>
              <Text text13M textBlack>
                Visit Date
              </Text>
              <View
                row
                centerV
                bg-white1
                br20
                spread
                style={tw(
                  `border-default border-light-lavendar px-3 mr-3 mt-1`,
                )}>
                <Text text13R grey1>
                  {visitDate}
                </Text>
                <images.CalendarIcon />
              </View>
            </View>
            <View flex>
              <Text text13M textBlack>
                Visit Start
              </Text>
              <View
                bg-white1
                br20
                style={tw(
                  `border-default border-light-lavendar py-2 px-3 mr-3 mt-1`,
                )}>
                <Text text13R grey1>
                  {visitStart}
                </Text>
              </View>
            </View>
            <View flex>
              <Text text13M textBlack>
                Visit End
              </Text>
              <View
                bg-white1
                br20
                style={tw(
                  `border-default border-light-lavendar py-2 px-3 mt-1`,
                )}>
                <Text text13R grey1>
                  {visitEnd}
                </Text>
              </View>
            </View>
          </View>
          <View marginT-v4>
            <Dropdown
              title="Visit Objective*"
              isEditable={isEditable}
              placeholder="Select Visit Objective"
              data={visitObjectives}
              value={data.idEmployeeObjective}
              labelField={'descriptionLanguage1'}
              valueField={'idEmployeeObjective'}
              onChange={handleDropDown}
              errorMsg={errorMessages.visitObjective}
            />
          </View>
          <View marginT-v4>
            <Text text13M textBlack>
              Visit Type
            </Text>
            <View style={tw('mt-1')}>
              <RadioButton
                initialValue={visitType}
                disabled
                color={ColourPalette.light.darkBlue}
                data={[
                  {
                    label: 'Fixed',
                    value: VISIT_TYPES.PLANNED,
                  },
                  {
                    label: 'Adhoc',
                    value: VISIT_TYPES.ADHOC,
                  },
                  {
                    label: 'Phone / Email',
                    value: VISIT_TYPES.PHONE,
                  },
                ]}
              />
            </View>
          </View>
          <View marginT-v4>
            <InputText
              style={[tw(`p-3 h-40`), { textAlignVertical: 'top' }]}
              title="Visit Preparation Notes*"
              multiline
              value={data.visitNotes}
              showCharCounter
              maxLength={500}
              onChangeText={handleVisitNote}
              isEditable={isEditable}
              errorMsg={errorMessages.visitNote}
              errorClassName={"-mt-10px"}
            />
          </View>
          {isEditable &&
            <View marginT-v6 row centerV right>
              <TouchableOpacity
                style={tw(
                  'flex-row bg-light-darkBlue rounded-md px-8 py-2-1 justify-center items-center',
                )}
                onPress={finishVisit}
              >
                <images.FinishIcon />
                <Text text13R white marginL-v1>
                  Finish Visit
                </Text>
              </TouchableOpacity>
            </View>
          }
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PLUpcomingVisitModal;
