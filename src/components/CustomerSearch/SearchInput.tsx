import React from 'react';
import {TouchableOpacity} from 'react-native';
import InputText from 'src/components/InputText';
import View from 'src/components/View';
import {tw} from 'src/tw';
import {images} from 'src/assets/Images';

const SearchInput = () => {
  return (
    <View
      marginB-v4
      row
      spread
      centerV
      paddingL-v2
      style={tw('border-default rounded-md border-light-lavendar w-282px')}>
      <InputText placeholder="Search Customers, Prospects, etc." />
      <TouchableOpacity>
        <images.SearchIcon />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
