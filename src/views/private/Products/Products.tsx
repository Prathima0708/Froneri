import React, {FC, useEffect, useState} from 'react';
import {ActivityIndicator, SafeAreaView} from 'react-native';
import {tw} from 'src/tw';
import {WebView} from 'react-native-webview';

import ProductsHeader from 'src/components/Header/ProductsHeader';
import ApiUtil from 'src/services/ApiUtil';
import ProductsController from 'src/controller/ProductsController';
import NoDataComponent from 'src/components/Common/NoDataComponent';
import Card from 'src/components/Card';
import View from 'src/components/View';
import { toast } from 'src/utils/Util';

const Products: FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [url, setUrl] = useState('');
 
  useEffect(() => {
    getProductsWebLink();
  }, []);

  // get products web link
  const getProductsWebLink = async () => {
    setErrorMsg('');
    const online = await ApiUtil.getAppDeviceOnlineStatus();
    setIsOnline(online.status);

    if (!online.status) {
      setErrorMsg(online.errMsg);
      return;
    }
    setLoading(true);
    ProductsController.getProducts()
      .then(res => {
        setUrl(res);
        console.log('res -->', res);
      })
      .catch(error => {
        toast.error({
          message: 'Something went wrong',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={tw('flex-1 bg-light-lightGrey')}>
      <ProductsHeader />
      {loading ? (
        <View flex centerH centerV>
          <ActivityIndicator size="small" />
        </View>
      ) : isOnline && url != '' ? (
        <WebView source={{uri: url}} style={tw('flex-1')} />
      ) : (
        <Card flex-1 marginH-v2 marginB-v2>
          <NoDataComponent title={errorMsg} />
        </Card>
      )}
    </SafeAreaView>
  );
};

export default Products;
