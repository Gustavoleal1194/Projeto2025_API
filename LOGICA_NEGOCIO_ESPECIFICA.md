# 🧠 LÓGICA DE NEGÓCIO ESPECÍFICA - SISTEMA DE BIBLIOTECA

## 🎯 **VISÃO GERAL**

Este documento define toda a lógica de negócio específica necessária para implementar o front-end da biblioteca, incluindo cálculos, validações, regras de negócio e fluxos de dados.

---

## 🔐 **AUTENTICAÇÃO E AUTORIZAÇÃO**

### **1. Sistema de Roles e Permissões**
```typescript
enum UserRole {
  USUARIO = 'Usuario',
  FUNCIONARIO = 'Funcionario',
  ADMIN = 'Admin'
}

interface UserPermissions {
  canViewBooks: boolean;
  canBorrowBooks: boolean;
  canManageBooks: boolean;
  canManageUsers: boolean;
  canManageEmployees: boolean;
  canViewReports: boolean;
  canManageSystem: boolean;
}

const getPermissions = (role: UserRole): UserPermissions => {
  switch (role) {
    case UserRole.USUARIO:
      return {
        canViewBooks: true,
        canBorrowBooks: true,
        canManageBooks: false,
        canManageUsers: false,
        canManageEmployees: false,
        canViewReports: false,
        canManageSystem: false
      };
    case UserRole.FUNCIONARIO:
      return {
        canViewBooks: true,
        canBorrowBooks: true,
        canManageBooks: true,
        canManageUsers: true,
        canManageEmployees: false,
        canViewReports: true,
        canManageSystem: false
      };
    case UserRole.ADMIN:
      return {
        canViewBooks: true,
        canBorrowBooks: true,
        canManageBooks: true,
        canManageUsers: true,
        canManageEmployees: true,
        canViewReports: true,
        canManageSystem: true
      };
    default:
      return {
        canViewBooks: false,
        canBorrowBooks: false,
        canManageBooks: false,
        canManageUsers: false,
        canManageEmployees: false,
        canViewReports: false,
        canManageSystem: false
      };
  }
};
```

### **2. Gerenciamento de Token**
```typescript
class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_KEY = 'refresh_token';
  private static readonly USER_KEY = 'user_data';

  static setToken(token: string, expiration: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem('token_expiration', expiration);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static isTokenValid(): boolean {
    const token = this.getToken();
    const expiration = localStorage.getItem('token_expiration');
    
    if (!token || !expiration) return false;
    
    const now = new Date();
    const expDate = new Date(expiration);
    
    return now < expDate;
  }

  static clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('token_expiration');
    localStorage.removeItem(this.USER_KEY);
  }

  static setUser(user: UsuarioResponse): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): UsuarioResponse | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}
```

---

## 📚 **LÓGICA DE LIVROS E ACERVO**

### **1. Sistema de Busca Inteligente**
```typescript
import Fuse from 'fuse.js';

interface SearchOptions {
  termo: string;
  genero?: string;
  autor?: string;
  editora?: string;
  anoMin?: number;
  anoMax?: number;
  disponivel?: boolean;
  ordenarPor?: 'titulo' | 'autor' | 'ano' | 'genero';
  ordem?: 'asc' | 'desc';
}

class LivroSearchService {
  private fuse: Fuse<Livro>;

  constructor(livros: Livro[]) {
    this.fuse = new Fuse(livros, {
      keys: [
        { name: 'titulo', weight: 0.4 },
        { name: 'subtitulo', weight: 0.3 },
        { name: 'sinopse', weight: 0.2 },
        { name: 'genero', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true
    });
  }

  buscar(opcoes: SearchOptions): Livro[] {
    let resultados = this.fuse.search(opcoes.termo).map(result => result.item);

    // Aplicar filtros
    if (opcoes.genero) {
      resultados = resultados.filter(livro => 
        livro.genero.toLowerCase().includes(opcoes.genero!.toLowerCase())
      );
    }

    if (opcoes.autor) {
      resultados = resultados.filter(livro => 
        livro.nomeAutor?.toLowerCase().includes(opcoes.autor!.toLowerCase())
      );
    }

    if (opcoes.editora) {
      resultados = resultados.filter(livro => 
        livro.nomeEditora?.toLowerCase().includes(opcoes.editora!.toLowerCase())
      );
    }

    if (opcoes.anoMin) {
      resultados = resultados.filter(livro => livro.ano >= opcoes.anoMin!);
    }

    if (opcoes.anoMax) {
      resultados = resultados.filter(livro => livro.ano <= opcoes.anoMax!);
    }

    if (opcoes.disponivel !== undefined) {
      resultados = resultados.filter(livro => livro.ativo === opcoes.disponivel);
    }

    // Ordenar
    if (opcoes.ordenarPor) {
      resultados.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (opcoes.ordenarPor) {
          case 'titulo':
            aValue = a.titulo;
            bValue = b.titulo;
            break;
          case 'autor':
            aValue = a.nomeAutor || '';
            bValue = b.nomeAutor || '';
            break;
          case 'ano':
            aValue = a.ano;
            bValue = b.ano;
            break;
          case 'genero':
            aValue = a.genero;
            bValue = b.genero;
            break;
        }

        if (opcoes.ordem === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return resultados;
  }

  sugerir(termo: string, limite: number = 5): string[] {
    const resultados = this.fuse.search(termo);
    return resultados
      .slice(0, limite)
      .map(result => result.item.titulo);
  }
}
```

### **2. Sistema de Favoritos**
```typescript
class FavoritosService {
  private static readonly FAVORITOS_KEY = 'livros_favoritos';

  static adicionarFavorito(livroId: number): void {
    const favoritos = this.getFavoritos();
    if (!favoritos.includes(livroId)) {
      favoritos.push(livroId);
      localStorage.setItem(this.FAVORITOS_KEY, JSON.stringify(favoritos));
    }
  }

  static removerFavorito(livroId: number): void {
    const favoritos = this.getFavoritos();
    const index = favoritos.indexOf(livroId);
    if (index > -1) {
      favoritos.splice(index, 1);
      localStorage.setItem(this.FAVORITOS_KEY, JSON.stringify(favoritos));
    }
  }

  static getFavoritos(): number[] {
    const favoritos = localStorage.getItem(this.FAVORITOS_KEY);
    return favoritos ? JSON.parse(favoritos) : [];
  }

  static isFavorito(livroId: number): boolean {
    return this.getFavoritos().includes(livroId);
  }

  static toggleFavorito(livroId: number): boolean {
    if (this.isFavorito(livroId)) {
      this.removerFavorito(livroId);
      return false;
    } else {
      this.adicionarFavorito(livroId);
      return true;
    }
  }
}
```

---

## 📖 **LÓGICA DE EMPRÉSTIMOS**

### **1. Cálculo de Datas e Prazos**
```typescript
interface ConfiguracaoEmprestimo {
  tempoEmprestimo: number; // dias
  maxRenovacoes: number;
  multaPorDia: number;
  maxEmprestimos: number;
}

class EmprestimoCalculator {
  static calcularDataDevolucao(
    dataEmprestimo: Date, 
    configuracao: ConfiguracaoEmprestimo
  ): Date {
    const dataDevolucao = new Date(dataEmprestimo);
    dataDevolucao.setDate(dataDevolucao.getDate() + configuracao.tempoEmprestimo);
    return dataDevolucao;
  }

  static calcularMulta(
    dataPrevista: Date, 
    dataDevolucao: Date, 
    multaPorDia: number
  ): number {
    if (dataDevolucao <= dataPrevista) return 0;
    
    const diasAtraso = Math.ceil(
      (dataDevolucao.getTime() - dataPrevista.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return diasAtraso * multaPorDia;
  }

  static verificarDisponibilidade(
    exemplarId: number, 
    emprestimos: Emprestimo[]
  ): boolean {
    const emprestimoAtivo = emprestimos.find(
      emp => emp.idExemplar === exemplarId && emp.status === 'Emprestado'
    );
    return !emprestimoAtivo;
  }

  static podeRenovar(emprestimo: Emprestimo): boolean {
    return emprestimo.status === 'Emprestado' && 
           emprestimo.quantidadeRenovacoes < emprestimo.maxRenovacoes;
  }

  static calcularDiasRestantes(dataPrevista: Date): number {
    const agora = new Date();
    const diffTime = dataPrevista.getTime() - agora.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
```

### **2. Validações de Empréstimo**
```typescript
class EmprestimoValidator {
  static validarNovoEmprestimo(
    emprestimo: EmprestimoCreateRequest,
    usuario: UsuarioResponse,
    exemplar: Exemplar,
    emprestimosAtivos: Emprestimo[],
    configuracao: ConfiguracaoEmprestimo
  ): { valido: boolean; erro?: string } {
    
    // Verificar se exemplar está disponível
    if (!exemplar.disponivel) {
      return { valido: false, erro: 'Exemplar não está disponível' };
    }

    // Verificar se usuário não excedeu limite de empréstimos
    const emprestimosUsuario = emprestimosAtivos.filter(
      emp => emp.idUsuario === usuario.id
    );
    
    if (emprestimosUsuario.length >= configuracao.maxEmprestimos) {
      return { 
        valido: false, 
        erro: `Usuário já possui ${configuracao.maxEmprestimos} empréstimos ativos` 
      };
    }

    // Verificar se usuário não tem empréstimos em atraso
    const emprestimosAtrasados = emprestimosUsuario.filter(
      emp => emp.estaAtrasado
    );
    
    if (emprestimosAtrasados.length > 0) {
      return { 
        valido: false, 
        erro: 'Usuário possui empréstimos em atraso' 
      };
    }

    // Verificar se exemplar não está emprestado
    const exemplarEmprestado = emprestimosAtivos.find(
      emp => emp.idExemplar === emprestimo.idExemplar && emp.status === 'Emprestado'
    );
    
    if (exemplarEmprestado) {
      return { valido: false, erro: 'Exemplar já está emprestado' };
    }

    return { valido: true };
  }

  static validarRenovacao(
    emprestimo: Emprestimo,
    configuracao: ConfiguracaoEmprestimo
  ): { valido: boolean; erro?: string } {
    
    if (!this.podeRenovar(emprestimo)) {
      return { 
        valido: false, 
        erro: 'Empréstimo não pode ser renovado' 
      };
    }

    if (emprestimo.estaAtrasado) {
      return { 
        valido: false, 
        erro: 'Empréstimo em atraso não pode ser renovado' 
      };
    }

    return { valido: true };
  }
}
```

---

## 📊 **LÓGICA DE DASHBOARD E RELATÓRIOS**

### **1. Cálculos de Estatísticas**
```typescript
interface DashboardStats {
  totalLivros: number;
  totalUsuarios: number;
  totalEmprestimos: number;
  emprestimosAtivos: number;
  emprestimosAtrasados: number;
  livrosMaisEmprestados: Array<{ livro: Livro; quantidade: number }>;
  generosPopulares: Array<{ genero: string; quantidade: number }>;
  usuariosMaisAtivos: Array<{ usuario: UsuarioResponse; quantidade: number }>;
}

class DashboardCalculator {
  static calcularEstatisticas(
    livros: Livro[],
    usuarios: UsuarioResponse[],
    emprestimos: Emprestimo[]
  ): DashboardStats {
    const totalLivros = livros.length;
    const totalUsuarios = usuarios.length;
    const totalEmprestimos = emprestimos.length;
    const emprestimosAtivos = emprestimos.filter(emp => emp.status === 'Emprestado').length;
    const emprestimosAtrasados = emprestimos.filter(emp => emp.estaAtrasado).length;

    // Livros mais emprestados
    const livrosMaisEmprestados = this.calcularLivrosMaisEmprestados(livros, emprestimos);
    
    // Gêneros populares
    const generosPopulares = this.calcularGenerosPopulares(livros, emprestimos);
    
    // Usuários mais ativos
    const usuariosMaisAtivos = this.calcularUsuariosMaisAtivos(usuarios, emprestimos);

    return {
      totalLivros,
      totalUsuarios,
      totalEmprestimos,
      emprestimosAtivos,
      emprestimosAtrasados,
      livrosMaisEmprestados,
      generosPopulares,
      usuariosMaisAtivos
    };
  }

  private static calcularLivrosMaisEmprestados(
    livros: Livro[], 
    emprestimos: Emprestimo[]
  ): Array<{ livro: Livro; quantidade: number }> {
    const contagem = new Map<number, number>();
    
    emprestimos.forEach(emprestimo => {
      const livro = livros.find(l => l.id === emprestimo.idExemplar);
      if (livro) {
        contagem.set(livro.id, (contagem.get(livro.id) || 0) + 1);
      }
    });

    return Array.from(contagem.entries())
      .map(([livroId, quantidade]) => ({
        livro: livros.find(l => l.id === livroId)!,
        quantidade
      }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  }

  private static calcularGenerosPopulares(
    livros: Livro[], 
    emprestimos: Emprestimo[]
  ): Array<{ genero: string; quantidade: number }> {
    const contagem = new Map<string, number>();
    
    emprestimos.forEach(emprestimo => {
      const livro = livros.find(l => l.id === emprestimo.idExemplar);
      if (livro) {
        contagem.set(livro.genero, (contagem.get(livro.genero) || 0) + 1);
      }
    });

    return Array.from(contagem.entries())
      .map(([genero, quantidade]) => ({ genero, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  }

  private static calcularUsuariosMaisAtivos(
    usuarios: UsuarioResponse[], 
    emprestimos: Emprestimo[]
  ): Array<{ usuario: UsuarioResponse; quantidade: number }> {
    const contagem = new Map<number, number>();
    
    emprestimos.forEach(emprestimo => {
      contagem.set(emprestimo.idUsuario, (contagem.get(emprestimo.idUsuario) || 0) + 1);
    });

    return Array.from(contagem.entries())
      .map(([usuarioId, quantidade]) => ({
        usuario: usuarios.find(u => u.id === usuarioId)!,
        quantidade
      }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  }
}
```

### **2. Geração de Relatórios**
```typescript
interface RelatorioEmprestimos {
  periodo: { inicio: Date; fim: Date };
  totalEmprestimos: number;
  emprestimosPorDia: Array<{ data: string; quantidade: number }>;
  livrosMaisEmprestados: Array<{ livro: Livro; quantidade: number }>;
  usuariosMaisAtivos: Array<{ usuario: UsuarioResponse; quantidade: number }>;
  atrasos: number;
  multas: number;
}

class RelatorioGenerator {
  static gerarRelatorioEmprestimos(
    emprestimos: Emprestimo[],
    livros: Livro[],
    usuarios: UsuarioResponse[],
    periodo: { inicio: Date; fim: Date }
  ): RelatorioEmprestimos {
    const emprestimosPeriodo = emprestimos.filter(emp => {
      const dataEmprestimo = new Date(emp.dataEmprestimo);
      return dataEmprestimo >= periodo.inicio && dataEmprestimo <= periodo.fim;
    });

    const emprestimosPorDia = this.calcularEmprestimosPorDia(emprestimosPeriodo, periodo);
    const livrosMaisEmprestados = this.calcularLivrosMaisEmprestados(livros, emprestimosPeriodo);
    const usuariosMaisAtivos = this.calcularUsuariosMaisAtivos(usuarios, emprestimosPeriodo);
    
    const atrasos = emprestimosPeriodo.filter(emp => emp.estaAtrasado).length;
    const multas = emprestimosPeriodo.reduce((total, emp) => total + emp.multa, 0);

    return {
      periodo,
      totalEmprestimos: emprestimosPeriodo.length,
      emprestimosPorDia,
      livrosMaisEmprestados,
      usuariosMaisAtivos,
      atrasos,
      multas
    };
  }

  private static calcularEmprestimosPorDia(
    emprestimos: Emprestimo[],
    periodo: { inicio: Date; fim: Date }
  ): Array<{ data: string; quantidade: number }> {
    const contagem = new Map<string, number>();
    
    emprestimos.forEach(emprestimo => {
      const data = new Date(emprestimo.dataEmprestimo).toISOString().split('T')[0];
      contagem.set(data, (contagem.get(data) || 0) + 1);
    });

    // Preencher dias sem empréstimos
    const resultado: Array<{ data: string; quantidade: number }> = [];
    const inicio = new Date(periodo.inicio);
    const fim = new Date(periodo.fim);
    
    for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
      const dataStr = d.toISOString().split('T')[0];
      resultado.push({
        data: dataStr,
        quantidade: contagem.get(dataStr) || 0
      });
    }

    return resultado;
  }
}
```

---

## 🔔 **SISTEMA DE NOTIFICAÇÕES**

### **1. Gerenciamento de Notificações**
```typescript
interface Notificacao {
  id: string;
  tipo: 'info' | 'success' | 'warning' | 'error';
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  acao?: {
    texto: string;
    callback: () => void;
  };
}

class NotificationService {
  private static notifications: Notificacao[] = [];
  private static listeners: Array<(notifications: Notificacao[]) => void> = [];

  static adicionar(notificacao: Omit<Notificacao, 'id' | 'data' | 'lida'>): void {
    const novaNotificacao: Notificacao = {
      ...notificacao,
      id: crypto.randomUUID(),
      data: new Date(),
      lida: false
    };

    this.notifications.unshift(novaNotificacao);
    this.notifyListeners();
  }

  static marcarComoLida(id: string): void {
    const notificacao = this.notifications.find(n => n.id === id);
    if (notificacao) {
      notificacao.lida = true;
      this.notifyListeners();
    }
  }

  static remover(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  static getNotificacoes(): Notificacao[] {
    return [...this.notifications];
  }

  static getNotificacoesNaoLidas(): Notificacao[] {
    return this.notifications.filter(n => !n.lida);
  }

  static subscribe(listener: (notifications: Notificacao[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Métodos de conveniência
  static info(titulo: string, mensagem: string): void {
    this.adicionar({ tipo: 'info', titulo, mensagem });
  }

  static success(titulo: string, mensagem: string): void {
    this.adicionar({ tipo: 'success', titulo, mensagem });
  }

  static warning(titulo: string, mensagem: string): void {
    this.adicionar({ tipo: 'warning', titulo, mensagem });
  }

  static error(titulo: string, mensagem: string): void {
    this.adicionar({ tipo: 'error', titulo, mensagem });
  }
}
```

### **2. Notificações de Empréstimo**
```typescript
class EmprestimoNotificationService {
  static verificarEmprestimosProximosVencimento(
    emprestimos: Emprestimo[],
    diasAntecedencia: number = 3
  ): void {
    const hoje = new Date();
    const dataLimite = new Date();
    dataLimite.setDate(hoje.getDate() + diasAntecedencia);

    emprestimos
      .filter(emp => emp.status === 'Emprestado')
      .forEach(emprestimo => {
        const dataVencimento = new Date(emprestimo.dataPrevistaDevolucao);
        
        if (dataVencimento <= dataLimite && dataVencimento >= hoje) {
          const diasRestantes = EmprestimoCalculator.calcularDiasRestantes(dataVencimento);
          
          NotificationService.warning(
            'Empréstimo próximo do vencimento',
            `O livro "${emprestimo.tituloLivro}" vence em ${diasRestantes} dias`
          );
        }
      });
  }

  static verificarEmprestimosAtrasados(emprestimos: Emprestimo[]): void {
    emprestimos
      .filter(emp => emp.estaAtrasado)
      .forEach(emprestimo => {
        NotificationService.error(
          'Empréstimo em atraso',
          `O livro "${emprestimo.tituloLivro}" está ${emprestimo.diasAtraso} dias em atraso`
        );
      });
  }
}
```

---

## 🎯 **RESUMO DA LÓGICA DE NEGÓCIO**

### **Funcionalidades Implementadas:**
✅ **Sistema de Roles e Permissões** completo  
✅ **Gerenciamento de Token** com validação  
✅ **Busca Inteligente** com Fuse.js  
✅ **Sistema de Favoritos** persistente  
✅ **Cálculos de Empréstimo** (datas, multas, validações)  
✅ **Validações de Negócio** para empréstimos  
✅ **Cálculos de Dashboard** e estatísticas  
✅ **Geração de Relatórios** detalhados  
✅ **Sistema de Notificações** completo  
✅ **Notificações de Empréstimo** automáticas  

### **Regras de Negócio Implementadas:**
- ✅ Usuários só podem emprestar se não tiverem empréstimos em atraso
- ✅ Limite máximo de empréstimos por usuário
- ✅ Cálculo automático de multas por atraso
- ✅ Validação de disponibilidade de exemplares
- ✅ Sistema de renovação com limite
- ✅ Notificações automáticas de vencimento
- ✅ Controle de acesso baseado em roles
- ✅ Persistência de favoritos no localStorage

**Esta lógica de negócio é 100% implementacional e permite criar um sistema funcional e robusto!** 🚀
