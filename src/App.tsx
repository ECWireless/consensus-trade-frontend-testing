import React from 'react'
import { JWKInterface } from 'arweave/node/lib/wallet'

// Hooks
import useArweave from './hooks/useArweave'
import useContract from './hooks/useContract'

// Consts
const JOSEPH_WALLET_ADDRESS = 'O6SGGaUbSm72rQO-9A7SGFUIGOiSy8Uih1-zbQmufaU'
const AMOUNT_TO_SEND = 100

function App() {
  const [loginError, setLoginError] = React.useState<boolean>(false)
  const [stateRead, setStateRead] = React.useState<boolean>(false)
  const [transferTxId, setTransferTxId] = React.useState<string | false>('')
  const [wallet, setWallet] = React.useState<JWKInterface | null>(null)

  // Hooks
  const { getContractState, onTransfer } = useContract(wallet! as JWKInterface)

  // Upload wallet
	const uploadWallet = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const fileReader = new FileReader()
		
		fileReader.onload = async (e) => {
			try {
				setWallet(JSON.parse(e.target!.result as string))
			} catch (err) {
				setLoginError(true)
				console.error('Invalid wallet was uploaded.', err)
			}
		}
		
		if (evt.target.files?.length) {
			fileReader.readAsText(evt.target.files[0])
		}
	}

  const onGetContractState = async () => {
    const contractState = await getContractState()
    setStateRead(true)
    console.log(contractState)
  }

  const onTransferToken = async () => {
    const trasactionId = await onTransfer(JOSEPH_WALLET_ADDRESS, AMOUNT_TO_SEND)
    setTransferTxId(trasactionId)
    console.log(trasactionId)
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Hooks Testing</h1>
      {!wallet ? (
      <div style={{ width: '50%', margin: '0 auto' }}>
        <p>Upload Wallet</p>
        <input type="file" onChange={uploadWallet} />
      </div>)
      : (<div style={{ width: '50%', margin: '0 auto' }}>
        <button onClick={onGetContractState}>Get Contract State</button>
        <br />
        {stateRead && <p>State was logged to the console.</p>}
        <br />
        <button onClick={onTransferToken}>Transfer</button>
        {transferTxId && <p>{transferTxId}</p>}
      </div>)}
    </div>
  );
}

export default App;
