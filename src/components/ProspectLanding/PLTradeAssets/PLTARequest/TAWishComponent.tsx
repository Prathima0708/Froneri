import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import View from 'src/components/View';
import Text from 'src/components/Text';

import TAWishListingHeaderComponent from './TAWishListingHeaderComponent';
import RenderTAWishComponent from './RenderTAWishComponent';

import { tw } from 'src/tw';

import { images } from 'src/assets/Images';
import { toast } from 'src/utils/Util';
import { useRoute } from '@react-navigation/native';

interface TAWishComponentProps {
  taWishData: any;
  setTaWishData: any;
  designDropdownData: any;
  taWishLimit: any;
  getTADescriptionDropdownData: any;
  initialDescriptionDropdownData: any;
  isEditable: boolean;
  setIsEditable: any;
  areTaWishEditable: boolean;
  taTakeOverData: any;
}

const TAWishComponent = (props: TAWishComponentProps) => {
  const { taWishData, setTaWishData, designDropdownData, taWishLimit, getTADescriptionDropdownData, initialDescriptionDropdownData, isEditable, setIsEditable, areTaWishEditable, taTakeOverData } = props

  const route = useRoute<any>();

  const numericFields = ['quantity', 'expectedTurnover', 'price']

  const [showAddButton, setShowAddButton] = useState(true);

  useEffect(() => {
    if (!areTaWishEditable) {
      setShowAddButton(false);
    } else if (route.params?.isEditable && taWishLimit === 1 && taTakeOverData.length > 0) {
      setShowAddButton(false);
    } else if (taWishLimit === 1 && taWishData.length === 1) {
      setShowAddButton(false);
    } else {
      setShowAddButton(true);
    }
  }, [taWishData, taWishLimit, areTaWishEditable])


  const onAddTaPress = () => {
    setTaWishData((prevData: any) => ([
      ...prevData,
      {
        taDescription: "",
        materialNumber: "",
        design: "",
        quantity: "",
        expectedTurnover: "",
        price: "",
        descriptionDropdownData: initialDescriptionDropdownData
      }
    ]))

    if (!isEditable) {
      setIsEditable(true)
    }
  }

  const onDeleteTaPress = (index: number) => {
    setTaWishData((prevData: any) => {
      const newData = [...prevData]
      newData.splice(index, 1)
      return newData
    })

    if (!isEditable) {
      setIsEditable(true)
    }
  }

  const searchDescriptionDropdownData = async (searchText: string, index: number) => {
    try {
      const descriptionDropdownData = await getTADescriptionDropdownData(searchText)
      setTaWishData((prevData: any) => {
        const newData = [...prevData]
        newData[index].descriptionDropdownData = descriptionDropdownData
        return newData
      })
    } catch (error) {
      console.log('error while searching dropdown description :>> ', error);
      toast.error({
        message: "Something went wrong"
      })

      setTaWishData((prevData: any) => {
        const newData = [...prevData]
        newData[index].descriptionDropdownData = []
        return newData
      })
    }
  }

  const handleInputChange = (fieldName: string, index: number) => async (value: any) => {
    try {
      if (fieldName === 'taDescription') {
        setTaWishData((prevData: any) => {
          const newData = [...prevData]
          newData[index].taDescription = value?.description || ""
          newData[index].materialNumber = value?.materialNumber ? value.materialNumber.toString() : ""
          newData[index].expectedTurnover = value?.minimumTurnover ?? ""
          newData[index].price = value?.price ? String(value?.price) : ""
          newData[index].design = value?.brand ?? ""
          return newData
        })
      } else if (fieldName === 'design') {
        setTaWishData((prevData: any) => {
          const newData = [...prevData]
          newData[index].design = value.discoveryListValuesId
          newData[index]['designError'] = ""
          return newData
        })
      }
      else if (numericFields.includes(fieldName)) {
        setTaWishData((prevData: any) => {
          const newData = [...prevData]
          newData[index][fieldName] = value.replace(/\D/g, '')
          newData[index][`${fieldName}Error`] = ""
          return newData
        })
      }
      else {
        if (value.length >= 8) {
          const rowData = await getTADescriptionDropdownData("", value)
          if (rowData.length > 0) {
            setTaWishData((prevData: any) => {
              const newData = [...prevData]
              const isDataPresent = newData[index].descriptionDropdownData.find((item: any) => item.materialNumber === rowData[0].materialNumber)

              if (!isDataPresent) {
                newData[index].descriptionDropdownData = [...newData[index].descriptionDropdownData, rowData[0]]
              }

              newData[index].taDescription = rowData[0]?.description || ""
              newData[index].materialNumber = value
              newData[index].expectedTurnover = rowData[0]?.minimumTurnover ?? ""
              newData[index].price = rowData[0]?.price ? String(rowData[0]?.price) : ""
              newData[index].design = rowData[0]?.brand ?? ""
              return newData
            })
          } else {
            setTaWishData((prevData: any) => {
              const newData = [...prevData]
              newData[index][fieldName] = value
              return newData
            })
          }
        } else {
          setTaWishData((prevData: any) => {
            const newData = [...prevData]
            newData[index][fieldName] = value
            return newData
          })
        }
      }

      if (!isEditable) {
        setIsEditable(true)
      }
    } catch (error) {
      console.log('error while changing :>> ', error);
    }
  };

  return (
    <View flex marginT-v4>
      <View marginT-v1 style={tw('flex-row justify-between')}>
        <Text text18M textBlack>
          TA Wish
        </Text>
      </View>
      {taWishData.length > 0 && <View marginT-v3>
        <TAWishListingHeaderComponent isEditable={areTaWishEditable} />
      </View>}
      <View flex style={tw('border-light-grey1')}>
        {taWishData.length > 0 ? <FlashList
          data={taWishData}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <RenderTAWishComponent
                item={item}
                index={index}
                lastItem={taWishData.length - 1 === index}
                onDeleteTaPress={onDeleteTaPress}
                designDropdownData={designDropdownData}
                searchDescriptionDropdownData={searchDescriptionDropdownData}
                handleInputChange={handleInputChange}
                isEditable={areTaWishEditable}
              />
            );
          }}
          extraData={areTaWishEditable}
          keyboardShouldPersistTaps="always"
          estimatedItemSize={59}
        /> : null}
      </View>
      {showAddButton && <View flex style={tw('items-start justify-start')}>
        <TouchableOpacity
          style={tw('flex-row items-center p-3 mt-3')}
          onPress={onAddTaPress}>
          <images.PlusIconWithBorder />
          <Text text13R marginL-v1 style={tw('text-light-darkBlue')}>
            Add TA Wish
          </Text>
        </TouchableOpacity>
      </View>}
      <View marginT-v4 style={tw('bg-light-lavendar h-px')} />
    </View>
  );
};

export default TAWishComponent;
