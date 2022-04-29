import React from 'react';

const UserReducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return {
        loggedIn: true,
        loading: false,
      };
    case 'logout':
      return {
        loading: false,
        loggedIn: false,
      };
    case 'loading':
      return {
        ...state,
        loading: true,
      };
  }
};

export default UserReducer;
