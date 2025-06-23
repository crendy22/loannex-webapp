// Enhanced validation integration for LoanNex
// Connects validation system with enhanced UI and existing workflows

document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced validation system
    const loanValidator = new LoanValidator();
    const validationUI = new ValidationUI(loanValidator);

    // Get DOM elements (now they exist)
    const fileUpload = document.getElementById('file-upload');
    const fileName = document.getElementById('file-name');
    const loanCount = document.getElementById('loan-count');
    const fileStatus = document.getElementById('file-status');
    const processBtn = document.getElementById('process-btn');
    const priceReviewBtn = document.getElementById('price-review-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Enhanced file upload handler with comprehensive validation
    fileUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!validateCredentials()) {
            event.target.value = '';
            return;
        }

        // Show loading state
        fileName.textContent = `🔄 Processing ${file.name}...`;
        loanCount.textContent = 'Validating loan data...';
        loanCount.className = 'text-blue-600 text-sm';
        fileStatus.classList.remove('hidden');

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                if (jsonData.length === 0) {
                    throw new Error('No data found in Excel file');
                }
                
                loans = jsonData;
                
                // Update file status to show processing
                fileName.textContent = `📊 ${file.name}`;
                loanCount.textContent = `Analyzing ${loans.length} loans...`;
                
                // Run comprehensive validation
                console.log('🔍 Running enhanced validation on uploaded loans...');
                const validationResults = loanValidator.validateLoans(loans);
                
                // Update file status based on validation results
                updateFileStatusFromValidation(validationResults);
                
                // Display enhanced validation results with interactive UI
                validationUI.displayValidationResults(loans, validationResults);
                
                console.log('📊 Enhanced validation complete:', validationResults.summary);
                console.log(`✅ Valid: ${validationResults.summary.valid}, ⚠️ Warnings: ${validationResults.summary.warnings}, ❌ Errors: ${validationResults.summary.errors}`);
                
            } catch (error) {
                console.error('Error processing Excel file:', error);
                
                // Show error state
                fileName.textContent = `❌ Error processing ${file.name}`;
                loanCount.textContent = error.message || 'Please check the file format and try again';
                loanCount.className = 'text-red-600 text-sm';
                
                // Hide workflow buttons
                processBtn.classList.add('hidden');
                priceReviewBtn.classList.add('hidden');
                document.getElementById('price-review-desc').classList.add('hidden');
                document.getElementById('process-btn-desc').classList.add('hidden');
                
                alert(`Error reading Excel file: ${error.message}`);
            }
        };
        reader.readAsArrayBuffer(file);
    });

    // Update file status based on validation results
    function updateFileStatusFromValidation(validationResults) {
        const { summary } = validationResults;
        
        if (summary.canProceed) {
            if (summary.warnings > 0) {
                fileName.textContent = `⚠️ ${fileUpload.files[0].name}`;
                loanCount.textContent = `${summary.total} loans ready (${summary.warnings} warnings)`;
                loanCount.className = 'text-yellow-600 text-sm';
            } else {
                fileName.textContent = `✅ ${fileUpload.files[0].name}`;
                loanCount.textContent = `${summary.total} loans ready to process`;
                loanCount.className = 'text-green-600 text-sm';
            }
        } else {
            fileName.textContent = `❌ ${fileUpload.files[0].name}`;
            loanCount.textContent = `${summary.total} loans uploaded - ${summary.errors} error${summary.errors !== 1 ? 's' : ''} must be fixed`;
            loanCount.className = 'text-red-600 text-sm';
        }
    }

    // Enhanced reset button handler
    resetBtn.addEventListener('click', function() {
        // Clear all loan data
        loans = [];
        credentials = {};
        batchStartTime = null;
        processingStartTime = null;
        detailedResults = [];
        pricingResults = [];
        selectedLoans = [];
        currentWorkflowType = 'auto-process';
        
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
        
        // Hide all sections
        resultsSection.classList.add('hidden');
        pricingReviewSection.classList.add('hidden');
        processingSection.classList.add('hidden');
        
        // Clear validation section
        const validationSection = document.getElementById('validation-section');
        if (validationSection) {
            validationSection.classList.add('hidden');
        }
        
        // Show upload section
        uploadSection.classList.remove('hidden');
        fileStatus.classList.add('hidden');
        processBtn.classList.add('hidden');
        priceReviewBtn.classList.add('hidden');
        document.getElementById('price-review-desc').classList.add('hidden');
        document.getElementById('process-btn-desc').classList.add('hidden');
        
        // Clear form inputs
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('file-upload').value = '';
        
        console.log('🔄 Enhanced reset completed - validation system cleared');
    });

    // Add helper function for smooth scrolling to validation results
    function scrollToValidation() {
        const validationSection = document.getElementById('validation-section');
        if (validationSection && !validationSection.classList.contains('hidden')) {
            validationSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    // Add validation status indicator to page title
    function updatePageTitle(validationResults) {
        const originalTitle = 'LoanNex Automation Portal';
        
        if (!validationResults) {
            document.title = originalTitle;
            return;
        }
        
        const { summary } = validationResults;
        if (!summary.canProceed) {
            document.title = `(${summary.errors} errors) ${originalTitle}`;
        } else if (summary.warnings > 0) {
            document.title = `(${summary.warnings} warnings) ${originalTitle}`;
        } else {
            document.title = `✅ ${originalTitle}`;
        }
    }

    // Enhanced error handling for network issues
    window.addEventListener('offline', function() {
        showNetworkStatus('offline');
    });

    window.addEventListener('online', function() {
        showNetworkStatus('online');
    });

    function showNetworkStatus(status) {
        const statusDiv = document.createElement('div');
        statusDiv.className = `fixed top-4 left-4 px-4 py-2 rounded-lg shadow-lg z-50 text-white text-sm ${
            status === 'offline' ? 'bg-red-500' : 'bg-green-500'
        }`;
        statusDiv.textContent = status === 'offline' 
            ? '🔴 No internet connection' 
            : '🟢 Connection restored';
        
        document.body.appendChild(statusDiv);
        
        setTimeout(() => {
            statusDiv.remove();
        }, 3000);
    }

    // Add keyboard shortcuts for power users
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + R: Reset (when not in input field)
        if ((e.ctrlKey || e.metaKey) && e.key === 'r' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            resetBtn.click();
        }
        
        // Ctrl/Cmd + F: Auto-fix all (when validation section is visible)
        if ((e.ctrlKey || e.metaKey) && e.key === 'f' && !e.target.matches('input, textarea')) {
            const autoFixBtn = document.getElementById('auto-fix-all-btn');
            if (autoFixBtn && !autoFixBtn.classList.contains('hidden')) {
                e.preventDefault();
                autoFixBtn.click();
            }
        }
        
        // Escape: Collapse all expanded loan details
        if (e.key === 'Escape') {
            document.querySelectorAll('[id^="loan-details-"]').forEach(detail => {
                if (!detail.classList.contains('hidden')) {
                    detail.classList.add('hidden');
                    const index = detail.id.split('-')[2];
                    const icon = document.getElementById(`expand-icon-${index}`);
                    if (icon) icon.style.transform = 'rotate(0deg)';
                }
            });
        }
    });

    // Add progress indicator for large file uploads
    function showUploadProgress() {
        const progressDiv = document.createElement('div');
        progressDiv.id = 'upload-progress';
        progressDiv.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        progressDiv.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p class="text-gray-700 font-medium">Processing your loan data...</p>
                    <p class="text-gray-500 text-sm mt-2">Running validation checks</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(progressDiv);
        
        // Auto-remove after 10 seconds as fallback
        setTimeout(() => {
            const existingProgress = document.getElementById('upload-progress');
            if (existingProgress) {
                existingProgress.remove();
            }
        }, 10000);
    }

    function hideUploadProgress() {
        const progressDiv = document.getElementById('upload-progress');
        if (progressDiv) {
            progressDiv.remove();
        }
    }

    console.log('✨ Enhanced LoanNex Validation System loaded!');
    console.log('🔍 Real-time validation with interactive UI');
    console.log('🔧 Smart auto-corrections for common errors');
    console.log('📊 Field-level validation feedback');
    console.log('⌨️ Keyboard shortcuts: Ctrl+R (reset), Ctrl+F (auto-fix), Esc (collapse)');
});
