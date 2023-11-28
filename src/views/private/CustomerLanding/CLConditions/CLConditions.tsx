import View from 'src/components/View';
import { tw } from 'src/tw';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import CustomerLandingHeader from 'src/components/Header/CustomerLandingHeader';
import CLLeftMenuComponent from 'src/components/CustomerLanding/CLLeftMenuComponent';
import { CONDITION_FILTERS, CUSTOMER_LANDING_SCREENS } from 'src/utils/Constant';
import Card from 'src/components/Card';
import ConditionsTopTabComponent from 'src/components/CustomerLanding/CLConditions/ConditionsTopTabComponent';
import ConditionContractsComponent from 'src/components/CustomerLanding/CLConditions/ConditionContractsComponent';
import FinancialContractsComponent from 'src/components/CustomerLanding/CLConditions/FinancialContractsComponent';
import SalesDealsConditionsComponent from 'src/components/CustomerLanding/CLConditions/SalesDealsConditionsComponent';
import CLConditionsController from 'src/controller/CLConditionsController';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import { RootState, useAppSelector } from 'src/reducers/hooks';
import ApiUtil from 'src/services/ApiUtil';
import CustomerLandingLoader from 'src/components/SkeletonUi/CustomerLanding/CustomerLandingLoader';
import { toast } from 'src/utils/Util';

const CLConditions = () => {
  const [activeTab, setActiveTab] = useState(CONDITION_FILTERS[0].title);

  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const [conditionContracts, setConditionContracts] = useState([]);
  const [financialContracts, setFinancialContracts] = useState([]);
  const [salesDealsConditions, setSalesDealsConditions] = useState([]);

  const customerInfoData = useAppSelector(
    (state: RootState) => state.customerLanding.customerInfo,
  );

  useEffect(() => {
    handleConditions();
  }, []);

  const handleConditions = async () => {
    setLoading(true);
    /**
     * check customer is remote customer or not, if yes check the app status
     */
    const isRemoteCustomer = customerInfoData?.isCallApi
      ? customerInfoData?.isCallApi
      : false;
    const isOnline = await ApiUtil.getAppDeviceOnlineStatus();
    if (isRemoteCustomer && !isOnline.status) {
      console.log('isOnline.errMsg', isOnline.errMsg);
      setErrorMsg(isOnline.errMsg);
      setLoading(false);
      return;
    }
    // call offline / online api
    getAllContracts();
    getSalesDealsConditions();
  };

  const getAllContracts = () => {
    setLoading(true);
    CLConditionsController.getAllContracts()
      .then((contracts: any) => {
        console.log('contracts :>> ', contracts);

        setConditionContracts(contracts.contractsData);
        setFinancialContracts(contracts.fTypeContractsData);
      })

      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        })
        console.log('error while fetching contracts :>> ', error);
      })
      .finally(() => setLoading(false));
  };

  const getSalesDealsConditions = () => {
    setLoading(true);
    CLConditionsController.getSalesDealsConditions()
      .then((salesConditionsData: any) => {
        if (salesConditionsData.length === 0) {
          return;
        }

        console.log('salesConditionsData :>> ', salesConditionsData);

        setSalesDealsConditions(salesConditionsData);
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        })
        console.log('error while fetching sales conditions :>> ', error);
      })
      .finally(() => setLoading(false));
  };

  const handleConditionsSelectedValue = (data: string) => {
    setActiveTab(data);
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <CustomerLandingHeader />
      <View flex row>
        <CLLeftMenuComponent activeTab={CUSTOMER_LANDING_SCREENS.CONDITIONS} />
        <Card flex-1 marginB-v2 marginR-v2 padding-v4>
          {loading ? (
            <CustomerLandingLoader />
          ) : (
            <>
              <ConditionsTopTabComponent
                handleChangeTab={handleConditionsSelectedValue}
                conditionsSelectedValue={activeTab}
                conditionContractsData={conditionContracts}
                financialContractsData={financialContracts}
                salesDealsConditionData={salesDealsConditions}
              />
              {activeTab === CONDITION_FILTERS[0].title ? (
                conditionContracts.length > 0 ? (
                  <ConditionContractsComponent
                    conditionContractsData={conditionContracts}
                  />
                ) : (
                  <NoDataComponent
                    title={
                      errorMsg !== ''
                        ? errorMsg
                        : 'No data for condition contracts'
                    }
                  />
                )
              ) : activeTab === CONDITION_FILTERS[1].title ? (
                financialContracts.length > 0 ? (
                  <FinancialContractsComponent
                    financialContractsData={financialContracts}
                  />
                ) : (
                  <NoDataComponent
                    title={
                      errorMsg !== ''
                        ? errorMsg
                        : 'No data for financial contracts'
                    }
                  />
                )
              ) : salesDealsConditions.length > 0 ? (
                <SalesDealsConditionsComponent
                  salesDealsConditionData={salesDealsConditions}
                />
              ) : (
                <NoDataComponent
                  title={
                    errorMsg !== ''
                      ? errorMsg
                      : 'No data for sales deals conditions'
                  }
                />
              )}
            </>
          )}
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default CLConditions;
