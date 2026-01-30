/**
 * SigmaCalc Pro v14.0 - Sistema Integrado Total
 * Autor: Junior Santos
 */

const menu = document.getElementById("menu");
const render = document.getElementById("modulo-render");
const chartCard = document.getElementById("chart-container");
const tabelaRender = document.getElementById("tabela-render");
let chartInstance = null;

const moeda = (v) => v.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

// Inteligência Central: Captura e converte Taxas e Prazos
const getSmartData = () => {
    const v1 = Number(document.getElementById("in1")?.value) || 0;
    const taxaInput = Number(document.getElementById("in2")?.value) || 0;
    const prazoInput = Number(document.getElementById("in3")?.value) || 0;
    const fluxosInput = document.getElementById("in-fluxos")?.value || "";
    
    const periodicidadeTaxa = document.getElementById("temp-taxa")?.value || 'm';
    const periodicidadePrazo = document.getElementById("temp-prazo")?.value || 'm';

    const fatores = { m: 1, b: 2, t: 3, s: 6, a: 12 };

    const nMeses = prazoInput * fatores[periodicidadePrazo];
    const iDecimal = taxaInput / 100;
    // Equivalência de Juros Compostos para a taxa mensal
    const iMensal = Math.pow(1 + iDecimal, 1 / fatores[periodicidadeTaxa]) - 1;

    return {
        v1,
        taxaMensal: iMensal,
        meses: nMeses,
        fluxos: fluxosInput.split(",").map(Number).filter(x => !isNaN(x)),
        tipoJuros: document.getElementById("in4")?.value || 'c'
    };
};

/* --- ESTRUTURA DE LAYOUTS --- */
const layouts = {
    estatistica: `<h2>📊 Estatística</h2>
<p class="manual">Analisa Média, Moda, Mediana, Desvio Padrão, Coeficiente de Variação (risco) de uma lista de números.</p>
<input id="in-fluxos" placeholder="Valores (ex: 10, 20, 30)">
<button onclick="calcEstatistica()">Analisar</button>`,

    juros: `<h2>💰 Juros Simples e Compostos</h2>
<p class="manual">Compara o crescimento linear contra o crescimento de juros sobre juros.</p>
<input id="in1" type="number" placeholder="Capital Inicial">
<div class="row">
    <input id="in2" type="number" placeholder="Taxa %">
    <select id="temp-taxa">
        <option value="m">ao mês</option>
        <option value="a">ao ano</option>
    </select>
</div>
<div class="row">
    <input id="in3" type="number" placeholder="Prazo">
    <select id="temp-prazo">
        <option value="m">Meses</option>
        <option value="a">Anos</option>
    </select>
</div>
<select id="in4">
    <option value="c">Compostos</option>
    <option value="s">Simples</option>
</select>
<button onclick="calcJuros()">Calcular</button>`,

    valorFuturo: `<h2>📈 Valor Futuro (VF)</h2>
<p class="manual">Quanto um valor hoje valerá no futuro.</p>
<input id="in1" type="number" placeholder="Valor Presente">
<div class="row">
    <input id="in2" type="number" placeholder="Taxa %">
    <select id="temp-taxa">
        <option value="m">ao mês</option>
        <option value="a">ao ano</option>
    </select>
</div>
<div class="row">
    <input id="in3" type="number" placeholder="Prazo">
    <select id="temp-prazo">
        <option value="m">Meses</option>
        <option value="a">Anos</option>
    </select>
</div>
<button onclick="calcVF()">Calcular VF</button>`,

    valorPresente: `<h2>📉 Valor Presente (VP)</h2>
<p class="manual">Quanto um valor futuro vale hoje.</p>
<input id="in1" type="number" placeholder="Valor Futuro">
<div class="row">
    <input id="in2" type="number" placeholder="Taxa %">
    <select id="temp-taxa">
        <option value="m">ao mês</option>
        <option value="a">ao ano</option>
    </select>
</div>
<div class="row">
    <input id="in3" type="number" placeholder="Prazo">
    <select id="temp-prazo">
        <option value="m">Meses</option>
        <option value="a">Anos</option>
    </select>
</div>
<button onclick="calcVP()">Calcular VP</button>`,

    prestacaoPMT: `<h2>🏦 Prestação (PMT)</h2>
<p class="manual">Calcula a prestação fixa de um financiamento (Tabela Price).</p>
<input id="in1" type="number" placeholder="Valor do Empréstimo / PV">
<div class="row">
    <input id="in2" type="number" placeholder="Taxa % ao período">
    <select id="temp-taxa">
        <option value="m">ao mês</option>
        <option value="a">ao ano</option>
    </select>
</div>
<div class="row">
    <input id="in3" type="number" placeholder="Número de parcelas / Prazo">
    <select id="temp-prazo">
        <option value="m">Meses</option>
        <option value="a">Anos</option>
    </select>
</div>
<button onclick="calcPMT()">Calcular Prestação</button>
<div id="resultadoPMT"></div>`,

    descontoComposto: `<h2>💵 Desconto Composto</h2>
<p class="manual">Antecipação de títulos com juros sobre juros.</p>
<input id="in1" type="number" placeholder="Valor Nominal">
<div class="row">
    <input id="in2" type="number" placeholder="Taxa %">
    <select id="temp-taxa">
        <option value="m">ao mês</option>
        <option value="a">ao ano</option>
    </select>
</div>
<div class="row">
    <input id="in3" type="number" placeholder="Prazo">
    <select id="temp-prazo">
        <option value="m">Meses</option>
        <option value="a">Anos</option>
    </select>
</div>
<button onclick="calcDescComp()">Calcular Desconto</button>`,

    descontoSimples: `<h2>💵 Desconto Comercial Simples</h2>
<p class="manual">Antecipação de títulos usando desconto simples.</p>
<input id="in1" type="number" placeholder="Valor Nominal">
<div class="row">
    <input id="in2" type="number" placeholder="Taxa %">
    <select id="temp-taxa">
        <option value="m">ao mês</option>
        <option value="a">ao ano</option>
    </select>
</div>
<div class="row">
    <input id="in3" type="number" placeholder="Prazo">
    <select id="temp-prazo">
        <option value="m">Meses</option>
        <option value="a">Anos</option>
    </select>
</div>
<button onclick="calcDescSimples()">Calcular Desconto</button>`,

    vpl: `<h2>📊 VPL</h2>
<p class="manual">Avalia se um projeto é viável (VPL > 0).</p>
<input id="in1" type="number" placeholder="Investimento Inicial">
<input id="in-fluxos" placeholder="Ganhos Mensais (ex: 500, 600, 700)">
<div class="row">
    <input id="in2" type="number" placeholder="Taxa TMA %">
    <select id="temp-taxa">
        <option value="m">ao mês</option>
        <option value="a">ao ano</option>
    </select>
</div>
<button onclick="calcVPL()">Avaliar</button>`,

    tir: `<h2>📈 TIR</h2>
<p class="manual">Calcula a porcentagem de lucro real de um projeto.</p>
<input id="in1" type="number" placeholder="Investimento Inicial">
<input id="in-fluxos" placeholder="Fluxos de Caixa (ex: 400, 500, 600)">
<button onclick="calcTIR()">Calcular TIR</button>`,

    aporte: `<h2>💰 Aporte Periódico</h2>
<p class="manual">Acúmulo de capital com depósitos mensais.</p>
<input id="in1" type="number" placeholder="Valor do Aporte">
<div class="row">
    <input id="in2" type="number" placeholder="Rendimento %">
    <select id="temp-taxa">
        <option value="m">ao mês</option>
        <option value="a">ao ano</option>
    </select>
</div>
<div class="row">
    <input id="in3" type="number" placeholder="Prazo">
    <select id="temp-prazo">
        <option value="m">Meses</option>
        <option value="a">Anos</option>
    </select>
</div>
<button onclick="calcAporte()">Simular Acúmulo</button>`,

    tabelaPrice: `<h2>🏦 Tabela Price</h2>
<p class="manual">Parcelas fixas do início ao fim.</p>
<input id="in1" type="number" placeholder="Valor Total">
<div class="row">
    <input id="in2" type="number" placeholder="Taxa %">
    <select id="temp-taxa">
        <option value="m">ao mês</option>
        <option value="a">ao ano</option>
    </select>
</div>
<div class="row">
    <input id="in3" type="number" placeholder="Prazo">
    <select id="temp-prazo">
        <option value="m">Meses</option>
        <option value="a">Anos</option>
    </select>
</div>
<button onclick="calcPrice()">Gerar</button>`,

    sistemaSAC: `<h2>📉 Sistema SAC</h2>
<p class="manual">Parcelas que diminuem a cada mês.</p>
<input id="in1" type="number" placeholder="Valor Total">
<div class="row">
    <input id="in2" type="number" placeholder="Taxa %">
    <select id="temp-taxa">
        <option value="m">ao mês</option>
        <option value="a">ao ano</option>
    </select>
</div>
<div class="row">
    <input id="in3" type="number" placeholder="Prazo">
    <select id="temp-prazo">
        <option value="m">Meses</option>
        <option value="a">Anos</option>
    </select>
</div>
<button onclick="calcSAC()">Gerar</button>`
};


/* --- MOTORES DE CÁLCULO --- */

function resetUI() {
    if (chartInstance) chartInstance.destroy();
    chartCard.style.display = "block";
    tabelaRender.innerHTML = "";
}

function calcJuros() {
    resetUI();
    const { v1: c, taxaMensal: i, meses: n, tipoJuros } = getSmartData();
    let labels = [], valores = [];
    let h = `<table><tr><th>Mês</th><th>Montante</th><th>Juros Acum.</th></tr>`;
    for(let t=0; t<=n; t++) {
        let m = (tipoJuros === 'c') ? c * Math.pow(1 + i, t) : c * (1 + i * t);
        labels.push(t); valores.push(m.toFixed(2));
        h += `<tr><td>${t}</td><td>${moeda(m)}</td><td>${moeda(m-c)}</td></tr>`;
    }
    tabelaRender.innerHTML = h + `</table>`;
    renderChart("Evolução", labels, valores, 'line');
}

function calcVF() { 
    resetUI(); 
    const { v1: vp, taxaMensal: i, meses: n } = getSmartData(); 
    const vf = vp * Math.pow(1 + i, n); 
    tabelaRender.innerHTML = `<div class="result">Valor Futuro: ${moeda(vf)}</div>`; 
}

function calcVP() { 
    resetUI(); 
    const { v1: vf, taxaMensal: i, meses: n } = getSmartData(); 
    const vp = vf / Math.pow(1 + i, n); 
    tabelaRender.innerHTML = `<div class="result">Valor Presente: ${moeda(vp)}</div>`; 
}


function calcDescComp() { 
    resetUI(); 
    const { v1: nVal, taxaMensal: i, meses: n } = getSmartData(); 
    const vl = nVal * Math.pow(1 - i, n); 
    tabelaRender.innerHTML = `<div class="result">Valor Líquido: ${moeda(vl)}<br>Desconto: ${moeda(nVal-vl)}</div>`; 
}



function getDataPMT() {
    const pv = Number(document.getElementById("in1")?.value) || 0;
    const taxa = Number(document.getElementById("in2")?.value) || 0;
    const prazo = Number(document.getElementById("in3")?.value) || 0;

    const tempTaxa = document.getElementById("temp-taxa")?.value || 'm';
    const tempPrazo = document.getElementById("temp-prazo")?.value || 'm';

    let n = prazo;
    if(tempPrazo === 'a') n = prazo * 12; // se prazo em anos, converte pra meses

    let i = taxa / 100;
    if(tempTaxa === 'a') i = Math.pow(1 + i, 1/12) - 1; // converte taxa anual para mensal

    return { pv, i, n };
}





function calcDescSimples() {
    resetUI();
    const { v1: nVal, taxaMensal: i, meses: n } = getSmartData();
    const desconto = nVal * i * n;      // D = N * i * n
    const vl = nVal - desconto;          // Valor líquido
    tabelaRender.innerHTML = `<div class="result">Valor Líquido: ${moeda(vl)}<br>Desconto: ${moeda(desconto)}</div>`;
}

function calcAporte() {
    resetUI();
    const { v1: pmt, taxaMensal: i, meses: n } = getSmartData();
    let labels = [], valores = [], acum = 0;
    let h = `<table><tr><th>Mês</th><th>Saldo</th></tr>`;
    for(let t=1; t<=n; t++) {
        acum = (acum + pmt) * (1 + i);
        labels.push(t); valores.push(acum.toFixed(2));
        h += `<tr><td>${t}</td><td>${moeda(acum)}</td></tr>`;
    }
    tabelaRender.innerHTML = h + `</table>`;
    renderChart("Patrimônio", labels, valores, 'line');
}

function calcVPL() {
    resetUI();
    const { v1: inv, taxaMensal: i, fluxos } = getSmartData();
    let vpl = -inv;
    fluxos.forEach((f, t) => vpl += f / Math.pow(1 + i, t + 1));
    tabelaRender.innerHTML = `<div class="result">VPL: ${moeda(vpl)}<br>${vpl > 0 ? "✅ Projeto Viável" : "❌ Projeto Inviável"}</div>`;
}

function calcPMT() {
    resetUI();
    const { pv, i, n } = getDataPMT();

    if(pv === 0 || n === 0) return alert("Preencha todos os campos corretamente!");

    let pmt;
    if(i === 0) {
        pmt = pv / n;
    } else {
        pmt = pv * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    }

    let sd = pv;
    let h = `<table><tr><th>Parcela</th><th>Prestação</th><th>Juros</th><th>Amortização</th><th>Saldo Devedor</th></tr>`;
    for(let t=1; t<=n; t++){
        const juros = sd * i;
        const amortizacao = pmt - juros;
        sd -= amortizacao;
        h += `<tr>
                <td>${t}</td>
                <td>${moeda(pmt)}</td>
                <td>${moeda(juros)}</td>
                <td>${moeda(amortizacao)}</td>
                <td>${moeda(Math.max(0, sd))}</td>
              </tr>`;
    }
    h += `</table>`;

    tabelaRender.innerHTML = `<div class="result">Prestação (PMT) calculada com sucesso!</div>` + h;
}




function calcTIR() {
    resetUI();
    const { v1: inv, fluxos } = getSmartData();
    const f = [-inv, ...fluxos];
    let tir = 0.1;
    for (let j = 0; j < 100; j++) {
        let npv = 0, dNpv = 0;
        f.forEach((val, t) => {
            npv += val / Math.pow(1 + tir, t);
            dNpv -= t * val / Math.pow(1 + tir, t + 1);
        });
        let p = tir - npv / dNpv;
        if (Math.abs(p - tir) < 0.000001) break;
        tir = p;
    }
    tabelaRender.innerHTML = `<div class="result">TIR: ${(tir * 100).toFixed(4)}% ao mês</div>`;
}

function calcPrice() {
    resetUI();
    let { v1: pv, taxaMensal: i, meses: n } = getSmartData();
    if(i === 0) {
        tabelaRender.innerHTML = `<div class="result">Taxa não pode ser 0%</div>`;
        return;
    }
    let pmt = pv * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    let sd = pv, labels = [], jur = [], amo = [];
    let h = `<table><tr><th>Mês</th><th>Parcela</th><th>Amortização</th><th>Saldo</th></tr>`;
    for(let t=1; t<=n; t++) {
        let j = sd * i;
        let a = pmt - j;
        sd -= a;
        labels.push(t); jur.push(j); amo.push(a);
        h += `<tr><td>${t}</td><td>${moeda(pmt)}</td><td>${moeda(a)}</td><td>${moeda(Math.abs(sd))}</td></tr>`;
    }
    tabelaRender.innerHTML = h + `</table>`;
    renderChartComplex(labels, jur, amo);
}

function calcSAC() {
    resetUI();
    let { v1: pv, taxaMensal: i, meses: n } = getSmartData();
    let amoVal = pv / n, sd = pv, labels = [], jur = [], pmtArr = [];
    let h = `<table><tr><th>Mês</th><th>Parcela</th><th>Amort.</th><th>Saldo</th></tr>`;
    for(let t=1; t<=n; t++) {
        let j = sd * i, p = amoVal + j; sd -= amoVal;
        labels.push(t); jur.push(j); pmtArr.push(p);
        h += `<tr><td>${t}</td><td>${moeda(p)}</td><td>${moeda(amoVal)}</td><td>${moeda(Math.abs(sd))}</td></tr>`;
    }
    tabelaRender.innerHTML = h + `</table>`;
    renderChartComplex(labels, jur, pmtArr);
}

function calcEstatistica() {
    resetUI();
    const { fluxos: dados } = getSmartData();
    if (dados.length < 2) return alert("Insira pelo menos 2 valores!");

    // Média
    const media = dados.reduce((a, b) => a + b, 0) / dados.length;

    // Moda
    const freq = {};
    dados.forEach(n => freq[n] = (freq[n] || 0) + 1);
    let maxFreq = 0, moda = [];
    for (let num in freq) {
        if (freq[num] > maxFreq) {
            moda = [Number(num)];
            maxFreq = freq[num];
        } else if (freq[num] === maxFreq) {
            moda.push(Number(num));
        }
    }
    if (moda.length === Object.keys(freq).length) moda = ['Sem moda'];

    // Mediana
    const sorted = [...dados].sort((a, b) => a - b);
    const meio = Math.floor(sorted.length / 2);
    let mediana;
    if (sorted.length % 2 === 0) {
        mediana = (sorted[meio - 1] + sorted[meio]) / 2;
    } else {
        mediana = sorted[meio];
    }

    // Desvio Padrão (amostral)
    const variancia = dados.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / (dados.length - 1);
    const desvioPadrao = Math.sqrt(variancia);

    // Coeficiente de Variação (em %)
    const coefVar = (desvioPadrao / media) * 100;

    // Renderizar resultados
    tabelaRender.innerHTML = `
        <div class="result">
            <strong>Média:</strong> ${media.toFixed(2)}<br>
            <strong>Moda:</strong> ${moda.join(', ')}<br>
            <strong>Mediana:</strong> ${mediana.toFixed(2)}<br>
            <strong>Desvio Padrão:</strong> ${desvioPadrao.toFixed(2)}<br>
            <strong>Coeficiente de Variação:</strong> ${coefVar.toFixed(2)}%
        </div>
    `;
}





/* --- GRÁFICOS --- */
function renderChart(label, labels, dados, type) {
    const ctx = document.getElementById('meuGrafico').getContext('2d');
    chartInstance = new Chart(ctx, { type, data: { labels, datasets: [{ label, data: dados, borderColor: '#38bdf8', fill: false }] } });
}

function renderChartComplex(labels, d1, d2) {
    const ctx = document.getElementById('meuGrafico').getContext('2d');
    chartInstance = new Chart(ctx, { type: 'bar', data: { labels, datasets: [{ label: 'Juros', data: d1, backgroundColor: '#ef4444' }, { label: 'Principal', data: d2, backgroundColor: '#22c55e' }] }, options: { scales: { x: { stacked: true }, y: { stacked: true } } } });
}

menu.addEventListener("change", () => {
    render.innerHTML = layouts[menu.value] || "<h2>Erro ao carregar</h2>";
    tabelaRender.innerHTML = "";
    chartCard.style.display = "none";
});
window.onload = () => menu.dispatchEvent(new Event('change'));
