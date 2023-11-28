import React from 'react';
import {Checkbox as UICheckbox} from 'react-native-ui-lib';
import TextError from '../TextError';
import {ColourPalette} from 'src/styles/config/ColoursStyles';
import {withAuthCheckBox} from 'src/hoc/withAuthCheckBox';

class CheckBox extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <UICheckbox
          bg-white
          borderRadius={6}
          size={24}
          color={ColourPalette.light.grey2}
          {...this.props}>
          {this.props.children}
        </UICheckbox>
        {this.props.errorMsg && (
          <TextError
            errorMsg={this.props.errorMsg}
            errorClassName={this.props.errorClassName && 'text-light-red-700'}
            errorStyleObj={this.props.errorStyleObj}
          />
        )}
      </>
    );
  }
}

export default withAuthCheckBox(CheckBox);
