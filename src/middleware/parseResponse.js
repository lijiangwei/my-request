import { ResponseError, RequestError } from '../utils';

export default function parseResponseMiddleware(ctx, next) {
  return next()
    .then(() => {
      if (!ctx) return;
      const { res = {}, req = {} } = ctx;
      const { options: { getResponse = false } = {} } = req || {};
      if (!res) {
        return;
      }
      res.useCache = res.useCache || false;

      if (res.status >= 200 && res.status < 300) {
        // 提供源response, 以便自定义处理
        if (getResponse) {
          ctx.res = { data: res.data, response: res };
          return;
        }
        ctx.res = res.data;
        return;
      }
      throw new ResponseError(res, 'http error', res.data, req, 'HttpError');
    })
    .catch(e => {
      if (e instanceof RequestError || e instanceof ResponseError) {
        throw e;
      }
      // 对未知错误进行处理
      const { req, res } = ctx;
      e.request = e.request || req;
      e.response = e.response || res;
      e.type = e.type || e.name;
      e.data = e.data || undefined;
      throw e;
    });
}
