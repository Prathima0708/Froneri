import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { TouchableOpacity } from 'react-native';
import { tw } from 'src/tw';

interface PaginationHeaderProps {
  currentPage: string;
  totalPages: string;
  totalCustomers: string;
  handleLeftIconPress: any;
  handleRightIconPress: any;
  isLeftButtonDisabled: boolean;
  isRightButtonDisabled: boolean;
}
const PaginationHeader = (props: PaginationHeaderProps) => {
  const {
    currentPage,
    totalPages,
    totalCustomers,
    isLeftButtonDisabled,
    isRightButtonDisabled,
    handleLeftIconPress,
    handleRightIconPress,
  } = props;
  return (
    <View row centerV spread>
      <View row>
        <Text text13R grey2>
          label.general.showing
        </Text>
        <Text text13R grey2>
          {' '} {currentPage} - {totalPages} {' '}
        </Text>
        <Text text13R grey2>
          label.general.results_of
        </Text>
        <Text text13R grey2>
          {' '} {totalCustomers}
        </Text>
      </View>
      <View row centerV>
        <TouchableOpacity
          style={tw('mr-3')}
          onPress={handleLeftIconPress}
          disabled={isLeftButtonDisabled}>
          {isLeftButtonDisabled ? (
            <images.DisabledLeftArrowIcon />
          ) : (
            <images.DefaultLeftArrowIcon />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRightIconPress}
          disabled={isRightButtonDisabled}>
          {isRightButtonDisabled ? (
            <images.DisabledRightArrowIcon />
          ) : (
            <images.DefaultRightArrowIcon />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaginationHeader;
