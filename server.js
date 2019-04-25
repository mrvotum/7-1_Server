const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
// const uuid = require('uuid');
const Router = require('koa-router');

const app = new Koa();

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});
app.use(koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
}));


const router = new Router();
const TicketFull = [];
const Ticket = [];
const TicketStatusUpdate = [];

router.get('/TicketFull', async (ctx, next) => {
    // return list of TicketFull
    // console.log(`TicketFull = ${TicketFull}`);
    ctx.response.body = TicketFull;
});

router.post('/TicketFull', async (ctx, next) => {
    // create new contact
    // console.log(`ctx.request.body = ${ctx.request.body}`);
    TicketFull.push({...ctx.request.body}); // , id: uuid.v4()});
    ctx.response.status = 204;
});

router.del('/TicketFull/:id', async (ctx, next) => {
    // remove contact by id
    const index = TicketFull.findIndex(({id}) => id === TicketFull[0]);
    if (index !== -1) {
        TicketFull.splice(index, 1);
    }
    ctx.response.status = 204;
});

// Ticket

router.get('/Ticket', async (ctx, next) => {
  // return list of TicketFull
  ctx.response.body = Ticket;
});

router.post('/Ticket', async (ctx, next) => {
  Ticket.push({
    id: ctx.request.body.id,
    name: ctx.request.body.name,
    status: ctx.request.body.status,
    created: ctx.request.body.created,
  });
  ctx.response.status = 204;
});

router.del('/Ticket/:id', async (ctx, next) => {
  // remove Ticket by id
  const index = Ticket.findIndex(({id}) => id === Ticket[0]);
  if (index !== -1) {
      Ticket.splice(index, 1);
  }
  ctx.response.status = 204;
});

// status

router.get('/TicketStatusUpdate', async (ctx, next) => {
  // return list of TicketFull
  ctx.response.body = TicketStatusUpdate;
});

router.post('/TicketStatusUpdate', async (ctx, next) => {
  TicketStatusUpdate.push({
    id: ctx.request.body.id,
    name: ctx.request.body.name,
    status: ctx.request.body.status,
    created: ctx.request.body.created,
  });
  ctx.response.status = 204;
});

router.del('/TicketStatusUpdate/:id', async (ctx, next) => {
  // remove contact by id
  const index = TicketStatusUpdate.findIndex(({id}) => id === TicketStatusUpdate[0]);
  if (index !== -1) {
      TicketStatusUpdate.splice(index, 1);
  }
  ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());
http.createServer(app.callback()).listen(process.env.PORT || 7075);