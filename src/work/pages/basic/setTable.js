import React, { Component, useState, useEffect, useReducer } from 'react';
import {Link} from 'react-router-dom'
import { Button } from 'antd'
import { combineReducers ,createStore,compose, applyMiddleware } from 'redux'
// class SetTable extends Component {
//
//   render() {
//     return (
//       <div className='schedule-time pt20'>
//         <div>
//           <Link to="/basic/equipment_manage">返回设备管理</Link>
//         </div>
//         <div>
//           设置课表时间
//           <Button type='link'>创建新方案</Button>
//         </div>
//         <div className='empty-data-block shadow'>
//           暂无方案
//         </div>
//
//       </div>
//     );
//   }
// }
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function SetTable() {
  const [count1,  setCount1] = useState(1)
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [count2,  setCount2] = useState(1)
  // const [person,  setPerson] = useState({name:'张三', age: 18})
  // // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器的 API 更新页面标题
    document.title = `You clicked ${count1} times`;
  });
  return (
    <div>
      {/*<p>你点击了{count2}次</p>*/}
      {/*<p>你点击了{person.age}次</p>*/}
      {/*<p>名字{person.name}</p>*/}
      Count: {state.count}
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => setCount1(count1 +1 )}>点击</button>
      <button onClick={() => setCount1(precount => count1 - 1 )}>点击</button>
      {/*<button onClick={() => setCount2(count2 +1 )}>点击</button>*/}
      {/*<button onClick={() => setPerson({age: person.age +1} )}>点击</button>*/}
    </div>
  )
  // function incre () {
  //   store.dispatch({ type: 'INCREMENT' });
  // }
  //
  // function decre () {
  //   store.dispatch({ type: 'DECREMENT' });
  // }
  //
  // function change () {
  //   store.dispatch({ type: 'DONE' });
  // }
  //
  // return (
  //   <div>
  //     <button onClick={incre}>增加</button>
  //     <button onClick={decre}>减少</button>
  //     <button onClick={change}>减少</button>
  //   </div>
  // )

}

// function counter(state = 0, action) {
//   switch (action.type) {
//     case 'INCREMENT':
//       return state + 1;
//     case 'DECREMENT':
//       return state - 1;
//     default:
//       return state;
//   }
// }
// function toggle(state = {}, action) {
//   switch (action.type) {
//     case 'DONE':
//       state.done = true
//       return state
//     case 'UNDONE':
//       state.done = false
//       return state
//     default:
//       return state
//   }
// }
// let reducer = combineReducers({counter, toggle})
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(reducer, composeEnhancers());
//
// // 可以手动订阅更新，也可以事件绑定到视图层。
// store.subscribe(() =>
//   console.log(store.getState())
// );

export default SetTable;
