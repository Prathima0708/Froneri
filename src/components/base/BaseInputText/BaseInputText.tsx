import React, { FC } from 'react';
import { Incubator } from 'react-native-ui-lib';
import View from 'src/components/View';
import { BaseInputCommonProps } from 'src/interface/component/Input';
import { tw } from 'src/tw';
import { TextInputProps } from 'react-native';
import TextError from 'src/components/TextError';
import Text from 'src/components/Text';
import { withAuthInput } from 'src/hoc/withAuthInput';

const { TextField } = Incubator;

type UIProps = JSX.LibraryManagedAttributes<
  typeof TextField,
  React.ComponentProps<typeof TextField>
>;

export type BaseInputProps = UIProps & TextInputProps & BaseInputCommonProps;

const BaseInputText: FC<BaseInputProps> = (props: BaseInputProps) => {
  const {
    errorMsg,
    errorClassName,
    errorStyleObj,
    style,
    noBorders,
    title,
    isEditable,
  } = props;
  return (
    <View>
      {title ? (
        <Text text13M textBlack>
          {title}
        </Text>
      ) : null}
      <TextField
        key={'not-centered'}
        {...props}
        style={[
          tw(
            `${noBorders
              ? ''
              : 'border-light-lavendar border-default mt-1 px-3 py-1'
            }
            ${isEditable ? 'bg-light-white' : 'bg-light-white1'} rounded-md`,
          ),
          style,
        ]}
      />
      {errorMsg ? (
        <TextError
          errorMsg={errorMsg}
          errorClassName={props.showCharCounter ? '-mt-12px ' + (errorClassName ?? "") : errorClassName}
          errorStyleObj={errorStyleObj}
        />
      ) : null}
    </View>
  );
};

export default withAuthInput(BaseInputText);
