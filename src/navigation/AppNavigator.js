import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppStore } from '../store/useAppStore';
import { ROUTES } from './routes';
import { navigationTheme } from './navigationTheme';

import { HomeScreen } from '../screens/HomeScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { EditorScreen } from '../screens/EditorScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AdminPaywallScreen } from '../screens/AdminPaywallScreen';

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { state } = useAppStore();
  const role = state.session.role;
  const isAdmin = role === 'admin';

  const showEditorTab = isAdmin;
  const showDashboardTab = role === 'customer' || role === 'staff' || isAdmin;

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: true,
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: Platform.select({ web: { height: 56 } }),
      }}
    >
      <Tabs.Screen name={ROUTES.HOME} component={HomeScreen} />

      {showDashboardTab ? (
        <Tabs.Screen name={ROUTES.DASHBOARD} component={DashboardScreen} />
      ) : null}

      {showEditorTab ? (
        <Tabs.Screen name={ROUTES.EDITOR} component={EditorScreen} />
      ) : null}

      <Tabs.Screen name={ROUTES.MESSAGES} component={MessagesScreen} />
      <Tabs.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
      <Tabs.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
      <Tabs.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  const { state } = useAppStore();

  const initialRouteName = useMemo(() => ROUTES.HOME, []);
  const showPaywall = state.session.role === 'admin' && !state.session.isPro;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator initialRouteName={initialRouteName}>
        {showPaywall ? (
          <Stack.Screen
            name={ROUTES.PAYWALL}
            component={AdminPaywallScreen}
            options={{ title: 'SXR Pro' }}
          />
        ) : null}
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name={ROUTES.CHAT}
          component={ChatScreen}
          options={({ route }) => ({ title: route?.params?.title ?? 'Chat' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
