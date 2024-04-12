import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../Notes/DashboardScreen';
import NoteFormScreen from '../Notes/NoteFormScreen';
import NoteScreen from '../Notes/NoteScreen';

const  Stack = createStackNavigator();

 const  Route = () =>{
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} options={{title:"Your Notes"}} />
        <Stack.Screen name="NoteFormScreen" component={NoteFormScreen} options={{title:"Add note"}} />
        <Stack.Screen name="NoteScreen" component={NoteScreen} options={{title:"Note"}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default Route

