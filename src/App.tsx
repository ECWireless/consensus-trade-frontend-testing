import React from 'react'
import { JWKInterface } from 'arweave/node/lib/wallet'

// Hooks
import useContract from './hooks/useContract'

// Addresses
// const JOSEPH_WALLET_ADDRESS = 'O6SGGaUbSm72rQO-9A7SGFUIGOiSy8Uih1-zbQmufaU'

function App() {
  const [wallet, setWallet] = React.useState<JWKInterface | null>(null)
  const [loginError, setLoginError] = React.useState<boolean>(false)
  const [contractState, setContractState] = React.useState<any>(null)
  const [loadingState, setLoadingState] = React.useState<boolean>(false)

  React.useEffect(() => {
    setLoadingState(true)
    const onGetContractState = async () => {
      const newContractState = await getContractState()
      setContractState(newContractState)
      setLoadingState(false)
      console.log(newContractState)
    }
    onGetContractState()
    // eslint-disable-next-line
  }, [])

  // Transferring
  const [transferTarget, setTransferTarget] = React.useState<string>('')
  const [transferQty, setTransferQty] = React.useState<number>(0)
  const [transferTxId, setTransferTxId] = React.useState<string | false>('')

  // Locking
  const [lockQty, setLockQty] = React.useState<number>(0)
  const [lockLength, setLockLength] = React.useState<number>(750)
  const [lockTxId, setLockTxId] = React.useState<string | false>('')

  // Proposing
  const [proposeNote, setProposeNote] = React.useState<string>('')
  const [proposeTxId, setProposeTxId] = React.useState<string | false>('')

  // Voting
  const [voteTxId, setVoteTxId] = React.useState<string | false>('')

  // Hooks
  const {
    getContractState,
    onTransfer,
    onLock,
    onPropose,
    onVote
  } = useContract(wallet! as JWKInterface)

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

  const onTransferToken = async () => {
    if (transferTarget !== '' && transferQty > 0) {
      const trasactionId = await onTransfer(transferTarget, transferQty)
      setTransferTxId(trasactionId)
      console.log(trasactionId)
    } else {
      setTransferTxId('Invalid Inputs')
    }
  }

  const onLockTokens = async () => {
    if (lockQty > 0) {
      const trasactionId = await onLock(lockQty, lockLength)
      setLockTxId(trasactionId)
      console.log(trasactionId)
    } else {
      setLockTxId('Invalid Inputs')
    }
  }

  const onProposeNote = async () => {
    if (proposeNote !== '') {
      const trasactionId = await onPropose('indicative', proposeNote)
      setProposeTxId(trasactionId)
      console.log(trasactionId)
    } else {
      setProposeTxId('Invalid Inputs')
    }
  }

  const onCastVote = async (id: number, cast: string) => {
    const trasactionId = await onVote(id, cast)
    setVoteTxId(trasactionId)
    console.log(trasactionId)
  }

  return (
    <div>
      {loadingState 
        ? <div>Loading...</div>
        : (
          <div>
          <h1 style={{ textAlign: 'center' }}>Hooks Testing</h1>
          {!wallet ? (
          <div style={{ width: '50%', margin: '0 auto' }}>
            <p>Upload Wallet</p>
            <input type="file" onChange={uploadWallet} />
          </div>)
          : (
            <div style={{ width: '50%', margin: '0 auto' }}>
              <br />
              <h2>Transfer:</h2>
              <label>To address:</label>
              <br />
              <input type="text" value={transferTarget} onChange={(e) => setTransferTarget(e.target.value)}/>
              <br />
              <label>Amount to send:</label>
              <br />
              <input type="number" value={transferQty} onChange={(e) => setTransferQty(Number(e.target.value))}/>
              <br />
              <br />
              <button onClick={onTransferToken}>Transfer Tokens</button>
              {transferTxId && <p>Tx ID: {transferTxId}</p>}

              <h2>Lock:</h2>
              <label>Amount to lock:</label>
              <br />
              <input type="number" value={lockQty} onChange={(e) => setLockQty(Number(e.target.value))}/>
              <br />
              <label>Lock length:</label>
              <br />
              <input type="number" value={lockLength} onChange={(e) => setLockLength(Number(e.target.value))}/>
              <br />
              <br />
              <button onClick={onLockTokens}>Lock Tokens</button>
              {lockTxId && <p>Tx ID: {lockTxId}</p>}

              <h2>Propose Something:</h2>
              <label>Proposal:</label>
              <br />
              <input type="string" value={proposeNote} onChange={(e) => setProposeNote(e.target.value)}/>
              <br />
              <br />
              <button onClick={onProposeNote}>Propose</button>
              {proposeTxId && <p>Tx ID: {proposeTxId}</p>}
              <br />

              <h2>Assertions:</h2>
              {contractState.votes.map((vote: any, index: number) => {
                return (
                  <div key={index}>
                    <p>{vote.note}</p>
                    <p>Yays: {vote.yays}</p>
                    <p>Nays: {vote.nays}</p>
                    <button onClick={() => onCastVote(index, 'yay')}>Yes</button>
                    <button onClick={() => onCastVote(index, 'nay')}>No</button>
                    <br />
                  </div>
                )
              })}
              {voteTxId && <p>Tx ID: {voteTxId}</p>}
              <br />
              <br />
            </div>)}
          </div>
        )
      }
      
    </div>
  );
}

export default App;
