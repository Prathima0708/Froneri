import React, { useState } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { images } from 'src/assets/Images';
import { TouchableOpacity } from 'react-native';
import { pageNameCustomerSearch, pageNameHome, pageNameVisits } from 'src/routes/Routes';
import ExportCalendarModal from 'src/components/Visits/ExportCalendarModal';
import { formatDate } from 'src/utils/CommonUtil';
import VisitsController from 'src/controller/VisitsController';
import ApiUtil from 'src/services/ApiUtil';
import { toast } from 'src/utils/Util';

const VisitsHeader = () => {
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [loading, setLoading] = useState(false)

  const navigation = useNavigation<any>();

  const handleDrawer = () => {
    navigation.openDrawer();
  };

  const handleCustomerSearch = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 2,
        routes: [
          { name: pageNameHome },
          {
            name: pageNameVisits,
          },
          {
            name: pageNameCustomerSearch,
            params: {
              screen: pageNameVisits,
            }
          }
        ],
      })
    );
  };

  const handleExportModalVisibility = async () => {
    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
    if (!isOnline.status) {
      toast.info({
        message: isOnline.errMsg,
      })
      return;
    }

    setIsExportModalVisible(!isExportModalVisible);
  };

  const handleOnPressExport = (visitedFrom: string, visitedTo: string) => {
    setLoading(true)
    if (visitedTo < visitedFrom) {
      toast.error({
        message: "message.visits.visited_validation_error",
      })
      setLoading(false)
      return
    }

    const formattedVisitedFrom = formatDate(visitedFrom);
    const formattedVisitedTo = formatDate(visitedTo);

    VisitsController.exportVisits(formattedVisitedFrom, formattedVisitedTo).then((res) => {
      console.log('Export visit res :>> ', res);
      setIsExportModalVisible(false);
      if (res.success) {

        toast.success({
          message: res.statusText,
        })
      } else {
        toast.error({
          message: res.statusText,
        })
      }

    }).catch((error) => {
      setIsExportModalVisible(false);
      toast.error({
        message: 'Something went wrong',
      })
      console.log('Error while exporting visits :>> ', error);
    }).finally(() => {
      setLoading(false)
    })
  };

  return (
    <View centerH style={tw('flex-row p-12px justify-between')}>
      <View centerH centerV style={tw('flex-row')}>
        <TouchableOpacity onPress={handleDrawer}>
          <images.HamburgerIcon />
        </TouchableOpacity>
        <Text text26 textBlack marginT-v1 style={tw('ml-3')}>
          label.general.visits
        </Text>
      </View>
      <View row centerV>
        <TouchableOpacity
          style={tw(
            'flex-row items-center justify-center bg-light-white py-6px px-10 rounded-md',
          )}
          onPress={handleExportModalVisibility}>
          <images.ExportIcon />
          <Text text13R textBlack marginL-v03>
            label.visits.export
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw(
            'bg-light-darkBlue rounded-md py-2 px-8 flex-row items-center ml-6',
          )}
          onPress={handleCustomerSearch}>
          <images.PlusIcon />
          <Text white text13R>
            {'  '}
          </Text>
          <Text white text13R>
            label.general.create
          </Text>
        </TouchableOpacity>
      </View>
      <ExportCalendarModal
        isModalVisible={isExportModalVisible}
        onPressExport={handleOnPressExport}
        onPressCancel={handleExportModalVisibility}
        loading={loading}
      />
    </View>
  );
};

export default VisitsHeader;
