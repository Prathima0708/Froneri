import React from 'react';
import {VISIT_STATUS} from 'src/utils/Constant';
import View from 'src/components/View';
import {ActivityIndicator} from 'react-native';

interface ListProps {
  isMissedVisitLoading: boolean;
  visitStatus: string;
}

const ListFooterComponent = (props: ListProps) => {
  const {isMissedVisitLoading, visitStatus} = props;
  return isMissedVisitLoading && visitStatus === VISIT_STATUS.MISSED ? (
    <View paddingV-30 centerH centerV>
      <ActivityIndicator size={'small'} color={'black'} />
    </View>
  ) : null;
};

export default ListFooterComponent;
