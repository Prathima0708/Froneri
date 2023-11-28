import View from 'src/components/View';
import Text from 'src/components/Text';
import React from 'react';
import { tw } from 'src/tw';
import InputText from 'src/components/InputText';
import { DATETIME_PICKER_MODE } from 'src/utils/Constant';
import { images } from 'src/assets/Images';
import DateTimePicker from 'src/components/DateTimePicker';

interface AgreementDetailsComponentProps {
  areSignaturesEditable: boolean;
  conditionAggrementInputData: any;
  handleInputChange: any;
  errorMessages?: any;
  isSwissMarket: boolean;
}
const AgreementDetailsComponent = (props: AgreementDetailsComponentProps) => {
  const {
    areSignaturesEditable,
    conditionAggrementInputData,
    handleInputChange,
    errorMessages,
    isSwissMarket,
  } = props;

  const handleIceStartDate = handleInputChange('iceStartDate');
  const handleIceEndDate = handleInputChange('iceEndDate');
  const handleFrozenfoodStartDate = handleInputChange('frozenfoodStartDate');
  const handleFrozenfoodEndDate = handleInputChange('frozenfoodEndDate');
  const handleIceConditions = handleInputChange('iceConditions');
  const handleFrozenConditions = handleInputChange('frozenfoodConditions');

  return (
    <View>
      <View row>
        <View flex marginR-v2>
          <Text text13M textBlack>
            ICE Start Date*
          </Text>
          <DateTimePicker
            dateFormat={'DD-MM-YYYY'}
            mode={DATETIME_PICKER_MODE.DATE}
            maximumDate={
              conditionAggrementInputData.iceEndDate !== ''
                ? conditionAggrementInputData.iceEndDate
                : new Date(2040, 10, 1)
            }
            editable={areSignaturesEditable}
            onChange={handleIceStartDate}
            renderInput={({ value }) => {
              return (
                <View
                  style={tw(
                    `${areSignaturesEditable ? 'bg-light-white' : 'bg-light-white1'
                    } flex-row items-center rounded-md border-default border-light-lavendar  pl-2 justify-between mt-1`,
                  )}>
                  <Text
                    text13R
                    marginR-v2
                    style={tw(
                      `${areSignaturesEditable ? 'text-light-textBlack' : 'text-light-grey1'
                      }`,
                    )}>
                    {value}
                  </Text>
                  <images.CalendarIcon />
                </View>
              );
            }}
            value={conditionAggrementInputData.iceStartDate}
            errorMsg={errorMessages.iceStartDate}
          />
        </View>
        <View flex marginR-v2>
          <Text text13M textBlack>
            ICE End Date*
          </Text>
          <DateTimePicker
            dateFormat={'DD-MM-YYYY'}
            mode={DATETIME_PICKER_MODE.DATE}
            minimumDate={
              conditionAggrementInputData.iceStartDate !== ''
                ? conditionAggrementInputData.iceStartDate
                : new Date(1950, 0, 1)
            }
            editable={areSignaturesEditable}
            onChange={handleIceEndDate}
            renderInput={({ value }) => {
              return (
                <View
                  style={tw(
                    `${areSignaturesEditable ? 'bg-light-white' : 'bg-light-white1'
                    } flex-row items-center rounded-md border-default border-light-lavendar  pl-2 justify-between mt-1`,
                  )}>
                  <Text
                    text13R
                    marginR-v2
                    style={tw(
                      `${areSignaturesEditable ? 'text-light-textBlack' : 'text-light-grey1'
                      }`,
                    )}>
                    {value}
                  </Text>
                  <images.CalendarIcon />
                </View>
              );
            }}
            value={conditionAggrementInputData.iceEndDate}
            errorMsg={errorMessages.iceEndDate}
          />
        </View>
      </View>
      {!isSwissMarket && <View flex marginT-v5>
        <InputText
          title="ICE Conditions*"
          style={[tw(`p-3 h-300px`), { textAlignVertical: 'top' }]}
          multiline
          isEditable={areSignaturesEditable}
          value={conditionAggrementInputData.iceConditions}
          placeholder="Enter Conditions"
          errorMsg={errorMessages.iceConditions}
          onChangeText={handleIceConditions}
        />
      </View>}
      {!isSwissMarket && <View row marginT-v5>
        <View flex marginR-v2>
          <Text text13M textBlack>
            Frozen Start Date
          </Text>
          <DateTimePicker
            dateFormat={'DD-MM-YYYY'}
            mode={DATETIME_PICKER_MODE.DATE}
            editable={areSignaturesEditable}
            onChange={handleFrozenfoodStartDate}
            maximumDate={
              conditionAggrementInputData.frozenfoodEndDate !== ''
                ? conditionAggrementInputData.frozenfoodEndDate
                : new Date(2040, 10, 1)
            }
            renderInput={({ value }) => {
              return (
                <View
                  style={tw(
                    `${areSignaturesEditable ? 'bg-light-white' : 'bg-light-white1'
                    } flex-row items-center rounded-md border-default border-light-lavendar  pl-2 justify-between mt-1`,
                  )}>
                  <Text
                    text13R
                    marginR-v2
                    style={tw(
                      `${areSignaturesEditable ? 'text-light-textBlack' : 'text-light-grey1'
                      }`,
                    )}>
                    {value}
                  </Text>
                  <images.CalendarIcon />
                </View>
              );
            }}
            value={conditionAggrementInputData.frozenfoodStartDate}
            errorMsg={errorMessages.frozenfoodStartDate}
          />
        </View>
        <View flex>
          <Text text13M textBlack>
            Frozen End Date
          </Text>
          <DateTimePicker
            dateFormat={'DD-MM-YYYY'}
            mode={DATETIME_PICKER_MODE.DATE}
            minimumDate={
              conditionAggrementInputData.frozenfoodStartDate !== ''
                ? conditionAggrementInputData.frozenfoodStartDate
                : new Date(1950, 0, 1)
            }
            editable={areSignaturesEditable}
            onChange={handleFrozenfoodEndDate}
            renderInput={({ value }) => {
              return (
                <View
                  style={tw(
                    `${areSignaturesEditable ? 'bg-light-white' : 'bg-light-white1'
                    } flex-row items-center rounded-md border-default border-light-lavendar  pl-2 justify-between mt-1`,
                  )}>
                  <Text
                    text13R
                    marginR-v2
                    style={tw(
                      `${areSignaturesEditable ? 'text-light-textBlack' : 'text-light-grey1'
                      }`,
                    )}>
                    {value}
                  </Text>
                  <images.CalendarIcon />
                </View>
              );
            }}
            value={conditionAggrementInputData.frozenfoodEndDate}
            errorMsg={errorMessages.frozenfoodEndDate}
          />
        </View>
      </View>}
      {!isSwissMarket && <View flex marginT-v5>
        <InputText
          title="Frozen Conditions"
          style={[tw(`p-3 h-300px`), { textAlignVertical: 'top' }]}
          multiline
          isEditable={areSignaturesEditable}
          value={conditionAggrementInputData.frozenfoodConditions}
          placeholder="Enter Conditions"
          errorMsg={errorMessages.frozenfoodConditions}
          onChangeText={handleFrozenConditions}
        />
      </View>}
    </View>
  );
};

export default AgreementDetailsComponent;
