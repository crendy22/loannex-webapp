// Enhanced Validation UI Components for LoanNex
// Interactive data preview with field-level validation feedback

class ValidationUI {
    constructor(validator) {
        this.validator = validator;
        this.currentValidationResults = null;
        this.originalLoans = null;
    }

    displayValidationResults(loans, validationResults) {
        this.currentValidationResults = validationResults;
        this.originalLoans = loans;
        
        // Hide simple file status, show enhanced validation section
        document.getElementById('file-status').classList.add('hidden');
        this.showValidationSection(validationResults);
    }

    showValidationSection(results) {
        // Create or update validation section
        let validationSection = document.getElementById('validation-section');
        if (!validationSection) {
            validationSection = this.createValidationSection();
            document.getElementById('upload-section').insertAdjacentElement('afterend', validationSection);
        }

        validationSection.innerHTML = this.generateValidationHTML(results);
        validationSection.classList.remove('hidden');
        
        // Add event listeners
        this.attachEventListeners();
        
        // Show/hide workflow buttons based on validation
        this.updateWorkflowButtons(results.summary.canProceed);
    }

    createValidationSection() {
        const section = document.createElement('div');
        section.id = 'validation-section';
        section.className = 'gradient-border-subtle rounded-xl shadow-lg p-8 mb-6 validation-slide-in';
        return section;
    }

    generateValidationHTML(results) {
        const { summary } = results;
        
        return `
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">🔍 Data Validation Results</h2>
                <p class="text-gray-600">Review your loan data for validation issues</p>
            </div>

            <!-- Validation Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center validation-summary-card">
                    <div class="text-2xl font-bold text-blue-800 mb-1">${summary.total}</div>
                    <div class="text-blue-600 text-sm font-medium">Total Loans</div>
                </div>
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center validation-summary-card">
                    <div class="text-2xl font-bold text-green-800 mb-1">${summary.valid}</div>
                    <div class="text-green-600 text-sm font-medium">✅ Valid</div>
                </div>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center validation-summary-card">
                    <div class="text-2xl font-bold text-yellow-800 mb-1">${summary.warnings}</div>
                    <div class="text-yellow-600 text-sm font-medium">⚠️ Warnings</div>
                </div>
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center validation-summary-card">
                    <div class="text-2xl font-bold text-red-800 mb-1">${summary.errors}</div>
                    <div class="text-red-600 text-sm font-medium">❌ Errors</div>
                </div>
            </div>

            ${this.generateActionButtons(results)}
            ${this.generateDataPreviewTable(this.originalLoans, results)}
        `;
    }

    generateActionButtons(results) {
        const hasAutoFixes = results.autoFixable > 0;
        const canProceed = results.summary.canProceed;
        
        let buttons = '';
        
        if (hasAutoFixes) {
            buttons += `
                <button id="auto-fix-all-btn" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mr-4">
                    🔧 Auto-Fix All (${results.autoFixable} issues)
                </button>
            `;
        }
        
        if (!canProceed) {
            buttons += `
                <button id="download-validation-report-btn" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium mr-4">
                    📥 Download Validation Report
                </button>
            `;
        }
        
        if (canProceed) {
            buttons = `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div class="flex items-center justify-center">
                        <span class="text-green-800 font-medium mr-4">✅ Ready to proceed!</span>
                        <span class="text-green-600 text-sm">All loans passed validation${results.summary.warnings > 0 ? ' (with warnings)' : ''}</span>
                    </div>
                </div>
            ` + buttons;
        } else {
            buttons = `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div class="text-center">
                        <div class="text-red-800 font-medium mb-2">❌ Validation errors must be fixed before proceeding</div>
                        <div class="flex justify-center space-x-4 flex-wrap">
                            ${buttons}
                        </div>
                    </div>
                </div>
            `;
        }
        
        return buttons;
    }

    generateDataPreviewTable(loans, results) {
        return `
            <div class="bg-white rounded-lg border overflow-hidden mb-6">
                <div class="bg-gray-50 px-6 py-3 border-b">
                    <h3 class="text-lg font-semibold text-gray-800">📊 Loan Data Preview (click rows to expand)</h3>
                    <p class="text-sm text-gray-600 mt-1">Review each loan's validation status and fix issues</p>
                </div>
                <div class="data-preview-table max-h-96 overflow-y-auto">
                    ${this.generateDataPreviewRows(loans, results)}
                </div>
            </div>
        `;
    }

    generateDataPreviewRows(loans, results) {
        return loans.map((loan, index) => {
            const loanResult = results.loans[index];
            const statusIcon = loanResult.status === 'error' ? '❌' : loanResult.status === 'warning' ? '⚠️' : '✅';
            const statusColor = loanResult.status === 'error' ? 'text-red-700' : loanResult.status === 'warning' ? 'text-yellow-700' : 'text-green-700';
            const bgColor = loanResult.status === 'error' ? 'validation-row-error' : loanResult.status === 'warning' ? 'validation-row-warning' : 'validation-row-valid';
            
            const borrowerName = loanResult.borrowerName;
            const state = loan['State'] || 'N/A';
            const loanType = loan['Loan Type'] || 'N/A';
            const interestRate = loan['Interest Rate'] || 'N/A';
            const creditScore = loan['Credit Score'] || 'N/A';
            
            // Determine field validation statuses
            const stateStatus = this.getFieldValidationStatus('State', state, loanResult);
            const typeStatus = this.getFieldValidationStatus('Loan Type', loanType, loanResult);
            const rateStatus = this.getFieldValidationStatus('Interest Rate', interestRate, loanResult);
            const scoreStatus = this.getFieldValidationStatus('Credit Score', creditScore, loanResult);

            return `
                <div class="border-b border-gray-200 ${bgColor}">
                    <div class="p-4 cursor-pointer hover:bg-gray-50 expandable-row" onclick="toggleLoanDetails(${index})">
                        <div class="grid grid-cols-7 gap-4 items-center">
                            <div class="text-center">
                                <span class="font-medium text-gray-900">#${index + 1}</span>
                            </div>
                            <div class="text-left">
                                <div class="font-medium text-gray-900 truncate">${borrowerName}</div>
                            </div>
                            <div class="text-center ${stateStatus.class}">
                                ${stateStatus.icon} ${state}
                            </div>
                            <div class="text-center ${typeStatus.class}">
                                ${typeStatus.icon} ${loanType}
                            </div>
                            <div class="text-center ${rateStatus.class}">
                                ${rateStatus.icon} ${interestRate}${typeof interestRate === 'number' ? '%' : ''}
                            </div>
                            <div class="text-center ${scoreStatus.class}">
                                ${scoreStatus.icon} ${creditScore}
                            </div>
                            <div class="text-center">
                                <span class="${statusColor}">${statusIcon} ${loanResult.issues.length} issue${loanResult.issues.length !== 1 ? 's' : ''}</span>
                                <svg class="w-4 h-4 text-gray-400 transform transition-transform inline ml-2" id="expand-icon-${index}">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div id="loan-details-${index}" class="hidden bg-gray-50 border-t border-gray-200">
                        ${this.generateLoanDetailsView(loan, loanResult, index)}
                    </div>
                </div>
            `;
        }).join('');
    }

    getFieldValidationStatus(fieldName, value, loanResult) {
        const issue = loanResult.issues.find(i => i.field === fieldName);
        
        if (!issue) {
            return { icon: '✅', class: 'text-green-700' };
        } else if (issue.type === 'error') {
            return { icon: '❌', class: 'text-red-700' };
        } else {
            return { icon: '⚠️', class: 'text-yellow-700' };
        }
    }

    generateLoanDetailsView(loan, loanResult, loanIndex) {
        const keyFields = ['First Name', 'Last Name', 'State', 'Loan Type', 'Interest Rate', 'Credit Score', 'DTI', 'Property Type', 'Investor'];
        
        return `
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h4 class="text-lg font-semibold text-gray-900">🔍 Detailed Field Validation</h4>
                    ${loanResult.autoFixable ? `
                        <button class="fix-loan-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm" 
                                data-loan-index="${loanIndex}">
                            🔧 Fix This Loan
                        </button>
                    ` : ''}
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    ${keyFields.map(field => {
                        const value = loan[field] || '';
                        const issue = loanResult.issues.find(i => i.field === field);
                        
                        return `
                            <div class="border rounded-lg p-3 ${issue ? (issue.type === 'error' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50') : 'border-green-200 bg-green-50'}">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <div class="font-medium text-gray-900 text-sm">${field}</div>
                                        <div class="text-gray-700 mt-1 font-mono text-sm">"${value}"</div>
                                        ${issue ? `
                                            <div class="text-xs ${issue.type === 'error' ? 'text-red-600' : 'text-yellow-600'} mt-1">
                                                ${issue.issue}
                                            </div>
                                            ${issue.suggestion ? `
                                                <div class="text-xs text-green-600 mt-1">
                                                    Suggested: "<span class="font-mono">${issue.suggestion}</span>"
                                                </div>
                                            ` : ''}
                                        ` : `
                                            <div class="text-xs text-green-600 mt-1">✅ Valid</div>
                                        `}
                                    </div>
                                    ${issue && issue.autoFixable ? `
                                        <button class="fix-field-btn bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 ml-2"
                                                data-loan-index="${loanIndex}" 
                                                data-field="${field}" 
                                                data-suggestion="${issue.suggestion}">
                                            Fix
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                ${loanResult.issues.length > 0 ? `
                    <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <div class="text-sm text-blue-800">
                            <strong>Summary:</strong> ${loanResult.issues.length} validation issue${loanResult.issues.length !== 1 ? 's' : ''} found
                            ${loanResult.autoFixable ? ' (some can be auto-fixed)' : ''}
                        </div>
                    </div>
                ` : `
                    <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                        <div class="text-sm text-green-800">
                            <strong>✅ All fields valid!</strong> This loan is ready for processing.
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    attachEventListeners() {
        // Auto-fix all button
        const autoFixAllBtn = document.getElementById('auto-fix-all-btn');
        if (autoFixAllBtn) {
            autoFixAllBtn.addEventListener('click', () => this.applyAllAutoFixes());
        }

        // Download validation report button
        const downloadReportBtn = document.getElementById('download-validation-report-btn');
        if (downloadReportBtn) {
            downloadReportBtn.addEventListener('click', () => this.downloadValidationReport());
        }

        // Individual loan fix buttons
        document.querySelectorAll('.fix-loan-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const loanIndex = parseInt(e.target.dataset.loanIndex);
                this.applyLoanFixes(loanIndex);
            });
        });

        // Individual field fix buttons
        document.querySelectorAll('.fix-field-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const loanIndex = parseInt(e.target.dataset.loanIndex);
                const field = e.target.dataset.field;
                const suggestion = e.target.dataset.suggestion;
                this.applySingleFix(loanIndex, field, suggestion);
            });
        });
    }

    applyAllAutoFixes() {
        console.log('🔧 Applying all auto-fixes...');
        
        const correctedLoans = this.validator.applyAutoCorrections(this.originalLoans, this.currentValidationResults);
        const newValidationResults = this.validator.validateLoans(correctedLoans);
        
        // Update the loans in the main application
        window.loans = correctedLoans;
        
        // Refresh validation display
        this.displayValidationResults(correctedLoans, newValidationResults);
        
        // Show success message
        this.showSuccessMessage('All auto-fixes applied successfully!');
    }

    applyLoanFixes(loanIndex) {
        console.log(`🔧 Fixing all issues for loan ${loanIndex + 1}`);
        
        const loanResult = this.currentValidationResults.loans[loanIndex];
        
        // Apply all auto-fixable issues for this loan
        loanResult.issues.forEach(issue => {
            if (issue.autoFixable && issue.suggestion) {
                this.originalLoans[loanIndex][issue.field] = issue.suggestion;
            }
        });
        
        // Re-validate and refresh
        const newValidationResults = this.validator.validateLoans(this.originalLoans);
        window.loans = this.originalLoans;
        this.displayValidationResults(this.originalLoans, newValidationResults);
        
        this.showSuccessMessage(`Fixed all auto-correctable issues for loan ${loanIndex + 1}`);
    }

    applySingleFix(loanIndex, field, suggestion) {
        console.log(`🔧 Fixing ${field} for loan ${loanIndex + 1}`);
        
        // Apply the fix
        this.originalLoans[loanIndex][field] = suggestion;
        
        // Re-validate and refresh
        const newValidationResults = this.validator.validateLoans(this.originalLoans);
        window.loans = this.originalLoans;
        this.displayValidationResults(this.originalLoans, newValidationResults);
        
        this.showSuccessMessage(`Fixed ${field} for loan ${loanIndex + 1}`);
    }

    downloadValidationReport() {
        console.log('📥 Downloading detailed validation report...');
        
        const report = this.validator.generateValidationReport(this.currentValidationResults);
        
        // Create comprehensive Excel workbook
        const wb = XLSX.utils.book_new();
        
        // Summary sheet
        const summaryData = [{
            'Total Loans': report.summary.total,
            'Valid Loans': report.summary.valid,
            'Warnings': report.summary.warnings,
            'Errors': report.summary.errors,
            'Auto-Fixable Issues': this.currentValidationResults.autoFixable,
            'Can Proceed': report.summary.canProceed ? 'Yes' : 'No',
            'Report Generated': report.timestamp
        }];
        const summaryWs = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
        
        // Detailed issues sheet
        if (report.details.length > 0) {
            const issuesData = [];
            report.details.forEach(detail => {
                detail.issues.forEach(issue => {
                    issuesData.push({
                        'Loan #': detail.borrower.replace(/[^\d]/g, '') || 'Unknown',
                        'Borrower': detail.borrower,
                        'Status': detail.status,
                        'Field': issue.field,
                        'Current Value': issue.value,
                        'Problem': issue.problem,
                        'Suggestion': issue.suggestion || 'Manual review needed',
                        'Auto-Fixable': issue.suggestion ? 'Yes' : 'No'
                    });
                });
            });
            const issuesWs = XLSX.utils.json_to_sheet(issuesData);
            XLSX.utils.book_append_sheet(wb, issuesWs, 'Validation Issues');
        }
        
        // Download the file
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `loannex_validation_report_${timestamp}.xlsx`;
        XLSX.writeFile(wb, filename);
        
        console.log('✅ Validation report downloaded:', filename);
    }

    updateWorkflowButtons(canProceed) {
        const processBtn = document.getElementById('process-btn');
        const priceReviewBtn = document.getElementById('price-review-btn');
        const processBtnDesc = document.getElementById('process-btn-desc');
        const priceReviewDesc = document.getElementById('price-review-desc');
        
        if (canProceed) {
            // Show workflow buttons
            processBtn.classList.remove('hidden');
            priceReviewBtn.classList.remove('hidden');
            processBtnDesc.classList.remove('hidden');
            priceReviewDesc.classList.remove('hidden');
            
            // Enable buttons
            processBtn.disabled = false;
            priceReviewBtn.disabled = false;
            processBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            priceReviewBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            // Hide workflow buttons until validation passes
            processBtn.classList.add('hidden');
            priceReviewBtn.classList.add('hidden');
            processBtnDesc.classList.add('hidden');
            priceReviewDesc.classList.add('hidden');
        }
    }

    showSuccessMessage(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 success-message';
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
}

// Global function for toggling loan details (called from onclick)
function toggleLoanDetails(loanIndex) {
    const details = document.getElementById(`loan-details-${loanIndex}`);
    const icon = document.getElementById(`expand-icon-${loanIndex}`);
    
    if (details.classList.contains('hidden')) {
        details.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        details.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}
