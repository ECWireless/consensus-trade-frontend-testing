import { interactWrite, readContract } from 'smartweave'
import { JWKInterface } from 'arweave/node/lib/wallet'
// import { useState } from 'react'
// import { ContractInterface, ContractList } from './interfaces'
import useArweave from './useArweave'

const CONTRACT_ADDRESS = 'qoUAMfYEBVOLQoQgqvbTyv302UVaFfl58jZow46sHhc'

export default function useContracts(wallet: JWKInterface) {
    const arweave = useArweave()

    const getContractState = async (): Promise<any> => {
        const contractState = await readContract(arweave, CONTRACT_ADDRESS)
        return contractState
    }

    const onTransfer = async (target: string, qty: number): Promise<string | false> => {
        const txId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
            function: 'transfer',
            target,
            qty,
        })
        return txId
    }

    const onLock = async (qty: number, lockLength: number): Promise<string | false> => {
        const txId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
            function: 'lock',
            qty,
            lockLength,
        })
        return txId
    }

    const onPropose = async (type: string, note: string): Promise<string | false> => {
        const txId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
            function: 'propose',
            type,
            note,
        })
        return txId
    }

    const onVote = async (id: number, cast: string): Promise<string | false> => {
        const txId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
            function: 'vote',
            id,
            cast,
        })
        return txId
    }

    return { getContractState, onTransfer, onLock, onPropose, onVote }
}
