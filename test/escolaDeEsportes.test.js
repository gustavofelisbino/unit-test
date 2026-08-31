const EscolaDeEsportes = require("../src/escolaDeEsportes");

describe("EscolaDeEsportes", () => {
  let escola;

  beforeEach(() => {
    escola = new EscolaDeEsportes("Escola Vila Olímpica");
  });

  const criarModalidadesPadrao = () => {
    escola.criarModalidade("Natação", 2, 120);
    escola.criarModalidade("Futebol", 10, 100);
    escola.criarModalidade("Judô", 5, 80);
  };

  describe("constructor", () => {
    test("deve criar a escola com o nome informado", () => {
      expect(escola.nome).toBe("Escola Vila Olímpica");
    });

    test("deve remover espaços em volta do nome da escola", () => {
      const outra = new EscolaDeEsportes("  Escola Central  ");

      expect(outra.nome).toBe("Escola Central");
    });

    test("deve iniciar sem alunos e sem modalidades", () => {
      expect(escola.totalDeAlunos()).toBe(0);
      expect(escola.listarModalidades()).toEqual([]);
    });

    test("deve lançar erro quando o nome da escola for vazio", () => {
      expect(() => new EscolaDeEsportes("   ")).toThrow(
        "O nome da escola é obrigatório"
      );
    });

    test("deve lançar erro quando o nome da escola não for texto", () => {
      expect(() => new EscolaDeEsportes(42)).toThrow(TypeError);
    });
  });

  describe("cadastrarAluno", () => {
    test("deve cadastrar um aluno e devolver a matrícula", () => {
      const matricula = escola.cadastrarAluno("Ana Souza", 12);

      expect(matricula).toBe(1);
      expect(escola.totalDeAlunos()).toBe(1);
    });

    test("deve gerar matrículas sequenciais", () => {
      const primeira = escola.cadastrarAluno("Ana Souza", 12);
      const segunda = escola.cadastrarAluno("Bruno Lima", 15);

      expect(primeira).toBe(1);
      expect(segunda).toBe(2);
    });

    test("deve remover espaços em volta do nome do aluno", () => {
      const matricula = escola.cadastrarAluno("  Ana Souza  ", 12);

      expect(escola.buscarAluno(matricula).nome).toBe("Ana Souza");
    });

    test("deve lançar erro quando o nome do aluno for vazio", () => {
      expect(() => escola.cadastrarAluno("", 12)).toThrow(
        "O nome do aluno é obrigatório"
      );
    });

    test("deve lançar erro quando a idade não for inteira", () => {
      expect(() => escola.cadastrarAluno("Ana Souza", 12.5)).toThrow(
        "A idade deve ser um número inteiro"
      );
    });

    test("deve lançar erro quando a idade for menor que a mínima", () => {
      expect(() => escola.cadastrarAluno("Ana Souza", 3)).toThrow(
        "A idade deve estar entre 4 e 90 anos"
      );
    });

    test("deve lançar erro quando a idade for maior que a máxima", () => {
      expect(() => escola.cadastrarAluno("Ana Souza", 91)).toThrow(
        "A idade deve estar entre 4 e 90 anos"
      );
    });

    test("deve aceitar as idades nos limites permitidos", () => {
      expect(escola.cadastrarAluno("Aluno Novo", 4)).toBe(1);
      expect(escola.cadastrarAluno("Aluno Veterano", 90)).toBe(2);
    });
  });

  describe("buscarAluno", () => {
    test("deve devolver os dados do aluno cadastrado", () => {
      const matricula = escola.cadastrarAluno("Ana Souza", 12);

      expect(escola.buscarAluno(matricula)).toEqual({
        matricula: 1,
        nome: "Ana Souza",
        idade: 12,
      });
    });

    test("deve lançar erro quando a matrícula não existir", () => {
      expect(() => escola.buscarAluno(99)).toThrow("Aluno não encontrado");
    });

    test("deve lançar erro quando a matrícula não for inteira", () => {
      expect(() => escola.buscarAluno("1")).toThrow(
        "A matrícula deve ser um número inteiro"
      );
    });
  });

  describe("listarAlunos", () => {
    test("deve listar os alunos em ordem alfabética", () => {
      escola.cadastrarAluno("Carlos Dias", 20);
      escola.cadastrarAluno("Ana Souza", 12);
      escola.cadastrarAluno("Bruno Lima", 15);

      const nomes = escola.listarAlunos().map((aluno) => aluno.nome);

      expect(nomes).toEqual(["Ana Souza", "Bruno Lima", "Carlos Dias"]);
    });

    test("deve devolver uma lista vazia quando não houver alunos", () => {
      expect(escola.listarAlunos()).toEqual([]);
    });
  });

  describe("totalDeAlunos", () => {
    test("deve contar os alunos cadastrados", () => {
      escola.cadastrarAluno("Ana Souza", 12);
      escola.cadastrarAluno("Bruno Lima", 15);

      expect(escola.totalDeAlunos()).toBe(2);
    });
  });

  describe("atualizarIdade", () => {
    test("deve atualizar a idade do aluno", () => {
      const matricula = escola.cadastrarAluno("Ana Souza", 12);

      const atualizado = escola.atualizarIdade(matricula, 13);

      expect(atualizado.idade).toBe(13);
      expect(escola.buscarAluno(matricula).idade).toBe(13);
    });

    test("deve lançar erro quando a nova idade for inválida", () => {
      const matricula = escola.cadastrarAluno("Ana Souza", 12);

      expect(() => escola.atualizarIdade(matricula, 200)).toThrow(RangeError);
    });

    test("deve lançar erro quando o aluno não existir", () => {
      expect(() => escola.atualizarIdade(99, 13)).toThrow(
        "Aluno não encontrado"
      );
    });
  });

  describe("removerAluno", () => {
    test("deve remover o aluno da escola", () => {
      const matricula = escola.cadastrarAluno("Ana Souza", 12);

      expect(escola.removerAluno(matricula)).toBe(true);
      expect(escola.totalDeAlunos()).toBe(0);
    });

    test("deve liberar as vagas das modalidades do aluno removido", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);
      escola.matricular(matricula, "Natação");
      escola.matricular(matricula, "Judô");

      escola.removerAluno(matricula);

      expect(escola.vagasDisponiveis("Natação")).toBe(2);
      expect(escola.listarInscritos("Judô")).toEqual([]);
    });

    test("deve lançar erro quando o aluno não existir", () => {
      expect(() => escola.removerAluno(99)).toThrow("Aluno não encontrado");
    });
  });

  describe("criarModalidade", () => {
    test("deve criar uma modalidade com vagas e mensalidade", () => {
      const modalidade = escola.criarModalidade("Natação", 20, 120);

      expect(modalidade).toEqual({
        nome: "Natação",
        vagas: 20,
        mensalidade: 120,
        inscritos: 0,
      });
    });

    test("deve lançar erro quando o nome da modalidade for vazio", () => {
      expect(() => escola.criarModalidade("  ", 20, 120)).toThrow(
        "O nome da modalidade é obrigatório"
      );
    });

    test("deve lançar erro quando as vagas não forem inteiras", () => {
      expect(() => escola.criarModalidade("Natação", 20.5, 120)).toThrow(
        "As vagas devem ser um número inteiro"
      );
    });

    test("deve lançar erro quando as vagas não forem positivas", () => {
      expect(() => escola.criarModalidade("Natação", 0, 120)).toThrow(
        "A modalidade precisa de pelo menos uma vaga"
      );
    });

    test("deve lançar erro quando a mensalidade não for um número", () => {
      expect(() => escola.criarModalidade("Natação", 20, "120")).toThrow(
        "A mensalidade deve ser um número"
      );
    });

    test("deve lançar erro quando a mensalidade for negativa", () => {
      expect(() => escola.criarModalidade("Natação", 20, -1)).toThrow(
        "A mensalidade não pode ser negativa"
      );
    });

    test("deve lançar erro ao cadastrar a mesma modalidade duas vezes", () => {
      escola.criarModalidade("Natação", 20, 120);

      expect(() => escola.criarModalidade("Natação", 10, 100)).toThrow(
        "Modalidade já cadastrada"
      );
    });

    test("deve considerar nomes iguais ignorando maiúsculas e espaços", () => {
      escola.criarModalidade("Natação", 20, 120);

      expect(() => escola.criarModalidade("  NATAÇÃO  ", 10, 100)).toThrow(
        "Modalidade já cadastrada"
      );
    });
  });

  describe("listarModalidades", () => {
    test("deve listar as modalidades em ordem alfabética", () => {
      criarModalidadesPadrao();

      const nomes = escola.listarModalidades().map((m) => m.nome);

      expect(nomes).toEqual(["Futebol", "Judô", "Natação"]);
    });
  });

  describe("buscarModalidade", () => {
    test("deve encontrar a modalidade ignorando maiúsculas", () => {
      criarModalidadesPadrao();

      expect(escola.buscarModalidade("natação").mensalidade).toBe(120);
    });

    test("deve lançar erro quando a modalidade não existir", () => {
      expect(() => escola.buscarModalidade("Vôlei")).toThrow(
        "Modalidade não encontrada"
      );
    });

    test("deve lançar erro quando o nome da modalidade não for texto", () => {
      expect(() => escola.buscarModalidade(null)).toThrow(TypeError);
    });
  });

  describe("vagasDisponiveis", () => {
    test("deve devolver todas as vagas quando ninguém estiver matriculado", () => {
      criarModalidadesPadrao();

      expect(escola.vagasDisponiveis("Natação")).toBe(2);
    });

    test("deve descontar as vagas ocupadas", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);
      escola.matricular(matricula, "Natação");

      expect(escola.vagasDisponiveis("Natação")).toBe(1);
    });
  });

  describe("estaLotada", () => {
    test("deve indicar que a modalidade não está lotada", () => {
      criarModalidadesPadrao();

      expect(escola.estaLotada("Natação")).toBe(false);
    });

    test("deve indicar que a modalidade está lotada", () => {
      criarModalidadesPadrao();
      escola.matricular(escola.cadastrarAluno("Ana Souza", 12), "Natação");
      escola.matricular(escola.cadastrarAluno("Bruno Lima", 15), "Natação");

      expect(escola.estaLotada("Natação")).toBe(true);
    });
  });

  describe("matricular", () => {
    test("deve matricular o aluno na modalidade", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);

      expect(escola.matricular(matricula, "Natação")).toBe(true);
      expect(escola.estaMatriculado(matricula, "Natação")).toBe(true);
    });

    test("deve lançar erro ao matricular o aluno duas vezes na mesma modalidade", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);
      escola.matricular(matricula, "Natação");

      expect(() => escola.matricular(matricula, "Natação")).toThrow(
        "Aluno já matriculado nesta modalidade"
      );
    });

    test("deve lançar erro quando a modalidade estiver sem vagas", () => {
      criarModalidadesPadrao();
      escola.matricular(escola.cadastrarAluno("Ana Souza", 12), "Natação");
      escola.matricular(escola.cadastrarAluno("Bruno Lima", 15), "Natação");
      const excedente = escola.cadastrarAluno("Carlos Dias", 20);

      expect(() => escola.matricular(excedente, "Natação")).toThrow(
        "Modalidade sem vagas disponíveis"
      );
    });

    test("deve lançar erro quando o aluno não existir", () => {
      criarModalidadesPadrao();

      expect(() => escola.matricular(99, "Natação")).toThrow(
        "Aluno não encontrado"
      );
    });

    test("deve lançar erro quando a modalidade não existir", () => {
      const matricula = escola.cadastrarAluno("Ana Souza", 12);

      expect(() => escola.matricular(matricula, "Vôlei")).toThrow(
        "Modalidade não encontrada"
      );
    });
  });

  describe("cancelarMatricula", () => {
    test("deve cancelar a matrícula e liberar a vaga", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);
      escola.matricular(matricula, "Natação");

      expect(escola.cancelarMatricula(matricula, "Natação")).toBe(true);
      expect(escola.estaMatriculado(matricula, "Natação")).toBe(false);
      expect(escola.vagasDisponiveis("Natação")).toBe(2);
    });

    test("deve lançar erro quando o aluno não estiver matriculado", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);

      expect(() => escola.cancelarMatricula(matricula, "Natação")).toThrow(
        "Aluno não está matriculado nesta modalidade"
      );
    });
  });

  describe("estaMatriculado", () => {
    test("deve devolver false para aluno sem matrícula na modalidade", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);

      expect(escola.estaMatriculado(matricula, "Futebol")).toBe(false);
    });

    test("deve lançar erro quando o aluno não existir", () => {
      criarModalidadesPadrao();

      expect(() => escola.estaMatriculado(99, "Futebol")).toThrow(
        "Aluno não encontrado"
      );
    });
  });

  describe("listarInscritos", () => {
    test("deve listar os inscritos em ordem alfabética", () => {
      criarModalidadesPadrao();
      const carlos = escola.cadastrarAluno("Carlos Dias", 20);
      const ana = escola.cadastrarAluno("Ana Souza", 12);
      escola.matricular(carlos, "Futebol");
      escola.matricular(ana, "Futebol");

      const nomes = escola.listarInscritos("Futebol").map((a) => a.nome);

      expect(nomes).toEqual(["Ana Souza", "Carlos Dias"]);
    });

    test("deve devolver lista vazia quando a modalidade não tiver inscritos", () => {
      criarModalidadesPadrao();

      expect(escola.listarInscritos("Futebol")).toEqual([]);
    });
  });

  describe("modalidadesDoAluno", () => {
    test("deve listar as modalidades do aluno em ordem alfabética", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);
      escola.matricular(matricula, "Natação");
      escola.matricular(matricula, "Futebol");

      expect(escola.modalidadesDoAluno(matricula)).toEqual([
        "Futebol",
        "Natação",
      ]);
    });

    test("deve devolver lista vazia para aluno sem modalidades", () => {
      const matricula = escola.cadastrarAluno("Ana Souza", 12);

      expect(escola.modalidadesDoAluno(matricula)).toEqual([]);
    });
  });

  describe("calcularMensalidade", () => {
    test("deve devolver zero para aluno sem modalidades", () => {
      const matricula = escola.cadastrarAluno("Ana Souza", 12);

      expect(escola.calcularMensalidade(matricula)).toBe(0);
    });

    test("deve cobrar o valor cheio para uma única modalidade", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);
      escola.matricular(matricula, "Natação");

      expect(escola.calcularMensalidade(matricula)).toBe(120);
    });

    test("deve aplicar 10% de desconto a partir de duas modalidades", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);
      escola.matricular(matricula, "Natação");
      escola.matricular(matricula, "Futebol");

      expect(escola.calcularMensalidade(matricula)).toBe(198);
    });

    test("deve manter o desconto com três modalidades", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);
      escola.matricular(matricula, "Natação");
      escola.matricular(matricula, "Futebol");
      escola.matricular(matricula, "Judô");

      expect(escola.calcularMensalidade(matricula)).toBe(270);
    });

    test("deve voltar ao valor cheio após o cancelamento de uma modalidade", () => {
      criarModalidadesPadrao();
      const matricula = escola.cadastrarAluno("Ana Souza", 12);
      escola.matricular(matricula, "Natação");
      escola.matricular(matricula, "Futebol");
      escola.cancelarMatricula(matricula, "Futebol");

      expect(escola.calcularMensalidade(matricula)).toBe(120);
    });
  });

  describe("receitaMensal", () => {
    test("deve somar as mensalidades de todos os alunos", () => {
      criarModalidadesPadrao();
      const ana = escola.cadastrarAluno("Ana Souza", 12);
      const bruno = escola.cadastrarAluno("Bruno Lima", 15);
      escola.matricular(ana, "Natação");
      escola.matricular(ana, "Futebol");
      escola.matricular(bruno, "Judô");

      expect(escola.receitaMensal()).toBe(278);
    });

    test("deve devolver zero quando não houver alunos", () => {
      criarModalidadesPadrao();

      expect(escola.receitaMensal()).toBe(0);
    });
  });

  describe("modalidadeMaisPopular", () => {
    test("deve devolver a modalidade com mais inscritos", () => {
      criarModalidadesPadrao();
      const ana = escola.cadastrarAluno("Ana Souza", 12);
      const bruno = escola.cadastrarAluno("Bruno Lima", 15);
      escola.matricular(ana, "Futebol");
      escola.matricular(bruno, "Futebol");
      escola.matricular(ana, "Judô");

      expect(escola.modalidadeMaisPopular().nome).toBe("Futebol");
    });

    test("deve devolver a primeira cadastrada em caso de empate", () => {
      criarModalidadesPadrao();

      expect(escola.modalidadeMaisPopular().nome).toBe("Natação");
    });

    test("deve lançar erro quando não houver modalidades cadastradas", () => {
      expect(() => escola.modalidadeMaisPopular()).toThrow(
        "Nenhuma modalidade cadastrada"
      );
    });
  });

  describe("mediaDeIdade", () => {
    test("deve calcular a média de idade dos alunos", () => {
      escola.cadastrarAluno("Ana Souza", 12);
      escola.cadastrarAluno("Bruno Lima", 15);
      escola.cadastrarAluno("Carlos Dias", 21);

      expect(escola.mediaDeIdade()).toBe(16);
    });

    test("deve arredondar a média para uma casa decimal", () => {
      escola.cadastrarAluno("Ana Souza", 12);
      escola.cadastrarAluno("Bruno Lima", 15);

      expect(escola.mediaDeIdade()).toBe(13.5);
    });

    test("deve devolver zero quando não houver alunos", () => {
      expect(escola.mediaDeIdade()).toBe(0);
    });
  });
});
