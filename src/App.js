import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(){
    super()
    this.state = {
      items: [],
      value: '',
      sortOrder: 1
    }
    this.getData = this.getData.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.submit = this.submit.bind(this)
    this.sortAscending = this.sortAscending.bind(this)
    this.sortDescending = this.sortDescending.bind(this)
  }

  handleChange(e){
    this.setState({
      value: e.target.value
    })
  }

  async getData(){
    const resp = await fetch('//localhost:3000/items');
    const json = await resp.json();
    await json.sort((a,b)=>{
        const abody = a.body || "";
        const bbody = b.body || "";
        if(abody.toString() > bbody.toString()) return this.state.sortOrder;
        if(abody.toString() < bbody.toString()) return (this.state.sortOrder * -1);
        return 0
      })
    this.setState({
      items: json
    })
  }

  sortItems(){
    const itemsClone = [].concat(this.state.items);
    this.setState({
      items: itemsClone.sort((a,b)=>{
        const abody = a.body || "";
        const bbody = b.body || "";
        if(abody.toString() > bbody.toString()) return this.state.sortOrder;
        if(abody.toString() < bbody.toString()) return (this.state.sortOrder * -1);
        return 0
      })
    })
  }

  componentDidMount(){
    this.getData();
  }

  sortAscending(){
    this.setState({
      sortOrder: 1
    })
    setTimeout(()=>{
      this.sortItems();  
    },0)
  }

  sortDescending(){
    this.setState({
      sortOrder: -1
    })
    setTimeout(()=>{
      this.sortItems();  
    }, 0)
    
  }

  async submit(){
    const resp = await fetch('//localhost:3000/items',{
      method: 'POST',
      body:  JSON.stringify({item:{body: this.state.value}}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if(resp.status === 200){
      const retJson = await resp.json();
      this.setState(state => {
        const items = state.items.concat(retJson);
        items.sort((a,b)=>{
          const abody = a.body || "";
          const bbody = b.body || "";
          if(abody.toString() > bbody.toString()) return this.state.sortOrder;
          if(abody.toString() < bbody.toString()) return (this.state.sortOrder * -1);
          return 0
        })
        return {
          ...state,
          value: '',
          items
        }
      })

    }
  }

  render() {


    const listItems = this.state.items.map((item)=>
      <li key={item.id}>{item.body}</li>
    )

    return (
      <div className="App">
        <input value={this.state.value} onChange={this.handleChange}></input><button onClick={this.submit}>submit</button>
        <button onClick={this.sortAscending}>sort ascending</button>
        <button onClick={this.sortDescending}>sort descending</button>
        <ul>
          {listItems}
        </ul>
      </div>
    );
  }
}

export default App;
