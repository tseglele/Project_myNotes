import * as React from 'react';
import { View } from 'react-native';

const NoteComponent = ({ note })=>{
    <View>
        <Text style={{fontSize:20, fontWeight:'bold'}}>{noteTitle}</Text>
        <Text style={{marginTop:15, color:"gray"}}>{noteContent}</Text>
        <Text style={{ marginTop: 5 }}>Date: {note.date}</Text>
            <Text style={{ marginTop: 5 }}>Priority: {note.priority}</Text>
    </View>
}

export  default NoteComponent; 