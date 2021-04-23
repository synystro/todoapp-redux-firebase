import {createStore, combineReducers} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension'
import todoReducer from './reducer';

const rootReducer = combineReducers({
    todoReducer: todoReducer
})

const configureStore = () => createStore(rootReducer, composeWithDevTools());

export default configureStore;