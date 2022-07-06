export const apyCalculator = ({
  liquidityRate,
  variableBorrowRate,
  aEmissionPerSecond,
  vEmissionPerSecond,
  totalATokenSupply,
  totalCurrentVariableDebt,
  underlyingTokenDecimal,
  priceInEth,
  rewardTokenDecimals,
}: {
  liquidityRate: number;
  variableBorrowRate: number;
  aEmissionPerSecond: number;
  vEmissionPerSecond: number;
  totalATokenSupply: number;
  totalCurrentVariableDebt: number;
  underlyingTokenDecimal: number;
  priceInEth: number;
  rewardTokenDecimals: number;
}) => {
  const RAY = 10 ** 27; // 10 to the power 27
  const SECONDS_PER_YEAR = 31536000;

  // Deposit and Borrow calculations
  // APY and APR are returned here as decimals, multiply by 100 to get the percents

  const depositAPR = liquidityRate / RAY;
  const variableBorrowAPR = variableBorrowRate / RAY;
  const stableBorrowAPR = variableBorrowRate / RAY;

  const depositAPY =
    (1 + depositAPR / SECONDS_PER_YEAR) ^ (SECONDS_PER_YEAR - 1);
  const variableBorrowAPY =
    (1 + variableBorrowAPR / SECONDS_PER_YEAR) ^ (SECONDS_PER_YEAR - 1);
  const stableBorrowAPY =
    (1 + stableBorrowAPR / SECONDS_PER_YEAR) ^ (SECONDS_PER_YEAR - 1);

  // Incentives calculation

  const aEmissionPerYear = aEmissionPerSecond * SECONDS_PER_YEAR;
  const vEmissionPerYear = vEmissionPerSecond * SECONDS_PER_YEAR;

  const WEI_DECIMALS = 10 ** 18; // All emissions are in wei units, 18 decimal places

  // underlyingTokenDecimal will be the decimals of token underlying the aToken or debtToken
  // For Example, underlyingTokenDecimal for aUSDC will be 10**6 because USDC has 6 decimals

  const incentiveDepositAPRPercent =
    (100 * (aEmissionPerYear * rewardTokenDecimals * WEI_DECIMALS)) /
    (totalATokenSupply * priceInEth * underlyingTokenDecimal);

  const incentiveBorrowAPRPercent =
    (100 * (vEmissionPerYear * rewardTokenDecimals * WEI_DECIMALS)) /
      (totalCurrentVariableDebt * priceInEth * underlyingTokenDecimal) || 0;
  return {
    incentiveDepositAPRPercent: incentiveDepositAPRPercent,
    incentiveBorrowAPRPercent: incentiveBorrowAPRPercent,
    depositAPY,
    variableBorrowAPY,
    stableBorrowAPY,
  };
};
