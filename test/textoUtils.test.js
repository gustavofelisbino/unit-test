const TextoUtils = require("../src/textoUtils");

describe("texto utils", () => {
  test("deve inverter uma string", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    
    // Act
    const resultado = textoUtils.inverter("ola");
    
    // Assert
    expect(resultado).toBe("alo");
  });
});

describe("texto utils", () => {
  test("deve verificar se uma string é um palíndromo", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    
    // Act
    const resultado = textoUtils.ehPalindromo("ovo");
    
    // Assert
    expect(resultado).toBe(true);
  });
});

describe("texto utils", () => {
  test("deve capitalizar uma string", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    
    // Act
    const resultado = textoUtils.capitalizar("ola mundo");
    
    // Assert
    expect(resultado).toBe("Ola Mundo");
  });
});

describe("texto utils", () => {
  test("deve contar ocorrências de uma substring", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    
    // Act
    const resultado = textoUtils.contarOcorrencias("ola mundo", "o");
    
    // Assert
    expect(resultado).toBe(2);
  });
});

describe("texto utils", () => {
  test("deve remover espaços extras", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    
    // Act
    const resultado = textoUtils.removerEspacosExtras("  ola   mundo  ");
    
    // Assert
    expect(resultado).toBe("ola mundo");
  });
});

describe("texto utils", () => {
  test("deve converter uma string para slug", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    
    // Act
    const resultado = textoUtils.paraSlug("Olá Mundo!");
    
    // Assert
    expect(resultado).toBe("ola-mundo");
  });
});

describe("texto utils", () => {
  test("deve truncar uma string", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    
    // Act
    const resultado = textoUtils.truncar("ola mundo", 3);
    
    // Assert
    expect(resultado).toBe("ola...");
  });
});

describe("texto utils", () => {
  test("deve contar o número de palavras", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    
    // Act
    const resultado = textoUtils.contarPalavras("ola mundo");
    
    // Assert
    expect(resultado).toBe(2);
  });
});

describe("texto utils", () => {
  test("deve verificar se uma string contém apenas letras", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    
    // Act
    const resultado = textoUtils.somenteLetras("ola");
    
    // Assert
    expect(resultado).toBe(true);
  });
});

describe("texto utils", () => {
  test("deve trocar todas as ocorrências de uma substring por outra", () => {
    // Arrange
    const textoUtils = new TextoUtils();
    
    // Act
    const resultado = textoUtils.substituirTudo("ola mundo", "ola", "oi");
    
    // Assert
    expect(resultado).toBe("oi mundo");
  });
});


describe("texto utils", () => {
  test("deve verificar que uma frase com espaços é um palíndromo", () => {
    // Arrange
    const textoUtils = new TextoUtils();

    // Act
    const resultado = textoUtils.ehPalindromo("A base do teto desaba");

    // Assert
    expect(resultado).toBe(true);
  });
});

describe("texto utils", () => {
  test("deve verificar que uma string não é um palíndromo", () => {
    // Arrange
    const textoUtils = new TextoUtils();

    // Act
    const resultado = textoUtils.ehPalindromo("JavaScript");

    // Assert
    expect(resultado).toBe(false);
  });
});

describe("texto utils", () => {
  test("deve retornar o texto original quando menor que o tamanho do truncamento", () => {
    // Arrange
    const textoUtils = new TextoUtils();

    // Act
    const resultado = textoUtils.truncar("curto", 10);

    // Assert
    expect(resultado).toBe("curto");
  });
});

describe("texto utils", () => {
  test("deve lançar erro ao truncar com tamanho negativo", () => {
    // Arrange
    const textoUtils = new TextoUtils();

    // Act & Assert
    expect(() => textoUtils.truncar("abc", -1)).toThrow(
      "O tamanho não pode ser negativo"
    );
  });
});

describe("texto utils", () => {
  test("deve verificar que uma string com números não contém apenas letras", () => {
    // Arrange
    const textoUtils = new TextoUtils();

    // Act
    const resultado = textoUtils.somenteLetras("abc123");

    // Assert
    expect(resultado).toBe(false);
  });
});

describe("texto utils", () => {
  test("deve lançar erro ao substituir com alvo vazio", () => {
    // Arrange
    const textoUtils = new TextoUtils();

    // Act & Assert
    expect(() => textoUtils.substituirTudo("abc", "", "x")).toThrow(
      "O alvo não pode ser vazio"
    );
  });
});
