import React from 'react'
import { JWKInterface } from 'arweave/node/lib/wallet'

// Hooks
import useContract from './hooks/useContract'

// Addresses
// const JOSEPH_WALLET_ADDRESS = 'O6SGGaUbSm72rQO-9A7SGFUIGOiSy8Uih1-zbQmufaU'

function App() {
  const [wallet, setWallet] = React.useState<JWKInterface | null>(null)
  const [loginError, setLoginError] = React.useState<boolean>(false)

  // Reading state
  const [stateRead, setStateRead] = React.useState<boolean>(false)

  // Transferring
  const [transferTarget, setTransferTarget] = React.useState<string>('')
  const [transferQty, setTransferQty] = React.useState<number>(0)
  const [transferTxId, setTransferTxId] = React.useState<string | false>('')

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
    if (transferTarget !== '' && transferQty > 0) {
      const trasactionId = await onTransfer(transferTarget, transferQty)
      setTransferTxId(trasactionId)
      console.log(trasactionId)
    } else {
      setTransferTxId('Invalid Inputs')
    }
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
        <h2>Transfer:</h2>
        <br />
        <label>To address:</label>
        <br />
        <input type="text" value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)}/>
        <br />
        <label>Amount to send:</label>
        <br />
        <input type="number" value={transferQty} onChange={(e) => setTransferQty(Number(e.target.value))}/>
        <br />
        <br />
        <button onClick={onTransferToken}>Transfer</button>
        {transferTxId && <p>Tx ID: {transferTxId}</p>}
      </div>)}
    </div>
  );
}

export default App;
