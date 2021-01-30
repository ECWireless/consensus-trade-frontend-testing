import { interactWrite, readContract } from 'smartweave'
import { JWKInterface } from 'arweave/node/lib/wallet'
// import { useState } from 'react'
// import { ContractInterface, ContractList } from './interfaces'
import useArweave from './useArweave'

const CONTRACT_ADDRESS = 'iEPkBNzZTNXSsEJUKL-RH5N1IkEf83EGWG2-L3kSa3s'

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

    const onCreateMarket = async (
        tweet: string,
        tweetUsername: string,
        tweetPhoto: string,
        tweetCreated: string,
        tweetLink: string,
    ): Promise<string | false> => {
        const txId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
            function: 'createMarket',
            tweet,
            tweetUsername,
            tweetPhoto,
            tweetCreated,
            tweetLink,
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

    const onStake = async (id: number, cast: string, stakedAmount: number): Promise<string | false> => {
        const txId = await interactWrite(arweave, wallet, CONTRACT_ADDRESS, {
            function: 'stake',
            id,
            cast,
            stakedAmount,
        })
        return txId
    }

    return { getContractState, onTransfer, onLock, onCreateMarket, onVote, onStake }
}
