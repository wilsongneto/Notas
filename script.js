//Seletores principais
const form = document.getElementById('form-nota');
const inputDisciplina = document.getElementById('disciplina');
const inputNota = document.getElementById('nota');
const btnLimpar = document.getElementById('limpar');
const msg = document.getElementById('msg');

const tabelaBody = document.querySelector('#tabela tbody');
const media = document.getElementById('media');
const situacao = document.getElementById('situacao');

let lancamentos = [];

const STORAGE_KEY = 'dashboardNotasV1';

const util = () => Math.random().toString(36).slice(2, 9);

function showMsg(texto, tipo='ok', tempoMs = 2500) {
    msg.textContent = texto;
    msg.className = `msg${tipo}`;
    if (tempoMs > 0) {
        setTimeout(() => {
            msg.textContent = '';
            msg.className = 'msg';
        }, tempoMs);
    }
}

//ler input do campo nota
function parseNota(valor) {
    const n = Number(valor);
    return Number.isFinite(n) ? n : NaN;
}

//Formatar o número com duas casas decimais e ,
function format2(n) {
    return n.toFixed(2).replace('.',',');
}
