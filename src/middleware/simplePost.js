// 对请求参数做处理，实现 query 简化、 post 简化
export default function simplePostMiddleware(ctx, next) {
  if (!ctx) return next();
  const { req: { options = {} } = {} } = ctx;
  const { method = 'get' } = options;

  if (['post', 'put', 'delete'].indexOf(method.toLowerCase()) === -1) {
    return next();
  }

  const { requestType = 'json' } = options;
  if (requestType === 'json') {
    options.headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      ...options.headers,
    };
  } else if (requestType === 'form') {
    options.headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      ...options.headers,
    };
  }
  ctx.req.options = options;

  return next();
}
