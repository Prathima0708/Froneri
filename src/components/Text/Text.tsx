import React, {forwardRef} from 'react';
import {Text as UIText} from 'react-native-ui-lib';
import {Typography} from 'src/styles/config/TypographyStyles';
import {Trans} from 'react-i18next';
type UITextProps = JSX.LibraryManagedAttributes<
  typeof UIText,
  React.ComponentProps<typeof UIText>
>;

type TypographyLiterals = keyof typeof Typography;
type CustomModifier = {[key: string]: boolean};
type Modifier<T extends string> = Partial<Record<T, boolean>>;
type TypographyModifiers = Modifier<TypographyLiterals> | CustomModifier;

export type TxtProps = UITextProps &
  TypographyModifiers & {
    isRed?: boolean;
    style?: Object;
    innerRef?: any;
  };

class AppText extends React.Component<TxtProps, {}> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <UIText
        {...this.props}
        ref={this.props.innerRef}
        allowFontScaling={false}>
        <Trans>{this.props.children}</Trans>
      </UIText>
    );
  }
}

const Text = forwardRef<HTMLInputElement, TxtProps>((props, ref) => {
  return <AppText innerRef={ref} {...props} />;
});
export default Text;
