// File: app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React from 'react';
import { TabBarIcon } from '../../components/navigation/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#C9B3FF',
        tabBarInactiveTintColor: '#A9A9A9',
        tabBarStyle: {
            backgroundColor: '#1C1B22',
            borderTopColor: '#2A2931'
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Record',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'mic' : 'mic-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
