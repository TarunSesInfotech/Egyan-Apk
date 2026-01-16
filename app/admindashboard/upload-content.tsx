// import { useState } from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';

// export default function App() {
//   const [category, setCategory] = useState(null);

//   const categories = [
//     { label: 'Fiction', value: 'fiction' },
//     { label: 'Science', value: 'science' },
//     { label: 'History', value: 'history' },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={{ padding: 16 }}>
//         {/* Book Information */}
//         <View style={styles.card}>
//           <Text style={styles.title}>Book Information</Text>
//           <Text style={styles.subtitle}>
//             Enter the basic details of the book
//           </Text>

//           <Text style={styles.label}>Category</Text>

//           <Dropdown
//             style={styles.dropdown}
//             data={categories}
//             labelField="label"
//             valueField="value"
//             placeholder="Select category"
//             placeholderStyle={{ color: '#7a8298' }}
//             selectedTextStyle={{ color: '#fff' }}
//             value={category}
//             onChange={(item) => setCategory(item.value)}
//           />

//           <TouchableOpacity style={styles.buttonPrimary}>
//             <Text style={styles.buttonText}>Upload Book</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Chapters */}
//         <View style={styles.cardDark}>
//           <Text style={styles.titleDark}>Chapters</Text>
//           <Text style={styles.subtitleDark}>Upload chapter resources</Text>

//           <TouchableOpacity style={styles.buttonPrimary}>
//             <Text style={styles.buttonText}>+ Add Chapter</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0f1523',
//   },
//   card: {
//     backgroundColor: '#1c2233',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 18,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   subtitle: {
//     color: '#a7b0c6',
//     marginTop: 4,
//     marginBottom: 18,
//   },
//   label: {
//     color: '#d6dbea',
//     marginBottom: 6,
//   },
//   dropdown: {
//     height: 48,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     backgroundColor: '#0f1523',
//     marginBottom: 20,
//   },
//   buttonPrimary: {
//     backgroundColor: '#3b82f6',
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '700',
//   },
//   cardDark: {
//     backgroundColor: '#0b1120',
//     borderRadius: 12,
//     padding: 16,
//     flexDirection: 'column',
//     marginBottom: 18,
//   },
//   titleDark: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 6,
//   },
//   subtitleDark: { 
//     color: '#a7b0c6', 
//     marginBottom: 18 
//   },
// });
