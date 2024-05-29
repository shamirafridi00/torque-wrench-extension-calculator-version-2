let extensionCount = 1;

document.getElementById('add-extension').addEventListener('click', addExtension);
document.getElementById('calculate').addEventListener('click', calculateTorque);
document.getElementById('reset').addEventListener('click', resetInputs);
document.getElementById('print').addEventListener('click', printResults);

function addExtension() {
    const extensionsDiv = document.getElementById('extensions');
    const newExtensionDiv = document.createElement('div');
    newExtensionDiv.className = 'extension-group';
    newExtensionDiv.innerHTML = `
        <div class="input-group">
            <label for="extension-length-${extensionCount}">Length of Extension:</label>
            <input type="number" id="extension-length-${extensionCount}" class="extension-length">
            <select id="extension-length-unit-${extensionCount}" class="extension-length-unit">
                <option value="inches">inches</option>
                <option value="mm">mm</option>
            </select>
        </div>
        <div class="input-group">
            <label for="angle-${extensionCount}">Angle of Extension:</label>
            <input type="number" id="angle-${extensionCount}" class="extension-angle" value="90">
        </div>`;
    extensionsDiv.appendChild(newExtensionDiv);
    extensionCount++;
}

function calculateTorque() {
    const torqueSetting = parseFloat(document.getElementById('torque-setting').value);
    const torqueUnit = document.getElementById('torque-unit').value;
    const wrenchLength = parseFloat(document.getElementById('wrench-length').value);
    const wrenchLengthUnit = document.getElementById('wrench-length-unit').value;

    let wrenchLengthInches = wrenchLengthUnit === 'mm' ? wrenchLength / 25.4 : wrenchLength;
    let totalEffectiveLength = wrenchLengthInches;

    for (let i = 0; i < extensionCount; i++) {
        const extensionLength = parseFloat(document.getElementById(`extension-length-${i}`).value);
        const extensionLengthUnit = document.getElementById(`extension-length-unit-${i}`).value;
        const angle = parseFloat(document.getElementById(`angle-${i}`).value);

        let extensionLengthInches = extensionLengthUnit === 'mm' ? extensionLength / 25.4 : extensionLength;
        totalEffectiveLength += extensionLengthInches * Math.cos(angle * Math.PI / 180);
    }

    let adjustedTorque = torqueSetting * wrenchLengthInches / totalEffectiveLength;

    document.getElementById('adjusted-torque').textContent = `Adjusted Torque: ${adjustedTorque.toFixed(2)} ${torqueUnit}`;

    let convertedTorque;
    let conversionUnit;
    if (torqueUnit === 'Nm') {
        convertedTorque = adjustedTorque * 0.73756;
        conversionUnit = 'ft-lb';
    } else {
        convertedTorque = adjustedTorque / 0.73756;
        conversionUnit = 'Nm';
    }
    document.getElementById('unit-conversion').textContent = `Unit Conversion: ${convertedTorque.toFixed(2)} ${conversionUnit}`;
}

function resetInputs() {
    document.getElementById('torque-setting').value = '';
    document.getElementById('wrench-length').value = '';
    document.getElementById('extension-length-0').value = '';
    document.getElementById('angle-0').value = '90';

    const extensionsDiv = document.getElementById('extensions');
    while (extensionsDiv.children.length > 1) {
        extensionsDiv.removeChild(extensionsDiv.lastChild);
    }
    extensionCount = 1;

    document.getElementById('adjusted-torque').textContent = 'Adjusted Torque: ';
    document.getElementById('unit-conversion').textContent = 'Unit Conversion: ';
}

function printResults() {
    window.print();
}
