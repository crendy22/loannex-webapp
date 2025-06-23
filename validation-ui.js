// Validation UI Components for LoanNex
// Handles displaying validation results with interactive fixes

class ValidationUI {
    constructor(validator) {
        this.validator = validator;
        this.currentValidationResults = null;
        this.originalLoans = null;
    }

    displayValidationResults(loans, validationResults) {
        this.currentValidationResults = validationResults;
        this.originalLoans = loans;
        
        // Hide file status, show validation section
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
        section.className = 'gradient-border-subtle rounded-xl shadow-lg p-8 mb-6 fade-in';
        return section;
    }

    generateValidationHTML(results) {
        const { summary } = results;
        
        return `
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-2">🔍 Validation Results</h2>
                <p class="text-gray-600">Review your loan data for any issues</p>
            </div>

            <!-- Validation Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-blue-800 mb-1">${summary.total}</div>
                    <div class="text-blue-600 text-sm font-medium">Total Loans</div>
                </div>
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-green-800 mb-1">${summary.valid}</div>
                    <div class="text-green-600 text-sm font-medium">✅ Valid</div>
                </div>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-yellow-800 mb-1">${summary.warnings}</div>
                    <div class="text-yellow-600 text-sm font-medium">⚠️ Warnings</div>
                </div>
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-red-800 mb-1">${summary.errors}</div>
                    <div class="text-red-600 text-sm font-medium">❌ Errors</div>
                </div>
            </div>

            ${this.generateActionButtons(results)}
            ${this.generateValidationTable(results)}
        `;
    }

    generateActionButtons(results) {
        const hasAutoFixes = results.autoFixable > 0;
        const canProceed = results.summary.canProceed;
        
        let buttons = '';
        
        if (hasAutoFixes) {
            buttons += `
                <button id="auto-fix-btn" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mr-4">
                    🔧 Auto-Fix ${results.autoFixable} Issues
                </button>
            `;
        }
        
        if (!canProceed) {
            buttons += `
                <button id="download-corrected-btn" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium mr-4">
                    📥 Download Validation Report
                </button>
            `;
        }
        
        if (canProceed) {
            buttons += `
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div class="flex items-center justify-center">
                        <span class="text-green-800 font-medium mr-4">✅ Ready to proceed!</span>
                        <span class="text-green-600 text-sm">All loans passed validation${results.summary.warnings > 0 ? ' (with warnings)' : ''}</span>
                    </div>
                </div>
            `;
        } else {
            buttons = `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div class="text-center">
                        <div class="text-red-800 font-medium mb-2">❌ Validation errors must be fixed before proceeding</div>
                        <div class="flex justify-center space-x-4">
                            ${buttons}
                        </div>
                    </div>
                </div>
            `;
        }
        
        return buttons;
    }

    generateValidationTable(results) {
        const problemLoans = results.loans.filter(loan => loan.issues.length > 0);
        
        if (problemLoans.length === 0) {
            return `
                <div class="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <div class="text-green-800 text-xl font-medium mb-2">🎉 All loans are valid!</div>
                    <div class="text-green-600">No issues found in your data</div>
                </div>
            `;
        }
        
        return `
            <div class="bg-white rounded-lg border overflow-hidden">
                <div class="bg-gray-50 px-6 py-3 border-b">
                    <h3 class="text-lg font-semibold text-gray-800">Loans Requiring Attention (${problemLoans.length})</h3>
                </div>
                <div class="max-h-96 overflow-y-auto">
                    ${problemLoans.map(loan => this.generateLoanRow(loan)).join('')}
                </div>
            </div>
        `;
    }

    generateLoanRow(loan) {
        const statusIcon = loan.status === 'error' ? '❌' : loan.status === 'warning' ? '⚠️' : '✅';
        const statusColor = loan.status === 'error' ? 'text-red-700' : loan.status === 'warning' ? 'text-yellow-700' : 'text-green-700';
        const bgColor = loan.status === 'error' ? 'bg-red-50' : loan.status === 'warning' ? 'bg-yellow-50' : 'bg-green-50';
        
        return `
            <div class="border-b border-gray-200">
                <div class="p-4 cursor-pointer hover:bg-gray-50" onclick="toggleLoanDetails(${loan.loanIndex})">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <span class="text-xl">${statusIcon}</span>
                            <div>
                                <div class="font-medium text-gray-900">Loan ${loan.loanIndex + 1}: ${loan.borrowerName}</div>
                                <div class="${statusColor} text-sm">${loan.issues.length} issue${loan.issues.length !== 1 ? 's' : ''}</div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2">
                            ${loan.autoFixable ? '<span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Auto-fixable</span>' : ''}
                            <svg class="w-5 h-5 text-gray-400 transform transition-transform" id="icon-${loan.loanIndex}">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div id="details-${loan.loanIndex}" class="hidden ${bgColor} px-4 pb-4">
                    ${this.generateIssueDetails(loan.issues, loan.loanIndex)}
                </div>
            </div>
        `;
    }

    generateIssueDetails(issues, loanIndex) {
        return `
            <div class="space-y-3 pt-3">
                ${issues.map((issue, issueIndex) => `
                    <div class="flex items-start justify-between p-3 bg-white rounded border">
                        <div class="flex-1">
                            <div class="font-medium text-gray-900">${issue.field}</div>
                            <div class="text-sm text-gray-600 mt-1">
                                Current: "<span class="font-mono">${issue.value}</span>"
                            </div>
                            <div class="text-sm ${issue.type === 'error' ? 'text-red-600' : 'text-yellow-600'} mt-1">
                                ${issue.issue}
                            </div>
                            ${issue.suggestion ? `
                                <div class="text-sm text-green-600 mt-1">
                                    Suggested: "<span class="font-mono">${issue.suggestion}</span>"
                                </div>
                            ` : ''}
                        </div>
                        ${issue.autoFixable ? `
                            <button class="fix-issue-btn bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 ml-4" 
                                    data-loan-index="${loanIndex}" 
                                    data-field="${issue.field}" 
                                    data-suggestion="${issue.suggestion}">
                                Fix
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    attachEventListeners() {
        // Auto-fix button
        const autoFixBtn = document.getElementById('auto-fix-btn');
        if (autoFixBtn) {
            autoFixBtn.addEventListener('click', () => this.applyAllAutoFixes());
        }

        // Download report button
        const downloadBtn = document.getElementById('download-corrected-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadValidationReport());
        }

        // Individual fix buttons
        document.querySelectorAll('.fix-issue-btn').forEach(btn => {
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
        this.showSuccessMessage('Auto-fixes applied successfully!');
    }

    applySingleFix(loanIndex, field, suggestion) {
        console.log(`🔧 Fixing loan ${loanIndex + 1}, field: ${field}`);
        
        // Apply the fix
        this.originalLoans[loanIndex][field] = suggestion;
        
        // Re-validate
        const newValidationResults = this.validator.validateLoans(this.originalLoans);
        
        // Update the loans in the main application
        window.loans = this.originalLoans;
        
        // Refresh validation display
        this.displayValidationResults(this.originalLoans, newValidationResults);
        
        // Show success message
        this.showSuccessMessage(`Fixed ${field} for loan ${loanIndex + 1}`);
    }

    downloadValidationReport() {
        console.log('📥 Downloading validation report...');
        
        const report = this.validator.generateValidationReport(this.currentValidationResults);
        
        // Create Excel workbook with validation report
        const wb = XLSX.utils.book_new();
        
        // Summary sheet
        const summaryData = [{
            'Total Loans': report.summary.total,
            'Valid Loans': report.summary.valid,
            'Warnings': report.summary.warnings,
            'Errors': report.summary.errors,
            'Can Proceed': report.summary.canProceed ? 'Yes' : 'No',
            'Report Generated': report.timestamp
        }];
        const summaryWs = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
        
        // Issues sheet
        if (report.details.length > 0) {
            const issuesData = [];
            report.details.forEach(detail => {
                detail.issues.forEach(issue => {
                    issuesData.push({
                        'Borrower': detail.borrower,
                        'Status': detail.status,
                        'Field': issue.field,
                        'Current Value': issue.value,
                        'Problem': issue.problem,
                        'Suggestion': issue.suggestion || 'Manual review needed'
                    });
                });
            });
            const issuesWs = XLSX.utils.json_to_sheet(issuesData);
            XLSX.utils.book_append_sheet(wb, issuesWs, 'Issues');
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
            // Hide workflow buttons or disable them
            processBtn.classList.add('hidden');
            priceReviewBtn.classList.add('hidden');
            processBtnDesc.classList.add('hidden');
            priceReviewDesc.classList.add('hidden');
        }
    }

    showSuccessMessage(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in';
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
    const details = document.getElementById(`details-${loanIndex}`);
    const icon = document.getElementById(`icon-${loanIndex}`);
    
    if (details.classList.contains('hidden')) {
        details.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        details.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}
