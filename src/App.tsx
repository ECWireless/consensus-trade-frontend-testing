import React from 'react'
import { JWKInterface } from 'arweave/node/lib/wallet'

// Hooks
import useArweave from './hooks/useArweave'
import useContract from './hooks/useContract'

function App() {
	const [wallet, setWallet] = React.useState<JWKInterface | null>(null)

  // Hooks
  const arweave = useArweave()
  const { getContractState } = useContract()

  const onGetContractState = async () => {
    const contractState = await getContractState()
    console.log(contractState)
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Hooks Testing</h1>
      <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between', margin: '0 auto' }}>
        <button onClick={onGetContractState}>Get Contract State</button>
      </div>
    </div>
  );
}

export default App;
