import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Modal, ModalBody, Text } from 'blockchain-info-components'
import { actions } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

const Group = styled.div`
  margin-bottom: 20px;
`
const GroupHeader = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.black};
  text-align: center;
  margin-bottom: 20px;
`
const Iframe = styled.iframe`
  border: none;
  height: 500px;
  width: 440px;
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  padding: 16px;
  justify-content: flex-end;
`
const CloseIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.theme.grey000};
  backdrop-filter: blur(54.3656px);
  > span {
    justify-content: center;
  }
`

const VerifyNotice = ({ close }) => {
  const handleCloseClick = useCallback(() => {
    close()
  }, [close])

  const verifyNowClick = useCallback(() => {
    close()
  }, [close])

  return (
    <Modal>
      <Header>
        <CloseIconContainer>
          <Icon
            cursor
            data-e2e='completeProfileCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={handleCloseClick}
          />
        </CloseIconContainer>
      </Header>
      {/* @ts-ignore */}
      <ModalBody style={{ padding: '5px 20px' }}>
        <Group>
          <GroupHeader>
            You have been selected for a poll from Dispatch! Respond for a chance to win great
            prizes!
          </GroupHeader>
          <Iframe
            src='https://sdk-staging.dispatch.xyz/?source=dispatch-docs&dispatchMessageId=196'
            allow='clipboard-read; clipboard-write;'
            loading='lazy'
          />
        </Group>
        <Group>
          <Button
            nature='primary'
            data-e2e='linkBankContinue'
            height='48px'
            size='16px'
            type='submit'
            disabled={false}
            onClick={verifyNowClick}
            fullwidth
          >
            Dismiss
          </Button>
        </Group>
      </ModalBody>
    </Modal>
  )
}

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer(ModalName.VERIFY_NOTICE_MODAL),
  connect(undefined, mapDispatchToProps)
)

export default enhance(VerifyNotice)
