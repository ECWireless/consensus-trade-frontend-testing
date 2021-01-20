import { readContract } from 'smartweave'
// import { JWKInterface } from 'arweave/node/lib/wallet'
// import { useState } from 'react'
// import { ContractInterface, ContractList } from './interfaces'
import useArweave from './useArweave'

const CONTRACT_ADDRESS = 'EizpnspCV3x4Gc8H11X5JzKF9NRUzCeDC-jhU6gC9es'
const TEST_CONTRACT_ADDRESS = 'YggvBIHYIihBoWsWJg4wBeTDQUBR7KVZG62o2DFYWr0'

export default function useContracts() {
    const arweave = useArweave()

    // const [contracts, setContracts] = useState<ContractList>({})

    // const addMarket = async (contract: ContractInterface): Promise<string | false> => {
    //     const contractId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
    //         function: 'create',
    //         contract
    //     })
    //     const newContracts: ContractList = contracts
    //     newContracts[contractId as string] = contract
    //     setContracts(newContracts)
    //     return contractId
    // }

    const getContractState = async (): Promise<any> => {
        const contractState = await readContract(arweave, CONTRACT_ADDRESS, 609515)
        return contractState
    }


    return { getContractState }
}
