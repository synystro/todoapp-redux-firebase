import React, {useState} from 'react';
import {TextInput, Text, View, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import {connect} from 'react-redux';
import {auth, usersDb} from '../firebase/firebase';
import { setActiveUser, setUserLogout } from '../redux/actions';

const Login = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const onSignIn = async () => {
    try {
    const response = await auth.
    signInWithEmailAndPassword(email, password).then((result)=>{
      dispatch(setActiveUser({
        email: result.user.email,
        id: result.user.uid
      }))
      
    });
    setError('')        
    navigation.navigate('TodoList');
    } catch (err) {
        setError(err.message);
    }
  }

  const onSignUp = async () => {
    try {
        const response = await auth.createUserWithEmailAndPassword(email, password).then(cred=>{
          return usersDb.doc(cred.user.uid).set({})
        });
        setError('')
    } catch (err) {
        setError(err.message);
    }
  }

  return (    
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TodoS</Text>
        <TextInput
              value={email}
              placeholder='e-mail'
              style={styles.credentialsInput}
              onChangeText={setEmail}
        />
        <TextInput
              value={password}
              placeholder='password'
              style={styles.credentialsInput}
              onChangeText={setPassword}
              secureTextEntry
        />
        {
            error ?
                <Text style={{ color: 'red' }}>{error}</Text>
                : null
        }
        <View style={{flexDirection:'column'}}>
          <View style={{alignItems:'stretch', paddingBottom:20}}>
          <Button color="orange" title="Sign In" onPress={() => onSignIn()} />
          </View>          
          <Text style={{color:'white'}}>Don't have an account yet?</Text>
          <Button title="Sign Up" onPress={() => onSignUp()} />          
        </View>
      </View>
      <View style={styles.footer}>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#212121',
    justifyContent: 'flex-start'
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingVertical: -50,
    paddingHorizontal: 30
  },
  footer: {
    flex: 0,
    backgroundColor: '#212121',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 25
  },
  title: {
    color:'orange',
    textAlign:'center',
    fontSize: 48,
    marginBottom: 30,
    marginTop: 16
  },
  credentialsInput: {  
    textAlign: 'left',
    fontSize: 24,
    marginBottom: 32,
    borderWidth: 1,
    padding: 12,
    width: '80%',
    borderRadius: 10,
    backgroundColor: 'white'
  }
});

const mapStateToProps = (state) => {
  return {
    userName: state.todoReducer.userName,
    userEmail: state.todoReducer.userEmail
  }
}

const mapDispatchToProps = (state) => {
  return {
    setUser: (userName) => dispatch(setActiveUser(userName)),
    setLogout: (userName) => dispatch(setUserLogout(username))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);;