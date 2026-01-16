// import { Ionicons } from '@expo/vector-icons';
// import { useEffect, useState } from 'react';
// import {
//   FlatList,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { studentStudyMaterialApi } from '../api/studentapi/studyMaterialApi';

// interface Book {
//   category: any;
//   language: any;
//   id: number;
//   bookName: string;
//   subject: string;
//   educationLevel: string;
// }

// export default function BookManage() {
//   const [books, setBooks] = useState<Book[]>([]);

//   useEffect(() => {
//     const loadBooks = async () => {
//       const res = await studentStudyMaterialApi();
//       if (res.success) {
//         setBooks(res.data);
//       } else {
//         console.log('API ERROR:', res.message);
//       }
//     };

//     loadBooks();
//   }, []);
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Manage Books</Text>
//       <Text style={styles.subtitle}>
//         View, edit and organize your book collection
//       </Text>
//       <View style={styles.searchRow}>
//         <View style={styles.searchBox}>
//           <Ionicons name="search-outline" size={28} color="#9ca3af" />
//           <TextInput
//             placeholder="Search books..."
//             placeholderTextColor="#9ca3af"
//             style={styles.searchInput}
//           />
//         </View>
//         <TouchableOpacity style={styles.filterBtn}>
//           <Ionicons name="options-outline" size={28} color="#fff" />
//           <Text style={styles.filterText}>Filter</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Table Header */}
//       <View style={styles.tableHeader}>
//         <Text style={[styles.col, { flex: 2 }]}>Book</Text>
//         <Text style={styles.col}>Category</Text>
//         <Text style={styles.col}>Subject</Text>
//         <Text style={styles.col}>Level</Text>
//         <Text style={styles.actions}>Actions</Text>
//       </View>

//       {/* Table Rows */}
//       <FlatList
//         data={books}
//         keyExtractor={(item, index) => String(item.id || index)}
//         renderItem={({ item }) => (
//           <View style={styles.row}>
//             <View style={{ flex: 2 }}>
//               <Text style={styles.bookTitle}>{item.bookName}</Text>
//               <Text style={styles.lang}>{item.language}</Text>
//             </View>

//             {/* Category */}
//             <View style={{ flex: 1 }}>
//               <View style={styles.categoryTag}>
//                 <Text style={styles.categoryText}>{item.category}</Text>
//               </View>
//               <Text style={styles.lang}>{item.language}</Text>
//             </View>

//             {/* Subject */}
//             <Text style={styles.cell}>{item.subject}</Text>

//             {/* Level */}
//             <Text style={styles.cell}>{item.educationLevel}</Text>

//             {/* Actions */}
//             <View style={styles.actionIcons}>
//               <Ionicons name="eye-outline" size={18} color="#9ca3af" />
//               <Ionicons
//                 name="create-outline"
//                 size={18}
//                 color="#9ca3af"
//                 style={styles.icon}
//               />
//               <Ionicons name="trash-outline" size={18} color="#ef4444" />
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0f172a',
//     padding: 20,
//   },
//   title: {
//     color: '#fff',
//     fontSize: 28,
//     fontWeight: '900',
//   },
//   subtitle: {
//     color: '#9ca3af',
//     marginTop: 4,
//     marginBottom: 20,
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   searchRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   searchBox: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#020617',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     height: 50,
//   },
//   searchInput: {
//     color: '#fff',
//     fontSize: 20,
//     marginLeft: 8,
//     flex: 1,
//   },
//   filterBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1f2937',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     marginLeft: 10,
//   },
//   filterText: {
//     color: '#fff',
//     marginLeft: 6,
//     fontSize: 20,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     marginTop: 10,
//     paddingVertical: 10,
//     borderBottomColor: '#1f2937',
//     borderBottomWidth: 1,
//   },
//   col: {
//     color: '#9ca3af',
//     flex: 1,
//   },
//   actions: {
//     color: '#9ca3af',
//     width: 70,
//     textAlign: 'right',
//   },
//   row: {
//     flexDirection: 'row',
//     paddingVertical: 14,
//     borderBottomColor: '#1f2937',
//     borderBottomWidth: 1,
//   },
//   bookTitle: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   lang: {
//     color: '#9ca3af',
//     fontSize: 12,
//     marginTop: 2,
//   },
//   cell: {
//     color: '#fff',
//     flex: 1,
//   },
//   categoryTag: {
//     backgroundColor: '#1d4ed8',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//   },
//   categoryText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   actionIcons: {
//     flexDirection: 'row',
//     width: 70,
//     justifyContent: 'flex-end',
//   },
//   icon: {
//     marginHorizontal: 10,
//   },
// });
