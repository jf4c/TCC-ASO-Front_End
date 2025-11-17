# Componente de Upload de Imagens

## 📌 Visão Geral

Componente reutilizável para upload de imagens com:
- ✅ Drag & Drop
- ✅ Preview em tempo real
- ✅ Barra de progresso
- ✅ Validações (tipo e tamanho)
- ✅ Aspect ratios configuráveis
- ✅ Botões para trocar/remover imagem

---

## 🎯 Uso Básico

### 1. Importar no componente

```typescript
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-create-world',
  standalone: true,
  imports: [ImageUploadComponent, ...],
  // ...
})
export class CreateWorldPage {
  worldImageUrl = signal<string | null>(null);

  onImageUploaded(url: string): void {
    this.worldImageUrl.set(url);
    console.log('Imagem carregada:', url);
  }

  onImageRemoved(): void {
    this.worldImageUrl.set(null);
    console.log('Imagem removida');
  }
}
```

### 2. Usar no template

```html
<aso-image-upload
  uploadType="world"
  label="Imagem do Mundo"
  aspectRatio="16:9"
  [currentImageUrl]="worldImageUrl()"
  (imageUploaded)="onImageUploaded($event)"
  (imageRemoved)="onImageRemoved()"
></aso-image-upload>
```

---

## 📚 API do Componente

### Inputs

| Input | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `uploadType` | `'world' \| 'campaign' \| 'character' \| 'avatar'` | `'world'` | Tipo de upload (define endpoint) |
| `currentImageUrl` | `string \| null` | `undefined` | URL da imagem atual (para edição) |
| `label` | `string` | `'Imagem'` | Label exibido acima do componente |
| `aspectRatio` | `'16:9' \| '1:1' \| '4:3'` | `'16:9'` | Proporção da área de preview |

### Outputs

| Output | Tipo | Descrição |
|--------|------|-----------|
| `imageUploaded` | `string` | Emite a URL da imagem após upload bem-sucedido |
| `imageRemoved` | `void` | Emite quando o usuário remove a imagem |

---

## 💡 Exemplos de Uso

### Mundo (16:9)
```html
<aso-image-upload
  uploadType="world"
  label="Imagem do Mundo"
  aspectRatio="16:9"
  (imageUploaded)="worldForm.patchValue({ imageUrl: $event })"
  (imageRemoved)="worldForm.patchValue({ imageUrl: null })"
></aso-image-upload>
```

### Campanha (16:9)
```html
<aso-image-upload
  uploadType="campaign"
  label="Capa da Campanha"
  aspectRatio="16:9"
  [currentImageUrl]="campaign()?.image"
  (imageUploaded)="onCampaignImageUploaded($event)"
  (imageRemoved)="onCampaignImageRemoved()"
></aso-image-upload>
```

### Personagem (1:1)
```html
<aso-image-upload
  uploadType="character"
  label="Avatar do Personagem"
  aspectRatio="1:1"
  (imageUploaded)="characterImageUrl.set($event)"
  (imageRemoved)="characterImageUrl.set(null)"
></aso-image-upload>
```

### Avatar de Usuário (1:1)
```html
<aso-image-upload
  uploadType="avatar"
  label="Foto de Perfil"
  aspectRatio="1:1"
  [currentImageUrl]="user()?.avatar"
  (imageUploaded)="updateUserAvatar($event)"
  (imageRemoved)="removeUserAvatar()"
></aso-image-upload>
```

---

## 🎨 Aspect Ratios

### 16:9 (Landscape)
- **Uso:** Mundos, Campanhas, Banners
- **Proporção:** Widescreen, ideal para imagens panorâmicas

### 1:1 (Quadrado)
- **Uso:** Avatares, Personagens, Perfis
- **Proporção:** Quadrada, ideal para fotos

### 4:3 (Standard)
- **Uso:** Imagens gerais, Cards
- **Proporção:** Clássica, versátil

---

## ⚙️ Validações Automáticas

### Tipos Aceitos
- ✅ `image/jpeg`
- ✅ `image/jpg`
- ✅ `image/png`
- ✅ `image/webp`
- ❌ Outros formatos são rejeitados

### Tamanho Máximo
- ✅ Até 5 MB
- ❌ Arquivos maiores são rejeitados

### Mensagens de Erro
```typescript
// Tipo inválido
"Tipo de arquivo inválido. Use JPG, PNG ou WebP."

// Tamanho excedido
"Arquivo muito grande. Tamanho máximo: 5MB."

// Erro de upload
"Erro ao fazer upload. Tente novamente."
```

---

## 🔄 Fluxo de Upload

```
1. Usuário seleciona/arrasta arquivo
   ↓
2. Validação local (tipo + tamanho)
   ↓
3. Preview local gerado (FileReader)
   ↓
4. Upload para backend (com progress)
   ↓
5. Backend salva e retorna URL
   ↓
6. Emite evento imageUploaded(url)
   ↓
7. Componente pai salva URL no formulário
```

---

## 📦 Serviço de Upload

O componente usa o `UploadService` que fornece:

```typescript
// Upload simples
uploadImage(file: File, type: UploadType): Observable<UploadResponse>

// Upload com progresso
uploadImageWithProgress(file: File, type: UploadType): Observable<UploadProgress>

// Validação local
validateImage(file: File): { valid: boolean; error?: string }

// Gerar URL completa
getImageUrl(relativePath: string): string | null

// Preview local
generatePreview(file: File): Observable<string>
```

---

## 🎨 Customização de Estilos

O componente usa CSS variables do tema:

```scss
// Cores principais
--primary-color
--surface-card
--surface-border
--surface-hover
--text-primary
--text-secondary
--text-white

// Você pode sobrescrever no componente pai:
::ng-deep .image-upload-container {
  .upload-area {
    border-color: #custom-color;
  }
}
```

---

## 🐛 Tratamento de Erros

### Erros Comuns

**1. Arquivo muito grande**
```
Mensagem: "Arquivo muito grande. Tamanho máximo: 5MB."
Solução: Usar ferramenta de compressão de imagem
```

**2. Tipo inválido**
```
Mensagem: "Tipo de arquivo inválido. Use JPG, PNG ou WebP."
Solução: Converter imagem para formato aceito
```

**3. Erro no backend**
```
Mensagem: "Erro ao fazer upload. Tente novamente."
Solução: Verificar conexão e logs do backend
```

---

## 📱 Responsividade

O componente se adapta automaticamente:

- **Desktop:** Área ampla com ícones grandes
- **Mobile:** Área compacta com ícones menores
- **Touch:** Drag & Drop funciona em dispositivos touch

---

## ♿ Acessibilidade

- ✅ Labels descritivos
- ✅ Cores com contraste adequado
- ✅ Feedback visual claro
- ✅ Suporte a teclado (via input file nativo)

---

## 🔍 Exemplo Completo

```typescript
// create-world.page.ts
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';

@Component({
  selector: 'app-create-world',
  standalone: true,
  imports: [ImageUploadComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="worldForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Nome do Mundo" />
      
      <aso-image-upload
        uploadType="world"
        label="Imagem do Mundo"
        aspectRatio="16:9"
        [currentImageUrl]="worldForm.get('imageUrl')?.value"
        (imageUploaded)="worldForm.patchValue({ imageUrl: $event })"
        (imageRemoved)="worldForm.patchValue({ imageUrl: null })"
      ></aso-image-upload>
      
      <button type="submit" [disabled]="worldForm.invalid">
        Criar Mundo
      </button>
    </form>
  `
})
export class CreateWorldPage {
  worldForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.worldForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      imageUrl: [null] // URL será preenchida pelo componente
    });
  }

  onSubmit(): void {
    if (this.worldForm.valid) {
      const worldData = this.worldForm.value;
      console.log('Criar mundo:', worldData);
      // worldData.imageUrl já contém a URL da imagem
    }
  }
}
```

---

## 🔗 Arquivos Relacionados

- **Serviço:** `src/app/shared/services/upload.service.ts`
- **Componente:** `src/app/shared/components/image-upload/`
- **Documentação Backend:** `Doc/backend/Image_Upload_Requirements.md`

---

## 📝 Notas Importantes

1. **Backend deve estar configurado** antes de usar o componente
2. **URLs são relativas** (ex: `/uploads/worlds/uuid.png`)
3. **Preview é instantâneo** (antes do upload terminar)
4. **Progresso é em tempo real** via HttpEventType
5. **Validações ocorrem no frontend E backend**

---

**Última atualização:** Novembro 2025  
**Versão:** 1.0
