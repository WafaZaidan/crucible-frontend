function coerceToAcceptedCharacters(amount: string) {
  const match = amount.match(/[\d.]/g);
  if (match) {
    // Only permit a single decimal point
    const firstDecimalIndex = match.indexOf('.');
    const filteredCharacters = match.filter((character, index) => {
      return index === firstDecimalIndex || character !== '.';
    });
    if (filteredCharacters[0] === '.') {
      filteredCharacters.unshift('0');
    }
    return filteredCharacters.join('');
  }
  return '';
}

export default function sanitisePositiveDecimalInput(
  amountNew: string,
  amountOld: string
) {
  const digitsNewMatch = amountNew.match(/\d/g);
  const digitsOldMatch = amountOld.match(/\d/g);
  if (digitsOldMatch && digitsNewMatch) {
    const digitsNew = digitsNewMatch.join('');
    const digitsOld = digitsOldMatch.join('');
    // if the digits match up then potentially use amountOld to preserve last decimal point location
    if (digitsNew === digitsOld) {
      const amountNewHas0or1Decimal =
        amountNew.indexOf('.') === amountNew.lastIndexOf('.');
      // amountOld always has 0 or 1 decimal, due to already been sanitised
      // amountNew can have more than 1 decimal due to user keypresses or pasting in dodgy string
      // if amountNew has 0 or 1 then any change compared to before is user adding or removing a decimal place, thus use amountNew
      return !amountNewHas0or1Decimal
        ? amountOld
        : coerceToAcceptedCharacters(amountNew);
    }
  }
  return coerceToAcceptedCharacters(amountNew);
}
