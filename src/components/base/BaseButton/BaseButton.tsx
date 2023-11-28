import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {asBaseComponent, forwardRef} from 'react-native-ui-lib';
import {extractTypographyValue} from 'react-native-ui-lib/src/commons/modifiers';
import {Button as UIButton} from 'react-native-ui-lib/src/components/button';
import {ButtonProps} from 'react-native-ui-lib/src/components/button/ButtonTypes';
import Text from 'src/components/Text';
import View from 'src/components/View';
import {Trans} from 'react-i18next';
import {tw} from 'src/tw';

type BaseButtonProps = TouchableOpacityProps & ButtonProps;

class BaseButton extends UIButton {
  constructor(props: BaseButtonProps) {
    super(props);
    this.state = {
      // showLoader: true,
    };

    this.onPress = this.onPress.bind(this);
    this.renderLabel = this.renderLabel.bind(this);
  }

  renderLabel(isEmptyLabel?: boolean) {
    const {label, labelStyle, labelProps, labelClassName} = this.props;
    const typography = extractTypographyValue(this.props);
    const color = this.getLabelColor();
    const labelSizeStyle = this.getLabelSizeStyle();

    if (label) {
      return (
        <Text
          style={[
            this.styles.text,
            !!color && {color},
            labelSizeStyle,
            {...typography},
            labelStyle,
            tw(`${labelClassName ? labelClassName : ''}`),
          ]}
          numberOfLines={1}
          {...labelProps}>
          <Trans>{isEmptyLabel ? ' ' : label}</Trans>
        </Text>
      );
    }
    return null;
  }

  onPress(e: any) {
    if (this.props.onPress) {
      this.props.onPress(e);
    } else if (this.props.onPressWithLoader) {
      if (!this.state.showLoader) {
        let res = this.props.onPressWithLoader(e);
        if (Promise.resolve(res) === res) {
          this.setState({
            showLoader: true,
          });
          res
            .then(() => {
              this.setState({showLoader: false});
            })
            .catch(() => {
              this.setState({showLoader: false});
            });
        }
      }
    }
  }

  render() {
    const {
      className,
      disabled,
      link,
      buttonStyle,
      testID,
      animateLayout,
      modifiers,
      onPressIn,
      onPressOut,
      forwardedRef,
      loaderColor,
      ...others
    } = this.props;
    const {margins} = modifiers;
    return (
      <TouchableOpacity
        style={[
          this.styles.container,
          tw(`${className ? className : ''}`),
          animateLayout && this.getAnimationDirectionStyle(),
          buttonStyle,
          margins,
        ]}
        activeOpacity={
          this.props.activeOpacity ? this.props.activeOpacity : 0.8
        }
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onLayout={this.onLayout}
        onPress={this.onPress}
        disabled={disabled || this.state.showLoader}
        testID={testID}
        {...others}
        ref={forwardedRef}>
        {this.props.children}
        {this.state.showLoader ? (
          <View style={{flexDirection: 'row'}}>
            <ActivityIndicator color={loaderColor ? loaderColor : 'white'} />
            {this.renderLabel(true)}
          </View>
        ) : (
          <>
            {this.props.iconOnRight ? this.renderLabel() : this.renderIcon()}
            {this.props.iconOnRight ? this.renderIcon() : this.renderLabel()}
          </>
        )}
      </TouchableOpacity>
    );
  }
}

export default asBaseComponent(forwardRef(BaseButton));
