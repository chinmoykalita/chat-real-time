"use client"

import MainComponent from './components/MainComponent';
import React from 'react';
import axios from 'axios';

export default function Home() {
  
  React.useEffect(() => {
    let user = localStorage.getItem("loggedUser");
    if (!user) {
      let name = prompt("Please enter your name!");
      let pass = prompt("Please enter the password!");

      if (name && pass) {
        axios.post('http://localhost:8080/create_user', { "name": name, "password": pass })
          .then((res) => {
            if (res.status === 201) {
              console.log("user created succesfully of id", res.data.id)
              localStorage.setItem("loggedUser", res.data.id);
              localStorage.setItem("name", res.data.name)
            }
          });
      };
    };
  }, []);

  return (
    <MainComponent />
  )
}
