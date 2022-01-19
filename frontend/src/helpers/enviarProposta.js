import { apiCreate } from './helpers';

export async function enviarProposta(fields) {
    let P = parseFloat(fields.pagamento.valor_proposta)
    let n = parseInt(fields.pagamento.n_parcelas)
    let e = parseFloat(fields.pagamento.entrada)

    fields.pagamento.valor_parcela = calcParcela(P, n, e)
    fields.pagamento.valor_final = e + (n * fields.pagamento.valor_parcela)

    console.log(JSON.stringify(fields));

    // submit form data
    apiCreate('propostas', fields).then(response => {
        if (response) {

            alert(response.message);
            
			// sessionStorage.clear();
			// window.location.href = '/';
        }
    })

}

export function calcParcela(P, n, e) {
    const r = 0.9 / 100; // taxa de juros a.m.
    const PV = - P + e

    if (n > 1) {
        // P = (PV * r) / ( 1 - (1+r)**(-n))
        P = PMT(r, n, PV, 0, 0)
    }
    else if (e > 0) {
        P = - PV
    }

    P = Math.round(P * 100) / 100
    return P
}

/**
 * Copy of Excel's PMT function.
 * Credit: http://stackoverflow.com/questions/2094967/excel-pmt-function-in-js
 *
 * @param rate_per_period       The interest rate for the loan.
 * @param number_of_payments    The total number of payments for the loan in months.
 * @param present_value         The present value, or the total amount that a series of future payments is worth now;
 *                              Also known as the principal.
 * @param future_value          The future value, or a cash balance you want to attain after the last payment is made.
 *                              If fv is omitted, it is assumed to be 0 (zero), that is, the future value of a loan is 0.
 * @param type                  Optional, defaults to 0. The number 0 (zero) or 1 and indicates when payments are due.
 *                              0 = At the end of period
 *                              1 = At the beginning of the period
 * @returns {number}
 */
export function PMT(rate_per_period, number_of_payments, present_value, future_value, type) {
    future_value = typeof future_value !== 'undefined' ? future_value : 0;
    type = typeof type !== 'undefined' ? type : 0;

    if (rate_per_period != 0.0) {
        // Interest rate exists
        var q = Math.pow(1 + rate_per_period, number_of_payments);
        return -(rate_per_period * (future_value + (q * present_value))) / ((-1 + q) * (1 + rate_per_period * (type)));

    } else if (number_of_payments != 0.0) {
        // No interest rate, but number of payments exists
        return -(future_value + present_value) / number_of_payments;
    }

    return 0;
}