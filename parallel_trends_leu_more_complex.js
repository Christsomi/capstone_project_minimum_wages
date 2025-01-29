document.addEventListener('DOMContentLoaded', () => {
    const ageGroupSelect = document.getElementById('age-group');
    const stateSelect = document.getElementById('state');
    const tableContainer = document.getElementById('table-container');
    const cellDetailsModal = document.getElementById('cell-details-modal');
    const cellDetailsContent = document.getElementById('cell-details-content');
    const closeButton = document.querySelector('.close-button');

    let dataCache = {};

    async function downloadFile(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download file. Please try again.');
        }
    }

    async function determineCellColor(mainState, comparisonState, ageGroup, category) {
        try {
            const basePath = `parallel_trends_leu_each_state_more_complex_${ageGroup}/${mainState}/${category}`;
            const txtPath = `${basePath}/${mainState}_vs_${comparisonState}_conclusion.txt`;

            const response = await fetch(txtPath);
            if (!response.ok) {
                return '#FFD93D';
            }
            
            const textContent = await response.text();
            
            if (textContent.includes('✓ Suitable for DiD analysis')) {
                return '#4CAF50';
            } else if (textContent.includes('⚡ Consider additional robustness checks')) {
                return '#FFD93D';
            } else if (textContent.includes('⚠ Consider alternative methods or controls')) {
                return '#FF6B6B';
            }
            
            return '#FFD93D';
        } catch (error) {
            console.error('Error determining cell color:', error);
            return '#FFD93D';
        }
    }

    function getColorForPValue(pValue) {
        if (pValue <= 0.05) return '#FF6B6B';
        if (pValue <= 0.2) return '#FFD93D';
        return '#4CAF50';
    }

    async function loadTextContent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error loading text content:', error);
            return null;
        }
    }

    function getCategory(variableName) {
        const value = variableName.toLowerCase();
        if (value.includes('emp') && !value.includes('unemp')) return 'employment';
        if (value.includes('lf')) return 'labor_force';
        if (value.includes('total')) return 'total';
        if (value.includes('unemp')) return 'unemployment';
        return null;
    }

    function formatStateNameForDisplay(state) {
        if (!state) return '';
        return state
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    async function showCellDetails(event) {
        const cell = event.target;
        const mainState = stateSelect.value;
        const comparisonState = cell.dataset.variable;
        const ageGroup = ageGroupSelect.value;
        const category = cell.dataset.category;

        cellDetailsContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p>Loading comparison data...</p>
            </div>`;
        cellDetailsModal.style.display = 'block';

        try {
            const cacheKey = `${ageGroup}_${mainState}_${comparisonState}_${category}`;
            let textContent = dataCache[cacheKey];

            if (!textContent) {
                const basePath = `parallel_trends_leu_each_state_more_complex_${ageGroup}/${mainState}/${category}`;
                const textPath = `${basePath}/${mainState}_vs_${comparisonState}_conclusion.txt`;
                textContent = await loadTextContent(textPath);
                if (textContent) {
                    dataCache[cacheKey] = textContent;
                }
            }

            const basePath = `parallel_trends_leu_each_state_more_complex_${ageGroup}/${mainState}/${category}`;
            const pngPath = `${basePath}/${mainState}_vs_${comparisonState}_plot.png`;
            const txtPath = `${basePath}/${mainState}_vs_${comparisonState}_conclusion.txt`;

            const modalContent = `
                <div class="modal-header">
                    <div class="download-buttons">
                        <button class="download-btn" onclick="downloadFile('${pngPath}', '${mainState}_vs_${comparisonState}_plot.png')">
                            Download Plot (PNG)
                        </button>
                        <button class="download-btn" onclick="downloadFile('${txtPath}', '${mainState}_vs_${comparisonState}_conclusion.txt')">
                            Download Analysis (TXT)
                        </button>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="conclusion-text">
                        <h3>Analysis Conclusion</h3>
                        <pre>${textContent || 'No conclusion text available for this comparison.'}</pre>
                    </div>
                    <div class="comparison-plot">
                        <h3>Comparison Plot</h3>
                        <img src="${pngPath}" 
                             alt="Comparison plot" 
                             onerror="this.onerror=null; this.alt='Plot not available for this comparison'; this.classList.add('error-image');"
                             class="comparison-image">
                    </div>
                </div>`;

            cellDetailsContent.innerHTML = modalContent;

            window.downloadFile = downloadFile;

        } catch (error) {
            console.error('Error displaying cell details:', error);
            cellDetailsContent.innerHTML = `
                <div class="modal-error">
                    <h2>Error Loading Comparison Data</h2>
                    <p>There was an error loading the comparison data. Please try again later.</p>
                </div>`;
        }
    }

    async function createTable(ageGroup, state) {
        try {
            tableContainer.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <p>Loading data for ${formatStateNameForDisplay(state)}...</p>
                </div>`;

            const csvPath = `parallel_trends_leu_all_states_tables_${ageGroup}/${state}_leu_parallel_trends.csv`;
            const response = await fetch(csvPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();

            const results = Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true
            });

            if (!results.data || !results.data.length) {
                throw new Error('No data found in CSV file');
            }

            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const headerRow = document.createElement('tr');
            Object.keys(results.data[0]).forEach(header => {
                const th = document.createElement('th');
                th.textContent = header === 'variable' ? 'Variable' : formatStateNameForDisplay(header);
                th.dataset.originalState = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            for (const row of results.data) {
                const tr = document.createElement('tr');
                const category = getCategory(row.variable);
                
                for (const [key, value] of Object.entries(row)) {
                    const td = document.createElement('td');
                    
                    if (key === 'variable') {
                        td.textContent = value;
                    } else if (typeof value === 'number') {
                        td.textContent = value.toFixed(4);
                    } else {
                        td.textContent = value || '-';
                    }
                    
                    td.dataset.variable = key;
                    td.dataset.value = value;
                    td.dataset.category = category;

                    if (typeof value === 'number' && key !== 'variable') {
                        let cellColor = await determineCellColor(state, key, ageGroup, category);
                        td.style.backgroundColor = cellColor;
                        
                        td.dataset.pvalue = value;
                        td.classList.add('clickable');
                        td.addEventListener('click', showCellDetails);

                        let significance = value <= 0.05 ? 'Significant' : 
                                         value <= 0.2 ? 'Marginally Significant' : 
                                         'Not Significant';
                        td.title = `Click to view details\nP-value: ${value.toFixed(4)}\n${significance}`;
                    }

                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }

            table.appendChild(thead);
            table.appendChild(tbody);
            
            tableContainer.innerHTML = '';
            tableContainer.appendChild(table);

        } catch (error) {
            console.error('Error loading table:', error);
            tableContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
                    Error loading data for ${formatStateNameForDisplay(state)} (Age Group: ${ageGroup}). 
                    Please check if the file exists and try again.
                </div>`;
        }
    }

    closeButton.addEventListener('click', () => {
        cellDetailsModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === cellDetailsModal) {
            cellDetailsModal.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && cellDetailsModal.style.display === 'block') {
            cellDetailsModal.style.display = 'none';
        }
    });

    ageGroupSelect.addEventListener('change', () => {
        if (stateSelect.value) {
            createTable(ageGroupSelect.value, stateSelect.value);
            dataCache = {};
        }
    });

    stateSelect.addEventListener('change', () => {
        if (stateSelect.value) {
            createTable(ageGroupSelect.value, stateSelect.value);
            dataCache = {};
        } else {
            tableContainer.innerHTML = '';
        }
    });

    if (stateSelect.value) {
        createTable(ageGroupSelect.value, stateSelect.value);
    }
});