import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import styled from 'styled-components'

import Alerts from 'components/shared/Alerts'
import { Grid } from 'blockchain-components'

const Wrapper = styled.div`
  background-color: #004A7C;
  height: auto;
  width: 100%;

  @media(min-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }
`
const HeaderContainer = styled.div`
  position: relative;
  width: 100%;

  @media(min-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
  }
`
const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow-y: auto;
`
const FooterContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 0;

  @media(min-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
  }
`

const PublicLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <Wrapper>
        <HeaderContainer>
          <Grid>
            <Alerts />
            <Header />
          </Grid>
        </HeaderContainer>
        <ContentContainer>
          <Component {...matchProps} />
        </ContentContainer>
        <FooterContainer>
          <Grid>
            <Footer />
          </Grid>
        </FooterContainer>
      </Wrapper>
    )} />
  )
}

export default PublicLayout
