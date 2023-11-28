import React from 'react';
import {Dropdown as UIDropdown} from 'react-native-element-dropdown';
import TextError from '../TextError';
import Text from 'src/components/Text';
import View from 'src/components/View';
import {tw} from 'src/tw';
import {images} from 'src/assets/Images';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {withAuthDropdown} from 'src/hoc/withAuthDropdown';

const Dropdown = (props: any) => {
  const {
    isEditable,
    extraStyle,
    title,
    extraSelectedTextStyle,
    extraPlaceholderStyle,
    icon,
    errorMsg,
    errorClassName,
    errorStyleObj,
  } = props;

  const defaultClassName = `${
    isEditable === false ? 'bg-light-white1' : 'bg-light-white'
  } ${
    title ? 'mt-1' : ''
  } border-default border-light-lavendar pl-2 rounded-md`;

  const className = `${defaultClassName} ${extraStyle ? extraStyle : ''}`;

  const defaultSelectedTextStyle = `${
    isEditable === false ? 'text-light-grey1' : 'text-light-textBlack'
  } text-13px`;

  const selectedTextStyle = `${defaultSelectedTextStyle} ${
    extraSelectedTextStyle ? extraSelectedTextStyle : ''
  }`;

  const defaultPlaceholderStyle = 'text-light-grey1 text-btn font-normal';
  const placeholderStyle = `${defaultPlaceholderStyle} ${
    extraPlaceholderStyle ? extraPlaceholderStyle : ''
  }`;

  return (
    <View>
      {title ? (
        <Text text13M textBlack>
          {title}
        </Text>
      ) : null}
      <UIDropdown
        {...props}
        style={tw(className)}
        containerStyle={tw(
          'border-default border-light-lavendar rounded-md py-10px',
        )}
        selectedTextProps={{
          numberOfLines: 1,
        }}
        itemTextStyle={[tw('text-btn font-normal'), {marginVertical: -5}]}
        disable={isEditable === false ? true : false}
        maxHeight={200}
        activeColor={ColourPalette.light.lightBlue1}
        placeholderStyle={tw(placeholderStyle)}
        selectedTextStyle={tw(selectedTextStyle)}
        renderRightIcon={() => (icon ? icon : <images.DownIcon />)}
      />
      {errorMsg && (
        <TextError
          errorMsg={errorMsg}
          errorClassName={errorClassName && 'text-light-red-700'}
          errorStyleObj={errorStyleObj ? errorStyleObj : {}}
        />
      )}
    </View>
  );
};

export default withAuthDropdown(Dropdown);
