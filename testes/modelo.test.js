const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro Respostas', () =>{
  modelo.cadastrar_pergunta('1 + 1 = ?');
  const perguntas = modelo.listar_perguntas();
  modelo.cadastrar_resposta(perguntas[0].id_pergunta,'2');
  const respostas = modelo.get_respostas(perguntas[0].id_pergunta);
  expect(respostas[0].texto).toBe('2');
  expect(respostas.length).toBe(modelo.get_num_respostas(perguntas[0].id_pergunta));
});

test('Testando perguntas e respostas', ()=> {
  modelo.cadastrar_pergunta('qual a resposta de tudo?');
  const pergunta = modelo.listar_perguntas();
  expect(pergunta[0].texto).toBe(modelo.get_pergunta(pergunta[0].id_pergunta).texto);
  modelo.cadastrar_resposta(pergunta[0].id_pergunta,'42');
  const resposta = modelo.get_respostas(pergunta[0].id_pergunta);
  expect(resposta[0].texto).toBe('42');
})

test