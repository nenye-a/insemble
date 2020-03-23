import pandas as pd


def lending_gross_profit(fee_rate, default_rate, default_term, total_num_terms):
    default_ratio = float(default_term) / total_num_terms
    profit_rate = fee_rate - abs(default_rate * (1 + fee_rate) * (default_ratio - 1))
    return round(profit_rate, 2)


def drange(x, y, jump):
    while x < y:
        yield round(float(x), 2)
        x += jump


if __name__ == "__main__":

    target_fee_rates = list(drange(0.05, 1, 0.01))
    potential_default_rates = list(drange(0.1, 0.6, 0.05))
    total_terms = 10
    potential_terms = range(0, total_terms)

    for default_rate in potential_default_rates:

        table = []

        for fee_rate in target_fee_rates:
            row = []
            for term in potential_terms:
                profit_rate = lending_gross_profit(fee_rate, default_rate, term, total_terms)
                row.append(profit_rate)
            table.append(row)

        table_df = pd.DataFrame(table, columns=potential_terms, index=target_fee_rates)
        table_df.index.name = 'Fee Rate'
        table_df.columns.name = 'Term of Default (out of {})'.format(total_terms)
        table_df.to_csv('default_rate_' + str(default_rate) + '.csv')
