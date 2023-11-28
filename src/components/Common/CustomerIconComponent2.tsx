import React from 'react';
import View from 'src/components/View';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import { VISIT_TYPES } from 'src/utils/Constant';
import { isPassedDate } from 'src/utils/CommonUtil';
import { VISITS_CALL_STATUS } from 'src/utils/DbConst';

const CustomerIconComponent2 = (props: any) => {
  const { item } = props;
  const isPassedVisit =
    item?.callFromDatetime && isPassedDate(item.callFromDatetime);

  let customerStatusType = item?.statusType ? item?.statusType : '';

  /**
   * Check Customers ....
   */
  let CustomerIcon;
  if (item?.delegated == '0') {
    if (customerStatusType.toLowerCase() == 'p') {
      CustomerIcon = images.ProspectIcon;
    } else if (
      item?.customerShipTo !== item?.street3 &&
      item?.customerGroup15 == ''
    ) {
      CustomerIcon = images.InDirectCustomerIcon;
    } else if (
      item?.customerShipTo !== item?.street3 &&
      item?.customerGroup15 == 'SY'
    ) {
      CustomerIcon = images.DistributorCustomerIcon;
    } else {
      CustomerIcon = images.DirectCustomerIcon;
    }
  } else {
    if (customerStatusType.toLowerCase() == 'p') {
      CustomerIcon = images.DelegatedProspectIcon;
    } else if (
      item?.customerShipTo !== item?.street3 &&
      item?.customerGroup15 == ''
    ) {
      CustomerIcon = images.DelegatedIndirectCustomerIcon;
    } else if (
      item?.customerShipTo !== item?.street3 &&
      item?.customerGroup15 == 'PY'
    ) {
      CustomerIcon = images.DelegatedDistributorCustomerIcon;
    } else {
      CustomerIcon = images.DelegatedDirectCustomerIcon;
    }
  }
  //

  /**
   *  Check Visit Type  Icon
   */
  let VisitTypeIcon;
  if (item?.visitType == VISIT_TYPES.PLANNED) {
    if (
      item?.callStatus == VISITS_CALL_STATUS.ORDER ||
      item?.callStatus == VISITS_CALL_STATUS.NO_ORDER ||
      item?.callStatus == VISITS_CALL_STATUS.FINISHED ||
      item?.callStatus == VISITS_CALL_STATUS.CLOSED
    ) {
      VisitTypeIcon = images.FixedCompletedIcon;
    } else if (isPassedVisit) {
      VisitTypeIcon = images.FixedMissedIcon;
    } else {
      if (
        item?.callStatus == VISITS_CALL_STATUS.INITIAL ||
        item?.callStatus == VISITS_CALL_STATUS.OPEN
      ) {
        VisitTypeIcon = images.FixedOpenIcon;
      } else {
        VisitTypeIcon = images.FixedPausedIcon;
      }
    }
  } else if (item?.visitType == VISIT_TYPES.ADHOC) {
    if (
      item?.callStatus == VISITS_CALL_STATUS.ORDER ||
      item?.callStatus == VISITS_CALL_STATUS.NO_ORDER ||
      item?.callStatus == VISITS_CALL_STATUS.FINISHED ||
      item?.callStatus == VISITS_CALL_STATUS.CLOSED
    ) {
      VisitTypeIcon = images.AdhocCompletedIcon;
    } else if (isPassedVisit) {
      VisitTypeIcon = images.AdhocMissedIcon;
    } else {
      if (
        item?.callStatus == VISITS_CALL_STATUS.INITIAL ||
        item?.callStatus == VISITS_CALL_STATUS.OPEN
      ) {
        VisitTypeIcon = images.AdhocOpenIcon;
      } else {
        VisitTypeIcon = images.AdhocPausedIcon;
      }
    }
  } else {
    if (
      item?.callStatus == VISITS_CALL_STATUS.ORDER ||
      item?.callStatus == VISITS_CALL_STATUS.NO_ORDER ||
      item?.callStatus == VISITS_CALL_STATUS.FINISHED ||
      item?.callStatus == VISITS_CALL_STATUS.CLOSED
    ) {
      VisitTypeIcon = images.PhoneCompletedIcon;
    } else if (isPassedVisit) {
      VisitTypeIcon = images.PhoneMissedIcon;
    } else {
      if (
        item?.callStatus == VISITS_CALL_STATUS.INITIAL ||
        item?.callStatus == VISITS_CALL_STATUS.OPEN
      ) {
        VisitTypeIcon = images.PhoneOpenIcon;
      } else {
        VisitTypeIcon = images.PhonePausedIcon;
      }
    }
  }

  return (
    <View row>
      <CustomerIcon />
      {item?.visitType ? (
        <View style={[tw('absolute'), { right: -5, bottom: -2 }]}>
          <VisitTypeIcon />
        </View>
      ) : null}
    </View>
  );
};

export default CustomerIconComponent2;
