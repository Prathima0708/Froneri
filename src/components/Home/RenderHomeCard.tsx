import React from 'react';
import View from 'src/components/View';
import Text from 'src/components/Text';
import { images } from 'src/assets/Images';
import { tw } from 'src/tw';
import { StyleSheet } from 'react-native';
import Card from 'src/components/Card';
import { pageNameHome } from 'src/routes/Routes';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import { TouchableWithoutFeedback } from 'react-native';
import { toast } from 'src/utils/Util';
import { CommonActions } from '@react-navigation/native';

interface RenderHomeCardProps {
  title: string;
  delegation?: string;
  subTitle1: string;
  subTitle1Value: string;
  subTitle2?: string;
  subTitle2Value?: string;
  subTitle3?: string;
  subTitle3Value?: string;
  VisitImage: any;
  pageName: string;
  navigation: any;
}
const RenderHomeCard = (props: RenderHomeCardProps) => {
  const isInitialSyncDone = useAppSelector(
    (state: RootState) => state.syncStatus.isInitialSyncDone,
  );

  const {
    title,
    delegation,
    subTitle1,
    subTitle1Value,
    subTitle2,
    subTitle2Value,
    subTitle3,
    subTitle3Value,
    VisitImage,
    pageName,
    navigation,
  } = props;

  const handleNavigation = () => {
    if (!isInitialSyncDone) {
      toast.info({
        message: 'Please sync the data first',
      })
      return;
    }
    // Reset the stack to the home screen and then navigate to the page
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: pageNameHome },
          {
            name: pageName,
            params: { screen: pageNameHome }
          },
        ],
      })
    )
  };

  return (
    <TouchableWithoutFeedback style={tw('flex-1')} onPress={handleNavigation}>
      <Card cardStyle={tw('flex-1')}>
        <View padding-v4>
          <View row spread>
            <View row centerV>
              <Text textBlack text18M>
                {title}
              </Text>
              {delegation && Number(delegation) > 0 ? (
                <View
                  centerV
                  paddingH-5
                  style={tw('rounded-md ml-3 bg-light-lightGrey')}
                  row
                >
                  <Text text13R textBlack>
                    {delegation + " "}
                  </Text>
                  <Text text13R textBlack>
                    label.general.delegation
                  </Text>
                </View>
              ) : null}
            </View>
            <images.ArrowRightIcon />
          </View>

          <View>
            <View row centerV marginT-v06>
              <View flex-3>
                <Text textLight text13R>
                  {subTitle1}
                </Text>
              </View>
              <Text flex textLight text13R style={tw('text-right')}>
                {subTitle1Value}
              </Text>
              <View flex />
            </View>
            <View row centerV marginT-v06>
              <View flex-3>
                <Text textLight text13R>
                  {subTitle2}
                </Text>
              </View>
              <Text flex textLight text13R style={tw('text-right')}>
                {subTitle2Value}
              </Text>
              <View flex />
            </View>
            {subTitle3 && (
              <View row centerV marginT-v06>
                <View flex-3>
                  <Text textLight text13R>
                    {subTitle3}
                  </Text>
                </View>
                <Text flex textLight text13R style={tw('text-right')}>
                  {subTitle3Value}
                </Text>
                <View flex />
              </View>
            )}
          </View>
        </View>
        <VisitImage style={styles.cardIcons} width={45} />
      </Card>
    </TouchableWithoutFeedback>
  );
};

export default RenderHomeCard;

const styles = StyleSheet.create({
  cardIcons: {
    position: 'absolute',
    right: 0,
    bottom: -4,
  },
});
