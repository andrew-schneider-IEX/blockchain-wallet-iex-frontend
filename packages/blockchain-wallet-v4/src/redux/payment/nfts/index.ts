import { ethers, Signer } from 'ethers'

import { NftOrdersType } from '@core/network/api/nfts/types'

import { wyvernABI } from './abi'
import { _makeMatchingOrder, assignOrdersToSides, bigNumberToBN, NULL_BLOCK_HASH } from './utils'

export const fulfillNftOrder = async (order: NftOrdersType['orders'][0], signer: Signer) => {
  const accountAddress = await signer.getAddress()
  const txnData = {
    from: accountAddress,
    gasLimit: 325_000,
    gasPrice: 120_000_000_000,
    value: order.basePrice.toString()
  }
  const matchingOrder = _makeMatchingOrder({
    accountAddress,
    order,
    recipientAddress: accountAddress
  })

  const { buy, sell } = assignOrdersToSides(order, matchingOrder)

  const args = [
    [
      buy.exchange,
      buy.maker,
      buy.taker,
      '0x0000000000000000000000000000000000000000', // DISCREPANCY!
      buy.target,
      buy.staticTarget,
      buy.paymentToken,
      sell.exchange,
      sell.maker,
      sell.taker,
      sell.feeRecipient,
      sell.target,
      sell.staticTarget,
      sell.paymentToken
    ],
    [
      buy.makerRelayerFee.toString(),
      buy.takerRelayerFee.toString(),
      buy.makerProtocolFee.toString(),
      buy.takerProtocolFee.toString(),
      buy.basePrice.toString(),
      buy.extra.toString(),
      buy.listingTime.toString(),
      buy.expirationTime.toString(),
      // TODO FIXME: this is a hack
      buy.salt.toString(),
      sell.makerRelayerFee.toString(),
      sell.takerRelayerFee.toString(),
      sell.makerProtocolFee.toString(),
      sell.takerProtocolFee.toString(),
      sell.basePrice.toString(),
      sell.extra.toString(),
      sell.listingTime.toString(),
      sell.expirationTime.toString(),
      sell.salt.toString()
    ],
    [
      buy.feeMethod,
      buy.side,
      buy.saleKind,
      buy.howToCall,
      sell.feeMethod,
      sell.side,
      sell.saleKind,
      sell.howToCall
    ],
    buy.calldata,
    sell.calldata,
    '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    buy.staticExtradata,
    sell.staticExtradata,
    [buy.v || 0, sell.v || 0],
    [
      buy.r || NULL_BLOCK_HASH,
      buy.s || NULL_BLOCK_HASH,
      sell.r || NULL_BLOCK_HASH,
      sell.s || NULL_BLOCK_HASH,
      NULL_BLOCK_HASH
    ]
  ]

  const contract = new ethers.Contract(
    '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b',
    wyvernABI,
    signer
  )

  const isBuyValid = await contract.validateOrder_(
    [
      buy.exchange,
      buy.maker,
      buy.taker,
      '0x0000000000000000000000000000000000000000',
      buy.target,
      buy.staticTarget,
      buy.paymentToken
    ],
    [
      buy.makerRelayerFee.toString(),
      buy.takerRelayerFee.toString(),
      buy.makerProtocolFee.toString(),
      buy.takerProtocolFee.toString(),
      buy.basePrice.toString(),
      buy.extra.toString(),
      buy.listingTime.toString(),
      buy.expirationTime.toString(),
      buy.salt.toString()
    ],
    buy.feeMethod,
    buy.side,
    buy.saleKind,
    buy.howToCall,
    buy.calldata,
    '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    buy.staticExtradata,
    buy.v || 0,
    buy.r || NULL_BLOCK_HASH,
    buy.s || NULL_BLOCK_HASH
  )

  const isSellValid = await contract.validateOrder_(
    [
      sell.exchange,
      sell.maker,
      sell.taker,
      sell.feeRecipient,
      sell.target,
      sell.staticTarget,
      sell.paymentToken
    ],
    [
      sell.makerRelayerFee.toString(),
      sell.takerRelayerFee.toString(),
      sell.makerProtocolFee.toString(),
      sell.takerProtocolFee.toString(),
      sell.basePrice.toString(),
      sell.extra.toString(),
      sell.listingTime.toString(),
      sell.expirationTime.toString(),
      sell.salt.toString()
    ],
    sell.feeMethod,
    sell.side,
    sell.saleKind,
    sell.howToCall,
    sell.calldata,
    '0x000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    sell.staticExtradata,
    sell.v || 0,
    sell.r || NULL_BLOCK_HASH,
    sell.s || NULL_BLOCK_HASH
  )

  // if (!isBuyValid) throw new Error('Buy order is invalid')
  // if (!isSellValid) throw new Error('Sell order is invalid')

  const matchPrice = await contract.calculateMatchPrice_(
    [
      buy.exchange,
      buy.maker,
      buy.taker,
      buy.feeRecipient,
      buy.target,
      buy.staticTarget,
      buy.paymentToken,
      sell.exchange,
      sell.maker,
      sell.taker,
      sell.feeRecipient,
      sell.target,
      sell.staticTarget,
      sell.paymentToken
    ],
    [
      buy.makerRelayerFee.toString(),
      buy.takerRelayerFee.toString(),
      buy.makerProtocolFee.toString(),
      buy.takerProtocolFee.toString(),
      buy.basePrice.toString(),
      buy.extra.toString(),
      buy.listingTime.toString(),
      buy.expirationTime.toString(),
      // TODO FIXME: this is a hack
      buy.salt.toString(),
      sell.makerRelayerFee.toString(),
      sell.takerRelayerFee.toString(),
      sell.makerProtocolFee.toString(),
      sell.takerProtocolFee.toString(),
      sell.basePrice.toString(),
      sell.extra.toString(),
      sell.listingTime.toString(),
      sell.expirationTime.toString(),
      sell.salt.toString()
    ],
    [
      buy.feeMethod,
      buy.side,
      buy.saleKind,
      buy.howToCall,
      sell.feeMethod,
      sell.side,
      sell.saleKind,
      sell.howToCall
    ],
    buy.calldata,
    sell.calldata,
    buy.replacementPattern,
    sell.replacementPattern,
    buy.staticExtradata,
    sell.staticExtradata
  )

  try {
    const match = await contract.atomicMatch_(...args, txnData)
    console.log(match.hash)
    debugger
  } catch (e) {
    console.log(e)
  }
}

// https://codesandbox.io/s/beautiful-euclid-nd7s8?file=/src/index.ts
// metamask https://etherscan.io/tx/0xb52c163434d85e79a63e34cadbfb980d928e4e70129284ae084d9ad992ba9778
// bc.com https://etherscan.io/tx/0xdb0620e6e1b186f4f84e4740b2453506b61416d79fd7de01a6e7ed2f9e5e3623
