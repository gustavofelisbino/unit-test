const DataUtils = require("../src/dataUtils");

describe("DataUtils", () => {
  let dataUtils;

  beforeEach(() => {
    dataUtils = new DataUtils();
  });

  describe("ehBissexto", () => {
    test("deve identificar um ano bissexto divisível por 4", () => {
      const resultado = dataUtils.ehBissexto(2024);

      expect(resultado).toBe(true);
    });

    test("deve identificar um ano não bissexto", () => {
      const resultado = dataUtils.ehBissexto(2023);

      expect(resultado).toBe(false);
    });

    test("deve tratar ano secular não divisível por 400 como não bissexto", () => {
      const resultado = dataUtils.ehBissexto(1900);

      expect(resultado).toBe(false);
    });

    test("deve tratar ano divisível por 400 como bissexto", () => {
      const resultado = dataUtils.ehBissexto(2000);

      expect(resultado).toBe(true);
    });

    test("deve lançar erro quando o ano não for inteiro", () => {
      expect(() => dataUtils.ehBissexto("2024")).toThrow(
        "O ano deve ser um número inteiro"
      );
    });
  });

  describe("diasNoMes", () => {
    test("deve retornar 31 dias para janeiro", () => {
      const resultado = dataUtils.diasNoMes(1, 2023);

      expect(resultado).toBe(31);
    });

    test("deve retornar 28 dias para fevereiro em ano comum", () => {
      const resultado = dataUtils.diasNoMes(2, 2023);

      expect(resultado).toBe(28);
    });

    test("deve retornar 29 dias para fevereiro em ano bissexto", () => {
      const resultado = dataUtils.diasNoMes(2, 2024);

      expect(resultado).toBe(29);
    });

    test("deve retornar 30 dias para abril", () => {
      const resultado = dataUtils.diasNoMes(4, 2023);

      expect(resultado).toBe(30);
    });

    test("deve lançar erro para mês fora do intervalo", () => {
      expect(() => dataUtils.diasNoMes(13, 2023)).toThrow(
        "O mês deve estar entre 1 e 12"
      );
      expect(() => dataUtils.diasNoMes(0, 2023)).toThrow(
        "O mês deve estar entre 1 e 12"
      );
    });

    test("deve lançar erro quando o mês não for inteiro", () => {
      expect(() => dataUtils.diasNoMes(1.5, 2023)).toThrow(
        "O mês deve ser um número inteiro"
      );
    });
  });

  describe("formatarBR", () => {
    test("deve formatar a data no padrão dd/mm/aaaa", () => {
      const data = new Date(2024, 0, 5);

      const resultado = dataUtils.formatarBR(data);

      expect(resultado).toBe("05/01/2024");
    });

    test("deve lançar erro quando a data for inválida", () => {
      expect(() => dataUtils.formatarBR(new Date("texto"))).toThrow(
        "Data inválida"
      );
    });

    test("deve lançar erro quando o argumento não for um Date", () => {
      expect(() => dataUtils.formatarBR("05/01/2024")).toThrow("Data inválida");
    });
  });

  describe("paraISO", () => {
    test("deve formatar a data no padrão aaaa-mm-dd", () => {
      const data = new Date(2024, 10, 9);

      const resultado = dataUtils.paraISO(data);

      expect(resultado).toBe("2024-11-09");
    });

    test("deve lançar erro quando a data for inválida", () => {
      expect(() => dataUtils.paraISO(null)).toThrow("Data inválida");
    });
  });

  describe("deStringBR", () => {
    test("deve converter uma string dd/mm/aaaa em Date", () => {
      const resultado = dataUtils.deStringBR("15/03/2024");

      expect(resultado.getDate()).toBe(15);
      expect(resultado.getMonth()).toBe(2);
      expect(resultado.getFullYear()).toBe(2024);
    });

    test("deve aceitar 29/02 em ano bissexto", () => {
      const resultado = dataUtils.deStringBR("29/02/2024");

      expect(resultado.getDate()).toBe(29);
    });

    test("deve lançar erro para formato inválido", () => {
      expect(() => dataUtils.deStringBR("2024-03-15")).toThrow(
        "Formato inválido, use dd/mm/aaaa"
      );
    });

    test("deve lançar erro quando o argumento não for string", () => {
      expect(() => dataUtils.deStringBR(15032024)).toThrow(
        "Formato inválido, use dd/mm/aaaa"
      );
    });

    test("deve lançar erro para data inexistente no calendário", () => {
      expect(() => dataUtils.deStringBR("31/02/2024")).toThrow(
        "Data inexistente no calendário"
      );
      expect(() => dataUtils.deStringBR("15/13/2024")).toThrow(
        "Data inexistente no calendário"
      );
      expect(() => dataUtils.deStringBR("00/01/2024")).toThrow(
        "Data inexistente no calendário"
      );
    });
  });

  describe("adicionarDias", () => {
    test("deve adicionar dias dentro do mesmo mês", () => {
      const data = new Date(2024, 0, 10);

      const resultado = dataUtils.adicionarDias(data, 5);

      expect(dataUtils.formatarBR(resultado)).toBe("15/01/2024");
    });

    test("deve virar o mês ao adicionar dias", () => {
      const data = new Date(2024, 0, 30);

      const resultado = dataUtils.adicionarDias(data, 3);

      expect(dataUtils.formatarBR(resultado)).toBe("02/02/2024");
    });

    test("não deve alterar a data original", () => {
      const data = new Date(2024, 0, 10);

      dataUtils.adicionarDias(data, 5);

      expect(dataUtils.formatarBR(data)).toBe("10/01/2024");
    });

    test("deve lançar erro quando a quantidade de dias não for inteira", () => {
      expect(() => dataUtils.adicionarDias(new Date(2024, 0, 10), 1.5)).toThrow(
        "A quantidade de dias deve ser um número inteiro"
      );
    });
  });

  describe("subtrairDias", () => {
    test("deve subtrair dias corretamente", () => {
      const data = new Date(2024, 2, 5);

      const resultado = dataUtils.subtrairDias(data, 10);

      expect(dataUtils.formatarBR(resultado)).toBe("24/02/2024");
    });

    test("deve lançar erro quando a quantidade de dias não for inteira", () => {
      expect(() => dataUtils.subtrairDias(new Date(2024, 2, 5), "10")).toThrow(
        "A quantidade de dias deve ser um número inteiro"
      );
    });
  });

  describe("diferencaEmDias", () => {
    test("deve calcular a diferença entre duas datas", () => {
      const inicio = new Date(2024, 0, 1);
      const fim = new Date(2024, 0, 31);

      const resultado = dataUtils.diferencaEmDias(inicio, fim);

      expect(resultado).toBe(30);
    });

    test("deve retornar valor negativo quando o fim for anterior ao início", () => {
      const inicio = new Date(2024, 0, 31);
      const fim = new Date(2024, 0, 1);

      const resultado = dataUtils.diferencaEmDias(inicio, fim);

      expect(resultado).toBe(-30);
    });

    test("deve retornar zero para a mesma data", () => {
      const data = new Date(2024, 0, 1);

      const resultado = dataUtils.diferencaEmDias(data, data);

      expect(resultado).toBe(0);
    });

    test("deve lançar erro quando alguma data for inválida", () => {
      expect(() =>
        dataUtils.diferencaEmDias(new Date(2024, 0, 1), undefined)
      ).toThrow("Data inválida");
    });
  });

  describe("ehFimDeSemana", () => {
    test("deve identificar sábado como fim de semana", () => {
      const resultado = dataUtils.ehFimDeSemana(new Date(2024, 0, 6));

      expect(resultado).toBe(true);
    });

    test("deve identificar domingo como fim de semana", () => {
      const resultado = dataUtils.ehFimDeSemana(new Date(2024, 0, 7));

      expect(resultado).toBe(true);
    });

    test("deve identificar segunda-feira como dia comum", () => {
      const resultado = dataUtils.ehFimDeSemana(new Date(2024, 0, 8));

      expect(resultado).toBe(false);
    });
  });

  describe("ehDiaUtil", () => {
    test("deve identificar quarta-feira como dia útil", () => {
      const resultado = dataUtils.ehDiaUtil(new Date(2024, 0, 10));

      expect(resultado).toBe(true);
    });

    test("deve identificar sábado como não útil", () => {
      const resultado = dataUtils.ehDiaUtil(new Date(2024, 0, 6));

      expect(resultado).toBe(false);
    });
  });

  describe("nomeDoDiaDaSemana", () => {
    test("deve retornar o nome do dia da semana", () => {
      const resultado = dataUtils.nomeDoDiaDaSemana(new Date(2024, 0, 8));

      expect(resultado).toBe("segunda-feira");
    });

    test("deve retornar domingo para o primeiro dia da semana", () => {
      const resultado = dataUtils.nomeDoDiaDaSemana(new Date(2024, 0, 7));

      expect(resultado).toBe("domingo");
    });

    test("deve lançar erro quando a data for inválida", () => {
      expect(() => dataUtils.nomeDoDiaDaSemana({})).toThrow("Data inválida");
    });
  });

  describe("nomeDoMes", () => {
    test("deve retornar o nome do mês", () => {
      const resultado = dataUtils.nomeDoMes(new Date(2024, 2, 15));

      expect(resultado).toBe("março");
    });

    test("deve retornar dezembro para o último mês", () => {
      const resultado = dataUtils.nomeDoMes(new Date(2024, 11, 25));

      expect(resultado).toBe("dezembro");
    });
  });

  describe("primeiroDiaDoMes", () => {
    test("deve retornar o dia 1 do mês da data informada", () => {
      const resultado = dataUtils.primeiroDiaDoMes(new Date(2024, 4, 22));

      expect(dataUtils.formatarBR(resultado)).toBe("01/05/2024");
    });

    test("deve lançar erro quando a data for inválida", () => {
      expect(() => dataUtils.primeiroDiaDoMes("hoje")).toThrow("Data inválida");
    });
  });

  describe("ultimoDiaDoMes", () => {
    test("deve retornar o último dia de um mês de 31 dias", () => {
      const resultado = dataUtils.ultimoDiaDoMes(new Date(2024, 0, 10));

      expect(dataUtils.formatarBR(resultado)).toBe("31/01/2024");
    });

    test("deve retornar 29 de fevereiro em ano bissexto", () => {
      const resultado = dataUtils.ultimoDiaDoMes(new Date(2024, 1, 10));

      expect(dataUtils.formatarBR(resultado)).toBe("29/02/2024");
    });

    test("deve retornar 28 de fevereiro em ano comum", () => {
      const resultado = dataUtils.ultimoDiaDoMes(new Date(2023, 1, 10));

      expect(dataUtils.formatarBR(resultado)).toBe("28/02/2023");
    });
  });

  describe("calcularIdade", () => {
    test("deve calcular a idade de quem já fez aniversário no ano", () => {
      const nascimento = new Date(1990, 0, 15);
      const referencia = new Date(2024, 5, 10);

      const resultado = dataUtils.calcularIdade(nascimento, referencia);

      expect(resultado).toBe(34);
    });

    test("deve descontar um ano de quem ainda não fez aniversário", () => {
      const nascimento = new Date(1990, 8, 20);
      const referencia = new Date(2024, 5, 10);

      const resultado = dataUtils.calcularIdade(nascimento, referencia);

      expect(resultado).toBe(33);
    });

    test("deve considerar o próprio dia do aniversário", () => {
      const nascimento = new Date(1990, 5, 10);
      const referencia = new Date(2024, 5, 10);

      const resultado = dataUtils.calcularIdade(nascimento, referencia);

      expect(resultado).toBe(34);
    });

    test("deve descontar um ano no mesmo mês antes do dia do aniversário", () => {
      const nascimento = new Date(1990, 5, 20);
      const referencia = new Date(2024, 5, 10);

      const resultado = dataUtils.calcularIdade(nascimento, referencia);

      expect(resultado).toBe(33);
    });

    test("deve lançar erro quando o nascimento for posterior à referência", () => {
      expect(() =>
        dataUtils.calcularIdade(new Date(2025, 0, 1), new Date(2024, 0, 1))
      ).toThrow("A data de nascimento não pode ser posterior à referência");
    });
  });

  describe("ehMesmoDia", () => {
    test("deve retornar true para datas no mesmo dia com horas diferentes", () => {
      const primeira = new Date(2024, 0, 10, 8, 30);
      const segunda = new Date(2024, 0, 10, 22, 45);

      const resultado = dataUtils.ehMesmoDia(primeira, segunda);

      expect(resultado).toBe(true);
    });

    test("deve retornar false para dias diferentes", () => {
      const primeira = new Date(2024, 0, 10);
      const segunda = new Date(2024, 0, 11);

      const resultado = dataUtils.ehMesmoDia(primeira, segunda);

      expect(resultado).toBe(false);
    });

    test("deve retornar false para o mesmo dia em anos diferentes", () => {
      const primeira = new Date(2023, 0, 10);
      const segunda = new Date(2024, 0, 10);

      const resultado = dataUtils.ehMesmoDia(primeira, segunda);

      expect(resultado).toBe(false);
    });
  });

  describe("estaEntre", () => {
    test("deve retornar true para data dentro do intervalo", () => {
      const resultado = dataUtils.estaEntre(
        new Date(2024, 0, 15),
        new Date(2024, 0, 1),
        new Date(2024, 0, 31)
      );

      expect(resultado).toBe(true);
    });

    test("deve incluir os limites do intervalo", () => {
      const inicio = new Date(2024, 0, 1);
      const fim = new Date(2024, 0, 31);

      expect(dataUtils.estaEntre(inicio, inicio, fim)).toBe(true);
      expect(dataUtils.estaEntre(fim, inicio, fim)).toBe(true);
    });

    test("deve retornar false para data fora do intervalo", () => {
      const resultado = dataUtils.estaEntre(
        new Date(2024, 1, 15),
        new Date(2024, 0, 1),
        new Date(2024, 0, 31)
      );

      expect(resultado).toBe(false);
    });

    test("deve lançar erro quando o início for posterior ao fim", () => {
      expect(() =>
        dataUtils.estaEntre(
          new Date(2024, 0, 15),
          new Date(2024, 0, 31),
          new Date(2024, 0, 1)
        )
      ).toThrow("A data inicial não pode ser posterior à final");
    });
  });

  describe("adicionarMeses", () => {
    test("deve adicionar meses mantendo o dia", () => {
      const resultado = dataUtils.adicionarMeses(new Date(2024, 0, 15), 2);

      expect(dataUtils.formatarBR(resultado)).toBe("15/03/2024");
    });

    test("deve ajustar o dia quando o mês destino for menor", () => {
      const resultado = dataUtils.adicionarMeses(new Date(2023, 0, 31), 1);

      expect(dataUtils.formatarBR(resultado)).toBe("28/02/2023");
    });

    test("deve virar o ano ao adicionar meses", () => {
      const resultado = dataUtils.adicionarMeses(new Date(2024, 10, 10), 3);

      expect(dataUtils.formatarBR(resultado)).toBe("10/02/2025");
    });

    test("deve aceitar quantidade negativa de meses", () => {
      const resultado = dataUtils.adicionarMeses(new Date(2024, 2, 10), -3);

      expect(dataUtils.formatarBR(resultado)).toBe("10/12/2023");
    });

    test("deve lançar erro quando a quantidade de meses não for inteira", () => {
      expect(() =>
        dataUtils.adicionarMeses(new Date(2024, 0, 15), "2")
      ).toThrow("A quantidade de meses deve ser um número inteiro");
    });
  });

  describe("proximoDiaUtil", () => {
    test("deve retornar o dia seguinte quando for dia útil", () => {
      const resultado = dataUtils.proximoDiaUtil(new Date(2024, 0, 9));

      expect(dataUtils.formatarBR(resultado)).toBe("10/01/2024");
    });

    test("deve pular o fim de semana quando a data for sexta-feira", () => {
      const resultado = dataUtils.proximoDiaUtil(new Date(2024, 0, 5));

      expect(dataUtils.formatarBR(resultado)).toBe("08/01/2024");
    });

    test("deve retornar segunda-feira quando a data for sábado", () => {
      const resultado = dataUtils.proximoDiaUtil(new Date(2024, 0, 6));

      expect(dataUtils.formatarBR(resultado)).toBe("08/01/2024");
    });

    test("deve lançar erro quando a data for inválida", () => {
      expect(() => dataUtils.proximoDiaUtil("segunda")).toThrow(
        "Data inválida"
      );
    });
  });

  describe("trimestre", () => {
    test("deve retornar o primeiro trimestre para janeiro", () => {
      const resultado = dataUtils.trimestre(new Date(2024, 0, 15));

      expect(resultado).toBe(1);
    });

    test("deve retornar o segundo trimestre para maio", () => {
      const resultado = dataUtils.trimestre(new Date(2024, 4, 15));

      expect(resultado).toBe(2);
    });

    test("deve retornar o terceiro trimestre para agosto", () => {
      const resultado = dataUtils.trimestre(new Date(2024, 7, 15));

      expect(resultado).toBe(3);
    });

    test("deve retornar o quarto trimestre para dezembro", () => {
      const resultado = dataUtils.trimestre(new Date(2024, 11, 15));

      expect(resultado).toBe(4);
    });
  });
});
