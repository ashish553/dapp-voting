import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi } from './Constants/Constant.js';
import Login from './Components/Login';
import Finished from './Components/Finished';
import Connected from './Components/Connected';
import './App.css';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";



function App() {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  // const [provider, setProvider] = useState(null);
  const votingStatus = true;
  const [color, setColor] = useState('default');
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [remainingTime, setremainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [CanVote, setCanVote] = useState(true);


  useEffect(() => {
    // console.log(import.meta.env.VITE_CONTRACT_ADDRESS);

    // getCurrentStatus();
    if (window.ethereum) {
      getCandidates();
      getRemainingTime();
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  }, []);


  async function vote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );

    const tx = await contractInstance.vote(number);
    await tx.wait();
    canVote();
    getCandidates();
  }


  async function canVote() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const voteStatus = await contractInstance.voters(await signer.getAddress());
    setCanVote(voteStatus);

  }

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const candidatesList = await contractInstance.getAllVotesOfCandiates();
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber()
      }
    });
    setCandidates(formattedCandidates);
  }


  // async function getCurrentStatus() {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     await provider.send("eth_requestAccounts", []);
  //     const signer = provider.getSigner();
  //     const contractInstance = new ethers.Contract (
  //       contractAddress, contractAbi, signer
  //     );
  //     const status = await contractInstance.getVotingStatus();
  //     console.log(status);
  //     // if(status){}
  //     setVotingStatus(status);
  // }

  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );
    const time = await contractInstance.getRemainingTime();
    setremainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Connected : " + address);
        setIsConnected(true);
        canVote();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Web3 wallet detected in the browser")
      onOpen()
    }
  }

  async function handleNumberChange(e) {
    console.log('number seelcted', e.target.value);
    e.target.value ? setColor('success') : setColor('default')
    setNumber(e.target.value);
  }

  let {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <div className="App">
      {/* <Button onPress={onOpen}>Open Modal</Button> */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Error</ModalHeader>
              <ModalBody>
                <p>
                  Metamask not detected in the browser
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {votingStatus ? (isConnected ? (<Connected
        account={account}
        candidates={candidates}
        remainingTime={remainingTime}
        number={number}
        handleNumberChange={handleNumberChange}
        voteFunction={vote}
        showButton={CanVote}
        color={color} />)

        :

        (<Login connectWallet={connectToMetamask} />)) : (<Finished />)}

    </div>
  );



}





export default App;