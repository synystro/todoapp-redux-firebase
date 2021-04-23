import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import { ListItem, Icon } from 'react-native-elements'
import {connect} from 'react-redux'
import { useDispatch, useSelector } from 'react-redux';
import { setUserLogout, clearTodoList, addTodo, deleteTodo, setSelectedTodo } from '../redux/actions';
import {auth, usersDb} from '../firebase/firebase';

const TodoList = ({navigation}) => {

  useEffect(()=>{  
    usersDb.doc(userId).collection("todos").get().then((allTodos) => {   
      // clear todos from store
      dispatch(clearTodoList())  
      // fetch todos from firestore
      allTodos.forEach((currentTodo)=>{
        dispatch(addTodo({
          id: currentTodo.data().id,
          title: currentTodo.data().title,
          description: currentTodo.data().description,
          date: currentTodo.data().date
        }))
      })
    })
  },[])

  // redux
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todoReducer.todoList)
  
  const updateTodo = (todo) => dispatch(setSelectedTodo(todo))

  const userId = useSelector(state => state.todoReducer.userId)
  const userEmail = useSelector(state => state.todoReducer.userEmail) 
  

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
      <View style={styles.contentContainer}>     
      <TouchableOpacity
        style={{ marginBottom: 16 }}
        onPress={() =>
        navigation.navigate('TodoAdd')}>      
      </TouchableOpacity>
      <View style={{alignItems:'center'}}>
      <Icon
      name='add'                                               
      size={30}
      color='black'
      reverse='true'
      onPress={() => navigation.navigate('TodoAdd')}>
      </Icon>     
    </View>
    { todos ? (
      <FlatList style={styles.listContainer}
      data={todos}
      keyExtractor={(item, index) => item.id.toString()}
      renderItem={
        (data) =>
          <ListItem style={{backgroundColor:'white', borderWidth:1, borderRadius:10, paddingHorizontal:15}} bottomDivider onPress = {
              ()=> { updateTodo(data.item),
              navigation.navigate('TodoEdit') }
            }>
            <ListItem.Content>
              <ListItem.Title style={{fontSize:24}}>{data.item.title}</ListItem.Title>
            </ListItem.Content>          
          </ListItem>                
           }    
        />
      )  
       : (
        null
      )
      }
    </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 48,
    marginBottom: 30,
    marginTop: 16,
    color: 'white'
  },
  image: {
    width: 120,
    height: 120,
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 100,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#212121',
    padding: 16
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#212121',
    padding: 16
  },
  listText: {
    fontSize: 30
  }
});

const mapStateToProps = (state) => {
  return {
    todos: state.todoReducer.todoList
  }
}
const mapDispatchToProps = (state) => {
  return {
    set: (todo) => dispatch(setSelectedTodo(todo)),
    delete: (id) => dispatch(deleteTodo(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);