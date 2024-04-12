import * as React from 'react';
import { View  ,Text, Alert, StyleSheet,Image ,TouchableOpacity} from 'react-native';
import * as SQLite from 'expo-sqlite';
import DashboardScreen from './DashboardScreen';



const NoteScreen = ({ navigation ,route })=>{
    const db = SQLite.openDatabase('myNotes1.db');
    const note = route.params.note;
    const [noteData, setNoteData] = React.useState({
        noteTitle: '',
        noteContent: '',
        date: '',
        priority: ''
    });
    React.useEffect(() => {
        
        const focus = navigation.addListener("focus", () => {
            fetchNote(); 
        });
        return focus;
    }, [navigation]);

  

    const fetchNote = () => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM notes WHERE id=?",
                [],
                    (txObj, resultSet) => {
                        if (resultSet.rows.length > 0) {
                            const noteData = resultSet.rows.item(0);
                           console.log(noteData)
                            setNoteData({
                                noteTitle: noteData.title,
                                noteContent: noteData.content,
                                date: noteData.date,
                                priority: noteData.priority
                            });
                        }
                        
                    },
                    (txObj, error) => {
                        console.log(error);
                    }
            );
        });
    }
    const deleteNote = async (id)=>{   
        db.transaction(tx => {
         tx.executeSql('DELETE FROM notes WHERE id=?',[id],
         (txObj, resultSet) => {
      let notes = []
         if(resultSet.rowsAffected > 0){
             console.log('Note supprimée : ' + id);
             let updatedNotes=[...notes].filter(note => note.id !== id);
            fetchNote(updatedNotes);
            
         }
         navigation.navigate(DashboardScreen);
         Alert.alert('Deleted Successfully')
       
         },
     (txObj, error) => {
         Alert.alert('Not working why ',error)
     }
     )
         }   )
     
     }
     const udapteNote= async (note)=>{
         navigation.navigate('NoteFormScreen', {note: note});
     
     }
    return(
        <View>
        
        <View style={styles.head}>
        <TouchableOpacity onPress={()=>deleteNote(note)}>
            <Image source={require("../assets/trash.png")} style={{width:25 , height:25,margin:5}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>udapteNote(note)}>
            <Image source={require("../assets/pencil.png")} style={{width:25 , height:25,margin:6}}/>
        </TouchableOpacity>
        </View>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.content}>{note.content}</Text>
     
       </View>
    )
   
}
const styles = StyleSheet.create({
    container:{

        flex:1,
    },

        title:{
            fontSize:40, 
            fontWeight:'bold'
        },
        content:{
            marginTop:15,
             color:"gray",
             fontSize:20, 
    
        },
       
        head:{
            width:'100px',
            display:'flex',
            flexDirection:'row',
            justifyContent:'flex-end'
        }

})

export  default NoteScreen; 