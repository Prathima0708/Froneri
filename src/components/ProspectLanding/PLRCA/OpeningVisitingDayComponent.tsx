import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { useEffect, useState } from 'react';
import { tw } from 'src/tw';
import { images } from 'src/assets/Images';
import ExpandableSection from 'src/components/ExpandableSection';
import { TouchableOpacity } from 'react-native';
import Dropdown from 'src/components/DropDown';
import { RCA_HOURS_DROPDOWN } from 'src/utils/DropdownConst';

interface OpeningVisitingDayProps {
  title: string;
  handleOnRepeatClick: any;
  handleOnResetClick: any;
  morningFrom: string;
  morningTo: string;
  afternoonFrom: string;
  afternoonTo: string;
  handleMorningFrom: any;
  handleMorningTo: any;
  handleAfternoonFrom: any;
  handleAfternoonTo: any;
  isEditable: boolean;
  morningFromError: string;
  morningToError: string;
  afternoonFromError: string;
  afternoonToError: string;
}

const OpeningVisitingDayComponent = (props: OpeningVisitingDayProps) => {
  const {
    title,
    handleOnRepeatClick,
    handleOnResetClick,
    morningFrom,
    morningTo,
    afternoonFrom,
    afternoonTo,
    handleMorningFrom,
    handleMorningTo,
    handleAfternoonFrom,
    handleAfternoonTo,
    isEditable,
    morningFromError,
    morningToError,
    afternoonFromError,
    afternoonToError
  } = props;
  const [morningToData, setMorningToData] = useState<any>([]);
  const [afternoonToData, setAfternoonToData] = useState<any>([])
  const [isExpanded, setIsExpanded] = useState(
    title === 'Monday',
  );

  let isActive = true
  let resetIconDisabled = true

  useEffect(() => {
    if (morningFrom && morningFrom !== '-1') {
      const newArray = [...RCA_HOURS_DROPDOWN];
      const positionToRemove = parseInt(morningFrom);
      newArray.splice(0, positionToRemove);
      setMorningToData(newArray as never);
    } else {
      const newArray = [...RCA_HOURS_DROPDOWN];
      newArray.splice(0, 1);
      setMorningToData(newArray as never);
    }

    if (afternoonFrom && afternoonFrom !== '-1') {
      const newArray = [...RCA_HOURS_DROPDOWN];
      const positionToRemove = parseInt(afternoonFrom);
      newArray.splice(0, positionToRemove);
      setAfternoonToData(newArray as never);
    } else {
      const newArray = [...RCA_HOURS_DROPDOWN];
      newArray.splice(0, 1);
      setAfternoonToData(newArray as never);
    }
  }, []);

  const toggleExpandable = () => {
    setIsExpanded(!isExpanded);
  };

  const onChangeMorningFrom = (item: any) => {
    handleMorningFrom(item);
  };

  const onChangeAfternoonFrom = (item: any) => {
    handleAfternoonFrom(item);
  };

  const handleRepeat = () => {
    handleOnRepeatClick(title);
  };

  const handleReset = () => {
    handleOnResetClick(title);
  }

  let morningFromText = '00:00';
  let morningToText = '00:00';
  let afternoonFromText = '00:00';
  let afternoonToText = '00:00';

  if (morningFrom && morningFrom !== '-1') {
    morningFromText = RCA_HOURS_DROPDOWN.find((item) => item.value === morningFrom)?.label ?? '00:00';
  }

  if (morningTo && morningTo !== '-1') {
    morningToText = RCA_HOURS_DROPDOWN.find((item) => item.value === morningTo)?.label ?? '00:00';
  }

  if (afternoonFrom && afternoonFrom !== '-1') {
    afternoonFromText = RCA_HOURS_DROPDOWN.find((item) => item.value === afternoonFrom)?.label ?? '00:00';
  }

  if (afternoonTo && afternoonTo !== '-1') {
    afternoonToText = RCA_HOURS_DROPDOWN.find((item) => item.value === afternoonTo)?.label ?? '00:00';
  }

  if (morningFromText !== '00:00' || morningToText !== '00:00' || afternoonFromText !== '00:00' || afternoonToText !== '00:00') {
    resetIconDisabled = false
  }

  if (!isEditable) {
    isActive = false;
    resetIconDisabled = true
  }

  return (
    <View
      br40
      marginT-v2
      style={tw(
        `${isExpanded ? 'border-light-grey3 py-5' : 'border-light-lavendar py-2'
        } border-default px-3`,
      )}>
      {!isExpanded && (
        <View row centerV spread>
          <View row centerV>
            <Text text13M textBlack style={tw('w-24')}>
              {title}
            </Text>
            <Text style={tw(`${morningFromText === '00:00' ? 'text-light-grey1' : "text-light-textBlack"} text-btn font-normal`)}>
              {morningFromText}
            </Text>
            <Text style={tw(`${morningFromText === '00:00' && morningToText === '00:00' ? 'text-light-grey1' : "text-light-textBlack"} text-btn font-normal`)}>
              {` - `}
            </Text>
            <Text style={tw(`${morningToText === '00:00' ? 'text-light-grey1' : "text-light-textBlack"} text-btn font-normal`)}>
              {morningToText}
            </Text>
            <Text style={tw('text-light-grey1 text-btn font-bold mx-3')}>
              .
            </Text>
            <Text style={tw(`${afternoonFromText === '00:00' ? 'text-light-grey1' : "text-light-textBlack"} text-btn font-normal`)}>
              {afternoonFromText}
            </Text>
            <Text style={tw(`${afternoonFromText === '00:00' && afternoonToText === '00:00' ? 'text-light-grey1' : "text-light-textBlack"} text-btn font-normal`)}>
              {` - `}
            </Text>
            <Text style={tw(`${afternoonToText === '00:00' ? 'text-light-grey1' : "text-light-textBlack"} text-btn font-normal`)}>
              {afternoonToText}
            </Text>
          </View>
          <TouchableOpacity onPress={toggleExpandable}>
            <images.DownIcon />
          </TouchableOpacity>
        </View>
      )}
      <ExpandableSection expanded={isExpanded}>
        <View row centerV spread>
          <Text text18M textBlack>
            {title}
          </Text>
          <TouchableOpacity onPress={toggleExpandable}>
            <images.UpIcon />
          </TouchableOpacity>
        </View>
        <View>
          <View row spread marginT-v2>
            <Text text13M textBlack style={tw('w-16 mt-2')}>
              Morning
            </Text>
            <Dropdown
              isEditable={isEditable}
              extraStyle={'w-136px'}
              labelField="label"
              valueField="value"
              placeholder="00:00"
              data={RCA_HOURS_DROPDOWN}
              value={morningFrom}
              onChange={onChangeMorningFrom}
              errorMsg={morningFromError}
            />
            <Text text13R grey3 style={tw('mt-2')}>
              to
            </Text>
            <Dropdown
              isEditable={isEditable}
              extraStyle={'w-136px'}
              labelField="label"
              valueField="value"
              placeholder="00:00"
              data={morningToData}
              value={morningTo}
              onChange={handleMorningTo}
              errorMsg={morningToError}
            />
            <TouchableOpacity disabled={!isActive} onPress={handleRepeat}>
              <images.RepeatIcon />
            </TouchableOpacity>
          </View>
          <View row spread marginT-v2 marginB-v2>
            <Text text13M textBlack style={tw('w-16 mt-5')}>
              Afternoon
            </Text>
            <Dropdown
              isEditable={isEditable}
              extraStyle={'w-136px mt-10px'}
              labelField="label"
              valueField="value"
              placeholder="00:00"
              data={RCA_HOURS_DROPDOWN}
              value={afternoonFrom}
              onChange={onChangeAfternoonFrom}
              errorMsg={afternoonFromError}
            />
            <Text text13R grey3 style={tw('mt-5')}>
              to
            </Text>
            <Dropdown
              isEditable={isEditable}
              extraStyle={'w-136px mt-10px'}
              labelField="label"
              valueField="value"
              placeholder="00:00"
              data={afternoonToData}
              value={afternoonTo}
              onChange={handleAfternoonTo}
              errorMsg={afternoonToError}
            />
            <TouchableOpacity disabled={resetIconDisabled} onPress={handleReset}>
              {resetIconDisabled ? <images.ResetIconInactive /> : <images.ResetIcon />}
            </TouchableOpacity>
          </View>
        </View>
      </ExpandableSection>
    </View>
  );
};

export default OpeningVisitingDayComponent;
