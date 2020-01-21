import * as React from 'react'
import { connect } from 'react-redux'

import { useIncrement } from './hooks/use-increment'
import { Dispatch, RootState } from './store'

const mapState = (state: RootState) => ({
  dolphins: state.dolphins,
  sharks: state.sharks,
  zooDolphins: state.zoo.dolphins,
  zooSharks: state.zoo.sharks,
  cityPerson: state.city.person,
  cityZoo: state.city.zoo,
})

const mapDispatch = (dispatch: Dispatch) => ({
  incrementDolphins: dispatch.dolphins.increment,
  incrementDolphinsAsync: dispatch.dolphins.incrementAsync,
  incrementSharks: () => dispatch.sharks.increment(1),
  incrementSharksAsync: () => dispatch.sharks.incrementAsync(1),
  incrementSharksAsync2: () => dispatch({ type: 'sharks/incrementAsync', payload: 2 }),
  incrementZooDolphins: dispatch.zoo.dolphins.increment,
  incrementZooDolphinsAsync: dispatch.zoo.dolphins.incrementAsync,
  incrementZooSharks: () => dispatch.zoo.sharks.increment(1),
  incrementZooSharksAsync: () => dispatch.zoo.sharks.incrementAsync(1),
  incrementZooSharksAndDolphins: dispatch.zoo.incrementDolphinsAndSharks,
  incrementZooSharksAndDolphinsAsync: () => dispatch.zoo.incrementDolphinsAndSharksAsync(),
  incrementCityPerson: dispatch.city.person.increment,
  incremetnCityZooDolphins: () => dispatch.city.zoo.dolphins.incrementAsync(),
})

type connectedProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>
type Props = connectedProps

function Count(props: Props) {
  const incrementTwoModels = useIncrement()
  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      <div style={{ width: 120 }}>
        <h3>Dolphins</h3>
        <h1>{props.dolphins.cnt}</h1>
        <button onClick={props.incrementDolphins}>+1</button>
        <button onClick={props.incrementDolphinsAsync}>Async +1</button>
      </div>
      <div style={{ width: 200 }}>
        <h3>Sharks</h3>
        <h1>{props.sharks}</h1>
        <button onClick={props.incrementSharks}>+1</button>
        <button onClick={props.incrementSharksAsync}>Async +1</button>
        <button onClick={props.incrementSharksAsync2}>Async +2</button>
      </div>
      <div style={{ width: 200 }}>
        <h3>Sharks and Dolphins</h3>
        <h1>{props.sharks}</h1>
        <h1>{props.dolphins.cnt}</h1>
        <button onClick={incrementTwoModels}>+1</button>
      </div>
      <div style={{ width: 200 }}>
        <h3>Zoo.Dolphins</h3>
        {/* <h1>{props.zooDolphins.cnt}</h1> */}
        <button onClick={() => props.incrementZooDolphins()}>+1</button>
        <button onClick={props.incrementZooDolphinsAsync}>Async +1</button>
      </div>
      <div style={{ width: 200 }}>
        <h3>Zoo.Sharks</h3>
        <h1>{props.zooSharks}</h1>
        <button onClick={props.incrementZooSharks}>+1</button>
        <button onClick={props.incrementZooSharksAsync}>Async +1</button>
      </div>
      <div style={{ width: 200 }}>
        <h3>Zoo.Sharks and Dolphins</h3>
        <h1>{props.zooSharks}</h1>
        <button onClick={props.incrementZooSharksAndDolphins}>+1</button>
        <button onClick={props.incrementZooSharksAndDolphinsAsync}>Async +1</button>
      </div>
      <div style={{ width: 200 }}>
        <h3>City.Zoo and Person</h3>
        {/* <h1>
          {props.cityZoo.dolphins.cnt} and {props.cityZoo.sharks}
        </h1> */}
        <h1>{props.cityPerson}</h1>
        <button onClick={props.incrementCityPerson}>+1</button>
        <button onClick={props.incremetnCityZooDolphins}>Async +1</button>
      </div>
    </div>
  )
}

export default connect(
  mapState,
  mapDispatch,
)(Count)
