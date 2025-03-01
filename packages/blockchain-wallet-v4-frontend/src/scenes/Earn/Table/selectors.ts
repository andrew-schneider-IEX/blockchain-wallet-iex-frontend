import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from '@core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const activeRewardsAccountBalanceR =
    selectors.components.interest.getActiveRewardsAccountBalance(state)
  const passiveRewardsAccountBalanceR =
    selectors.components.interest.getPassiveRewardsAccountBalance(state)
  const stakingAccountBalanceR = selectors.components.interest.getStakingAccountBalance(state)
  const interestEligibleR = selectors.components.interest.getInterestEligible(state)
  const activeRewardsEligibleR = selectors.components.interest.getActiveRewardsEligible(state)
  const stakingEligibleR = selectors.components.interest.getStakingEligible(state)
  const showInterestInfoBox = selectors.preferences.getShowInterestInfoBox(state) as boolean
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const sortedInstrumentsR = selectors.components.interest.getInstrumentsSortedByBalance(state)

  return lift(
    (
      activeRewardsAccountBalance: ExtractSuccess<typeof activeRewardsAccountBalanceR>,
      passiveRewardsAccountBalance: ExtractSuccess<typeof passiveRewardsAccountBalanceR>,
      sortedInstruments: ExtractSuccess<typeof sortedInstrumentsR>,
      stakingAccountBalance: ExtractSuccess<typeof stakingAccountBalanceR>,
      interestEligible: ExtractSuccess<typeof interestEligibleR>,
      activeRewardsEligible: ExtractSuccess<typeof activeRewardsEligibleR>,
      stakingEligible: ExtractSuccess<typeof stakingEligibleR>,
      walletCurrency: FiatType
    ) => ({
      activeRewardsAccountBalance,
      activeRewardsEligible,
      interestEligible,
      passiveRewardsAccountBalance,
      showInterestInfoBox,
      sortedInstruments,
      stakingAccountBalance,
      stakingEligible,
      walletCurrency
    })
  )(
    activeRewardsAccountBalanceR,
    passiveRewardsAccountBalanceR,
    sortedInstrumentsR,
    stakingAccountBalanceR,
    interestEligibleR,
    activeRewardsEligibleR,
    stakingEligibleR,
    walletCurrencyR
  )
}
