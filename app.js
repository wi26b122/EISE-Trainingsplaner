const fs = require('fs');
const path = require('path');

/**
 * Parsed eine CSV-Zeile unter Berücksichtigung von Anführungszeichen.
 * @param {string} line 
 * @returns {string[]} Array der einzelnen Spaltenwerte
 */
function parseCSVLine(line) {
    const result = [];
    let currentVal = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            insideQuotes = !insideQuotes; // Toggle Status bei Anführungszeichen
        } else if (char === ',' && !insideQuotes) {
            result.push(currentVal.trim());
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    result.push(currentVal.trim());
    return result;
}

/**
 * Liest eine CSV-Datei ein und verarbeitet die Übungsdaten.
 * @param {string} filePath 
 */
function readExercisesCSV(filePath) {
    try {
        // Datei synchron mit UTF-8 Kodierung einlesen
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        
        // Zeilen umbrechen und leere Zeilen herausfiltern
        const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');

        if (lines.length === 0) {
            console.log('Die CSV-Datei ist leer.');
            return;
        }

        // Header herauskürzen
        const headers = parseCSVLine(lines[0]);
        const exercises = [];

        // Datenzeilen verarbeiten
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            
            if (values.length === headers.length) {
                const exercise = {
                    name: values[0],
                    zeitdauer: values[1],
                    typ: values[2], // Maschine/Freigewicht
                    beschreibung: values[3],
                    bildPath: values[4]
                };
                exercises.push(exercise);
            }
        }

        // Ergebnisse in der Konsole ausgeben
        console.log('--- Erfolgreich eingelesene Übungen ---');
        console.table(exercises);

        return exercises;

    } catch (error) {
        console.error('Fehler beim Einlesen der CSV-Datei:', error.message);
    }
}

// Aufruf der Funktion mit der zuvor erstellten Datei
const csvFilePath = path.join(__dirname, 'training_exercise.csv');
readExercisesCSV(csvFilePath);