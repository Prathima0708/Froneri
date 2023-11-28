import React, { useMemo } from 'react';
import { TimelineCalendar, PackedEvent, HighlightDates } from '@howljs/calendar-kit';
import View from 'src/components/View';
import RenderEvents from './RenderEvents';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import { VISIT_CALENDAR_DROPDOWN } from 'src/utils/DropdownConst';
import { getISOCurrentDate } from 'src/utils/CommonUtil';

interface CalendarProps {
  calendarRef: any;
  visits: [];
  calendarMode: string;
  onLongPressEvent: any;
  selectedEvent: any;
  onVisitDrop: any;
  handleEventPressed: any;
  onPressCancel: any;
  calendarWidth: number;
  onTimelineCalendarChange: any;
  loading: boolean;
}

const CalendarComponent = (props: CalendarProps) => {
  const {
    calendarRef,
    visits,
    calendarMode,
    onLongPressEvent,
    selectedEvent,
    onVisitDrop,
    handleEventPressed,
    onPressCancel,
    calendarWidth,
    onTimelineCalendarChange,
    loading,
  } = props;

  const highlightDates: HighlightDates | {} = useMemo(
    () => {
      if (visits.length > 0) {
        const highlightedDates = visits.reduce((acc: any, visit: any) => {
          const dateKey = visit.start.split(' ')[0];
          const dateValue = {
            dayNameColor: ColourPalette.light.textBlack,
            dayNumberColor: ColourPalette.light.textBlack,
          };
          return { ...acc, [dateKey]: dateValue };
        }, {});

        return highlightedDates;
      }

      return {}
    },
    [visits]
  );

  const isTodayIncluded = useMemo(() => {
    const today = getISOCurrentDate();
    const todayKey = today.split(' ')[0];
    return highlightDates.hasOwnProperty(todayKey)
  }, [visits])

  return (
    <TimelineCalendar
      ref={calendarRef}
      viewMode={calendarMode}
      events={visits}
      onLongPressEvent={onLongPressEvent}
      selectedEvent={selectedEvent}
      onEndDragSelectedEvent={onVisitDrop}
      allowPinchToZoom
      initialTimeIntervalHeight={100}
      onPressEvent={handleEventPressed}
      hourFormat="H:mm"
      timeInterval={60}
      editEventGestureEnabled={true}
      onPressOutBackground={onPressCancel}
      calendarWidth={calendarWidth}
      onChange={(data: any) => {
        onTimelineCalendarChange(data);
      }}
      highlightDates={highlightDates}
      renderSelectedEventContent={(event: PackedEvent) => {
        return (
          <RenderEvents
            isActive={true}
            event={event}
            isDay={calendarMode == VISIT_CALENDAR_DROPDOWN[0].value}
          />
        );
      }}
      renderEventContent={(event: PackedEvent) => {
        return (
          <RenderEvents
            isActive={false}
            event={event}
            isDay={calendarMode == VISIT_CALENDAR_DROPDOWN[0].value}
          />
        );
      }}
      isShowHeader={
        calendarMode === VISIT_CALENDAR_DROPDOWN[0].value ? false : true
      }
      theme={{
        dragHourContainer: {
          backgroundColor: ColourPalette.light.white,
          borderColor: '#001253',
        },
        dragHourText: { color: '#001253' },
        //Today style
        todayName: {
          color: isTodayIncluded ? ColourPalette.light.darkBlue : ColourPalette.light.disabledBlue,
          fontWeight: 'bold',
        },
        todayNumber: {
          color: isTodayIncluded ? ColourPalette.light.darkBlue : ColourPalette.light.disabledBlue,
          fontWeight: 'bold',
        },
        todayNumberContainer: {
          backgroundColor: ColourPalette.light.white,
          width: '50%',
        },

        //Normal style
        dayName: { color: ColourPalette.light.secondaryGrey },
        dayNumber: { color: ColourPalette.light.secondaryGrey },
      }}
      // End Optional

      // Custom edit indicator
      EditIndicatorComponent={
        <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.8)' }} />
      }
      isLoading={loading}
    />
  );
};

export default CalendarComponent;
