import {CLEAR_TODO_LIST, ADD_TODO, DELETE_TODO, SET_SELECTED_TODO, EDIT_TODO,
    SET_ACTIVE_USER, SET_USER_LOGOUT
} from './types';

export const setActiveUser = (user) => (
    {
        type: SET_ACTIVE_USER,
        payload: user
    }
);

export const setUserLogout = (user) => (
    {
        type: SET_USER_LOGOUT,
        payload: user
    }
);

export const clearTodoList = (user) => (
    {
        type: CLEAR_TODO_LIST
    }
);

export const addTodo = (todo) => (
    {
        type: ADD_TODO,
        payload: todo
    }
);

export const deleteTodo = (id) => (
    {
        type: DELETE_TODO,
        payload: id
    }
);

export const setSelectedTodo = (todo) => (
    {
        type: SET_SELECTED_TODO,
        payload: todo
    }
);

export const editTodo = (todo) => (
    {
        type: EDIT_TODO,
        payload: todo
    }
);