
import { Button, StyleSheet, TextInput, View, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as React from 'react';
import * as Sqlite from 'expo-sqlite';

const NoteFormScreen = ({ navigation ,route }) => {
    const db = Sqlite.openDatabase("myNotes1.db");
    const [noteTitle, setNoteTitle] = React.useState(''); 
    const [noteContent, setNoteContent] = React.useState('');
    const [notePriority, setNotePriority] = React.useState(''); 
    const {note} = route.params  || {};

    React.useEffect(() => {
        if (note && note.id) {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM notes WHERE id = ?',
                    [note.id],
                    (txObj, resultSet) => {
                        if (resultSet.rows.length > 0) {
                            const noteData = resultSet.rows.item(0);
                            setNoteTitle(noteData.title);
                            setNoteContent(noteData.content);
                            setNotePriority(noteData.priority);
                        }
                        
                    },
                    (txObj, error) => {
                        console.log(error);
                    }
                );
            });
        }
    }, [note]);

    const addNote = () => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT NULL,date datetime NULL ,priority TEXT NULL)`,
                [], 
                (txObj, resultSet) => {
                    
                    tx.executeSql(
                        `INSERT INTO notes (title, content, date, priority) VALUES (?, ?,datetime() ,?)`,
                        [noteTitle, noteContent, notePriority], 
                        (txObj, resultSet) => {
                            Alert.alert("La note a bien été ajoutée");
                            navigation.navigate('DashboardScreen');
                        },
                        (txObj, error) => {
                            console.log(error)
                            Alert.alert("La note n'a pas été ajoutée");
                        }
                    );
                },
                (txObj, error) => {
                    console.log(error)
                    Alert.alert("La table n'a pas pu être créée");
                }
            );
        });
    }

    const update =()=>{
      
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE notes SET title = ?, content = ?, date = datetime(), priority = ? WHERE id = ?',
                    [noteTitle, noteContent, notePriority,note.id],
                    (txObj, resultSet) => {
                        Alert.alert("La note a bien été modifiée");
                        navigation.navigate('DashboardScreen');
                    },
                    (txObj, error) => {
                        console.log(error)
                        Alert.alert("La note n'a pas été modifiée");
                    }
                )
            })
        
    }

    const onSaveNote = () => {
        if (note && note.id) {
            update();
        } else {
            addNote();
        }
    };
    return (
        <View style={styles.container}>
            <TextInput style={styles.inputTitle} placeholder="Title" onChangeText={(text) => setNoteTitle(text)} value={noteTitle} />
            <TextInput style={styles.inputContent} multiline={true} numberOfLines={10} placeholder="Note Content" onChangeText={(text) => setNoteContent(text)} value={noteContent} />
            <View>
            <RNPickerSelect 
                onValueChange={(value) => setNotePriority(value)}
                items={[
                    { label: 'Important', value: 'important' },
                    { label: 'Reminder', value: 'reminder' },
                    { label: 'Medium', value: 'medium' },
                ]}
            />
            </View>
            
            <Button title="Save Note" onPress={() => onSaveNote()} buttonStyle={styles.button}/>

           
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height:"100%",
        backgroundColor: 'white',
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputTitle: {
        top: "0",
        fontSize:40, 
        fontWeight:'bold',
        width: 300,
        height:'auto',
        borderWidth: 1,
        borderColor: 'gray',
       
    },
    inputContent: {
        fontSize:25, 
        margin:20,
        width: 300,
        height: 'auto',
        margin: 12,
        borderh: "none",
        padding: 10,
    },
button:{
    backgroundColor: '#7EE4EC',
    color: 'black',
    marginTop: 20,
 }
   
});

export default NoteFormScreen;
