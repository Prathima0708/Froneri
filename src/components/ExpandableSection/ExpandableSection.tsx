import React from 'react';
import {
  ExpandableSection as UIExpandableSection,
  ExpandableSectionProps,
} from 'react-native-ui-lib';

class ExpandableSection extends React.Component {
  constructor(props: ExpandableSectionProps) {
    super(props);
  }

  render() {
    return (
      <UIExpandableSection {...this.props}>
        {this.props.children}
      </UIExpandableSection>
    );
  }
}

export default ExpandableSection;
