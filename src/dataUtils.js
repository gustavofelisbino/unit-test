const DIAS_DA_SEMANA = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const MS_POR_DIA = 1000 * 60 * 60 * 24;

class DataUtils {
  #validarData(data) {
    if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
      throw new Error("Data inválida");
    }
  }

  #validarInteiro(valor, nome) {
    if (!Number.isInteger(valor)) {
      throw new Error(`${nome} deve ser um número inteiro`);
    }
  }

  #doisDigitos(numero) {
    return String(numero).padStart(2, "0");
  }

  ehBissexto(ano) {
    this.#validarInteiro(ano, "O ano");
    return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
  }

  diasNoMes(mes, ano) {
    this.#validarInteiro(mes, "O mês");
    if (mes < 1 || mes > 12) {
      throw new Error("O mês deve estar entre 1 e 12");
    }
    const dias = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (mes === 2 && this.ehBissexto(ano)) {
      return 29;
    }
    return dias[mes - 1];
  }

  formatarBR(data) {
    this.#validarData(data);
    const dia = this.#doisDigitos(data.getDate());
    const mes = this.#doisDigitos(data.getMonth() + 1);
    return `${dia}/${mes}/${data.getFullYear()}`;
  }

  paraISO(data) {
    this.#validarData(data);
    const mes = this.#doisDigitos(data.getMonth() + 1);
    const dia = this.#doisDigitos(data.getDate());
    return `${data.getFullYear()}-${mes}-${dia}`;
  }

  deStringBR(texto) {
    if (typeof texto !== "string" || !/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
      throw new Error("Formato inválido, use dd/mm/aaaa");
    }
    const [dia, mes, ano] = texto.split("/").map(Number);
    if (mes < 1 || mes > 12 || dia < 1 || dia > this.diasNoMes(mes, ano)) {
      throw new Error("Data inexistente no calendário");
    }
    return new Date(ano, mes - 1, dia);
  }

  adicionarDias(data, dias) {
    this.#validarData(data);
    this.#validarInteiro(dias, "A quantidade de dias");
    const nova = new Date(data.getTime());
    nova.setDate(nova.getDate() + dias);
    return nova;
  }

  subtrairDias(data, dias) {
    this.#validarInteiro(dias, "A quantidade de dias");
    return this.adicionarDias(data, -dias);
  }

  diferencaEmDias(inicio, fim) {
    this.#validarData(inicio);
    this.#validarData(fim);
    const a = Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
    const b = Date.UTC(fim.getFullYear(), fim.getMonth(), fim.getDate());
    return Math.round((b - a) / MS_POR_DIA);
  }

  ehFimDeSemana(data) {
    this.#validarData(data);
    const dia = data.getDay();
    return dia === 0 || dia === 6;
  }

  ehDiaUtil(data) {
    return !this.ehFimDeSemana(data);
  }

  nomeDoDiaDaSemana(data) {
    this.#validarData(data);
    return DIAS_DA_SEMANA[data.getDay()];
  }

  nomeDoMes(data) {
    this.#validarData(data);
    return MESES[data.getMonth()];
  }

  primeiroDiaDoMes(data) {
    this.#validarData(data);
    return new Date(data.getFullYear(), data.getMonth(), 1);
  }

  ultimoDiaDoMes(data) {
    this.#validarData(data);
    const ultimo = this.diasNoMes(data.getMonth() + 1, data.getFullYear());
    return new Date(data.getFullYear(), data.getMonth(), ultimo);
  }

  calcularIdade(nascimento, referencia) {
    this.#validarData(nascimento);
    this.#validarData(referencia);
    if (nascimento > referencia) {
      throw new Error("A data de nascimento não pode ser posterior à referência");
    }
    let idade = referencia.getFullYear() - nascimento.getFullYear();
    const jaFezAniversario =
      referencia.getMonth() > nascimento.getMonth() ||
      (referencia.getMonth() === nascimento.getMonth() &&
        referencia.getDate() >= nascimento.getDate());
    if (!jaFezAniversario) {
      idade -= 1;
    }
    return idade;
  }

  ehMesmoDia(primeira, segunda) {
    this.#validarData(primeira);
    this.#validarData(segunda);
    return (
      primeira.getFullYear() === segunda.getFullYear() &&
      primeira.getMonth() === segunda.getMonth() &&
      primeira.getDate() === segunda.getDate()
    );
  }

  estaEntre(data, inicio, fim) {
    this.#validarData(data);
    this.#validarData(inicio);
    this.#validarData(fim);
    if (inicio > fim) {
      throw new Error("A data inicial não pode ser posterior à final");
    }
    return data >= inicio && data <= fim;
  }

  adicionarMeses(data, meses) {
    this.#validarData(data);
    this.#validarInteiro(meses, "A quantidade de meses");
    const diaOriginal = data.getDate();
    const nova = new Date(data.getFullYear(), data.getMonth() + meses, 1);
    const maximo = this.diasNoMes(nova.getMonth() + 1, nova.getFullYear());
    nova.setDate(Math.min(diaOriginal, maximo));
    return nova;
  }

  proximoDiaUtil(data) {
    let proximo = this.adicionarDias(data, 1);
    while (this.ehFimDeSemana(proximo)) {
      proximo = this.adicionarDias(proximo, 1);
    }
    return proximo;
  }

  trimestre(data) {
    this.#validarData(data);
    return Math.floor(data.getMonth() / 3) + 1;
  }
}

module.exports = DataUtils;
