import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import CustomerIconComponent from 'src/components/Common/CustomerIconComponent';
import {tw} from 'src/tw';
import {VISITS_CALL_STATUS} from 'src/utils/DbConst';

const RenderEvents = (props: any) => {
  const {event, isDay, isActive} = props;
  return (
    <View
      bg-lightBlue2
      flex
      centerV
      br20
      paddingH-v2
      margin-2
      key={event.id_call}
      style={tw(
        `${
          isActive
            ? 'border-light-darkBlue border-default'
            : 'border-light-lightBlue2 border-default'
        }`,
      )}>
      <View row centerV>
        {event.duration > 0.25 && (
          <View row centerV marginR-v4>
            <CustomerIconComponent item={event} />
          </View>
        )}
        <View row spread flex>
          <View flex-3 marginR-v2>
            {event.customer_name != '' ? (
              <Text text13R textBlack numberOfLines={1}>
                {event.customer_name}
              </Text>
            ) : null}
            {event.duration > 0.25 ? (
              <Text grey2 text13R numberOfLines={1}>
                {event.customer_ship_to}
              </Text>
            ) : (
              <Text grey2 text13R marginT-v03 numberOfLines={1}>
                {event.customer_ship_to}
              </Text>
            )}
          </View>
          {isDay && (
            <View flex-3 marginR-v4>
              <Text grey2 text13R numberOfLines={1}>
                {event.name2}
              </Text>
            </View>
          )}
          {isDay && (
            <View flex-3 marginR-v4>
              <Text grey2 text13R numberOfLines={1}>
                {event.address1}
              </Text>
            </View>
          )}
          {event.call_status === VISITS_CALL_STATUS.OPEN &&
            (isDay ? (
              <View row centerV marginR-v2>
                <View
                  style={tw('bg-light-lightGreen h-3 w-3 rounded-md mr-1')}
                />
                <Text text13R darkBlue4>
                  In Progress
                </Text>
              </View>
            ) : (
              <View flex marginT-v03 right>
                <View
                  style={tw('bg-light-lightGreen h-3 w-3 rounded-md mr-1')}
                />
              </View>
            ))}
        </View>
      </View>
    </View>
  );
};

export default RenderEvents;
