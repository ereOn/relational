import React, { useEffect, useState } from 'react';
import { AppState, FlatList, Stylesheet, Text, View } from 'react-native';
import { PermissionsAndroid } from 'react-native';

import Contacts from 'react-native-contacts';

export default App = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [contacts, setContacts] = useState([
    { key: "foo", name: "Foo" },
    { key: "bar", name: "Bar" },
  ]);

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.',
        'buttonPositive': 'Please accept bare mortal'
      }
    ).then(() => {
      Contacts.getAll((err, contacts) => {
        if (err === 'denied') {
          throw err;
        }

        setContacts(contacts.map((contact) => ({ key: contact.recordID, name: contact.displayName })));
        console.log(contacts);
      });
    }).catch((err) => {
      console.log(err);
    })

    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, [])

  const _handleAppStateChange = nextAppState => {
    console.log(nextAppState);
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
    }
    setAppState(nextAppState);
  };

  return (<View>
    <FlatList
      data={contacts}
      renderItem={
        ({ item }) => <Text>{item.name}</Text>
      }
    >
    </FlatList>
  </View>
  )
}
