import { useState } from 'react'

const App = () => {


  const Statistics = (props) => {
    const sum = props.good + props.neutral + props.bad
    if (sum == 0){
      return (
        <div>
          <p>No feedback given</p>
        </div>
      )
    }
    return (
      <table>
      <tbody>
        <StatisticLine text="good" value ={props.good} />
        <StatisticLine text="neutral" value ={props.neutral} />
        <StatisticLine text="bad" value ={props.bad} />
        <StatisticLine text="all" value ={sum} />
        <StatisticLine text="average" value ={(props.good * 1 + props.neutral * 0 + props.bad *(-1)) / sum} />
        <StatisticLine text='positive' value={`${parseFloat(props.good / sum) * 100 } %`}/>
      </tbody>
      </table>
    )
  }

  const StatisticLine = (props) => {
    return (
      <tr>
        <td>{props.text}</td> 
        <td>{props.value}</td>
      </tr>
    )
  }
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => {
    setGood(good + 1)
  }
  const increaseNeut = () => {
    setNeutral(neutral + 1)
  }
  const increaseBad = () => {
    setBad(bad + 1)
  }

  const Button = (props) => {
    return (
      <button onClick={props.onClick}>
        {props.text}
      </button>
    )
  }
  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={increaseGood} text='good'/>
      <Button onClick={increaseNeut} text='neutral'/>
      <Button onClick={increaseBad} text='bad'/>
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
