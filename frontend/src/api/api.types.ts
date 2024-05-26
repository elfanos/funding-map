export type RaisedAmount = Record<string, number>;

export type BiggestFundingsForACompany = {
  raised_amount_usd: number;
  company_name: string;
};

export type Funding = {
  funding_round_uuid: string;
  company_uuid: string;
  company_name: string;
  investment_type: string;
  announced_on: string;
  raised_amount_usd: number;
  investor_names: string;
};

export type Organization = {
  uuid: string;
  company_name: string;
  homepage_url: string;
  country_code: string;
  city: string;
  short_description: string;
  description: string;
  funding_rounds: string;
  funding_total_usd: string;
  employee_count: string;
};

export type RaisedAmountByCountry = {
  message: string;
  results: {
    data: Funding[];
    oraganization: Organization[];
    raisedAmount: RaisedAmount;
  };
};
export type RaisedAmountResponse = {
  message: string;
  results: {
    raisedAmount: RaisedAmount;
    biggestFundingsForACompany: BiggestFundingsForACompany[];
  };
};

export type AnnouncedOnResponse = {
  message: string;
  results: string[];
};
export type ErrorMessage = {
  message: string;
  exception: unknown;
};

export type ApiVariablesType<
  T extends (...args: any[]) => void,
  Extra = Record<string, unknown>,
> = {
  result: T;
  error?: (args: ErrorMessage) => void;
} & Extra;
