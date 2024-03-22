import {Button, StyleSheet,TextInput,View,Alert} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as React from 'react';
import * as Sqlite from 'expo-sqlite';

const NoteFormScreen = ({navigation})=>{
    const db = Sqlite.openDatabase("Notes.db");
const [notes, setNotes] = React.useState([]);
const [noteTitle, setNoteTitle] = React.useState([]);
const [noteContent, setNoteContent] = React.useState('');
const [notePriority,setNotePriority]=React.useState();
    

const addNote=()=>{
    db.transaction(tx=>{
        tx.executeSql('INSERT INTO notes (title, content, date,priority) VALUES(?,?,datetime(),?) ',[noteTitle,noteContent,date,notePriority],
        (txObj, resultSet)=>{
            Alert.alert("La note a bien été ajoutée");
            let existingNotes =[...notes];
            existingNotes.push({id: resultSet.insertId, title: noteTitle, content: noteContent, date: new Date().toISOString(), priority: notePriority });
            setNotes(existingNotes);
            navigation.navigate('DashboardScreen');
            },
        (txObj, error)=>{console.log(error)
         
        })

    })

}

const updateNote=()=>{
    db.transaction(tx=>{
        tx.executeSql('UPDATE notes SET note = (?) WHERE id = (?',null,
        (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
                const existingNotes = [...notes];
                const indexToUpdate = existingNotes.findIndex(note => note.id === id);
                if (index !== -1) {
               
                    setNotes(existingNotes)
                  
                }
            }
            
        },
        (txObj, err) => console.log(err)
        )
    })

}
    return(
        <View style={styles.container}>
           
            <TextInput  style={styles.input} placeholder="Title" onChangeText={(text)=>setNoteTitle(text)} value={noteTitle}/>
            <TextInput style={styles.input}  multiline={true} numberOfLines={10} placeholder="Content" onChangeText={(text)=>setNoteContent(text)} value={noteContent}/>
            <RNPickerSelect 
            onValueChange={(value) => setNotePriority(value)}
            items={[
                { label: 'Important', value: 'important' },
                { label: 'Pense bête', value: 'pense bête' },
                { label: 'Normal', value: 'normal' },
            ]}
        />
        <Button title='Add Note' onPress={addNote}></Button>
       
        </View>
    )
}
   
   

const styles = StyleSheet.create({container: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',

  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
  export default NoteFormScreen ;