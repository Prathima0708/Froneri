import React, {useState, useContext, FC} from 'react';
import {SafeAreaView} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import View from 'src/components/View';

import Card from 'src/components/Card';

import {tw} from 'src/tw';

import {AppContext} from 'src/provider/AppProvider';

import TasksHeader from 'src/components/Header/TasksHeader';
import TodaysTasksComponent from 'src/components/Tasks/TodaysTasks/TodaysTasksCompoenent';
import AllTasksComponent from 'src/components/Tasks/AllTasks/AllTasksComponent';
import {pageNameAllTasks} from 'src/routes/Routes';

const TodaysTasks: FC = () => {
  const navigation = useNavigation();
  const {theme} = useContext(AppContext);

  const handleTaskNavigation = () => {
    navigation.navigate(pageNameAllTasks as never);
  };

  return (
    <View flex style={tw('bg-light-lightGrey')}>
      <TasksHeader
        heading="Today's Tasks"
        subHeading="All Tasks"
        handleTaskNavigation={handleTaskNavigation}
      />
      <SafeAreaView style={tw('flex-1 pr-6 pl-6  pb-6  ')}>
        <View
          center
          width={'100%'}
          style={tw(`flex-1 bg-${theme}-white rounded-12px `)}>
          <Card
            flex-1
            marginH-v2
            marginB-v3
            padding-v02
            cardStyle={tw('mt-10px flex-row')}>
            <TodaysTasksComponent />
          </Card>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TodaysTasks;
