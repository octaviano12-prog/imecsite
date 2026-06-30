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

## Instalação

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

## Hostinger

1. Crie um banco MySQL e importe `database/schema.sql`.
2. Publique o backend como aplicação Node.js.
3. Configure as variáveis de `backend/.env` no painel da Hostinger.
4. Rode `npm install` e `npm start` no backend.
5. No frontend, configure `VITE_API_URL` e `VITE_UPLOADS_URL` apontando para a API publicada.
6. Rode `npm --prefix frontend run build` e envie `frontend/dist` para a pasta pública do domínio.

Use HTTPS, troque `JWT_SECRET` e altere a senha inicial do administrador antes de publicar.
