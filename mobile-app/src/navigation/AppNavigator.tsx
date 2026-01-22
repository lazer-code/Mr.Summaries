import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SummariesScreen from '../screens/SummariesScreen';
import SummaryDetailScreen from '../screens/SummaryDetailScreen';
import CalendarScreen from '../screens/CalendarScreen';
import NotebooksScreen from '../screens/NotebooksScreen';
import NotebookEditorScreen from '../screens/NotebookEditorScreen';

export type RootStackParamList = {
  Home: undefined;
  Summaries: undefined;
  SummaryDetail: { summaryId: string };
  Calendar: undefined;
  Notebooks: undefined;
  NotebookEditor: { notebookId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Summaries" component={SummariesScreen} />
        <Stack.Screen name="SummaryDetail" component={SummaryDetailScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Notebooks" component={NotebooksScreen} />
        <Stack.Screen name="NotebookEditor" component={NotebookEditorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
