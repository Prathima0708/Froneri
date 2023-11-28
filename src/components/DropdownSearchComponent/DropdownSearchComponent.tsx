import React from 'react';
import View from 'src/components/View';
import { tw } from 'src/tw';
import InputText from 'src/components/InputText';
import { ColourPalette } from 'src/styles/config/ColoursStyles';

interface DropdownSearchComponentProps {
  handleSearchDropdown: any;
  [key: string]: any;
}

const DropdownSearchComponent = (props: DropdownSearchComponentProps) => {
  const { handleSearchDropdown } = props;

  return (
    <View>
      <InputText
        style={tw(
          'rounded-md border-default border-light-lavendar mx-2 px-3 py-1',
        )}
        placeholder="label.general.search_items"
        inputPlaceHolderTextColor={ColourPalette.light.grey2}
        onChangeText={handleSearchDropdown}
        {...props}
      />
    </View>
  );
};

export default DropdownSearchComponent;
