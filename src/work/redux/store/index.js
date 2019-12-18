import { createStore } from 'redux'
import todoApp from '../reducers/todo'

let store = createStore(todoApp)
