import React from 'react'
import { Heading, VStack, Text, Center} from '@chakra-ui/core'
import { useEffect, useReducer } from 'react'

/* https://docs.ethers.io/v5/ */
import { ethers } from 'ethers'


const web3Reducer = (state, action) => {
  switch(action.type) {
    case 'SET_isWeb3':
      return { ...state, isWeb3: action.isWeb3 }
      case 'SET_enabled':
        return { ...state, isEnabled: action.isEnabled}
        case 'SET_account' : 
        return{ ...state, account: action.account}
        case 'SET_provider': 
        return { ...state, provider: action.provider}
        case 'SET_network': 
        return {...state, network:action.network}
        case 'SET_balance':
          return {...state, balance: action.balance}
    default:
      throw new Error (`Unhandled action ${action.type} in webreducer`)
  }
}

//Is web3 is injected?

const initialWeb3State =  {
  isWeb3: false,
  isEnabled: false,
//is metamask : false
  account: ethers.constants.AddressZero,
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
    dispatch({ type: 'SET_account', account: accounts[0]})
  
  } catch(e) {
    console.log('Error:', e)
     dispatch({ type: 'SET_enabled', isEnabled: false})
    }  
  }
  if(state.isWeb3){
    connect2Metamask ()}
    
  }, [state.isWeb3])

  //connect to provider and get information

  useEffect(() => {
    const connect2Provider = async () => {
      try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    dispatch({ type: 'SET_provider', provider: provider })
    const network = await provider.getNetwork()
    dispatch({ type: 'SET_network', network: network})
    const _balance = await provider.getBalance(state.account)
    const balance = ethers.utils.formatEther(_balance)
    dispatch({ type: 'SET_balance', balance: balance})
  } catch(e){
    dispatch({type: 'SET_network', network: initialWeb3State.network})
    dispatch({type : 'SET_balance', balance: initialWeb3State.balance})

  }}
   if (state.isEnabled && state.account !== ethers.constants.AddressZero){
  connect2Provider ()}
}, [state.isEnabled, state.account])

  return (
    <>
    <Center>
        <Heading mb={10}>Web 3 demo</Heading>
        </Center>
        <VStack>
        <Text>Web 3 environnement: {state.isWeb3 ? 'Injected' : 'uninjected'}</Text>
        <Text>Metamask status: {state.isEnabled ? 'Connected' : 'disconnected'} </Text>
        {state.isEnabled && <Text>Account:{state.account} </Text>}
        <Text>balance: {state.balance}</Text>
        {state.netword && (
        <>
        <Text>network name: {state.network.name} </Text>
        <Text>Nework id : {state.network.chainId} </Text>
        </>
        )}
      </VStack>
    </>
  );
}

export default App;
