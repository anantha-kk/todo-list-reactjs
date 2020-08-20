import React, { Component } from 'react';
import TodoListDashboard from './TodoListDashboard';
import fetch from 'isomorphic-fetch';

class App extends Component {
  constructor() {
    super()
    this.state = {
      lists: [],
      currentList: {name:''},
    }
  }
  componentDidMount = async () => {
    const response = await fetch('https://m2ve8r4p80.execute-api.us-east-1.amazonaws.com/beta/todos-team3?userId=testUser10', {
      headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
				'User-Agent': 'todo',
			},
      method:'GET'
    });
    const json = await response.json();
    this.setState({lists : json});
  }
  
  handleInput = e => {
    const itemText = e.target.value;
    const currentList = { name: itemText }
    this.setState({
      currentList
    })
  }

  addList = async(e) => {
    e.preventDefault();
    const newList = this.state.currentList;
    const request = {name: newList.name, items:[], userId:'testUser10'};
    if (newList.name !== '') {
      const response = await fetch('https://m2ve8r4p80.execute-api.us-east-1.amazonaws.com/beta/todos-team3', {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'todo',
          },
          body: JSON.stringify(request),
          method:'POST'
        });
      if(response.status === 200){
        const json = await response.json();
        request.id = json.id;
        const lists = this.state.lists;
        lists.unshift(request);
        this.setState({ lists: lists });
        this.inputElement.value = '';
      }
    }
  }

  editList = async (newList) => {
    // console.log(newList);
    const response = await fetch(`https://m2ve8r4p80.execute-api.us-east-1.amazonaws.com/beta/todos-team3/${newList.id}`, {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'todo',
          },
          body: JSON.stringify(newList),
          method:'PUT'
        });
    if(response.status === 200){
      const lists = this.state.lists;
      this.state.lists.forEach((list, i) => {
        if(list.id === newList.id) {
          lists[i] = newList;
        }
      });
      this.setState({ lists: lists});
    }
  }

  deleteList = async(id) => {
    const filteredLists = this.state.lists.filter(list => {
      return list.id !== id
    })
    const response = await fetch(`https://m2ve8r4p80.execute-api.us-east-1.amazonaws.com/beta/todos-team3/${id}`, {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'todo',
          },
          method:'DELETE'
        });
    if(response.status === 200){
      this.setState({ lists: filteredLists});
    }
  }
  render() {
    return (
      <div>
        <div>
          <div>
            <input
                  placeholder="Enter Task"
                  ref={c => {
                    this.inputElement = c;
                  }}
                  value={this.state.currentList.text}
                  onChange={this.handleInput}
            />
            <button onClick={this.addList}>Add List</button>
          </div>
        </div>
        <TodoListDashboard entries={this.state.lists} editList={this.editList} deleteList={this.deleteList}/>
      </div>
    );
  }
}

export default App;
