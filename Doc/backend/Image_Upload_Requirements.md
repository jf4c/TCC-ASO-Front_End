# Requisitos de Upload de Imagens - Backend

## 📌 Visão Geral

Implementar sistema de upload e armazenamento de imagens para mundos, campanhas, personagens e avatares de usuário.

---

## 🎯 Endpoints Necessários

### 1. Upload de Imagem de Mundo
```
POST /api/uploads/world
```

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  ```
  image: File (campo do FormData)
  ```

**Response Success (200):**
```json
{
  "url": "/uploads/worlds/a1b2c3d4-e5f6-7890-abcd-ef1234567890.png",
  "filename": "a1b2c3d4-e5f6-7890-abcd-ef1234567890.png"
}
```

**Response Error (400):**
```json
{
  "error": "Tipo de arquivo inválido. Aceitos: jpg, jpeg, png, webp",
  "statusCode": 400
}
```

---

### 2. Upload de Imagem de Campanha
```
POST /api/uploads/campaign
```

**Request/Response:** Mesmo formato do endpoint de mundo, mas salva em `/uploads/campaigns/`

---

### 3. Upload de Imagem de Personagem
```
POST /api/uploads/character
```

**Request/Response:** Mesmo formato do endpoint de mundo, mas salva em `/uploads/characters/`

---

### 4. Upload de Avatar de Usuário
```
POST /api/uploads/avatar
```

**Request/Response:** Mesmo formato do endpoint de mundo, mas salva em `/uploads/avatars/`

---

## 📂 Servir Arquivos Estáticos

Os arquivos devem ser servidos estaticamente pelos seguintes caminhos:

```
GET /uploads/worlds/:filename
GET /uploads/campaigns/:filename
GET /uploads/characters/:filename
GET /uploads/avatars/:filename
```

**Response:**
- Content-Type: `image/jpeg` | `image/png` | `image/webp`
- Body: Arquivo binário da imagem

**Exemplo:**
```
GET /uploads/worlds/a1b2c3d4-e5f6-7890-abcd-ef1234567890.png
→ Retorna o arquivo PNG
```

---

## 📁 Estrutura de Pastas

O backend deve criar e gerenciar a seguinte estrutura:

```
backend/
└── uploads/
    ├── worlds/
    │   ├── uuid-1.png
    │   └── uuid-2.jpg
    ├── campaigns/
    │   ├── uuid-3.png
    │   └── uuid-4.jpg
    ├── characters/
    │   ├── uuid-5.png
    │   └── uuid-6.jpg
    └── avatars/
        ├── uuid-7.png
        └── uuid-8.jpg
```

---

## ✅ Validações Obrigatórias

### 1. Tipo de Arquivo
- **Aceitos:** `.jpg`, `.jpeg`, `.png`, `.webp`
- **Rejeitar:** Outros formatos (`.gif`, `.svg`, `.bmp`, `.exe`, etc.)
- **Validação:** Verificar extensão E Content-Type do arquivo

### 2. Tamanho do Arquivo
- **Máximo:** 5 MB por arquivo
- **Rejeitar:** Arquivos maiores que 5 MB
- **Response:** `{ "error": "Arquivo muito grande. Tamanho máximo: 5MB" }`

### 3. Nome do Arquivo
- **Formato:** `{UUID}.{extensão}`
- **Exemplo:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890.png`
- **Regra:** Gerar UUID único para cada upload
- **Manter:** Extensão original do arquivo

### 4. Segurança
- Remover/sanitizar caracteres especiais do nome original
- Validar que o arquivo é realmente uma imagem (verificar magic bytes)
- Rejeitar arquivos executáveis disfarçados

---

## 🐳 Persistência com Docker

Adicionar volume no `docker-compose.yml` para não perder imagens ao restartar o container:

```yaml
services:
  backend:
    image: seu-backend
    volumes:
      - ./uploads:/app/uploads
    ports:
      - "3000:3000"
```

**Importante:** A pasta `uploads/` deve ser persistida no host.

---

## 💾 Integração com Banco de Dados

Os modelos de dados devem ter campos para armazenar a URL da imagem:

### World (Mundo)
```typescript
{
  id: string
  name: string
  imageUrl?: string  // "/uploads/worlds/uuid.png" ou null
  // ... outros campos
}
```

### Campaign (Campanha)
```typescript
{
  id: string
  name: string
  image?: string  // "/uploads/campaigns/uuid.png" ou null
  // ... outros campos
}
```

### Character (Personagem)
```typescript
{
  id: string
  name: string
  image?: string  // "/uploads/characters/uuid.png" ou null
  // ... outros campos
}
```

### User (Usuário)
```typescript
{
  id: string
  username: string
  avatar?: string  // "/uploads/avatars/uuid.png" ou null
  // ... outros campos
}
```

---

## 🔒 Requisitos de Segurança

1. **Autenticação:** Todos os endpoints de upload devem exigir autenticação (token JWT)
2. **Autorização:** Validar que o usuário tem permissão para fazer upload
3. **Rate Limiting:** Limitar uploads por usuário (ex: máximo 10 uploads por minuto)
4. **Sanitização:** Validar e limpar dados de entrada
5. **Content-Type:** Validar que o Content-Type corresponde à extensão do arquivo

---

## 📝 Exemplo de Implementação (NestJS)

```typescript
// upload.controller.ts
import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('uploads')
export class UploadController {
  
  @Post('world')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/worlds',
      filename: (req, file, cb) => {
        const uuid = uuidv4();
        const ext = extname(file.originalname);
        cb(null, `${uuid}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Tipo de arquivo inválido'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    }
  }))
  uploadWorldImage(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `/uploads/worlds/${file.filename}`,
      filename: file.filename
    };
  }
  
  // Repetir para campaign, character, avatar...
}
```

```typescript
// main.ts - Servir arquivos estáticos
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Servir pasta uploads como estática
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  await app.listen(3000);
}
bootstrap();
```

---

## 🧪 Testes de Integração

### Teste 1: Upload Válido
```bash
curl -X POST http://localhost:3000/api/uploads/world \
  -H "Authorization: Bearer {token}" \
  -F "image=@mundo.png"

# Esperado: 200 OK
# { "url": "/uploads/worlds/uuid.png", "filename": "uuid.png" }
```

### Teste 2: Acessar Imagem
```bash
curl http://localhost:3000/uploads/worlds/uuid.png

# Esperado: 200 OK
# Content-Type: image/png
# Body: Binário da imagem
```

### Teste 3: Arquivo Inválido
```bash
curl -X POST http://localhost:3000/api/uploads/world \
  -H "Authorization: Bearer {token}" \
  -F "image=@script.exe"

# Esperado: 400 Bad Request
# { "error": "Tipo de arquivo inválido..." }
```

### Teste 4: Arquivo Muito Grande
```bash
curl -X POST http://localhost:3000/api/uploads/world \
  -H "Authorization: Bearer {token}" \
  -F "image=@imagem-10mb.png"

# Esperado: 400 Bad Request
# { "error": "Arquivo muito grande..." }
```

---

## 📊 Casos de Uso

### Frontend → Backend

**1. Usuário cria novo mundo e faz upload da imagem:**
```
1. Frontend: Usuário seleciona imagem (mundo.png)
2. Frontend: POST /api/uploads/world + FormData(image: mundo.png)
3. Backend: Salva em uploads/worlds/uuid-123.png
4. Backend: Retorna { url: "/uploads/worlds/uuid-123.png" }
5. Frontend: POST /api/worlds { name: "Arton", imageUrl: "/uploads/worlds/uuid-123.png" }
6. Backend: Salva mundo no banco com imageUrl
```

**2. Exibir imagem do mundo:**
```
1. Frontend: GET /api/worlds/123
2. Backend: Retorna { id: "123", name: "Arton", imageUrl: "/uploads/worlds/uuid-123.png" }
3. Frontend: <img src="http://localhost:3000/uploads/worlds/uuid-123.png">
4. Backend: Serve arquivo estático
```

---

## ⚠️ Observações Importantes

1. **Paths Relativos:** O backend deve retornar paths relativos (`/uploads/worlds/...`) e não URLs completas
2. **Base URL:** O frontend adiciona a base URL do ambiente (`http://localhost:3000` ou `https://api.prod.com`)
3. **Deletar Imagens:** Ao deletar um mundo/campanha/personagem, considerar deletar também a imagem física
4. **Backup:** As imagens devem ser incluídas no backup do sistema
5. **Migração:** Em produção futura, facilitar migração para S3/Cloud Storage

---

## ✨ Melhorias Futuras (Opcional)

- [ ] Redimensionamento automático de imagens (thumbnails)
- [ ] Conversão automática para WebP
- [ ] Compressão de imagens
- [ ] CDN para servir imagens
- [ ] Upload direto para S3/Cloud Storage
- [ ] Previsão de imagem antes do upload
- [ ] Crop/edição de imagem no frontend

---

## 📞 Contato

Para dúvidas ou esclarecimentos sobre a implementação, consultar o time de frontend.

---

**Data:** Novembro 2025  
**Versão:** 1.0  
**Projeto:** Artificial Story Oracle (TCC)
