import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="admindashboard"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="studentdashboard"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
