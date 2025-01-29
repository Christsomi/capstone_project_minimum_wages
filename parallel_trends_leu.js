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

    function getColorForPValue(pValue) {
        if (pValue <= 0.05) return '#ff8a80';
        if (pValue <= 0.2) return '#ffff8d';
        return '#b9f6ca';
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
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    async function showCellDetails(event) {
        const cell = event.target;
        const mainState = stateSelect.value;
        const comparisonState = cell.dataset.variable;
        const ageGroup = ageGroupSelect.value;
        const category = cell.dataset.category;

        cellDetailsContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div class="loading-spinner"></div>
                <p style="margin-top: 20px; color: #4a4a4a; font-size: 16px;">Loading comparison data...</p>
            </div>`;
        cellDetailsModal.style.display = 'block';

        try {
            const cacheKey = `${ageGroup}_${mainState}_${comparisonState}_${category}`;
            let textContent = dataCache[cacheKey];

            if (!textContent) {
                const basePath = `parallel_trends_leu_each_state_${ageGroup}/${mainState}/${category}`;
                const textPath = `${basePath}/${mainState}_vs_${comparisonState}_conclusion.txt`;
                textContent = await loadTextContent(textPath);
                if (textContent) {
                    dataCache[cacheKey] = textContent;
                }
            }

            const basePath = `parallel_trends_leu_each_state_${ageGroup}/${mainState}/${category}`;
            const pngPath = `${basePath}/${mainState}_vs_${comparisonState}_plot.png`;
            const txtPath = `${basePath}/${mainState}_vs_${comparisonState}_conclusion.txt`;

            const modalContent = `
                <div class="modal-header" style="background: linear-gradient(135deg, #6ab7ff 0%, #1976d2 100%); border-bottom: none; padding: 20px; border-radius: 10px 10px 0 0;">
                    <div class="download-buttons">
                        <button class="download-btn" style="margin-right: 15px; background: #2196f3; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.2);" 
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)';" 
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 5px rgba(0,0,0,0.2)'"
                                onclick="downloadFile('${pngPath}', '${mainState}_vs_${comparisonState}_plot.png')">
                            <i class="fas fa-download"></i> Download Plot
                        </button>
                        <button class="download-btn" style="background: #4caf50; color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.2);"
                                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'" 
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 5px rgba(0,0,0,0.2)'"
                                onclick="downloadFile('${txtPath}', '${mainState}_vs_${comparisonState}_conclusion.txt')">
                            <i class="fas fa-file-alt"></i> Download Analysis
                        </button>
                    </div>
                </div>
                <div class="modal-body" style="padding: 25px; background: #f5f5f5;">
                    <div class="conclusion-text" style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 25px;">
                        <h3 style="color: #1976d2; margin-bottom: 20px; font-size: 24px;">Analysis Conclusion</h3>
                        <pre style="white-space: pre-wrap; font-family: 'Roboto Mono', monospace; font-size: 15px; line-height: 1.6; color: #333;">${textContent || 'No conclusion text available for this comparison.'}</pre>
                    </div>
                    <div class="comparison-plot" style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <h3 style="color: #1976d2; margin-bottom: 20px; font-size: 24px;">Comparison Plot</h3>
                        <img src="${pngPath}" 
                             alt="Comparison plot" 
                             onerror="this.onerror=null; this.alt='Plot not available for this comparison'; this.classList.add('error-image');"
                             class="comparison-image"
                             style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    </div>
                </div>`;

            cellDetailsContent.innerHTML = modalContent;

            window.downloadFile = downloadFile;

        } catch (error) {
            console.error('Error displaying cell details:', error);
            cellDetailsContent.innerHTML = `
                <div class="modal-error" style="text-align: center; padding: 40px; background: #ffebee; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <h2 style="color: #f44336; margin-bottom: 20px; font-size: 24px;">Error Loading Comparison Data</h2>
                    <p style="color: #4a4a4a; font-size: 16px;">There was an error loading the comparison data. Please try again later.</p>
                </div>`;
        }
    }

    async function createTable(ageGroup, state) {
        try {
            tableContainer.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div class="loading-spinner"></div>
                    <p style="margin-top: 20px; color: #4a4a4a; font-size: 16px;">Loading data for ${formatStateNameForDisplay(state)}...</p>
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
            table.style.width = '100%';
            table.style.borderCollapse = 'separate';
            table.style.borderSpacing = '0';
            table.style.marginTop = '25px';
            table.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            table.style.borderRadius = '15px';
            table.style.overflow = 'hidden';
            table.style.background = 'white';

            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            const headerRow = document.createElement('tr');
            Object.keys(results.data[0]).forEach(header => {
                const th = document.createElement('th');
                th.textContent = header === 'variable' ? 'Variable' : formatStateNameForDisplay(header);
                th.dataset.originalState = header;
                th.style.padding = '15px';
                th.style.background = 'linear-gradient(135deg, #6ab7ff 0%, #1976d2 100%)';
                th.style.color = 'white';
                th.style.fontWeight = '600';
                th.style.fontSize = '16px';
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            results.data.forEach((row, index) => {
                const tr = document.createElement('tr');
                tr.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                tr.style.transition = 'background-color 0.3s';
                
                const category = getCategory(row.variable);
                
                Object.entries(row).forEach(([key, value]) => {
                    const td = document.createElement('td');
                    td.style.padding = '15px';
                    td.style.borderBottom = '1px solid #e0e0e0';
                    
                    if (key === 'variable') {
                        td.textContent = value;
                        td.style.fontWeight = '500';
                        td.style.color = '#1976d2';
                    } else if (typeof value === 'number') {
                        td.textContent = value.toFixed(4);
                    } else {
                        td.textContent = value || '-';
                    }
                    
                    td.dataset.variable = key;
                    td.dataset.value = value;
                    td.dataset.category = category;

                    if (typeof value === 'number' && key !== 'variable') {
                        td.style.backgroundColor = getColorForPValue(value);
                        td.dataset.pvalue = value;
                        td.classList.add('clickable');
                        td.style.cursor = 'pointer';
                        td.style.transition = 'all 0.3s';
                        td.addEventListener('mouseover', () => {
                            td.style.transform = 'scale(1.05)';
                            td.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                        });
                        td.addEventListener('mouseout', () => {
                            td.style.transform = 'scale(1)';
                            td.style.boxShadow = 'none';
                        });
                        td.addEventListener('click', showCellDetails);

                        let significance = value <= 0.05 ? 'Significant' : 
                                         value <= 0.2 ? 'Marginally Significant' : 
                                         'Not Significant';
                        td.title = `Click to view details\nP-value: ${value.toFixed(4)}\n${significance}`;
                    }

                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });

            table.appendChild(thead);
            table.appendChild(tbody);
            
            tableContainer.innerHTML = '';
            tableContainer.appendChild(table);

        } catch (error) {
            console.error('Error loading table:', error);
            tableContainer.innerHTML = `
                <div style="padding: 25px; text-align: center; color: #d32f2f; background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <i class="fas fa-exclamation-circle" style="font-size: 32px; margin-bottom: 15px; color: #f44336;"></i>
                    <p style="margin: 0; font-size: 18px;">Error loading data for ${formatStateNameForDisplay(state)} (Age Group: ${ageGroup}).</p>
                    <p style="margin: 15px 0 0; font-size: 16px;">Please check if the file exists and try again.</p>
                </div>`;
        }
    }

    closeButton.addEventListener('click', () => {
        cellDetailsModal.style.opacity = '0';
        setTimeout(() => {
            cellDetailsModal.style.display = 'none';
            cellDetailsModal.style.opacity = '1';
        }, 300);
    });

    window.addEventListener('click', (event) => {
        if (event.target === cellDetailsModal) {
            cellDetailsModal.style.opacity = '0';
            setTimeout(() => {
                cellDetailsModal.style.display = 'none';
                cellDetailsModal.style.opacity = '1';
            }, 300);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && cellDetailsModal.style.display === 'block') {
            cellDetailsModal.style.opacity = '0';
            setTimeout(() => {
                cellDetailsModal.style.display = 'none';
                cellDetailsModal.style.opacity = '1';
            }, 300);
        }
    });

    ageGroupSelect.addEventListener('change', () => {
        if (stateSelect.value) {
            tableContainer.style.opacity = '0';
            setTimeout(() => {
                createTable(ageGroupSelect.value, stateSelect.value);
                dataCache = {};
                setTimeout(() => {
                    tableContainer.style.opacity = '1';
                }, 100);
            }, 300);
        }
    });

    stateSelect.addEventListener('change', () => {
        if (stateSelect.value) {
            tableContainer.style.opacity = '0';
            setTimeout(() => {
                createTable(ageGroupSelect.value, stateSelect.value);
                dataCache = {};
                setTimeout(() => {
                    tableContainer.style.opacity = '1';
                }, 100);
            }, 300);
        } else {
            tableContainer.style.opacity = '0';
            setTimeout(() => {
                tableContainer.innerHTML = '';
                tableContainer.style.opacity = '1';
            }, 300);
        }
    });

    if (stateSelect.value) {
        createTable(ageGroupSelect.value, stateSelect.value);
    }
});