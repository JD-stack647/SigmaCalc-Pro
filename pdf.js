document.getElementById("btnPdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20;

    function titulo(t) {
        doc.setFontSize(15);
        doc.text(t, 20, y);
        y += 10;
    }

    function texto(t) {
        doc.setFontSize(11);
        doc.text(t, 20, y);
        y += 8;
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    }

    // CAPA
    titulo("CADERNO DE MATEMATICA FINANCEIRA E ESTATISTICA");
    texto("Material didatico com formulas e exemplos praticos.");
    texto("Aplicacoes reais para estudo e mercado.");
    texto("Autor: Junior Diego Silva dos Santos");
    texto("Projeto: SigmaCalc Pro");

    // =========================
    // 1. ESTATISTICA DESCRITIVA
    // =========================
    doc.addPage(); y = 20;
    titulo("1. ESTATISTICA DESCRITIVA");

    texto("A estatistica descritiva organiza e resume dados.");
    texto("Principais medidas:");

    texto("Media:");
    texto("Formula: soma dos valores / quantidade");

    texto("Exemplo:");
    texto("Dados: 5, 7, 8, 10");
    texto("Media = (5+7+8+10)/4 = 7.5");

    texto("Mediana:");
    texto("Valor central do conjunto ordenado.");

    texto("Moda:");
    texto("Valor que mais se repete.");

    // =========================
    // 2. JUROS SIMPLES E COMPOSTOS
    // =========================
    doc.addPage(); y = 20;
    titulo("2. JUROS SIMPLES");

    texto("Os juros simples incidem apenas sobre o capital inicial.");
    texto("Formula: J = C * i * t");

    texto("Exemplo:");
    texto("C = 1000 | i = 2% | t = 5");
    texto("J = 1000 * 0.02 * 5 = 100");
    texto("Montante = 1100");

    titulo("JUROS COMPOSTOS");
    texto("Os juros compostos geram juros sobre juros.");
    texto("Formula: FV = PV * (1 + i)^n");

    texto("Exemplo:");
    texto("PV = 2000 | i = 3% | n = 6");
    texto("FV = 2000 * (1.03)^6 = 2388.10");

    // =========================
    // 3. VALOR FUTURO
    // =========================
    doc.addPage(); y = 20;
    titulo("3. VALOR FUTURO (FV)");

    texto("Calcula quanto um capital vai valer no futuro.");
    texto("Formula: FV = PV * (1 + i)^n");

    texto("Exemplo:");
    texto("PV = 1500 | i = 2% | n = 10");
    texto("FV = 1829.00");

    // =========================
    // 4. VALOR PRESENTE
    // =========================
    doc.addPage(); y = 20;
    titulo("4. VALOR PRESENTE (PV)");

    texto("Calcula quanto vale hoje um valor futuro.");
    texto("Formula: PV = FV / (1 + i)^n");

    texto("Exemplo:");
    texto("FV = 5000 | i = 2% | n = 12");
    texto("PV = 3950.62");

    // =========================
    // 5. PRESTACAO (PMT)
    // =========================
    doc.addPage(); y = 20;
    titulo("5. PRESTACAO (PMT)");

    texto("Valor da parcela em financiamentos.");
    texto("Formula:");
    texto("PMT = PV * i / (1 - (1 + i)^-n)");

    texto("Exemplo:");
    texto("PV = 10000 | i = 2% | n = 12");
    texto("PMT = 945.60");

    // =========================
    // 6. DESCONTO SIMPLES
    // =========================
    doc.addPage(); y = 20;
    titulo("6. DESCONTO COMERCIAL SIMPLES");

    texto("Desconto aplicado diretamente sobre o valor nominal.");
    texto("Formula: D = N * i * t");

    texto("Exemplo:");
    texto("N = 2000 | i = 3% | t = 4");
    texto("D = 240");
    texto("Valor atual = 1760");

    // =========================
    // 7. DESCONTO COMPOSTO
    // =========================
    doc.addPage(); y = 20;
    titulo("7. DESCONTO COMERCIAL COMPOSTO");

    texto("Desconto aplicado com capitalizacao.");
    texto("Formula: VA = N / (1 + i)^n");

    texto("Exemplo:");
    texto("N = 3000 | i = 2% | n = 6");
    texto("VA = 2665.60");

    // =========================
    // 8. VPL
    // =========================
    doc.addPage(); y = 20;
    titulo("8. VALOR PRESENTE LIQUIDO (VPL)");

    texto("Analisa a viabilidade de investimentos.");
    texto("Formula:");
    texto("VPL = soma dos fluxos descontados - investimento inicial");

    texto("Se VPL > 0: investimento viavel.");

    // =========================
    // 9. TIR
    // =========================
    doc.addPage(); y = 20;
    titulo("9. TAXA INTERNA DE RETORNO (TIR)");

    texto("Taxa que zera o VPL.");
    texto("Comparada com taxa minima de atratividade.");
    texto("Se TIR > TMA: investimento aceito.");

    // =========================
    // 10. APORTE PERIODICO
    // =========================
    doc.addPage(); y = 20;
    titulo("10. APORTE PERIODICO");

    texto("Depositos regulares para formar capital.");
    texto("Formula:");
    texto("FV = PMT * ((1 + i)^n - 1) / i");

    texto("Exemplo:");
    texto("PMT = 300 | i = 1% | n = 24");
    texto("FV = 8117.00");

    // =========================
    // 11. TABELA PRICE
    // =========================
    doc.addPage(); y = 20;
    titulo("11. TABELA PRICE");

    texto("Prestacoes fixas.");
    texto("Amortizacao crescente.");
    texto("Juros decrescentes.");

    // =========================
    // 12. SISTEMA SAC
    // =========================
    doc.addPage(); y = 20;
    titulo("12. SISTEMA SAC");

    texto("Amortizacao constante.");
    texto("Prestacoes decrescentes.");
    texto("Juros diminuem ao longo do tempo.");

    texto("Amortizacao = PV / n");

    // FINAL
    doc.addPage(); y = 20;
    titulo("CONCLUSAO");

    texto("Este caderno cobre os principais temas de matematica financeira.");
    texto("Pode ser usado para estudo, ensino e aplicacoes reais.");
    texto("SigmaCalc Pro - Projeto Educacional");

    doc.save("caderno_completo_sigmacalc.pdf");
});
