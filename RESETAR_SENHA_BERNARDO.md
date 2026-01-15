# 🔐 Como Resetar Senha para bernardostrabelli@gmail.com

## Opção 1: Usando a Rota de Emergência (Recomendado)

### Via Postman/Insomnia:

1. **Método:** `POST`
2. **URL:** `https://groom-guru-platform-production.up.railway.app/api/emergency/reset-password`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (JSON):**
   ```json
   {
     "email": "bernardostrabelli@gmail.com",
     "novaSenha": "Bernardo123!@#",
     "tipo": "cliente"
   }
   ```
   > **Nota:** Se for dono, use `"tipo": "dono"`

5. **Resposta esperada:**
   ```json
   {
     "sucesso": true,
     "mensagem": "Senha resetada com sucesso!",
     "email": "bernardostrabelli@gmail.com",
     "tipo": "cliente",
     "novaSenha": "Bernardo123!@#"
   }
   ```

### Via cURL:

```bash
curl -X POST https://groom-guru-platform-production.up.railway.app/api/emergency/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bernardostrabelli@gmail.com",
    "novaSenha": "Bernardo123!@#",
    "tipo": "cliente"
  }'
```

## Opção 2: Usando o Script Local

```bash
cd backend
npx tsx scripts/resetar-senha-bernardo.ts
```

**Senha gerada:** `Bernardo123!@#`

## ⚠️ IMPORTANTE

- Guarde a senha em local seguro
- Você pode alterá-la após fazer login
- Esta rota de emergência deve ser removida após resolver o problema de email

