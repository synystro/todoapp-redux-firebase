import {SET_ACTIVE_USER, SET_USER_LOGOUT,
    CLEAR_TODO_LIST, ADD_TODO, DELETE_TODO, SET_SELECTED_TODO, EDIT_TODO} from './types';

const initialState = {
    userEmail:null,
    userId:null,
    todoList:[],
    selectedTodo:''
}

const todoReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_ACTIVE_USER:
            return {
                ...state,
                userEmail: action.payload.email,
                userId: action.payload.id
            };
        case SET_USER_LOGOUT:
            return {
                ...state,
                userEmail: null,
                userId: null              
            };
        case CLEAR_TODO_LIST:
            return {
                ...state,
                todoList:[]
            }
        case ADD_TODO:      
            return {
                ...state,
                todoList: state.todoList.concat({
                    id: action.payload.id,
                    title: action.payload.title,
                    description: action.payload.description,
                    date: action.payload.date                    
                })
            };
        case DELETE_TODO:
            return {
                ...state,
                todoList: state.todoList.filter((todo) =>
                    todo.id !== action.payload
                )
            };
        case SET_SELECTED_TODO:
            const item = state.todoList.find(
                (todo) => todo.id === action.payload.id
            )      
            return {
                ...state,
                selectedTodo: item
            };
        case EDIT_TODO:
            // get todo index
            const index = state.todoList.findIndex(
                (todo) => todo.id === action.payload.id
            )
            // change todo accordingly
            state.todoList[index] = action.payload             
            return {
                ...state, 
                todoList: state.todoList.map(
                    (todo, i) => i === index ? {
                    ...todo, title: action.payload.title} : todo
                )                
            };
        default:
            return state;
    }
}

export default todoReducer;