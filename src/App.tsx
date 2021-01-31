import React from 'react'
import { JWKInterface } from 'arweave/node/lib/wallet'

// Hooks
import useContract from './hooks/useContract'

// Addresses
// const JOSEPH_WALLET_ADDRESS = 'O6SGGaUbSm72rQO-9A7SGFUIGOiSy8Uih1-zbQmufaU'

function App() {
  const [wallet, setWallet] = React.useState<JWKInterface | null>(null)
  const [loginError, setLoginError] = React.useState<boolean>(false)
  const [markets, setMarkets] = React.useState<any>([])
  const [loadingState, setLoadingState] = React.useState<boolean>(false)

  React.useEffect(() => {
    setLoadingState(true)
    const onGetContractState = async () => {
      const newContractState = await getContractState()

      const addIdsToArrary = (result: any): any[] => {
        let newIdArray: any[] = []
        let newArray: any[] = []
        newIdArray = Object.keys(result)
    
        Object.keys(result).map(function(key, index) {
            newArray.push(result[key])
            newArray[index].id = newIdArray[index]
            return newArray
        })
        return newArray
      }
      const marketsArrary = addIdsToArrary(newContractState.markets)
      setMarkets(marketsArrary)
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

  // Creating Market
  const [marketNote, setMarketNote] = React.useState<string>('')
  const [marketTweetUsername, setMarketTweetUsername] = React.useState<string>('')
  const [marketTweetPhoto, setMarketTweetPhoto] = React.useState<string>('')
  const [marketTweetCreated, setMarketTweetCreated] = React.useState<string>('')
  const [marketTweetLink, setMarketTweetLink] = React.useState<string>('')
  const [marketTxd, setMarketTxd] = React.useState<string | false>('')

  // Staking
  const [stakeTxId, setStakeTxId] = React.useState<string | false>('')

  // Disbursing
  const [disburseTxId, setDisburseTxId] = React.useState<string | false>('')

  // Hooks
  const {
    getContractState,
    onTransfer,
    onCreateMarket,
    onStake,
    onDisburse,
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

  const onNewMarket = async () => {
    // const note = 'This is my 1st Tweet!';
    // const tweetUsername = '@ECWireless';
    // const tweetPhoto = 'https://twitter.com/BiIIMurray/photo';
    // const tweetCreated = 'Sun Jan 24 2021 21:28:51 GMT-0700 (Mountain Standard Time)';
    // const tweetLink = 'https://twitter.com/BiIIMurray/status/437367711723978752';

    const trasactionId = await onCreateMarket(
      marketNote,
      marketTweetUsername,
      marketTweetPhoto,
      marketTweetCreated,
      marketTweetLink
    )
    setMarketTxd(trasactionId)
    console.log(trasactionId)
  }

  const onMarketStake = async (id: string, cast: string, stakedAmount: number) => {
    const trasactionId = await onStake(id, cast, stakedAmount)
    setStakeTxId(trasactionId)
    console.log(trasactionId)
  }

  const onConcludeMarket = async (id: string) => {
    const trasactionId = await onDisburse(id)
    setDisburseTxId(trasactionId)
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
              <button onClick={onNewMarket}>Tweet</button>
              {marketTxd && <p>Tx ID: {marketTxd}</p>}
              <br />

              <h2>Tweets:</h2>
              {markets.map((market: any, index: number) => {
                return (
                  <div key={index}>
                    <p>{market.tweet}</p>
                    <p>Yays: {market.yays}</p>
                    <p>Nays: {market.nays}</p>
                    <button onClick={() => onMarketStake(market.marketId, 'yay', 5000)}>Yes</button>
                    <button onClick={() => onMarketStake(market.marketId, 'nay', 3000)}>No</button>
                    <button onClick={() => onConcludeMarket(market.marketId)}>Conclude Market</button>
                    <br />
                  </div>
                )
              })}
              {stakeTxId && <p>Tx ID: {stakeTxId}</p>}
              {disburseTxId && <p>Tx ID: {disburseTxId}</p>}
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
