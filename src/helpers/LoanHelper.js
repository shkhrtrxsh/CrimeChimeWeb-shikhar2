
export const emiCalculator = (loanAmount, numberOfMonths, rateOfInterest) => {
    var monthlyInterestRatio = (rateOfInterest/100)/12;
    var top = Math.pow((1+monthlyInterestRatio),numberOfMonths);
    var bottom = top -1;
    var sp = top / bottom;
    var emi = ((loanAmount * monthlyInterestRatio) * sp);
    var full = numberOfMonths * emi;
    var interest = full - loanAmount;
    var int_pge =  (interest / full) * 100;

    return {
        loanAmount : Math.round(loanAmount), 
        emi : Math.round(emi), 
        interest: Math.round(interest), 
        full: Math.round(full)
    }
}