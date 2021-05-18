import { BigNumberish } from 'ethers';
import bigNumberishToNumber from './bigNumberishToNumber';

const numberFormatCurrency = Intl.NumberFormat(navigator.languages.slice(), {
  style: 'currency',
  currency: 'USD',
  // currencyDisplay: 'narrowSymbol',
  currencyDisplay: 'symbol',
});

const numberFormatToken = Intl.NumberFormat(navigator.languages.slice(), {
  style: 'decimal',
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
  // minimumSignificantDigits: 3,
  // maximumSignificantDigits: 3
});

const numberFormatTokenWhole = Intl.NumberFormat(navigator.languages.slice(), {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const numberFormatTokenFull = Intl.NumberFormat(navigator.languages.slice(), {
  style: 'decimal',
  minimumFractionDigits: 18,
  maximumFractionDigits: 18,
});

const numberFormatTokenCustom = (
  minFractionDigits: number,
  maxFractionDigits: number
) =>
  Intl.NumberFormat(navigator.languages.slice(), {
    style: 'decimal',
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
  });

const numberFormatPercent = Intl.NumberFormat(navigator.languages.slice(), {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const numberFormatPercentShort = Intl.NumberFormat(
  navigator.languages.slice(),
  {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }
);

const numberFormatPercentLong = Intl.NumberFormat(navigator.languages.slice(), {
  style: 'percent',
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const numberFormatDate = Intl.DateTimeFormat(navigator.languages.slice(), {
  dateStyle: 'medium',
});

export function currency(value: BigNumberish, units?: number | string) {
  return numberFormatCurrency
    .formatToParts(bigNumberishToNumber(value, units))
    .reduce((acc, curr) => {
      // Safari doesn't support "narrowSymbol" so for now manually replace "US$" with "$"
      return `${acc}${curr.type === 'currency' ? '$' : curr.value}`;
    }, '');
}

export function token(value: BigNumberish, units?: number | string) {
  return numberFormatToken.format(bigNumberishToNumber(value, units));
}

export function tokenWhole(value: BigNumberish, units?: number | string) {
  return numberFormatTokenWhole.format(bigNumberishToNumber(value, units));
}

export function tokenFull(value: BigNumberish, units?: number | string) {
  return numberFormatTokenFull.format(bigNumberishToNumber(value, units));
}

export function tokenCustom(
  value: BigNumberish,
  units?: number | string,
  minFractionDigits = 4,
  maxFractionDigits = 4
) {
  return numberFormatTokenCustom(minFractionDigits, maxFractionDigits).format(
    bigNumberishToNumber(value, units)
  );
}

export function percent(value: BigNumberish, units?: number | string) {
  return numberFormatPercent.format(bigNumberishToNumber(value, units));
}

export function percentShort(value: BigNumberish, units?: number | string) {
  return numberFormatPercentShort.format(bigNumberishToNumber(value, units));
}

export function percentLong(value: BigNumberish, units?: number | string) {
  return numberFormatPercentLong.format(bigNumberishToNumber(value, units));
}

export function date(value: BigNumberish, units?: number | string) {
  return numberFormatDate.format(bigNumberishToNumber(value, units));
}

const formatNumber = {
  currency,
  token,
  tokenWhole,
  tokenFull,
  tokenCustom,
  percent,
  percentShort,
  percentLong,
  date,
};

export default formatNumber;
