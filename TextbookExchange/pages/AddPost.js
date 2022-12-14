import { ScrollView, TextInput, Alert, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, { Component } from "react";
import { ActivityIndicator } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import Backend from "./../Backend.js";

be = new Backend();

const MultilineTextInput = (props) => {
    return (
        <TextInput
            {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
            editable
            maxLength={400}
        />
    );
}


const AddPost = (props) => {
    const [post, setPostData] = React.useState({ name: "", price: 0, isbn: 0, type: "", description: "" });
    const [pressBuy, setPressBuy] = React.useState(false);
    const [pressSell, setPressSell] = React.useState(false);
    const [pic, setPic] = React.useState(null);
    const [uploading, setUploading] = React.useState(false);

    return (
        uploading
            ?
            <View style={{ marginTop: 100 }}>
                <ActivityIndicator size="large" />
            </View>
            :
            <ScrollView>
                <TextInput clearButtonMode="always"
                    style={styles.input}
                    onChangeText={(text) => setPostData({ ...post, name: text })}
                    value={post.name}
                    placeholder="Textbook Name"
                    keyboardType="text"
                />
                <TextInput clearButtonMode="always"
                    style={styles.input}
                    onChangeText={(text) => setPostData({ ...post, isbn: text })}
                    value={post.isbn}
                    placeholder="Textbook ISBN"
                    keyboardType="numeric"
                />
                <TextInput clearButtonMode="always"
                    style={styles.input}
                    onChangeText={(text) => setPostData({ ...post, price: text })}
                    value={post.price}
                    placeholder="Price (USD)"
                    keyboardType="numeric"
                />
                <MultilineTextInput
                    clearButtonMode="always"
                    style={styles.multilineinput}
                    multiline
                    numberOfLines={10}
                    onChangeText={(text) => setPostData({ ...post, description: text })}
                    value={post.description}
                    placeholder="Description of Book (max length: 400 characters)"
                />
                <View style={styles.buttonview}>
                    <Pressable onPress={() => { setPostData({...post, type: 'Buying'}); }}
                        style={{ marginHorizontal: 10, padding: 10, backgroundColor: post.type == 'Buying' ? "green" : "blue" }}>
                        <Text style={styles.text}>Buying</Text>
                    </Pressable>
                    <Pressable onPress={() => { setPostData({...post, type: 'Selling'}); }}
                        style={{ marginHorizontal: 10, padding: 10, backgroundColor: post.type == 'Selling' ? "green" : "blue" }}>
                        <Text style={styles.text}>Selling</Text>
                    </Pressable>
                </View>
                {pic == null
                    ?
                    <></>
                    :
                    <View style={{marginTop: 50}}>
                    <Text>Image Selected</Text>
                    <Image
                        source={{ uri: pic.assets[0].uri }}
                        style={{ width: 200, height: 200, alignSelf: 'center' }}
                    />
                    </View>
                    }
                <Pressable style={styles.imgbutton}
                    onPress={async () => {
                        // Alert.alert("Add Image!");
                        const uploaded_file = await ImagePicker.launchImageLibraryAsync();

                        // console.log(uploaded_file); // for debug

                        setPic(uploaded_file);
                    }
                    }>
                    <Text style={styles.text}>{pic == null ? "Add Image" : "Change Image"}</Text>
                </Pressable>
                <Pressable style={styles.button}
                    onPress={async () => {
                        var postId = null;

                        if (pressBuy == true) {
                            setPostData({ ...post, type: "Buying" });
                        }
                        else {
                            setPostData({ ...post, type: "Selling" });
                        }
                        if (post.name == "" || post.isbn == 0 || post.type == "" || post.description == "") {
                            /* console.log("name: ", post.name);
                            console.log("isbn: ", post.isbn);
                            console.log("type: ", post.type);
                            console.log("description: ", post.description); */

                            Alert.alert("Error: Empty Fields, please fill everything out.");
                        }
                        else {
                            let userInfo = await be.getUserInfoByUid(props.userid);
                            postId = await be.addPost({ sellerid: props.userid, title: post.name, price: post.price, isbn: post.isbn, description: post.description, type: post.type, username: userInfo.username });
                            await be.uploadBookPic(postId, await be.getBlobFromURI(pic.assets[0].uri));
                            Alert.alert("New Post Created!");
                            setUploading(true);
                            await new Promise(resolve => setTimeout(resolve, 2000));
                            setPressBuy(false);
                            setPressSell(false);
                            props.setShowAddPage(false);
                        }
                    }
                    }>
                    <Text style={styles.text}>Add Post</Text>
                </Pressable>
            </ScrollView>
    );
};

const AddPostPage = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.baseText}>Add Post</Text>
            <AddPost
                userid={props.userid}
                setShowAddPage={props.setShowAddPage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    buttonview: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    space: {
        paddingVertical: 12,
        marginVertical: 10,
    },
    container: {
        backgroundColor: '#2774AE',
        justifyContent: 'center',
        flex: 100,
    },
    baseText: {
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        margin: 12,
        fontSize: 30,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    multilineinput: {
        height: 90,
        padding: 10,
        backgroundColor: '#FFFFFF',
        margin: 12,
        borderWidth: 1,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        marginHorizontal: 10,
        marginVertical: 10,
    },
    imgbutton: {
        backgroundColor: '#2020a8',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        elevation: 3,
        marginHorizontal: 10,
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});


export default AddPostPage;

//Backend.AddPost({key:value})
//prop for userID

/*            <Pressable style={styles.button} onPress={Backend.addPost({sellerid: props.userid, title: post.name, price: post.price, isbn: post.isbn, description: post.description})}>
                <Text style={styles.text}>Add Post</Text>
            </Pressable>*/