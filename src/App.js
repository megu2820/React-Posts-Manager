import React, { createContext,useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { Alert, AlertTitle } from '@material-ui/lab';
import ThumbUp from '@material-ui/icons/ThumbUp'
import ThumbDown from '@material-ui/icons/ThumbDown'

const emailCheck = (email) => {
  const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
  return re.test(String(email).toLowerCase());

}





function App() {
  const [user, setUser] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [like,setLike]= useState([]);
  const [dislike,setDislike]= useState([]);

  let columns = [
    { title: 'ID', field: 'id' },
    { title: 'TITLE', field: 'title' },
    { title: 'BODY', field: 'body' }

  ]
  
  

  

    useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/posts`)
      .then(res => {
        const users = res.data.splice(0,15);
        setUser(users);
        console.log(users);
      })
      
  }, [])

  // console.log(user);

   const handleRowUpdate = (newData, previousData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.id === "") {
      errorList.push("Try Again, You didn't enter the id field")
    }
    if (newData.body === "") {
      errorList.push("Try Again, You didn't enter the body field")
    }
    if (newData.title === "") {
      errorList.push("Try Again, You didn't enter the title field")
    }

    if (errorList.length < 1) {
      axios.put(`https://jsonplaceholder.typicode.com/posts/${newData.id}`, newData)
        .then(response => {
          const updateUser = [...user];
          const index = previousData.tableData.id;
          updateUser[index] = newData;
          setUser([...updateUser]);
          resolve()
          setIserror(false)
          setErrorMessages([])
        })
        .catch(error => {
          setErrorMessages(["Update failed! Server error"])
          setIserror(true)
          resolve()

        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()

    }

    
  }

   //function for deleting a row
    const handleRowDelete = (previousData, resolve) => {
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${previousData.id}`)
      .then(response => {
        const dataDelete = [...user];
        const index = previousData.tableData.id;
        dataDelete.splice(index, 1);
        setUser([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }  

     //function for adding a new row to the table
  const handleRowAdd = (newData, resolve) => {
    //validating the data inputs
    let errorList = []
    if (newData.id === "") {
      errorList.push("Try Again, You didn't enter the id field")
    }
    if (newData.body === "") {
      errorList.push("Try Again, You didn't enter the body field")
    }
    if (newData.title === "") {
      errorList.push("Try Again, You didn't enter the title field")
    }

    if (errorList.length < 1) {
      axios.post(`https://jsonplaceholder.typicode.com/posts`, newData)
        .then(response => {
          let newUserdata = [...user];
          newUserdata.push(newData);
          setUser(newUserdata);
          resolve()
          setErrorMessages([])
          setIserror(false)
            
 

        })
        .catch(error => {
          setErrorMessages(["Cannot add data. Server error!"])
          setIserror(true)
          resolve()
        })
    } else {
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }







return (

  
    <div className="App">
      <h1>React MaterialTable-UI Using JSONPLACEHOLDER API</h1> <br /><br />
      <ul class="nav nav-tabs" role="tablist">
        <li class="active"><a href="#home" role="tab" data-toggle="tab">User Posts</a></li>
        <li><a href="#profile" role="tab" data-toggle="tab">Liked Posts</a></li>
        <li><a href="#messages" role="tab" data-toggle="tab">Disliked Posts</a></li>
      </ul>

      <div class="tab-content">
        <div class="tab-pane active" id="home">
        <MaterialTable
            title="User Table"
            columns={columns}
            data={user}
            options={{
              headerStyle: { borderBottomColor: 'white', borderBottomWidth: '3px', fontFamily: 'verdana' },
              actionsColumnIndex: -1
            }}
            actions={[
              {
                icon: ThumbUp,
                tooltip: 'Like Post',
                onClick: (event, rowData) => { 
                  let newlikes =[...like];
                  newlikes.push(rowData);
                  setLike(newlikes);
                }
              },
              {
                icon: ThumbDown,
                tooltip: 'Dislike Post',
                onClick: (event, rowData) => { 
                  let newdislikes =[...dislike];
                  newdislikes.push(rowData);
                  setDislike(newdislikes);
                }
              }
            ]}
            editable={{
              onRowUpdate: (newData, previousData) =>
                new Promise((resolve) => {
                  handleRowUpdate(newData, previousData, resolve);

                }),
              onRowAdd: (newData) =>
                new Promise((resolve) => {
                  handleRowAdd(newData, resolve)
                }),
              onRowDelete: (previousData) =>
                new Promise((resolve) => {
                  handleRowDelete(previousData, resolve)
                }),
            }}
          />
        </div>
        <div class="tab-pane" id="profile">
        <MaterialTable
            title="Like Table"
            columns={columns}
            data={like}
            options={{
              headerStyle: { borderBottomColor: 'white', borderBottomWidth: '3px', fontFamily: 'verdana' },
              actionsColumnIndex: -1
            }}
            
          />





        </div>
        

        <div class="tab-pane" id="messages">
        <MaterialTable
            title="Dislike Table"
            columns={columns}
            data={dislike}
            options={{
              headerStyle: { borderBottomColor: 'white', borderBottomWidth: '3px', fontFamily: 'verdana' },
              actionsColumnIndex: -1
            }}
            
          />

        </div>
      </div>



        
  
   

   </div>
  );
}

export default App;
