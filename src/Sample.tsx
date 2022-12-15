
import { useState } from 'react';
import * as web3 from '@solana/web3.js'
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { RePlasticTracker } from './RePlasticTrackerProgram'
import { SolanaMovieProgram } from './data/solana_movie_program'
import * as smpIdl2 from './idl.json';
import * as smpIdl from './data/solana_movie_program.json';
import * as anchor from "@project-serum/anchor";

const RE_PLASTIC_TRACKER_PROGRAM_ID = 'Aq6sLZDjh3MiwpWyk1J84RQT7vKZfGtsZRaNGHtQfEwv'

const MOVIE_REVIEW_PROGRAM_ID = '2SogeA4hASCYGTSQqoSqKy8cZ3bnka5N5U9Ewkswkyf5'


function Sample () {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const trialReadMovie = async () => {
        if (!wallet?.publicKey) {
            // alert('Please connect your wallet!')
            return
        };
        const smpClient = new anchor.Program<SolanaMovieProgram>(
            smpIdl as any,
            new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
            new anchor.AnchorProvider(
                connection,
                wallet,
                anchor.AnchorProvider.defaultOptions()
            )
        ) 
        const movie = {title:"Test Anto", rating:4, description:"Please write"}
        const [pda] = await web3.PublicKey.findProgramAddress(
            [
                wallet.publicKey.toBuffer(), 
                Buffer.from(anchor.utils.bytes.utf8.encode(movie.title))
            ],
            new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
        )
        const movieOnChain = await smpClient.account.movieAccountState.fetch(pda)
        alert(movieOnChain)
        console.log(movieOnChain)
    }

    const trialWriteMovie = async () => {
        if (!wallet?.publicKey) {
            // alert('Please connect your wallet!')
            return
        };
        const movie = {title:"Test Anto", rating:4, description:"Please write - Updated"}
        const smpClient = new anchor.Program<SolanaMovieProgram>(
            smpIdl as any,
            new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
            new anchor.AnchorProvider(
                connection,
                wallet,
                anchor.AnchorProvider.defaultOptions()
            )
        ) 
        const [pda] = await web3.PublicKey.findProgramAddress(
            [
                wallet.publicKey.toBuffer(), 
                Buffer.from(anchor.utils.bytes.utf8.encode(movie.title))
            ],
            new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID)
        )
        const variant = await connection.getAccountInfo(pda)? 1: 0;
        
        
        try {
            const txSig = await smpClient.methods.addOrUpdateReview(
                variant,
                movie.title,
                movie.rating,
                movie.description
            ).accounts({
                initializer: wallet.publicKey,
                pdaAccount: pda,
                systemProgram: web3.SystemProgram.programId
            }).rpc();
            alert(`Transaction submitted: https://solana.fm/tx/${txSig}?cluster=devnet-solana`)
            console.log(`Transaction submitted: https://solana.fm/tx/${txSig}?cluster=devnet-solana`)
        } catch (e) {
            console.log(JSON.stringify(e))
            alert(JSON.stringify(e))
        }
    }

    const trialWrite = async () => {
        //  console.log(wallet, connection)
        if (!wallet?.publicKey) {
            // alert('Please connect your wallet!')
            return
        };
    
        const smpClient = new anchor.Program<RePlasticTracker>(
            smpIdl2 as any,
            new web3.PublicKey(RE_PLASTIC_TRACKER_PROGRAM_ID),
            new anchor.AnchorProvider(
                connection,
                wallet,
                anchor.AnchorProvider.defaultOptions()
            )
        ) 
        console.log(smpClient.account);
        const [pda] = web3.PublicKey.findProgramAddressSync(
            [
                wallet.publicKey.toBuffer(), 
                Buffer.from(anchor.utils.bytes.utf8.encode("trial1111"))
            ],
            new web3.PublicKey(RE_PLASTIC_TRACKER_PROGRAM_ID)
        )
        const variant = await connection.getAccountInfo(pda)? 1: 0;
        console.log(variant, pda)
        try {
            const txSig = await smpClient.methods.addOrUpdateProduct(
                variant,
                100,
                "serialNum-trial",
                "ingtidient-key-trial",
                "ingridient-serial-num-trial",
                "purcharser-trial"
            ).accounts({
                initializer: wallet.publicKey,
                pdaAccount: pda,
                systemProgram: web3.SystemProgram.programId
            }).rpc();
            alert(`Transaction submitted: https://solana.fm/tx/${txSig}?cluster=devnet-solana`)
            console.log(`Transaction submitted: https://solana.fm/tx/${txSig}?cluster=devnet-solana`)
        } catch (e) {
            console.log(JSON.stringify(e))
            alert(JSON.stringify(e))
        }
    }

    return(
        <>
        <h1>Sample</h1>
        <button onClick={trialWriteMovie}>Test Write (Movie)</button>
        <button onClick={trialReadMovie}>Test Read (Movie)</button>
        <p></p>
        <button onClick={trialWrite}>Test Write (RePlastic)</button>
        </>
    )
    }

export default Sample