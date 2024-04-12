

import { Button, View ,Text,StyleSheet, Alert ,ScrollView,TouchableOpacity,Image } from 'react-native';
import * as React from 'react';
import * as SQLite from 'expo-sqlite';



const DashboardScreen = ({ navigation }) => {
    const db = SQLite.openDatabase('myNotes1.db');
    const [notes, setNotes] = React.useState([]);
    const [selectedPriority, setSelectedPriority] = React.useState();

    const handlePriorityFilter = (priority) => {
        if (priority === selectedPriority) {
          setSelectedPriority();
        } 
        else {
          setSelectedPriority(priority);
        }
        fetchNotePriority(priority);
        if (priority === "All") {
            setSelectedPriority(priority);
            fetchNotes(); 
          } 
      };
      const fetchNotePriority = (priority) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM notes WHERE priority = ?`,
                [priority],
                (txObj, resultSet) => {
                    setNotes(resultSet.rows._array);
                },
                (txObj, error) => {
                    console.log(error);
                }
            );
        });
    };
    React.useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT , content TEXT NULL,date datetime , priority TEXT NULL)',
                [], 
                fetchNotes,
                (txObj, error) => {
                    console.log(error)
                    Alert.alert("La table n'a pas pu être créée");
                }
            );
        });

        const focus = navigation.addListener("focus", () => {
            fetchNotes(); 
        });
        return focus;
    }, [navigation]);

    const fetchNotes = () => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT * FROM notes",
                [],
                (txObj, resultSet) => {
                    setNotes(resultSet.rows._array);
                },
                (txObj, error) => {
                    console.log(error);
                }
            );
        });
    };
const deleteNote = async (id)=>{   
   db.transaction(tx => {
    tx.executeSql('DELETE FROM notes WHERE id=?',[id],
    (txObj, resultSet) => {
 
    if(resultSet.rowsAffected > 0){
        console.log('Note supprimée : ' + id);
        let updatedNotes=[...notes].filter(note => note.id !== id);
       fetchNotes(updatedNotes);
    }

    Alert.alert('Deleted Successfully')
  
    },
(txObj, error) => {
    Alert.alert('Not working why ',error)
}
)
    }   )

}
const udapteNote= async (note)=>{
    navigation.navigate('NoteFormScreen', {note: note });

}
const getContainerStyle = (note) => {
    if (note && note.priority) {
        switch (note.priority) {
            case 'important':
                return styles.containerImportant;
            case 'reminder':
                return styles.containerReminder;
            case 'medium':
            default:
                return styles.containerMedium;
        }
    } else {
        return styles.containerMedium;
    }
};
    return (
        < > 
        <View style={styles.priorityFilterContainer}>
         <TouchableOpacity style={[styles.priorityButton, selectedPriority === "All" && styles.selectedPriorityButton]} onPress={() => handlePriorityFilter("All")}>
          <Text style={styles.priorityButtonText}>All</Text>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.priorityButton, selectedPriority === "medium" && styles.selectedPriorityButton]} onPress={() => handlePriorityFilter("medium")}>
          <Text style={styles.priorityButtonText}>Medium</Text>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.priorityButton, selectedPriority === "important" && styles.selectedPriorityButton]} onPress={() => handlePriorityFilter("important")}>
         <Text style={styles.priorityButtonText}>Important</Text>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.priorityButton, selectedPriority === "reminder" && styles.selectedPriorityButton]} onPress={() => handlePriorityFilter("reminder")}>
         <Text style={styles.priorityButtonText}>Reminder</Text>
         </TouchableOpacity>
        </View>
          <ScrollView>
            {notes.map((note) => (
        <TouchableOpacity onPress={()=>navigation.navigate('NoteScreen', {note: note})} style={[styles.noteContainer, getContainerStyle(note)]} key={note.id}>
            
                        <Text style={styles.noteTextTitle}>{note.title}</Text>
                        <Text style={styles.noteTextContent}>{note.content}</Text>
                       
                        <View style={styles.details}>
                        <Text style={styles.noteTextDate}>{note.date}</Text>
                        <Text style={styles.noteTextPriority}>{note.priority}</Text>
                        </View>
                <View style={styles.head}>
                    <TouchableOpacity onPress={()=>deleteNote(note.id)}>
                     <Image source={require("../assets/trash.png")} style={{width:25 , height:25,margin:5}}/>
                    </TouchableOpacity>

                 <TouchableOpacity onPress={()=>udapteNote(note)}>
                    <Image source={require("../assets/pencil.png")} style={{width:25 , height:25,margin:6}}/>
                 </TouchableOpacity>
                </View>
                
        </TouchableOpacity>
            ))}
            
        </ScrollView>
        <TouchableOpacity style={styles.newNote} onPress={() => navigation.navigate('NoteFormScreen')} >
                <Image source={require("../assets/plus.png") } style={{width:25 , height:25,alignSelf:'center'}}></Image>
            </TouchableOpacity>
        </>
    )
}
const styles = StyleSheet.create({
  
    noteContainer: {
         display:'flex',
         justifyContent: 'center',
         width:380,
         height:180,
         margin: 15,
         borderRadius: 20,
        
    },
    noteTextTitle: {
        marginTop:8,
        color: "white",
        fontSize:20, 
        fontWeight:'bold'

    },
    noteTextContent: {
        color: "white",
        fontSize:20, 
        textAlign:"justify"

    },
    noteTextDate: {
        color: "black",
    },
    noteTextPriority: {
        color: "white",
        fontStyle:'italic',
        fontWeight:'thin',
        marginTop:8,
    },
   
    newNote: {
        display:'flex',
        justifyContent: 'center',
        position: 'absolute',
        left: 170,
        bottom: 20,
        padding: 10,
        backgroundColor: '#7EE4EC',
        borderRadius: 40,
        width:80,
        height:80,
    },
        containerMedium: {
            backgroundColor: '#114C5F',
        },
        containerImportant: {
            backgroundColor: '#F45B69',
            
        },
        containerReminder: {
            backgroundColor: '#456990',
           
        },
        head:{
            width:'70px',
            display:'flex',
            flexDirection:'row',
            justifyContent:'flex-end',
        },
        details:{

            display:'flex',
            flexDirection:'column',
            justifyContent:'flex-end',
            
        },
        priorityFilterContainer:{
                      marginTop:"3%",
                      display:'flex',
                        flexDirection:'row',
                        justifyContent:'flex-end',
                    },
        priorityButton: {
            padding: 5,
            borderRadius: 5,
            marginHorizontal: 5,
            backgroundColor: '#ddd',
          },
          selectedPriorityButton: {
            backgroundColor: '#007AFF',
          },
          priorityButtonText: {
            fontSize: 14,
            color: '#333',
          },
          selectedPriorityButtonText: {
            color: 'white',
          },
});

export default DashboardScreen;
