const spreadsheetID = '1EP2CgweB1_PS2wLKVhvCR71C1eqfz062eOUuqI_HnGY';
const apiKey = 'AIzaSyDl29GPjLyeWzcKHk8UD6Qk6sVNa5G9N40';
const range = 'A2:H27'; 
const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${range}?key=${apiKey}`;

async function fetchData() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        let firstRow;
        const averages = [];
        let rowAtual = 1;

        data.values.forEach(row => {
            if (rowAtual === 1 || rowAtual === 2) {
                if (rowAtual === 1) {
                    firstRow = row;
                }
                rowAtual++;
            } else {
                const [registration, student, absences, p1, p2, p3] =  row;
                const totalClasses = firstRow[0].split(': ')[1];
                const gradeP1 = parseFloat(p1);
                const gradeP2 = parseFloat(p2);
                const gradeP3 = parseFloat(p3);
                
                const average = ((gradeP1 + gradeP2 + gradeP3) / 3 / 10).toFixed()
                
                let status;
                let naf = 0;
                
                if (average < 5) {
                    status = 'Reprovado por Nota';
                } else if (average < 7) {
                    status = 'Exame Final';
                    naf = 'Nota para Aprovação Final: ' + (5 * 2 - average);
                } else if ((absences >= (totalClasses * 0.25))) {
                    status = 'Reprovado por Falta';
                } else {
                    status = 'Aprovado';
                }
                
                averages.push({ 
                    matricula: registration, 
                    aluno: student, 
                    media: average, 
                    situacao: status, 
                    naf 
                });
            }
        });

        return averages;

    } catch (error) {
        console.error(error);
    }
}

fetchData().then(averages => console.log(averages));
// Inicie a aplicação rodando o comando no terminal: node script.js