import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import Switch from 'src/components/Switch';
import { useNavigation } from '@react-navigation/native';
import { images } from 'src/assets/Images';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import BannerComponent from 'src/components/BannerComponent';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import { toast } from 'src/utils/Util';

const HomeHeader = (props: any) => {
  const { handleSync, handleFlightMode } = props;
  const navigation = useNavigation<any>();

  const [bannerMessage, setBannerMessage] = useState(
    'Perform a Full Sync to view visits, tasks and more',
  );
  const isInitialSyncDone = useAppSelector(
    (state: RootState) => state.syncStatus.isInitialSyncDone,
  );
  const isFlightModeEnabled = useAppSelector(
    (state: RootState) => state.userContext.isFlightModeEnabled,
  );

  const handleDrawer = () => {
    navigation.openDrawer();
  };

  const handleSyncPressed = async () => {
    isInitialSyncDone
      ? toast.info({
        message: 'msg.home.sync_done',
      })
      : handleSync && handleSync();
  };

  return (
    <View>
      <View centerH style={tw('flex-row p-12px justify-between')}>
        <View centerH centerV style={tw('flex-row')}>
          <TouchableOpacity onPress={handleDrawer}>
            <images.HamburgerIcon />
          </TouchableOpacity>
          <Text text26 textBlack marginT-v1 style={tw('ml-3')}>
            label.general.home
          </Text>
        </View>
        <View style={tw('flex-row justify-center items-center mr-25px')}>
          <Text textLight style={styles.toggleText}>
            label.general.flight_mode
          </Text>
          <Switch
            offColor={ColourPalette.light.greyCloud}
            onColor={ColourPalette.light.darkBlue}
            thumbColor={ColourPalette.light.white}
            onValueChange={handleFlightMode}
            value={isFlightModeEnabled}
            style={{ marginRight: 45 }}
          />
          <TouchableOpacity onPress={handleSyncPressed}>
            <images.SyncIcon height={20} width={20} />
            {/* <View style={tw('absolute')}>
            <View
              center
              bg-darkBlue
              style={[tw('w-5 h-5 rounded-full'), {top: -7, right: -7}]}
              paddingB-2>
              <Text white text12R>
                3
              </Text>
            </View>
          </View> */}
          </TouchableOpacity>
        </View>
      </View>
      {isInitialSyncDone ? null : (
        <BannerComponent
          message={bannerMessage}
          handleSync={handleSyncPressed}
        />
      )}
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  toggleText: {
    color: ColourPalette.light.textLight,
    marginRight: 6,
    fontFamily: 'Heebo-Regular',
  },
});
