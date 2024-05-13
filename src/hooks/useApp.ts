/**
 * useApp
 */
type IMatchConfig = number | number[];
interface ICardConfigs {
  name: string;
  prefix: IMatchConfig[];
  length: IMatchConfig[];
}

const cardConfigs: ICardConfigs[] = [
  {
    name: 'Switch',
    prefix: [4903, 4905, 4911, 4936, 564182, 633110, 6333, 6759],
    length: [16, 18, 19]
  },
  {
    name: 'American Express',
    prefix: [34, 37],
    length: [15]
  },
  {
    name: 'Diners Club',
    prefix: [38, 39],
    length: [14]
  },
  {
    name: 'Visa',
    prefix: [4],
    length: [13, 16, 19]
  },
  {
    name: 'MasterCard',
    prefix: [51, 52, 53, 54, 55],
    length: [16]
  },
  {
    name: 'Discover',
    prefix: [6011, 65, [644, 649], [622126, 622925] ],
    length: [16, 19]
  },
  {
    name: 'Maestro',
    prefix: [50, [56, 59]],
    length: [[12, 19]]
  },
  {
    name: 'China UnionPay',
    prefix: [62],
    length: [[16, 19]]
  },
]

const checkNumber = (number: number, config: number | number[]): boolean => {
  if (Array.isArray(config)) {
    return number >= config[0] && number <= config[1];
  } else {
    return number === config;
  }
}

const detectCardType = (cardNumber: string): string | null => {
  const numberLength = cardNumber.length;
  
  const cardMatched = cardConfigs.find((config) => {
    const lengthMatchedItems: IMatchConfig[] = config.length.filter((itemCheck) => {
      return checkNumber(numberLength, itemCheck);
    })

    const prefixMatchedItems: IMatchConfig[] = config.prefix.filter((itemCheck) => {
      let endChar = 0;
      if (Array.isArray(itemCheck)) {
        endChar = `${itemCheck[0]}`.length;
      } else {
        endChar = `${itemCheck}`.length;
      }
      const numberPrefix = cardNumber.slice(0, endChar);
      return checkNumber(parseInt(numberPrefix), itemCheck);
    })

    return prefixMatchedItems.length > 0 && lengthMatchedItems.length > 0;
  })

  return cardMatched ? cardMatched.name : null;
}

export const useApp = (): void => {
  const cards: string[] = [
    '341234567890123',
    '371234567890123',
    '38123456789012',
    '4123456789012',
    '4123456789012345',
    '4123456789012345678',
    '5112345678901234',
    '5212345678901234',
    '5312345678901234',
    '5412345678901234',
    '5512345678901234',
    '6011123456789012345',
    '6221261234567890',
    '6441234567890123',
    '6512345678901234',
    '5034567890123456',
    '582126123456',
    '6220123456789012',
    '4903123456789012',
    '633312345678901234',
    '6759123456789012345',
  ];

  const checkResults = cards.map((cardNumber) => detectCardType(cardNumber));

  console.log('checkResults', checkResults);
}