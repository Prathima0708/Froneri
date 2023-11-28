import React from 'react';
import { DateTimePicker as UIDateTimePicker } from 'react-native-ui-lib';
import TextError from '../TextError';
import { withAuthDropdown } from 'src/hoc/withAuthDropdown';

class DateTimePicker extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <>
        <UIDateTimePicker {...this.props}>{this.props.children}</UIDateTimePicker>
        {this.props.errorMsg && <TextError errorMsg={this.props.errorMsg} errorClassName={this.props.errorClassName} errorStyleObj={this.props.errorStyleObj} />}
      </>
    );
  }
}

export default withAuthDropdown(DateTimePicker);
