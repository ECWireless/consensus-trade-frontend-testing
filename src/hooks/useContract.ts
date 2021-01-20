import { readContract } from 'smartweave'
// import { JWKInterface } from 'arweave/node/lib/wallet'
// import { useState } from 'react'
// import { ContractInterface, ContractList } from './interfaces'
import useArweave from './useArweave'

const CONTRACT_ADDRESS = 'qoUAMfYEBVOLQoQgqvbTyv302UVaFfl58jZow46sHhc'

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
        const contractState = await readContract(arweave, CONTRACT_ADDRESS)
        return contractState
    }


    return { getContractState }
}
