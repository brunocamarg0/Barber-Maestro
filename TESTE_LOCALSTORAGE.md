# 🧪 Teste de localStorage

## Execute no Console do Navegador (F12)

```javascript
// 1. Testar se localStorage funciona
console.log('=== TESTE 1: localStorage básico ===');
localStorage.setItem('teste', '123');
const teste = localStorage.getItem('teste');
console.log('Teste salvo:', teste);
console.log('Resultado:', teste === '123' ? '✅ Funciona' : '❌ Não funciona');

// 2. Verificar estado atual
console.log('\n=== TESTE 2: Estado atual do localStorage ===');
console.log('Token:', localStorage.getItem('token'));
console.log('UserType:', localStorage.getItem('userType'));
console.log('User:', localStorage.getItem('user'));
console.log('Barbearia:', localStorage.getItem('barbearia'));

// 3. Tentar salvar token manualmente
console.log('\n=== TESTE 3: Salvar token manualmente ===');
const tokenTeste = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QiLCJlbWFpbCI6InRlc3RlQGV4YW1wbGUuY29tIiwidGlwbyI6ImRvbm8iLCJiYXJiZWFyaWFJZCI6IjFkNTZjODk4LTE5ZTQtNDkyNC05Y2MzLWJhMjM4NzJhNDZjNyIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjo5OTk5OTk5OTk5fQ.teste';
localStorage.setItem('token', tokenTeste);
localStorage.setItem('userType', 'dono');
console.log('Token salvo:', localStorage.getItem('token'));
console.log('UserType salvo:', localStorage.getItem('userType'));

// 4. Verificar se foi salvo
console.log('\n=== TESTE 4: Verificação ===');
const tokenVerificado = localStorage.getItem('token');
const userTypeVerificado = localStorage.getItem('userType');
console.log('Token presente:', !!tokenVerificado);
console.log('UserType presente:', !!userTypeVerificado);
console.log('Resultado:', (tokenVerificado && userTypeVerificado) ? '✅ Salvo com sucesso' : '❌ Não foi salvo');

// 5. Limpar teste
console.log('\n=== TESTE 5: Limpar teste ===');
localStorage.removeItem('teste');
localStorage.removeItem('token');
localStorage.removeItem('userType');
console.log('Limpeza concluída');
```

## Resultado Esperado

Se o localStorage estiver funcionando:
- ✅ Teste 1 deve retornar "Funciona"
- ✅ Teste 3 deve salvar o token
- ✅ Teste 4 deve mostrar "Salvo com sucesso"

Se não funcionar:
- ❌ Pode ser problema com extensões do navegador
- ❌ Pode ser modo privado/incógnito
- ❌ Pode ser configuração do navegador

