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
  const [lockLength, setLockLength] = React.useState<number>(2160)
  const [lockTxId, setLockTxId] = React.useState<string | false>('')

  // Creating Market
  const [marketNote, setMarketNote] = React.useState<string>('')
  const [marketTweetUsername, setMarketTweetUsername] = React.useState<string>('')
  const [marketTweetPhoto, setMarketTweetPhoto] = React.useState<string>('')
  const [marketTweetCreated, setMarketTweetCreated] = React.useState<string>('')
  const [marketTweetLink, setMarketTweetLink] = React.useState<string>('')
  const [marketTxd, setMarketTxd] = React.useState<string | false>('')

  // Voting
  const [voteTxId, setVoteTxId] = React.useState<string | false>('')

  // Hooks
  const {
    getContractState,
    onTransfer,
    onLock,
    onCreateMarket,
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

  const onNewMarket = async () => {
    // const note = 'This is my 1st Tweet!';
    // const tweetUsername = '@ECWireless';
    // const tweetPhoto = 'https://twitter.com/BiIIMurray/photo';
    // const tweetCreated = 'Sun Jan 24 2021 21:28:51 GMT-0700 (Mountain Standard Time)';
    // const tweetLink = 'https://twitter.com/BiIIMurray/status/437367711723978752';

    const trasactionId = await onCreateMarket(
      'createMarket',
      marketNote,
      marketTweetUsername,
      marketTweetPhoto,
      marketTweetCreated,
      marketTweetLink
    )
    setMarketTxd(trasactionId)
    console.log(trasactionId)
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

              <h2>Stake:</h2>
              <label>Amount to stake:</label>
              <br />
              <input type="number" value={lockQty} onChange={(e) => setLockQty(Number(e.target.value))}/>
              <br />
              <br />
              <button onClick={onLockTokens}>Lock Tokens</button>
              {lockTxId && <p>Tx ID: {lockTxId}</p>}

              <h2>Create Market:</h2>
              <label>Tweet:</label>
              <br />
              <input type="string" value={marketNote} onChange={(e) => setMarketNote(e.target.value)}/>
              <br />
              <br />
              <label>Tweet by:</label>
              <br />
              <input type="string" value={marketTweetUsername} onChange={(e) => setMarketTweetUsername(e.target.value)}/>
              <br />
              <br />
              <label>User's Photo:</label>
              <br />
              <input type="string" value={marketTweetPhoto} onChange={(e) => setMarketTweetPhoto(e.target.value)}/>
              <br />
              <br />
              <label>Tweet created timestamp:</label>
              <br />
              <input type="string" value={marketTweetCreated} onChange={(e) => setMarketTweetCreated(e.target.value)}/>
              <br />
              <br />
              <label>Tweet link:</label>
              <br />
              <input type="string" value={marketTweetLink} onChange={(e) => setMarketTweetLink(e.target.value)}/>
              <br />
              <br />
              <button onClick={onNewMarket}>Propose</button>
              {marketTxd && <p>Tx ID: {marketTxd}</p>}
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
