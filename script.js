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

/** Salva estado no localStorage */
function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lancamentos));
}

/** Carrega estado do localStorage (se existir) */
function carregar() {
  const força = localStorage.getItem(STORAGE_KEY);
  if (!força) return;
  try {
    const arr = JSON.parse(força);
    if (Array.isArray(arr)) lancamentos = arr;
  } catch {
    // Se der erro, começa vazio
    lancamentos = [];
  }
}

/** Recalcula média e situação e atualiza UI */
function atualizaResumo() {
  if (lancamentos.length === 0) {
    media.textContent = '0.00';
    situacao.textContent = '—';
    situacao.className = '';
    return;
  }

  const soma = lancamentos.reduce((acc, item) => acc + item.nota, 0);
  const media = soma / lancamentos.length;

  media.textContent = format2(media);

  // Situação
  let sit = '';
  let classe = '';
  if (media >= 7) { sit = 'Aprovado'; classe = 'ok-badge'; }
  else if (media >= 5) { sit = 'Recuperação'; classe = 'warn-badge'; }
  else { sit = 'Reprovado'; classe = 'err-badge'; }

  situacao.textContent = sit;
  situacao.className = classe;
}

/** Renderiza tabela a partir do estado */
function renderTabela() {
  // limpa tbody
  tabelaBody.innerHTML = '';

  if (lancamentos.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.textContent = 'Nenhuma nota lançada.';
    td.style.color = '#666';
    tr.appendChild(td);
    tabelaBody.appendChild(tr);
    atualizaResumo();
    return;
  }

  lancamentos.forEach((item) => {
    const tr = document.createElement('tr');

    const tdDisc = document.createElement('td');
    tdDisc.textContent = item.disciplina;

    const tdNota = document.createElement('td');
    tdNota.textContent = format2(item.nota);

    const tdAcoes = document.createElement('td');
    // Botão remover
    const btnRem = document.createElement('button');
    btnRem.className = 'acao';
    btnRem.type = 'button';
    btnRem.textContent = 'Remover';
    btnRem.addEventListener('click', () => {
      removerItem(item.id);
    });

    tdAcoes.appendChild(btnRem);

    tr.appendChild(tdDisc);
    tr.appendChild(tdNota);
    tr.appendChild(tdAcoes);

    tabelaBody.appendChild(tr);
  });

  atualizaResumo();
}

/** Adiciona novo lançamento (validação incluída) */
function adicionarLancamento(disciplina, notaStr) {
  const nome = (disciplina || '').trim();
  const nota = parseNota(notaStr);

  // validações
  if (!nome) {
    showMsg('Preencha a disciplina.', 'err');
    inputDisciplina.focus();
    return;
  }
  if (!Number.isFinite(nota)) {
    showMsg('Digite uma nota válida.', 'err');
    inputNota.focus();
    return;
  }
  if (nota < 0 || nota > 10) {
    showMsg('A nota deve estar entre 0 e 10.', 'err');
    inputNota.focus();
    return;
  }

  // adiciona ao estado
  lancamentos.push({
    id: util(),
    disciplina: nome,
    nota
  });

  salvar();
  renderTabela();
  showMsg('Disciplina adicionada!', 'ok');

  // limpa form
  form.reset();
  inputDisciplina.focus();
}

/** Remove item pelo id */
function removerItem(id) {
  const i = lancamentos.findIndex(it => it.id === id);
  if (i >= 0) {
    lancamentos.splice(i, 1);
    salvar();
    renderTabela();
    showMsg('Item removido.', 'ok');
  }
}

/** Limpa tudo (estado + storage) */
function limparTudo() {
  if (!confirm('Tem certeza que deseja limpar todos os lançamentos?')) return;
  lancamentos = [];
  localStorage.removeItem(STORAGE_KEY);
  renderTabela();
  showMsg('Todos os dados foram limpos.', 'ok');
}

// ---------- Eventos ----------
form.addEventListener('submit', (e) => {
  e.preventDefault();
  adicionarLancamento(inputDisciplina.value, inputNota.value);
});

btnLimpar.addEventListener('click', limparTudo);

// ---------- Inicialização ----------
carregar();
renderTabela();
inputDisciplina.focus();
