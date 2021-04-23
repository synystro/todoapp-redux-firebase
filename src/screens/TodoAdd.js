import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import { Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker'
import {connect} from 'react-redux'
import {setUserLogout, addTodo} from '../redux/actions'
import { useDispatch, useSelector } from 'react-redux';
import {auth, usersDb} from '../firebase/firebase';

const TodoAdd = ({navigation}) => {
    
    const [todo, setTodo] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(new Date(Date.now()))
    const [displayDatePicker, setDisplayDatePicker] = useState(false)

    // redux
    const userId = useSelector(state => state.todoReducer.userId)
    const userEmail = useSelector(state => state.todoReducer.userEmail)

    const dispatch = useDispatch();
    const submitTodo = (todoData) => {
      // add to redux store
      dispatch(addTodo(todoData))
      // add to firestore
      const thisTodoRef = usersDb.doc(userId).collection("todos").doc(todoData.id.toString())
      return thisTodoRef.set({
        id: todoData.id,
        title: todoData.title,
        description: todoData.description,
        date: todoData.date
      })      
    }    

    // date
    const onDisplayDatePicker = () => { setDisplayDatePicker(true) }
    const onChangeDate = (event, selectedDate) => { 
      setDisplayDatePicker(false)
      if(selectedDate != null) { setDate(selectedDate) }      
    }
    function getDisplayDate() {
      return date.toDateString()
    }
    //firebase
    const onSignOut = () => {
      auth.signOut().then(()=>{
        dispatch(setUserLogout())
      }).catch((err)=>alert(err.message))
      navigation.navigate('Login')
    }
    
    return (
        <View style={styles.container}> 
          { userEmail ?
            (
              <View style={{alignItems:'flex-end', alignContent:'center', paddingHorizontal:10}}>
                <Text style={{color:'white'}}>{userEmail}</Text>        
                <Icon name='logout' color='red' onPress={onSignOut}>          
                </Icon>
                <Text style={{color:'red'}}>Sign Out</Text>
              </View>
            ) : ( null )
          }              
          <View style={styles.header}>
            <TouchableOpacity style={styles.dateText}
              onPress={
                () => onDisplayDatePicker()}>
                {
                  <Text style={styles.dateText}>{getDisplayDate()}</Text>
                }
            </TouchableOpacity>
            <TextInput
              value={todo}
              placeholder='Title'
              style={styles.todoInput}
              maxLength={24}
              onChangeText={(todo) => setTodo(todo)}
            />
            <TextInput
              multiline={true}
              value={description}
              placeholder='Description'
              style={styles.descriptionInput}
              onChangeText={(description) => setDescription(description)}
            />

            {displayDatePicker && (
              <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode='date'              
              minimumDate={new Date()}
              is24Hour={true}
              display="default"
              onChange={onChangeDate}              
              />
            )}

        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.addButton} onPress={()=> {
            if(todo) {               
              submitTodo(
                {
                  id: Date.now(),
                  title: todo,
                  description: description,                  
                  date: Date.now()
                }
              )
              setTodo('')
              setDescription('')
              navigation.navigate('TodoList')    
            } else {
              alert("You forgot your title.")
            }
          }}
          >
            <Icon
              style={styles.addButtonIcon}
              name='done'                                               
              size={36}
              color='white'
              >
            </Icon>            
          </TouchableOpacity>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    justifyContent: 'flex-start'
  },
  header: {
    flex: 12,
    backgroundColor:'#212121',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 30
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: '#212121'
  },
  dateText: {
    textAlign: 'center',
    fontSize: 48,
    marginBottom: 32,
    marginTop: 0,
    color: 'white'
  },
  todoInput: {    
    textAlign: 'left',
    fontSize: 24,
    marginBottom: 32,
    borderWidth: 1,
    padding: 12,
    width: '80%',
    borderRadius: 10,
    backgroundColor: 'white'
  },
  descriptionInput: {
    textAlign: 'left',
    textAlignVertical:'top',
    fontSize: 24,
    marginBottom: 32,
    borderWidth: 1,
    padding: 12,
    height: '30%',
    width: '80%',
    borderRadius: 10,
    backgroundColor: 'white'
  },
  addButton: {    
    flex:1,        
    textAlign:'center',
    textAlignVertical:'center',
    alignSelf:'center',
    width:'100%',
    backgroundColor:'#424242',
    alignItems:'center',
    justifyContent:'center',
  }
});

const mapStateToProps = (state) => {
  return {
    todos: state.todoReducer.todoList
  }
}

const mapDispatchToProps = (state) => {
  return {
    add: (todo) => dispatch(addTodo(todo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoAdd);;