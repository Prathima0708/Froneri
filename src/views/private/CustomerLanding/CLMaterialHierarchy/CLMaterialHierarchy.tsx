import View from 'src/components/View';
import Text from 'src/components/Text';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { images } from 'src/assets/Images';
import { useNavigation, useRoute } from '@react-navigation/native';
import { tw } from 'src/tw';
import Card from 'src/components/Card';
import InputText from 'src/components/InputText';
import { ColourPalette } from 'src/styles/config/ColoursStyles';
import RenderMaterialHierarchy from 'src/components/CustomerLanding/CLMaterialHierarchy/RenderMaterialHierarchy';
import CLTurnoverController from 'src/controller/CLTurnoverController';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import { toast } from 'src/utils/Util';

const CLMaterialHierarchy = () => {
  const [materialNumber, setMaterialNumber] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialHierarchy, setMaterialHierarchy] = useState('');
  const [nodeName, setNodeName] = useState('');
  const [radioData, setRadioData] = useState('');
  const [materialHierarchyData, setMaterialHierarchyData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [proceedBtnEnable, setProceedBtnEnable] = useState(false);
  const [isExpandAll, setIsExpandAll] = useState(false);
  const [materialHierarchyErrorMsg, setMaterialHierarchyErrorMsg] =
    useState('');
  const [materialDescriptionErrorMsg, setMaterialDescriptionErrorMsg] =
    useState('');

  const navigation = useNavigation();
  const route = useRoute<any>();

  useEffect(() => {
    getMaterialHierarchyData();
  }, []);

  useEffect(() => {
    if (nodeName) {
      setProceedBtnEnable(true);
    } else {
      setProceedBtnEnable(false);
    }
  }, [nodeName]);

  const getMaterialHierarchyData = (isClearFilter: boolean = false) => {
    const filter = {
      materialHierarchy: isClearFilter ? '' : materialHierarchy,
      materialNumber: isClearFilter ? '' : materialNumber,
      materialDescription: isClearFilter ? '' : materialDescription,
    };
    setLoading(true);
    CLTurnoverController.getMaterialHierarchy(filter)
      .then(res => {
        console.log('Material hierarchy data :>> ', res);
        setMaterialHierarchyData(res);
        setLoading(false);
      })
      .catch(err => {
        toast.error({
          message: 'Something went wrong',
        })
        console.log('Error while fetching material hierarchy', err);
        setLoading(false);
        setMaterialHierarchyData([]);
      });
  };

  const handleGoBack = () => {
    if (route.params && route.params.handleMaterialHierarchy) {
      route.params.handleMaterialHierarchy(route.params.materialHierarchy);
    }
    navigation.goBack();
  };

  const handleProceed = () => {
    if (route.params && route.params.handleMaterialHierarchy) {
      route.params.handleMaterialHierarchy(radioData);
    }
    navigation.goBack();
  };

  const handleMaterialNumber = (text: string) => {
    setMaterialNumber(text);
  };

  const handleMaterialDescription = (text: string) => {
    setMaterialDescription(text);
  };

  const handleMaterialHierarchy = (text: string) => {
    setMaterialHierarchy(text);
  };

  const handleClearFilter = () => {
    Keyboard.dismiss();
    setIsExpandAll(false);
    setMaterialNumber('');
    setMaterialDescription('');
    setMaterialHierarchy('');
    getMaterialHierarchyData(true);
    setNodeName('');
    setRadioData('');
  };

  const handleFilterHierarchy = () => {
    setMaterialHierarchyErrorMsg('');
    setMaterialDescriptionErrorMsg('');
    if (materialHierarchy != '' && materialHierarchy.length < 3) {
      setMaterialHierarchyErrorMsg('Characters length cannot be less then 3');
    }
    if (materialDescription != '' && materialDescription.length < 3) {
      setMaterialDescriptionErrorMsg('Characters length cannot be less then 3');
    }
    if (
      (materialHierarchy != '' && materialHierarchy.length > 2) ||
      materialNumber != '' ||
      (materialDescription != '' && materialDescription.length > 2)
    ) {
      setIsExpandAll(true);
    } else {
      setIsExpandAll(false);
    }
    if (
      (materialHierarchy != '' && materialHierarchy.length < 3) ||
      (materialDescription != '' && materialDescription.length < 3)
    ) {
      return;
    }

    Keyboard.dismiss();

    getMaterialHierarchyData();
    setNodeName('');
    setRadioData('');
  };

  const handleMaterialHierarchyNode = (data: string, value: string) => {
    setNodeName(data);
    setRadioData(value);
  };

  return (
    <SafeAreaView style={tw('flex-1')}>
      <View row centerV margin-v2>
        <TouchableOpacity onPress={handleGoBack}>
          <images.DefaultLeftArrowIcon />
        </TouchableOpacity>
        <Text text18M textBlack marginL-v3 marginT-v03>
          Material Hierarchy
        </Text>
      </View>
      <Card flex-1 marginH-v2 marginB-v2 padding-v4>
        <View row>
          <View flex-3 marginR-v2>
            <InputText
              title="Material Hierarchy"
              value={materialHierarchy}
              placeholder="Enter Material Hierarchy or Select from..."
              onChangeText={handleMaterialHierarchy}
              errorMsg={materialHierarchyErrorMsg}
            />
          </View>
          <View flex-2 marginR-v2>
            <InputText
              title="Material Number"
              value={materialNumber}
              placeholder="Enter Material Number"
              onChangeText={handleMaterialNumber}
              keyboardType="numeric"
            />
          </View>
          <View flex-5>
            <InputText
              title="Material Description"
              value={materialDescription}
              placeholder="Enter Material Description"
              onChangeText={handleMaterialDescription}
              errorMsg={materialDescriptionErrorMsg}
            />
          </View>
          <TouchableOpacity
            onPress={handleClearFilter}
            style={tw(
              'justify-center items-center rounded-md mx-2 mt-6 h-36px',
            )}>
            <Text darkBlue marginV-v06 marginH-v2>
              Clear Filter
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleFilterHierarchy}
            style={tw(
              'flex-row items-center rounded-md border-default border-light-darkBlue px-8 mt-6 h-36px',
            )}>
            <images.FilterBlueIcon />
            <Text darkBlue marginL-v1>
              Filter
            </Text>
          </TouchableOpacity>
        </View>
        <View
          flex
          marginT-v4
          paddingT-v4
          style={tw('border-t-default border-light-lavendar')}>
          <View right>
            <View>
              <TouchableOpacity
                style={tw(
                  `${proceedBtnEnable
                    ? 'bg-light-darkBlue'
                    : 'bg-light-white1 border-default border-light-lavendar'
                  } items-center py-2 px-8 rounded-md`,
                )}
                onPress={handleProceed}
                disabled={!proceedBtnEnable}>
                <Text
                  text13R
                  textBlack
                  marginL-v1
                  style={tw(
                    `${proceedBtnEnable ? 'text-light-white' : 'text-light-grey1'
                    }`,
                  )}>
                  Proceed with Selection
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {loading ? (
            <View flex center>
              <ActivityIndicator
                color={ColourPalette.light.darkBlue}
                size="large"
              />
            </View>
          ) : (
            <FlatList
              data={materialHierarchyData}
              keyExtractor={item => item.id}
              renderItem={({ item }: any) => {
                return (
                  <RenderMaterialHierarchy
                    key={item.id}
                    node={item}
                    handleMaterialHierarchyNode={handleMaterialHierarchyNode}
                    nodeName={nodeName}
                    level={0}
                    isExpandAll={isExpandAll}
                  />
                );
              }}
              ListEmptyComponent={
                <View marginT-v7 center style={tw('h-full')}>
                  <NoDataComponent
                    title="No data"
                    subTitle="No data for the selected filters"
                  />
                </View>
              }
            />
          )}
        </View>
      </Card>
    </SafeAreaView>
  );
};

export default CLMaterialHierarchy;
