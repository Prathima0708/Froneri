import React from 'react';
import View from 'src/components/View';
import {images} from 'src/assets/Images';
import {tw} from 'src/tw';
import {VISIT_TYPES} from 'src/utils/Constant';
import {isPassedDate} from 'src/utils/CommonUtil';
import {VISITS_CALL_STATUS} from 'src/utils/DbConst';

const CustomerIconComponent = (props: any) => {
  const {item} = props;
  const isPassedVisit =
    item?.call_from_datetime && isPassedDate(item.call_from_datetime);

  let customerStatusType = item?.status_type ? item?.status_type : '';

  /**
   * Check Customers ....
   */
  let CustomerIcon = images.DirectCustomerIcon;

  if (item?.delegated == '1') {
    if (customerStatusType.toLowerCase() == 'p'.toLowerCase()) {
      CustomerIcon = images.DelegatedProspectIcon;
    } else if (
      item?.customer_ship_to !== item?.street3 &&
      item?.customer_group_15 == ''
    ) {
      CustomerIcon = images.DelegatedIndirectCustomerIcon;
    } else if (
      item?.customer_ship_to !== item?.street3 &&
      item?.customer_group_15 == 'PY'
    ) {
      CustomerIcon = images.DelegatedDistributorCustomerIcon;
    } else {
      CustomerIcon = images.DelegatedDirectCustomerIcon;
    }
  } else {
    if (customerStatusType.toLowerCase() == 'p'.toLowerCase()) {
      CustomerIcon = images.ProspectIcon;
    } else if (
      item?.customer_ship_to !== item?.street3 &&
      item?.customer_group_15 == ''
    ) {
      CustomerIcon = images.InDirectCustomerIcon;
    } else if (
      item?.customer_ship_to !== item?.street3 &&
      item?.customer_group_15 == 'SY'
    ) {
      CustomerIcon = images.DistributorCustomerIcon;
    } else {
      CustomerIcon = images.DirectCustomerIcon;
    }
  }
  //

  /**
   *  Check Visit Type  Icon
   */
  let VisitTypeIcon = images.FixedOpenIcon;
  if (item?.visit_type == VISIT_TYPES.PLANNED) {
    if (
      item?.call_status === VISITS_CALL_STATUS.ORDER ||
      item?.call_status === VISITS_CALL_STATUS.NO_ORDER ||
      item?.call_status === VISITS_CALL_STATUS.FINISHED ||
      item?.call_status === VISITS_CALL_STATUS.CLOSED
    ) {
      VisitTypeIcon = images.FixedCompletedIcon;
    } else if (isPassedVisit) {
      VisitTypeIcon = images.FixedMissedIcon;
    } else {
      if (
        item?.call_status == VISITS_CALL_STATUS.INITIAL ||
        item?.call_status == VISITS_CALL_STATUS.OPEN
      ) {
        VisitTypeIcon = images.FixedOpenIcon;
      } else {
        VisitTypeIcon = images.FixedPausedIcon;
      }
    }
  } else if (item?.visit_type == VISIT_TYPES.ADHOC) {
    if (
      item?.call_status === VISITS_CALL_STATUS.ORDER ||
      item?.call_status === VISITS_CALL_STATUS.NO_ORDER ||
      item?.call_status === VISITS_CALL_STATUS.FINISHED ||
      item?.call_status === VISITS_CALL_STATUS.CLOSED
    ) {
      VisitTypeIcon = images.AdhocCompletedIcon;
    } else if (isPassedVisit) {
      VisitTypeIcon = images.AdhocMissedIcon;
    } else {
      if (
        item?.call_status == VISITS_CALL_STATUS.INITIAL ||
        item?.call_status == VISITS_CALL_STATUS.OPEN
      ) {
        VisitTypeIcon = images.AdhocOpenIcon;
      } else {
        VisitTypeIcon = images.AdhocPausedIcon;
      }
    }
  } else {
    if (
      item?.call_status === VISITS_CALL_STATUS.ORDER ||
      item?.call_status === VISITS_CALL_STATUS.NO_ORDER ||
      item?.call_status === VISITS_CALL_STATUS.FINISHED ||
      item?.call_status === VISITS_CALL_STATUS.CLOSED
    ) {
      VisitTypeIcon = images.PhoneCompletedIcon;
    } else if (isPassedVisit) {
      VisitTypeIcon = images.PhoneMissedIcon;
    } else {
      if (
        item?.call_status == VISITS_CALL_STATUS.INITIAL ||
        item?.call_status == VISITS_CALL_STATUS.OPEN
      ) {
        VisitTypeIcon = images.PhoneOpenIcon;
      } else {
        VisitTypeIcon = images.PhonePausedIcon;
      }
    }
  }

  return (
    <View>
      {item?.delegated ? (
        <View row>
          <CustomerIcon />
          {item?.visit_type ? (
            <View style={[tw('absolute'), {right: -5, bottom: -2}]}>
              <VisitTypeIcon />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default CustomerIconComponent;
