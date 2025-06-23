// LoanNex Validation System
// Clean, modular validation for loan data with auto-corrections and smart suggestions

class LoanValidator {
    constructor() {
        this.validationRules = {
            'Loan Type': ['First Lien', 'Second Lien'],
            'Citizenship': ['US Citizen', 'Permanent Resident', 'Foreign National'],
            'Income Documentation': ['Full Doc', 'Bank Statement', 'Asset Depletion', 'DSCR', 'No Doc'],
            'Loan Purpose': ['Purchase', 'Refinance', 'Cash Out Refinance'],
            'Occupancy': ['Primary', 'Secondary', 'Investment'],
            'Prepay Penalty': ['No Penalty', '1 Year', '2 Year', '3 Year', '5 Year'],
            'Property Type': ['SFR', 'Condo', 'Townhome', '2-4 Unit', 'Manufactured'],
            'Secondary Financing': ['None', 'HELOC', 'Second Mortgage'],
            'State': ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'],
            'Mtg Lates': ['0x30x24', '1x30x24', '2x30x24', '0x30x12', '1x30x12'],
            'BK': ['None', 'Ch7 >4 Years', 'Ch7 >2 Years', 'Ch13 >2 Years'],
            'FC': ['None', '>4 Years', '>2 Years'],
            'SS': ['None', '>4 Years', '>2 Years'],
            'DIL': ['None', '>4 Years', '>2 Years'],
            'Escrows': ['Yes', 'No'],
            'Temp Buydown': ['None', '2-1 Buydown', '1-0 Buydown'],
            'Amortizing Type': ['Fully Am', 'Interest Only', '15 Year Am', '25 Year Am', '40 Year Am']
        };

        this.autoCorrections = {
            'Loan Type': {
                'first lien': 'First Lien',
                'first lean': 'First Lien',
                '1st lien': 'First Lien',
                'second lien': 'Second Lien',
                '2nd lien': 'Second Lien'
            },
            'Citizenship': {
                'us citizen': 'US Citizen',
                'citizen': 'US Citizen',
                'permanent resident': 'Permanent Resident',
                'foreign national': 'Foreign National'
            },
            'Income Documentation': {
                'full doc': 'Full Doc',
                'bank statement': 'Bank Statement',
                'bank statements': 'Bank Statement',
                'asset depletion': 'Asset Depletion',
                'dscr': 'DSCR',
                'no doc': 'No Doc'
            },
            'Loan Purpose': {
                'purchase': 'Purchase',
                'refinance': 'Refinance',
                'refi': 'Refinance',
                'cash out refinance': 'Cash Out Refinance',
                'cash out refi': 'Cash Out Refinance',
                'cash-out': 'Cash Out Refinance'
            },
            'Occupancy': {
                'primary': 'Primary',
                'owner occupied': 'Primary',
                'secondary': 'Secondary',
                'second home': 'Secondary',
                'investment': 'Investment',
                'rental': 'Investment'
            },
            'Prepay Penalty': {
                'no penalty': 'No Penalty',
                'none': 'No Penalty',
                '1 year': '1 Year',
                '2 year': '2 Year',
                '3 year': '3 Year',
                '5 year': '5 Year'
            },
            'Property Type': {
                'sfr': 'SFR',
                'single family': 'SFR',
                'single family residence': 'SFR',
                'condo': 'Condo',
                'condominium': 'Condo',
                'townhome': 'Townhome',
                'townhouse': 'Townhome',
                '2-4 unit': '2-4 Unit',
                'duplex': '2-4 Unit',
                'manufactured': 'Manufactured',
                'mobile home': 'Manufactured'
            },
            'Secondary Financing': {
                'none': 'None',
                'no': 'None',
                'heloc': 'HELOC',
                'second mortgage': 'Second Mortgage',
                '2nd mortgage': 'Second Mortgage'
            },
            'State': {
                'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
                'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
                'florida': 'FL', 'fla': 'FL', 'georgia': 'GA', 'hawaii': 'HI',
                'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
                'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME',
                'maryland': 'MD', 'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN',
                'mississippi': 'MS', 'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE',
                'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM',
                'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
                'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI',
                'south carolina': 'SC', 'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX',
                'utah': 'UT', 'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA',
                'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
            },
            'Escrows': {
                'yes': 'Yes',
                'no': 'No',
                'y': 'Yes',
                'n': 'No'
            },
            'Temp Buydown': {
                'none': 'None',
                'no': 'None',
                '2-1 buydown': '2-1 Buydown',
                '1-0 buydown': '1-0 Buydown'
            },
            'Amortizing Type': {
                'fully am': 'Fully Am',
                'fully amortizing': 'Fully Am',
                'interest only': 'Interest Only',
                'io': 'Interest Only',
                '15 year am': '15 Year Am',
                '25 year am': '25 Year Am',
                '40 year am': '40 Year Am'
            }
        };

        this.requiredFields = [
            'First Name', 'Last Name', 'Interest Rate', 'Investor', 
            'Credit Score', 'DTI', 'Loan Amount'
        ];

        this.numericFields = {
            'Credit Score': { min: 300, max: 850 },
            'DTI': { min: 0, max: 100 },
            'LTV': { min: 0, max: 100 },
            'Interest Rate': { min: 0, max: 20 },
            'Loan Amount': { min: 1000, max: 50000000 },
            'Appraised Value': { min: 1000, max: 50000000 },
            'Purchase Price': { min: 1000, max: 50000000 }
        };
    }

    validateLoans(loans) {
        const results = {
            summary: {
                total: loans.length,
                valid: 0,
                warnings: 0,
                errors: 0,
                canProceed: false
            },
            loans: [],
            autoFixable: 0
        };

        loans.forEach((loan, index) => {
            const loanResult = this.validateLoan(loan, index);
            results.loans.push(loanResult);

            if (loanResult.status === 'valid') {
                results.summary.valid++;
            } else if (loanResult.status === 'warning') {
                results.summary.warnings++;
            } else {
                results.summary.errors++;
            }

            if (loanResult.autoFixable) {
                results.autoFixable++;
            }
        });

        // Can proceed if no errors (warnings are OK)
        results.summary.canProceed = results.summary.errors === 0;

        return results;
    }

    validateLoan(loan, index) {
        const result = {
            loanIndex: index,
            borrowerName: `${loan['First Name'] || ''} ${loan['Last Name'] || ''}`.trim() || 'Unknown',
            status: 'valid', // 'valid', 'warning', 'error'
            issues: [],
            autoFixable: false
        };

        // Check required fields
        this.requiredFields.forEach(field => {
            if (!loan[field] || loan[field].toString().trim() === '') {
                result.issues.push({
                    field: field,
                    value: loan[field] || '',
                    issue: 'Required field is missing',
                    type: 'error',
                    suggestion: null,
                    autoFixable: false
                });
            }
        });

        // Check validation rules for dropdown fields
        Object.keys(this.validationRules).forEach(field => {
            const value = loan[field];
            if (value && value.toString().trim() !== '') {
                const trimmedValue = value.toString().trim();
                const validValues = this.validationRules[field];
                
                if (!validValues.includes(trimmedValue)) {
                    // Check for auto-correction
                    const correction = this.findAutoCorrection(field, trimmedValue);
                    
                    if (correction) {
                        result.issues.push({
                            field: field,
                            value: trimmedValue,
                            issue: 'Invalid value (auto-fixable)',
                            type: 'warning',
                            suggestion: correction,
                            autoFixable: true
                        });
                        result.autoFixable = true;
                    } else {
                        result.issues.push({
                            field: field,
                            value: trimmedValue,
                            issue: 'Invalid value',
                            type: 'error',
                            suggestion: this.suggestClosestMatch(field, trimmedValue),
                            autoFixable: false
                        });
                    }
                }
            }
        });

        // Check numeric fields
        Object.keys(this.numericFields).forEach(field => {
            const value = loan[field];
            if (value && value.toString().trim() !== '') {
                const numValue = parseFloat(value);
                const rules = this.numericFields[field];
                
                if (isNaN(numValue)) {
                    result.issues.push({
                        field: field,
                        value: value,
                        issue: 'Must be a number',
                        type: 'error',
                        suggestion: null,
                        autoFixable: false
                    });
                } else if (numValue < rules.min || numValue > rules.max) {
                    const issueType = (field === 'Credit Score' && numValue > 800) ? 'warning' : 'error';
                    result.issues.push({
                        field: field,
                        value: value,
                        issue: `Should be between ${rules.min} and ${rules.max}`,
                        type: issueType,
                        suggestion: null,
                        autoFixable: false
                    });
                }
            }
        });

        // Determine overall status
        const hasErrors = result.issues.some(issue => issue.type === 'error');
        const hasWarnings = result.issues.some(issue => issue.type === 'warning');
        
        if (hasErrors) {
            result.status = 'error';
        } else if (hasWarnings) {
            result.status = 'warning';
        } else {
            result.status = 'valid';
        }

        return result;
    }

    findAutoCorrection(field, value) {
        if (!this.autoCorrections[field]) return null;
        
        const corrections = this.autoCorrections[field];
        const lowerValue = value.toLowerCase();
        
        return corrections[lowerValue] || null;
    }

    suggestClosestMatch(field, value) {
        if (!this.validationRules[field]) return null;
        
        const validValues = this.validationRules[field];
        const lowerValue = value.toLowerCase();
        
        // Simple similarity check - find closest match
        let bestMatch = null;
        let bestScore = 0;
        
        validValues.forEach(validValue => {
            const score = this.calculateSimilarity(lowerValue, validValue.toLowerCase());
            if (score > bestScore && score > 0.5) {
                bestScore = score;
                bestMatch = validValue;
            }
        });
        
        return bestMatch;
    }

    calculateSimilarity(str1, str2) {
        // Simple Levenshtein distance-based similarity
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    applyAutoCorrections(loans, validationResults) {
        const correctedLoans = JSON.parse(JSON.stringify(loans)); // Deep copy
        
        validationResults.loans.forEach((loanResult, loanIndex) => {
            loanResult.issues.forEach(issue => {
                if (issue.autoFixable && issue.suggestion) {
                    correctedLoans[loanIndex][issue.field] = issue.suggestion;
                }
            });
        });
        
        return correctedLoans;
    }

    generateValidationReport(validationResults) {
        const report = {
            timestamp: new Date().toLocaleString(),
            summary: validationResults.summary,
            details: []
        };
        
        validationResults.loans.forEach(loan => {
            if (loan.issues.length > 0) {
                report.details.push({
                    borrower: loan.borrowerName,
                    status: loan.status,
                    issues: loan.issues.map(issue => ({
                        field: issue.field,
                        value: issue.value,
                        problem: issue.issue,
                        suggestion: issue.suggestion
                    }))
                });
            }
        });
        
        return report;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoanValidator;
}
