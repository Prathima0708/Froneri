import View from 'src/components/View';
import React from 'react';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';
import {ColourPalette} from 'src/styles/config/ColoursStyles';

const CRCAGraph = (props: any) => {
  const {crcaType, visitingHours, openingHours, backgroundBarHours} = props;

  const yAxisStartValue = 6;
  const yAxisEndValue = 20;

  const formatTick = (tick: any) =>
    `${tick.toString().length == 1 ? '0' : ''}${tick}:00`;

  let openingMorningTimeSlot = [];
  let openingAfternoonTimeSlot = [];
  let visitingMorningTimeSlot = [];
  let visitingAfternoonTimeSlot = [];
  if (openingHours.length > 0) {
    openingMorningTimeSlot = openingHours[0].morningTiming;
    openingAfternoonTimeSlot = openingHours[0].afternoonTiming;
  }
  if (visitingHours.length > 0) {
    visitingMorningTimeSlot = visitingHours[0].morningTiming;
    visitingAfternoonTimeSlot = visitingHours[0].afternoonTiming;
  }

  return (
    <View>
      <VictoryChart
        theme={VictoryTheme.material}
        width={550}
        height={300}
        domainPadding={{x: 20}}
        minDomain={{y: yAxisStartValue}}>
        <VictoryAxis
          dependentAxis
          invertAxis
          tickFormat={formatTick}
          style={{
            axis: {stroke: 'transparent'},
            ticks: {stroke: ColourPalette.light.offWhite},
          }}
        />
        <VictoryAxis
          crossAxis
          style={{
            axis: {stroke: 'transparent'},
            ticks: {stroke: 'transparent'},
          }}
        />
        {/* Closed bar */}
        <VictoryBar
          animate={{
            animationWhitelist: ['style', 'data'], // Try removing "size"
            onEnter: {
              duration: 500,
              before: () => ({opacity: 0.3, _y: 0}),
              after: (datum: any) => ({opacity: 1, _y: datum._y}),
            },
          }}
          barRatio={0.8}
          style={{
            data: {
              fill:
                crcaType == '2' || crcaType == '3'
                  ? ColourPalette.light.offWhite
                  : ColourPalette.light.grey6,
            },
          }}
          data={[
            {x: 'Mon', y: yAxisEndValue, y0: yAxisStartValue},
            {x: 'Tue', y: yAxisEndValue, y0: yAxisStartValue},
            {x: 'Wed', y: yAxisEndValue, y0: yAxisStartValue},
            {x: 'Thu', y: yAxisEndValue, y0: yAxisStartValue},
            {x: 'Fri', y: yAxisEndValue, y0: yAxisStartValue},
            {x: 'Sat', y: yAxisEndValue, y0: yAxisStartValue},
            {x: 'Sun', y: yAxisEndValue, y0: yAxisStartValue},
          ]}
        />
        {/* Background Bar of opening and visiting */}
        {backgroundBarHours.length > 0 ? (
          <VictoryBar
            animate={{
              animationWhitelist: ['style', 'data'], // Try removing "size"
              onEnter: {
                duration: 500,
                before: () => ({opacity: 0.3, _y: 0}),
                after: (datum: any) => ({opacity: 1, _y: datum._y}),
              },
            }}
            barRatio={0.8}
            style={{
              data: {fill: ColourPalette.light.offWhite},
            }}
            data={backgroundBarHours}
          />
        ) : null}
        {/* Opening morning Hrs */}

        {(crcaType == '1' || crcaType == '2') &&
          openingMorningTimeSlot.length > 0 && (
            <VictoryBar
              barRatio={0.8}
              style={{
                data: {fill: ColourPalette.light.lightBlue4},
              }}
              animate={{
                animationWhitelist: ['style', 'data'], // Try removing "size"
                onEnter: {
                  duration: 600,
                  before: () => ({opacity: 0.3, _y: 0}),
                  after: (datum: any) => ({opacity: 1, _y: datum._y}),
                },
              }}
              data={openingMorningTimeSlot}
            />
          )}
        {/* Opening afternoon Hrs */}
        {(crcaType == '1' || crcaType == '2') &&
          openingAfternoonTimeSlot.length > 0 && (
            <VictoryBar
              barRatio={0.8}
              style={{
                data: {fill: ColourPalette.light.lightBlue4},
              }}
              animate={{
                animationWhitelist: ['style', 'data'], // Try removing "size"
                onEnter: {
                  duration: 600,
                  before: () => ({opacity: 0.3, _y: 0}),
                  after: (datum: any) => ({opacity: 1, _y: datum._y}),
                },
              }}
              data={openingAfternoonTimeSlot}
            />
          )}
        {/* Visiting morning Hrs */}
        {(crcaType == '1' || crcaType == '3') &&
          visitingMorningTimeSlot.length > 0 && (
            <VictoryBar
              barRatio={0.8}
              style={{
                data: {fill: ColourPalette.light.lightBlue5},
              }}
              animate={{
                animationWhitelist: ['style', 'data'], // Try removing "size"
                onEnter: {
                  duration: 700,
                  before: () => ({opacity: 0.3, _y: 0}),
                  after: (datum: any) => ({opacity: 1, _y: datum._y}),
                },
              }}
              data={visitingMorningTimeSlot}
            />
          )}
        {/* Visiting afternoon Hrs */}
        {(crcaType == '1' || crcaType == '3') &&
          visitingAfternoonTimeSlot.length > 0 && (
            <VictoryBar
              barRatio={0.8}
              style={{
                data: {fill: ColourPalette.light.lightBlue5},
              }}
              animate={{
                animationWhitelist: ['style', 'data'], // Try removing "size"
                onEnter: {
                  duration: 700,
                  before: () => ({opacity: 0.3, _y: 0}),
                  after: (datum: any) => ({opacity: 1, _y: datum._y}),
                },
              }}
              data={visitingAfternoonTimeSlot}
            />
          )}
      </VictoryChart>
    </View>
  );
};

export default CRCAGraph;
