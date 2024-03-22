import { Button, View ,TouchableOpacity} from 'react-native';
import * as React from 'react';
import * as SQLite from 'expo-sqlite';



const DashboardScreen = ({navigation}) => {
    const db = SQLite.openDatabase('Notes.db');
    const [notes, setNotes] = React.useState([]);
    
    const goTo = () => navigation.navigate('NoteFormScreen');
        
     
    React.useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM notes',
                [],
                (_, { rows }) => {
                    setNotes(rows._array);
                }
            );
        });
    }, []);

  const showNotes = () => {
      return notes.map((note, index) => {
          return (
              <View key={index}>
                  <NoteComponent note={note} />
                    
              </View>
          );
      });
    }

    return (
        <View>
         {showNotes()}
            <Button title="Nouvelle note" onPress={()=>goTo()}/>
        </View>
    );
}

export default DashboardScreen;
