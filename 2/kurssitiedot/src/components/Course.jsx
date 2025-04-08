const Header = (props) => {
    return (
      <div>
        <h1>{props.name}</h1>
      </div>
    )
  }

const Part = (props) => {
return (
    <div>
    <p>{props.parts.name} {props.parts.exercises}</p>
    </div>
)
}

const Content = (props) => {
    const pparts = props.parts.map(x => {return <Part key={x.id} parts={x}/> })
    return (
      <div>
        {pparts}
      </div>
    )
  }
  
  const Total = (props) => {
    console.log(props)
    const total = 
    props.parts.reduce( (s, p) => s+p.exercises,0 )
    return (
      <div>

        <b>total of exercises {total}</b>
      </div>
    )
  }

const Course = (props) => {
    return(
        <div>
        <Header name={props.course.name} />
        <Content parts={props.course.parts}/>
        <Total parts={props.course.parts}/>
      </div>
    )
}

export default Course