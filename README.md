# IMEC Metalúrgica - Site Institucional Premium

Site institucional premium para a IMEC Metalúrgica, com visual escuro, industrial, tecnológico e profissional.

## Inclui

- Frontend React + Vite
- Backend Node.js + Express
- Banco MySQL
- Autenticação JWT para painel administrativo
- Upload real de imagens
- Cadastro de serviços, portfólio, galeria e vídeos do YouTube
- Formulário de orçamento salvo no banco
- Painel admin responsivo em `/admin`

Não inclui portal do cliente, sistema de NR, ficha de EPI ou QR Code.

## Instalação Local

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

Rode localmente:

```bash
npm run dev
```

- Site: `http://localhost:5173`
- Admin: `http://localhost:5173/admin`
- API: `http://localhost:3333/api/health`

## Hostinger Node.js

Na implantação Node.js da Hostinger, use a raiz do repositório.

Configuração recomendada:

```txt
Repository: octaviano12-prog/imecsite
Build command: npm run build
Start command: npm start
Startup file / Application file: index.js
Public directory: public
```

O build do React agora gera `public/index.html` na raiz do repositório. Isso ajuda a evitar o erro 403 quando a Hostinger tenta abrir uma pasta sem arquivo inicial.

Se a Hostinger mostrar 403 depois de uma implantação concluída, confira:

1. `Startup file / Application file`: `index.js`
2. `Public directory`: `public`
3. Build command: `npm run build`
4. Start command: `npm start`
5. Se `/api/health` abrir, o Node iniciou corretamente.

O `postinstall` instala automaticamente as dependências do `backend` e do `frontend`. O backend serve o build do React gerado em `public/`.

Variáveis principais no painel da Hostinger:

```txt
NODE_ENV=production
APP_URL=https://seudominio.com.br
DB_HOST=seu-host-mysql
DB_PORT=3306
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
DB_NAME=seu-banco
JWT_SECRET=troque-por-uma-chave-grande-e-segura
JWT_EXPIRES_IN=8h
UPLOAD_DIR=uploads
MAX_UPLOAD_MB=8
```

Banco MySQL:

1. Crie o banco no painel da Hostinger.
2. Importe `database/schema.sql` pelo phpMyAdmin.
3. Depois da publicação, crie o admin pelo terminal/SSH se disponível:

```bash
npm --prefix backend run create-admin -- "Administrador" "seu-email@dominio.com" "sua-senha-segura"
```

Use HTTPS, troque `JWT_SECRET` e altere a senha inicial do administrador antes de publicar.
