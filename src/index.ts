import { Router } from 'worktop';
import { start } from 'worktop/cfw';
import { read, write } from 'worktop/cfw.kv';
import { serve } from 'worktop/cfw.kv.assets';
import { reply } from 'worktop/response';

import type { KV } from 'worktop/cfw.kv';
import type { Context } from 'worktop';
import manifest from '__STATIC_CONTENT_MANIFEST'

interface Bindings extends Context {
  bindings: {
    DATA: KV.Namespace;
    '__STATIC_CONTENT': KV.Namespace;
  }
}

const counterKey = 'counter';
const API = new Router<Bindings>();

API.add('PUT', '/api/increase', async (req, context) => {
  const counter = await read<number>(context.bindings.DATA, counterKey)
  const newValue = counter !== null ? counter + 1 : 1;
  await write(context.bindings.DATA, counterKey, newValue);
  return reply(200, { counter: newValue });
});

API.add('PUT', '/api/decrease', async (req, context) => {
  const counter = await read<number>(context.bindings.DATA, counterKey)
  const newValue = (counter !== null && counter > 0) ? counter - 1 : 0;
  
  await write(context.bindings.DATA, counterKey, newValue);
  return reply(200, { counter: newValue });
});

API.add('GET', '/api/counter', async (req, context) => {
  const counter = await read<number>(context.bindings.DATA, counterKey);
  return reply(200, { counter: counter || 0 });
});

API.add('GET', '/*', async (req, context) => {  
  const fileMapping = JSON.parse(manifest);
  const file = context.params.wild ? fileMapping[context.params.wild] : fileMapping['index.html'];
  return serve(context.bindings['__STATIC_CONTENT'], file);
});

export default start(API.run);
