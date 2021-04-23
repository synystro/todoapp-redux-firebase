import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker'
import {useDispatch, useSelector} from 'react-redux';
import {connect} from 'react-redux'
import {setUserLogout, editTodo, deleteTodo} from '../redux/actions'
import {auth, usersDb} from '../firebase/firebase';

const TodoEdit = ({navigation}) => {  

  const selectedTodo = useSelector(state => state.todoReducer.selectedTodo)

  const [todo, setTodo] = useState(selectedTodo.title)
  const [description, setDescription] = useState(selectedTodo.description)
  const [date, setDate] = useState(selectedTodo.date)
  const [displayDatePicker, setDisplayDatePicker] = useState(false)

  // redux
  const dispatch = useDispatch();  
  const userId = useSelector(state => state.todoReducer.userId)
  const userEmail = useSelector(state => state.todoReducer.userEmail)

  const submitTodoEdit = (todoData) => {
    // edit todo in the redux store
    dispatch(editTodo(todoData))
    // edit todo in firestore
    editTodoFirestore(todoData)
  }

  const deleteCurrent = (id) => {
    // delete todo in the redux store
    dispatch(deleteTodo(id))
    // delete todo in firestore
    deleteTodoFirestore(id)    
    // go back to todo list page
    navigation.navigate('TodoList')
  }

  // firestore
  const editTodoFirestore = (todoData) => {
    // fetch todos from firestore
    usersDb.doc(userId).collection("todos").get().then((allTodos) => {  
      allTodos.forEach((currentTodo)=>{
        // find selected todo on firestore
        if(Number.parseInt(currentTodo.data().id, 10) == selectedTodo.id) {
          // get a ref to it then edit it
          const todoRef = usersDb.doc(userId).collection("todos").doc(selectedTodo.id.toString())
          todoRef.update({title: todoData.title})
          todoRef.update({description: todoData.description})
          todoRef.update({date: todoData.date})
        }
      })
    })
  }

  const deleteTodoFirestore = (id) => {
    // fetch todos from firestore
    usersDb.doc(userId).collection("todos").get().then((allTodos) => {  
      allTodos.forEach((currentTodo)=>{
        // find selected todo on firestore
        if(Number.parseInt(currentTodo.data().id, 10) == id) {
          // delete it
          const todoRef = usersDb.doc(userId).collection("todos").doc(selectedTodo.id.toString())
          todoRef.delete();
        }
      })
    })
  }

  // date
  const onDisplayDatePicker = () => { setDisplayDatePicker(true) }
  const onChangeDate = (event, selectedDate) => { 
    if(selectedDate != null) {
      setDate(new Date(selectedDate).getTime())
    }
    setDisplayDatePicker(false)
  } 
  function getDisplayDate() {
    return new Date(date).toDateString()
  }
// firebase
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
                () => onDisplayDatePicker() }>
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
            <Icon
              name='delete'
              color='white'                                               
              size={40}
              onPress = {          
                () => deleteCurrent(selectedTodo.id)                                
              }
            />

            {displayDatePicker && (
              <DateTimePicker
              testID="dateTimePicker"
              value={new Date(date)}
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
              submitTodoEdit(
                {
                  id: selectedTodo.id,
                  title: todo,
                  description: description,
                  date: date
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
    edit: (todo) => dispatch(editTodo(todo)),
    delete: (id) => dispatch(deleteTodo(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoEdit);;