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

const AllTasks: FC = () => {
  const navigation = useNavigation();
  const {theme} = useContext(AppContext);

  const [activeTasksTab, setActiveTasksTab] = useState(false);

  const handleTaskNavigation = () => {
    navigation.goBack();
  };

  return (
    <View flex style={tw('bg-light-lightGrey')}>
      <TasksHeader
        heading="All Tasks"
        subHeading="Today's Tasks"
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
            <AllTasksComponent />
          </Card>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AllTasks;
