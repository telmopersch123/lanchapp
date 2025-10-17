export const isValidCpf = (cpf: string): boolean => {
  if (!cpf) return false;

  // Remove tudo que não for dígito
  const cleanCpf = cpf.replace(/\D/g, "");

  // Deve ter 11 dígitos
  if (cleanCpf.length !== 11) return false;

  // Rejeita CPFs com todos dígitos iguais
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

  // Função para calcular cada dígito verificador
  const calcCheckDigit = (cpfSlice: string, factorStart: number): number => {
    let sum = 0;
    for (let i = 0; i < cpfSlice.length; i++) {
      sum += Number(cpfSlice[i]) * (factorStart - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstCheck = calcCheckDigit(cleanCpf.slice(0, 9), 10);
  if (firstCheck !== Number(cleanCpf[9])) return false;

  const secondCheck = calcCheckDigit(cleanCpf.slice(0, 10), 11);
  if (secondCheck !== Number(cleanCpf[10])) return false;

  return true;
};
