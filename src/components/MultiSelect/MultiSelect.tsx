import React from 'react';
import {MultiSelect as UIMultiSelect} from 'react-native-element-dropdown';
import Text from 'src/components/Text';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {tw} from 'src/tw';
import {images} from 'src/assets/Images';
import TextError from 'src/components/TextError';

const MultiSelect = (props: any) => {
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
  } border-default border-light-lavendar pl-2 rounded-md mt-1`;

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
    <>
      {title ? (
        <Text text13M textBlack>
          {title}
        </Text>
      ) : null}
      <UIMultiSelect
        {...props}
        style={tw(className)}
        containerStyle={tw(
          'border-default border-light-lavendar rounded-md py-10px',
        )}
        itemTextStyle={tw('text-btn font-normal')}
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
          errorStyleObj={errorStyleObj}
        />
      )}
    </>
  );
};

export default MultiSelect;
