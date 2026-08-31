const IDADE_MINIMA = 4;
const IDADE_MAXIMA = 90;
const MODALIDADES_PARA_DESCONTO = 2;
const PERCENTUAL_DESCONTO = 0.1;

const ordenarPorNome = (a, b) => a.nome.localeCompare(b.nome, "pt-BR");

class EscolaDeEsportes {
  #alunos;
  #modalidades;
  #proximaMatricula;

  constructor(nome) {
    this.#validarTexto(nome, "O nome da escola é obrigatório");
    this.nome = nome.trim();
    this.#alunos = new Map();
    this.#modalidades = new Map();
    this.#proximaMatricula = 1;
  }

  #validarTexto(valor, mensagem) {
    if (typeof valor !== "string" || valor.trim() === "") {
      throw new TypeError(mensagem);
    }
  }

  #validarIdade(idade) {
    if (!Number.isInteger(idade)) {
      throw new TypeError("A idade deve ser um número inteiro");
    }
    if (idade < IDADE_MINIMA || idade > IDADE_MAXIMA) {
      throw new RangeError(
        `A idade deve estar entre ${IDADE_MINIMA} e ${IDADE_MAXIMA} anos`
      );
    }
  }

  #normalizar(texto) {
    return texto.trim().toLowerCase();
  }

  #obterAluno(matricula) {
    if (!Number.isInteger(matricula)) {
      throw new TypeError("A matrícula deve ser um número inteiro");
    }
    const aluno = this.#alunos.get(matricula);
    if (!aluno) {
      throw new Error("Aluno não encontrado");
    }
    return aluno;
  }

  #obterModalidade(nome) {
    this.#validarTexto(nome, "O nome da modalidade é obrigatório");
    const modalidade = this.#modalidades.get(this.#normalizar(nome));
    if (!modalidade) {
      throw new Error("Modalidade não encontrada");
    }
    return modalidade;
  }

  #resumoAluno(aluno) {
    return { matricula: aluno.matricula, nome: aluno.nome, idade: aluno.idade };
  }

  #resumoModalidade(modalidade) {
    return {
      nome: modalidade.nome,
      vagas: modalidade.vagas,
      mensalidade: modalidade.mensalidade,
      inscritos: modalidade.inscritos.size,
    };
  }

  cadastrarAluno(nome, idade) {
    this.#validarTexto(nome, "O nome do aluno é obrigatório");
    this.#validarIdade(idade);
    const matricula = this.#proximaMatricula;
    this.#alunos.set(matricula, {
      matricula,
      nome: nome.trim(),
      idade,
      modalidades: new Set(),
    });
    this.#proximaMatricula += 1;
    return matricula;
  }

  buscarAluno(matricula) {
    return this.#resumoAluno(this.#obterAluno(matricula));
  }

  listarAlunos() {
    return [...this.#alunos.values()]
      .map((aluno) => this.#resumoAluno(aluno))
      .sort(ordenarPorNome);
  }

  totalDeAlunos() {
    return this.#alunos.size;
  }

  atualizarIdade(matricula, novaIdade) {
    const aluno = this.#obterAluno(matricula);
    this.#validarIdade(novaIdade);
    aluno.idade = novaIdade;
    return this.#resumoAluno(aluno);
  }

  removerAluno(matricula) {
    const aluno = this.#obterAluno(matricula);
    aluno.modalidades.forEach((chave) => {
      this.#modalidades.get(chave).inscritos.delete(matricula);
    });
    this.#alunos.delete(matricula);
    return true;
  }

  criarModalidade(nome, vagas, mensalidade) {
    this.#validarTexto(nome, "O nome da modalidade é obrigatório");
    if (!Number.isInteger(vagas)) {
      throw new TypeError("As vagas devem ser um número inteiro");
    }
    if (vagas <= 0) {
      throw new RangeError("A modalidade precisa de pelo menos uma vaga");
    }
    if (!Number.isFinite(mensalidade)) {
      throw new TypeError("A mensalidade deve ser um número");
    }
    if (mensalidade < 0) {
      throw new RangeError("A mensalidade não pode ser negativa");
    }
    const chave = this.#normalizar(nome);
    if (this.#modalidades.has(chave)) {
      throw new Error("Modalidade já cadastrada");
    }
    const modalidade = {
      chave,
      nome: nome.trim(),
      vagas,
      mensalidade,
      inscritos: new Set(),
    };
    this.#modalidades.set(chave, modalidade);
    return this.#resumoModalidade(modalidade);
  }

  listarModalidades() {
    return [...this.#modalidades.values()]
      .map((modalidade) => this.#resumoModalidade(modalidade))
      .sort(ordenarPorNome);
  }

  buscarModalidade(nome) {
    return this.#resumoModalidade(this.#obterModalidade(nome));
  }

  vagasDisponiveis(nome) {
    const modalidade = this.#obterModalidade(nome);
    return modalidade.vagas - modalidade.inscritos.size;
  }

  estaLotada(nome) {
    return this.vagasDisponiveis(nome) === 0;
  }

  matricular(matricula, nomeModalidade) {
    const aluno = this.#obterAluno(matricula);
    const modalidade = this.#obterModalidade(nomeModalidade);
    if (modalidade.inscritos.has(matricula)) {
      throw new Error("Aluno já matriculado nesta modalidade");
    }
    if (modalidade.inscritos.size >= modalidade.vagas) {
      throw new Error("Modalidade sem vagas disponíveis");
    }
    modalidade.inscritos.add(matricula);
    aluno.modalidades.add(modalidade.chave);
    return true;
  }

  cancelarMatricula(matricula, nomeModalidade) {
    const aluno = this.#obterAluno(matricula);
    const modalidade = this.#obterModalidade(nomeModalidade);
    if (!modalidade.inscritos.has(matricula)) {
      throw new Error("Aluno não está matriculado nesta modalidade");
    }
    modalidade.inscritos.delete(matricula);
    aluno.modalidades.delete(modalidade.chave);
    return true;
  }

  estaMatriculado(matricula, nomeModalidade) {
    this.#obterAluno(matricula);
    return this.#obterModalidade(nomeModalidade).inscritos.has(matricula);
  }

  listarInscritos(nomeModalidade) {
    const modalidade = this.#obterModalidade(nomeModalidade);
    return [...modalidade.inscritos]
      .map((matricula) => this.#resumoAluno(this.#alunos.get(matricula)))
      .sort(ordenarPorNome);
  }

  modalidadesDoAluno(matricula) {
    const aluno = this.#obterAluno(matricula);
    return [...aluno.modalidades]
      .map((chave) => this.#modalidades.get(chave).nome)
      .sort((a, b) => a.localeCompare(b, "pt-BR"));
  }

  calcularMensalidade(matricula) {
    const aluno = this.#obterAluno(matricula);
    const total = [...aluno.modalidades].reduce(
      (soma, chave) => soma + this.#modalidades.get(chave).mensalidade,
      0
    );
    if (aluno.modalidades.size >= MODALIDADES_PARA_DESCONTO) {
      return Number((total * (1 - PERCENTUAL_DESCONTO)).toFixed(2));
    }
    return Number(total.toFixed(2));
  }

  receitaMensal() {
    const total = [...this.#alunos.keys()].reduce(
      (soma, matricula) => soma + this.calcularMensalidade(matricula),
      0
    );
    return Number(total.toFixed(2));
  }

  modalidadeMaisPopular() {
    const modalidades = [...this.#modalidades.values()];
    if (modalidades.length === 0) {
      throw new Error("Nenhuma modalidade cadastrada");
    }
    const campea = modalidades.reduce((maior, atual) =>
      atual.inscritos.size > maior.inscritos.size ? atual : maior
    );
    return this.#resumoModalidade(campea);
  }

  mediaDeIdade() {
    if (this.#alunos.size === 0) {
      return 0;
    }
    const soma = [...this.#alunos.values()].reduce(
      (total, aluno) => total + aluno.idade,
      0
    );
    return Number((soma / this.#alunos.size).toFixed(1));
  }
}

module.exports = EscolaDeEsportes;
