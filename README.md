# IMEC Metalurgica - Site Institucional

Site institucional premium para a IMEC Metalurgica, com frontend React, backend Node.js, banco MySQL e painel administrativo.

## O que inclui

- Frontend React + Vite
- Backend Node.js + Express
- Banco MySQL
- Login administrativo com JWT
- Upload de imagens
- Cadastro de paginas, servicos, produtos, fotos, videos e orcamentos
- Admin em `/admin`
- SEO basico com `robots.txt`, `sitemap.xml`, favicon e JSON-LD

## Rodar localmente

Instale tudo:

```bash
npm run install:all
```

Crie o banco:

```bash
mysql -u root -p < database/schema.sql
```

Copie os ambientes:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Crie o administrador:

```bash
npm --prefix backend run create-admin -- "Administrador" "admin@imec.com.br" "Admin@123"
```

Rode o projeto:

```bash
npm run dev
```

URLs locais:

- Site: `http://localhost:5173`
- Admin: `http://localhost:5173/admin`
- API: `http://localhost:3333/api/health`

## Deploy na Hostinger com Node.js

Use a raiz do repositorio como aplicacao Node.

Configuracao recomendada:

```txt
Repository: octaviano12-prog/imecsite
Build command: npm run build
Start command: npm start
Startup file / Application file: index.js
Public directory: public
```

Variaveis principais:

```txt
NODE_ENV=production
APP_URL=https://seudominio.com.br
DB_HOST=host-do-mysql
DB_PORT=3306
DB_USER=usuario-do-banco
DB_PASSWORD=senha-do-banco
DB_NAME=nome-do-banco
JWT_SECRET=troque-por-uma-chave-grande-e-segura
JWT_EXPIRES_IN=8h
UPLOAD_DIR=uploads
MAX_UPLOAD_MB=8
```

Banco MySQL:

1. Crie o banco no painel da Hostinger.
2. Importe `database/schema.sql` pelo phpMyAdmin.
3. Crie o admin pelo terminal/SSH, se disponivel:

```bash
npm --prefix backend run create-admin -- "Administrador" "seu-email@dominio.com" "sua-senha-segura"
```

## Se o admin abrir mas o login der 503

Esse erro significa que a pagina abriu, mas a API nao respondeu.

Confira nesta ordem:

1. Abra `https://seudominio.com.br/api/health`.
2. Se der 503, o aplicativo Node.js nao iniciou ou o banco MySQL esta indisponivel.
3. Confirme se o start command e `npm start`.
4. Confirme se o startup file e `index.js`.
5. Confirme as variaveis `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e `JWT_SECRET`.
6. Confirme se o banco recebeu `database/schema.sql`.
7. Depois de corrigir, reinicie a aplicacao Node na Hostinger.

O frontend usa `/api` automaticamente em producao. Em desenvolvimento, usa `http://localhost:3333/api`.

## Build

```bash
npm run build
```

O build gera `public/index.html` na raiz, junto com `.htaccess`, `favicon.svg`, `robots.txt` e `sitemap.xml`.

## Segurança

- Troque `JWT_SECRET` antes de publicar.
- Troque a senha inicial do administrador.
- Use HTTPS.
- Nao publique credenciais no repositorio.
