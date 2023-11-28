import View from 'src/components/View';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import { PROSPECT_LANDING_SCREENS } from 'src/utils/Constant';
import PLLeftMenuComponent from 'src/components/ProspectLanding/PLLeftMenuComponent/PLLeftMenuComponent';
import ProspectLandingHeader from 'src/components/Header/ProspectLandingHeader';
import Card from 'src/components/Card';
import Dropdown from 'src/components/DropDown';
import PLCAListingHeaderComponent from 'src/components/ProspectLanding/PLConditionAgreements/PLCAListingHeaderComponent';
import RenderConditionAgreement from 'src/components/ProspectLanding/PLConditionAgreements/RenderConditionAgreement';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import { useNavigation } from '@react-navigation/native';
import { pageNamePLCreateEditCA } from 'src/routes/Routes';
import { toast } from 'src/utils/Util';
import PLConditionAgreementController from 'src/controller/PLConditionAgreementController';
import { withAuthScreen } from 'src/hoc/withAuthScreen';

const PLConditionAgreements = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [createAgreementDropdown, setCreateAgreementDropdown] = useState([]);
  const [filterDropdown, setFilterDropdown] = useState([]);
  const [filterValue, setFilterValue] = useState(0);

  const [conditionAggrementInputData, setConditionAggrementInputData] =
    useState([]);

  useEffect(() => {
    getScreenData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getScreenData();
    });

    return unsubscribe;
  }, []);

  const getScreenData = async () => {
    setLoading(true);
    await getCountryCode();
  };

  const getCountryCode = async () => {
    //Fetching dropdown value for customer country code
    PLConditionAgreementController.getCADropdownValues()
      .then(async res => {
        if (res.length > 0) {
          const modifiedArray = res.map((obj: any) => ({
            ...obj,
            label: 'Create Condition',
          }));
          setCreateAgreementDropdown(modifiedArray);
        }
        if (res.length > 1) {
          let newObj = {
            description: 'All',
            idContractType: 100,
          };
          res.unshift(newObj);
          setFilterValue(100);
          setFilterDropdown(res);
          await getConditionAgreementListingData(res, false, 0);
        } else if (res.length > 0) {
          setFilterDropdown(res);
          setFilterValue(res[0].idContractType);
          await getConditionAgreementListingData(res, false, 0);
        } else {
          await getConditionAgreementListingData([], false, 0);
        }
      })
      .catch(async err => {
        console.log('drop down err is', err);
        await getConditionAgreementListingData([], false, 0);
        toast.error({
          message: 'Something went wrong',
        });
      });
  };

  const getConditionAgreementListingData = async (
    dropdownArray: any,
    isFilterApplied: boolean,
    idContractType: number,
  ) => {
    try {
      const screenData =
        await PLConditionAgreementController.getConditionalAgreement(
          isFilterApplied,
          idContractType,
        );

      console.log('screenData ___>>>>>', screenData);

      if (screenData.length > 0) {
        const mappedArray = screenData.map((item1: any) => {
          // Find the item in array2 with matching idContractType
          const matchingItem = dropdownArray.find(
            (item2: any) => item2.idContractType === item1.idContractType,
          );
          console.log('matchingItem', filterDropdown, matchingItem);
          // If a matching item is found, add its description to the object, otherwise, keep the object as is
          if (matchingItem) {
            return {
              ...item1, // Keep the existing properties from item1
              description: matchingItem.description, // Add the description property from matchingItem
            };
          } else {
            return {
              ...item1,
              description: '',
            };
          }
        });

        setConditionAggrementInputData(mappedArray);
      } else {
        setConditionAggrementInputData([]);
      }
      setLoading(false);
    } catch (error) {
      console.log('Error while pre populate Screen data :>> ', error);
      toast.error({
        message: 'Something went wrong',
      });
      setLoading(false);
    }
  };

  const handleFilterDropdown = (item: any) => {
    setFilterValue(item.idContractType);
    if (item.idContractType === 100) {
      getConditionAgreementListingData(filterDropdown, false, 0);
    } else {
      getConditionAgreementListingData(
        filterDropdown,
        true,
        item.idContractType,
      );
    }
  };

  const handleCaTypeDropdown = (item: any) => {
    console.log('item', item);
    navigation.navigate(pageNamePLCreateEditCA as never, {
      screenMode: 'Create',
      type: item ?? '',
    } as never);
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <ProspectLandingHeader
        screen="PLConditionAgreement"
        createAgreementDropdown={createAgreementDropdown}
        handleCaTypeDropdown={handleCaTypeDropdown}
        fromPLP={true}
      />
      <View flex row>
        <PLLeftMenuComponent
          activeTab={PROSPECT_LANDING_SCREENS.CONDITION_AGGREMENTS}
        />
        <Card flex-1 marginR-v2 marginB-v2 padding-v4>
          <View flex>
            {loading ? null : (
              <View right>
                <Dropdown
                  extraStyle={'w-223px'}
                  extraSelectedTextStyle={'w-4/5'}
                  placeholder={''}
                  data={filterDropdown}
                  value={filterValue}
                  labelField={'description'}
                  valueField={'idContractType'}
                  onChange={handleFilterDropdown}
                />
              </View>
            )}
            {loading ? (
              <View flex centerH centerV>
                <ActivityIndicator size="large" color={'black'} />
              </View>
            ) : conditionAggrementInputData.length === 0 ? (
              <NoDataComponent
                title="No Agreements Created"
                subTitle="Please Create Agreement"
              />
            ) : (
              <View marginT-v4 flex>
                <PLCAListingHeaderComponent />
                <FlatList
                  data={conditionAggrementInputData}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item, index }) => {
                    return (
                      <RenderConditionAgreement
                        item={item}
                        index={index}
                        lastItem={
                          conditionAggrementInputData.length - 1 === index
                        }
                      />
                    );
                  }}
                />
              </View>
            )}
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default withAuthScreen(PLConditionAgreements, true);
