import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Login from './Components/Login'
import { ethers } from 'ethers';
import Connected from './Components/Connected';


function App() {
  // const [count, setCount] = useState(0)
  const [provider, setprovider] = useState(null)
  const [account, setaccount] = useState(null)
  const [isConnected, setisConnected] = useState(false)

  const handleAccountsChanged = (accounts) => {
    setaccount(accounts[0])
  }
  useEffect(() => {
    window.ethereum.on('accountsChanged',handleAccountsChanged)
    return () => {
      window.ethereum.removeListener('accountsChanged',handleAccountsChanged)
    }
    
  })

  const connectTOWallet = async () => {
    
    
    if(window.ethereum) {
      try {
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          console.log(provider);
          setprovider(provider)
          await provider.send('eth_requestAccounts',[])
          const signer = provider.getSigner()
          const accAddress = await signer.getAddress()
          console.log('address', accAddress);
          setaccount(accAddress)
          setisConnected(true)
      } catch (error) {
          console.log('Some error occured', error);
      }
    } else {
      console.log('Metamask not detected!');
    }
  }
  return (
    <>
      {isConnected ? <Connected accountId={account}/> : <Login connectTOWallet={connectTOWallet}/>}    
    </>
  )
}

export default App
