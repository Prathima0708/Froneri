// import React, {memo} from 'react';
// import {TouchableOpacity} from 'react-native';
// import {useNavigation} from '@react-navigation/native';

// import View from 'src/components/View';
// import Text from 'src/components/Text';

// import {tw} from 'src/tw';

// import {ColourPalette} from 'src/styles/config/ColoursStyles';

// let colors = [ColourPalette.light.offWhite, ColourPalette.light.white];

// interface DelegationListingComponentProps {
//   item: any;
//   index: number;
//   lastItem: boolean;
// }

// const DelegationListingComponent = (props: DelegationListingComponentProps) => {
//   const {item, index, lastItem} = props;

//   if (index == 0) {
//     console.log(item);
//   }
//   const filteredStatus = item?.status ? item?.status.trim() : '--';

//   const description = item?.description ? item?.description.trim() : '--';
//   const requestedDate = item?.requestedDate ? item?.requestedDate.trim() : '--';

//   return (
//     <TouchableOpacity>
//       <View
//         paddingH-v4
//         row
//         centerV
//         height={72}
//         style={[
//           tw(
//             `${
//               lastItem ? 'rounded-b-md' : ''
//             } border-t-default border-light-lavendar `,
//           ),
//           {backgroundColor: colors[index % colors.length]},
//         ]}>
//         <View flex-2 marginL-v2 marginR-v4 marginV-v1>
//           <TouchableOpacity onPress={() => {}}>
//             <Text
//               numberOfLines={1}
//               text13R
//               textBlack
//               style={tw(item.name !== '--' ? '' : '')}>
//               {item.name ? item.name : '---'}
//             </Text>
//             <Text grey2 text13R style={tw('mt-6px')}>
//               {item.customerShipTo}
//             </Text>
//           </TouchableOpacity>
//         </View>
//         <View flex-2 marginL-v2 marginR-v4 marginV-v1>
//           <TouchableOpacity onPress={() => {}}>
//             <Text
//               numberOfLines={1}
//               text13R
//               textBlack
//               style={tw(item.name !== '--' ? '' : '')}>
//               {item.name ? item.name : '---'}
//             </Text>
//             <Text grey2 text13R style={tw('mt-6px')}>
//               {item.customerShipTo}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View flex-1 marginR-v4>
//           <Text numberOfLines={1} text13R grey2>
//             {requestedDate}
//           </Text>
//         </View>
//         <View flex-1>
//           <Text numberOfLines={1} text13R grey2>
//             {requestedDate}
//           </Text>
//         </View>
//         <View flex-4 marginR-v4>
//           <Text numberOfLines={2} text13R grey2>
//             {description}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// export default memo(DelegationListingComponent);
