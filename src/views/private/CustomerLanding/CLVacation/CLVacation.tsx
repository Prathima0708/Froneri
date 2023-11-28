import View from 'src/components/View';
import Text from 'src/components/Text';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import CLLeftMenuComponent from 'src/components/CustomerLanding/CLLeftMenuComponent';
import { CUSTOMER_LANDING_SCREENS, VACATIONS_TYPES } from 'src/utils/Constant';
import Card from 'src/components/Card';
import CLVacationsTopTabComponent from 'src/components/CustomerLanding/CLVacations/CLVacationsTopTabComponent';
import { images } from 'src/assets/Images';
import RenderVacations from 'src/components/CustomerLanding/CLVacations/RenderVacations';
import VacationModalComponent from 'src/components/CustomerLanding/CLVacations/VacationModalComponent';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import CLVacationController from 'src/controller/CLVacationController';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import { toast } from 'src/utils/Util';

const CLVacation = () => {
  const [vacationTabValue, setVacationTabValue] = useState(
    VACATIONS_TYPES.ALL_VACATIONS,
  );
  const [loading, setLoading] = useState(false);
  const [isVacationModalVisible, setIsVacationModalVisible] = useState(false);
  const [isNewVacation, setIsNewVacation] = useState(false);
  const [vacationData, setVacationData] = useState([]);
  const [selectedVacation, setSelectedVacation] = useState({});

  useEffect(() => {
    setLoading(true);
    handleCustomerVacations(vacationTabValue);
  }, []);

  const handleCustomerVacations = async (value: string) => {
    // get the CRCA Info always from local db
    CLVacationController.getCustomersAllVacations(value)
      .then(async (res: any) => {
        setVacationData(res);
        console.log('getCustomersAllVacations', res);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLVacation.tsx:28 ~ CLVacation.handleCustomersVacation ~ error:',
          error,
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreateUpdateCustomerVacation = async (
    obj: any,
    isNewVacation: boolean,
  ) => {
    CLVacationController.createOrUpdateCustomerVacation(obj)
      .then(async (res: any) => {
        if (isNewVacation) {
          handleBackPress();
        }
        handleCustomerVacations(vacationTabValue);
        console.log('getCustomersAllVacations', res);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLVacation.tsx:28 ~ CLVacation.handleCustomersVacation ~ error:',
          error,
        );
      });
  };

  const handleCustomerVacationDelete = (obj: any) => {
    if (obj.idCustomerVacations === undefined) {
      toast.error({
        message: 'Something went wrong',
      })
      return;
    }
    CLVacationController.deleteCustomerVacation(obj.idCustomerVacations)
      .then(async (res: any) => {
        handleBackPress();
        handleCustomerVacations(vacationTabValue);
        console.log('getCustomersAllVacations', res);
      })
      .catch(error => {
        console.log(
          '🚀 ~ file: CLVacation.tsx:28 ~ CLVacation.handleCustomersVacation ~ error:',
          error,
        );
      });
  };

  const handleOnTabPress = (value: string) => {
    handleCustomerVacations(value);
    setVacationTabValue(value);
  };

  const handleOnVacationPress = (item: any) => {
    setSelectedVacation(item);
    setIsVacationModalVisible(true);
  };

  const handleBackPress = () => {
    setIsVacationModalVisible(false);
    setIsNewVacation(false);
  };

  const handleAddVacation = () => {
    setSelectedVacation({});
    setIsVacationModalVisible(true);
    setIsNewVacation(true);
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <CustomerLandingHeader />
      <View flex row>
        <CLLeftMenuComponent activeTab={CUSTOMER_LANDING_SCREENS.VACATION} />
        {loading ? (
          <CustomerLandingLoader />
        ) : (
          <Card flex-1 marginR-v2 marginB-v2 padding-v4>
            <View row centerV spread>
              <CLVacationsTopTabComponent
                vacationsSelectedValue={vacationTabValue}
                handleChangeTab={handleOnTabPress}
              />

              <TouchableOpacity
                onPress={handleAddVacation}
                style={tw(
                  'bg-light-darkBlue rounded-md py-2 px-8 flex-row items-center',
                )}>
                <images.PlusIcon />
                <Text white text13R>
                  {'  '}
                  Add Vacation
                </Text>
              </TouchableOpacity>
            </View>
            {vacationData.length === 0 ? (
              <NoDataComponent
                title={
                  vacationTabValue === VACATIONS_TYPES.ALL_VACATIONS
                    ? 'No Vacations'
                    : 'No Past Vacations'
                }
                subTitle={
                  vacationTabValue === VACATIONS_TYPES.ALL_VACATIONS
                    ? 'No vacations created for this customer yet'
                    : 'No past vacations created for this customer yet'
                }
              />
            ) : (
              <View marginT-v4>
                <View row centerV paddingH-v4 marginB-v1>
                  <Text text13M textBlack flex marginR-v2>
                    From
                  </Text>
                  <Text text13M textBlack flex marginR-v2>
                    To
                  </Text>
                  <Text text13M textBlack flex-9 marginR-v2>
                    Remarks
                  </Text>
                </View>
                <FlatList
                  data={vacationData}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      <RenderVacations
                        item={item}
                        index={index}
                        onVacationPress={handleOnVacationPress}
                      />
                    );
                  }}
                />
              </View>
            )}
          </Card>
        )}
      </View>
      <VacationModalComponent
        isVacationModalVisible={isVacationModalVisible}
        isNewVacation={isNewVacation}
        onBackPress={handleBackPress}
        selectedVacation={selectedVacation}
        handleCreateUpdateCustomerVacation={handleCreateUpdateCustomerVacation}
        handleCustomerVacationDelete={handleCustomerVacationDelete}
        vacationData={vacationData}
        isPassVacation={vacationTabValue === VACATIONS_TYPES.PAST_VACATIONS}
      />
    </SafeAreaView>
  );
};

export default CLVacation;
