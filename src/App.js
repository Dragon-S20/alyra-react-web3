import React from 'react'
import { Heading, VStack, Text, Center} from '@chakra-ui/core'
import { useEffect, useReducer } from 'react'

/* https://docs.ethers.io/v5/ */
/*import { ethers } from 'ethers'*/


const web3Reducer = (state, action) => {
  switch(action.type) {
    case 'SET_isWeb3':
      return { ...state, isWeb3: action.isWeb3 }
      case 'SET_enabled':
        return { ...state, isEnabled: action.isEnabled}
    default:
      throw new Error (`Unhandled action ${action.type} in webreducer`)
  }
}

//Is web3 is injected?

const initialWeb3State =  {
  isWeb3: false,
  isEnabled: false,
//is metamask : false
  account: '0x0',
  //probider c'est la connection a la blockchain
  provider: null,
  //C'est une information de lecture
  balance: 0,
  network: null,
  //rlui qui peut effectuer des transactions et payer du gas
  signer: null,

}



function App() {
  const [state, dispatch] = useReducer(web3Reducer, initialWeb3State)
  //check if web 3 is injected
  useEffect (() =>{
    if(typeof window.ethereum !== 'undefined') {
      dispatch({ type: 'SET_isWeb3', isWeb3: true })
    } else {
      dispatch({ type: 'SET_isWeb3', isWeb3: false })
    }
   
  }, [])

  //check if metamask is enable
  useEffect(()=>{
    const  connect2Metamask= async () => {
      try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'
    })
    dispatch({type: 'SET_enabled', isEnabled: true})
  
  } catch(e) {
    console.log('Error:', e)
     dispatch({ type: 'SET_enabled', isEnabled: false})
    }  
  }
  if(state.isWeb3){
    connect2Metamask ()}
    
  }, [state.isWeb3])

  useEffect(() =>{

  }, [state.isEnabled])

  return (
    <>
    <Center>
        <Heading mb={10}>Web 3 demo</Heading>
        </Center>
        <VStack>
  <Text>Web 3 environnement: {state.isWeb3 ? 'Injected' : 'uninjected'}</Text>
        <Text>Metamask status: {state.isEnabled ? 'Connected' : 'disconnected'} </Text>
        <Text>Account:{initialWeb3State.account} </Text>
        <Text>Balance: {initialWeb3State.balance}  </Text>
        <Text>Nework: </Text>
      </VStack>
      
    </>
  );
}

export default App;
