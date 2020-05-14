import React from 'react'

class TodoApp extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      items : [
          { name : "Feed the cats", status: "New" },
          { name : "Feed the dogs", status: "New" },
          { name : "Feed the cloud", status: "New" }
      ]
    }
  }
  render() {
    return (
      <div className="TodoApp">
        <main>
          <h1> TODO List </h1>
          <TodoList items = {this.state.items} />
        </main>
      </div>
    );
  }
}


class TodoList extends React.Component{
  render(){
    return (
      <div className="TodoList">
        <ul>
          {
            this.props.items.map( (itm, i) => {
              return <TodoItem item={itm} key={i} />
            })
          }
        </ul>
      </div>
    )
  }
}

class TodoItem extends React.Component{
  render(){
    const item = this.props.item;

    return(
      <li>
        <input type="checkbox" />
        {item.name}
      </li>
    )
  }
}

export default TodoApp;
