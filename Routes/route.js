import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../Notes/DashboardScreen';
import NoteComponent from '../Notes/NoteComponent';
import NoteFormScreen from '../Notes/NoteFormScreen';

const  Stack = createStackNavigator();

 const  Route = () =>{
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} options={{title:"Your Notes"}} />
        <Stack.Screen name="NoteFormScreen" component={NoteFormScreen} options={{title:"Add note"}} />
        <Stack.Screen name="NoteComponent"  component={NoteComponent} options={{title:"Note"}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default Route

