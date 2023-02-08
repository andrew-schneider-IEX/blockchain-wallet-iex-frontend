import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from '@iex-xyz/sdk'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { BlockchainLoader } from 'blockchain-info-components'
import { actions, selectors } from 'data'

const Iframe = styled.iframe`
  border: none;
  height: 400px;
  width: 440px;
`

const DispatchCard = (props: Props) => {
  const [dispatch] = useState(Dispatch())
  const [dispatchEmbedUrl, setDispatchEmbedUrl] = useState('')

  const tweetMessage = () => {
    const tweet = 'Blockchain.com just gave you an inbox! Check it out!'
    const encodedTweet = encodeURIComponent(tweet)
    const url = `https://twitter.com/intent/tweet?text=${encodedTweet}`
    window.open(url, '_blank')
  }

  const handleRecordEventSuccess = ({ event }) => {
    const eventType = event.data.data.event.type
    if (eventType === 'SHARE') {
      tweetMessage()
    }
    props.alertsActions.displaySuccess(`Dispatch event logged: ${eventType}`)
  }

  const handleSignMessage = async ({ event }) => {
    const eventType = event.data.data.event.type
    try {
      const message = dispatch.formatMessageForSigning({
        dispatchMessageId: event.data.dispatchMessageId,
        type: eventType
      })
      const signature = await props.dispatchSigner.signMessage(message)
      dispatch.generatedSignature({
        event,
        signature
      })
      props.alertsActions.displaySuccess(`Successfully signed message. Event type: ${eventType}`)
    } catch (error: any) {
      props.alertsActions.displayError(`Failed to sign message. ${error.message}`)
    }
  }

  useEffect(() => {
    if (!props.dispatchSigner) {
      props.nftActions.getDispatchSigner()
    }
    setDispatchEmbedUrl(
      dispatch.create({
        dispatchMessageId: props.messageId,
        onNoWalletConnected: () => props.alertsActions.displayError('No wallet connected'),
        onRecordEventSuccess: handleRecordEventSuccess,
        // @ts-ignore
        onRequestWalletConnection: async () =>
          props.alertsActions.displayError('Wallet connection requested'),
        // @ts-ignore
        onRequestWalletDisconnection: async () =>
          props.alertsActions.displayError('Wallet disconnection requested'),
        // @ts-ignore
        onSignMessage: handleSignMessage,
        source: 'blockchain.com',
        walletAddress: props.ethAddress
      })
    )
    return () => dispatch.destroy()
  }, [props.dispatchSigner])

  return (
    <div>
      {dispatchEmbedUrl ? (
        <Iframe src={dispatchEmbedUrl} allow='clipboard-read; clipboard-write;' loading='lazy' />
      ) : (
        <BlockchainLoader width='80px' height='80px' />
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  dispatchSigner: selectors.components.nfts.getDispatchSigner(state),
  ethAddress: selectors.core.kvStore.eth.getDefaultAddress(state).getOrElse('')
})

const mapDispatchToProps = (dispatch) => ({
  alertsActions: bindActionCreators(actions.alerts, dispatch),
  nftActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  ethAddress: string
  messageId: string
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(DispatchCard)
