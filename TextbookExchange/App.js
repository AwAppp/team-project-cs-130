import { StyleSheet, View} from 'react-native';
import PostGroup from "./components/post.js";
import PostFeed from "./pages/PostFeed.js";
import AddPostPage from './pages/AddPost.js';
import Header from './components/header.js';
import {Login, Register} from './Login.js';
import UserProfile from './pages/UserProfile.js';
import Chats from './components/Chats.js';
//import Chat from './components/Chat.js';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Component } from 'react';

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

//<Tab.Screen name="Chat" component={Chat}/>

function Home(props) { 
   return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
    <Tab.Screen name="Post" children={() => 
      <View style={styles.container}>
        <Header/>
        <PostFeed />
      </View>}/>
    <Tab.Screen name="Profile" children={() => <UserProfile uid={props.uid} />}/>
    <Tab.Screen name="Chat" component={Chats}/>
  </Tab.Navigator>
  );  
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: ''
    };
  }
  render() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" children={() => <Login setUid={(uid) => {this.setState({uid: uid})}}/>} />
          <Stack.Screen name="Register" component={Register}/>
          <Stack.Screen name="Home" children={() => <Home uid={this.state.uid}/>} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2774AE',
    justifyContent: 'center',
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
});
